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
            name: 'Defusing the Binary Bomb',
            difficulty: 2,
            xp: 20,
            description: 'You\'ve discovered a ticking time bomb! The defusal manual says you need to enter the sum of all *even* digits in the bomb\'s serial number. If the sum is strictly greater than 20, you must subtract 5 from the final result. Write a C program that reads the serial number and prints the correct defusal code.',
            inputDescription: 'A single integer N (the serial number, up to 9 digits).',
            outputDescription: 'A single integer representing the defusal code.',
            exampleInput: '4528',
            exampleOutput: '14',
            constraints: '0 ≤ N ≤ 999999999',
            pathwayId: pathwayC.id,
            testCases: {
                create: [
                    { input: '4528', expectedOutput: '14' },
                    { input: '86422', expectedOutput: '17' },
                    { input: '1357', expectedOutput: '0' }
                ]
            }
        }
    });

    const task2 = await prisma.task.create({
        data: {
            index: 2,
            name: 'The Alchemist\'s Potion',
            difficulty: 3,
            xp: 35,
            description: 'An alchemist has lined up potion ingredients (represented by integers). He needs you to swap the strongest ingredient (maximum value) with the weakest ingredient (minimum value). If there are multiple max/min values, swap the first occurrences. Print the new arrangement.',
            inputDescription: 'An integer N, followed by N integers representing ingredient strengths.',
            outputDescription: 'The sequence of integers after the swap, separated by spaces.',
            exampleInput: '5\n10 3 5 20 7',
            exampleOutput: '10 20 5 3 7',
            constraints: '2 ≤ N ≤ 1000',
            pathwayId: pathwayC.id,
            testCases: {
                create: [
                    { input: '5\n10 3 5 20 7', expectedOutput: '10 20 5 3 7' },
                    { input: '4\n1 1 9 9', expectedOutput: '9 1 9 1' }
                ]
            }
        }
    });

    const task3 = await prisma.task.create({
        data: {
            index: 3,
            name: 'Echoes in the Cave',
            difficulty: 4,
            xp: 50,
            description: 'You shout a word into a magical cave. Each time it echoes, it loses its first and last letter, until nothing or only one letter is left. Write a C program that prints all the echoes.',
            inputDescription: 'A single word consisting of uppercase letters.',
            outputDescription: 'The word, followed by its echoes, each on a new line.',
            exampleInput: 'HELLO',
            exampleOutput: 'HELLO\nELL\nL',
            constraints: 'String length < 100',
            pathwayId: pathwayAlgorithms.id,
            testCases: {
                create: [
                    { input: 'HELLO', expectedOutput: 'HELLO\nELL\nL' },
                    { input: 'CODE', expectedOutput: 'CODE\nOD' }
                ]
            }
        }
    });

    const task4 = await prisma.task.create({
        data: {
            index: 4,
            name: 'Space Station Cargo',
            difficulty: 5,
            xp: 75,
            description: 'A space station needs to load cargo crates. Each crate has an ID and a weight. Sort the crates by weight in descending order. If weights are equal, sort by ID in ascending order.',
            inputDescription: 'An integer N, followed by N pairs of integers (ID, Weight).',
            outputDescription: 'The IDs of the sorted crates, separated by spaces.',
            exampleInput: '3\n1 50\n2 100\n3 50',
            exampleOutput: '2 1 3',
            constraints: '1 ≤ N ≤ 1000',
            pathwayId: pathwayAlgorithms.id,
            testCases: {
                create: [
                    { input: '3\n1 50\n2 100\n3 50', expectedOutput: '2 1 3' },
                    { input: '4\n1 10\n2 20\n3 20\n4 10', expectedOutput: '2 3 1 4' }
                ]
            }
        }
    });

    const task5 = await prisma.task.create({
        data: {
            index: 5,
            name: 'The Decoder Ring',
            difficulty: 3,
            xp: 40,
            description: 'A spy intercepted a secret message! Every letter has been shifted forward by 3 positions in the alphabet (e.g., A became D). Write a C program to decode the message back to its original form. Note: Keep non-letter characters exactly as they are.',
            inputDescription: 'A single string (can contain spaces and punctuation).',
            outputDescription: 'The decoded string.',
            exampleInput: 'KHOOR ZRUOG',
            exampleOutput: 'HELLO WORLD',
            constraints: 'String length < 100',
            pathwayId: pathwayC.id,
            testCases: {
                create: [
                    { input: 'KHOOR ZRUOG', expectedOutput: 'HELLO WORLD' },
                    { input: 'VHFUHW FRGH!', expectedOutput: 'SECRET CODE!' }
                ]
            }
        }
    });

    const task6 = await prisma.task.create({
        data: {
            index: 6,
            name: 'Galactic Fuel Calculator',
            difficulty: 2,
            xp: 25,
            description: 'A spaceship needs to refuel! The fuel required for each planet visited is calculated by dividing the planet\'s mass by 3, rounding down, and subtracting 2. If the calculated fuel is less than zero, treat it as 0. Given a list of planet masses, calculate the total fuel needed for the entire journey.',
            inputDescription: 'An integer N, followed by N integers representing planet masses.',
            outputDescription: 'A single integer representing the total fuel required.',
            exampleInput: '3\n12 14 196',
            exampleOutput: '67',
            constraints: '1 ≤ N ≤ 100',
            pathwayId: pathwayC.id,
            testCases: {
                create: [
                    { input: '3\n12 14 196', expectedOutput: '67' },
                    { input: '4\n100756 2 4 5', expectedOutput: '33583' }
                ]
            }
        }
    });

    const task7 = await prisma.task.create({
        data: {
            index: 7,
            name: 'Treasure Map Grid',
            difficulty: 4,
            xp: 60,
            description: 'A pirate has a 2D map of a local archipelago. The map is a grid of 0s (water) and 1s (land). Write a program that counts the total number of land blocks (1s) that are completely surrounded by water (0s) on all 4 sides (top, bottom, left, right). Ignore the edges of the map.',
            inputDescription: 'Two integers R (rows) and C (cols), followed by the grid values.',
            outputDescription: 'The count of isolated land blocks.',
            exampleInput: '4 4\n0 0 0 0\n0 1 0 0\n0 0 1 0\n0 0 0 0',
            exampleOutput: '2',
            constraints: '3 ≤ R,C ≤ 50',
            pathwayId: pathwayAlgorithms.id,
            testCases: {
                create: [
                    { input: '4 4\n0 0 0 0\n0 1 0 0\n0 0 1 0\n0 0 0 0', expectedOutput: '2' },
                    { input: '3 3\n1 1 1\n1 0 1\n1 1 1', expectedOutput: '0' }
                ]
            }
        }
    });

    const task8 = await prisma.task.create({
        data: {
            index: 8,
            name: 'Cybernetic Implants',
            difficulty: 3,
            xp: 45,
            description: 'An underground cyber-doctor needs to filter out weak patients. You are given a minimum tolerance level X, and a list of patients with their tolerance values. Create a new list containing only patients whose tolerance is greater than or equal to X, and print their values.',
            inputDescription: 'An integer X (min tolerance), followed by N (number of patients), then N integers.',
            outputDescription: 'The filtered tolerance values, separated by space.',
            exampleInput: '50\n5\n10 60 40 100 50',
            exampleOutput: '60 100 50',
            constraints: '1 ≤ N ≤ 1000',
            pathwayId: pathwayAlgorithms.id,
            testCases: {
                create: [
                    { input: '50\n5\n10 60 40 100 50', expectedOutput: '60 100 50' },
                    { input: '100\n3\n99 10 50', expectedOutput: '' }
                ]
            }
        }
    });

    // 6. Add Tags
    const tags = ['Conditions', 'Arrays', 'Recursion', 'Sorting', 'Logic', 'Strings', 'Math'];
    for (const name of tags) {
        const tag = await prisma.taskTag.upsert({
            where: { name },
            update: {},
            create: { name },
        });

        if (name === 'Conditions') {
            await prisma.taskTagMap.create({ data: { taskId: task1.id, tagId: tag.id } });
        }
        if (name === 'Arrays') {
            await prisma.taskTagMap.create({ data: { taskId: task2.id, tagId: tag.id } });
            await prisma.taskTagMap.create({ data: { taskId: task7.id, tagId: tag.id } });
            await prisma.taskTagMap.create({ data: { taskId: task8.id, tagId: tag.id } });
        }
        if (name === 'Recursion') {
            await prisma.taskTagMap.create({ data: { taskId: task3.id, tagId: tag.id } });
        }
        if (name === 'Sorting') {
            await prisma.taskTagMap.create({ data: { taskId: task4.id, tagId: tag.id } });
        }
        if (name === 'Strings') {
            await prisma.taskTagMap.create({ data: { taskId: task5.id, tagId: tag.id } });
        }
        if (name === 'Math') {
            await prisma.taskTagMap.create({ data: { taskId: task6.id, tagId: tag.id } });
        }
        if (name === 'Logic') {
            await prisma.taskTagMap.create({ data: { taskId: task7.id, tagId: tag.id } });
            await prisma.taskTagMap.create({ data: { taskId: task8.id, tagId: tag.id } });
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
