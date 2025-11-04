const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Employee = require('./models/Employee');
require('dotenv').config({ path: __dirname + '/.env' });

const employees = [
  {
    employeeId: 'emp001',
    password: 'password123'
  },
  {
    employeeId: 'emp002',
    password: 'password456'
  }
];

const seedDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await Employee.deleteMany({});

  for (const employeeData of employees) {
    const employee = new Employee(employeeData);
    await employee.save();
  }

  console.log('Employees seeded');
  mongoose.connection.close();
};

seedDB().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
