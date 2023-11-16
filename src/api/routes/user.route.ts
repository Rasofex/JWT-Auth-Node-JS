import type { Request, Response } from 'express';
import { Router } from 'express';
import { getUser } from '../services/user.service.js';

const userRouter = Router();

userRouter.get('/:username', async (req: Request, res: Response) => {
  const { username } = req.params;

  if (typeof username === 'undefined') {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const { status, user, message } = await getUser(username);

    if (status === 404) {
      return res.status(404).json({ message });
    }

    return res.status(status).json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

export default userRouter;
