let contentContainer = document.querySelector("#content-container");

const object = JSON.parse(localStorage.getItem("cid"))

const cid = object.cid;

fetchOrderData();

async function fetchOrderData() {
  let containerHTML = "";
  if (!cid) {
    alert("Please login first");
  } else {
    const response = await fetch("/mypurchasesfetch", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cid })
    });
    const responseData = await response.json();
    for (let i = 0; i < responseData.length; i++) {
      containerHTML += `
                <div data-oid="${responseData[i].o_id}" class="cart-page-container" style="margin-bottom: 10px; cursor: pointer;">
                <div class="order-page-details-grid">
                  <div class="cart-item-details">
                    <div class="product-page-name">
                      Order # : <span >${responseData[i].o_id}</span>
                      <button  class="js-delete updatebtn" data-oid="${responseData[i].o_id}" data-status="${responseData[i].o_status}">Delete</button>
                      <button class="js-review updatebtn" data-oid="${responseData[i].o_id}" data-status="${responseData[i].o_status}">Review</button>
                      <button class="js-vieworder updatebtn" data-oid="${responseData[i].o_id}" >View Your Order</button>
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

  const orderContainers = document.querySelectorAll(".js-vieworder");
  orderContainers.forEach(container => {
    container.addEventListener("click", () => {
      const orderID = container.dataset.oid;
      window.location.href = `/order-details?oid=${orderID}`;
    });
  });

  const deleteButtons = document.querySelectorAll(".js-delete");
  deleteButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
      event.stopPropagation();
      if (button.dataset.status === "Completed") {
        alert("Can't cancel the order the order has been shipped");
      } else {
        const oid = button.dataset.oid;
        const response = await fetch("/removeorder" , {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
        },
          body: JSON.stringify({oid})
        });
        const responseData = await response.json();
        if(responseData.serverStatus == 2)
          {
            fetchOrderData();
          }
      }
    });
  });

  const reviewButtons = document.querySelectorAll(".js-review");
  reviewButtons.forEach(button => {
    if(button.dataset.status === "Completed")
      {
        button.style.display = "inline-block";
        button.addEventListener("click" , (event) => {
          event.stopPropagation();
          const oid = button.dataset.oid;
          window.location.href = `/revieworder?oid=${oid}`;
        })
      } else {
        button.style.display = "none";
      }
  })
}