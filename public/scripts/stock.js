const sid = localStorage.getItem("sid") || 1;

const sidInput = document.querySelector("#sid");
sidInput.value = sid;

const selectContainer = document.querySelector("#js-select");
const tableConatiner = document.querySelector("#js-table");

renderStockOptions();

async function renderStockOptions()
{
    let selectHTML = "";
    let tableHTML = "";
    const response = await fetch("/stock" , {
        method : "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({sid})
    });

    const responseData = await response.json();

    for(let i = 0; i< responseData.length; i++)
        {
            selectHTML += `
            <option value="${responseData[i].p_id}">${responseData[i].p_name}</option>`
        }

        for(let i = 0; i <  responseData.length ; i++)
            {
                tableHTML += `
                <tr>
                                <td>${responseData[i].p_name}</td>
                                <td>Jeans</td>
                                <td>${responseData[i].stock}</td>
                                <td>7</td>
                            </tr>`
            }

            selectContainer.innerHTML = selectHTML;
            tableConatiner.innerHTML = tableHTML;
}