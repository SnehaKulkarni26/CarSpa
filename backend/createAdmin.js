const bcrypt = require('bcryptjs');
const User = require('./models/User');
const sequelize = require('./config/database');
require('dotenv').config();

async function createAdminUser() {
  try {
    // Sync database first
    await sequelize.sync({ alter: true });
    console.log('Database synced');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@carspa.com' } });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@carspa.com',
      password: hashedPassword,
      isAdmin: true
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@carspa.com');
    console.log('Password: admin123');
    console.log('User ID:', adminUser.id);

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await sequelize.close();
  }
}

createAdminUser(); 