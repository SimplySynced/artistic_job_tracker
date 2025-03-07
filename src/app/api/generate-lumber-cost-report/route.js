import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function POST(req) {
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

  // Fetch job information from /api/jobs/[id]
  let jobInfo = {};
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/jobs/${jn}`
    );
    if (response.ok) {
      jobInfo = await response.json();
    } else {
      console.error(`Failed to fetch job info for job number ${jn}`);
    }
  } catch (error) {
    console.error(`Error fetching job info: ${error.message}`);
  }

  const jobDetails =
    jobInfo && jobInfo[0]
      ? `${jobInfo[0].job_number || ''} - ${jobInfo[0].job_location || ''} - ${jobInfo[0].job_customer || ''} - ${jobInfo[0].job_address || ''}`
      : 'Job Information Unavailable';

  // Group data by wood_type
  const groupedData = {};
  let grandTotalCost = 0;
  let grandTotalTBF = 0;

  data.forEach((item) => {
    if (!groupedData[item.wood_type]) {
      groupedData[item.wood_type] = { rows: [], subtotalCost: 0, subtotalTBF: 0 };
    }
    groupedData[item.wood_type].rows.push(item);
    groupedData[item.wood_type].subtotalCost += item.total_cost || 0;
    groupedData[item.wood_type].subtotalTBF += item.tbf || 0;
    grandTotalCost += item.total_cost || 0;
    grandTotalTBF += item.tbf || 0;
  });

  // Helper function: Format a number with commas and always two decimals.
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

  // Create PDF document
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([700, 800]);

  // Embed two fonts: regular and bold.
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 12;
  const margin = 20;
  // Define the column widths (for an 11‑column table).
  const columnWidths = [90, 40, 50, 50, 50, 100, 50, 50, 70, 40, 80];
  let yPosition = 760;
  const cellPadding = 5;

  // Helper function: Draw left‑aligned text with padding.
  const drawText = (text, x, y, size = fontSize, fontUsed = regularFont) => {
    page.drawText(String(text || ''), {
      x: x + cellPadding,
      y,
      size,
      font: fontUsed,
      color: rgb(0, 0, 0),
    });
  };

  // Helper function: Draw right‑aligned text within a given column width.
  const drawRightAlignedText = (text, startX, y, columnWidth, size = fontSize, fontUsed = regularFont) => {
    const textStr = String(text || '');
    const textWidth = fontUsed.widthOfTextAtSize(textStr, size);
    const x = startX + columnWidth - textWidth - cellPadding;
    page.drawText(textStr, { x, y, size, font: fontUsed, color: rgb(0, 0, 0) });
  };

  // Draw the main header (report title and job info) in bold.
  const drawMainHeader = () => {
    yPosition = 760;
    drawText(
      `Artistic Doors and Windows Lumber Report As Of ${formattedDate}`,
      125,
      yPosition,
      14,
      boldFont
    );
    yPosition -= 20;
    drawText(`Job: ${jobDetails}`, margin, yPosition, 12, boldFont);
    yPosition -= 30;
  };

  // Draw the table header in bold; right-align columns 7 ("TBF") and 8 ("Cost").
  const drawTableHeader = () => {
    const headers = [
      'Wood',
      'QTY',
      'THK',
      'LGTH',
      'WTH',
      'Description',
      'Ft/Pc',
      'TBF',
      'Cost',
      'Repl',
      'User',
    ];
    let xPosition = margin;
    headers.forEach((header, index) => {
      if (index === 7 || index === 8) {
        drawRightAlignedText(header, xPosition, yPosition, columnWidths[index], fontSize, boldFont);
      } else {
        drawText(header, xPosition, yPosition, fontSize, boldFont);
      }
      xPosition += columnWidths[index];
    });
    yPosition -= 15;
  };

  // Check for page break and redraw headers if needed.
  const checkPageBreak = () => {
    if (yPosition < 50) {
      page = pdfDoc.addPage([700, 800]);
      drawMainHeader();
      drawTableHeader();
    }
  };

  // Draw the initial header.
  drawMainHeader();

  // Define column starting positions.
  const col0Start = margin; // "Wood"
  const col1Start = col0Start + columnWidths[0];
  const col2Start = col1Start + columnWidths[1];
  const col3Start = col2Start + columnWidths[2];
  const col4Start = col3Start + columnWidths[3];
  const col5Start = col4Start + columnWidths[4];
  const col6Start = col5Start + columnWidths[5];
  const col7Start = col6Start + columnWidths[6]; // "TBF"
  const col8Start = col7Start + columnWidths[7]; // "Cost"
  const col9Start = col8Start + columnWidths[8];
  const col10Start = col9Start + columnWidths[9];
  // For subtotals, define label positions.
  const subtotalLabelX = margin + 260;
  const grandtotalLabelX = margin + 245;

  // Generate the table content for each wood type group.
  for (const [woodType, details] of Object.entries(groupedData)) {
    // Draw the wood type group header in bold.
    drawText(`Wood Type: ${woodType || ''}`, margin, yPosition, fontSize, boldFont);
    yPosition -= 15;

    // Draw the table header for this group.
    drawTableHeader();

    // Draw each row for this wood type.
    details.rows.forEach((row) => {
      let values = [
        row.wood_type,
        row.quantity,
        `${row.thickness * 4}/4`,
        row.length,
        row.width,
        row.description,
        row.ft_per_piece,
        // Ensure TBF and Cost always display 2 decimals.
        formatNumberField(row.tbf?.toFixed(2)),
        formatNumberField(row.total_cost?.toFixed(2)),
        row.price,
        row.entered_by,
      ];
      let xPosition = margin;
      values.forEach((value, index) => {
        if (index === 7 || index === 8) {
          // For TBF (index 7) and Cost (index 8), use right alignment.
          drawRightAlignedText(value, xPosition, yPosition, columnWidths[index], fontSize, regularFont);
        } else {
          drawText(value, xPosition, yPosition, fontSize, regularFont);
        }
        xPosition += columnWidths[index];
      });
      yPosition -= 15;
      checkPageBreak();
    });

    // Add extra space between rows and subtotals.
    yPosition -= 10;

    // Draw the subtotals row.
    drawText("Subtotals:", subtotalLabelX, yPosition, fontSize, boldFont);
    drawRightAlignedText(
      formatNumberField(details.subtotalTBF.toFixed(2)),
      col7Start,
      yPosition,
      columnWidths[7],
      fontSize,
      boldFont
    );
    drawRightAlignedText(
      "$" + formatNumberField(details.subtotalCost.toFixed(2)),
      col8Start,
      yPosition,
      columnWidths[8],
      fontSize,
      boldFont
    );
    yPosition -= 30;
    checkPageBreak();
  }

  // Draw the grand totals row in bold.
  drawText("Grand Totals:", grandtotalLabelX, yPosition, fontSize, boldFont);
  drawRightAlignedText(
    formatNumberField(grandTotalTBF.toFixed(2)),
    col7Start,
    yPosition,
    columnWidths[7],
    fontSize,
    boldFont
  );
  drawRightAlignedText(
    "$" + formatNumberField(grandTotalCost.toFixed(2)),
    col8Start,
    yPosition,
    columnWidths[8],
    fontSize,
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
      font: regularFont,
      color: rgb(0, 0, 0),
    });
  });

  const pdfBytes = await pdfDoc.save();
  const jobNumber = jobInfo[0]?.job_number || 'unknown';
  const customer = jobInfo[0]?.job_customer?.replace(/\s+/g, '_') || 'unknown';
  const filename = `${customer}_${jobNumber}_lumbercost_${fnDate}_${fnTime}.pdf`;

  return new Response(
    JSON.stringify({ filename, pdf: Buffer.from(pdfBytes).toString('base64') }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
