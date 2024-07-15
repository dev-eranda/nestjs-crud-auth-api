import { IsEmail, IsLowercase, IsNotEmpty, IsString, Matches, MinLength, minLength } from 'class-validator';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/;
const PASSWORD_MESSAGE = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(PASSWORD_REGEX, {
    message: PASSWORD_MESSAGE
  })
  password: string;
}
