document.addEventListener('click', (event) => {

    // Handle OPTIONS
    const button = event.target.closest('.button-div button');
    // Check if the clicked element is a button within ".button-div"
    if (button) {
        // Prevent the click from closing the options immediately
        event.stopPropagation();

        // Find the closest ".button-div" and then its child ".options"
        const optionsDiv = button.closest('.button-div').querySelector('.options');

        // Toggle the visibility of the .options div
        optionsDiv.classList.toggle('show');
    } else {
        // If the click is not on a button, close all open ".options" divs
        document.querySelectorAll('.options').forEach(optionsDiv => {
            optionsDiv.classList.remove('show');
        });
    }

    // Handle ADD EMPLOYEE
    const addEmployeeBtn = event.target.closest(".add-employee-btn");
    const addEmployeeBtnClose = event.target.closest(".heading-add-emp button");
    const cancelAddEmp = event.target.closest("#cancel-add-emp");
    const addEmpBtnInForm = event.target.closest("#add-emp");

    if(addEmployeeBtn){
        const addEmpPop = document.querySelector(".add-employee");
        addEmpPop.classList.add('add-employee-show');

        document.querySelector(".main").classList.add('blur');
        document.querySelector(".side-bar").classList.add('blur');
    }
    else if(addEmployeeBtnClose || cancelAddEmp){
        // const addEmpPop = document.querySelector(".add-employee");
        document.querySelector(".add-employee").classList.remove('add-employee-show');
        document.querySelector(".main").classList.remove('blur');
        document.querySelector(".side-bar").classList.remove('blur');
    }
    // else if (addEmpErrorCnt === 0 && addEmpBtnInForm) {
    //     document.querySelector(".add-employee").classList.remove('add-employee-show');
    //     document.querySelector(".main").classList.remove('blur');
    //     document.querySelector(".side-bar").classList.remove('blur');
    //     addEmpErrorCnt = 0;
    // }



    // Handle EDIT EMPLOYEE
    const edit = event.target.closest('.edit');
    const edit_close = event.target.closest('.edit-close-btn');
    const edit_save = event.target.closest('.edit-save-btn');
    const edit_cancel = event.target.closest('.edit-cancel-btn');


    if(edit) {
        event.stopPropagation();
        document.querySelector(".main").classList.add('blur');
        document.querySelector(".side-bar").classList.add('blur');

        document.querySelector('.edit-employee').classList.remove('hide-edit');
        editEmpErrorCnt = 0;
    }
    if(edit_close || edit_cancel) {
        document.querySelector('.edit-employee').classList.add('hide-edit');
        editEmpErrorCnt = 0;
    }
    if (editEmpErrorCnt === 0 && edit_save) {
        document.querySelector('.edit-employee').classList.add('hide-edit');
        editEmpErrorCnt = 0;
    }


    // Handle DELETE EMPLOYEE
    const deletee = event.target.closest('.delete-emp-btn');

    if(deletee) {
        event.stopPropagation();
        document.querySelector(".main").classList.add('blur');
        document.querySelector(".side-bar").classList.add('blur');

        document.querySelector('.delete-emp').classList.remove('hide-delete');

    } else {
        document.querySelector('.delete-emp').classList.add('hide-delete');
    }

    // To remove BLUR

    // if(!addEmployeeBtn && !details && !edit && !deletee)

    if(!addEmployeeBtn && !edit && !deletee){
        document.querySelector(".main").classList.remove('blur');
        document.querySelector(".side-bar").classList.remove('blur');
    }
});

// To show the image priview while adding an employee

document.getElementById('upload-img').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(file) {
        const imgPreview = document.getElementById('imagePreview');
        imgPreview.src = URL.createObjectURL(file);
        imgPreview.style.display = 'block';
    }
})

// ADD EMPLOYEE -----------------------------------------------------------------------------------

