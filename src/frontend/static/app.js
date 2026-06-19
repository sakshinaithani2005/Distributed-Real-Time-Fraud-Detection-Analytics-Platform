async function loadStats(){

    const response =
    await fetch(
        "/dashboard-stats"
    );

    const data =
    await response.json();

    document.getElementById(
        "users"
    ).innerText =
    data.total_users;

    document.getElementById(
        "transactions"
    ).innerText =
    data.total_transactions;

    document.getElementById(
        "fraud-rate"
    ).innerText =
    data.fraud_rate + "%";

    document.getElementById(
        "fraud-alerts"
    ).innerText =
    data.fraud_alerts;
}


async function loadAlerts(){

    const response =
    await fetch(
        "/fraud-alerts"
    );

    const alerts =
    await response.json();

    let html = "";

    alerts.forEach(alert => {

        html += `

        <tr>

            <td>
                ${alert.user_id}
            </td>

            <td>
                ₹${alert.amount}
            </td>

            <td>
                ${alert.merchant}
            </td>

            <td class="danger">
                ${alert.fraud_probability}
            </td>

        </tr>

        `;
    });

    document.getElementById(
        "alerts-body"
    ).innerHTML =
    html;
}


async function refreshDashboard(){

    await loadStats();

    await loadAlerts();
}


refreshDashboard();

setInterval(
    refreshDashboard,
    5000
);