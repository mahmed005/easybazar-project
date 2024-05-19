const sid = localStorage.getItem("sid") || 1;

const tableConatiner = document.querySelector("#js-table");

renderOrders();

async function renderOrders() {
    let tableHTML = "";
    const response = await fetch("/sellerorders" , {
        method : "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({sid})
    });

    const responseData = await response.json();

    for(let i = 0 ; i <  responseData.length; i++)
        {
            const paymentResponse = await fetch("/sellerpaymentdetails" , {
                method : "POST",
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ oid: responseData[i].o_id})
            });

            const paymentResponseData = await paymentResponse.json();
            
            let paymentStatus;
            if(paymentResponseData.length === 0)
                {
                    paymentStatus = "Unpaid";
                }
                else {
                    paymentStatus = "Paid";
                }

            tableHTML += `
            <tr>
                            <td>${responseData[i].o_date}</td>
                            <td>${responseData[i].o_id}</td>
                            <td>${responseData[i].last_name}</td>
                            <td>${responseData[i].amount}</td>
                            <td>${paymentStatus}<button value="${paymentStatus}" data-oid="${responseData[i].o_id}" data-cid="${responseData[i].c_id}" class="updatebtn">Update</button></td>
                            <td>${responseData[i].o_status}
                            <select style="display:none;" class="js-update-status">
                                <option value="Pending" selected>Pending</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Completed">Completed</option>
                            </select> 
                            <button value="${paymentStatus}" data-oid="${responseData[i].o_id}" data-cid="${responseData[i].c_id}" class="updatebtn js-update-order-status">Update</button>
                            </td>
                        </tr>`
        }

        tableConatiner.innerHTML = tableHTML;


        const updateButtons = document.querySelectorAll(".updatebtn");
        updateButtons.forEach(button => {
            const paymentStatus = button.value;
            if(paymentStatus === "Unpaid") {
                    button.style.display = "inline-block";
                    const {oid,cid} = button.dataset;
                    button.addEventListener("click" , async () => {
                        const updatePayment = await fetch("/updateSellerPayment" , {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json'
                                },
                            body: JSON.stringify({oid,cid})
                        });
                        const updatePaymentData = await updatePayment.json();
                        
                        if(updatePaymentData.serverStatus == 2)
                            {
                                const parent = button.parentElement;
                                parent.innerHTML = "Paid";
                            }
                    });
            } else {
                button.style.display = "none";
            }
        });

        const statusSelectInputs = document.querySelectorAll(".js-update-status");
        statusSelectInputs.forEach(input => {
        });
}