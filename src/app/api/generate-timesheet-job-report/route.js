import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function POST(req) {
  //console.log(req)
  const body = await req.json();
  const jn = body.jn;
  const data = body.data;
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const fnDate = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}-${today.getFullYear()}`;
  const fnTime = `${String(today.getHours()).padStart(2, '0')}-${String(
    today.getMinutes()
  ).padStart(2, '0')}`;

  // Fetch job information
  let jobInfo = {};
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/jobs/${jn}`
    );
    //console.log(response)
    if (response.ok) {
      jobInfo = await response.json();
    } else {
      console.error(`Failed to fetch job info for job number ${jn}`);
    }
  } catch (error) {
    console.error(`Error fetching job info: ${error.message}`);
  }

  //console.log(jobInfo)

  const jobDetails = jobInfo
    ? `${jobInfo[0].job_number || ' '} - ${jobInfo[0].job_location || ' '} - ${jobInfo[0].job_customer || ' '} - ${jobInfo[0].job_address || ' '}`
    : 'Job Information Unavailable';

  // Fetch timesheet information
  let timesheetInfo = [];
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/jobtimesheet/${jn}`
    );
    if (response.ok) {
      timesheetInfo = await response.json();
    } else {
      console.error(`Failed to fetch job timesheet for job ${jn}`);
    }
  } catch (error) {
    console.error(`Error fetching job timesheet info: ${error.message}`);
  }

  // Updated function: Parse ISO strings for begin and end times and calculate the difference in decimal hours.
  function timeDifferenceInDecimal(beginTime, endTime) {
    const beginDate = new Date(beginTime);
    const endDate = new Date(endTime);
    let differenceInSeconds = (endDate.getTime() - beginDate.getTime()) / 1000;
    if (differenceInSeconds < 0) {
      // If negative, assume the times span midnight and add 24 hours.
      differenceInSeconds += 24 * 3600;
    }
    const differenceInHours = differenceInSeconds / 3600;
    // Rounding to the nearest quarter hour
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

  // Helper function: Format a number with commas and exactly two decimal places.
  function formatNumberField(value) {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num);
    }
    return value;
  }

  // Create PDF
  const pdfDoc = await PDFDocument.create();
  // Embed both the regular and bold fonts.
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 12;
  const margin = 30;
  // Define column widths for our table.
  // Columns: "Date Worked", "Description", "Hours (decimal)", "Labor Cost", "Added By", "Added Date"
  const columnWidths = [100, 180, 100, 100, 100, 100];
  let yPosition = 760;
  const cellPadding = 5;

  // Helper function to draw left-aligned text with padding.
  const drawText = (text, x, y, size = fontSize, page, fontUsed = font) => {
    page.drawText(String(text || ''), {
      x: x + cellPadding,
      y,
      size,
      font: fontUsed,
      color: rgb(0, 0, 0),
    });
  };

  // Helper function to draw right-aligned text within a specified column width.
  const drawRightAlignedText = (text, startX, y, columnWidth, size = fontSize, page, fontUsed = font) => {
    const textStr = String(text || '');
    const textWidth = fontUsed.widthOfTextAtSize(textStr, size);
    // Calculate x so that the text ends at (startX + columnWidth - cellPadding)
    const x = startX + columnWidth - textWidth - cellPadding;
    page.drawText(textStr, { x, y, size, font: fontUsed, color: rgb(0, 0, 0) });
  };

  // Helper: Draw header for the PDF using the bold font.
  const drawHeader = (page) => {
    let headerY = 760;
    drawText(
      `Artistic Doors and Windows Timesheet Report As Of ${formattedDate}`,
      125,
      headerY,
      14,
      page,
      boldFont
    );
    headerY -= 20;
    drawText(`Job: ${jobDetails}`, margin, headerY, 12, page, boldFont);
    headerY -= 20;
    return headerY;
  };

  // Define column starting positions based on the column widths.
  const col0Start = margin; // "Date Worked"
  const col1Start = col0Start + columnWidths[0]; // "Description"
  const col2Start = col1Start + columnWidths[1]; // "Hours (decimal)"
  const col3Start = col2Start + columnWidths[2]; // "Labor Cost"
  const col4Start = col3Start + columnWidths[3]; // "Added By"
  const col5Start = col4Start + columnWidths[4]; // "Added Date"

  // Define a new x-coordinate for the "Subtotals:" label.
  const subtotalLabelX = margin + 265; // Adjust as needed.
  const grandtotalLabelX = margin + 245; // Adjust as needed.

  let page = pdfDoc.addPage([700, 800]);
  yPosition = drawHeader(page);

  // Threshold to ensure an employee header doesn't start too low on the page.
  const employeeHeaderThreshold = 100;

  // For each employee group...
  for (const [employee, details] of Object.entries(groupedData)) {
    // If there isn't enough vertical space for the employee header, create a new page.
    if (yPosition < employeeHeaderThreshold) {
      page = pdfDoc.addPage([700, 800]);
      yPosition = drawHeader(page);
    }

    let employeeInfo = {};
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/employees/${employee}`
      );
      if (response.ok) {
        employeeInfo = await response.json();
      } else {
        console.error(`Failed to fetch info for employee ${employee}`);
      }
    } catch (error) {
      console.error(`Error fetching employee info: ${error.message}`);
    }
    console.log(employeeInfo)

    let empDetails = '';
    if (!employeeInfo || !employeeInfo.data) {
      console.log('NO EMPLOYEE INFO');
      empDetails = 'Employee Information Unavailable';

    } else {
      empDetails = employeeInfo
        ? `${employeeInfo.data.first_name || ''} ${employeeInfo.data.nick_name || ''} ${employeeInfo.data.last_name || ''}`
        : 'Employee Information Unavailable';
    }

    // Draw the employee header in bold.
    drawText(`Employee: ${empDetails || ''}`, margin, yPosition, fontSize, page, boldFont);
    yPosition -= 15;

    // Table column headers (all bold)
    const headers = [
      "Date Worked",
      "Description",
      "Hours (decimal)",
      "Labor Cost",
      "Added By",
      "Added Date"
    ];
    // Draw each header in its corresponding column.
    drawText(headers[0], col0Start, yPosition, fontSize, page, boldFont);
    drawText(headers[1], col1Start, yPosition, fontSize, page, boldFont);
    drawRightAlignedText(headers[2], col2Start, yPosition, columnWidths[2], fontSize, page, boldFont);
    drawRightAlignedText(headers[3], col3Start, yPosition, columnWidths[3], fontSize, page, boldFont);
    drawText(headers[4], col4Start, yPosition, fontSize, page, boldFont);
    drawText(headers[5], col5Start, yPosition, fontSize, page, boldFont);
    yPosition -= 15;

    // Draw each row for this employee.
    details.rows.forEach((row) => {
      if (yPosition < 50) {
        page = pdfDoc.addPage([700, 800]);
        yPosition = drawHeader(page);
      }

      // Draw left-aligned cells in columns 0, 1, 4, and 5.
      drawText(row.date_worked, col0Start, yPosition, fontSize, page, font);
      drawText(row.job_code_description, col1Start, yPosition, fontSize, page, font);
      // Draw right-aligned numeric cells in columns 2 and 3.
      drawRightAlignedText(formatNumberField(row.hoursDecimal.toFixed(2)), col2Start, yPosition, columnWidths[2], fontSize, page, font);
      drawRightAlignedText(`$${row.laborCost}`, col3Start, yPosition, columnWidths[3], fontSize, page, font);
      // Draw left-aligned cells for columns 4 and 5.
      drawText(row.added_by, col4Start, yPosition, fontSize, page, font);
      drawText(row.added_date, col5Start, yPosition, fontSize, page, font);

      yPosition -= 15;
    });

    // Draw the subtotals row.
    drawText("Subtotals:", subtotalLabelX, yPosition, fontSize, page, boldFont);
    drawRightAlignedText(
      `${details.subtotalHours.toFixed(2)}`,
      col2Start,
      yPosition,
      columnWidths[2],
      fontSize,
      page,
      boldFont
    );
    drawRightAlignedText(
      `$${details.subtotalCost.toFixed(2)}`,
      col3Start,
      yPosition,
      columnWidths[3],
      fontSize,
      page,
      boldFont
    );
    yPosition -= 20;

    // Add extra vertical padding between employee sections.
    yPosition -= 15;
  }

  // Draw the grand totals row.
  drawText("Grand Totals:", grandtotalLabelX, yPosition, fontSize, page, boldFont);
  drawRightAlignedText(
    `${grandTotalHours.toFixed(2)}`,
    col2Start,
    yPosition,
    columnWidths[2],
    fontSize,
    page,
    boldFont
  );
  drawRightAlignedText(
    `$${grandTotalCost.toFixed(2)}`,
    col3Start,
    yPosition,
    columnWidths[3],
    fontSize,
    page,
    boldFont
  );

  // Add page numbers to each page.
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;
  pages.forEach((page, index) => {
    const { width } = page.getSize();
    const pageNumberText = `Page ${index + 1} of ${totalPages}`;
    page.drawText(pageNumberText, {
      x: width - margin - 50,
      y: 20,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    });
  });

  const pdfBytes = await pdfDoc.save();

  const jobNumber = jobInfo[0]?.job_number || 'unknown';
  const customer = jobInfo[0]?.job_customer?.replace(/\s+/g, '_') || 'unknown';
  const filename = `${customer}_${jobNumber}_timesheet_${fnDate}_${fnTime}.pdf`;

  return new Response(
    JSON.stringify({ filename, pdf: Buffer.from(pdfBytes).toString('base64') }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
