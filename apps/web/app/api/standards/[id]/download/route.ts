import { NextResponse } from 'next/server';
import standards from '@/public/data/standards.json';
import { PDFDocument, rgb } from 'pdf-lib';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const url = new URL(request.url);
  const format = url.searchParams.get('format');

  const standard = standards.find((item) => item.id === id);

  if (!standard) {
    return NextResponse.json({ error: 'Standard not found' }, { status: 404 });
  }

  if (format === 'json') {
    return NextResponse.json(standard, { status: 200 });
  }

  if (format === 'pdf') {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const fontSize = 12;

      page.drawText(`Standard ID: ${standard.id}`, { x: 50, y: height - 50, size: fontSize, color: rgb(0, 0, 0) });
      page.drawText(`Title: ${standard.title}`, { x: 50, y: height - 70, size: fontSize, color: rgb(0, 0, 0) });
      page.drawText(`Description: ${standard.description}`, { x: 50, y: height - 90, size: fontSize, color: rgb(0, 0, 0) });
      page.drawText(`Last Updated: ${new Date(standard.last_updated).toLocaleDateString()}`, { x: 50, y: height - 110, size: fontSize, color: rgb(0, 0, 0) });

      const pdfBytes = await pdfDoc.save();

      return new NextResponse(pdfBytes, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${standard.id}.pdf"`,
        },
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Invalid format. Use ?format=json or ?format=pdf' }, { status: 400 });
}