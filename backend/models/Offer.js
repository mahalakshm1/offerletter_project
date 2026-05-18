import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Candidate from './Candidate.js';
import Template from './Template.js';

const Offer = sequelize.define('Offer', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  candidate_id: { type: DataTypes.UUID, allowNull: false, references: { model: Candidate, key: 'id' } },
  template_id: { type: DataTypes.UUID, allowNull: false, references: { model: Template, key: 'id' } },
  status: {
    type: DataTypes.ENUM('draft', 'generated', 'sent', 'viewed', 'accepted', 'rejected', 'expired'),
    defaultValue: 'draft',
  },
  salary: { type: DataTypes.STRING },
  doj: { type: DataTypes.DATEONLY },
}, { tableName: 'offers', timestamps: true, createdAt: 'created_at', updatedAt: false });

Offer.belongsTo(Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
Offer.belongsTo(Template, { foreignKey: 'template_id', as: 'template' });

export default Offer;
