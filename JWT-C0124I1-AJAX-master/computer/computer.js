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
        url: "http://localhost:8080/api/computer/online",
        success: function (data) {
            if (data != null && data.length > 0) {
                let content = `
                <table id="display-list" border="1">
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                        <th>Check-out</th>
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
                        <td>
                            <button onclick="stopComputer(${data[i].id})">Tắt máy và Tính tiền</button>
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
                document.getElementById('computerList').innerHTML = "All Computer Offline";
            }
        },
        error: function (xhr, status, error) {
            alert("Error fetching online computers: " + error);
        }
    });
}
function addServiceToComputer(computerId) {
    // Hiển thị danh sách dịch vụ có sẵn và cho người dùng chọn
    $.ajax({
        headers: {
            "Authorization": "Bearer " + token
        },
        method: "GET",
        url: "http://localhost:8080/api/service", // Điều chỉnh URL API để lấy danh sách dịch vụ
        success: function (services) {
            if (services != null && services.length > 0) {
                let content = "<h2>Choose Service</h2>";
                content += "<ul>";
                for (let i = 0; i < services.length; i++) {
                    content += `<li><input type="checkbox" name="services" value="${services[i].id}" id="service_${services[i].id}">`;
                    content += `<label for="service_${services[i].id}">${services[i].name} - ${services[i].cost} VND</label></li>`;
                }
                content += "</ul>";

                // Hiển thị danh sách dịch vụ
                document.getElementById('serviceList').innerHTML = content;
                document.getElementById('serviceList').style.display = 'block';

                // Thêm nút "Confirm" để người dùng xác nhận thêm dịch vụ
                let confirmButton = document.createElement('button');
                confirmButton.textContent = "Confirm";
                confirmButton.onclick = function() {
                    // Lấy danh sách các dịch vụ đã được chọn
                    let selectedServices = [];
                    let checkboxes = document.getElementsByName('services');
                    for (let i = 0; i < checkboxes.length; i++) {
                        if (checkboxes[i].checked) {
                            selectedServices.push(parseInt(checkboxes[i].value));
                        }
                    }

                    // Gửi yêu cầu thêm dịch vụ vào máy
                    $.ajax({
                        headers: {
                            "Authorization": "Bearer " + token,
                            'Content-Type': 'application/json'
                        },
                        method: "POST",
                        url: `http://localhost:8080/api/computer/${computerId}/services`,
                        data: JSON.stringify({ services: selectedServices }),
                        success: function () {
                            alert("Services added successfully!");
                            // Sau khi thêm dịch vụ thành công, ẩn danh sách dịch vụ và cập nhật lại danh sách máy
                            document.getElementById('serviceList').style.display = 'none';
                            showOnlineComputers();
                        },
                        error: function (xhr, status, error) {
                            alert("Error adding services: " + error);
                        }
                    });
                };

                // Thêm nút "Cancel" để hủy thao tác thêm dịch vụ
                let cancelButton = document.createElement('button');
                cancelButton.textContent = "Cancel";
                cancelButton.onclick = function() {
                    document.getElementById('serviceList').style.display = 'none';
                };

                // Thêm nút "Confirm" và "Cancel" vào giao diện
                document.getElementById('serviceList').appendChild(confirmButton);
                document.getElementById('serviceList').appendChild(cancelButton);
            } else {
                alert("No services available.");
            }
        },
        error: function (xhr, status, error) {
            alert("Error fetching services: " + error);
        }
    });
}
function showOfflineComputers() {
    $.ajax({
        headers: {
            "Authorization": "Bearer " + token
        },
        method: "GET",
        url: "http://localhost:8080/api/computer/offline",
        success: function (data) {
            if (data != null && data.length > 0) {
                let content = `
                <table id="display-list" border="1">
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                        <th>Check-in</th>
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
                        <td>
                            <button onclick="startComputer(${data[i].id})">Bật máy</button>
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
                document.getElementById('computerList').innerHTML = "All Computer Online ";
            }
        },
        error: function (xhr, status, error) {
            alert("Error fetching offline computers: " + error);
        }
    });
}

function stopComputer(id) {
    $.ajax({
        headers: {
            "Authorization": "Bearer " + token
        },
        method: "POST",
        url: `http://localhost:8080/api/computer/${id}/stop`,
        success: function (data) {
            let usageTime = data.usageTime;
            let serviceCost = data.serviceCost;
            let totalCost = data.totalCost;
            alert(`Usage Time: ${usageTime} hours\nService Cost: ${serviceCost} VND\nTotal Cost: ${totalCost} VND`);
            showOnlineComputers(); // Refresh the list of online computers
        },
        error: function (xhr, status, error) {
            alert("Error stopping computer: " + error);
        }
    });
}
function startComputer(id) {
    $.ajax({
        headers: {
            "Authorization": "Bearer " + token
        },
        method: "POST",
        url: `http://localhost:8080/api/computer/${id}/start`,
        success: function (data) {
            alert(data);
            showOfflineComputers(); // Refresh the list of offline computers
        },
        error: function (xhr, status, error) {
            alert("Error starting computer: " + error);
        }
    });
}



