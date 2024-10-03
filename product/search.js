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

// Parmeter Event
const urlParams = new URLSearchParams(window.location.search);
const searchDesc = urlParams.get("search");

const title = document.querySelector("title");
const itemContainer = document.querySelector(".items");
const searchTitle = document.querySelector(".searchresult span");
const totalNum = document.querySelector(".title_left p span");

title.innerText = `${searchDesc} 의 검색결과`;
searchTitle.innerText = searchDesc;

let searchProduct = [];

fetch("/db.json")
  .then((response) => response.json())
  .then((data) => {
    const keyword = searchDesc.toLowerCase();

    searchProduct = data.oliveyoungProduct.filter((data) => {
      return data.title.toLowerCase().includes(keyword);
    });

    if (searchProduct.length === 0) {
      const itemMain = document.querySelector(".item_main");
      const article = document.createElement("article");
      article.innerHTML = `
        <div class="inner">
          <div class="search_empty">
            <span>
              <i class="fa-solid fa-exclamation"></i>
            </span>
            <p>
              ${keyword}의 검색결과가 없습니다.
            </p>
          </div>
        </div>
      `;

      itemMain.append(article);
    } else {
      createProduct(searchProduct);
      totalNum.innerText = searchProduct.length;
    }
  });

createProduct = (data) => {
  data.forEach((data) => {
    data.price = new Intl.NumberFormat("ko-kr", { currency: "KRW" }).format(
      data.price
    );
    data.salePrice = new Intl.NumberFormat("ko-kr", {
      currency: "KRW",
    }).format(data.salePrice);
    // }

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

    itemContainer.appendChild(div);
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

// Item Sort Event
const lists = document.querySelectorAll(".title_right ul li");

lists.forEach((list) => {
  list.addEventListener("click", () => {
    lists.forEach((i) => {
      i.classList.remove("active");
    });

    list.classList.add("active");
    listSort(list.dataset.info);
  });
});

function listSort(keyword) {
  const numberData = searchProduct.map((data) => {
    return {
      ...data,
      price: Number(data.price.replace(",", "")),
      salePrice: Number(data.salePrice.replace(",", "")),
      review: Number(data.review.replace(",", "")),
      score: Number(data.score),
    };
  });

  if (keyword === "low") {
    const lowProduct = numberData.sort((a, b) => {
      return a.salePrice - b.salePrice;
    });

    lowProduct.forEach((item) => {
      item.review = new Intl.NumberFormat("ko-kr", {
        currency: "KRW",
      }).format(item.review);
    });

    itemContainer.innerHTML = "";
    createProduct(lowProduct);
  } else if (keyword === "high") {
    const highProduct = numberData.sort((a, b) => {
      return b.salePrice - a.salePrice;
    });

    highProduct.forEach((item) => {
      item.review = new Intl.NumberFormat("ko-kr", {
        currency: "KRW",
      }).format(item.review);
    });

    itemContainer.innerHTML = "";
    createProduct(highProduct);
  } else if (keyword === "review") {
    const reveiwProduct = numberData.sort((a, b) => {
      return b.review - a.review;
    });

    reveiwProduct.forEach((item) => {
      item.review = new Intl.NumberFormat("ko-kr", {
        currency: "KRW",
      }).format(item.review);
    });

    itemContainer.innerHTML = "";
    createProduct(reveiwProduct);
  } else if (keyword === "star") {
    const startProduct = numberData.sort((a, b) => {
      return b.score - a.score;
    });

    startProduct.forEach((item) => {
      item.review = new Intl.NumberFormat("ko-kr", {
        currency: "KRW",
      }).format(item.review);
    });

    itemContainer.innerHTML = "";
    createProduct(startProduct);
  } else if (keyword === "popular") {
    itemContainer.innerHTML = "";
    createProduct(numberData);
  }
}
