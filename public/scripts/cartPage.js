import { cart, removeFromCart , updateItemQuantity } from "./cart.js";

renderCartItems();

const cartItemContainer = document.querySelector(".cart-page-container");


async function renderCartItems() {
    const response = await fetch("/cart", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cart)
    });
    const responseData = await response.json();

    if (responseData.length === 0) {
        cartItemContainer.style.display = 'none';
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
                    PKR ${responseData[i].price} 
                </div>
                <div class="product-quantity">
                    <span>
                        Quantity: <span class="quantity-label">${cart[i].quantity}</span>
                        <input type="number" value="${cart[i].quantity}" class="quantity-input">
                    </span>
                    <span data-pid="${responseData[i].p_id}" class="update-quantity-link link-primary">
                        Update
                    </span>
                    <span data-pid="${responseData[i].p_id}" class="delete-quantity-link link-primary js-delete-link">
                        Delete
                    </span>
                </div>
            </div>

        </div>`;
    }
    cartItemContainer.innerHTML = containerHTML;

    const deleteButtons = document.querySelectorAll(".js-delete-link");
    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            const pid = button.dataset.pid;
            removeFromCart(pid);
            renderCartItems();
        })
    });

    const updateButtons = document.querySelectorAll(".update-quantity-link");
    updateButtons.forEach(button => {

        const pid = button.dataset.pid;
        
        const parent = button.parentElement;

        const quantityInput = parent.querySelector(".quantity-input");
        const quantitySpan = parent.querySelector(".quantity-label");
        
        button.addEventListener("click", () => {
            if (button.innerText.trim() === "Update") {
                button.innerText = "Save";

                if (quantityInput && quantitySpan) {
                    quantityInput.style.display = "inline-block";
                    quantitySpan.style.display = "none";
                }
            } else if (button.innerText === "Save") {
                button.innerText = "Update";

                if (quantityInput && quantitySpan) {
                    quantityInput.style.display = "none";
                    quantitySpan.style.display = "inline-block";
                    const setQuantity = Number(quantityInput.value);
                    updateItemQuantity(pid , setQuantity);
                    quantitySpan.innerText = `${setQuantity}`;
                }
            }
        });
    });

    const checkoutButton = document.querySelector(".checkout-button");
    checkoutButton.addEventListener("click" , () => {
        const cartString = JSON.stringify(cart);
        window.location.href = `/buynow?cart=${encodeURIComponent(cartString)}`;
    })
}



