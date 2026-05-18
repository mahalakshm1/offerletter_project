import { User } from '../models/index.js';

const SAFE_ATTRS = ['id', 'name', 'email', 'role', 'created_at'];

export const getAllUsers = async (req, res) => {
  const users = await User.findAll({ attributes: SAFE_ATTRS });
  res.json(users);
};

export const getUserById = async (req, res) => {
  const user = await User.findByPk(req.params.id, { attributes: SAFE_ATTRS });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

export const updateUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  await user.update(req.body);
  res.json({ message: 'User updated', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};

export const deleteUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (user.id === req.user.id) return res.status(400).json({ message: 'Cannot delete yourself' });

  await user.destroy();
  res.json({ message: 'User deleted' });
};
