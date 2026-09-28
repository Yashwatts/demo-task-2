import { UserRole } from '../enums/user-role.enum';

export interface JwtPayload {
  id: string;
  sub: string;
  username: string;
  email: string;
  role: UserRole;
}
