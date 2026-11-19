
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Quiz from '../models/Quiz.js';

dotenv.config();

const buildSampleQuestions = () => [
  { text: 'What is the capital of France?', options: ['Berlin', 'Madrid', 'Paris', 'Rome'], correctAnswer: 2 },
  { text: '2 + 2 = ?', options: ['3', '4', '5', '22'], correctAnswer: 1 },
  { text: 'Which is a JS framework?', options: ['Laravel', 'Django', 'React', 'Rails'], correctAnswer: 2 },
  { text: 'HTTP status for Not Found?', options: ['200', '301', '404', '500'], correctAnswer: 2 },
  { text: 'CSS stands for?', options: ['Cascading Style Sheets', 'Computer Style Sheet', 'Creative Styling System', 'Coded Style Sheets'], correctAnswer: 0 },
  { text: 'Node.js runs on?', options: ['Browser only', 'Server-side', 'Mobile only', 'Both'], correctAnswer: 1 },
  { text: 'MongoDB is a?', options: ['Relational DB', 'Key-Value Store', 'Document DB', 'Graph DB'], correctAnswer: 2 },
  { text: 'Git command to stage all?', options: ['git add .', 'git push', 'git init', 'git clone'], correctAnswer: 0 },
  { text: 'Tailwind is a?', options: ['JS runtime', 'CSS framework', 'DB engine', 'Test tool'], correctAnswer: 1 },
  { text: 'JWT stands for?', options: ['Java Web Token', 'JSON Web Token', 'JavaScript Web Target', 'Joined Web Token'], correctAnswer: 1 }
];

const seed = async () => {
  try {
    await connectDB();

    console.log('Adding sample data...');

    // Find an existing sample teacher or create one.
    let teacher = await User.findOne({ email: 'teacher@example.com' });

    if (!teacher) {
      teacher = await User.create({
        name: 'Teacher One',
        email: 'teacher@example.com',
        password: 'password123',
        role: 'teacher'
      });
      console.log('Sample teacher created.');
    }

    // Check whether the sample quiz already exists.
    let quiz = await Quiz.findOne({
      title: 'General Knowledge Quiz',
      createdBy: teacher._id
    });

    if (!quiz) {
      quiz = await Quiz.create({
        title: 'General Knowledge Quiz',
        description: 'A basic quiz with 10 questions.',
        questions: buildSampleQuestions(),
        createdBy: teacher._id
      });
      console.log('Sample quiz created.');
    } else {
      console.log('Sample quiz already exists. Skipping.');
    }

    console.log('Seeding completed successfully.');
    console.log(`Quiz: ${quiz.title}`);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seed();
