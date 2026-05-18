import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Offer from './Offer.js';

const ScheduledEmail = sequelize.define('ScheduledEmail', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  offer_id: { type: DataTypes.UUID, allowNull: false, references: { model: Offer, key: 'id' } },
  status: { type: DataTypes.ENUM('pending', 'sent', 'failed'), defaultValue: 'pending' },
  scheduled_at: { type: DataTypes.DATE, allowNull: false },
  updated_by: { type: DataTypes.UUID },
  comments: { type: DataTypes.TEXT },
}, { tableName: 'scheduled_emails', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

ScheduledEmail.belongsTo(Offer, { foreignKey: 'offer_id' });
Offer.hasMany(ScheduledEmail, { foreignKey: 'offer_id', as: 'scheduledEmails' });

export default ScheduledEmail;
