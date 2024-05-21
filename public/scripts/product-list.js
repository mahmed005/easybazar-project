import { addToCart } from "./cart.js"


function toggleText(element) {
    element.classList.toggle('expanded');
}

const wishlistButton = document.querySelectorAll(".btn2");
wishlistButton.forEach(button => {
    button.addEventListener("click", async () => {
        if (wishlistButton.innerText === "Added To WishList")
            return;
        const pid = button.dataset.pid;
        const object = JSON.parse(localStorage.getItem("cid"))

        const cid = object.cid;
        if (!cid) {
            alert("Please login first");
        }
        else {
            const requestBody = {
                c_id: cid,
                p_id: pid
            };
            const jsonData = await fetchWishlistResponse(requestBody);
            if (jsonData.message === "fail") {
                alert("Product already in the wishlist");
            }
            else {
                wishlistButton.innerText = "Added To WishList";
            }
        }
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
})


const cartButton = document.querySelectorAll(".btn1");
cartButton.forEach(button => {
    button.addEventListener("click", () => {
        const pid = button.dataset.pid;
        addToCart(pid);
    });
})

const buyButton = document.querySelectorAll(".btn3");
buyButton.forEach(button => {
    button.addEventListener('click', () => {
        window.location.href = `/buynow?pid=${button.dataset.pid}`;
    });
})

