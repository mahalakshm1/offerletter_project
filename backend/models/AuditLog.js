import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, allowNull: true },
  user_email: { type: DataTypes.STRING, allowNull: true },
  method: { type: DataTypes.STRING, allowNull: false },
  route: { type: DataTypes.STRING, allowNull: false },
  action: { type: DataTypes.STRING, allowNull: false },
  resource_id: { type: DataTypes.STRING, allowNull: true },
  ip: { type: DataTypes.STRING, allowNull: true },
}, { tableName: 'audit_logs', timestamps: true, createdAt: 'created_at', updatedAt: false });

export default AuditLog;
