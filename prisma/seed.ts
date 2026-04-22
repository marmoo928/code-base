import { PrismaClient, Role, ProgressStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');

    // Clear existing data to avoid conflicts
    await prisma.submissionResult.deleteMany();
    await prisma.submission.deleteMany();
    await prisma.userTaskProgress.deleteMany();
    await prisma.taskTagMap.deleteMany();
    await prisma.taskTag.deleteMany();
    await prisma.testCase.deleteMany();
    await prisma.task.deleteMany();
    await prisma.pathway.deleteMany();
    await prisma.class.deleteMany();
    await prisma.user.deleteMany();

    const passwordHash = await bcrypt.hash('secret123', 10);

    const generateJoinCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

    // 1. Create Teacher
    const teacher = await prisma.user.create({
        data: {
            email: 'teacher@codebase.sk',
            name: 'Mgr. Peter Učiteľ',
            passwordHash: passwordHash,
            role: Role.TEACHER,
        }
    });
    console.log('Teacher created: teacher@codebase.sk / secret123');

    // 2. Create Classes
    const classA = await prisma.class.create({
        data: {
            name: '1.A - Informatika',
            teacherId: teacher.id,
            joinCode: generateJoinCode(),
        }
    });

    const classB = await prisma.class.create({
        data: {
            name: '2.B - Programovanie',
            teacherId: teacher.id,
            joinCode: generateJoinCode(),
        }
    });

    // 3. Create Students
    const student1 = await prisma.user.create({
        data: {
            email: 'student@codebase.sk',
            name: 'Ján Študent',
            passwordHash: passwordHash,
            role: Role.STUDENT,
            classes: { connect: [{ id: classA.id }] },
        }
    });

    const student2 = await prisma.user.create({
        data: {
            email: 'fero@codebase.sk',
            name: 'Fero Programátor',
            passwordHash: passwordHash,
            role: Role.STUDENT,
            classes: { connect: [{ id: classA.id }] },
            xpTotal: 150,
        }
    });

    const student3 = await prisma.user.create({
        data: {
            email: 'zuza@codebase.sk',
            name: 'Zuzka Binárna',
            passwordHash: passwordHash,
            role: Role.STUDENT,
            classes: { connect: [{ id: classB.id }] },
            xpTotal: 45,
        }
    });

    // 4. Create Pathways
    const pathwayC = await prisma.pathway.create({
        data: {
            name: 'Foundations of C',
            description: 'Learn the basics of C programming: variables, loops, and conditions.',
            order: 1,
        }
    });

    const pathwayAlgorithms = await prisma.pathway.create({
        data: {
            name: 'Algorithms & Data Structures',
            description: 'Dive deeper into complex algorithms, recursion and data organization.',
            order: 2,
        }
    });

    // 5. Create Tasks
    const task1 = await prisma.task.create({
        data: {
            index: 1,
            name: 'Reverse the stream',
            difficulty: 2,
            xp: 15,
            description: 'Write a program that reverses the order of elements in a stream. You are given a sequence of integers. Your task is to print them in reverse order.',
            inputDescription: 'The first line contains an integer n (number of elements). The next line contains n integers.',
            outputDescription: 'Print the same integers in reverse order, separated by spaces.',
            exampleInput: '5\n1 2 3 4 5',
            exampleOutput: '5 4 3 2 1',
            constraints: '1 ≤ n ≤ 1000',
            pathwayId: pathwayC.id,
            testCases: {
                create: [
                    { input: '5\n1 2 3 4 5', expectedOutput: '5 4 3 2 1' },
                    { input: '3\n10 20 30', expectedOutput: '30 20 10' }
                ]
            }
        }
    });

    const task2 = await prisma.task.create({
        data: {
            index: 2,
            name: 'Pointer maze',
            difficulty: 5,
            xp: 70,
            description: 'Navigate through a linked list and detect if there is a cycle. Return the value of the node where the cycle begins.',
            inputDescription: 'List elements representation.',
            outputDescription: 'Start node value or null.',
            exampleInput: '1 -> 2 -> 3 -> 2',
            exampleOutput: '2',
            constraints: 'N < 10000',
            pathwayId: pathwayC.id,
            testCases: {
                create: [
                    { input: '1 -> 2 -> 3 -> 2', expectedOutput: '2' }
                ]
            }
        }
    });

    const task3 = await prisma.task.create({
        data: {
            index: 3,
            name: 'Algorithm labyrinth',
            difficulty: 4,
            xp: 35,
            description: 'Find your way through the recursive labyrinth. Calculate Nth Fibonacci number using recursion.',
            inputDescription: 'Integer N.',
            outputDescription: 'Nth Fibonacci number.',
            exampleInput: '8',
            exampleOutput: '21',
            constraints: 'N < 40',
            pathwayId: pathwayAlgorithms.id,
            testCases: {
                create: [
                    { input: '8', expectedOutput: '21' }
                ]
            }
        }
    });

    // 6. Add Tags
    const tags = ['Loops', 'Pointers', 'Recursion', 'Memory'];
    for (const name of tags) {
        const tag = await prisma.taskTag.upsert({
            where: { name },
            update: {},
            create: { name },
        });

        if (name === 'Loops' || name === 'Pointers') {
            await prisma.taskTagMap.create({ data: { taskId: task1.id, tagId: tag.id } });
        }
        if (name === 'Pointers' || name === 'Memory') {
            await prisma.taskTagMap.create({ data: { taskId: task2.id, tagId: tag.id } });
        }
        if (name === 'Recursion') {
            await prisma.taskTagMap.create({ data: { taskId: task3.id, tagId: tag.id } });
        }
    }

    // 7. Seed some progress
    await prisma.userTaskProgress.create({
        data: {
            userId: student2.id,
            taskId: task1.id,
            status: ProgressStatus.SOLVED,
        }
    });

    await prisma.userTaskProgress.create({
        data: {
            userId: student3.id,
            taskId: task3.id,
            status: ProgressStatus.IN_PROGRESS,
        }
    });

    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
