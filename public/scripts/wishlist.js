const cid = localStorage.getItem("cid") || 1;

renderWishlist();


const wishlistContainer = document.querySelector(".cart-page-container");

async function renderWishlist() {
    const response = await fetch("/wishlistret", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({cid})
    });
    const responseData = await response.json();

    if (responseData.length === 0) {
        wishlistContainer.style.display = 'none';
        return;
    }

    let containerHTML = "";
    for (let i = 0; i < responseData.length; i++) {
        containerHTML += `
            <div class="cart-page-details-grid">
            <img class="product-image" src="${responseData[i].pic_path}">
            <div class="cart-item-details">
                <div class="product-page-name">
                    ${responseData[i].p_name}
                </div>
                <div class="product-price">
                    $${responseData[i].price}
                </div>
                <div class="product-quantity">
                    <span data-pid="${responseData[i].p_id}" class="delete-quantity-link link-primary js-delete-link">
                        Delete
                    </span>
                </div>
            </div>
        </div>`;
    }
    wishlistContainer.innerHTML = containerHTML;

    const deleteButtons = document.querySelectorAll(".js-delete-link");
    deleteButtons.forEach(button => {
        button.addEventListener("click", async () => {
            const pid = button.dataset.pid;
            const result = await fetch("/wishlistremove" , {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({cid,pid})
            });
            const resultData = await result.json();
            if(resultData.serverStatus == 2)
                {
                    renderWishlist();
                }
        });
    });
}
