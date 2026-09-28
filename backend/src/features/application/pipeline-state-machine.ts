import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { ApplicationStatus } from 'src/domain/enums/application-status.enum';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { TransitionRule } from 'src/domain/interfaces/transition-rule.interface';

export const pipelineTransitionRules: TransitionRule[] = [
  {
    from: ApplicationStatus.APPLIED,
    to: ApplicationStatus.SHORTLISTED,
    allowedRole: UserRole.ADMIN,
  },
  {
    from: ApplicationStatus.APPLIED,
    to: ApplicationStatus.REJECTED,
    allowedRole: UserRole.ADMIN,
  },
  {
    from: ApplicationStatus.SHORTLISTED,
    to: ApplicationStatus.INTERVIEW,
    allowedRole: UserRole.ADMIN,
  },
  {
    from: ApplicationStatus.SHORTLISTED,
    to: ApplicationStatus.INTERVIEW,
    allowedRole: UserRole.ADMIN,
  },
  {
    from: ApplicationStatus.SHORTLISTED,
    to: ApplicationStatus.REJECTED,
    allowedRole: UserRole.ADMIN,
  },
  {
    from: ApplicationStatus.INTERVIEW,
    to: ApplicationStatus.OFFER,
    allowedRole: UserRole.ADMIN,
  },
  {
    from: ApplicationStatus.INTERVIEW,
    to: ApplicationStatus.REJECTED,
    allowedRole: UserRole.ADMIN,
  },
  {
    from: ApplicationStatus.OFFER,
    to: ApplicationStatus.HIRED,
    allowedRole: UserRole.ADMIN,
  },
  {
    from: ApplicationStatus.OFFER,
    to: ApplicationStatus.REJECTED,
    allowedRole: UserRole.ADMIN,
  },

  {
    from: ApplicationStatus.APPLIED,
    to: ApplicationStatus.WITHDRAWN,
    allowedRole: UserRole.APPLICANT,
  },
  {
    from: ApplicationStatus.SHORTLISTED,
    to: ApplicationStatus.WITHDRAWN,
    allowedRole: UserRole.APPLICANT,
  },
  {
    from: ApplicationStatus.INTERVIEW,
    to: ApplicationStatus.WITHDRAWN,
    allowedRole: UserRole.APPLICANT,
  },
  {
    from: ApplicationStatus.OFFER,
    to: ApplicationStatus.WITHDRAWN,
    allowedRole: UserRole.APPLICANT,
  },

  {
    from: ApplicationStatus.APPLIED,
    to: ApplicationStatus.REJECTED,
    allowedRole: 'system',
  },
];

export function ValidateStatusTransition(
  currentStatus: ApplicationStatus,
  targetStatus: ApplicationStatus,
  actorRole: UserRole | 'system',
): void {
  if (
    currentStatus === ApplicationStatus.HIRED ||
    currentStatus === ApplicationStatus.REJECTED ||
    currentStatus === ApplicationStatus.WITHDRAWN
  ) {
    throw new BadRequestException(
      `Cannot transition from ${currentStatus} to ${targetStatus}.`,
    );
  }

  const validTransition = pipelineTransitionRules.find(
    (rule) => rule.from === currentStatus && rule.to === targetStatus,
  );

  if (!validTransition) {
    throw new BadRequestException(
      `Invalid pipeline transition from ${currentStatus} to ${targetStatus}.`,
    );
  }

  if (validTransition.allowedRole !== actorRole) {
    throw new ForbiddenException(
      `Role ${actorRole} is not allowed to transition from ${currentStatus} to ${targetStatus}.`,
    );
  }
}
