// /src/app/lib/placeholder-data.ts

// Define the possible statuses for a task
export type TaskStatus = 'Not solved' | 'In progress' | 'Solved';

// Define the interface for the task details from the image
export interface TaskDetails {
  description: string;
  inputDescription: string;
  outputDescription: string;
  exampleInput: string;
  exampleOutput: string;
  constraints: string;
}

// Define the interface for a single Task object
export interface Task {
  index: number;
  name: string;
  tags: string[];
  difficulty: number; // Represents the number of stars (1 to 5)
  status: TaskStatus;
  xp: number; // NEW PROPERTY ADDED
  details: TaskDetails; // ADDED TaskDetails
}

/**
 * Placeholder data for the coding tasks shown in the image.
 */
export const tasks: Task[] = [
  // --- Task 1: Reverse the Stream (Data from the image) ---
  {
    index: 1,
    name: 'Reverse the stream',
    tags: ['Loops', 'Pointers', 'Arrays'],
    difficulty: 3, // 3 out of 5 stars
    status: 'Not solved',
    xp: 15, // Added XP value
    details: {
      description: 'Write a program that reverses the order of elements in a stream (array). You are given a sequence of integers. Your task is to print them in reverse order, separated by spaces.',
      inputDescription: 'The first line contains an integer n — the number of elements in the stream. The next line contains n integers separated by spaces.',
      outputDescription: 'Print the same integers in reverse order, separated by spaces.',
      exampleInput: '5\n1 2 3 4 5',
      exampleOutput: '5 4 3 2 1',
      constraints: '1 ≤ n ≤ 1000',
    },
  },

  // --- Task 2: Pointer maze (Mock Data) ---
  {
    index: 2,
    name: 'Pointer maze',
    tags: ['Memory', 'Pointers'],
    difficulty: 5, // 5 out of 5 stars
    status: 'In progress',
    xp: 45, // Added XP value
    details: {
      description: 'Implement a function to find the starting node of a cycle in a singly linked list. If no cycle exists, return null. You must not modify the linked list.',
      inputDescription: 'A single line representing the linked list elements, where the last element points back to a previous element (cycle) or null (no cycle).',
      outputDescription: 'The value of the node where the cycle begins, or "null" if no cycle is present.',
      exampleInput: '1 -> 2 -> 3 -> 4 -> 2 (Cycle back to 2)',
      exampleOutput: '2',
      constraints: 'List length up to 10^5. Values are positive integers.',
    },
  },

  // --- Task 3: Algorithm labyrinth (Mock Data) ---
  {
    index: 3,
    name: 'Algorithm labyrinth',
    tags: ['Recursion'],
    difficulty: 4, // 4 out of 5 stars
    status: 'Solved',
    xp: 35, // Added XP value
    details: {
      description: 'Calculate the Nth Fibonacci number using a recursive approach, with memoization to optimize performance.',
      inputDescription: 'A single integer N, representing the index of the Fibonacci number to calculate (starting from F0 = 0).',
      outputDescription: 'The Nth Fibonacci number.',
      exampleInput: '8',
      exampleOutput: '21', // F8 = 21 (0, 1, 1, 2, 3, 5, 8, 13, 21)
      constraints: '0 ≤ N ≤ 40',
    },
  },
];