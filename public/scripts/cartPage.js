import {cart} from "./cart";

async function renderCartItems()
{
    const response = await ("/cart" , {
        method : "GET",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cart)
    });
    const responseData = await response.json();
    console.log(responseData);
}

renderCartItems();