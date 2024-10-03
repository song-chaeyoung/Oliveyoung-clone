
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
              loginText.textContent = '아이디 찾기';
            //   loginSubText.textContent = '휴대폰번호로 아이디 찾기';
          } else {
              loginText.textContent = '아이디 찾기';
            //   loginSubText.textContent = '이메일주소로 아이디찾기';
          }
      });
  });
});




document.addEventListener("DOMContentLoaded", function () {

  const loginBtn = document.querySelector(".loginBtn01 button");


  const inputMemberName = document.querySelector(".content1 #inputId");
  const inputMemberPhoneNum = document.querySelector(".content1 #inputPw");


  function validateLoginForm() {
    const nameValue = inputMemberName.value.trim();
    const PhoneNumValue = inputMemberPhoneNum.value.trim();


      if (nameValue === "") {
          alert("이름을 입력하세요.");
          inputMemberName.focus();
          return false;
      }


            const namePattern = /^[가-힣]+$/;
            if (!namePattern.test(nameValue)) {
                alert("올바른 이름을 입력해주세요.");
                inputOrderName.value = ""; 
                inputOrderName.focus(); 
                return false;
            }


        if (PhoneNumValue === "") {
        alert("휴대폰번호를 입력하세요.");
        inputMemberPhoneNum.focus();
        return false;
    }

      const phoneNumPattern = /^010\d{8}$/;
      if (!PhoneNumValue.match(phoneNumPattern)) {
          alert("올바른 휴대폰 번호를 입력해주세요.");
          inputMemberPhoneNum.value = ""; 
          inputMemberPhoneNum.focus();
          return false;
      }

      return true;
  }


  loginBtn.addEventListener("click", function (e) {
      if (!validateLoginForm()) {
          e.preventDefault();
      } else {
          alert("아이디 찾기 페이지로 넘어갑니다!");
      }
  });


  const orderBtn = document.querySelector(".orderbtn button");


  const inputOrderName = document.querySelector(".content2 #inputId");
  const inputOrderNumber = document.querySelector(".content2 #inputPw");


  function validateOrderForm() {
      const nameValue = inputOrderName.value.trim();
      const orderNumberValue = inputOrderNumber.value.trim();


      if (nameValue === "") {
          alert("이름을 입력하세요.");
          inputOrderName.focus();
          return false;
      }


      const namePattern = /^[가-힣]+$/;
      if (!namePattern.test(nameValue)) {
          alert("이름은 한글로만 입력하세요.");
          inputOrderName.value = ""; 
          inputOrderName.focus(); 
          return false;
      }


      if (orderNumberValue === "") {
          alert("이메일주소를 입력하세요.");
          inputOrderNumber.focus();
          return false;
      }


      const orderNumberPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!orderNumberPattern.test(orderNumberValue)) {
          alert("올바른 이메일주소의 형식을 입력하세요.");
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
          alert("아이디 찾기 페이지로 넘어갑니다!");
      }
  });
});