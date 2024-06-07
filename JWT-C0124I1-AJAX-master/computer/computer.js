// dang dung dc token lay san tu postmane
// let token="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTcxNzQ3MTUxOSwiZXhwIjoxNzE3NTU3OTE5fQ._4JNEiaMUdmgYwnc_BqX686nFf5OzTlh0_KLM2mmK8o";
let us = docLocalStorage();
// neu chua dang nhap thi doc localstorage null
if (us == null) {
    // chuyen ve trang dang nhap
    window.location.href = "../login/login.html"
}
let token = us.token;
//VIEW

function showAllCustomer() {
    $.ajax({
        headers: {
            "Authorization": "Bearer " + token
        },
        method: "GET",
        url: "http://localhost:8080/api/computer",
        success: function (data) {
            console.log(data);
            if (data != null && data.length > 0) {
                let content = `
                <table id="display-list" border="1">
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>`;
                for (let i = 0; i < data.length; i++) {
                    let statusText = data[i].status ? 'Online' : 'Offline';
                    content += `
                    <tr>
                        <td>${data[i].id}</td>
                        <td>${data[i].name}</td>
                        <td>${statusText}</td>
                        <td>
                            <a href="#" onclick="showComputerDetails(${data[i].id})">Details</a> |
                            <a href="#" onclick="fetchCustomerForUpdate(${data[i].id})">Update</a> |
                            <a href="#" onclick="deleteSmartphone(${data[i].id})">Delete</a>
                        </td>
                    </tr>`;
                }
                content += "</table>";
                document.getElementById('customerList').innerHTML = content;
                document.getElementById('customerList').style.display = "block";
                document.getElementById('add-customer').style.display = "none";
                document.getElementById('update-computer').style.display = "none";
                document.getElementById('title').style.display = "block";
            } else {
                document.getElementById('customerList').innerHTML = "No data available";
            }
        }
    });
}

function showComputerDetails(id) {
    $.ajax({
        headers: {
            "Authorization": "Bearer " + token
        },
        method: "GET",
        url: `http://localhost:8080/api/computer/${id}`,
        success: function (data) {
            if (data.status) {
                alert(`Computer is online.\nUsage Time: ${data.usageTime} hours\nService Cost: ${data.serviceCost}`);
            } else {
                alert('Computer is offline.');
            }
        }
    });
}

function docLocalStorage() {
    let userString = localStorage.getItem("u");
    let user = JSON.parse(userString);
    return user;
}
//ADD

function displayFormCreate() {
    document.getElementById('customerList').style.display = "none";
    document.getElementById('add-customer').style.display = "block";
    document.getElementById('display-create').style.display = "none";
    document.getElementById('title').style.display = "none";
}

function createComputer() {
    let name = document.getElementById("create-name").value;

    let newComputer = {
        "name": name
    };

    $.ajax({
        headers: {
            "Authorization": "Bearer " + token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "POST",
        data: JSON.stringify(newComputer),
        url: "http://localhost:8080/api/computer/create",
        success: function (data) {
            alert("Computer created successfully!");
            showAllCustomer();
            document.getElementById("create-name").value = ""; // Reset input field
        },
        error: function (error) {
            alert("Error creating computer: " + error.responseText);
        }
    });
}
// DELETE

function deleteSmartphone(id) {
    let confirmation = confirm("Are you sure you want to delete this computer?");
    if (confirmation) {
        $.ajax({
            headers: {
                "Authorization": "Bearer " + token
            },
            type: "DELETE",

            url: `http://localhost:8080/api/computer/${id}`,

            success: function () {
                showAllCustomer()
            }
        });
    }
}

let currentUpdateId = null;

// UPDATE
function displayUpdateForm(customer) {
    currentUpdateId = customer.id;

    document.getElementById("update-name").value = customer.name;

    document.getElementById('customerList').style.display = "none";
    document.getElementById('update-computer').style.display = "block";
    // document.getElementById('display-create').style.display = "none";
    document.getElementById('title').style.display = "none";
}

function fetchCustomerForUpdate(id) {
    $.ajax({
        headers: {
            "Authorization": "Bearer " + token
        },
        method: "GET",
        url: `http://localhost:8080/api/computer/${id}`,
        success: function (computer) {
            displayUpdateForm(computer);
        }
    });
}

function updateCustomer(event) {
    // Ngăn chặn sự kiện mặc định của form
    event.preventDefault();

    let id = document.getElementById("update-id").value;
    let name = document.getElementById("update-name").value;

    $.ajax({
        headers: {
            "Authorization": "Bearer " + token
        },
        type: "GET",
        url: `http://localhost:8080/api/computer/exists?name=${name}`,
        success: function (exists) {
            if (exists) {
                alert("Computer name already exists. Please choose a different name.");
            } else {
                let updateComputer = {
                    "name": name,
                };
                $.ajax({
                    headers: {
                        "Authorization": "Bearer " + token,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    type: "PUT",
                    data: JSON.stringify(updateComputer),
                    url: `http://localhost:8080/api/computer/${currentUpdateId}`,
                    success: function () {
                        showAllCustomer();

                        document.getElementById('update-computer').style.display = "none";
                        document.getElementById('customerList').style.display = "block";
                        document.getElementById('display-create').style.display = "block";
                        document.getElementById('title').style.display = "block";
                    }
                });
            }
        }
    });
}

document.getElementById("update-form").addEventListener("submit", updateCustomer);
