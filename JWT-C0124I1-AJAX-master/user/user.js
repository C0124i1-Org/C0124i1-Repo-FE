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

function addUser(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let roles = [{id: 1, name: "ADMIN"}];

    $.ajax({
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        method: "POST",
        url: "http://localhost:8080/api/user/create",
        data: JSON.stringify({username: username, password: password, roles: roles}),
        success: function(){
            showAllUser();
            document.getElementById("userForm").reset();
        }
    });
}

function editUser(id, username, password){
    currentEditUserId = id;
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
    let username = document.getElementById("editUsername").value;
    let password = document.getElementById("editPassword").value;

    $.ajax({
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        method: "PUT",
        url: `http://localhost:8080/api/user/${currentEditUserId}`,
        data: JSON.stringify({username: username, password: password}),
        success: function(){
            showAllUser();
            closeModal();
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
            }
        });
    }
}

document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addUser();
});

showAllUser();
