import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AppError } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';

const roleHierarchy: Record<Role, number> = {
  ADMIN: 3,
  MEMBER: 2,
  GUEST: 1,
};

export function requireRole(...allowedRoles: Role[]) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw AppError.unauthorized();
      }

      const libraryId = req.params.libraryId;
      if (!libraryId) {
        throw AppError.validation('Library ID is required');
      }

      const membership = await prisma.libraryMember.findUnique({
        where: {
          userId_libraryId: {
            userId: req.user.id,
            libraryId,
          },
        },
      });

      if (!membership) {
        throw AppError.forbidden('You are not a member of this library');
      }

      const hasPermission = allowedRoles.some(
        (role) => roleHierarchy[membership.role] >= roleHierarchy[role]
      );

      if (!hasPermission) {
        throw AppError.forbidden('Insufficient permissions');
      }

      req.libraryRole = membership.role;
      next();
    } catch (error) {
      next(error);
    }
  };
}

// Shorthand exports for common role requirements
export const requireAdmin = requireRole('ADMIN');
export const requireMember = requireRole('MEMBER');
export const requireGuest = requireRole('GUEST');

