import { Offer, OfferVersion, Candidate } from '../models/index.js';
import generatePDF from '../services/pdfService.js';
import { uploadToS3, getSignedDownloadUrl } from '../services/storageService.js';

const buildPdfData = (offer, candidate) => ({
  name: candidate.name,
  email: candidate.email,
  position: candidate.position,
  department: candidate.department,
  salary: offer.salary || candidate.salary,
  doj: offer.doj || candidate.doj,
  status: offer.status,
  companyName: process.env.COMPANY_NAME || 'Your Company',
  logoUrl: process.env.COMPANY_LOGO_URL || null,
  offerDate: offer.created_at,
});

export const downloadPDF = async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id, {
      include: [{ model: Candidate, as: 'candidate' }],
    });
    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    const pdfBuffer = await generatePDF(buildPdfData(offer, offer.candidate));

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="offer-${offer.id}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation error:', err.message);
    res.status(500).json({ message: 'PDF generation failed', error: err.message });
  }
};

export const uploadPDF = async (req, res) => {
  const offer = await Offer.findByPk(req.params.id, {
    include: [{ model: Candidate, as: 'candidate' }],
  });
  if (!offer) return res.status(404).json({ message: 'Offer not found' });

  const latestVersion = await OfferVersion.findOne({
    where: { offer_id: offer.id },
    order: [['version_no', 'DESC']],
  });

  const pdfBuffer = await generatePDF(buildPdfData(offer, offer.candidate));
  const key = `offers/${offer.id}/offer-v${latestVersion?.version_no || 1}.pdf`;
  const url = await uploadToS3(pdfBuffer, key);

  res.json({ message: 'PDF uploaded to S3', url });
};

export const getDownloadUrl = async (req, res) => {
  const key = `offers/${req.params.id}/offer-v${req.query.version || 1}.pdf`;
  const url = await getSignedDownloadUrl(key);
  res.json({ url });
};
