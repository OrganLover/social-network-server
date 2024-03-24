import type { CreateUserDto } from 'src/users/dto/user.dto';

export type RegisterUserDto = CreateUserDto;

export type LoginUserDto = Pick<RegisterUserDto, 'email' | 'password'>;
