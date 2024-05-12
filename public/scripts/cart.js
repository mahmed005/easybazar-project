export const cart = JSON.parse(sessionStorage.getItem('cart')) || [];

export function addToCart(pid)
{
    let flag = false;
    for(let i = 0; i < cart.length ; i++)
        {
            if(pid == cart[i].pid)
                {
                    flag = true;
                    cart[i].quantity++;
                }
        }
        if(!flag)
            {
                const productObject = {
                    pid,
                    quantity : 1
                };
                cart.push(productObject);
            }
            sessionStorage.setItem('cart' , JSON.stringify(cart));
}

export function removeFromCart(pid)
{
    for(let i = 0; i< cart.length ; i++)
        {
            if(cart[i].pid === pid)
                {
                    cart.splice(i , 1);
                }
        }
        sessionStorage.setItem('cart' , JSON.stringify(cart));
}

export function updateItemQuantity(pid , quantity)
{
    for(let i = 0; i< cart.length ; i++)
        {
            if(cart[i].pid === pid)
                {
                    cart[i].quantity = quantity;
                }
        }
        sessionStorage.setItem('cart' , JSON.stringify(cart));
}