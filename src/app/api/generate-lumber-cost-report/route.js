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

  // Group by `wood_type`
  const groupedData = {};
  let grandTotalCost = 0;
  let grandTotalTBF = 0;

  data.forEach((item) => {
    if (!groupedData[item.wood_type]) {
      groupedData[item.wood_type] = { rows: [], subtotalCost: 0, subtotalTBF: 0 };
    }
    groupedData[item.wood_type].rows.push(item);
    groupedData[item.wood_type].subtotalCost += item.total_cost || 0; // Handle null total_cost
    groupedData[item.wood_type].subtotalTBF += item.tbf || 0; // Handle null TBF
    grandTotalCost += item.total_cost || 0; // Handle null total_cost
    grandTotalTBF += item.tbf || 0; // Handle null TBF
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
  drawText(`Job: ${jobDetails}`, margin, yPosition, 12);
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

    // Subtotals for the wood type
    drawText(
      `Subtotals: ${details.subtotalTBF.toFixed(2)}      $${details.subtotalCost.toFixed(2)}`,
      margin + 390,
      yPosition
    );
    yPosition -= 20;
  }

  // Grand totals
  drawText(
    `Grand Totals: ${grandTotalTBF.toFixed(2)}      $${grandTotalCost.toFixed(2)}`,
    margin + 390,
    yPosition
  );

  const pdfBytes = await pdfDoc.save();

  // Set the filename dynamically
  const jobNumber = jobInfo[0]?.job_number || 'unknown';
  const customer = jobInfo[0]?.job_customer?.replace(/\s+/g, '_') || 'unknown';
  const filename = `${customer}_${jobNumber}_lumbercost_${fnDate}_${fnTime}.pdf`;

  return new Response(JSON.stringify({ filename, pdf: Buffer.from(pdfBytes).toString('base64') }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