function showAddPopup () {
    const addPopup = document.querySelector('.add-popup');
    addPopup.classList.remove('hide-popup');

    setTimeout(() => {
        addPopup.classList.add('hide-popup');
    }, 1000);
}

let addEmpErrorCnt = 0;

// TEST -------------------------------------------------------------------------
// this is to print formData

// document.getElementById('upload-img').addEventListener('change', (e) => {
//     const file = e.target.files[0];
//     if(file) {
//         const formData = new FormData();
//         formData.append('avatar', file);

//         for (let[key, value] of formData.entries()) {
//             console.log('IMAGE file', key, value);
//         }
//     } else {
//         console.log('you fkd up');
//     }
// })

// ------------------------------------------------------------------------------

function addEmpToTableWithoutRefresh(emp, iid) {
    const row = document.createElement("tr");

    const avatarUrl = `http://localhost:3003/images/${iid}.jpg`;


    row.innerHTML = `
    <td>#1</td>
    <td><img src="${avatarUrl}" alt="avtr" class="employee-avatar">${emp.salutation} ${emp.firstName} ${emp.lastName}</td>
    <td>${emp.email}</td>
    <td>${emp.phone}</td>
    <td>${emp.gender}</td>
    <td>${emp.dob}</td>
    <td>${emp.country}</td>
    <td>
        <div class="button-div">
            <button class="options-button"><i class="fa-solid fa-ellipsis"></i></button>
            <div class="options">
                <a href="#" class="details">View Details</a>
                <a href="#" class="edit" onclick="editEmployeeVIEW('${emp.id}', '#employee-${emp.id}')">Edit </a>
                <a href="#" class="delete-emp-btn" onclick="deleteEmployee('${emp.id}', '#employee-${emp.id}')">Delete </a>
            </div>
        </div>
    </td>
    `;



    row.setAttribute('id', `employee-${emp.id}`);

    // Get the first row of the table
    const tabeBody = document.querySelector('tbody');
    const firstRow = tabeBody.firstChild;

    // Insert the new row before the first row
    tabeBody.insertBefore(row, firstRow);
    // tabeBody.appendChild(row);

    // To update indices of existing rows
    const rows = tabeBody.querySelectorAll('tr');
    rows.forEach((row, idx) => {
        row.querySelector('td:first-child').textContent = `#${idx + 1}`;
    });
}

// better validation implementation ---------------------------------------------------------------------

// Function to validate email format
function validateEmail(email, elementId) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        document.getElementById(elementId).classList.remove('hide-error');
        return 1;
    }
    return 0;
}

// Function to validate if the field is not empty
function validateNotEmpty(value, elementId) {
    if (!value) {
        document.getElementById(elementId).classList.remove('hide-error');
        return 1;
    }
    return 0;
}

// Function to validate phone number length
function validatePhoneNumber(number, elementId) {
    if (!number || number.length !== 10) {
        document.getElementById(elementId).classList.remove('hide-error');
        return 1;
    }
    return 0;
}

