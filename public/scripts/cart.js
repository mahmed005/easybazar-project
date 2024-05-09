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
            console.log(cart);
}