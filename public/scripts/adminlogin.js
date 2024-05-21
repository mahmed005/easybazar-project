const loginForm = document.querySelector("#loginForm");

loginForm.addEventListener("submit" , async (event) => {
    event.preventDefault();
    const email = document.querySelector(".email").value;
    const password = document.querySelector(".password").value;

    const response = await fetch("/adminlogin" , {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email , password})
    });

    const responseData = await response.json();

    if(responseData.message === "no") {
            document.querySelector(".signupheading").innerText = "Wrong Credentials!";
    } else {
        const aid = responseData.adminId;
        localStorage.setItem("aid" , JSON.stringify({aid}));
        window.location.href = "/adminhome";
    }
});