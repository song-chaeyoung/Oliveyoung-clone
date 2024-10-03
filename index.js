const header = document.querySelector("header");
const sidebar = document.querySelector(".sidebar_common");
const footer = document.querySelector("footer");

fetch("./component/header.html")
  .then((res) => res.text())
  .then((data) => {
    header.innerHTML = data;
    const script = document.createElement("script");
    script.src = "/component/header.js";
    script.defer = true;
    document.body.appendChild(script);
  });

fetch("./component/sidebar.html")
  .then((res) => res.text())
  .then((data) => {
    sidebar.innerHTML = data;
    const script = document.createElement("script");
    script.src = "/component/sidebar.js";
    script.defer = true;
    document.body.appendChild(script);
  });

fetch("./component/footer.html")
  .then((res) => res.text())
  .then((data) => {
    footer.innerHTML = data;
  });

// Main Page
// Main Slide Event
const indexInfo = "./indexslide.json";
const slideList = document.querySelector(".mainslide");
const slideListImg = slideList.getElementsByTagName("img");
const slideArrowLeft = document.querySelector(".mainslide_arrow_left");
const slideArrowRight = document.querySelector(".mainslide_arrow_right");

fetch(indexInfo)
  .then((response) => response.json())
  .then((data) => {
    slideData = data.mainsilde;
  });

let slideIndex = Number(slideListImg[0].dataset.index);
slideArrowLeft.addEventListener("click", () => {
  slideIndex--;
  if (slideIndex == 0) slideIndex = slideData.length;

  let currentSlideData = {};
  slideData.forEach((item) => {
    if (slideIndex === Number(item.id)) currentSlideData = item;
  });

  createSlideItem(currentSlideData);
});

slideArrowRight.addEventListener("click", () => {
  slideIndex++;
  if (slideIndex == slideData.length + 1) slideIndex = 1;

  let currentSlideData = {};
  slideData.forEach((item) => {
    if (slideIndex === Number(item.id)) currentSlideData = item;
  });

  createSlideItem(currentSlideData);
});

const startMainSlide = () => {
  const startSlide = setInterval(() => {
    if (slideIndex == slideData.length) slideIndex = 0;
    slideIndex++;

    let currentSlideData = {};
    slideData.forEach((item) => {
      if (slideIndex === Number(item.id)) currentSlideData = item;
    });

    createSlideItem(currentSlideData);
  }, 5000);

  const stopSlide = () => {
    clearInterval(startSlide);
  };

  slideList.addEventListener("mouseover", stopSlide);
};

startMainSlide();
slideList.addEventListener("mouseout", startMainSlide);

function createSlideItem(currentSlideData) {
  slideListImg[0].src = currentSlideData.img;
  slideListImg[0].alt = currentSlideData.title;
  slideListImg[0].dataset.index = currentSlideData.id;
  let mainSlideTxt = document.querySelector(".mianslide_text");
  const slideArrowText = document.querySelector(".mainslide_arrow_text");
  mainSlideTxt.querySelector(".sub_title").innerHTML =
    currentSlideData.subdessc;
  mainSlideTxt.querySelector(".title").innerHTML = currentSlideData.title;
  mainSlideTxt.querySelector(".description").innerHTML =
    currentSlideData.description;
  slideArrowText.innerText = `${slideIndex}/${slideData.length}`;
  if (currentSlideData.id === 6) {
    mainSlideTxt.style.color = "#000";
    slideArrowText.style.color = "#000";
  } else {
    mainSlideTxt.style.color = "#fff";
    slideArrowText.style.color = "#fff";
  }
}

// Product Json Data
const productJson = "./db.json";
let productData = [];
let allProductData = [];
const productItem = document.querySelectorAll(".productitem");

fetch(productJson)
  .then((response) => response.json())
  .then((data) => {
    return new Promise(async (resolve) => {
      try {
        await createProductData(data);
        cartEvent();
        resolve();
      } catch (error) {
        console.error(error);
      }
    });
  });

