function login(){
    //lay du lieu
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
//     tao object
    let u ={
        "username": username,
        "password": password
    }
//     goi ajax
    $.ajax({
        // quy dinh du lieu gui len la json
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method: "POST",
        // chuyen object -> json
        data: JSON.stringify(u),
        url: "http://localhost:8080/api/auth/login",
        success: function (dulieu) {
            // ghi vao localstorage
            localStorage.setItem("u", JSON.stringify(dulieu));
            window.location.href = "../computer/list.html"
        }
    })
}
