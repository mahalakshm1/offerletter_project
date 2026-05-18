import puppeteer from 'puppeteer';

const buildHtml = (content, watermarkText = '') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    body { font-family: Arial, sans-serif; padding: 60px; color: #222; line-height: 1.7; }
    .watermark {
      position: fixed; top: 40%; left: 10%; transform: rotate(-35deg);
      font-size: 72px; color: rgba(200,200,200,0.25); font-weight: bold;
      z-index: 0; pointer-events: none; white-space: nowrap;
    }
    .content { position: relative; z-index: 1; }
  </style>
</head>
<body>
  ${watermarkText ? `<div class="watermark">${watermarkText}</div>` : ''}
  <div class="content">${content}</div>
</body>
</html>`;

const generatePDF = async (htmlContent, watermarkText = '') => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(buildHtml(htmlContent, watermarkText), { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
    printBackground: true,
  });

  await browser.close();
  return Buffer.from(pdfBuffer);
};

export default generatePDF;
