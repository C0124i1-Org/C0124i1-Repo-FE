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
                document.getElementById('computerList').innerHTML = content;
                document.getElementById('computerList').style.display = "block";
                document.getElementById('add-customer').style.display = "none";
                document.getElementById('update-computer').style.display = "none";
                document.getElementById('title').style.display = "block";
                // Hiển thị lại nút "Add New Service"
                document.getElementById('display-service-form').style.display = "inline-block";
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
    document.getElementById('computerList').style.display = "none";
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

    // Hide unnecessary buttons
    document.getElementById('display').style.display = "none";
    document.getElementById('display-create').style.display = "none";
    document.getElementById('display-service-form').style.display = "none";
    document.getElementById('show-online-button').style.display = "none";
    document.getElementById('show-offline-button').style.display = "none";

    // Show the "Show List" button
    document.getElementById('show-list-button').style.display = "inline-block";

    // Show the update form and hide the list
    document.getElementById('computerList').style.display = "none";
    document.getElementById('update-computer').style.display = "block";
    document.getElementById('title').style.display = "none";
}
function hideUpdateForm() {
    document.getElementById('update-computer').style.display = "none";
    document.getElementById('computerList').style.display = "block";
    document.getElementById('title').style.display = "block";

    // Show necessary buttons again
    document.getElementById('display').style.display = "inline-block";
    document.getElementById('display-create').style.display = "inline-block";
    document.getElementById('display-service-form').style.display = "inline-block";
    document.getElementById('show-online-button').style.display = "inline-block";
    document.getElementById('show-offline-button').style.display = "inline-block";

    // Hide the "Show List" button
    document.getElementById('show-list-button').style.display = "none";
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
                        // Hiển thị lại các nút sau khi cập nhật xong
                        document.getElementById('display').style.display = "inline-block";
                        document.getElementById('display-create').style.display = "inline-block";
                        document.getElementById('display-service-form').style.display = "inline-block";
                        document.getElementById('show-online-button').style.display = "inline-block";
                        document.getElementById('show-offline-button').style.display = "inline-block";
                        // Ẩn form cập nhật
                        document.getElementById('update-computer').style.display = "none";
                        document.getElementById('computerList').style.display = "block";
                        document.getElementById('title').style.display = "block";
                        // Ẩn nút "Show List" sau khi trở lại trạng thái ban đầu
                        document.getElementById('show-list-button').style.display = "none";
                    }
                });
            }
        }
    });
}
// Function to display the add service form
function displayServiceForm() {
    document.getElementById('add-service-form').style.display = 'block';
    document.getElementById('display-service-form').style.display = 'none';
}

// Function to hide the add service form
function hideServiceForm() {
    document.getElementById('add-service-form').style.display = 'none';
    document.getElementById('display-service-form').style.display = 'inline-block';
}

