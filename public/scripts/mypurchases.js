let contentContainer = document.querySelector("#content-container");

const cid = localStorage.getItem("cid") || 1;

fetchOrderData();

async function fetchOrderData()
{
    let containerHTML = "";
    if(!cid) {
            alert("Please login first");
    } else {
        const response = await fetch("/mypurchasesfetch" , {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({cid})
        });
        const responseData = await response.json();
        for(let i = 0; i < responseData.length ; i++)
            {
                containerHTML += `
                <div data-oid="${responseData[i].o_id}" class="cart-page-container" style="margin-bottom: 10px; cursor: pointer;">
                <div class="order-page-details-grid">
                  <div class="cart-item-details">
                    <div class="product-page-name">
                      Order # : <span >${responseData[i].o_id}</span>
                    </div>
                    <div class="product-price">
                      $${responseData[i].amount}
                    </div>
                    <div class="product-status">
                        <span>
                            Status: <span class="quantity-label">${responseData[i].o_status}</span>
                          </span>
                      <span>
                    </div>
                    <div class="orderdate">
                    <span class="update-quantity-link link-primary">
                        Order Date:
                      </span>
                      <span class="delete-quantity-link link-primary">
                        ${responseData[i].o_date}
                      </span>
                    </div>
                  </div>             
               </div> 
              </div>
                `;
            }
        contentContainer.innerHTML = containerHTML;
    }

    const orderContainers = document.querySelectorAll(".cart-page-container");
    orderContainers.forEach(container => {
      container.addEventListener("click" , () =>{
        const orderID = container.dataset.oid;
        window.location.href = `/order-details?oid=${orderID}`;
      })
    })
}