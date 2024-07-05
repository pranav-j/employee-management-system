const EmployeeDB = require('../models/employeeDB');


const getEmployeeById = async(id) => {
    try {
        const employeeDetails = await EmployeeDB.Employee.findById(id);
        if(!employeeDetails) {
            throw new Error('Employee not found');
        }
        return employeeDetails;
    } catch (error) {
        throw new Error(`Error in getEmployeeById service: ${error.message}`);
    }
};

const addEmployee = async(empData) => {
    try {
        const employee = new EmployeeDB.Employee(empData);
        const savedEmp = await employee.save();
        if(savedEmp) {
            console.log('Employee added succesfully...............');
        }

        return savedEmp._id;
    } catch (error) {
        console.error("Error adding employee:", error);
    }
};

const deleteEmployee = async(id) => {
    try {
        const deletedEmployee = await EmployeeDB.Employee.findByIdAndDelete(id);
        return deletedEmployee;
    } catch (error) {
        console.error("Error deleting employee:", error);
    }
};

const updateEmployee = async(id, updatedData) => {
    try {
        const updatedEmpployee = await EmployeeDB.Employee.findByIdAndUpdate(id, updatedData, {new: true});
        return updatedEmpployee;
    } catch (error) {
        console.error("Error editing employee:", error);
    }
};

const getEmployees = async(searchTerm, page, limit) => {
    const regex = new RegExp(searchTerm, 'i');
    const skip = (page - 1) * limit;

    const aggregationPipeLine = [
        {
            $match: searchTerm
                ? {
                    $or: [
                        { firstName: { $regex: regex } },
                        { lastName: { $regex: regex } },
                        { email: { $regex: regex } },
                        { phone: { $regex: regex } }
                    ]
                }
                :{}
        },
        {
            $sort: { _id: -1 }
        },
        {
            $facet: {
                totalCount: [{ $count: 'count' }],
                employees: [{ $skip: skip }, { $limit: limit }]
            }
        }
    ];

    const result = await EmployeeDB.Employee.aggregate(aggregationPipeLine);

    const totalCount = result[0].totalCount[0] ? result[0].totalCount[0].count : 0;
    const employees = result[0].employees;

    return { employees, totalCount };
};

module.exports = {
    getEmployeeById,
    addEmployee,
    deleteEmployee,
    updateEmployee,
    getEmployees
};