// Function to handle the form submission for adding a new service
$('#service-form').submit(function(e) {
    e.preventDefault();
    let serviceName = $('#service-name').val();
    let serviceCost = $('#service-cost').val();

    $.ajax({
        headers: {
            "Authorization": "Bearer " + token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "POST",
        data: JSON.stringify({ name: serviceName, cost: serviceCost }),
        url: "http://localhost:8080/api/service/create", // Điều chỉnh URL API của bạn
        success: function(response) {
            alert('Service added successfully!');
            // Reset form
            $('#service-name').val('');
            $('#service-cost').val('');
            // Hide form
            hideServiceForm();
        },
        error: function(xhr, status, error) {
            alert('Error adding service: ' + error);
        }
    });
});
document.getElementById("update-form").addEventListener("submit", updateCustomer);
function showOnlineComputers() {
    $.ajax({
        headers: {
            "Authorization": "Bearer " + token
        },
        method: "GET",
        url: "http://localhost:8080/api/computer/online", // Điều chỉnh URL API của bạn nếu cần thiết
        success: function (data) {
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
                    content += `
                    <tr>
                        <td>${data[i].id}</td>
                        <td>${data[i].name}</td>
                        <td>Online</td>
                        <td>
                            <a href="#" onclick="showComputerDetails(${data[i].id})">Details</a> |
                            <a href="#" onclick="fetchCustomerForUpdate(${data[i].id})">Update</a> |
                            <a href="#" onclick="deleteSmartphone(${data[i].id})">Delete</a>
                        </td>
                    </tr>`;
                }
                content += "</table>";
                document.getElementById('computerList').innerHTML = content;
                document.getElementById('computerList').style.display = "block";
                document.getElementById('add-customer').style.display = "none";
                document.getElementById('update-computer').style.display = "none";
                document.getElementById('title').style.display = "block";
            } else {
                document.getElementById('computerList').innerHTML = "No data available";
            }
        }
    });
}
// function showOnlineComputers() {
//     $.ajax({
//         headers: {
//             "Authorization": "Bearer " + token
//         },
//         method: "GET",
//         url: "http://localhost:8080/api/computer/online",
//         success: function (data) {
//             if (data && data.length > 0) {
//                 let content = `
//                 <h2>Chọn máy online</h2>
//                 <table border="1">
//                     <tr>
//                         <th>Id</th>
//                         <th>Name</th>
//                         <th>Chọn</th>
//                     </tr>`;
//                 for (let i = 0; i < data.length; i++) {
//                     content += `
//                     <tr>
//                         <td>${data[i].id}</td>
//                         <td>${data[i].name}</td>
//                         <td><input type="radio" name="computer" value="${data[i].id}" onclick="selectComputer(${data[i].id})"></td>
//                     </tr>`;
//                 }
//                 content += "</table>";
//                 $('#computerList').html(content);
//                 $('#serviceList').hide();
//             } else {
//                 $('#computerList').html("No data available");
//             }
//         }
//     });
// }
//
// // Chọn máy
// function selectComputer(id) {
//     selectedComputerId = id;
//     showServiceList();
// }
//
// // Hiển thị danh sách dịch vụ
// function showServiceList() {
//     $.ajax({
//         headers: {
//             "Authorization": "Bearer " + token
//         },
//         method: "GET",
//         url: "http://localhost:8080/api/service",
//         success: function (data) {
//             if (data && data.length > 0) {
//                 let content = `
//                 <tr>
//                     <th>Id</th>
//                     <th>Name</th>
//                     <th>Cost</th>
//                     <th>Chọn</th>
//                 </tr>`;
//                 for (let i = 0; i < data.length; i++) {
//                     content += `
//                     <tr>
//                         <td>${data[i].id}</td>
//                         <td>${data[i].name}</td>
//                         <td>${data[i].cost}</td>
//                         <td><input type="radio" name="service" value="${data[i].id}" onclick="selectService(${data[i].id})"></td>
//                     </tr>`;
//                 }
//                 $('#serviceTable').html(content);
//                 $('#serviceList').show();
//             } else {
//                 $('#serviceTable').html("No services available");
//             }
//         }
//     });
// }
//
// // Chọn dịch vụ
// function selectService(id) {
//     selectedServiceId = id;
// }
//
// // Thêm dịch vụ vào máy đã chọn
// function addServiceToComputer() {
//     if (selectedComputerId && selectedServiceId) {
//         $.ajax({
//             headers: {
//                 "Authorization": "Bearer " + token,
//                 'Content-Type': 'application/json'
//             },
//             method: "POST",
//             url: `http://localhost:8080/api/computer/${selectedComputerId}/services`,
//             data: JSON.stringify({ serviceId: selectedServiceId }),
//             success: function () {
//                 alert("Dịch vụ đã được thêm vào máy thành công!");
//             },
//             error: function (xhr, status, error) {
//                 alert("Có lỗi xảy ra: " + error);
//             }
//         });
//     } else {
//         alert("Vui lòng chọn máy và dịch vụ.");
//     }
// }
//
// // Hiển thị danh sách các máy đang bật khi trang được tải
// $(document).ready(function() {
//     showOnlineComputers();
// });

function showOfflineComputers() {
    $.ajax({
        headers: {
            "Authorization": "Bearer " + token
        },
        method: "GET",
        url: "http://localhost:8080/api/computer/offline", // Điều chỉnh URL API của bạn nếu cần thiết
        success: function (data) {
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
                    content += `
                    <tr>
                        <td>${data[i].id}</td>
                        <td>${data[i].name}</td>
                        <td>Offline</td>
                        <td>
                            <a href="#" onclick="showComputerDetails(${data[i].id})">Details</a> |
                            <a href="#" onclick="fetchCustomerForUpdate(${data[i].id})">Update</a> |
                            <a href="#" onclick="deleteSmartphone(${data[i].id})">Delete</a>
                        </td>
                    </tr>`;
                }
                content += "</table>";
                document.getElementById('computerList').innerHTML = content;
                document.getElementById('computerList').style.display = "block";
                document.getElementById('add-customer').style.display = "none";
                document.getElementById('update-computer').style.display = "none";
                document.getElementById('title').style.display = "block";
            } else {
                document.getElementById('computerList').innerHTML = "No data available";
            }
        }
    });
}

