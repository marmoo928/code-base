// /src/app/lib/placeholder-data.ts

export type TaskStatus = 'Not solved' | 'In progress' | 'Solved';

export interface TaskDetails {
  description: string;
  inputDescription: string;
  outputDescription: string;
  exampleInput: string;
  exampleOutput: string;
  constraints: string;
}

export interface Task {
  index: number;
  name: string;
  tags: string[];
  difficulty: number;
  status: TaskStatus;
  xp: number;
  details: TaskDetails;
  testCases: { input: string; expected: string }[];
}
export const tasks: Task[] = [
  {
    index: 1,
    name: 'Reverse the stream',
    tags: ['Loops', 'Pointers', 'Arrays'],
    difficulty: 3,
    status: 'Not solved',
    xp: 15,
    details: {
      description: 'Write a program that reverses the order of elements in a stream (array). You are given a sequence of integers. Your task is to print them in reverse order, separated by spaces.',
      inputDescription: 'The first line contains an integer n — the number of elements in the stream. The next line contains n integers separated by spaces.',
      outputDescription: 'Print the same integers in reverse order, separated by spaces.',
      exampleInput: '5\n1 2 3 4 5',
      exampleOutput: '5 4 3 2 1',
      constraints: '1 ≤ n ≤ 1000',
    },
    testCases: [
      { input: '5\n1 2 3 4 5', expected: '5 4 3 2 1' },
      { input: '3\n10 20 30', expected: '30 20 10' },
      { input: '1\n100', expected: '100' }
    ]
  },

  {
    index: 2,
    name: 'Pointer maze',
    tags: ['Memory', 'Pointers'],
    difficulty: 5,
    status: 'In progress',
    xp: 45,
    details: {
      description: 'Implement a function to find the starting node of a cycle in a singly linked list. If no cycle exists, return null. You must not modify the linked list.',
      inputDescription: 'A single line representing the linked list elements, where the last element points back to a previous element (cycle) or null (no cycle).',
      outputDescription: 'The value of the node where the cycle begins, or "null" if no cycle is present.',
      exampleInput: '1 -> 2 -> 3 -> 4 -> 2 (Cycle back to 2)',
      exampleOutput: '2',
      constraints: 'List length up to 10^5. Values are positive integers.',
    },
    testCases: [
      { input: '1 -> 2 -> 3 -> 4 -> 2', expected: '2' },
      { input: '1 -> 2 -> 3', expected: 'null' }
    ]
  },
  {
    index: 3,
    name: 'Algorithm labyrinth',
    tags: ['Recursion'],
    difficulty: 4,
    status: 'Solved',
    xp: 35,
    details: {
      description: 'Calculate the Nth Fibonacci number using a recursive approach, with memoization to optimize performance.',
      inputDescription: 'A single integer N, representing the index of the Fibonacci number to calculate (starting from F0 = 0).',
      outputDescription: 'The Nth Fibonacci number.',
      exampleInput: '8',
      exampleOutput: '21',
      constraints: '0 ≤ N ≤ 40',
    },
    testCases: [
      { input: '8', expected: '21' },
      { input: '0', expected: '0' },
      { input: '1', expected: '1' }
    ]
  },
];