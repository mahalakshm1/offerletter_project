import { Offer, OfferVersion, Candidate } from '../models/index.js';
import generatePDF from '../services/pdfService.js';
import { uploadToS3, getSignedDownloadUrl } from '../services/storageService.js';

export const downloadPDF = async (req, res) => {
  const offer = await Offer.findByPk(req.params.id, {
    include: [{ model: Candidate, as: 'candidate' }],
  });
  if (!offer) return res.status(404).json({ message: 'Offer not found' });

  const latestVersion = await OfferVersion.findOne({
    where: { offer_id: offer.id },
    order: [['version_no', 'DESC']],
  });
  if (!latestVersion) return res.status(404).json({ message: 'No offer content found' });

  const watermark = offer.status === 'draft' ? 'DRAFT' : '';
  const pdfBuffer = await generatePDF(latestVersion.content, watermark);

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="offer-${offer.id}.pdf"`,
    'Content-Length': pdfBuffer.length,
  });

  res.send(pdfBuffer);
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
  if (!latestVersion) return res.status(404).json({ message: 'No offer content found' });

  const pdfBuffer = await generatePDF(latestVersion.content);
  const key = `offers/${offer.id}/offer-v${latestVersion.version_no}.pdf`;
  const url = await uploadToS3(pdfBuffer, key);

  res.json({ message: 'PDF uploaded to S3', url });
};

export const getDownloadUrl = async (req, res) => {
  const key = `offers/${req.params.id}/offer-v${req.query.version || 1}.pdf`;
  const url = await getSignedDownloadUrl(key);
  res.json({ url });
};