document.querySelector("#add-emp").addEventListener('click', () => {

    const salutation = document.getElementById('salutation').value;
    const f_name = document.getElementById('f-name').value;
    const s_name = document.getElementById('s-name').value;
    const mail = document.getElementById('mail').value;
    const num = document.getElementById('num').value;
    const date = document.getElementById('date').value;
    const genderValue = document.querySelector('input[name="gender"]:checked');
    const gender = genderValue ? genderValue.value : "";
    const address = document.getElementById('address').value;
    const qualification = document.getElementById('qualification').value;
    const country = document.getElementById('country').value;
    const state = document.getElementById('state').value;
    const city = document.getElementById('city').value;
    const pin = document.getElementById('pin').value;

    const [year, month, day] = date.split("-");
    const dob = `${year}-${month}-${day}`;

    let addEmpErrorCnt = 0;

    addEmpErrorCnt += validateNotEmpty(salutation, 'e1');
    addEmpErrorCnt += validateNotEmpty(f_name, 'e2');
    addEmpErrorCnt += validateNotEmpty(s_name, 'e3');
    addEmpErrorCnt += validateEmail(mail, 'e4');
    addEmpErrorCnt += validatePhoneNumber(num, 'e5');
    addEmpErrorCnt += validateNotEmpty(date, 'e6');
    addEmpErrorCnt += validateNotEmpty(genderValue, 'e7');
    addEmpErrorCnt += validateNotEmpty(address, 'e8');
    addEmpErrorCnt += validateNotEmpty(qualification, 'e9');
    addEmpErrorCnt += validateNotEmpty(country, 'e10');
    addEmpErrorCnt += validateNotEmpty(state, 'e11');
    addEmpErrorCnt += validateNotEmpty(city, 'e12');
    addEmpErrorCnt += validateNotEmpty(pin, 'e13');

    const newEmployee = {
        salutation: salutation,
        firstName: f_name,
        lastName: s_name,
        email: mail,
        phone: num,
        dob: dob,
        gender: gender,
        qualifications: qualification,
        address: address,
        country: country,
        state: state,
        city: city,
        pin: pin,
        username: f_name,
        password: num
    };

    if (addEmpErrorCnt === 0) {
        fetch("http://localhost:3003/addEmployee", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(newEmployee),
        })
        .then(response => response.json())
        .then(data => {
            console.log(`NEW EMPLOYEE :`, data);
            showAddPopup();
            console.log('addEmpErrorCnt : ', addEmpErrorCnt);

            const iamgeForm = document.getElementById('image-upload-form');
            const iamgeFormData = new FormData(iamgeForm);

            fetch(`http://localhost:3003/employees/${data.id}/avatar`, {
                method: "POST",
                body: iamgeFormData
            })
            .then(response => {
                if (response.ok) {
                    console.log("Image uploaded : ", response);

                    document.querySelector(".add-employee").classList.remove('add-employee-show');
                    document.querySelector(".main").classList.remove('blur');
                    document.querySelector(".side-bar").classList.remove('blur');
                    addEmpErrorCnt = 0;

                    // adding employee to the table without refreshing
                    addEmpToTableWithoutRefresh(newEmployee, data.id);
                } else {
                    console.log('Failed to upload image');
                }
            })
            .catch(error => {
                console.log("Error uploading image : ", error);
            });
        })
        .catch(error => {
            console.log("Error : ", error);
        });
    }
});

// ------------------------------------------------------------------------------------------------------

// document.querySelector("#add-emp").addEventListener('click', () => {

//     const salutation = document.getElementById('salutation').value;
//     const f_name = document.getElementById('f-name').value;
//     const s_name = document.getElementById('s-name').value;
//     const mail = document.getElementById('mail').value;
//     const num = document.getElementById('num').value;

//     const date = document.getElementById('date').value;
//     const [year, month, day] = date.split("-");
//     const dob =`${year}-${month}-${day}`;
//     // const dob =`${day}-${month}-${year}`;

//     const genderValue = document.querySelector('input[name="gender"]:checked');
//     const gender = genderValue ? genderValue.value : "";

//     const address = document.getElementById('address').value;
//     const qualification = document.getElementById('qualification').value;
//     const country = document.getElementById('country').value;
//     const state = document.getElementById('state').value;
//     const city = document.getElementById('city').value;
//     const pin = document.getElementById('pin').value;


//     // Function to validate email format
//     function validateEmail(email) {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return emailRegex.test(email);
//     }

