const object = JSON.parse(localStorage.getItem("aid"))

const aid = object.aid;

const tableContainer = document.querySelector(".js-table");

renderCategories();

async function renderCategories()
{
    let tableHTML = "";
    const response = await fetch("/getcategories");
    const responseData = await response.json();

    for(let i = 0; i < responseData.length; i++) {
        tableHTML += `
        <tr>
        <th>${responseData[i].cat_id}</th>
        <th>${responseData[i].name}</th>
        </tr>`;
    }

    tableContainer.innerHTML = tableHTML;
}