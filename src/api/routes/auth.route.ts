import type { Request, Response } from 'express';
import { Router } from 'express';
import { AuthService } from '../services/auth.service.js';
import { registerValidator } from '../validations/register.js';
import { validationResult } from 'express-validator';

const authRouter = Router();
const authService = new AuthService();

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
      const user = await authService.signUp(username, email, password);
      return res.json(user);
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
    const user = await authService.signIn(username, password);
    return res.json(user);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

authRouter.post('/signout', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.sendStatus(400);
    }
    const token = await authService.signOut(refreshToken);
    if (token) {
      return res.status(400).json(token);
    }
    return res.sendStatus(204);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

authRouter.post('/refresh-token', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.sendStatus(400);
    }
    const user = await authService.refreshToken(refreshToken);
    return res.json(user);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});
export default authRouter;
