import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Candidate = sequelize.define('Candidate', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  position: { type: DataTypes.STRING },
  department: { type: DataTypes.STRING },
  doj: { type: DataTypes.DATEONLY },
  salary: { type: DataTypes.STRING },
}, { tableName: 'candidates', timestamps: true, createdAt: 'created_at', updatedAt: false });

export default Candidate;
