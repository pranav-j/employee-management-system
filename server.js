require('./config/dbConfig');
require('dotenv').config();
// const authMiddleware = require('./middleware/auth');
const cookieParser = require('cookie-parser');

// const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));    //for when the data is sent directly from the form because HTML forms send data with the 'Content-Type' header set to 'application/x-www-form-urlencoded' by default
// app.use(bodyParser.json());

const router = require('./routes/router');
app.use(router);



// -----------------------------------------------------------------------------

const EmployeeDB = require('./models/employeeDB');


async function search(searchTerm) {

    try {
        // const results = await EmployeeDB.Employee.aggregate([
        //     { $match: { $text: { $search: 'Obama' } } },
        //     { $sort: { score: { $meta: "textScore" } } } // Sorting by relevance
        // ]);

        const regex = new RegExp(searchTerm, 'i'); // 'i' for case-insensitive
        const results = await EmployeeDB.Employee.find({
            $or: [
                { firstName: { $regex: regex } },
                { lastName: { $regex: regex } },
                { email: { $regex: regex } },
                { phone: { $regex: regex } }
            ]
        });
        console.log("SEARCH RESULT: ",results);
    } catch (error) {
        console.error("Error during search:", error);
    }
}
// search('ob');

// -----------------------------------------------------------------------------


app.listen(port, () => {
    console.log(`Server runnung on ${port}...............`);
})