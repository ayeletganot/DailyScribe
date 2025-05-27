const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    // Create test users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const user1 = await prisma.user.upsert({
        where: { email: 'john@example.com' },
        update: {},
        create: {
            email: 'john@example.com',
            userName: 'JohnDoe',
            password: hashedPassword,
        },
    });

    const user2 = await prisma.user.upsert({
        where: { email: 'jane@example.com' },
        update: {},
        create: {
            email: 'jane@example.com',
            userName: 'JaneSmith',
            password: hashedPassword,
        },
    });

    // Create test posts
    const post1 = await prisma.post.create({
        data: {
            title: 'Getting Started with Web Development',
            content: 'Web development is an exciting journey that starts with HTML, CSS, and JavaScript...',
            authorId: user1.id,
        },
    });

    const post2 = await prisma.post.create({
        data: {
            title: 'The Art of Clean Code',
            content: 'Writing clean code is not just about making it work. It\'s about making it maintainable...',
            authorId: user2.id,
        },
    });

    // Create test comments
    await prisma.comment.create({
        data: {
            content: 'Great article! This really helped me understand the basics.',
            authorId: user2.id,
            postId: post1.id,
        },
    });

    await prisma.comment.create({
        data: {
            content: 'I agree with your points about code maintainability.',
            authorId: user1.id,
            postId: post2.id,
        },
    });

    console.log('Seed data created successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 