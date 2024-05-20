const sid = localStorage.getItem("sid") || 1;

const tableConatiner = document.querySelector(".js-dashboard-table");

const stockTable = document.querySelector(".js-stock-table");

getSellerDashboard();

async function getSellerDashboard() {
    let tableHTML = "";
    let stockHTML = "";
    const response = await fetch("/sellerhome" , {
        method : "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({sid})
    });

    const responseData = await response.json();

    let orders = 0;
    let revenue = 0

    for(let i = 0; i < responseData[0].length ; i++) {
        orders++;
        revenue += responseData[0][i].subtotal;
    }

    for(let i = 0; i < responseData[2].length; i++)
        {
            stockHTML += `
            <tr>
                                <td>${responseData[2][i].p_name}</td>
                                <td>${responseData[2][i].price}</td>
                                <td>${responseData[2][i].stock}</td>
                            </tr>`
        }

    tableHTML += `
    <tr>
    <td>${orders}</td>
    <td>${revenue}</td>
    <td>${responseData[1][0].reports}</td>  
    </tr>`
    
    tableConatiner.innerHTML = tableHTML; 
    stockTable.innerHTML = stockHTML;
}