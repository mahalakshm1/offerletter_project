import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Offer from './Offer.js';

const OfferVersion = sequelize.define('OfferVersion', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  offer_id: { type: DataTypes.UUID, allowNull: false, references: { model: Offer, key: 'id' } },
  version_no: { type: DataTypes.INTEGER, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
}, { tableName: 'offer_versions', timestamps: true, createdAt: 'created_at', updatedAt: false });

OfferVersion.belongsTo(Offer, { foreignKey: 'offer_id' });
Offer.hasMany(OfferVersion, { foreignKey: 'offer_id', as: 'versions' });

export default OfferVersion;
