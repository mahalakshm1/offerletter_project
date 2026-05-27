import puppeteer from 'puppeteer-core';

const buildOfferHTML = ({ name, email, position, department, salary, doj, companyName, offerDate, status, logoUrl }) => {
  const isDraft = status === 'draft';
  const formattedDoj = doj ? new Date(doj).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '___________';
  const formattedOfferDate = offerDate ? new Date(offerDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; font-size: 13px; color: #1a1a1a; background: #fff; }

    /* WATERMARK */
    .watermark {
      display: ${isDraft ? 'block' : 'none'};
      position: fixed;
      top: 38%;
      left: 5%;
      transform: rotate(-35deg);
      font-size: 90px;
      font-weight: 900;
      color: rgba(220, 53, 69, 0.12);
      letter-spacing: 10px;
      z-index: 0;
      pointer-events: none;
      white-space: nowrap;
      text-transform: uppercase;
    }

    /* PAGE LAYOUT */
    .page { position: relative; z-index: 1; padding: 0; min-height: 100vh; }

    /* HEADER */
    .header {
      background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
      color: white;
      padding: 28px 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .company-logo {
      width: 70px;
      height: 70px;
      background: rgba(255,255,255,0.15);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 900;
      color: white;
      letter-spacing: -1px;
      border: 2px solid rgba(255,255,255,0.3);
    }
    .company-info { text-align: right; }
    .company-name { font-size: 22px; font-weight: 700; letter-spacing: 1px; }
    .company-tagline { font-size: 11px; opacity: 0.8; margin-top: 3px; letter-spacing: 2px; text-transform: uppercase; }

    /* OFFER BADGE */
    .offer-badge {
      background: #fff;
      margin: 0 50px;
      padding: 14px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #1a237e;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .offer-title { font-size: 18px; font-weight: 700; color: #1a237e; text-transform: uppercase; letter-spacing: 2px; }
    .offer-meta { font-size: 11px; color: #666; text-align: right; line-height: 1.8; }
    .offer-meta span { font-weight: 600; color: #333; }

    /* BODY */
    .body { padding: 30px 50px; }

    .date-line { text-align: right; color: #555; margin-bottom: 24px; font-size: 12px; }

    .salutation { font-size: 14px; margin-bottom: 16px; }
    .salutation strong { font-size: 16px; color: #1a237e; }

    .intro-text { line-height: 1.8; color: #333; margin-bottom: 24px; }

    /* DETAILS BOX */
    .details-box {
      background: #f8f9ff;
      border: 1px solid #dde3ff;
      border-left: 4px solid #1a237e;
      border-radius: 6px;
      padding: 20px 28px;
      margin: 24px 0;
    }
    .details-box h3 { font-size: 13px; color: #1a237e; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
    .detail-row { display: flex; margin-bottom: 10px; }
    .detail-label { width: 180px; font-weight: 600; color: #555; font-size: 12px; flex-shrink: 0; }
    .detail-value { color: #1a1a1a; font-size: 13px; font-weight: 500; }
    .detail-value.highlight { color: #1a237e; font-weight: 700; font-size: 14px; }

    /* TERMS */
    .terms { margin: 20px 0; line-height: 1.9; color: #444; }
    .terms p { margin-bottom: 10px; }

    /* ACCEPTANCE */
    .acceptance-box {
      background: #fff8e1;
      border: 1px solid #ffe082;
      border-radius: 6px;
      padding: 16px 24px;
      margin: 20px 0;
      font-size: 12px;
      color: #555;
      line-height: 1.7;
    }

    /* SIGNATURE */
    .signature-section {
      margin-top: 36px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .sig-block { text-align: center; }
    .sig-line { width: 180px; border-bottom: 1.5px solid #333; margin-bottom: 6px; height: 40px; }
    .sig-label { font-size: 11px; color: #666; }
    .sig-name { font-size: 12px; font-weight: 600; color: #333; }

    /* FOOTER */
    .footer {
      background: #1a237e;
      color: rgba(255,255,255,0.75);
      text-align: center;
      padding: 14px 50px;
      font-size: 10px;
      margin-top: 40px;
      letter-spacing: 0.5px;
    }
    .footer strong { color: white; }

    /* DIVIDER */
    .divider { border: none; border-top: 1px solid #e0e0e0; margin: 20px 0; }
  </style>
</head>
<body>

  <!-- WATERMARK -->
  <div class="watermark">DRAFT</div>

  <div class="page">

    <!-- HEADER -->
    <div class="header">
      <div class="company-logo">
        ${logoUrl
          ? `<img src="${logoUrl}" style="width:60px;height:60px;object-fit:contain;border-radius:8px;" />`
          : (companyName || 'CO').substring(0, 2).toUpperCase()
        }
      </div>
      <div class="company-info">
        <div class="company-name">${companyName || 'Your Company Name'}</div>
        <div class="company-tagline">Excellence · Innovation · Growth</div>
      </div>
    </div>

    <!-- OFFER BADGE -->
    <div class="offer-badge">
      <div class="offer-title">Letter of Offer</div>
      <div class="offer-meta">
        Date: <span>${formattedOfferDate}</span><br/>
        Ref No: <span>OFR-${Date.now().toString().slice(-6)}</span>
      </div>
    </div>

    <!-- BODY -->
    <div class="body">

      <div class="salutation">
        Dear <strong>${name || '___________'}</strong>,
      </div>

      <p class="intro-text">
        We are delighted to extend this offer of employment to you at <strong>${companyName || 'our company'}</strong>.
        After careful consideration, we are pleased to offer you the following position and terms of employment.
      </p>

      <!-- DETAILS BOX -->
      <div class="details-box">
        <h3>Employment Details</h3>
        <div class="detail-row">
          <div class="detail-label">Candidate Name</div>
          <div class="detail-value">${name || '___________'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Email Address</div>
          <div class="detail-value">${email || '___________'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Designation</div>
          <div class="detail-value highlight">${position || '___________'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Department</div>
          <div class="detail-value">${department || '___________'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Date of Joining</div>
          <div class="detail-value highlight">${formattedDoj}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Annual CTC</div>
          <div class="detail-value highlight">₹ ${salary ? Number(salary).toLocaleString('en-IN') : '___________'} per annum</div>
        </div>
      </div>

      <hr class="divider"/>

      <!-- TERMS -->
      <div class="terms">
        <p>This offer is subject to the following terms and conditions:</p>
        <p>1. <strong>Probation Period:</strong> You will be on probation for a period of <strong>6 months</strong> from your date of joining, during which your performance will be evaluated.</p>
        <p>2. <strong>Background Verification:</strong> This offer is contingent upon successful completion of background verification checks.</p>
        <p>3. <strong>Confidentiality:</strong> You will be required to sign a Non-Disclosure Agreement (NDA) on or before your date of joining.</p>
        <p>4. <strong>Notice Period:</strong> After confirmation, either party may terminate employment with <strong>30 days</strong> written notice.</p>
      </div>

      <!-- ACCEPTANCE BOX -->
      <div class="acceptance-box">
        ⚠️ <strong>Action Required:</strong> Please confirm your acceptance of this offer by signing and returning this letter within
        <strong>7 days</strong> of receipt. Failure to respond within this period may result in the offer being withdrawn.
      </div>

      <p style="margin-top:16px; line-height:1.8; color:#444;">
        We look forward to welcoming you to our team and are confident that your skills and experience will be a valuable addition to our organization.
      </p>

      <!-- SIGNATURE SECTION -->
      <div class="signature-section">
        <div class="sig-block">
          <div class="sig-line"></div>
          <div class="sig-name">${name || 'Candidate Name'}</div>
          <div class="sig-label">Candidate Signature &amp; Date</div>
        </div>
        <div class="sig-block">
          <div class="sig-line"></div>
          <div class="sig-name">Authorized Signatory</div>
          <div class="sig-label">${companyName || 'Company'} · HR Department</div>
        </div>
      </div>

    </div>

    <!-- FOOTER -->
    <div class="footer">
      <strong>${companyName || 'Your Company Name'}</strong> &nbsp;|&nbsp;
      This is a confidential document intended solely for <strong>${name || 'the candidate'}</strong> &nbsp;|&nbsp;
      Generated on ${formattedOfferDate}
    </div>

  </div>
</body>
</html>`;
};

const generatePDF = async (data) => {
  const execPath = process.env.PUPPETEER_EXECUTABLE_PATH || '/bin/chromium-browser';
  console.log('Using chromium at:', execPath);

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: execPath,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-zygote',
      '--single-process',
      '--disable-extensions',
      '--disable-software-rasterizer',
    ],
  });

  const page = await browser.newPage();
  await page.setContent(buildOfferHTML(data), { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
    printBackground: true,
  });

  await browser.close();
  return Buffer.from(pdfBuffer);
};

export default generatePDF;
