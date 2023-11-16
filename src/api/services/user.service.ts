import { User } from '../models/user.js';

export async function getUser(username: string) {
  try {
    const user = await User.findOne(
      { username: RegExp(`^${username}$`, 'i') },
      {
        username: 1,
        name: 1,
        avatarUrl: 1,
        bannerUrl: 1,
        bio: 1,
      },
    );
    if (!user) return { status: 404, message: 'User not found' };
    return { status: 200, user };
  } catch (error) {
    return { status: 500, message: 'Something went wrong' };
  }
}