createProductData = (data) => {
  data.oliveyoungProduct.forEach((item) => {
    item.price = new Intl.NumberFormat("ko-kr", { currency: "KRW" }).format(
      item.price
    );
    item.salePrice = new Intl.NumberFormat("ko-kr", {
      currency: "KRW",
    }).format(item.salePrice);
  });
  productData = data.oliveyoungProduct;
  allProductData = data.oliveyoungProduct.slice(
    10,
    data.oliveyoungProduct.length - 1
  );

  productItem.forEach((product, i) => {
    product.innerHTML = commonChangeElement(productData[i]);

    const uls = product.querySelectorAll(
      ".productitem_text > ul:nth-of-type(1)"
    );
    const tags = productData[i].tag;

    for (let b = 0; b < tags.length; b++) {
      let madeLi = document.createElement("li");
      madeLi.innerText = tags[b].name;
      uls.forEach((ul) => {
        ul.appendChild(madeLi);
      });
    }
  });
};

// Product Common
let saveData = [];
const commonChangeElement = (data) => {
  let newElement = document.createElement("div");
  return (newElement.innerHTML = `
          <div class="productitem_img" data-category="${data.category}" data-id="${data.id}">
            <img src="${data.img}" alt="${data.id}" />
            <ul class="productitem_img_hoverbox">
              <li>
                <a href="javascript:void(0)">
                  <i class="fa-regular fa-heart"></i>
                </a>
              </li>
              <li class="cart_btn">
                <a href="javascript:void(0)">
                  <i class="fa-solid fa-cart-arrow-down"></i>
                </a>
              </li>
              <li>
                <a href="javascript:void(0)">
                  <i class="fa-regular fa-credit-card"></i>
                </a>
              </li>
            </ul>
          </div>
          <div class="productitem_text">
            <p>${data.title}</p>
            <h5>${data.price}</h5>
            <ul> 
            </ul>
            <ul>
              <li><i class="fa-solid fa-star"></i></li>
              <li>${data.score}</li>
              <li>(${data.review})</li>
            </ul>
          </div>
          `);
};

productItem.forEach((item, idx) => {
  item.addEventListener("click", (e) => {
    let category = e.currentTarget.children[0].dataset.category;
    let targetId = e.currentTarget.children[0].dataset.id;
    const url = `/product/productDetail.html?category=${encodeURIComponent(
      category
    )}&id=${targetId}`;
    window.location.href = url;
  });
});

// Cart Btn Event
let productCart = [];

let orderCount = 0;
function cartEvent() {
  const cartBtns = document.querySelectorAll(".cart_btn");

  cartBtns.forEach((btn) => {
    const pushLocalEvent = (e) => {
      e.stopPropagation();
      e.preventDefault();

      let dataID = btn.parentNode.parentNode.dataset.id;

      const save = () => {
        localStorage.setItem(`cartOliveyoung`, JSON.stringify(productCart));
      };

      productData.forEach((data, i) => {
        if (dataID == productData[i].id) {
          const existingProduct = productCart.find((item) => item.id == dataID);
          if (existingProduct) {
            existingProduct.order++;
          } else {
            productCart.push({
              ...productData[i],
              order: ++orderCount,
            });
          }
        }
        save();
      });

      if (!confirm("장바구니에 추가되었습니다. 장바구니로 이동하시겠습니까?")) {
      } else {
        window.location.href = `/cart/cart.html`;
      }
    };
    const init = () => {
      const cartInfos = JSON.parse(localStorage.getItem(`cartOliveyoung`));
      if (cartInfos) {
        productCart = cartInfos;
      }
    };
    init();
    btn.addEventListener("click", pushLocalEvent);
  });
}