//     if(!salutation) {
//         const salutationError = document.getElementById('e1');
//         salutationError.classList.remove('hide-error');
//         addEmpErrorCnt++;
//     }
//     if(!f_name) {
//         const f_nameError = document.getElementById('e2');
//         f_nameError.classList.remove('hide-error');
//         addEmpErrorCnt++;
//     }
//     if(!s_name) {
//         const s_nameError = document.getElementById('e3');
//         s_nameError.classList.remove('hide-error');
//         addEmpErrorCnt++;
//     }
//     if(!mail || !validateEmail(mail)) {
//         const emailError = document.getElementById('e4');
//         emailError.classList.remove('hide-error');
//         addEmpErrorCnt++;
//     }
//     if(!num || num.length !== 10) {
//         const numError = document.getElementById('e5');
//         numError.classList.remove('hide-error');
//         addEmpErrorCnt++;
//     }
//     if(!date) {
//         const dateError = document.getElementById('e6');
//         dateError.classList.remove('hide-error');
//         addEmpErrorCnt++;
//     }
//     if(!genderValue) {
//         const genderError = document.getElementById('e7');
//         genderError.classList.remove('hide-error');
//         addEmpErrorCnt++;
//     }
//     if(!address) {
//         const addressError = document.getElementById('e8');
//         addressError.classList.remove('hide-error');
//         addEmpErrorCnt++;
//     }
//     if(!qualification) {
//         const qualificationError = document.getElementById('e9');
//         qualificationError.classList.remove('hide-error');
//         addEmpErrorCnt++;
//     }
//     if(!country) {
//         const countryError = document.getElementById('e10');
//         countryError.classList.remove('hide-error');
//         addEmpErrorCnt++;
//     }
//     if(!state) {
//         const stateError = document.getElementById('e11');
//         stateError.classList.remove('hide-error');
//         addEmpErrorCnt++;
//     }
//     if(!city) {
//         const cityError = document.getElementById('e12');
//         cityError.classList.remove('hide-error');
//         addEmpErrorCnt++;
//     }
//     if(!pin) {
//         const pinError = document.getElementById('e13');
//         pinError.classList.remove('hide-error');
//         addEmpErrorCnt++;
//     }

//     // console.log(dob);

//     const newEmployee = {
//         salutation : salutation,
//         firstName : f_name,
//         lastName : s_name,
//         email : mail,
//         phone : num,
//         dob : dob,
//         gender : gender,
//         qualifications : qualification,
//         address : address,
//         country : country,
//         state : state,
//         city : city,
//         pin : pin,
//         username : f_name,
//         password : num
//     };

//     if (addEmpErrorCnt === 0) {
//         fetch("http://localhost:3003/addEmployee", {
//             method: "POST",
//             headers: {
//                 "Content-type": "application/json",
//             },
//             body: JSON.stringify(newEmployee),
//         })
//         .then(response => {
//             return response.json();
//         })
//         .then(data => {
//             console.log(`NEW EMPLOYEE :`, data);
//             // console.log(`new emp id : `, data.id);
//             showAddPopup();
//             console.log('addEmpErrorCnt : ', addEmpErrorCnt);
//             // console.log(`FIRST name:`, data.firstName);


//             const iamgeForm = document.getElementById('image-upload-form');
//             const iamgeFormData = new FormData(iamgeForm);


//             fetch(`http://localhost:3003/employees/${data.id}/avatar`, {
//                 method: "POST",
//                 body: iamgeFormData
//             })
//             .then(response => {
                
//                 if (response.ok) {
//                     console.log("Image uploaded : ", response);

//                     document.querySelector(".add-employee").classList.remove('add-employee-show');
//                     document.querySelector(".main").classList.remove('blur');
//                     document.querySelector(".side-bar").classList.remove('blur');
//                     addEmpErrorCnt = 0;

//                     // adding employee to the table without refreshing----------------------------------------
//                     addEmpToTableWithoutRefresh(newEmployee, data.id);
//                 } else {
//                     console.log('Failed to upload image');
//                     // throw new Error('Failed to upload image');
//                 }
    
//             })
//             .catch(error => {
//                 console.log("Error uploading image : ", error);
//             });
//         })
//         .catch(error => {
//             console.log("Error : ", error);
//         });
//     }


// });

