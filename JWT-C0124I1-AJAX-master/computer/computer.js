// dang dung dc token lay san tu postmane
// let token="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTcxNzQ3MTUxOSwiZXhwIjoxNzE3NTU3OTE5fQ._4JNEiaMUdmgYwnc_BqX686nFf5OzTlh0_KLM2mmK8o";
let us = docLocalStorage();
// neu chua dang nhap thi doc localstorage null
if (us ==null){
    // chuyen ve trang dang nhap
    window.location.href = "../login/login.html"
}
let token = us.token;
function showAllCustomer(){
    $.ajax({
        // bo sung headers o ajax, gan author cho request se dung dc phan quyen
        // bo sung them header o ajax de thuc hien gan token
        headers:{
            "Authorization": "Bearer " + token
        },
        method: "GET",
        url: "http://localhost:8080/api/computer",
        success: function (data){
            console.log(data)
            if (data != null || data.length > 0) {
                let content = `            <table id="display-list" border="1">
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Tình trạng</th>
<!--                    <th>Gender</th>-->
<!--                    <th>Address</th>-->
<!--                    <th>Update</th>-->
<!--                    <th>Delete</th>-->
                </tr>`;
                for (let i = 0; i < data.length; i++) {
                    content += `<tr>
       
        <td>${data[i].id}</td>
        <td>${data[i].name}</td>
      
         <td><a href="#" onclick="fetchCustomerForUpdate(${data[i].id})">Update</a></td>
        <td><a href="#" onclick="deleteSmartphone(${data[i].id})">Delete</a></td>
    </tr>`;
                }
                content += "</table>"
                document.getElementById('customerList').innerHTML = content;
                document.getElementById('customerList').style.display = "block";
                document.getElementById('add-customer').style.display = "none";
                document.getElementById('update-customer').style.display = "none";
                document.getElementById('display-create').style.display = "block";
                document.getElementById('title').style.display = "block";
            } else {
                document.getElementById('smartphoneList').innerHTML = "khong co du lieu";
            }
        }
    })
}
// goi Ajax thong thuong -> khong dc
// showAllCustomer();
function docLocalStorage(){
    let userString = localStorage.getItem("u");
    let user = JSON.parse(userString);
    return user;
}
function displayFormCreate() {
    document.getElementById('customerList').style.display = "none";
    document.getElementById('add-customer').style.display = "block";
    document.getElementById('display-create').style.display = "none";
    document.getElementById('title').style.display = "none";
}
function addCustomer() {
    //lấy dữ liệu từ form html
    let name = document.getElementById("name").value;
    let age = +document.getElementById("age").value;
    let gender = document.getElementById("gender").value;
    let address = document.getElementById("address").value;
    let newCustomer = {
        "name": name,
        "age": age,
        "gender": gender,
        "address": address,
    };

    $.ajax({
        headers: {
            "Authorization": "Bearer " + token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "POST",
        data: JSON.stringify(newCustomer),

        url: "http://localhost:8080/api/computer/create",
        //xử lý khi thành công
        success: function () {
            showAllCustomer()
        }

    });

    event.preventDefault();
}

function deleteSmartphone(id) {
    $.ajax({
        headers:{
            "Authorization": "Bearer " + token
        },
        type: "DELETE",

        url: `http://localhost:8080/api/computer/${id}`,

        success: function () {
            showAllCustomer()
        }
    });
}
let currentUpdateId = null;

// update
function displayUpdateForm(customer) {
    currentUpdateId = customer.id;
    // document.getElementById("update-id").value = customer.id;
    document.getElementById("update-name").value = customer.name;
    // document.getElementById("update-age").value = customer.age;
    // document.getElementById("update-gender").value = customer.gender;
    // document.getElementById("update-address").value = customer.address;


    document.getElementById('customerList').style.display = "none";
    document.getElementById('update-customer').style.display = "block";
    document.getElementById('display-create').style.display = "none";
    document.getElementById('title').style.display = "none";
}
function fetchCustomerForUpdate(id) {
    $.ajax({
        headers: {
            "Authorization": "Bearer " + token
        },
        method: "GET",
        url: `http://localhost:8080/api/computer/${id}`,
        success: function (customer) {
            displayUpdateForm(customer);
        }
    });
}
function updateCustomer(event) {
    // Ngăn chặn sự kiện mặc định của form
    event.preventDefault();


    let id = document.getElementById("update-id").value;
    let name = document.getElementById("update-name").value;
    // let age = +document.getElementById("update-age").value;
    // let gender = document.getElementById("update-gender").value;
    // let address = document.getElementById("update-address").value;
    let updatedCustomer = {
        "name": name,
        // "age": age,
        // "gender": gender,
        // "address": address,
    };


    $.ajax({
        headers: {
            "Authorization": "Bearer " + token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "PUT",
        data: JSON.stringify(updatedCustomer),
        url: `http://localhost:8080/api/computer/${currentUpdateId }`,
        success: function () {
            showAllCustomer();

            document.getElementById('update-customer').style.display = "none";
            document.getElementById('customerList').style.display = "block";
            document.getElementById('display-create').style.display = "block";
            document.getElementById('title').style.display = "block";
        }
    });
}
document.getElementById("update-form").addEventListener("submit", updateCustomer);
