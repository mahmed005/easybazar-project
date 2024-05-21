const sellerId = localStorage.getItem("sid");

if(!sellerId) {
    window.location.href = "/login";
} else {
    const logoutButton = document.querySelector(".js-logout");
    logoutButton.innerText = "Log out"
    logoutButton.addEventListener('click' , () => {
        localStorage.removeItem("sid");
        window.location.href = "/login";
    })
}