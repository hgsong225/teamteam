(window.webpackJsonp=window.webpackJsonp||[]).push([[32],{452:function(e,t,a){__NEXT_REGISTER_PAGE("/sign-up",function(){return e.exports=a(453),{page:e.exports.default}})},453:function(e,t,a){"use strict";a.r(t);var n=a(3),s=a.n(n),i=a(0),r=a.n(i),o=a(7),c=a.n(o),l=a(4),m=a.n(l),u=a(5),p=a(13);a(454);function h(e){return(h="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function f(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function d(e){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function v(e,t){return(v=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function N(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function g(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var b=function(e){function t(){var e,a,n,s;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var i=arguments.length,r=new Array(i),o=0;o<i;o++)r[o]=arguments[o];return n=this,s=(e=d(t)).call.apply(e,[this].concat(r)),a=!s||"object"!==h(s)&&"function"!=typeof s?N(n):s,g(N(N(a)),"state",{name:"",email:"",password:"",password2:"",checkPassword:!1,phone:"",account:"",phoneValidating:!1,userCertificationNumber:"",certificationNumber:"",isSameCertificationNumber:!1,effectiveTime:180,errors:{}}),g(N(N(a)),"timer",function(){a.state.effectiveTime>0?a.setState({effectiveTime:a.state.effectiveTime-1}):(clearInterval(a.intervalId),a.setState({effectiveTime:300,phoneValidating:!1,certificationNumber:""}))}),g(N(N(a)),"handleChange",function(e){a.setState(g({},e.target.name,e.target.value))}),g(N(N(a)),"validatePhoneNumber",function(){if(a.state.phone.length>0){a.intervalId=setInterval(a.timer,1e3),a.setState({phoneValidating:"processing",effectiveTime:180});var e=a.state.phone,t={phoneNumber:e};console.log(e),m.a.post("http://localhost:3333/api/auth/smsVerification",{data:t}).then(function(e){console.log(e.data),a.setState({certificationNumber:e.data.certificationNumber})}).catch(function(e){console.log(e),a.setState({phoneValidating:!1,errors:{phone:""}})})}else a.setState({errors:{phone:"전화번호를 입력하고 인증을 완료하세요."}})}),g(N(N(a)),"compareCertificationNumber",function(){var e=a.state,t=e.userCertificationNumber,n=e.certificationNumber;return t==n?(clearInterval(a.intervalId),a.setState({isSameCertificationNumber:!0,phoneValidating:!0,errors:{phone:""}})):t!==n?a.setState({isSameCertificationNumber:"difference"}):void 0}),g(N(N(a)),"handleValidation",function(){var e={},t=!0,n=a.state,s=n.name,i=n.email,r=n.password,o=n.password2,c=(n.checkPassword,n.phone),l=n.account,m=n.phoneValidating;n.userCertificationNumber,n.certificationNumber,n.isSameCertificationNumber,n.effectiveTime;return!s.length>0&&(t=!1,e.name="이름을 기입하세요."),!i.length>0&&(t=!1,e.email="이메일을 입력하세요."),(r.length<5||o.length<5||!r.length>0&&!o.length>0)&&(t=!1,e.password="비밀번호를 입력하세요. 6자 이상"),r!==o&&(t=!1,e.password="비밀번호가 다릅니다."),(!c.length>0||!c.length>0&&!0!==m||!0!==m)&&(t=!1,e.phone="전화번호를 입력하고 인증을 완료하세요."),!l.length>0&&(t=!1,e.account="계좌번호를 입력하세요."),a.setState({errors:e}),t}),g(N(N(a)),"signUp",function(e){e.preventDefault(),a.handleValidation()&&u.a.auth().createUserWithEmailAndPassword(a.state.email,a.state.password).then(function(e){console.log("회원가입에 성공했습니다.",e);var t=e.user.providerData[0].email,n=t.split("@")[0];u.a.auth().currentUser.updateProfile({displayName:n}).then(function(s){var i={fb_uid:e.user.uid,name:a.state.name,email:t,phone:a.state.phone,display_name:n};m.a.post("http://localhost:3333/api/auth/user",{data:i}).then(function(e){c.a.push("/")}).catch(function(e){console.log(e),a.setState({phoneValidating:!1})})})}).catch(function(e){if(console.log(e),"auth/email-already-in-use"===e.code){var t={email:"이미 있는 이메일입니다."};a.setState({errors:t})}})}),a}var a,n,o;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&v(e,t)}(t,i["Component"]),a=t,(n=[{key:"componentWillUnmount",value:function(){clearInterval(this.intervalId)}},{key:"componentWillUnmount",value:function(){0==this.state.effectiveTime&&clearInterval(this.myInterval)}},{key:"render",value:function(){return r.a.createElement(p.a,null,r.a.createElement(s.a,{styleId:"2077261517",css:[]}),r.a.createElement("div",{className:"jsx-2077261517 sign-container"},r.a.createElement("div",{className:"jsx-2077261517 page-title-box"},r.a.createElement("p",{className:"jsx-2077261517 page-title"},"teamteam에 오신 것을 환영합니다!"),r.a.createElement("p",{className:"jsx-2077261517 page-desc"},r.a.createElement("strong",{className:"jsx-2077261517"},"축구를 하고 싶은 사람들"),"이 기다리고 있습니다.",r.a.createElement("br",{className:"jsx-2077261517"}),"지금 당장 ",r.a.createElement("strong",{className:"jsx-2077261517"},"경기를 만들거나 참여"),"하세요!")),r.a.createElement("form",{onSubmit:this.signUp,className:"jsx-2077261517"},r.a.createElement("div",{className:"jsx-2077261517 section"},r.a.createElement("div",{className:"jsx-2077261517 section-contents"},r.a.createElement("p",{className:"jsx-2077261517 contents-title"},"이름",this.state.errors.name&&r.a.createElement("span",{className:"jsx-2077261517 error-msg"}," - ",this.state.errors.name)),r.a.createElement("input",{value:this.state.name,onChange:this.handleChange,name:"name",type:"text",className:"jsx-2077261517"}))),r.a.createElement("div",{className:"jsx-2077261517 section"},r.a.createElement("div",{className:"jsx-2077261517 section-contents"},r.a.createElement("p",{className:"jsx-2077261517 contents-title"},"이메일",this.state.errors.email&&r.a.createElement("span",{className:"jsx-2077261517 error-msg"}," - ",this.state.errors.email)),r.a.createElement("input",{value:this.state.email,onChange:this.handleChange,name:"email",type:"email",className:"jsx-2077261517"}))),r.a.createElement("div",{className:"jsx-2077261517 section"},r.a.createElement("div",{className:"jsx-2077261517 section-contents"},r.a.createElement("p",{className:"jsx-2077261517 contents-title"},"비밀번호",this.state.errors.password&&r.a.createElement("span",{className:"jsx-2077261517 error-msg"}," - ",this.state.errors.password)),r.a.createElement("input",{value:this.state.password,onChange:this.handleChange,name:"password",type:"password",className:"jsx-2077261517"}),r.a.createElement("p",{className:"jsx-2077261517 contents-desc"},"한 번 더 입력해주세요."),r.a.createElement("input",{value:this.state.password2,onChange:this.handleChange,name:"password2",type:"password",className:"jsx-2077261517"}))),r.a.createElement("div",{className:"jsx-2077261517 section"},r.a.createElement("div",{className:"jsx-2077261517 section-contents"},r.a.createElement("p",{className:"jsx-2077261517 contents-title"},"휴대폰 번호",this.state.errors.phone&&r.a.createElement("span",{className:"jsx-2077261517 error-msg"}," - ",this.state.errors.phone)),r.a.createElement("input",{placeholder:"'-'를 제외하고 입력해주세요.",value:this.state.phone,onChange:this.handleChange,name:"phone",type:"number",disabled:!0===this.state.phoneValidating,className:"jsx-2077261517 phone-input"}),(0==this.state.phoneValidating||0==this.state.effectiveTime)&&r.a.createElement("button",{onClick:this.validatePhoneNumber,className:"jsx-2077261517 validate-phone"},"인증 요청"),"processing"==this.state.phoneValidating&&r.a.createElement("div",{className:"jsx-2077261517"},r.a.createElement("p",{onClick:this.validatePhoneNumber,className:"jsx-2077261517 validating-phone"},"재발송 - ","".concat(parseInt(this.state.effectiveTime%3600/60),"분 ").concat(this.state.effectiveTime%60,"초")),r.a.createElement("input",{placeholder:"인증번호 6자리 입력",value:this.state.userCertificationNumber,onChange:this.handleChange,name:"userCertificationNumber",className:"jsx-2077261517"}),"difference"==this.state.isSameCertificationNumber&&r.a.createElement("div",{className:"jsx-2077261517"},r.a.createElement("p",{className:"jsx-2077261517 different-certification-number"},"인증번호가 다릅니다."),r.a.createElement("button",{onClick:this.compareCertificationNumber,className:"jsx-2077261517 validate-phone"},"확인")),0==this.state.isSameCertificationNumber&&r.a.createElement("button",{onClick:this.compareCertificationNumber,className:"jsx-2077261517 validate-phone"},"확인")),1==this.state.phoneValidating&&r.a.createElement("p",{className:"jsx-2077261517 validated-phone"},"인증 완료"))),r.a.createElement("div",{className:"jsx-2077261517 section"},r.a.createElement("div",{className:"jsx-2077261517 section-contents"},r.a.createElement("p",{className:"jsx-2077261517 contents-title"},"계좌번호",this.state.errors.account&&r.a.createElement("span",{className:"jsx-2077261517 error-msg"}," - ",this.state.errors.account)),r.a.createElement("input",{onChange:this.handleChange,value:this.state.account,type:"text",name:"account",className:"jsx-2077261517"}),r.a.createElement("p",{className:"jsx-2077261517 definition-word-desc"},"ex) 신한 000-000-00000"),r.a.createElement("p",{className:"jsx-2077261517 definition-word-desc"},"* 호스트 환급, 게스트 환불 목적 이외에 사용되지 않으며 제 3자에게 공개되지 않습니다."))),r.a.createElement("div",{className:"jsx-2077261517 button-box"},r.a.createElement("input",{type:"submit",value:"완료",className:"jsx-2077261517"})))))}}])&&f(a.prototype,n),o&&f(a,o),t}();t.default=b}},[[452,0,1,2]]]);