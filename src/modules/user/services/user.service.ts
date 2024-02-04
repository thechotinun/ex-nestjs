import { Injectable } from '@nestjs/common';
import { User } from '@entities/user.entity';
import { UserException } from '@exceptions/app/user.exception';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '@repositories/user.repository';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import { hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  hashPassword = async (password: string, salt: number): Promise<string> => {
    return await hash(password, salt);
  };

  async paginate(options: IPaginationOptions): Promise<Pagination<User>> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .orderBy('user.createdDate', 'DESC');

    return paginate<User>(queryBuilder, options);
  }

  async create(payload: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await this.hashPassword(
        payload.password,
        this.configService.get<number>('password.saltRound'),
      );
      payload.password = hashedPassword;

      const create = await this.userRepository.create(payload);

      return await this.userRepository.save(create);
    } catch (error) {
      throw UserException.createError(error.message);
    }
  }

  async findOne(email: string): Promise<User> {
    return await this.userRepository
      .findOneOrFail({
        where: {
          email: email,
        },
      })
      .catch(() => {
        throw UserException.notFound();
      });
  }
}
