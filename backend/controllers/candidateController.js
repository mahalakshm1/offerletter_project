import { Readable } from 'stream';
import csv from 'csv-parser';
import { Op } from 'sequelize';
import { Candidate } from '../models/index.js';

export const getAllCandidates = async (req, res) => {
  const { department, position, search } = req.query;
  const where = {};

  if (department) where.department = department;
  if (position) where.position = position;
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const candidates = await Candidate.findAll({ where, order: [['created_at', 'DESC']] });
  res.json(candidates);
};

export const getCandidateById = async (req, res) => {
  const candidate = await Candidate.findByPk(req.params.id);
  if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
  res.json(candidate);
};

export const createCandidate = async (req, res) => {
  const existing = await Candidate.findOne({ where: { email: req.body.email } });
  if (existing) return res.status(409).json({ message: 'Candidate with this email already exists' });

  const candidate = await Candidate.create(req.body);
  res.status(201).json(candidate);
};

export const updateCandidate = async (req, res) => {
  const candidate = await Candidate.findByPk(req.params.id);
  if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

  await candidate.update(req.body);
  res.json(candidate);
};

export const deleteCandidate = async (req, res) => {
  const candidate = await Candidate.findByPk(req.params.id);
  if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

  await candidate.destroy();
  res.json({ message: 'Candidate deleted' });
};

export const bulkUpload = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'CSV file required' });

  const results = [];
  const errors = [];

  await new Promise((resolve, reject) => {
    Readable.from(req.file.buffer)
      .pipe(csv())
      .on('data', (row) => results.push(row))
      .on('end', resolve)
      .on('error', reject);
  });

  const created = [];
  for (const row of results) {
    const { name, email, position, department, doj, salary } = row;
    if (!name || !email) { errors.push({ row, reason: 'name and email required' }); continue; }

    const exists = await Candidate.findOne({ where: { email } });
    if (exists) { errors.push({ row, reason: 'email already exists' }); continue; }

    const candidate = await Candidate.create({ name, email, position, department, doj: doj || null, salary });
    created.push(candidate);
  }

  res.status(201).json({ created: created.length, skipped: errors.length, errors });
};
