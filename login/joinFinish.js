// header & footer

const header = document.querySelector("header");
const sidebar = document.querySelector(".sidebar_common");
const footer = document.querySelector("footer");

fetch("/component/header.html")
    .then((res) => res.text())
    .then((data) => {
    header.innerHTML = data;
    const script = document.createElement("script");
    script.src = "/component/header.js";
    script.defer = true;
    document.body.appendChild(script);
    });

fetch("/component/sidebar.html")
    .then((res) => res.text())
    .then((data) => {
    sidebar.innerHTML = data;
    const script = document.createElement("script");
    script.src = "/component/sidebar.js";
    script.defer = true;
    document.body.appendChild(script);
    });

fetch("/component/footer.html")
    .then((res) => res.text())
    .then((data) => {
    footer.innerHTML = data;
    });