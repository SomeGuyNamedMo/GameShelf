import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/errors.js';
import { Role } from '@prisma/client';

const createLibrarySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

const inviteMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN', 'MEMBER', 'GUEST']).default('MEMBER'),
});

const updateMemberRoleSchema = z.object({
  role: z.enum(['ADMIN', 'MEMBER', 'GUEST']),
});

export async function getLibraries(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;

    const memberships = await prisma.libraryMember.findMany({
      where: { userId },
      include: {
        library: {
          include: {
            _count: {
              select: {
                games: true,
                members: true,
              },
            },
          },
        },
      },
    });

    const libraries = memberships.map((m) => ({
      id: m.library.id,
      name: m.library.name,
      description: m.library.description,
      role: m.role,
      gameCount: m.library._count.games,
      memberCount: m.library._count.members,
      createdAt: m.library.createdAt,
    }));

    res.json({ libraries });
  } catch (error) {
    next(error);
  }
}

export async function createLibrary(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { name, description } = createLibrarySchema.parse(req.body);

    const library = await prisma.library.create({
      data: {
        name,
        description,
        members: {
          create: {
            userId,
            role: 'ADMIN',
          },
        },
      },
    });

    res.status(201).json({
      id: library.id,
      name: library.name,
      description: library.description,
      createdAt: library.createdAt,
    });
  } catch (error) {
    next(error);
  }
}

export async function getLibrary(req: Request, res: Response, next: NextFunction) {
  try {
    const { libraryId } = req.params;

    const library = await prisma.library.findUnique({
      where: { id: libraryId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!library) {
      throw AppError.notFound('Library not found');
    }

    res.json({
      id: library.id,
      name: library.name,
      description: library.description,
      createdAt: library.createdAt,
      members: library.members.map((m) => ({
        userId: m.user.id,
        name: m.user.name,
        email: m.user.email,
        role: m.role,
        joinedAt: m.joinedAt,
      })),
    });
  } catch (error) {
    next(error);
  }
}

export async function inviteMember(req: Request, res: Response, next: NextFunction) {
  try {
    const { libraryId } = req.params;
    const { email, role } = inviteMemberSchema.parse(req.body);

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw AppError.notFound('User not found with this email');
    }

    // Check if already a member
    const existingMember = await prisma.libraryMember.findUnique({
      where: {
        userId_libraryId: {
          userId: user.id,
          libraryId,
        },
      },
    });

    if (existingMember) {
      throw AppError.conflict('User is already a member of this library');
    }

    // Add the member
    const member = await prisma.libraryMember.create({
      data: {
        userId: user.id,
        libraryId,
        role: role as Role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      userId: member.user.id,
      name: member.user.name,
      email: member.user.email,
      role: member.role,
      joinedAt: member.joinedAt,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMemberRole(req: Request, res: Response, next: NextFunction) {
  try {
    const { libraryId, userId } = req.params;
    const { role } = updateMemberRoleSchema.parse(req.body);

    const member = await prisma.libraryMember.findUnique({
      where: {
        userId_libraryId: {
          userId,
          libraryId,
        },
      },
    });

    if (!member) {
      throw AppError.notFound('Member not found');
    }

    const updated = await prisma.libraryMember.update({
      where: {
        userId_libraryId: {
          userId,
          libraryId,
        },
      },
      data: { role: role as Role },
    });

    res.json({
      userId,
      role: updated.role,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeMember(req: Request, res: Response, next: NextFunction) {
  try {
    const { libraryId, userId } = req.params;

    const member = await prisma.libraryMember.findUnique({
      where: {
        userId_libraryId: {
          userId,
          libraryId,
        },
      },
    });

    if (!member) {
      throw AppError.notFound('Member not found');
    }

    await prisma.libraryMember.delete({
      where: {
        userId_libraryId: {
          userId,
          libraryId,
        },
      },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

