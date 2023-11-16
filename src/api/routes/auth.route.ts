import type { Request, Response } from 'express';
import { Router } from 'express';
import { signUp, signIn, signOut, refresh } from '../services/auth.service.js';
import { registerValidator } from '../validations/register.js';
import { validationResult } from 'express-validator';

const authRouter = Router();

authRouter.post(
  '/signup',
  registerValidator,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    try {
      const { username, email, password } = req.body;
      const { status, message } = await signUp(username, email, password);
      return res.status(status).json({ message });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },
);

authRouter.post('/signin', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide username and password' });
    }
    const { status, token, accessToken, message, role } = await signIn(
      username,
      password,
    );
    return res.status(status).json({ token, accessToken, message, role });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

authRouter.post('/signout', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.sendStatus(400);
    }
    const { status, message } = await signOut(token);
    return res.status(status).json({ message });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

authRouter.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.sendStatus(400);
    }
    const { status, token, message } = await refresh(refreshToken);
    return res.status(status).json({ token, message });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});
export default authRouter;
