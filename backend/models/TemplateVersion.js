import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Template from './Template.js';

const TemplateVersion = sequelize.define('TemplateVersion', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  template_id: { type: DataTypes.UUID, allowNull: false, references: { model: Template, key: 'id' } },
  version_no: { type: DataTypes.INTEGER, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
}, { tableName: 'template_versions', timestamps: true, createdAt: 'created_at', updatedAt: false });

TemplateVersion.belongsTo(Template, { foreignKey: 'template_id' });
Template.hasMany(TemplateVersion, { foreignKey: 'template_id', as: 'versions' });

export default TemplateVersion;
