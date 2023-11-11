import { User } from '../models/user.js';
import { Token } from '../models/token.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  async signUp(username: string, email: string, password: string) {
    const user = await User.findOne({ username });
    if (user) {
      return { message: 'User already exists' };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return await User.create({
      username,
      email,
      password: hashedPassword,
    });
  }

  async signIn(username: string, password: string) {
    const user = await User.findOne({ username });
    if (!user) return { message: 'Username or password is incorrect' };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return { message: 'Username or password is incorrect' };

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRATION_TIME as string },
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_TOKEN_SECRET as string,
      { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME as string },
    );

    await Token.create({ token: refreshToken });
    return { accessToken, refreshToken };
  }

  async signOut(refreshToken: string) {
    const token = await Token.findOneAndDelete({ token: refreshToken });
    return token
      ? { message: 'Token deleted' }
      : { message: 'Token not found' };
  }

  async refreshToken(refreshToken: string) {
    const { id } = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET as string,
    ) as { id: string };
    const user = await User.findById(id);
    const token = await Token.findOne({ token: refreshToken });

    if (!user) return { message: 'User not found' };
    if (!token) return { message: 'Token not found' };

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRATION_TIME as string },
    );

    return { accessToken };
  }
}
