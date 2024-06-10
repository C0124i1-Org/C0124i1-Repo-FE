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

function totalRevenue() {
    $.ajax({
        headers: {
            "Authorization": "Bearer " + token
        },
        method: "GET",
        url: "http://localhost:8080/api/revenue",
        success: function (data) {
            $('#totalRevenue').text("Revenue to date: " + new Date().toLocaleDateString() + ": " + data);
        }
        });
}
function dailyRevenue(){
    let startTime = document.getElementById("start").value;
    let endTime = document.getElementById("end").value;
    $.ajax({
        headers: {
            "Authorization": "Bearer " + token
        },
        method: "GET",
        url: "http://localhost:8080/api/revenue/time",
        data:{
            start:startTime,
            end:endTime
        },
        success:function (data){
            if(data != null && data.length>0){
            let content = `
                <table>
                <tr>
                <th>Name Computer</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Revenue</th>
                </tr>
            `;
                data.forEach(item => {
                    content += `
                    <tr>
                    <td>${item.computer.name}</td>
                    <td>${item.startTime}</td>
                    <td>${item.endTime}</td>
                    <td>${item.totalRevenue}</td>
                    </tr>
                    `;
                });

            content += "</table>"
                document.getElementById(dailyRevenue()).innerHTML=content;
            }
        }
    })
    }
