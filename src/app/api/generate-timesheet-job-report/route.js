import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function POST(req) {
  const body = await req.json();
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const fnDate = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}-${today.getFullYear()}`;
  const fnTime = `${String(today.getHours()).padStart(2, '0')}-${String(today.getMinutes()).padStart(2, '0')}`;
  const jobnum = body.data[0]?.job_number;

  // Fetch job information from /api/jobs/[id]
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

  // Fetch job information from /api/jobs/[id]
  let timesheetInfo = {};
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/jobtimesheet/${jobnum}`);
    if (response.ok) {
      timesheetInfo = await response.json();
    } else {
      console.error(`Failed to fetch job info for job ${jobnum} timesheet`);
    }
  } catch (error) {
    console.error(`Error fetching job info: ${error.message}`);
  }
  //console.log(timesheetInfo)

  // Group by `wood_type`
  const groupedData = {};
  let grandTotalHours = 0;
  let grandTotalCost = 0;

  timesheetInfo.forEach((item) => {
    if (!groupedData[item.employee_id]) {
      groupedData[item.employee_id] = { rows: [], subtotalHours: 0, subtotalCost: 0 };
    }
    groupedData[item.employee_id].rows.push(item);
    groupedData[item.employee_id].subtotalHours += item.hours || 0; // Handle null total_cost
    groupedData[item.employee_id].subtotalCost += item.pay_rate || 0; // Handle null TBF
    grandTotalHours += item.hours || 0; // Handle null total_cost
    grandTotalCost += item.pay_rate || 0; // Handle null TBF
  });

  // Create PDF
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([700, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 8;
  const margin = 20;
  const columnWidths = [80, 50, 50, 50, 50, 100, 50, 50, 50, 50, 100];
  let yPosition = 760;

  const drawText = (text, x, y, size = fontSize) => {
    page.drawText(String(text || 'N/A'), { x, y, size, font, color: rgb(0, 0, 0) });
  };

  // Title
  drawText(`Artistic Doors and Windows Timesheet Report As Of ${formattedDate}`, 125, yPosition, 14);
  yPosition -= 20;

  // Job Info
  drawText(`Job: ${jobDetails}`, margin, yPosition, 12);
  yPosition -= 20;

  // Generate table
  for (const [employee, details] of Object.entries(groupedData)) {
    //console.log(employee)
    drawText(`Employee: ${employee || 'N/A'}`, margin, yPosition);
    yPosition -= 15;

    // Table headers
    const headers = [
      "Date Worked",
      "Description",
      "Hours",
      "Labor",
      "Added By",
      "Added Date",
    ];
    let xPosition = margin;

    headers.forEach((header, index) => {
      drawText(header, xPosition, yPosition);
      xPosition += columnWidths[index];
    });

    yPosition -= 15;
    
    details.rows.forEach((row) => {
      const values = [
        row.date_worked,
        row.job_code,
        row.hours,
        row.pay_rate,
        row.added_by,
        row.added_date,
      ];

      xPosition = margin;

      values.forEach((value, index) => {
        drawText(value, xPosition, yPosition);
        xPosition += columnWidths[index];
      });

      yPosition -= 15;

      if (yPosition < 50) {
        page = pdfDoc.addPage([700, 800]);
        yPosition = 760;
      }
    });

    // Subtotals for the wood type
    drawText(
      `Subtotals: ${details.subtotalHours.toFixed(2)}      $${details.subtotalCost.toFixed(2)}`,
      margin + 390,
      yPosition
    );
    yPosition -= 20;
  }

  // Grand totals
  drawText(
    `Grand Totals: ${grandTotalHours.toFixed(2)}      $${grandTotalCost.toFixed(2)}`,
    margin + 390,
    yPosition
  );

  const pdfBytes = await pdfDoc.save();

  // Set the filename dynamically
  const jobNumber = jobInfo[0]?.job_number || 'unknown';
  const customer = jobInfo[0]?.job_customer?.replace(/\s+/g, '_') || 'unknown';
  const filename = `${customer}_${jobNumber}_timesheet_${fnDate}_${fnTime}.pdf`;
  console.log(jobNumber)
  console.log(customer)
  console.log(filename)
  return new Response(JSON.stringify({ filename, pdf: Buffer.from(pdfBytes).toString('base64') }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
