// Sidebar Short,Eye Event
const xMark = document.querySelector("#sidebar_xmark");
const cartMark = document.querySelector(".sidebar_icon_cart");
const commonSidebar = document.querySelector(".sidebar");

xMark.addEventListener("click", () => {
  commonSidebar.classList.remove("cart");
  commonSidebar.classList.toggle("short");
});

cartMark.addEventListener("click", () => {
  const sidebarXmark = sidebar.querySelector(".sidebar_cart_box_header i");
  commonSidebar.classList.toggle("cart");
  sidebarXmark.addEventListener("click", () => {
    commonSidebar.classList.remove("cart");
  });
});

const topBtn = document.querySelector(".mobile_top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 1000) topBtn.classList.add("active");
  else topBtn.classList.remove("active");
});

// Cart Count
let cartData = [];

const init = () => {
  const cartCount = JSON.parse(localStorage.getItem(`cartOliveyoung`));
  cartData = cartCount;
};

init();

const cartNum = document.querySelector(".cart_num");

if (cartData == null || cartData.length == 0) {
  cartNum.innerText = 0;
} else if (cartData.length >= 1) {
  cartNum.innerHTML = `${cartData.length}`;
}
