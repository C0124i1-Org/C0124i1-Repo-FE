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
            $('#totalRevenue').text("Revenue to date " + new Date().toLocaleDateString() + ": " + data);
        }
        });
}
function dailyRevenue() {
    let startTime = document.getElementById("start").value;
    let endTime = document.getElementById("end").value;

    if (!startTime || !endTime) {
        alert("Please select both start and end time.");
        return;
    }

    $.ajax({
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        method: "POST",
        url: "http://localhost:8080/api/revenue/time",
        data: JSON.stringify({
            start: startTime,
            end: endTime
        }),
        success: function (dulieu) {
            if (dulieu != null && dulieu.length > 0) {
                let totalRevenue = 0;
                let content = `
                        <table id="dailyRevenueTable">
                            <tr>
                                <th>Name Computer</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Revenue</th>
                            </tr>
                        `;
                dulieu.forEach(item => {
                    content += `
                            <tr>
                                <td>${item.computer.name}</td>
                                <td>${item.startTime}</td>
                                <td>${item.endTime}</td>
                                <td>${item.totalRevenue}</td>
                            </tr>
                            `;
                    totalRevenue += item.totalRevenue;
                });

                content += `
                            <tr>
                                <td colspan="3" style="text-align: right;"><strong>Total Revenue:</strong></td>
                                <td>${totalRevenue}</td>
                            </tr>
                        </table>
                    `;
                document.getElementById("dailyRevenue").innerHTML = content;
            } else {
                document.getElementById("dailyRevenue").innerHTML = "<p>No data available for the selected time range.</p>";
            }
        },
        error: function (xhr, status, error) {
            console.error('Error:', status, error);
        }
    });
}