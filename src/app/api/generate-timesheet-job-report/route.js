import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function POST(req) {
  const body = await req.json();
  const data = body.data;
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const fnDate = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}-${today.getFullYear()}`;
  const fnTime = `${String(today.getHours()).padStart(2, '0')}-${String(today.getMinutes()).padStart(2, '0')}`;
  const jobnum = body.data[0]?.job_number;

  // Fetch job information
  let jobInfo = {};
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/jobs/${jobnum}`);
    if (response.ok) {
      jobInfo = await response.json();
    } else {
      console.error(`Failed to fetch job info for job number ${jobnum}`);
    }
  } catch (error) {
    console.error(`Error fetching job info: ${error.message}`);
  }

  const jobDetails = jobInfo
    ? `${jobInfo[0].job_number || 'N/A'} - ${jobInfo[0].job_location || 'N/A'} - ${jobInfo[0].job_customer || 'N/A'} - ${jobInfo[0].job_address || 'N/A'}`
    : 'Job Information Unavailable';

  // Fetch timesheet information
  let timesheetInfo = [];
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/jobtimesheet/${jobnum}`);
    if (response.ok) {
      timesheetInfo = await response.json();
    } else {
      console.error(`Failed to fetch job timesheet for job ${jobnum}`);
    }
  } catch (error) {
    console.error(`Error fetching job timesheet info: ${error.message}`);
  }

  function timeDifferenceInDecimal(beginTime, endTime) {
    const [beginHours, beginMinutes, beginSeconds] = beginTime.split(':').map(Number);
    const [endHours, endMinutes, endSeconds] = endTime.split(':').map(Number);
    const beginTotalSeconds = beginHours * 3600 + beginMinutes * 60 + beginSeconds;
    const endTotalSeconds = endHours * 3600 + endMinutes * 60 + endSeconds;
    let differenceInSeconds = endTotalSeconds - beginTotalSeconds;
    if (differenceInSeconds < 0) differenceInSeconds += 24 * 3600;
    const differenceInHours = differenceInSeconds / 3600;
    return Math.round(differenceInHours * 4) / 4;
  }

  // Group by `employee_id`
  const groupedData = {};
  let grandTotalHours = 0;
  let grandTotalCost = 0;

  for (const item of timesheetInfo) {
    if (!groupedData[item.employee_id]) {
      groupedData[item.employee_id] = { rows: [], subtotalHours: 0, subtotalCost: 0 };
    }
    const hoursDecimal = timeDifferenceInDecimal(item.begin_time, item.end_time);
    const laborCost = hoursDecimal * (item.pay_rate || 0);
    item.hoursDecimal = hoursDecimal;
    item.laborCost = laborCost.toFixed(2);
    groupedData[item.employee_id].rows.push(item);
    groupedData[item.employee_id].subtotalHours += hoursDecimal;
    groupedData[item.employee_id].subtotalCost += laborCost;
    grandTotalHours += hoursDecimal;
    grandTotalCost += laborCost;
  }

  // Create PDF
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 8;
  const margin = 30;
  const columnWidths = [130, 150, 100, 100, 100, 100];
  let yPosition = 760;

  const drawText = (text, x, y, size = fontSize, page) => {
    page.drawText(String(text || 'N/A'), { x, y, size, font, color: rgb(0, 0, 0) });
  };

  const drawHeader = (page) => {
    let headerY = 760;
    drawText(`Artistic Doors and Windows Timesheet Report As Of ${formattedDate}`, 125, headerY, 14, page);
    headerY -= 20;
    drawText(`Job: ${jobDetails}`, margin, headerY, 12, page);
    headerY -= 20;
    return headerY;
  };

  let page = pdfDoc.addPage([700, 800]);
  yPosition = drawHeader(page);

  for (const [employee, details] of Object.entries(groupedData)) {
    let employeeInfo = {};
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/employees/${employee}`);
      if (response.ok) {
        employeeInfo = await response.json();
      } else {
        console.error(`Failed to fetch info for employee ${employee}`);
      }
    } catch (error) {
      console.error(`Error fetching employee info: ${error.message}`);
    }
    const empDetails = employeeInfo
      ? `${employeeInfo.data.first_name || ''} ${employeeInfo.data.nick_name || 'N/A'} ${employeeInfo.data.last_name || 'N/A'}`
      : 'Employee Information Unavailable';

    drawText(`Employee: ${empDetails || 'N/A'}`, margin, yPosition, fontSize, page);
    yPosition -= 15;

    const headers = ["Date Worked", "Description", "Hours (decimal)", "Labor Cost", "Added By", "Added Date"];
    let xPosition = margin;

    headers.forEach((header, index) => {
      drawText(header, xPosition, yPosition, fontSize, page);
      xPosition += columnWidths[index];
    });

    yPosition -= 15;

    details.rows.forEach((row) => {
      if (yPosition < 50) {
        page = pdfDoc.addPage([700, 800]);
        yPosition = drawHeader(page);
      }

      const values = [
        row.date_worked,
        row.job_code_description,
        row.hoursDecimal,
        `$${row.laborCost}`,
        row.added_by,
        row.added_date,
      ];

      xPosition = margin;
      values.forEach((value, index) => {
        drawText(value, xPosition, yPosition, fontSize, page);
        xPosition += columnWidths[index];
      });

      yPosition -= 15;
    });

    drawText(
      `Subtotals: ${details.subtotalHours.toFixed(2)} hours                             $${details.subtotalCost.toFixed(2)}`,
      margin + 240,
      yPosition,
      fontSize,
      page
    );
    yPosition -= 20;
  }

  drawText(
    `Grand Totals: ${grandTotalHours.toFixed(2)} hours                             $${grandTotalCost.toFixed(2)}`,
    margin + 240,
    yPosition,
    fontSize,
    page
  );

  const pdfBytes = await pdfDoc.save();

  const jobNumber = jobInfo[0]?.job_number || 'unknown';
  const customer = jobInfo[0]?.job_customer?.replace(/\s+/g, '_') || 'unknown';
  const filename = `${customer}_${jobNumber}_timesheet_${fnDate}_${fnTime}.pdf`;

  return new Response(JSON.stringify({ filename, pdf: Buffer.from(pdfBytes).toString('base64') }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
