(window.webpackJsonp=window.webpackJsonp||[]).push([[30],{444:function(e,t,n){__NEXT_REGISTER_PAGE("/settings",function(){return e.exports=n(445),{page:e.exports.default}})},445:function(e,t,n){"use strict";n.r(t);var o=n(0),r=n.n(o),u=n(5),a=n(13);n(446);function l(e){return(l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function c(e){return(c=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function f(e,t){return(f=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function p(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var d=function(e){function t(){var e,n,o,a;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var i=arguments.length,f=new Array(i),d=0;d<i;d++)f[d]=arguments[d];return o=this,a=(e=c(t)).call.apply(e,[this].concat(f)),n=!a||"object"!==l(a)&&"function"!=typeof a?p(o):a,s(p(p(n)),"completeEdit",r.a.createRef()),s(p(p(n)),"state",{user:{displayName:null,email:"",emailVerified:!1,phoneNumber:null,photoURL:null,providerId:null,uid:null},updateUserInfo:{displayName:null,phoneNumber:null,photoURL:null}}),s(p(p(n)),"getUserInfo",function(){u.a.auth().onAuthStateChanged(function(e){if(e){console.log(e);var t=e.providerData[0],o=t.displayName,r=t.email,u=t.phoneNumber,a=t.photoURL,l=t.providerId;n.setState({user:{displayName:o,email:r,emailVerified:e.emailVerified,phoneNumber:u,photoURL:a,providerId:l,uid:e.uid}})}else console.log("user가 없습니다.")})}),s(p(p(n)),"deleteUser",function(){u.a.auth().currentUser().delete().then(function(e){return console.log("계정 삭제 완료",e)}).catch(function(e){return console.log("계정 삭제 실패",e)})}),s(p(p(n)),"handleSubmit",function(e){e.preventDefault();var t=n.state.updateUserInfo,o=n.state.user,r=(o.displayName,o.email),a=o.emailVerified,l=o.phoneNumber,i=o.photoURL,c=o.providerId,f=o.uid,p={displayName:e.target[0].value,email:r,emailVerified:a,phoneNumber:l,photoURL:i,providerId:c,uid:f};u.a.auth().currentUser.updateProfile(t).then(function(e){n.setState({user:p,updateUserInfo:{displayName:null,phoneNumber:null,photoURL:null}}),console.log("프로필 업데이트 성공",e)}).catch(function(e){return console.log("프로필 업데이트 실패",e)}),n.completeEdit.current.reset()}),s(p(p(n)),"handleChange",function(e){var t=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},o=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),o.forEach(function(t){s(e,t,n[t])})}return e}({},n.state.updateUserInfo);t[e.target.name]=e.target.value,n.setState({updateUserInfo:t})}),n}var n,d,m;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&f(e,t)}(t,o["Component"]),n=t,(d=[{key:"componentDidMount",value:function(){this.getUserInfo()}},{key:"shouldComponentUpdate",value:function(e,t){return console.log(t),!0}},{key:"signOut",value:function(){u.a.auth().signOut(),Router.push("/")}},{key:"render",value:function(){return r.a.createElement(a.a,null,r.a.createElement("div",{className:""},r.a.createElement("header",null,r.a.createElement("h1",null,"계정 관리")),r.a.createElement("main",null,r.a.createElement("button",{onClick:this.deleteUser},"계정 지우기"))))}}])&&i(n.prototype,d),m&&i(n,m),t}();t.default=d}},[[444,0,1,2]]]);