// Shortcut Tab Change Event
const shortcutTabs = document.querySelectorAll(".shortcut_tab > p");
shortcutTabs.forEach((tab, i) => {
  tab.addEventListener("click", function () {
    const shortcutContents = document.querySelectorAll(".shortcut_icons");
    for (let i = 0; i < shortcutTabs.length; i++) {
      let tab = shortcutTabs[i];
      tab.classList.remove("active");
    }
    for (let i = 0; i < shortcutContents.length; i++) {
      let content = shortcutContents[i];
      content.classList.remove("active");
    }
    tab.classList.add("active");
    shortcutContents[i].classList.add("active");

    this.classList.add("active");
  });
});

// Shortcut Modal Event
const shortcutSetting = document.querySelector(".shortcut_header_setting");
const modalTabs = document.querySelectorAll(".shortcut_modal_tab > div");
const contents = document.querySelectorAll(".shortcut_modal_contents");
const modalIcon = document.querySelectorAll(
  ".modal_content_service .shortcut_modal_content_icon"
);
const modalIcon2 = document.querySelectorAll(
  ".modal_content_category .shortcut_modal_content_icon"
);
const shortcutModal = document.querySelector(".shortcut_modal_container");
const pushBtn = shortcutModal.querySelector(
  ".shortcut_modal_btnarea button:nth-child(2)"
);

let activeCount0 = 0;
let activeCount1 = 0;

function listPush() {
  let serviceFirstTab = document.querySelectorAll(".first-short > div");
  let serviceSecondTab = document.querySelectorAll(".second-short > div");
  let serviceArray = [];
  let serviceArray1 = [];

  serviceFirstTab.forEach((i) => {
    i.children[0].children[0].className = "fa-solid fa-plus";
    i.children[0].children[0].style.color = "";
    i.children[1].innerHTML = "바로가기";
  });
  serviceSecondTab.forEach((i) => {
    i.children[0].children[0].className = "fa-solid fa-plus";
    i.children[0].children[0].style.color = "";
    i.children[1].innerHTML = "바로가기";
  });

  modalIcon.forEach((item) => {
    if (item.classList.contains("check")) serviceArray.push(item);
  });
  modalIcon2.forEach((item) => {
    if (item.classList.contains("check")) serviceArray1.push(item);
  });

  serviceArray.forEach((userchoice, idx) => {
    serviceFirstTab[idx].children[0].children[0].className =
      userchoice.children[0].className;
    serviceFirstTab[idx].children[0].children[0].style.color = "#9ac75b";
    serviceFirstTab[idx].children[1].innerHTML = userchoice.dataset.name;
  });

  serviceArray1.forEach((userchoice, idx) => {
    serviceSecondTab[idx].children[0].children[0].className =
      userchoice.children[0].className;
    serviceSecondTab[idx].children[0].children[0].style.color = "#9ac75b";
    serviceSecondTab[idx].children[1].innerHTML = userchoice.dataset.name;
  });

  shortcutModal.classList.remove("active");

  const choiceIcons = document.querySelectorAll(".shortcut_icon");
  choiceIcons.forEach((icon) => {
    if (icon.querySelector("p").innerText === "장바구니") {
      icon.addEventListener("click", () => {
        window.location.href = `/cart/cart.html`;
      });
    } else if (icon.querySelector("p").innerText === "매장안내") {
      icon.addEventListener("click", () => {
        window.location.href = `/api/api.html`;
      });
    }
  });
}

shortcutSetting.addEventListener("click", () => {
  shortcutModal.classList.add("active");

  const xMark = shortcutModal.querySelector(".fa-xmark");
  const cancelBtn = shortcutModal.querySelector(
    ".shortcut_modal_btnarea button:nth-child(1)"
  );

  xMark.addEventListener("click", () => {
    shortcutModal.classList.remove("active");
  });
  cancelBtn.addEventListener("click", () => {
    shortcutModal.classList.remove("active");
  });

  document.addEventListener("keydown", (e) => {
    if (e.code == "Enter") listPush();
  });
});

