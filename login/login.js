
const tabs = document.querySelectorAll(".tabs li");
const contents = document.querySelectorAll(".contents > div");


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
    


// 로그인 & 비회원 텍스트 변경
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tabs li');
    const contents = document.querySelectorAll('.contents > div');
    const loginText = document.querySelector('.loginText h2');
    const loginSubText = document.querySelector('.loginText span');

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            tabs.forEach(tab => tab.classList.remove('active'));
            tab.classList.add('active');

            contents.forEach(content => content.classList.remove('active'));
            contents[index].classList.add('active');

            if(index === 0) {
                loginText.textContent = '로그인';
                loginSubText.textContent = '올리브영의 다양한 서비스와 혜택을 누리세요.';
            } else {
                loginText.textContent = '비회원 주문조회';
                loginSubText.textContent = '주문번호로 비회원 주문을 조회하세요.';
            }
        });
    });
});




document.addEventListener("DOMContentLoaded", function () {

    const loginBtn = document.querySelector(".loginBtn01 button");
    const inputMemberId = document.querySelector(".content1 #inputId");
    const inputMemberPw = document.querySelector(".content1 #inputPw");


    function validateLoginForm() {
        const idValue = inputMemberId.value.trim();
        const pwValue = inputMemberPw.value.trim();


        if (idValue === "") {
            alert("아이디를 입력하세요.");
            inputMemberId.focus();
            return false;
        }


        if (pwValue === "") {
            alert("비밀번호를 입력하세요.");
            inputMemberPw.focus();
            return false;
        }


        const pwPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,12}$/;
        if (!pwValue.match(pwPattern)) {
            alert("비밀번호는 8-12자이며, 최소 하나의 영문자, 하나의 숫자, 하나의 특수문자를 포함해야 합니다.");
            inputMemberPw.value = "";
            inputMemberPw.focus();
            return false;
        }
        return true;
    }


    loginBtn.addEventListener("click", function (e) {
        if (!validateLoginForm()) {
            e.preventDefault();
      } else {
          alert("올리브영 회원님 반갑습니다!");
      }
  });


  const orderBtn = document.querySelector(".orderbtn button");


  const inputOrderName = document.querySelector(".content2 #inputId");
  const inputOrderNumber = document.querySelector(".content2 #inputPw");


  function validateOrderForm() {
      const nameValue = inputOrderName.value.trim();
      const orderNumberValue = inputOrderNumber.value.trim();


      if (nameValue === "") {
          alert("주문자명을 입력하세요.");
          inputOrderName.focus();
          return false;
      }


      const namePattern = /^[가-힣]+$/;
      if (!namePattern.test(nameValue)) {
          alert("주문자명은 한글로만 입력하세요.");
          inputOrderName.value = ""; 
          inputOrderName.focus(); 
          return false;
      }


      if (orderNumberValue === "") {
          alert("주문번호를 입력하세요.");
          inputOrderNumber.focus();
          return false;
      }


      const orderNumberPattern = /^\d{6,12}$/;
      if (!orderNumberPattern.test(orderNumberValue)) {
          alert("주문번호는 6-12자리 숫자로 입력하세요.");
          inputOrderNumber.value = ""; 
          inputOrderNumber.focus(); 
          return false;
      }

      return true;
  }


  orderBtn.addEventListener("click", function (e) {
      if (!validateOrderForm()) {
          e.preventDefault(); 
      } else {
          alert("주문 조회 성공!");
      }
  });
});