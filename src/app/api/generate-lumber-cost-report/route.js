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
  const jobnum = body.data[0].job_number

  // Group by `wood_type`
  const groupedData = {};
  let grandTotal = 0;

  data.forEach((item) => {
    if (!groupedData[item.wood_type]) {
      groupedData[item.wood_type] = { rows: [], subtotal: 0 };
    }
    groupedData[item.wood_type].rows.push(item);
    groupedData[item.wood_type].subtotal += item.total_cost || 0; // Handle null total_cost
    grandTotal += item.total_cost || 0; // Handle null total_cost
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
  drawText(`Artistic Doors and Windows Lumber Report As Of ${formattedDate}`, 125, yPosition, 14);
  yPosition -= 20;

  // Job Info
  drawText(`Artistic Doors and Windows Lumber Report As Of ${formattedDate}`, margin, yPosition, 14);
  yPosition -= 20;

  // Generate table
  for (const [woodType, details] of Object.entries(groupedData)) {
    drawText(`Wood Type: ${woodType || 'N/A'}`, margin, yPosition);
    yPosition -= 15;

    // Table headers
    const headers = [
      "Wood",
      "Quantity",
      "Thickness",
      "Length",
      "Width",
      "Description",
      "Ft Per Piece",
      "TBF",
      "Cost",
      "Replace",
      "Entered By",
    ];
    let xPosition = margin;

    headers.forEach((header, index) => {
      drawText(header, xPosition, yPosition);
      xPosition += columnWidths[index];
    });

    yPosition -= 15;

    details.rows.forEach((row) => {
      const values = [
        row.wood_type,
        row.quantity,
        row.thickness,
        row.length,
        row.width,
        row.description,
        row.ft_per_piece,
        row.tbf?.toFixed(2),
        row.total_cost?.toFixed(2),
        row.wood_replace_id,
        row.entered_by,
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

    drawText(`Subtotal: ${details.subtotal.toFixed(2)}`, margin + 500, yPosition);
    yPosition -= 20;
  }

  drawText(`Grand Total: ${grandTotal.toFixed(2)}`, margin + 500, yPosition);

  const pdfBytes = await pdfDoc.save();

  return new Response(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=report.pdf',
    },
  });
}
