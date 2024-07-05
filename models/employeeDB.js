const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    salutation: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    dob: Date,
    gender: String,
    qualifications: String,
    address: String,
    country: String,
    state: String,
    city: String,
    pin: String,
    username: String,
    password: String, // Consider hashing passwords with bcrypt
    // id: String,
    avatar: String
  }, { timestamps: true }
);

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = { Employee };











// --------------------------------------------------------------------------------------------
// employeeSchema.index({
//   firstName: 'text',
//   lastName: 'text',
//   email: 'text',
//   phone: 'text'
// });

// const Employee = mongoose.model('Employee', employeeSchema);

// -----------------------------------------------------------------------------

// const setupIndexes = async() => {
//     try {

//       await Employee.createIndexes(); // This method will create all indexes defined on the schema
//       console.log("Indexes created successfully.");
//       // -------------------------------------------------------
//       // const createIndexes = await Employee.createIndexes({
//       //     firstName: 'text',
//       //     lastName: 'text',
//       //     email: 'text',
//       //     phone: 'text'
//       // });
//       // console.log("Indexes creation result:", createIndexes);
//       // -------------------------------------------------------
//   } catch (error) {
//       console.error("Error creating indexes:", error);
//       throw error;  // Important to re-throw the error to catch it in the calling function
//   }
// }

// module.exports = Employee;
// module.exports = { Employee };