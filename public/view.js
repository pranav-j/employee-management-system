document.addEventListener('click', (e) => {
    const edit = e.target.closest('#edit-in-view');
    const closeEdit = e.target.closest('.edit-close-btn');
    const cancell = e.target.closest('.edit-cancel-btn')
    const save = e.target.closest('#edit-save-btn');


    if(edit) {
        document.querySelector('#edit-employee-form').classList.remove('hide-edit');
        document.querySelector('.emp-details').classList.add('hide-details');
        editEmpErrorCnt = 0;
    }
    if (closeEdit || cancell) {
        document.querySelector('#edit-employee-form').classList.add('hide-edit');
        document.querySelector('.emp-details').classList.remove('hide-details');
        editEmpErrorCnt = 0;
    }
    if (editEmpErrorCnt === 0 &&  save) {
        document.querySelector('#edit-employee-form').classList.add('hide-edit');
        document.querySelector('.emp-details').classList.remove('hide-details');
        editEmpErrorCnt = 0;
    }

    const deletee = e.target.closest('#delete-in-view');
    const cancel = e.target.closest('.cancel-btn');
    const closeDelete = e.target.closest('.close-delete');
    // const deleteBtn = e.target.closest('.delete-emp-inner-btn');


    if(deletee) {
        document.querySelector('.delete-emp').classList.remove('hide-delete');
        document.querySelector('.emp-details').classList.add('hide-details');
    } else if (cancel || closeDelete) {
        document.querySelector('.delete-emp').classList.add('hide-delete');
        document.querySelector('.emp-details').classList.remove('hide-details');
    }
})

function deleteEmployee(id) {

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
                document.querySelector('.delete-emp').classList.add('hide-delete');
                document.querySelector('.deleted').classList.remove('hide-deleted');
            } else {
                console.log('ERROR: ', response);
            }
        })
        .catch(error => {
            console.log('ERROR: ', error);
        })
    })

    
};

function editEmployeeVIEW(id) {
    fetch(`http://localhost:3003/edit-employees-view/${id}`)
    .then(data_of_emp => {
        const empIdData = data_of_emp.json();
        return empIdData;
    })
    .then(emp_specific_data => {
        console.table(emp_specific_data);

        const avatarUrl =`http://localhost:3003/images/${id}.jpg`;
        document.getElementById('edit-avatar').src = avatarUrl;

        document.getElementById('salutation-edit').value = emp_specific_data.salutation || '';
        document.getElementById('f-name-edit').value = emp_specific_data.firstName || '';
        document.getElementById('s-name-edit').value = emp_specific_data.lastName || '';
        document.getElementById('mail-edit').value = emp_specific_data.email || '';
        document.getElementById('num-edit').value = emp_specific_data.phone || '';
        document.getElementById('date-edit').value = new Date(emp_specific_data.dob).toISOString().split('T')[0] || '';
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
        document.querySelector('#edit-save-btn').setAttribute('emp-specific-id', emp_specific_data.id);


        document.querySelector('#edit-save-btn').addEventListener('click', function() { editEmployeeSAVE(id); });        

    })
    .catch(error => {
        console.log(error);
    })
};

let editEmpErrorCnt = 0;

