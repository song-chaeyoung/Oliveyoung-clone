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

// tab
const tabs = document.querySelectorAll(".tabs li");
const contents = document.querySelectorAll(
  ".contents .content1, .contents .content2"
);

tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => {
    for (let i = 0; i < tabs.length; i++) {
      let tab = tabs[i];
      tab.classList.remove("active");
    }
    for (let i = 0; i < contents.length; i++) {
      let content = contents[i];
      content.classList.remove("active");
    }
    tab.classList.add("active");
    contents[i].classList.add("active");
  });
});

// LocalStorage Item

let cartItems = [];

const initcart = () => {
  const cartData = JSON.parse(localStorage.getItem(`cartOliveyoung`));
  // console.log("cartData check = ", cartData);
  if (cartData) {
    createItem(cartData);
  }
  cartItems = cartData;
};

const createItem = (info) => {
  info.forEach((item, index) => {
    const createHTML = () => {
      const div = document.createElement("div");
      div.classList.add("list");
      document.querySelector(".list_one").appendChild(div);
      div.innerHTML = `
                            <div class="inner">
                            <div class="list_box">
                              <div class="image">
                                <input
                                  class="listcheck"
                                  type="checkbox"
                                  id="check${item.id}"
                                />
                                <label for="check${item.id}">
                                  <i class="fa-solid fa-check"></i
                                ></label>
                                <img src="${item.img}" alt="img01" />
                              </div>
                              <div class="text">
                                <div class="text_box">
                                  <p>${item.company}</p>
                                  <p>${item.title}</p>
                                  <div class="text_inner">
                                  </div>
                                </div>
                                <div class="money">
                                  <div class="money_icon">
                                    <i class="fa-solid fa-xmark" data-index=${item.id}></i>
                                  </div>
                                  <div class="money_container">
                                    <div class="money_box" data-index=${index}>
                                      <p>${item.price}원</p>
                                      <p>${item.salePrice}원</p>
                                    </div>
                                    <div class="money_listbox" data-id=${item.id}>
                                      <button data-index=${index}>-</button>
                                      <p>1</p>
                                      <button data-index=${index}>+</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
      `;

      const textInner = document.querySelectorAll(".text_inner");
      const infoTag = item.tag;
      infoTag.forEach((tag, idx) => {
        const span = document.createElement("span");
        span.innerText = `${tag.name}`;
        textInner.forEach((inner) => {
          inner.appendChild(span);
        });
      });
    };

    createHTML();
  });
};
initcart();

const save = () => {
  localStorage.setItem(`cartOliveyoung`, JSON.stringify(cartItems));
};

const deleteItem = (e) => {
  const target = e.target.dataset.index;
  const targetParent =
    e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
  cartItems = cartItems.filter((item) => item.id != target);
  save();
  targetParent.remove();
  productLengthEvent();
  productCalc();
  cartEmpty();
  mobileStickyStyle();
};

const allDeleteBtn = document.querySelector(".totalcheck_right input");
const mobileAllDelBtn = document.querySelector(".list_text p:nth-child(5)");

const allDeleteEvent = () => {
  const innerAll = document.querySelectorAll(".list");
  if (!confirm("장바구니의 모든 상품을 삭제하시겠습니까?")) {
  } else {
    cartItems = [];
    save();
    innerAll.forEach((i) => {
      i.remove();
    });
  }
  productLengthEvent();
  productCalc();
  cartEmpty();
  mobileStickyStyle();
};

allDeleteBtn.addEventListener("click", allDeleteEvent);
mobileAllDelBtn.addEventListener("click", allDeleteEvent);

const deleteBtn = document.querySelectorAll(".fa-xmark");

deleteBtn.forEach((btn) => {
  btn.addEventListener("click", deleteItem);
});

function cartEmpty() {
  const cartEmpty = document.querySelector(".content_empty_container");
  const cartContent = document.querySelector(".cart_content");

  if (
    cartItems === null ||
    cartItems.length === 0 ||
    cartItems.length === null ||
    cartItems.length === undefined
  ) {
    cartEmpty.classList.remove("empty");
    cartContent.classList.add("empty");
  } else if (cartItems.length >= 1) {
    cartEmpty.classList.add("empty");
    cartContent.classList.remove("empty");
  }
}
cartEmpty();

const mobileSticky = document.querySelector(".pay_sticky_container");

function mobileStickyStyle() {
  if (
    cartItems === null ||
    cartItems.length === 0 ||
    cartItems.length === null ||
    cartItems.length === undefined
  ) {
    mobileSticky.style.display = "none";
  } else {
    mobileSticky.style.display = "flex";
  }
}
mobileStickyStyle();

// All Check Event
const allCheck = document.querySelector("#check7");
const allCheckMo = document.querySelector("#check9");
const checkboxs = document.querySelectorAll(".listcheck");

allCheck.addEventListener("change", () => {
  eachCheckBoxFunction("pc");
});

allCheckMo.addEventListener("change", () => {
  eachCheckBoxFunction("mobile");
});

