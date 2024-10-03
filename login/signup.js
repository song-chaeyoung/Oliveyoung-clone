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


    document.addEventListener("DOMContentLoaded", function () {
        let isIdChecked = false;
        let isEmailChecked = false;
        let isPhoneVerified = false;

        const signId = document.getElementById("signId");
        const password1 = document.getElementById("password1");
        const password2 = document.getElementById("password2");
        const name = document.getElementById("name");
        const email = document.getElementById("email");
        const phoneNum = document.getElementById("phoneNum");
        const tokenButton = document.getElementById("token_button");
        const signupButton = document.getElementById("signup_button");
        const checkButton = document.getElementById("check_button"); 
        const checkEmailButton = document.getElementById("check_email_button"); 
        const agreeAllCheckbox = document.getElementById("agreeAll"); 
        const requiredCheckboxes = document.querySelectorAll(".checkbox.required"); 
        const optionalCheckboxes = document.querySelectorAll(".checkbox.optional"); 

        const errorId = document.getElementById("error_id");
        const errorPassword1 = document.getElementById("error_password1");
        const errorPassword2 = document.getElementById("error_password2");
        const errorWriter = document.getElementById("error_writer");
        const errorEmail = document.getElementById("error_email");
        const errorPhoneNum = document.getElementById("error_phoneNum");
        const errorAddress = document.getElementById("error_address"); 


        const idRegex = /^[a-zA-Z0-9_-]{5,20}$/; 
        const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/; 
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 
        const phoneRegex11 = /^010\d{8}$/; 
        const phoneRegex10 = /^(011|017|018|019|016)\d{3}\d{4}$/; 
        const nameRegex = /^[가-힣]{2,}$/;
      

        function validateId() {
            if (!idRegex.test(signId.value)) {
                errorId.textContent = "아이디는 5~20자의 영문, 숫자, -, _만 사용할 수 있습니다.";
            } else {
                errorId.textContent = "";
            }
        }
      
        function validatePassword1() {
            if (!pwRegex.test(password1.value)) {
                errorPassword1.textContent = "비밀번호는 8~16자의 영문과 숫자 조합이어야 합니다.";
            } else {
                errorPassword1.textContent = "";
            }
        }
      
        function validatePassword2() {
            if (password1.value !== password2.value) {
                errorPassword2.textContent = "비밀번호가 일치하지 않습니다.";
            } else {
                errorPassword2.textContent = "";
            }
        }
      
        function validateName() {
            if (!nameRegex.test(name.value)) {
                errorWriter.textContent = "이름은 한글 2자 이상으로 입력해주세요.";
            } else {
                errorWriter.textContent = "";
            }
        }
      
        function validateEmail() {
            if (!emailRegex.test(email.value)) {
                errorEmail.textContent = "유효한 이메일 주소를 입력해주세요.";
            } else {
                errorEmail.textContent = "";
            }
        }
      
        function validatePhoneNum() {
            if (!(phoneRegex11.test(phoneNum.value) || phoneRegex10.test(phoneNum.value))) {
                errorPhoneNum.textContent = "휴대폰 번호를 정확히 입력해주세요.";
            } else {
                errorPhoneNum.textContent = "";
            }
        }

        function validateAddress() {
            const addressInput = document.getElementById("address_input").value.trim();
            const addressDetail = document.getElementById("address_detail").value.trim();
            
            if (addressInput === "") {
                errorAddress.textContent = "주소를 입력해주세요.";
                return false;
            } else if (addressDetail === "") {
                errorAddress.textContent = "상세 주소를 입력해주세요.";
                return false;
            } else {
                errorAddress.textContent = "";
                return true;
            }
        }
      
        // 아이디 중복 검사 
        checkButton.addEventListener("click", function (e) {
            e.preventDefault(); 
            validateId();
      
            if (signId.value.trim() !== "" && idRegex.test(signId.value)) {
                const isIdAvailable = true;
                if (isIdAvailable) {
                    alert("사용 가능한 아이디입니다.");
                    isIdChecked = true;
                } else {
                    alert("이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.");
                }
            }
        });
      
        // 이메일 중복 확인
        checkEmailButton.addEventListener("click", function (e) {
            e.preventDefault(); 
            validateEmail();
      
            if (email.value.trim() !== "" && emailRegex.test(email.value)) {
                const isEmailAvailable = true; 
                if (isEmailAvailable) {
                    alert("사용 가능한 이메일입니다.");
                    isEmailChecked = true;
                } else {
                    alert("이미 사용 중인 이메일입니다. 다른 이메일을 입력해주세요.");
                }
            }
        });
      

        tokenButton.addEventListener("click", function (e) {
            e.preventDefault(); 
            validatePhoneNum();
      
            if (phoneRegex11.test(phoneNum.value) || phoneRegex10.test(phoneNum.value)) {
                alert("인증번호가 발송되었습니다!");
                tokenButton.disabled = true;
                tokenButton.style.color = "#aaa";
                tokenButton.style.border = "1px solid #eee";
            }
        });
      
        
        phoneNum.addEventListener("input", function () {
            tokenButton.disabled = !(phoneRegex11.test(phoneNum.value) || phoneRegex10.test(phoneNum.value));
        });
      
        
        agreeAllCheckbox.addEventListener("change", function () {
            const isChecked = agreeAllCheckbox.checked;
            requiredCheckboxes.forEach(checkbox => checkbox.checked = isChecked);
            optionalCheckboxes.forEach(checkbox => checkbox.checked = isChecked);
        });
      
       
        signupButton.addEventListener("click", function (e) {
            e.preventDefault();
      
           
            validateId();
            validatePassword1();
            validatePassword2();
            validateName();
            validateEmail();
            validatePhoneNum();
            
    
            const formValid = ![errorId, errorPassword1, errorPassword2, errorWriter, errorEmail, errorPhoneNum].some(error => error.textContent !== "");
            
            const allRequiredChecked = Array.from(requiredCheckboxes).every(checkbox => checkbox.checked);
      
            if (!isIdChecked) {
                alert("아이디 중복 확인을 해주세요.");
            } else if (!isEmailChecked) {
                alert("이메일 중복 확인을 해주세요.");
            } else if (!formValid) {
                alert("모든 입력 항목을 올바르게 작성해주세요.");
            } else if (!allRequiredChecked) {
                alert("필수 이용약관에 동의해주세요.");
            } else {
                alert("회원가입이 완료되었습니다!");
                window.location.href = "joinFinish.html";
            }
        });
      
        
        signId.addEventListener("input", validateId);
        password1.addEventListener("input", validatePassword1);
        password2.addEventListener("input", validatePassword2);
        name.addEventListener("input", validateName);
        email.addEventListener("input", validateEmail);
        phoneNum.addEventListener("input", validatePhoneNum);
        requiredCheckboxes.forEach(checkbox => checkbox.addEventListener("change", validateForm));
        document.getElementById("address_input").addEventListener("input", validateAddress);
        document.getElementById("address_detail").addEventListener("input", validateAddress);
    });
      
     
      const modal = document.getElementById("infoModal");
      
      
      const spans = document.querySelectorAll(".useCheck_section span");
      
      
      const closeBtn = document.getElementsByClassName("close")[0];
      
      
      const confirmButton = document.getElementById("confirmButton");
      
     
      spans.forEach(span => {
          span.onclick = function() {
              modal.style.display = "block";
          };
      });
      
      closeBtn.onclick = function() {
        modal.style.display = "none";
      }
      
    
      confirmButton.onclick = function() {
        modal.style.display = "none";
      }
      
     
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }
      
      document.getElementById('address_button').addEventListener('click', function() {
          new daum.Postcode({
            oncomplete: function(data) {
              let addr = ''; 
              if (data.userSelectedType === 'R') { 
                addr = data.roadAddress;
              } else { 
                addr = data.jibunAddress;
              }
      
              
              document.getElementById("address_input").value = addr;
      
       
              document.getElementById("address_detail").focus();
            }
          }).open();
      });