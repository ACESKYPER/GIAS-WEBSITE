const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const STANDARDS_DIR = path.join(__dirname, '..', '..', '..', 'standards');
const OUT_DIR = path.join(__dirname, '..', 'public', 'pdfs');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const files = fs.readdirSync(STANDARDS_DIR).filter((f) => f.endsWith('.md'));
for (const f of files) {
  const slug = f.replace('.md', '');
  const content = fs.readFileSync(path.join(STANDARDS_DIR, f), 'utf8');
  const doc = new PDFDocument({ size: 'LETTER', margin: 72 });
  const out = fs.createWriteStream(path.join(OUT_DIR, `${slug}.pdf`));
  doc.pipe(out);
  const lines = content.split('\n');
  doc.font('Helvetica-Bold').fontSize(16).text(slug, { continued: false });
  doc.moveDown();
  doc.font('Helvetica').fontSize(10);
  for (const line of lines) {
    doc.text(line);
  }
  doc.end();
  console.log('Generated', slug);
}
