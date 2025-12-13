import { getUsers } from '../models/user.model.js';

export const getUsersController = async (req, res) => {
  const users = await getUsers();
  res.json(users);
}