function editEmployeeSAVE(id) {

    const salutation = document.getElementById('salutation-edit').value;
    const f_name = document.getElementById('f-name-edit').value;
    const s_name = document.getElementById('s-name-edit').value;
    const mail = document.getElementById('mail-edit').value;
    const num = document.getElementById('num-edit').value;

    const date = document.getElementById('date-edit').value;
    const [year, month, day] = date.split("-");
    const dob =`${year}-${month}-${day}`;

    const genderValue = document.querySelector('input[name="gender"]:checked');
    const gender = genderValue ? genderValue.value : "";

    const address = document.getElementById('address-edit').value;
    const qualification = document.getElementById('qualification-edit').value;
    const country = document.getElementById('country-edit').value;
    const state = document.getElementById('state-edit').value;
    const city = document.getElementById('city-edit').value;
    const pin = document.getElementById('pin-edit').value;


    // Function to validate email format
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    if(!salutation) {
        const salutationError = document.getElementById('ee1');
        salutationError.classList.remove('hide-error');
        editEmpErrorCnt++;
    }
    if(!f_name) {
        const f_nameError = document.getElementById('ee2');
        f_nameError.classList.remove('hide-error');
        editEmpErrorCnt++;
    }
    if(!s_name) {
        const s_nameError = document.getElementById('ee3');
        s_nameError.classList.remove('hide-error');
        editEmpErrorCnt++;
    }
    if(!mail || !validateEmail(mail)) {
        const emailError = document.getElementById('ee4');
        emailError.classList.remove('hide-error');
        editEmpErrorCnt++;
    }
    if(!num || num.length !== 10) {
        const numError = document.getElementById('ee5');
        numError.classList.remove('hide-error');
        editEmpErrorCnt++;
    }
    if(!date) {
        const dateError = document.getElementById('ee6');
        dateError.classList.remove('hide-error');
        editEmpErrorCnt++;
    }
    if(!genderValue) {
        const genderError = document.getElementById('ee7');
        genderError.classList.remove('hide-error');
        editEmpErrorCnt++;
    }
    if(!address) {
        const addressError = document.getElementById('ee8');
        addressError.classList.remove('hide-error');
        editEmpErrorCnt++;
    }
    if(!qualification) {
        const qualificationError = document.getElementById('ee9');
        qualificationError.classList.remove('hide-error');
        editEmpErrorCnt++;
    }
    if(!country) {
        const countryError = document.getElementById('ee10');
        countryError.classList.remove('hide-error');
        editEmpErrorCnt++;
    }
    if(!state) {
        const stateError = document.getElementById('ee11');
        stateError.classList.remove('hide-error');
        editEmpErrorCnt++;
    }
    if(!city) {
        const cityError = document.getElementById('ee12');
        cityError.classList.remove('hide-error');
        editEmpErrorCnt++;
    }
    if(!pin) {
        const pinError = document.getElementById('ee13');
        pinError.classList.remove('hide-error');
        editEmpErrorCnt++;
    }


    // console.log(dob);

    const editEmployee = {
        salutation : salutation,
        firstName : f_name,
        lastName : s_name,
        email : mail,
        phone : num,
        dob : dob,
        gender : gender,
        qualifications : qualification,
        address : address,
        country : country,
        state : state,
        city : city,
        pin : pin,
        username : f_name,
        password : num
    };

    fetch(`http://localhost:3003/edit-employees-save/${id}`, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(editEmployee),
    })
    .then(response => {
        if(response.ok){
            console.log('Succesfully editted: ', response);
            updateFrontendWithEdits(editEmployee);
            editEmpErrorCnt = 0;
            
            const edittedImg = document.getElementById('edit-emp-img');
            if(edittedImg.files.length > 0) {
                const img = new FormData();
                img.append("avatar", edittedImg.files[0]);
                fetch(`http://localhost:3003/employees/${id}/avatar`, {
                    method : 'POST',
                    body : img
                })
                .then(response => {
                    console.log("Image uploaded : ", response);
                })
                .catch(error => {
                    console.log("Error uploading image : ", error);
                })
            } else {
                console.log("No image selected for upload.");
            }

        } else {
            console.log('ERROR: ', response);
        }
    })
    .catch(error => {
        console.log('ERROR: ', error);
    });
}

function updateFrontendWithEdits(editEmpData) {
    // document.getElementById('emp-details-avatar').src = avatarUrl;
    document.getElementById('emp-details-name').textContent = `${editEmpData.salutation} ${editEmpData.firstName} ${editEmpData.lastName}`;
    document.getElementById('emp-details-gender').textContent = editEmpData.gender;
    document.getElementById('emp-details-email').textContent = editEmpData.email;
    // document.getElementById('emp-details-age').textContent = calculateAge(dateOfBirth);
    document.getElementById('emp-details-dob').textContent = editEmpData.dob;
    document.getElementById('emp-details-phone').textContent = editEmpData.phone;
    document.getElementById('emp-details-qualifications').textContent = editEmpData.qualifications;
    document.getElementById('emp-details-address').textContent = editEmpData.address;
    document.getElementById('emp-details-username').textContent = editEmpData.username; 
}