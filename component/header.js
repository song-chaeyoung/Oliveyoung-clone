// Header Fixed
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");

  if (window.scrollY > 100) header.classList.add("active");
  else header.classList.remove("active");
});

// Category Evnet
const categoryBtn = document.querySelector(".header .header_left_category");

categoryBtn.addEventListener("click", () => {
  const category = document.querySelector(".haeder_category_container");
  const categoryXmark = category.querySelector(".haader_category_xmark");

  category.classList.toggle("active");
  categoryXmark.addEventListener("click", () => {
    category.classList.remove("active");
  });
});

// Search Force Box
const searchForm = document.querySelector(".header_search_form");
const searchInput = document.querySelector("#header_search");
const searchIcon = document.querySelector(".search_icon");
const searchBox = document.querySelector(".header_center_search_forcebox");
const searchTime = document.querySelector(".search_ranking_setting p span");
const lastesContainer = document.querySelector(
  ".search_lastest_word_container"
);
const allDeleteBtn = document.querySelector(
  ".search_lastest_setting p:nth-child(1)"
);

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  searchEvent(e);
});

searchInput.addEventListener("click", (e) => {
  searchBox.style.display = "flex";
  timeInterval();
});
document.addEventListener("mousedown", function (e) {
  if (!searchBox.contains(e.target) && !searchInput.contains(e.target)) {
    searchBox.style.display = "none";
  }
});
// searchInput.addEventListener("blur", () => {
//   searchBox.style.display = "none";
// });

let searchList = [];
const save = () => {
  localStorage.setItem(`searchOliveyoung`, JSON.stringify(searchList));
};

const createText = (info) => {
  const div = document.createElement("div");
  div.classList.add("search_lastest_word");
  div.innerHTML = `
      <p>${info.keys}</p>
      <span data-index=${info.id}>
        <i class="fa-solid fa-xmark"></i>
      </span>
    `;
  lastesContainer.prepend(div);
};

const searchLocalEvnet = (searchValue) => {
  const searchNew = {
    id: new Date().getTime(),
    keys: searchValue,
  };

  searchList.unshift(searchNew);
  searchList = searchList.slice(0, 10);

  if (lastesContainer.children.length >= 10) {
    lastesContainer.removeChild(lastesContainer.lastChild);
  }

  save();
  createText(searchNew);
};

const init0 = () => {
  const searchInfos = JSON.parse(localStorage.getItem(`searchOliveyoung`));
  if (searchInfos) {
    searchInfos.slice(0, 10).forEach((info) => {
      createText(info);
    });
    searchList = searchInfos;
  }
};
init0();

const deleteList = (idx, e) => {
  searchList = searchList.filter(
    (item) => item.id != e.target.parentNode.dataset.index
  );
  save();
  e.target.parentNode.parentNode.remove();
};

const allDeleteList = () => {
  searchList = [];
  save();
  lastesContainer.innerHTML = "";
};

allDeleteBtn.addEventListener("click", allDeleteList);

const deleteIcon = document.querySelectorAll(
  ".search_lastest_word span .fa-xmark"
);

deleteIcon.forEach((mark, idx) => {
  mark.addEventListener("click", (e) => {
    deleteList(idx, e);
  });
});

function searchLink() {
  const searchValue = searchInput.value;
  const url = `/product/search.html?search=${encodeURIComponent(searchValue)}`;
  window.location.href = url;
}

function searchEvent(e) {
  if (searchInput.value === "" || searchInput.value == undefined) {
    alert("검색어를 입력해주세요!");
  } else {
    const searchValue = searchInput.value;
    searchLocalEvnet(searchValue);
    save();
    searchLink(e);
    searchInput.value = "";
  }
}

searchIcon.addEventListener("click", (e) => {
  searchEvent(e);
});

const timeInterval = () => {
  setInterval(() => {
    const nowTime = new Date();
    let hour = nowTime.getHours();
    let min = nowTime.getMinutes();

    hour = hour < 10 ? `0${hour}` : hour;
    min = min < 10 ? `0${min}` : min;

    searchTime.innerText = `${hour}:${min}`;
  }, 5000);
};
timeInterval();

// ranking Event
fetch("/db.json")
  .then((response) => response.json())
  .then(({ ranking }) => {
    let rankingData = ranking;
    let previousRanking = [...ranking];

    // 셔플 함수: 데이터 순서를 무작위로 섞음
    const shuffleRanking = () => {
      rankingData.sort(() => Math.random() - 0.5);
    };

    // 랭킹 업데이트 함수: 기존 아이템을 삭제하고 새로운 아이템을 추가
    const updateRanking = () => {
      const container = document.querySelector(
        ".search_ranking_word_container"
      );
      const existingItems = [...container.children];

      // 기존 아이템을 순차적으로 사라지게 함
      existingItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add("ranking-fade-out"); // 사라지는 애니메이션 추가
        }, index * 200); // 시간차를 두고 사라지게 함
      });

      setTimeout(() => {
        container.innerHTML = "";

        rankingData.slice(0, 10).forEach((item, idx) => {
          const previousIndex = previousRanking.findIndex(
            (it) => it.id === item.id
          );
          let iconClass;

          if (previousIndex < idx) {
            iconClass = "fa-caret-down";
          } else if (previousIndex > idx) {
            iconClass = "fa-caret-up";
          } else {
            iconClass = "fa-minus";
          }

          const div = document.createElement("div");
          div.classList.add("search_ranking_word", "ranking-fade-in");

          div.innerHTML = `
              <p><span>${idx + 1}</span>${item.name}</p>
              <span>
                <i class="fa-solid ${iconClass}"></i>
              </span>
            `;

          setTimeout(() => {
            div.classList.add("ranking-fade-in");
          }, idx * 300);

          container.appendChild(div);
        });

        previousRanking = [...rankingData];
      }, existingItems.length * 300);
    };

    setInterval(() => {
      shuffleRanking();
      updateRanking();
    }, 10000);

    updateRanking();
  });
