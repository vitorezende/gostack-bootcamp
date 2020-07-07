import { getRepository } from 'typeorm';
import pach from 'path';
import fs from 'fs';

import AppError from '../errors/AppError';

import uploadConfig from '../config/upload';
import User from '../models/User';

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.avatar) {
      // Deletar o avatar anterior
      const userAvatarFilePatch = pach.join(
        uploadConfig.directory,
        user.avatar,
      );
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePatch);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePatch);
      }
    }

    user.avatar = avatarFilename;

    await userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
