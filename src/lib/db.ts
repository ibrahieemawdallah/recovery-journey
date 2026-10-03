import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'error', 'warn'],
})

// Alias used by the clinical API routes (clinical, risk, thought-records,
// relapse-plan, coping-skills, functional-analysis).
export const prisma = db

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
