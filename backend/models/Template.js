import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const Template = sequelize.define('Template', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  created_by: { type: DataTypes.UUID, references: { model: User, key: 'id' } },
}, { tableName: 'templates', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

Template.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

export default Template;
