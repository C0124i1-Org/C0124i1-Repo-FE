let currentEditUserId = null;


function docLocalStorage(){
    let userString = localStorage.getItem("u");
    let user = JSON.parse(userString);
    return user;
}

let us = docLocalStorage();
if (us == null){
    window.location.href = "../login/login.html";
}

let token = us.token;

function showAllUser(){
    $.ajax({
        headers: {
            "Authorization": "Bearer " + token
        },
        method: "GET",
        url: "http://localhost:8080/api/user",
        success: function(data){
            if (data != null && data.length > 0){
                let content = "";
                for (let i = 0; i < data.length; i++){
                    content += `<tr>
                        <td>${data[i].username}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editUser(${data[i].id}, '${data[i].username}', '${data[i].password}')">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteUser(${data[i].id}, '${data[i].username}')">Delete</button>
                        </td>
                    </tr>`;
                }
                document.getElementById("content").innerHTML = content;
            } else {
                document.getElementById("content").innerHTML = "<tr><td colspan='2'>No users found</td></tr>";
            }
        }
    });
}

function addUser() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    if (username === "" || password === "") {
        alert("Tên đăng nhập và mật khẩu không được để trống");
        return;
    }

    $.ajax({
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        method: "GET",
        url: "http://localhost:8080/api/user",
        success: function(data) {
            let userExists = data.some(user => user.username === username);
            if (userExists) {
                alert("Tên đăng nhập đã tồn tại");
            } else {
                let roles = [{ id: 1, name: "ADMIN" }];
                $.ajax({
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Content-Type": "application/json"
                    },
                    method: "POST",
                    url: "http://localhost:8080/api/user/create",
                    data: JSON.stringify({ username: username, password: password, roles: roles }),
                    success: function() {
                        showAllUser();
                        document.getElementById("userForm").reset();
                        alert("Thêm người dùng thành công");
                    }
                });
            }
        }
    });
}

function editUser(id, username, password){
    currentEditUserId = id;
    originalUsername = username;
    originalPassword = password;
    document.getElementById("editUsername").value = username;
    document.getElementById("editPassword").value = password;

    var editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'), {
        keyboard: false
    });
    editUserModal.show();
}

function closeModal(){
    var editUserModal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
    editUserModal.hide();
}

function saveUserChanges(){
    let username = document.getElementById("editUsername").value.trim();
    let password = document.getElementById("editPassword").value.trim();

    if (username === "" || password === "") {
        alert("Tên đăng nhập và mật khẩu không được để trống");
        return;
    }

    if (username === originalUsername && password === originalPassword) {
        alert("Tên đăng nhập và mật khẩu mới không được trùng với tên đăng nhập và mật khẩu cũ");
        return;
    }

    $.ajax({
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        method: "GET",
        url: "http://localhost:8080/api/user",
        success: function(data) {
            let userExists = data.some(user => user.username === username && user.id !== currentEditUserId);
            if (userExists) {
                alert("Tên đăng nhập đã tồn tại");
            } else {
                $.ajax({
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Content-Type": "application/json"
                    },
                    method: "PUT",
                    url: `http://localhost:8080/api/user/${currentEditUserId}`,
                    data: JSON.stringify({ username: username, password: password }),
                    success: function() {
                        showAllUser();
                        closeModal();
                        alert("Cập nhật người dùng thành công");
                    },
                    error: function(xhr, status, error) {
                        alert("Đã xảy ra lỗi khi cập nhật người dùng: " + error);
                    }
                });
            }
        },
        error: function(xhr, status, error) {
            alert("Đã xảy ra lỗi khi kiểm tra tên đăng nhập: " + error);
        }
    });
}

function deleteUser(id, username){
    if (confirm("Are you sure you want to delete " + username + "?")) {
        $.ajax({
            headers: {
                "Authorization": "Bearer " + token
            },
            method: "DELETE",
            url: `http://localhost:8080/api/user/${id}`,
            success: function(){
                showAllUser();
                alert("Xoá người dùng thành công!")
            }
        });
    }
}

document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addUser();
});

showAllUser();
