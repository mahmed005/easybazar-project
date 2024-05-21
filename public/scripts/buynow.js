const object = JSON.parse(localStorage.getItem("cid"))

const cid = object.cid;

document.querySelector("#cid").value = cid;