eachCheckBoxFunction = (view) => {
  checkboxs.forEach((box) => {
    if (view == "pc") {
      if (allCheck.checked) {
        box.checked = true;
      } else {
        box.checked = false;
      }
    } else {
      if (allCheckMo.checked) {
        box.checked = true;
      } else {
        box.checked = false;
      }
    }
  });
};

checkboxs.forEach((box, idx) => {
  box.addEventListener("change", () => {
    const checked = document.querySelectorAll(
      "input[class='listcheck']:checked"
    );
    if (!box.checked) {
      allCheck.checked = false;
      allCheckMo.checked = false;
    }
    if (checkboxs.length === checked.length) {
      allCheck.checked = true;
      allCheckMo.checked = true;
    }
  });
});

// Money Calc
let moneyListbox = document.querySelectorAll(".money_listbox");
let moneybox = document.querySelectorAll(".money_box");
const formatter = new Intl.NumberFormat("ko-KR", {
  style: "decimal",
  currency: "KRW",
});

// First Order Num Setting
let clickCountArray = [];
let nomarlPrices2 = [];
let discountPrices2 = [];
let calcNomarl2 = 0;
let calcDisCount2 = 0;

if (cartItems) {
  cartItems.forEach((item) => {
    clickCountArray.push(item.order);
  });
}

moneyListbox.forEach((money, idx) => {
  money.children[1].innerHTML = clickCountArray[idx];
});

moneybox.forEach((mItem, idx) => {
  nomarlPrices2.push(
    Number(mItem.children[0].innerHTML.slice(0, -1).replace(",", ""))
  );
  discountPrices2.push(
    Number(mItem.children[1].innerHTML.slice(0, -1).replace(",", ""))
  );

  calcNomarl2 = formatter.format(nomarlPrices2[idx] * clickCountArray[idx]);
  calcDisCount2 = formatter.format(discountPrices2[idx] * clickCountArray[idx]);
  mItem.children[0].innerHTML = `${calcNomarl2}원`;
  mItem.children[1].innerHTML = `${calcDisCount2}원`;
});

moneyListbox.forEach((item, idx) => {
  let clickCount = 1;
  let nomarlPrices = [];
  let discountPrices = [];
  moneybox.forEach((mItem) => {
    nomarlPrices.push(
      Number(mItem.children[0].innerHTML.slice(0, -1).replace(",", "")) /
        clickCountArray[idx]
    );
    discountPrices.push(
      Number(mItem.children[1].innerHTML.slice(0, -1).replace(",", "")) /
        clickCountArray[idx]
    );
  });

  const countLeft = item.children[0];
  const countRight = item.children[2];
  let countNumber = Number(item.children[1].innerHTML);
  clickCount = countNumber;

  let targetData;
  const orderLocalPush = (targetData, plusminus) => {
    const targetProduct = cartItems.find((item) => item.id == targetData[0].id);

    if (plusminus) {
      if (targetProduct) {
        targetProduct.order++;
      }
    } else {
      targetProduct.order--;
    }
    save();
  };

  countLeft.addEventListener("click", (e) => {
    let targetIdx = Number(e.currentTarget.dataset.index);
    cartItems.forEach((cartitem, idx) => {
      if (clickCount == 1) return;
      if (idx === targetIdx) {
        clickCount -= 1;
        clacMoney(targetIdx);
        productCalc();

        const targetID = e.target.parentNode.dataset.id;
        targetData = cartItems.filter((data) => data.id == targetID);
        orderLocalPush(targetData, false);
      }
    });
    item.children[1].innerHTML = clickCount;
  });

  countRight.addEventListener("click", (e) => {
    let targetIdx = Number(e.currentTarget.dataset.index);
    cartItems.forEach((cartitem, idx) => {
      if (idx === targetIdx) clickCount += 1;
    });
    item.children[1].innerHTML = clickCount;
    clacMoney(targetIdx);
    productCalc();

    const targetID = e.target.parentNode.dataset.id;
    targetData = cartItems.filter((data) => data.id == targetID);
    orderLocalPush(targetData, true);
  });

  let calcNomarl = 0;
  let calcDisCount = 0;
  function clacMoney(targetIdx) {
    console.log();
    calcNomarl = formatter.format(nomarlPrices[targetIdx] * clickCount);
    calcDisCount = formatter.format(discountPrices[targetIdx] * clickCount);

    moneybox[targetIdx].children[0].innerHTML = `${calcNomarl}원`;
    moneybox[targetIdx].children[1].innerHTML = `${calcDisCount}원`;
  }
});

// Total Calc
// Product Length
function productLengthEvent() {
  const productLength = document.querySelector(
    ".one_box .text_box p:nth-child(2)"
  );
  const listLength = document.querySelectorAll(".list").length;

  document.querySelector(
    ".pay_sticky_text p:nth-child(1)"
  ).innerText = `총 ${listLength}건`;
  productLength.innerText = listLength;
}
productLengthEvent();

