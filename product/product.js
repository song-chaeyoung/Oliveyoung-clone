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

// item Fetch

let productData = [];
let categoryDate = [];
const rankingContainer = document.querySelector(".ranking_items");

fetch("/db.json")
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
    productData = data.oliveyoungProduct;
    categoryDate = productData;

    return new Promise(async (resolve) => {
      try {
        await createProduct(productData);
        cartEvent(data);
        resolve();
      } catch (error) {
        console.error(error);
      }
    });
  });

createProduct = (data) => {
  // console.log(data);

  data.forEach((data) => {
    const div = document.createElement("div");
    div.className = "ranking_item productitem";
    div.innerHTML = `
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
                  <h5>${data.salePrice}</h5>
                  <ul class="tag_conatiner"></ul>
                  <ul>
                    <li><i class="fa-solid fa-star"></i></li>
                    <li>${data.score}</li>
                    <li>(${data.review})</li>
                  </ul>
                </div>
    `;

    const tags = data.tag;
    const tagContainer = div.querySelector(".tag_conatiner");

    tags.forEach((tag) => {
      const li = document.createElement("li");
      li.innerText = tag.name;
      tagContainer.appendChild(li);
    });

    rankingContainer.appendChild(div);
  });

  const productItem = document.querySelectorAll(".productitem");
  productItem.forEach((item) => {
    item.addEventListener("click", (e) => {
      let category = e.currentTarget.children[0].dataset.category;
      let targetId = e.currentTarget.children[0].dataset.id;
      const url = `/product/productDetail.html?category=${encodeURIComponent(
        category
      )}&id=${targetId}`;
      window.location.href = url;
    });
  });
};

// Cart Btn Event
let productCart = [];
let orderCount = 0;
function cartEvent(data) {
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

// Categroy Event
const categoryBtns = document.querySelectorAll(".category_list p");
const select = document.querySelector("#ranking");

categoryBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    categoryBtns.forEach((b) => {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    categoryItemSort(e.target.dataset.info);
    select.selectedIndex = 0;
  });
});

const categoryItemSort = (category) => {
  const title = document.querySelector(".ranking_header h2");

  if (category === "all") {
    rankingContainer.innerHTML = "";
    createProduct(productData);
  } else {
    categoryDate = productData.filter((data) => data.category == category);

    rankingContainer.innerHTML = "";
    createProduct(categoryDate);
  }

  switch (category) {
    case "all":
      title.innerText = "랭킹";
      break;
    case "skincare":
      title.innerText = "스킨케어";
      break;
    case "makeup":
      title.innerText = "메이크업";
      break;
    case "cleansing":
      title.innerText = "클렌징";
      break;
    case "maskpack":
      title.innerText = "마스크팩";
      break;
    case "food":
      title.innerText = "헬스&푸드";
      break;
  }
};

// Select Value

select.addEventListener("change", (e) => {
  const value = e.target.value;

  const numberData = categoryDate.map((data) => {
    return {
      ...data,
      price: Number(data.price.replace(",", "")),
      salePrice: Number(data.salePrice.replace(",", "")),
      review: Number(data.review.replace(",", "")),
      score: Number(data.score),
    };
  });

  if (value === "low") {
    const lowProduct = numberData.sort((a, b) => {
      return a.salePrice - b.salePrice;
    });

    lowProduct.forEach((item) => {
      item.salePrice = new Intl.NumberFormat("ko-kr", {
        currency: "KRW",
      }).format(item.salePrice);
      item.review = new Intl.NumberFormat("ko-kr", {
        currency: "KRW",
      }).format(item.review);
    });

    rankingContainer.innerHTML = "";
    createProduct(lowProduct);
  } else if (value === "high") {
    const highProduct = numberData.sort((a, b) => {
      return b.salePrice - a.salePrice;
    });

    highProduct.forEach((item) => {
      item.salePrice = new Intl.NumberFormat("ko-kr", {
        currency: "KRW",
      }).format(item.salePrice);
      item.review = new Intl.NumberFormat("ko-kr", {
        currency: "KRW",
      }).format(item.review);
    });

    rankingContainer.innerHTML = "";
    createProduct(highProduct);
  } else if (value === "review") {
    const reveiwProduct = numberData.sort((a, b) => {
      return b.review - a.review;
    });

    reveiwProduct.forEach((item) => {
      item.salePrice = new Intl.NumberFormat("ko-kr", {
        currency: "KRW",
      }).format(item.salePrice);
      item.review = new Intl.NumberFormat("ko-kr", {
        currency: "KRW",
      }).format(item.review);
    });

    rankingContainer.innerHTML = "";
    createProduct(reveiwProduct);
  } else if (value === "star") {
    const startProduct = numberData.sort((a, b) => {
      return b.score - a.score;
    });

    startProduct.forEach((item) => {
      item.salePrice = new Intl.NumberFormat("ko-kr", {
        currency: "KRW",
      }).format(item.salePrice);
      item.review = new Intl.NumberFormat("ko-kr", {
        currency: "KRW",
      }).format(item.review);
    });

    rankingContainer.innerHTML = "";
    createProduct(startProduct);
  } else if (value === "popular") {
    rankingContainer.innerHTML = "";
    createProduct(categoryDate);
  }
});