// Making DELETE EMPPLOYEE functional -----------------------------------------------------------------------

function showDeletePopup () {
    const deletePopup = document.querySelector('.delete-popup');
    deletePopup.classList.remove('hide-popup');

    setTimeout(() => {
        deletePopup.classList.add('hide-popup');
    }, 1000);
}

function deleteEmployee(id, elementSelector) {

    const deletePopup = document.querySelector('.delete-emp-inner-btn');
    deletePopup.addEventListener('click', () => {
        fetch(`http://localhost:3003/employees/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-type": "application/json",
            }
        })
        .then(response => {
            // This is important since FETCH always succeeds unless it is a nework error or something of
            // that sort.
            // https://www.youtube.com/watch?v=cuEtnrL9-H0&ab_channel=WebDevSimplified
            if(response.ok){
                console.log('Deletion succesfull: ', response);
                showDeletePopup();
                
                const rowToDelete = document.querySelector(elementSelector);
                if(rowToDelete) {
                    rowToDelete.remove();
                    updateIndicesAfterDeletion();
                }
            } else {
                console.log('ERROR: ', response);
            }
        })
        .catch(error => {
            console.log('ERROR: ', error);
        })
    })

    
};

function updateIndicesAfterDeletion () {
    const tableRows = document.querySelectorAll('tbody tr');
    console.log('tableRows : ', tableRows);
    tableRows.forEach((row, index) => {
        const indexColumn = row.querySelector('td:first-child');
        console.log('indexColumns : ', indexColumn);
        if(indexColumn) {
            indexColumn.textContent = `#${index + 1}`;
        }
    })
}

// Making EDIT EMPLOYEE functional -----------------------------------------------------------------------

// To populate the EDIT EMPLOYEE form

function editEmployeeVIEW(id) {
    fetch(`http://localhost:3003/edit-employees-view/${id}`)
    .then(data_of_emp => {
        const empIdData = data_of_emp.json();
        return empIdData;
    })
    .then(emp_specific_data => {
        console.table('Employee to be viewed: ',emp_specific_data);

        const avatarUrl =`http://localhost:3003/images/${id}.jpg`;
        document.getElementById('edit-avatar').src = avatarUrl;

        document.getElementById('salutation-edit').value = emp_specific_data.salutation || '';
        document.getElementById('f-name-edit').value = emp_specific_data.firstName || '';
        document.getElementById('s-name-edit').value = emp_specific_data.lastName || '';
        document.getElementById('mail-edit').value = emp_specific_data.email || '';
        document.getElementById('num-edit').value = emp_specific_data.phone || '';
        document.getElementById('date-edit').value = new Date(emp_specific_data.dob).toISOString().split('T')[0] || '';
        // document.getElementById('date-edit').value = emp_specific_data.dob || '';
        // document.getElementById('date-edit').value = emp_specific_data.dob.split('-').reverse().join('-') || '';
        document.querySelector(`#edit-employee-form input[name="gender"][value="${emp_specific_data.gender}"]`).checked = true;
        document.getElementById('address-edit').value = emp_specific_data.address || '';
        document.getElementById('qualification-edit').value = emp_specific_data.qualifications || '';
        document.getElementById('country-edit').value = emp_specific_data.country || '';
        document.getElementById('state-edit').value = emp_specific_data.state || '';
        document.getElementById('city-edit').value = emp_specific_data.city || '';
        document.getElementById('pin-edit').value = emp_specific_data.pin || '';

        // Set the employee ID as an attribute on the save button for later use
        // document.querySelector('#edit-save-btn').setAttribute('onclick', editEmployeeSAVE(`${emp_specific_data.id}`));
        // The issue with the above line is that it will trigger the editEmployeeSAVE fn along with
        // the click that initiates the viewing of the data to be edited.
        document.querySelector('#edit-save-btn').setAttribute('emp-specific-id', id);
    })
    .catch(error => {
        console.log(error);
    })
}