// Product Calc
function productCalc() {
  const orderPrice = document.querySelector(".pay_box .pay_one p:nth-child(2)");
  const deliveryPrice = document.querySelector(
    ".pay_box .pay_two p:nth-child(2)"
  );
  const slaePrice = document.querySelector(
    ".pay_box .pay_three p:nth-child(2)"
  );
  const totalPrice = document.querySelector(".thrid_text_box p:nth-child(2)");

  const originPriceAll = document.querySelectorAll(".money_box p:nth-child(1)");
  let originPriceNum = 0;
  originPriceAll.forEach((originprice) => {
    originPriceNum += Number(
      originprice.innerText.slice(0, -1).replace(",", "")
    );
  });
  const originPrice2 = originPriceNum;
  originPriceNum = formatter.format(originPriceNum);
  orderPrice.innerText = `${originPriceNum}원`;
  document.querySelector(
    ".moblie_pay_text p:nth-child(2)"
  ).innerText = `${originPriceNum}원`;

  const salePriceAll = document.querySelectorAll(".money_box p:nth-child(2)");
  let slaePrieceNum = 0;
  salePriceAll.forEach((pirce) => {
    slaePrieceNum += Number(pirce.innerText.slice(0, -1).replace(",", ""));
  });
  const salePrice2 = slaePrieceNum;

  let salePriceFomatter = originPrice2 - salePrice2;
  const slaePriceFinalText = formatter.format(salePriceFomatter);
  slaePrice.innerText = `${slaePriceFinalText}원`;
  document.querySelector(
    ".moblie_pay_text_two p:nth-child(2)"
  ).innerText = `${slaePriceFinalText}원`;

  const deliveryOption = 2500;

  if (slaePrieceNum >= 40000) {
    deliveryPrice.innerText = `0원`;
    document.querySelector(
      ".pay_sticky_text p:nth-child(3)"
    ).innerText = `+ 배송비 0원`;
    document.querySelector(
      ".moblie_pay_text_three p:nth-child(2)"
    ).innerText = `0원`;
  } else {
    deliveryPrice.innerText = `2,500원`;
    document.querySelector(
      ".pay_sticky_text p:nth-child(3)"
    ).innerText = `+ 배송비 2,500원`;
    document.querySelector(
      ".moblie_pay_text_three p:nth-child(2)"
    ).innerText = `2,500원`;
    slaePrieceNum += deliveryOption;
  }

  slaePrieceNum = formatter.format(slaePrieceNum);
  totalPrice.innerText = `${slaePrieceNum}원`;
  document.querySelector(
    ".pay_sticky_text p:nth-child(2)"
  ).innerText = `${slaePrieceNum}원`;
  document.querySelector(
    ".moblie_pay_text_four p:nth-child(2)"
  ).innerText = `${slaePrieceNum}원`;
}
productCalc();

const allpayBtn = document.querySelector(".allpay");
const selectpayBtn = document.querySelector(".selectpay");
const mobileAllpayBtn = document.querySelector(
  ".pay_sticky_button button:nth-child(2)"
);

allpayBtn.addEventListener("click", () => {
  window.location = "/pay/pay.html";
});
mobileAllpayBtn.addEventListener("click", () => {
  window.location = "/pay/pay.html";
});

const introductionproductJson = "/db.json?timestamp=" + new Date().getTime();
const cartItemsAll = document.querySelectorAll(".introduction_box");

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // 요소 스와핑
  }
  return array;
}

fetch(introductionproductJson)
  .then((response) => response.json())
  .then((data) => {
    data.oliveyoungProduct.forEach((item) => {
      item.price = new Intl.NumberFormat("ko-kr", { currency: "KRW" }).format(
        item.price
      );
      item.salePrice = new Intl.NumberFormat("ko-kr", {
        currency: "KRW",
      }).format(item.salePrice);
    });

    const productData = shuffleArray(data.oliveyoungProduct);

    cartItemsAll.forEach((item, idx) => {
      if (idx < productData.length) {
        const product = productData[idx];

        item.innerHTML = `
          <div class="introduction_img" data-id="${product.id}" data-cate="${product.category}">
            <img src="${product.img}" alt="${product.id}" />
          </div>
          <div class="text_container">
            <div class="text_box">
              <p>${product.title}</p>
            </div>
            <div class="introduction_pay">
              <p>${product.price}원</p>
              <p>${product.salePrice}원</p>
            </div>
          </div>
          `;
      }
    });

    const introItem = document.querySelectorAll(".introduction_box");

    introItem.forEach((item) => {
      item.addEventListener("click", (e) => {
        const itemId = e.currentTarget.children[0].dataset.id;
        const itemCategory = e.currentTarget.children[0].dataset.cate;
        const url = `/product/productDetail.html?category=${encodeURIComponent(
          itemCategory
        )}&id=${itemId}`;
        window.location.href = url;
      });
    });
  })
  .catch((error) => console.error("Error fetching the JSON:", error));
