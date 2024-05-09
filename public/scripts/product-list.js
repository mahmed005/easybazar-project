import {addToCart} from "./cart.js"


function toggleText(element) {
    element.classList.toggle('expanded');
}

const wishlistButton = document.querySelector(".btn2");
wishlistButton.addEventListener("click", async () => {
    if (wishlistButton.innerText === "Added To WishList")
        return;
    const pid = wishlistButton.dataset.pid;
    // const { cid } = JSON.parse(localStorage.getItem("cid")) || undefined;
    // if (!cid) {
    //     alert("Please login first");
    // }
    // else {
        const requestBody = {
            c_id: 1,
            p_id: pid
        };
        const jsonData = await fetchWishlistResponse(requestBody);
        if (jsonData.message === "fail") {
            alert("Product already in the wishlist");
        }
        else
        {
            wishlistButton.innerText = "Added To WishList";
        }
    //}
})
async function fetchWishlistResponse(requestBody) {
    const response = await fetch("/wishlist", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    }
    );
    const jsonData = await response.json();
    return jsonData;
}


const cartButton = document.querySelector(".btn1");
cartButton.addEventListener("click" , () => {
    const pid = cartButton.dataset.pid;
    addToCart(pid);
});

const buyButton = document.querySelector(".btn3");
buyButton.addEventListener('click', () => {
    window.location.href = `/buynow?pid=${buyButton.dataset.pid}`;
});

