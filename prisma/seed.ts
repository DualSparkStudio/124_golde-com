import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Admin user
  const passwordHash = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@jewelryshop.com' },
    update: {},
    create: {
      email: 'admin@jewelryshop.com',
      name: 'Admin',
      password: passwordHash,
      role: 'admin',
    },
  })
  console.log('✓ Admin user seeded')

  // Default OtherCharges
  const existingCharges = await prisma.otherCharges.findFirst()
  if (!existingCharges) {
    await prisma.otherCharges.create({
      data: {
        shippingCost: 100,
        gstRate: 0.03,
        updatedBy: 'system',
      },
    })
    console.log('✓ OtherCharges seeded')
  } else {
    console.log('✓ OtherCharges already exists, skipping')
  }

  // Default JewelryTypes
  const jewelryTypes = [
    { name: 'Pendant', slug: 'pendant' },
    { name: 'Necklace', slug: 'necklace' },
    { name: 'Ring', slug: 'ring' },
    { name: 'Chain', slug: 'chain' },
    { name: 'Bracelet', slug: 'bracelet' },
    { name: 'Earrings', slug: 'earrings' },
    { name: 'Bangle', slug: 'bangle' },
  ]

  for (const [index, type] of jewelryTypes.entries()) {
    await prisma.jewelryType.upsert({
      where: { slug: type.slug },
      update: {},
      create: {
        name: type.name,
        slug: type.slug,
        category: 'both',
        isActive: true,
        sortOrder: index,
      },
    })
  }
  console.log('✓ JewelryTypes seeded')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
