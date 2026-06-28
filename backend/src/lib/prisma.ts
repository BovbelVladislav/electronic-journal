import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export function omitPassword<T extends { password?: string }>(user: T) {
  const { password, ...rest } = user;
  return rest;
}
