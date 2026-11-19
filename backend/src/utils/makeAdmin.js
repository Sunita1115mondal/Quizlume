
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const promoteAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (!adminEmail) {
      throw new Error('ADMIN_EMAIL is missing from your backend .env file.');
    }

    await connectDB();

    const user = await User.findOne({ email: adminEmail });

    if (!user) {
      throw new Error(
        `No account found for ${adminEmail}. Register this account first.`
      );
    }

    if (user.role === 'admin') {
      console.log(`${user.email} is already an administrator.`);
      return;
    }

    // Change only the role. Preserve password and all other user data.
    user.role = 'admin';
    await user.save();

    console.log('Administrator role assigned successfully!');
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
  } catch (error) {
    console.error('Admin setup failed:', error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
};

promoteAdmin();
