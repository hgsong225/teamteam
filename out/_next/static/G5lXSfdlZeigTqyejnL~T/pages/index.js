(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{149:function(e,t,n){"use strict";var r=n(3),o=n.n(r),a=n(0),i=n.n(a),s=n(146),c=n(152),l=n(151),u=function(e){var t=e.children;return i.a.createElement("div",{className:"jsx-991501986 main-container"},i.a.createElement(o.a,{styleId:"991501986",css:[".main-container.jsx-991501986{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;width:100%;min-height:100%;}"]}),i.a.createElement(l.a,null),t)};function f(e){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function p(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function m(e){return(m=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function b(e,t){return(b=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function y(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function d(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var x=function(e){function t(){var e,n,r,o;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var a=arguments.length,i=new Array(a),s=0;s<a;s++)i[s]=arguments[s];return r=this,n=!(o=(e=m(t)).call.apply(e,[this].concat(i)))||"object"!==f(o)&&"function"!=typeof o?y(r):o,d(y(y(n)),"state",{}),d(y(y(n)),"toggleMenu",function(){var e="sidebar-left-container",t=document.getElementById(e),n=document.getElementById("mask");console.log(t.className),console.log(n.className),t.className==="".concat(t.className.split(" ")[0]," ").concat(e," toggle")?(t.className="".concat(t.className.split(" ")[0]," ").concat(e),n.className="".concat(t.className.split(" ")[0]," ").concat("mask")):(t.className+=" toggle",n.className+=" toggle")}),n}var n,r,l;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&b(e,t)}(t,a["Component"]),n=t,(r=[{key:"render",value:function(){console.log("Layout에서 render() 실행");var e=this.props.selectedLocation;return i.a.createElement("div",{className:"jsx-1031362383"},i.a.createElement(o.a,{styleId:"1031362383",css:[".container.jsx-1031362383{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;min-height:100vh;padding-bottom:80px;}",".content.jsx-1031362383{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;margin-left:304px;margin-right:80px;margin-top:65px;width:auto;-webkit-transition:margin .5s ease-out;transition:margin .5s ease-out;}",".content.jsx-1031362383 aside.jsx-1031362383{border-left:1px solid gray;}","nav.jsx-1031362383{margin-top:65px;height:100vh;position:fixed;overflow-y:hidden;background-color:#fff;}","nav.jsx-1031362383:hover{overflow-y:scroll;}","nav.jsx-1031362383::-webkit-scrollbar-track{border-radius:10px;background-color:#f1f1f1;}","nav.jsx-1031362383::-webkit-scrollbar{width:8px;border-radius:10px;}","nav.jsx-1031362383::-webkit-scrollbar-thumb{border-radius:10px;}","nav.jsx-1031362383:hover.jsx-1031362383::-webkit-scrollbar-thumb{background-color:#e0e0e0;}","main.jsx-1031362383{-webkit-flex:7;-ms-flex:7;flex:7;padding:10px;}","@media screen and (max-width:375px){.sidebar-left-container.jsx-1031362383{margin-top:0;z-index:999;-webkit-transform:translateX(-304px);-ms-transform:translateX(-304px);transform:translateX(-304px);box-shadow:0 0 16px rgba(0,0,0,.28);-webkit-transition:-webkit-transform .5s ease-out;-webkit-transition:transform .5s ease-out;transition:transform .5s ease-out;}}","@media screen and (max-width:992px){.sidebar-left-container.jsx-1031362383{z-index:999;margin-top:0;-webkit-transform:translateX(-304px);-ms-transform:translateX(-304px);transform:translateX(-304px);box-shadow:0 0 16px rgba(0,0,0,.28);-webkit-transition:-webkit-transform .5s ease-out;-webkit-transition:transform .5s ease-out;transition:transform .5s ease-out;}.sidebar-left-container.toggle.jsx-1031362383{-webkit-transform:translateX(0px);-ms-transform:translateX(0px);transform:translateX(0px);}.content.jsx-1031362383{margin-left:0;margin-right:0;}main.jsx-1031362383{padding:0 8px;}}"]}),i.a.createElement("div",{className:"jsx-1031362383 container"},i.a.createElement("div",{className:"jsx-1031362383 header"},i.a.createElement(s.a,null)),i.a.createElement("section",{className:"jsx-1031362383"},i.a.createElement("nav",{id:"sidebar-left-container",className:"jsx-1031362383 sidebar-left-container"},i.a.createElement(c.a,{user:this.props.user,selectLocation:this.props.selectLocation,selectedLocation:e})),i.a.createElement("div",{className:"jsx-1031362383 content"},i.a.createElement("main",{className:"jsx-1031362383 view-container"},i.a.createElement(u,{children:this.props.children})),i.a.createElement("aisde",{className:"jsx-1031362383"}),i.a.createElement("div",{id:"mask",onClick:this.toggleMenu,className:"jsx-1031362383 mask"})))))}}])&&p(n.prototype,r),l&&p(n,l),t}();d(x,"defaultProps",{user:{},selectedLocation:{}});t.a=x},386:function(e,t,n){__NEXT_REGISTER_PAGE("/",function(){return e.exports=n(468),{page:e.exports.default}})},468:function(e,t,n){"use strict";n.r(t);var r=n(0),o=n.n(r),a=n(5),i=n(149);function s(e){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function l(e,t){return!t||"object"!==s(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function u(e){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function f(e,t){return(f=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var p=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),l(this,u(t).apply(this,arguments))}var n,a,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&f(e,t)}(t,r["Component"]),n=t,(a=[{key:"render",value:function(){return o.a.createElement("div",null,"teamteam에 오신 걸 환영합니다.")}}])&&c(n.prototype,a),i&&c(n,i),t}();function m(e){return(m="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function b(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function y(e){return(y=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function d(e,t){return(d=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function x(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var h=function(e){function t(){var e,n,r,o,a,i,s;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var c=arguments.length,l=new Array(c),u=0;u<c;u++)l[u]=arguments[u];return r=this,n=!(o=(e=y(t)).call.apply(e,[this].concat(l)))||"object"!==m(o)&&"function"!=typeof o?x(r):o,a=x(x(n)),s={user:{}},(i="state")in a?Object.defineProperty(a,i,{value:s,enumerable:!0,configurable:!0,writable:!0}):a[i]=s,n}var n,s,c;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&d(e,t)}(t,r["Component"]),n=t,(s=[{key:"componentDidMount",value:function(){this.authListener()}},{key:"authListener",value:function(){var e=this;a.a.auth().onAuthStateChanged(function(t){t?e.setState({user:t}):e.setState({user:null})})}},{key:"render",value:function(){return o.a.createElement(i.a,{user:this.state.user},o.a.createElement(p,null))}}])&&b(n.prototype,s),c&&b(n,c),t}();t.default=h}},[[386,0,1,2]]]);