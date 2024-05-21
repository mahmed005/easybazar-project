const customerId = localStorage.getItem("cid");

if (!customerId) {
    window.location.href = "/login";
} else {
    const logoutDiv = document.querySelector(".js-logout");
    logoutDiv.innerText = "Log Out";
    logoutDiv.addEventListener("click" , () => {
        localStorage.removeItem("cid");
        window.location.href = "/login";
    });
}