// To save the edits

function showEditPopup () {
    const editPopup = document.querySelector('.edit-popup');
    editPopup.classList.remove('hide-popup');

    setTimeout(() => {
        editPopup.classList.add('hide-popup');
    }, 1000);
}

let editEmpErrorCnt = 0;

// function editEmployeeSAVE(id) {

//     const salutation = document.getElementById('salutation-edit').value;
//     const f_name = document.getElementById('f-name-edit').value;
//     const s_name = document.getElementById('s-name-edit').value;
//     const mail = document.getElementById('mail-edit').value;
//     const num = document.getElementById('num-edit').value;

//     const date = document.getElementById('date-edit').value;
//     const [year, month, day] = date.split("-");
//     const dob =`${year}-${month}-${day}`;

//     const genderValue = document.querySelector('input[name="gender"]:checked');
//     const gender = genderValue ? genderValue.value : "";

//     const address = document.getElementById('address-edit').value;
//     const qualification = document.getElementById('qualification-edit').value;
//     const country = document.getElementById('country-edit').value;
//     const state = document.getElementById('state-edit').value;
//     const city = document.getElementById('city-edit').value;
//     const pin = document.getElementById('pin-edit').value;


//     // Function to validate email format
//     function validateEmail(email) {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return emailRegex.test(email);
//     }

//     if(!salutation) {
//         const salutationError = document.getElementById('ee1');
//         salutationError.classList.remove('hide-error');
//         editEmpErrorCnt++;
//     }
//     if(!f_name) {
//         const f_nameError = document.getElementById('ee2');
//         f_nameError.classList.remove('hide-error');
//         editEmpErrorCnt++;
//     }
//     if(!s_name) {
//         const s_nameError = document.getElementById('ee3');
//         s_nameError.classList.remove('hide-error');
//         editEmpErrorCnt++;
//     }
//     if(!mail || !validateEmail(mail)) {
//         const emailError = document.getElementById('ee4');
//         emailError.classList.remove('hide-error');
//         editEmpErrorCnt++;
//     }
//     if(!num || num.length !== 10) {
//         const numError = document.getElementById('ee5');
//         numError.classList.remove('hide-error');
//         editEmpErrorCnt++;
//     }
//     if(!date) {
//         const dateError = document.getElementById('ee6');
//         dateError.classList.remove('hide-error');
//         editEmpErrorCnt++;
//     }
//     if(!genderValue) {
//         const genderError = document.getElementById('ee7');
//         genderError.classList.remove('hide-error');
//         editEmpErrorCnt++;
//     }
//     if(!address) {
//         const addressError = document.getElementById('ee8');
//         addressError.classList.remove('hide-error');
//         editEmpErrorCnt++;
//     }
//     if(!qualification) {
//         const qualificationError = document.getElementById('ee9');
//         qualificationError.classList.remove('hide-error');
//         editEmpErrorCnt++;
//     }
//     if(!country) {
//         const countryError = document.getElementById('ee10');
//         countryError.classList.remove('hide-error');
//         editEmpErrorCnt++;
//     }
//     if(!state) {
//         const stateError = document.getElementById('ee11');
//         stateError.classList.remove('hide-error');
//         editEmpErrorCnt++;
//     }
//     if(!city) {
//         const cityError = document.getElementById('ee12');
//         cityError.classList.remove('hide-error');
//         editEmpErrorCnt++;
//     }
//     if(!pin) {
//         const pinError = document.getElementById('ee13');
//         pinError.classList.remove('hide-error');
//         editEmpErrorCnt++;
//     }



//     const editEmployee = {
//         salutation : salutation,
//         firstName : f_name,
//         lastName : s_name,
//         email : mail,
//         phone : num,
//         dob : dob,
//         gender : gender,
//         qualifications : qualification,
//         address : address,
//         country : country,
//         state : state,
//         city : city,
//         pin : pin,
//         username : f_name,
//         password : num
//     };

