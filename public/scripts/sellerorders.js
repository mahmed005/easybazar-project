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
                let shipmentCompleted=(responseData[i].o_status==="Completed");

            tableHTML += `
            <tr>
                            <td>${responseData[i].o_date}</td>
                            <td>${responseData[i].o_id}</td>
                            <td>${responseData[i].last_name}</td>
                            <td>${responseData[i].amount}</td>
                            <td>${paymentStatus}<button value="${paymentStatus}" data-oid="${responseData[i].o_id}" data-cid="${responseData[i].c_id}" class="updatebtn">Update</button></td>
                            <td>${responseData[i].o_status}
                            <select style="display:none;" class="js-update-status">
                                <option value="Pending" ${responseData[i].o_status==="Pending" ? `selected` : ''}>Pending</option>
                                <option value="Shipped" ${responseData[i].o_status==="Shipped" ? `selected` : ''}>Shipped</option>
                                <option value="Completed" ${shipmentCompleted ? `selected` : ''}>Completed</option>
                            </select> 
                            <button value="${paymentStatus}" data-oid="${responseData[i].o_id}" data-cid="${responseData[i].c_id}" class="updatebtn js-update-order-status" ${shipmentCompleted ? 'style="display:none;"' : ''}>Update</button>
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

        const statusSelectInputs = document.querySelectorAll(".js-update-order-status");
        statusSelectInputs.forEach(button => {
            const { oid, cid } = button.dataset;
            button.addEventListener("click", () => {
                const parent = button.parentElement;
                const statusText = parent.childNodes[0];
                const statusSelect = parent.querySelector(".js-update-status");
    
                statusText.style.display = "none";
                statusSelect.style.display = "inline-block";
                button.textContent = "Save";
                button.classList.add("save-status");
    
                button.addEventListener("click", async () => {
                    if (button.classList.contains("save-status")) {
                        const newStatus = statusSelect.value;
                        const updateStatus = await fetch("/updateOrderStatus", {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ oid, cid, newStatus })
                        });
                        const updateStatusData = await updateStatus.json();
    
                        if (updateStatusData.serverStatus == 2) {
                            statusText.textContent = newStatus;
                            statusText.style.display = "inline-block";
                            statusSelect.style.display = "none";
                            button.textContent = "Update";
                            button.classList.remove("save-status");
    
                            if (newStatus === "Completed") {
                                button.style.display = "none";
                            }
                        }
                    }
                });
            });
        });
}