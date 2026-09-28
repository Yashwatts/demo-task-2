import { ApplicationStatus } from '../enums/application-status.enum';
import { UserRole } from '../enums/user-role.enum';

export interface TransitionRule {
  from: ApplicationStatus;
  to: ApplicationStatus;
  allowedRole: UserRole | 'system';
}