//     if(editEmpErrorCnt === 0) {
//         fetch(`http://localhost:3003/edit-employees-save/${id}`, {
//             method: 'PUT',
//             headers: {
//                 "Content-type": "application/json",
//             },
//             body: JSON.stringify(editEmployee),
//         })
//         .then(response => {
//             if(response.ok){
//                 console.log('Succesfully editted: ', response);
//                 showEditPopup();
//                 console.log('editEmpErrorCnt : ', editEmpErrorCnt);
    
//                 // Making edits reflect on  the frontend without refreshing ------------------------
        
//                 const rowToUpdate = document.querySelector(`#employee-${id}`);
//                 console.log('rowToUpdate : ', rowToUpdate);
    
//                 const index = rowToUpdate ? rowToUpdate.cells[0].textContent : null;

//                 // const index = empData.findIndex(emp => emp.id == id);
    
//                 if(rowToUpdate) {
//                     rowToUpdate.innerHTML = `
//                     <td>${index}</td>
//                     <td><img src="http://localhost:3003/images/${id}.jpg" alt="avtr" class="employee-avatar">${f_name} ${s_name}</td>
//                     <td>${mail}</td>
//                     <td>${num}</td>
//                     <td>${gender}</td>
//                     <td>${dob}</td>
//                     <td>${country}</td>
//                     <td>
//                         <div class="button-div">
//                             <button class="options-button"><i class="fa-solid fa-ellipsis"></i></button>
//                             <div class="options">
//                                 <a href="#" class="details">View Details</a>
//                                 <a href="#" class="edit" onclick="editEmployeeVIEW('${id}', '#employee-${id}')">Edit </a>
//                                 <a href="#" class="delete-emp-btn" onclick="deleteEmployee('${id}', '#employee-${id}')">Delete </a>
//                             </div>
//                         </div>
//                     </td>
//                 `;
//                 }
    
//                 // ---------------------------------------------------------------------------------
    
//                 editEmpErrorCnt = 0;
                
//                 // const edittedImg = document.getElementById('edit-emp-img');

//                 const iamgeFormInput = document.getElementById('edit-emp-img');

//                 const iamgeForm = document.getElementById('image-upload-form-edit');
//                 const iamgeFormData = new FormData(iamgeForm);

//                 if(iamgeFormInput.files.length > 0) {
//                     fetch(`http://localhost:3003/employees/${id}/avatar`, {
//                         method : 'POST',
//                         body : iamgeFormData
//                     })
//                     .then(response => {
//                         console.log("Image uploaded : ", response);
//                     })
//                     .catch(error => {
//                         console.log("Error uploading image : ", error);
//                     })
//                 } else {
//                     console.log("No image selected for upload...............");
//                 }
    
//             } else {
//                 console.log('ERROR: ', response);
//             }
//         })
//         .catch(error => {
//             console.log('ERROR: ', error);
//         });
    
//     }

// }