modalTabs.forEach((tab, i) => {
  tab.addEventListener("click", function () {
    modalTabs.forEach((t) => {
      t.classList.remove("active");
    });
    contents.forEach((content) => {
      content.classList.remove("active");
    });
    tab.classList.add("active");
    contents[i].classList.add("active");
  });
});

const selectIcon = (icon, firstTab) => {
  icon.addEventListener("click", (e) => {
    if (firstTab) {
      if (activeCount0 < 8) {
        icon.classList.toggle("check");
        activeCount0 = Math.max(
          0,
          activeCount0 + (icon.classList.contains("check") ? 1 : -1)
        );
      } else {
        if (icon.classList.contains("check")) {
          e.currentTarget.classList.remove("check");
          activeCount0--;
        } else {
          alert("최대 8개의 서비스를 선택할 수 있습니다.");
        }
      }
    } else {
      if (activeCount1 < 8) {
        icon.classList.toggle("check");
        activeCount1 = Math.max(
          0,
          activeCount1 + (icon.classList.contains("check") ? 1 : -1)
        );
      } else {
        if (icon.classList.contains("check")) {
          e.currentTarget.classList.remove("check");
          activeCount1--;
        } else {
          alert("최대 8개의 카테고리를 선택할 수 있습니다.");
        }
      }
    }
  });
};

modalIcon.forEach((icon) => {
  selectIcon(icon, true);
});
modalIcon2.forEach((icon) => {
  selectIcon(icon, false);
});

pushBtn.addEventListener("click", listPush);

// personalitem Event
const form = document.querySelector(".personalitem_select_container");

const personalItemRandom = () => {
  const personalProducts = document.querySelectorAll(
    ".personalitem_product_itme"
  );
  let randomNum = new Set();
  personalProducts.forEach((product, idx) => {
    for (let i = 0; i <= idx; i++) {
      randomNum = Math.floor(Math.random() * productData.length);
    }

    price = new Intl.NumberFormat("ko-kr", {
      currency: "KRW",
    }).format(productData[randomNum].salePrice);
    if (randomNum == productData[randomNum].id) {
      product.innerHTML = commonChangeElement(productData[randomNum]);
    }
  });
};

const skintypeInput = document.querySelectorAll(".skintype_radio input");
const personalcolorInput = document.querySelectorAll(
  ".personalcolor_radio input"
);
const skinconcernInput = document.querySelectorAll(
  ".skinworried_checkbox input"
);
const inputs = document.querySelectorAll(".personalitem_select_type input");

const personalItemDisplay = () => {
  let userInfo = {
    skinType: "",
    personalColor: "",
    skinConcern: "",
  };

  skintypeInput.forEach((it) => {
    if (Boolean(it.checked)) userInfo.skinType = it.dataset.info;
  });

  personalcolorInput.forEach((it) => {
    if (Boolean(it.checked)) userInfo.personalColor = it.dataset.info;
  });

  skinconcernInput.forEach((it) => {
    if (Boolean(it.checked)) userInfo.skinConcern = it.dataset.info;
  });

  let userSelectItems = productData;

  if (userInfo.skinType && userInfo.skinType !== "") {
    userSelectItems = productData.filter(
      (item) => item.skinType === userInfo.skinType
    );
  }

  if (userInfo.personalColor && userInfo.personalColor !== "") {
    userSelectItems = userSelectItems.filter(
      (item) => item.personalColor === userInfo.personalColor
    );
  }

  if (userInfo.skinConcern && userInfo.skinConcern !== "") {
    userSelectItems = userSelectItems.filter((item) => {
      return (
        item.skinConcern.filter((it) => it === userInfo.skinConcern).length > 0
      );
    });
  }

  const personalProducts = document.querySelectorAll(
    ".personalitem_product_itme"
  );

  if (userSelectItems.length === 0) {
    personalProducts.forEach((product) => {
      product.innerHTML = "";
    });
    document
      .querySelector(".personalitem_product_itmes_empty")
      .classList.add("empty");
  }
  if (userSelectItems.length >= 6) {
    personalProducts.forEach((product, idx) => {
      product.innerHTML = commonChangeElement(userSelectItems[idx]);
    });
  } else {
    personalProducts.forEach((product) => {
      product.innerHTML = "";
    });
    for (let i = 0; i < userSelectItems.length; i++) {
      personalProducts[i].innerHTML = commonChangeElement(userSelectItems[i]);
    }
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  document
    .querySelector(".personalitem_product_itmes_empty")
    .classList.remove("empty");

  const inputs = document.querySelectorAll(".personalitem_select_type input");

  let isChecked = false;
  inputs.forEach((input) => {
    if (input.checked) {
      isChecked = true;
    }
  });

  if (!isChecked) {
    alert("피부 정보를 입력해주세요!");
  } else {
    document
      .querySelector(".personalitem_product_itmes_loading")
      .classList.add("loading");
    setTimeout(() => {
      document
        .querySelector(".personalitem_product_itmes_loading")
        .classList.remove("loading");
    }, 3000);
    // personalItemRandom();
    personalItemDisplay();
  }
  cartEvent();
});

