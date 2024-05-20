const loginForm = document.querySelector("#loginForm");

loginForm.addEventListener("submit" , async (event) => {
    event.preventDefault();
    const email = document.querySelector(".email").value;
    const password = document.querySelector(".password").value;
    const form = event.target;
    const selectedRadioButton = form.querySelector('input[name="option"]:checked');
    const option = selectedRadioButton.value;

    const response = await fetch("/login" , {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email , password , option})
    });

    const responseData = await response.json();

    if(responseData.message === "no") {
            document.querySelector(".signupheading").innerText = "Wrong Credentials!";
    } else {
        if(option === "buyer") {
            const cid = responseData[0].c_id;
            localStorage.setItem("cid" , JSON.stringify({cid}));
                window.location.href = "/home";
        } else {
            const sid = responseData[0].s_id;
            localStorage.setItem("sid" , JSON.stringify({sid}));
            window.location.href = "/sellerhome";
        }
    }
});