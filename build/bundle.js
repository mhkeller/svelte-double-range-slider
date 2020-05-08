var app=function(){"use strict";function t(){}function n(t){return t()}function e(){return Object.create(null)}function o(t){t.forEach(n)}function r(t){return"function"==typeof t}function i(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function c(n){return n&&r(n.destroy)?n.destroy:t}function l(t,n){t.appendChild(n)}function u(t,n,e){t.insertBefore(n,e||null)}function s(t){t.parentNode.removeChild(t)}function a(t){return document.createElement(t)}function d(t){return document.createTextNode(t)}function f(){return d(" ")}function h(t,n,e,o){return t.addEventListener(n,e,o),()=>t.removeEventListener(n,e,o)}function m(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function p(t,n){n=""+n,t.data!==n&&(t.data=n)}function v(t,n,e,o){t.style.setProperty(n,e,o?"important":"")}let g;function $(t){g=t}const y=[],x=[],w=[],b=[],E=Promise.resolve();let _=!1;function k(t){w.push(t)}function C(t){b.push(t)}let L=!1;const q=new Set;function B(){if(!L){L=!0;do{for(let t=0;t<y.length;t+=1){const n=y[t];$(n),M(n.$$)}for(y.length=0;x.length;)x.pop()();for(let t=0;t<w.length;t+=1){const n=w[t];q.has(n)||(q.add(n),n())}w.length=0}while(y.length);for(;b.length;)b.pop()();_=!1,L=!1,q.clear()}}function M(t){if(null!==t.fragment){t.update(),o(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(k)}}const A=new Set;function R(t,n){t&&t.i&&(A.delete(t),t.i(n))}function X(t,n,e){const o=t.$$.props[n];void 0!==o&&(t.$$.bound[o]=e,e(t.$$.ctx[o]))}function Y(t,e,i){const{fragment:c,on_mount:l,on_destroy:u,after_update:s}=t.$$;c&&c.m(e,i),k(()=>{const e=l.map(n).filter(r);u?u.push(...e):o(e),t.$$.on_mount=[]}),s.forEach(k)}function N(t,n){const e=t.$$;null!==e.fragment&&(o(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function j(t,n){-1===t.$$.dirty[0]&&(y.push(t),_||(_=!0,E.then(B)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function O(n,r,i,c,l,u,a=[-1]){const d=g;$(n);const f=r.props||{},h=n.$$={fragment:null,ctx:null,props:u,update:t,not_equal:l,bound:e(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(d?d.$$.context:[]),callbacks:e(),dirty:a};let m=!1;if(h.ctx=i?i(n,f,(t,e,...o)=>{const r=o.length?o[0]:e;return h.ctx&&l(h.ctx[t],h.ctx[t]=r)&&(h.bound[t]&&h.bound[t](r),m&&j(n,t)),e}):[],h.update(),m=!0,o(h.before_update),h.fragment=!!c&&c(h.ctx),r.target){if(r.hydrate){const t=function(t){return Array.from(t.childNodes)}(r.target);h.fragment&&h.fragment.l(t),t.forEach(s)}else h.fragment&&h.fragment.c();r.intro&&R(n.$$.fragment),Y(n,r.target,r.anchor),B()}$(d)}class P{$destroy(){N(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(){}}function S(t,n,e){return t<n?n:t>e?e:t}function F(n){let e,r,i,d,p,g,$,y,x,w,b;return{c(){e=a("div"),r=a("div"),i=a("div"),p=f(),g=a("div"),y=f(),x=a("div"),m(i,"class","body svelte-edieq4"),v(i,"left",100*n[0]+"%"),v(i,"right",100*(1-n[1])+"%"),m(g,"class","handle svelte-edieq4"),m(g,"data-which","start"),v(g,"left",100*n[0]+"%\n\t\t\t"),m(x,"class","handle svelte-edieq4"),m(x,"data-which","end"),v(x,"left",100*n[1]+"%\n\t\t\t"),m(r,"class","slider svelte-edieq4"),m(e,"class","double-range-container svelte-edieq4")},m(t,s,a){u(t,e,s),l(e,r),l(r,i),n[7](i),l(r,p),l(r,g),n[8](g),l(r,y),l(r,x),n[9](r),a&&o(b),b=[c(d=H.call(null,i)),h(i,"dragmove",n[6]),c($=H.call(null,g)),h(g,"dragmove",n[5]("start")),c(w=H.call(null,x)),h(x,"dragmove",n[5]("end"))]},p(t,[n]){1&n&&v(i,"left",100*t[0]+"%"),2&n&&v(i,"right",100*(1-t[1])+"%"),1&n&&v(g,"left",100*t[0]+"%\n\t\t\t"),2&n&&v(x,"left",100*t[1]+"%\n\t\t\t")},i:t,o:t,d(t){t&&s(e),n[7](null),n[8](null),n[9](null),o(b)}}}function H(t){let n,e;function o(o){n=o.clientX,e=o.clientY,t.dispatchEvent(new CustomEvent("dragstart",{detail:{x:n,y:e}})),window.addEventListener("mousemove",r),window.addEventListener("mouseup",i)}function r(o){const r=o.clientX-n,i=o.clientY-e;n=o.clientX,e=o.clientY,t.dispatchEvent(new CustomEvent("dragmove",{detail:{x:n,y:e,dx:r,dy:i}}))}function i(o){n=o.clientX,e=o.clientY,t.dispatchEvent(new CustomEvent("dragend",{detail:{x:n,y:e}})),window.removeEventListener("mousemove",r),window.removeEventListener("mouseup",i)}return t.addEventListener("mousedown",o),{destroy(){t.removeEventListener("mousedown",o)}}}function T(t,n,e){let o,r,i,{start:c=0}=n,{end:l=1}=n;return t.$set=t=>{"start"in t&&e(0,c=t.start),"end"in t&&e(1,l=t.end)},[c,l,o,r,i,function(t){return function(n){const{left:o,right:r}=i.getBoundingClientRect(),u=r-o,s=Math.min(Math.max((n.detail.x-o)/u,0),1);"start"===t?(e(0,c=s),e(1,l=Math.max(l,s))):(e(0,c=Math.min(s,c)),e(1,l=s))}},function(t){const{width:n}=r.getBoundingClientRect(),{left:u,right:s}=i.getBoundingClientRect(),a=s-u,d=S(o.getBoundingClientRect().left+event.detail.dx-u,0,a-n),f=S(d+n,n,a)/a;e(0,c=d/a),e(1,l=f)},function(t){x[t?"unshift":"push"](()=>{e(3,r=t)})},function(t){x[t?"unshift":"push"](()=>{e(2,o=t)})},function(t){x[t?"unshift":"push"](()=>{e(4,i=t)})}]}class W extends P{constructor(t){super(),O(this,t,T,F,i,{start:0,end:1})}}function z(t){let n,e,o,r,i,c,h,v,g,$,y,w,b,E=t[2](t[0])+"",_=t[2](t[1])+"";function k(n){t[3].call(null,n)}function L(n){t[4].call(null,n)}let q={};void 0!==t[0]&&(q.start=t[0]),void 0!==t[1]&&(q.end=t[1]);const B=new W({props:q});return x.push(()=>X(B,"start",k)),x.push(()=>X(B,"end",L)),{c(){var t;n=a("main"),e=a("h1"),e.textContent="Hello World!",o=f(),(t=B.$$.fragment)&&t.c(),c=f(),h=a("div"),v=a("div"),g=d(E),$=f(),y=a("div"),w=d(_),m(e,"class","svelte-1hk1k56"),m(v,"class","label svelte-1hk1k56"),m(y,"class","label svelte-1hk1k56"),m(h,"class","labels"),m(n,"class","svelte-1hk1k56")},m(t,r){u(t,n,r),l(n,e),l(n,o),Y(B,n,null),l(n,c),l(n,h),l(h,v),l(v,g),l(h,$),l(h,y),l(y,w),b=!0},p(t,[n]){const e={};!r&&1&n&&(r=!0,e.start=t[0],C(()=>r=!1)),!i&&2&n&&(i=!0,e.end=t[1],C(()=>i=!1)),B.$set(e),(!b||1&n)&&E!==(E=t[2](t[0])+"")&&p(g,E),(!b||2&n)&&_!==(_=t[2](t[1])+"")&&p(w,_)},i(t){b||(R(B.$$.fragment,t),b=!0)},o(t){!function(t,n,e,o){if(t&&t.o){if(A.has(t))return;A.add(t),(void 0).c.push(()=>{A.delete(t),o&&(e&&t.d(1),o())}),t.o(n)}}(B.$$.fragment,t),b=!1},d(t){t&&s(n),N(B)}}}function D(t,n,e){let o,r;return[o,r,t=>t||0===t?t.toFixed(2):"",function(t){o=t,e(0,o)},function(t){r=t,e(1,r)}]}return new class extends P{constructor(t){super(),O(this,t,D,z,i,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