function editEmployeeSAVE(id) {
    const salutation = document.getElementById('salutation-edit').value;
    const f_name = document.getElementById('f-name-edit').value;
    const s_name = document.getElementById('s-name-edit').value;
    const mail = document.getElementById('mail-edit').value;
    const num = document.getElementById('num-edit').value;
    const date = document.getElementById('date-edit').value;
    const [year, month, day] = date.split("-");
    const dob = `${year}-${month}-${day}`;
    const genderValue = document.querySelector('input[name="gender"]:checked');
    const gender = genderValue ? genderValue.value : "";
    const address = document.getElementById('address-edit').value;
    const qualification = document.getElementById('qualification-edit').value;
    const country = document.getElementById('country-edit').value;
    const state = document.getElementById('state-edit').value;
    const city = document.getElementById('city-edit').value;
    const pin = document.getElementById('pin-edit').value;

    editEmpErrorCnt = 0;

    editEmpErrorCnt += validateNotEmpty(salutation, 'ee1');
    editEmpErrorCnt += validateNotEmpty(f_name, 'ee2');
    editEmpErrorCnt += validateNotEmpty(s_name, 'ee3');
    editEmpErrorCnt += validateEmail(mail, 'ee4');
    editEmpErrorCnt += validatePhoneNumber(num, 'ee5');
    editEmpErrorCnt += validateNotEmpty(date, 'ee6');
    editEmpErrorCnt += validateNotEmpty(genderValue, 'ee7');
    editEmpErrorCnt += validateNotEmpty(address, 'ee8');
    editEmpErrorCnt += validateNotEmpty(qualification, 'ee9');
    editEmpErrorCnt += validateNotEmpty(country, 'ee10');
    editEmpErrorCnt += validateNotEmpty(state, 'ee11');
    editEmpErrorCnt += validateNotEmpty(city, 'ee12');
    editEmpErrorCnt += validateNotEmpty(pin, 'ee13');

    const editEmployee = {
        salutation: salutation,
        firstName: f_name,
        lastName: s_name,
        email: mail,
        phone: num,
        dob: dob,
        gender: gender,
        qualifications: qualification,
        address: address,
        country: country,
        state: state,
        city: city,
        pin: pin,
        username: f_name,
        password: num
    };

    if (editEmpErrorCnt === 0) {
        fetch(`http://localhost:3003/edit-employees-save/${id}`, {
            method: 'PUT',
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(editEmployee),
        })
        .then(response => {
            if (response.ok) {
                console.log('Successfully edited: ', response);
                showEditPopup();
                console.log('editEmpErrorCnt : ', editEmpErrorCnt);

                // Making edits reflect on the frontend without refreshing
                const rowToUpdate = document.querySelector(`#employee-${id}`);
                console.log('rowToUpdate : ', rowToUpdate);

                const index = rowToUpdate ? rowToUpdate.cells[0].textContent : null;

                if (rowToUpdate) {
                    rowToUpdate.innerHTML = `
                    <td>${index}</td>
                    <td><img src="http://localhost:3003/images/${id}.jpg" alt="avtr" class="employee-avatar">${f_name} ${s_name}</td>
                    <td>${mail}</td>
                    <td>${num}</td>
                    <td>${gender}</td>
                    <td>${dob}</td>
                    <td>${country}</td>
                    <td>
                        <div class="button-div">
                            <button class="options-button"><i class="fa-solid fa-ellipsis"></i></button>
                            <div class="options">
                                <a href="#" class="details">View Details</a>
                                <a href="#" class="edit" onclick="editEmployeeVIEW('${id}', '#employee-${id}')">Edit </a>
                                <a href="#" class="delete-emp-btn" onclick="deleteEmployee('${id}', '#employee-${id}')">Delete </a>
                            </div>
                        </div>
                    </td>
                `;
                }

                editEmpErrorCnt = 0;

                const iamgeFormInput = document.getElementById('edit-emp-img');
                const iamgeForm = document.getElementById('image-upload-form-edit');
                const iamgeFormData = new FormData(iamgeForm);

                if (iamgeFormInput.files.length > 0) {
                    fetch(`http://localhost:3003/employees/${id}/avatar`, {
                        method: 'POST',
                        body: iamgeFormData
                    })
                    .then(response => {
                        console.log("Image uploaded : ", response);
                    })
                    .catch(error => {
                        console.log("Error uploading image : ", error);
                    });
                } else {
                    console.log("No image selected for upload...............");
                }
            } else {
                console.log('ERROR: ', response);
            }
        })
        .catch(error => {
            console.log('ERROR: ', error);
        });
    }
}


document.querySelector('#edit-save-btn').addEventListener('click', (event) => {
    const empId = event.currentTarget.getAttribute('emp-specific-id');
    console.log(empId);
    editEmployeeSAVE(empId);
});