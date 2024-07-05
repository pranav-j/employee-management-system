const EmployeeDB = require('../models/employeeDB');
const employeeServices = require('../services/employeeServices');

// exports.index = async(req, res) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 5;
//     const skip = (page - 1) * limit;

//     const totalEmployees = await EmployeeDB.Employee.countDocuments();
//     // const totalPages = Math.ceil(totalEmployees / limit);
//     try {
//         // let employees = await EmployeeDB.Employee.find({}).sort({ _id: -1 }).limit(5);
//         const employees = await EmployeeDB.Employee.find({}).sort({ _id: -1 }).skip(skip).limit(limit);

//         res.render('index', {
//             employees: employees,
//             searchTerm: '',
//             currentPage: page,
//             totalPages: Math.ceil(totalEmployees / limit),
//             limit: limit
//         });
//     } catch (error) {
//         console.error("Failed to retrieve employees:", error);
//         res.status(500).send('Error retrieving employees');
//     }
// };

exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const { employees, totalCount } = await employeeServices.getEmployees('', page, limit);

        res.render('index', {
            employees: employees,
            searchTerm: '',
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            limit: limit
        });
    } catch (error) {
        console.error("Failed to retrieve employees:", error);
        res.status(500).send('Error retrieving employees');
    }
};

exports.addEmp = async(req, res) => {
    // try {
    //     const empData = req.body;
    //     const employee = new EmployeeDB.Employee(empData);
    //     const savedEmp = await employee.save();
    //     if(savedEmp) {
    //         console.log('Employee added succesfully...............');
    //     }
    //     res.status(201).json({ id: savedEmp._id });
    // } catch (error) {
    //     console.error("Error adding employee:", error);
    //     res.status(500).json({ error: error.message });
    // }
    const empData = req.body;
    const newEmployeeId = await employeeServices.addEmployee(empData);
    if(newEmployeeId) {
        console.log('Employee added succesfully...............');
    }
    res.status(201).json({ id: newEmployeeId });
};

exports.deleteEmp = async(req, res) => {
    // try {
    //     const { id } = req.params;
    //     const deletedEmployee = await EmployeeDB.Employee.findByIdAndDelete(id);

    //     if(!deletedEmployee) {
    //         return res.status(400).json({ message: "Employee not found" })
    //     }
    //     console.log('Employee deleted succesfully...............');
    //     return res.status(200).json({ message: "Employee deleted successfully" });
    // } catch (error) {
    //     return res.status(500).json({ error: error.message});
    // }

    const { id } = req.params;
    const deletedEmployee = await employeeServices.deleteEmployee(id);

    if(!deletedEmployee) {
        return res.status(400).json({ message: "Employee not found" })
    }
    console.log('Employee deleted succesfully...............');
    return res.status(200).json({ message: "Employee deleted successfully" });
};

exports.editEmpView = async(req, res) => {
    // try {
    //     const { id } = req.params;
    //     const empViewd = await EmployeeDB.Employee.findById(id);
    //     console.log(empViewd);

        // if(empViewd) {
        //     console.log('Found the employee to be viewed...............');
        //     return res.status(200).json(empViewd);
        // } else {
        //     return res.status(404).json({ message: "Employee not found to be viewed"});
        // }
    // } catch (error) {
    //     console.log('Error fetching employee to be viewed...............:', error);
    //     return res.status(500).json({ message: "Employee not found to be viewed"});
    // }
    const { id } = req.params;
    const empViewd = await employeeServices.getEmployeeById(id);

    if(empViewd) {
        console.log('Found the employee to be viewed...............');
        return res.status(200).json(empViewd);
    } else {
        return res.status(404).json({ message: "Employee not found to be viewed"});
    }
};