// todayprice Timer
const todayPriceTimers = document.querySelectorAll(
  ".todayprice_content_item_timer_num"
);

function dateCalc() {
  const nowTime = new Date();
  const tomorrow = new Date(
    nowTime.getFullYear(),
    nowTime.getMonth(),
    nowTime.getDate() + 1
  );
  const remainingMs = tomorrow - nowTime;

  const seconds = Math.floor(remainingMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const remainingSeconds = seconds % 60;
  const remainingMinutes = minutes % 60;
  const remainingHours = hours % 24;

  return {
    hours: String(remainingHours).padStart(2, "0"),
    minutes: String(remainingMinutes).padStart(2, "0"),
    seconds: String(remainingSeconds).padStart(2, "0"),
  };
}

todayPriceTimers.forEach((timer) => {
  setInterval(() => {
    const { hours, minutes, seconds } = dateCalc();
    timer.innerText = `${hours} : ${minutes} : ${seconds}`;
  }, 1000);
});

// update tab Event
const updateContentsContainer = document.querySelector(
  ".update_content_container"
);
const updateContents = document.querySelectorAll(".update_content");
const updateChangeBtn = document.querySelector(".update_changetab");
const updateNum = document.querySelector(".update_number");

fetch(indexInfo)
  .then((response) => response.json())
  .then((data) => {
    updateData = data.update;
    updateNum.innerHTML = `<span>1</span><span></span><span> ${
      updateData.length / 2
    }</span>`;
  });

let updateSectionIndex = Number(updateContentsContainer.dataset.index);

const updateItem = (updateSlideData) => {
  updateContents.forEach((content, idx) => {
    content.children[0].children[0].src = updateSlideData[idx].img;
    content.children[1].children[0].innerText = updateSlideData[idx].title;
    content.children[1].children[1].innerText = updateSlideData[idx].desc;
  });
  updateNum.innerHTML = `<span>${updateSectionIndex}</span><span></span><span> ${
    updateData.length / 2
  }</span>`;
};

const updateSlide = () => {
  updateSectionIndex++;
  if (updateSectionIndex == updateData.length / 2 + 1) updateSectionIndex = 1;
  let updateSlideData = [];
  updateData.forEach((data, i) => {
    if (updateSectionIndex == 1) {
      if (i == 0 || i == 1) updateSlideData.push(data);
    } else if (updateSectionIndex == 2) {
      if (i == 2 || i == 3) updateSlideData.push(data);
    } else if (updateSectionIndex == 3) {
      if (i == 4 || i == 5) updateSlideData.push(data);
    }
  });
  updateItem(updateSlideData);
};
updateChangeBtn.addEventListener("click", updateSlide);

// TodayRanking Timer
const timeWrapper = document.querySelector(".todayranking_title > p");

setInterval(() => {
  const nowTime = new Date();
  let nowHour = nowTime.getHours();
  let nowMin = nowTime.getMinutes();

  nowHour = nowHour < 10 ? `0${nowHour}` : nowHour;
  nowMin = nowMin < 10 ? `0${nowMin}` : nowMin;

  timeWrapper.innerText = `${nowHour}:${nowMin}`;
}, 1000);

// TodayRanking Category
const todayRankingTabs = document.querySelectorAll(".todayranking_tab li");
const todayRankingItems = document.querySelectorAll(".todayranking_item");

let categoryItems = [];

const productChange = (tab, i) => {
  productData.forEach(() => {
    categoryItems = productData.filter((data) => data.category == tab.id);
  });

  todayRankingItems.forEach((item, idx) => {
    if (tab.id == "all") {
      item.innerHTML = commonChangeElement(allProductData[idx]);
    } else item.innerHTML = commonChangeElement(categoryItems[idx]);
  });
  cartEvent();
};

todayRankingTabs.forEach((tab, i) => {
  tab.addEventListener("click", function () {
    todayRankingTabs.forEach((t) => {
      t.classList.remove("active");
    });
    this.classList.add("active");
    productChange(tab, i);
  });
});

// Brand Event
const brandTabs = document.querySelectorAll(".brand_tab li");
const brandSlideContainer = document.querySelector(
  ".brand_content_slide_container"
);
const brandItems = document.querySelectorAll(".brand_content_item");

fetch(indexInfo)
  .then((response) => response.json())
  .then((data) => {
    return new Promise(async (resolve) => {
      try {
        await creatBrandSlide(data.brand);
        resolve();
      } catch (error) {
        console.error(error);
      }
    });
  });

const makeClone = () => {
  let slides = document.querySelectorAll(".brand_content_slide");
  let firstChild = slides[0];
  let clonedFirst = firstChild.cloneNode(true);
  clonedFirst.classList.add("clone");
  brandSlideContainer.appendChild(clonedFirst);

  let lastChild = slides[slides.length - 1];
  let clonedLast = lastChild.cloneNode(true);
  clonedLast.classList.add("clone");
  brandSlideContainer.prepend(clonedLast);

  firstPosition(slides);
};

const firstPosition = (slides) => {
  // // const slideWidth = slides[0].clientWidth;
  // const slideWidth = slides[0].clientWidth;
  // // console.log(slideWidth);
  // brandSlideContainer.style.transform = `translateX(${-slideWidth}px)`;

  let slidesss = document.querySelector(".brand_content");

  setTimeout(() => {
    const slideWidth = slidesss.clientWidth;
    brandSlideContainer.style.transform = `translateX(${-slideWidth}px)`;
  }, 300);
};

window.addEventListener("resize", function () {
  let slidesss = document.querySelector(".brand_content");
  const slideWidth = slidesss.clientWidth;
  // console.log(slideWidth);
  brandSlideContainer.style.transform = `translateX(${-slideWidth}px)`;
});

creatBrandSlide = (brandData) => {
  brandData.forEach((item) => {
    let newElement = document.createElement("div");
    newElement.classList.add("brand_content_slide");
    newElement.innerHTML = `
        <div class="brand_content_img">
          <img src="${item.img}" alt="brandimg01" />
          <div class="brand_content_text">
            <h4>${item.brandname}</h4>
            <p>
              <i class="fa-regular fa-heart"></i> ${item.likenum}명이 좋아합니다.
            </p>
          </div>
        </div>
      `;
    brandSlideContainer.appendChild(newElement);
  });
  makeClone();
};

let currentSlide = 1;
let brandItemData = [];
const contentChange = (tab) => {
  productData.forEach(() => {
    brandItemData = productData.filter((data) => data.company == tab.innerText);
  });
  brandItems.forEach((item, i) => {
    item.innerHTML = `
                <div class="brand_content_item_img" data-id="${brandItemData[i].id}" data-category=${brandItemData[i].category}>
                  <img src="${brandItemData[i].img}" alt="${brandItemData[i].id}" />
                </div>
                <div class="brand_content_item_info">
                <p>${brandItemData[i].company}</p>
                  <h6>${brandItemData[i].title}</h6>
                  <div>
                    <p><span>${brandItemData[i].price}</span>원</p>
                    <p><span>${brandItemData[i].salePrice}</span>원</p>
                  </div>
                </div>
    `;
  });
};

brandTabs.forEach((tab, idx) => {
  tab.addEventListener("click", () => {
    brandTabs.forEach((t) => {
      t.classList.remove("active");
    });
    tab.classList.add("active");
    currentSlide = idx + 1;

    slide();
    contentChange(tab);
  });
});

const brandArrowLeft = document.querySelector(".brand_content_arrow_left");
const brandArrowRight = document.querySelector(".brand_content_arrow_right");

brandArrowLeft.addEventListener("click", () => {
  brandTabs.forEach((item) => {
    item.classList.remove("active");
  });

  currentSlide--;

  let newbrandItem = [];
  brandTabs.forEach((item, idx) => {
    if (idx + 1 === currentSlide) {
      item.classList.add("active");
      newbrandItem = item;
    }
  });

  slide();

  if (currentSlide == 0) {
    let slides = document.querySelectorAll(".brand_content_slide");
    const slideWidth = slides[0].clientWidth;
    currentSlide = slides.length - 2;

    setTimeout(() => {
      brandSlideContainer.style.transform = `translateX(${
        -slideWidth * currentSlide
      }px)`;
      brandSlideContainer.style.transition = "none";
    }, 300);

    let newbrandItem = [];
    brandTabs.forEach((item, idx) => {
      if (idx + 1 === currentSlide) {
        item.classList.add("active");
        newbrandItem = item;
        contentChange(brandTabs[brandTabs.length - 1]);
      }
    });
  }
  contentChange(newbrandItem);
});

brandArrowRight.addEventListener("click", () => {
  brandTabs.forEach((item) => {
    item.classList.remove("active");
  });

  currentSlide++;

  let newbrandItem = [];
  brandTabs.forEach((item, idx) => {
    if (idx + 1 === currentSlide) {
      item.classList.add("active");
      newbrandItem = item;
    }
  });
  const slides = document.querySelectorAll(".brand_content_slide");

  slide();

  if (currentSlide == slides.length - 1) {
    const slideWidth = slides[0].clientWidth;
    currentSlide = 1;

    brandTabs.forEach((item, idx) => {
      if (idx + 1 === currentSlide) {
        item.classList.add("active");
        newbrandItem = item;
        contentChange(brandTabs[0]);
      }
    });

    setTimeout(() => {
      brandSlideContainer.style.transition = "none";
      brandSlideContainer.style.transform = `translateX(${-slideWidth}px)`;
    }, 300);
  } else {
    contentChange(newbrandItem);
  }
});

function slide() {
  let slides = document.querySelectorAll(".brand_content_slide");
  let slideWidth = slides[0].clientWidth;
  // let slideWidth = slides[0].scrollWidth;

  brandSlideContainer.style.transform = `translateX(${
    currentSlide * -slideWidth
  }px)`;
  brandSlideContainer.style.transition = "0.3s";
}

brandItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    const itemID = e.currentTarget.children[0].dataset.id;
    const itemCategory = e.currentTarget.children[0].dataset.category;
    const url = `/product/productDetail.html?category=${encodeURIComponent(
      itemCategory
    )}&id=${itemID}`;
    window.location.href = url;
  });
});

// oliveyoung Live
const videoMain = document.querySelector(".video_main");
videoMain.addEventListener("pause", () => {
  const videoHover = document.querySelector(
    ".oliveyounglive_right_video_hover"
  );
  videoHover.classList.add("active");

  videoHover.addEventListener("mouseover", () => {
    videoHover.classList.remove("active");
  });
  videoMain.addEventListener("mouseout", () => {
    videoHover.classList.add("active");
  });
});
