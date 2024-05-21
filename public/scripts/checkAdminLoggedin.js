const adminId = localStorage.getItem("aid");

if (!adminId) {
    window.location.href = "/login";
} else {
    const logoutDiv = document.querySelector(".js-logout");
    logoutDiv.innerText = "Log Out";
    logoutDiv.addEventListener("click" , () => {
        localStorage.removeItem("aid");
        window.location.href = "/adminlogin";
    });
}