exports.editEmpSave = async(req, res) => {
    // try {
    //     const { id } = req.params;
    //     const updatedData = req.body;
    //     console.log('updatedData',updatedData);

    //     const updatedEmpployee = await EmployeeDB.Employee.findByIdAndUpdate(id, updatedData, {new: true});
    //     if(updatedEmpployee) {
    //         return res.status(200).json(updatedEmpployee);
    //     } else {
    //         return res.status(404).json({ message: 'Employee not found' });
    //     }

    // } catch (error) {
    //     console.log('Error updating employee...............:', error);
    //     return res.status(500).json({ error: error.message});
    // }

    const { id } = req.params;
    const updatedData = req.body;
    const updatedEmpployee = await employeeServices.updateEmployee(id, updatedData);
    if(updatedEmpployee) {
        return res.status(200).json(updatedEmpployee);
    } else {
        return res.status(404).json({ message: 'Employee not found' });
    }
};

function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

exports.empDetails = async(req, res) => {
    // try {
    //     const employee = await EmployeeDB.Employee.findById(req.params.id);
    //     if(!employee) {
    //         return res.status(404).send('Employee not found');
    //     }
    //     return res.render('view', { 
    //         employee: employee,
    //         calculateAge: calculateAge
    //      });
    // } catch (error) {
    //     res.status(500).send(error.message);
    // }

    const id = req.params.id;
    const employee = await employeeServices.getEmployeeById(id);

    if(!employee) {
        return res.status(404).send('Employee not found');
    }
    return res.render('view', { 
        employee: employee,
        calculateAge: calculateAge
    });

};

// exports.search = async(req, res) => {

//     try {
//         const searchTerm = req.query.searchTerm;
//         console.log('SEARCH TERM...............: ', searchTerm);
//         const regex = new RegExp(searchTerm, 'i'); // 'i' for case-insensitive
//         const results = await EmployeeDB.Employee.find({
//             $or: [
//                 { firstName: { $regex: regex } },
//                 { lastName: { $regex: regex } },
//                 { email: { $regex: regex } },
//                 { phone: { $regex: regex } }
//             ]
//         });
//         console.log("SEARCH RESULT: ",results);
//         res.render('index', {employees: results});
//     } catch (error) {
//         console.error("Error during search:", error);
//     }
// };

// exports.search = async (req, res) => {
//     try {
//         const searchTerm = req.query.searchTerm;
//         console.log('SEARCH TERM...............: ', searchTerm);

//         const limit = parseInt(req.query.limit) || 5;
//         const page = parseInt(req.query.page) || 1;

//         const regex = new RegExp(searchTerm, 'i');
//         const results = await EmployeeDB.Employee.find({
//             $or: [
//                 { firstName: { $regex: regex } },
//                 { lastName: { $regex: regex } },
//                 { email: { $regex: regex } },
//                 { phone: { $regex: regex } }
//             ]
//         })
//         .sort({ _id: -1 })
//         .skip((page - 1) * limit)
//         .limit(limit);

//         const totalResults = await EmployeeDB.Employee.countDocuments({
//             $or: [
//                 { firstName: { $regex: regex } },
//                 { lastName: { $regex: regex } },
//                 { email: { $regex: regex } },
//                 { phone: { $regex: regex } }
//             ]
//         });

//         const totalPages = Math.ceil(totalResults / limit);

//         res.render('index', {
//             employees: results,
//             searchTerm: searchTerm,
//             currentPage: page,
//             totalPages: totalPages,
//             limit: limit
//         });
//     } catch (error) {
//         console.error("Error during search:", error);
//         res.status(500).send('Error during search');
//     }
// };


exports.search = async (req, res) => {
    try {
        const searchTerm = req.query.searchTerm;
        console.log('SEARCH TERM...............: ', searchTerm);

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const { employees, totalCount } = await employeeServices.getEmployees(searchTerm, page, limit);

        res.render('index', {
            employees: employees,
            searchTerm: searchTerm,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            limit: limit
        });
    } catch (error) {
        console.error("Error during search:", error);
        res.status(500).send('Error during search');
    }
};