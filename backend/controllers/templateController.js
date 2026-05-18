import { Template, TemplateVersion } from '../models/index.js';

export const getAllTemplates = async (req, res) => {
  const templates = await Template.findAll({ order: [['created_at', 'DESC']] });
  res.json(templates);
};

export const getTemplateById = async (req, res) => {
  const template = await Template.findByPk(req.params.id);
  if (!template) return res.status(404).json({ message: 'Template not found' });
  res.json(template);
};

export const createTemplate = async (req, res) => {
  const { name, content } = req.body;
  const template = await Template.create({ name, content, created_by: req.user.id });

  await TemplateVersion.create({ template_id: template.id, version_no: 1, content });

  res.status(201).json(template);
};

export const updateTemplate = async (req, res) => {
  const template = await Template.findByPk(req.params.id);
  if (!template) return res.status(404).json({ message: 'Template not found' });

  if (req.body.content) {
    const lastVersion = await TemplateVersion.max('version_no', { where: { template_id: template.id } });
    await TemplateVersion.create({
      template_id: template.id,
      version_no: (lastVersion || 0) + 1,
      content: req.body.content,
    });
  }

  await template.update(req.body);
  res.json(template);
};

export const deleteTemplate = async (req, res) => {
  const template = await Template.findByPk(req.params.id);
  if (!template) return res.status(404).json({ message: 'Template not found' });
  await template.destroy();
  res.json({ message: 'Template deleted' });
};

export const getTemplateVersions = async (req, res) => {
  const versions = await TemplateVersion.findAll({
    where: { template_id: req.params.id },
    order: [['version_no', 'DESC']],
  });
  res.json(versions);
};
