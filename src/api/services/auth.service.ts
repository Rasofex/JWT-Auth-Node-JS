import { User } from '../models/user.js';
import { Token } from '../models/token.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function signUp(username: string, email: string, password: string) {
  try {
    // find user without uppre or lower case
    const user = await User.findOne({ username: RegExp(`^${username}$`, 'i') });
    if (user) {
      return { status: 409, message: 'User already exists' };
    }
    if (await User.findOne({ email })) {
      return { status: 409, message: 'Email already exists' };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username: username,
      email,
      password: hashedPassword,
    });
    return { status: 201, message: 'User created successfully' };
  } catch (error) {
    return { status: 500, message: 'Something went wrong' };
  }
}

export async function signIn(username: string, password: string) {
  try {
    const user = await User.findOne({ username: RegExp(`^${username}$`, 'i') });
    if (!user) return { status: 401, message: 'Username or password is incorrect' };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return { status: 401, message: 'Username or password is incorrect' };

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRATION_TIME as string },
    );
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_ACCESS_TOKEN_SECRET as string,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME as string },
    );

    await Token.create({ token: accessToken, username: user.username });
    return { status: 200, token, accessToken, username: user.username, role: user.role };
  } catch (error) {
    return { status: 500, message: 'Something went wrong' };
  }
}

export async function signOut(accessToken: string) {
  try {
    const token = await Token.findOneAndDelete({ token: accessToken });
    if (!token) return { status: 404, message: 'Token not found' };
    return { status: 200, message: 'Token deleted' };
  } catch (error) {
    return { status: 500, message: 'Something went wrong' };
  }
}

export async function refresh(accessToken: string) {
  try {
    const { id } = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET as string,
    ) as { id: string };

    const user = await User.findById(id);
    const token = await Token.findOne({ token: accessToken });

    if (!user) return { status: 404, message: 'User not found' };
    if (!token) return { status: 404, message: 'Token not found' };

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRATION_TIME as string },
    );

    return { status: 200, token: refreshToken };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      await Token.findOneAndDelete({ token: accessToken });
      return { status: 401, message: 'Refresh token expired' };
    } else {
      return { status: 500, message: 'Something went wrong' };
    }
  }
}