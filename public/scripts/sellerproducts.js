const object = JSON.parse(localStorage.getItem("sid"))

const sid = object.sid;

const sidInput = document.querySelector("#sid");

sidInput.value = sid;

const categorySelect = document.querySelector("#categorySelect");
const tableContent = document.querySelector("#js-table");

getProductsAndCategories();

async function getProductsAndCategories() {
    let selectHTML = "";
    let tableHTML = "";
    const response = await fetch("/sellerproducts", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sid })
    });

    const responseData = await response.json();

    for (let i = 0; i < responseData[0].length; i++) {
        selectHTML += `
            <option>${responseData[0][i].name}</option>`
    }
    for (let i = 0; i < responseData[1].length; i++) {
        tableHTML += `
            <tr>
                                    <td>${responseData[1][i].p_name}</td>
                                    <td>${responseData[1][i].price}</td>
                                    <td>${responseData[1][i].stock}</td>
                                    <td>Edit</td>
                                    <td>Delete</td>
                                </tr>
                                `
    }

    categorySelect.innerHTML = selectHTML;
    tableContent.innerHTML = tableHTML;
}