import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

async function main() {
  const sqlFile = readFileSync(join(__dirname, 'seed.sql'), 'utf8')
  const statements = sqlFile.split(';').filter(statement => statement.trim() !== '')

  for (const statement of statements) {
    await prisma.$executeRawUnsafe(statement + ';')
  }

  console.log('Data seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

