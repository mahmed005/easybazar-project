const cid = JSON.parse(localStorage.getItem("cid")) || 1;

document.querySelector("#cid").value = cid;