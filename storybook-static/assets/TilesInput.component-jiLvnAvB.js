import{j as S}from"./jsx-runtime-CKrituN3.js";import{r as P}from"./index-CBqU2yxZ.js";import{c as le,g as On}from"./_commonjsHelpers-BosuxZz1.js";import{h as Ze,T as jn}from"./Tabs.component-DLieBhuJ.js";import{h as Qe}from"./index-uT_2NHma.js";import{c as ke}from"./clsx-B-dksMZM.js";var ce={exports:{}};ce.exports;(function(I,m){var c=200,_="__lodash_hash_undefined__",b=1,f=2,o=9007199254740991,d="[object Arguments]",a="[object Array]",R="[object AsyncFunction]",O="[object Boolean]",A="[object Date]",h="[object Error]",i="[object Function]",x="[object GeneratorFunction]",$="[object Map]",Se="[object Number]",tt="[object Null]",V="[object Object]",xe="[object Promise]",nt="[object Proxy]",we="[object RegExp]",k="[object Set]",Ae="[object String]",rt="[object Symbol]",at="[object Undefined]",de="[object WeakMap]",Ce="[object ArrayBuffer]",ee="[object DataView]",it="[object Float32Array]",st="[object Float64Array]",ot="[object Int8Array]",ut="[object Int16Array]",lt="[object Int32Array]",ct="[object Uint8Array]",ft="[object Uint8ClampedArray]",dt="[object Uint16Array]",pt="[object Uint32Array]",gt=/[\\^$.*+?()[\]{}|]/g,ht=/^\[object .+?Constructor\]$/,_t=/^(?:0|[1-9]\d*)$/,u={};u[it]=u[st]=u[ot]=u[ut]=u[lt]=u[ct]=u[ft]=u[dt]=u[pt]=!0,u[d]=u[a]=u[Ce]=u[O]=u[ee]=u[A]=u[h]=u[i]=u[$]=u[Se]=u[V]=u[we]=u[k]=u[Ae]=u[de]=!1;var Ee=typeof le=="object"&&le&&le.Object===Object&&le,yt=typeof self=="object"&&self&&self.Object===Object&&self,G=Ee||yt||Function("return this")(),Ie=m&&!m.nodeType&&m,Oe=Ie&&!0&&I&&!I.nodeType&&I,je=Oe&&Oe.exports===Ie,pe=je&&Ee.process,qe=function(){try{return pe&&pe.binding&&pe.binding("util")}catch{}}(),Pe=qe&&qe.isTypedArray;function mt(e,t){for(var n=-1,r=e==null?0:e.length,l=0,s=[];++n<r;){var g=e[n];t(g,n,e)&&(s[l++]=g)}return s}function vt(e,t){for(var n=-1,r=t.length,l=e.length;++n<r;)e[l+n]=t[n];return e}function bt(e,t){for(var n=-1,r=e==null?0:e.length;++n<r;)if(t(e[n],n,e))return!0;return!1}function Tt(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n);return r}function St(e){return function(t){return e(t)}}function xt(e,t){return e.has(t)}function wt(e,t){return e==null?void 0:e[t]}function At(e){var t=-1,n=Array(e.size);return e.forEach(function(r,l){n[++t]=[l,r]}),n}function Ct(e,t){return function(n){return e(t(n))}}function Et(e){var t=-1,n=Array(e.size);return e.forEach(function(r){n[++t]=r}),n}var It=Array.prototype,Ot=Function.prototype,te=Object.prototype,ge=G["__core-js_shared__"],Ge=Ot.toString,q=te.hasOwnProperty,Ne=function(){var e=/[^.]+$/.exec(ge&&ge.keys&&ge.keys.IE_PROTO||"");return e?"Symbol(src)_1."+e:""}(),Me=te.toString,jt=RegExp("^"+Ge.call(q).replace(gt,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),Le=je?G.Buffer:void 0,ne=G.Symbol,De=G.Uint8Array,ze=te.propertyIsEnumerable,qt=It.splice,B=ne?ne.toStringTag:void 0,Re=Object.getOwnPropertySymbols,Pt=Le?Le.isBuffer:void 0,Gt=Ct(Object.keys,Object),he=J(G,"DataView"),X=J(G,"Map"),_e=J(G,"Promise"),ye=J(G,"Set"),me=J(G,"WeakMap"),Y=J(Object,"create"),Nt=H(he),Mt=H(X),Lt=H(_e),Dt=H(ye),zt=H(me),$e=ne?ne.prototype:void 0,ve=$e?$e.valueOf:void 0;function F(e){var t=-1,n=e==null?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function Rt(){this.__data__=Y?Y(null):{},this.size=0}function $t(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t}function Bt(e){var t=this.__data__;if(Y){var n=t[e];return n===_?void 0:n}return q.call(t,e)?t[e]:void 0}function Ft(e){var t=this.__data__;return Y?t[e]!==void 0:q.call(t,e)}function Ut(e,t){var n=this.__data__;return this.size+=this.has(e)?0:1,n[e]=Y&&t===void 0?_:t,this}F.prototype.clear=Rt,F.prototype.delete=$t,F.prototype.get=Bt,F.prototype.has=Ft,F.prototype.set=Ut;function N(e){var t=-1,n=e==null?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function Ht(){this.__data__=[],this.size=0}function Kt(e){var t=this.__data__,n=ae(t,e);if(n<0)return!1;var r=t.length-1;return n==r?t.pop():qt.call(t,n,1),--this.size,!0}function Vt(e){var t=this.__data__,n=ae(t,e);return n<0?void 0:t[n][1]}function Jt(e){return ae(this.__data__,e)>-1}function Wt(e,t){var n=this.__data__,r=ae(n,e);return r<0?(++this.size,n.push([e,t])):n[r][1]=t,this}N.prototype.clear=Ht,N.prototype.delete=Kt,N.prototype.get=Vt,N.prototype.has=Jt,N.prototype.set=Wt;function U(e){var t=-1,n=e==null?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function Xt(){this.size=0,this.__data__={hash:new F,map:new(X||N),string:new F}}function Yt(e){var t=ie(this,e).delete(e);return this.size-=t?1:0,t}function Zt(e){return ie(this,e).get(e)}function Qt(e){return ie(this,e).has(e)}function kt(e,t){var n=ie(this,e),r=n.size;return n.set(e,t),this.size+=n.size==r?0:1,this}U.prototype.clear=Xt,U.prototype.delete=Yt,U.prototype.get=Zt,U.prototype.has=Qt,U.prototype.set=kt;function re(e){var t=-1,n=e==null?0:e.length;for(this.__data__=new U;++t<n;)this.add(e[t])}function en(e){return this.__data__.set(e,_),this}function tn(e){return this.__data__.has(e)}re.prototype.add=re.prototype.push=en,re.prototype.has=tn;function L(e){var t=this.__data__=new N(e);this.size=t.size}function nn(){this.__data__=new N,this.size=0}function rn(e){var t=this.__data__,n=t.delete(e);return this.size=t.size,n}function an(e){return this.__data__.get(e)}function sn(e){return this.__data__.has(e)}function on(e,t){var n=this.__data__;if(n instanceof N){var r=n.__data__;if(!X||r.length<c-1)return r.push([e,t]),this.size=++n.size,this;n=this.__data__=new U(r)}return n.set(e,t),this.size=n.size,this}L.prototype.clear=nn,L.prototype.delete=rn,L.prototype.get=an,L.prototype.has=sn,L.prototype.set=on;function un(e,t){var n=se(e),r=!n&&xn(e),l=!n&&!r&&be(e),s=!n&&!r&&!l&&Xe(e),g=n||r||l||s,y=g?Tt(e.length,String):[],v=y.length;for(var p in e)q.call(e,p)&&!(g&&(p=="length"||l&&(p=="offset"||p=="parent")||s&&(p=="buffer"||p=="byteLength"||p=="byteOffset")||mn(p,v)))&&y.push(p);return y}function ae(e,t){for(var n=e.length;n--;)if(Ke(e[n][0],t))return n;return-1}function ln(e,t,n){var r=t(e);return se(e)?r:vt(r,n(e))}function Z(e){return e==null?e===void 0?at:tt:B&&B in Object(e)?_n(e):Sn(e)}function Be(e){return Q(e)&&Z(e)==d}function Fe(e,t,n,r,l){return e===t?!0:e==null||t==null||!Q(e)&&!Q(t)?e!==e&&t!==t:cn(e,t,n,r,Fe,l)}function cn(e,t,n,r,l,s){var g=se(e),y=se(t),v=g?a:D(e),p=y?a:D(t);v=v==d?V:v,p=p==d?V:p;var w=v==V,j=p==V,T=v==p;if(T&&be(e)){if(!be(t))return!1;g=!0,w=!1}if(T&&!w)return s||(s=new L),g||Xe(e)?Ue(e,t,n,r,l,s):gn(e,t,v,n,r,l,s);if(!(n&b)){var C=w&&q.call(e,"__wrapped__"),E=j&&q.call(t,"__wrapped__");if(C||E){var z=C?e.value():e,M=E?t.value():t;return s||(s=new L),l(z,M,n,r,s)}}return T?(s||(s=new L),hn(e,t,n,r,l,s)):!1}function fn(e){if(!We(e)||bn(e))return!1;var t=Ve(e)?jt:ht;return t.test(H(e))}function dn(e){return Q(e)&&Je(e.length)&&!!u[Z(e)]}function pn(e){if(!Tn(e))return Gt(e);var t=[];for(var n in Object(e))q.call(e,n)&&n!="constructor"&&t.push(n);return t}function Ue(e,t,n,r,l,s){var g=n&b,y=e.length,v=t.length;if(y!=v&&!(g&&v>y))return!1;var p=s.get(e);if(p&&s.get(t))return p==t;var w=-1,j=!0,T=n&f?new re:void 0;for(s.set(e,t),s.set(t,e);++w<y;){var C=e[w],E=t[w];if(r)var z=g?r(E,C,w,t,e,s):r(C,E,w,e,t,s);if(z!==void 0){if(z)continue;j=!1;break}if(T){if(!bt(t,function(M,K){if(!xt(T,K)&&(C===M||l(C,M,n,r,s)))return T.push(K)})){j=!1;break}}else if(!(C===E||l(C,E,n,r,s))){j=!1;break}}return s.delete(e),s.delete(t),j}function gn(e,t,n,r,l,s,g){switch(n){case ee:if(e.byteLength!=t.byteLength||e.byteOffset!=t.byteOffset)return!1;e=e.buffer,t=t.buffer;case Ce:return!(e.byteLength!=t.byteLength||!s(new De(e),new De(t)));case O:case A:case Se:return Ke(+e,+t);case h:return e.name==t.name&&e.message==t.message;case we:case Ae:return e==t+"";case $:var y=At;case k:var v=r&b;if(y||(y=Et),e.size!=t.size&&!v)return!1;var p=g.get(e);if(p)return p==t;r|=f,g.set(e,t);var w=Ue(y(e),y(t),r,l,s,g);return g.delete(e),w;case rt:if(ve)return ve.call(e)==ve.call(t)}return!1}function hn(e,t,n,r,l,s){var g=n&b,y=He(e),v=y.length,p=He(t),w=p.length;if(v!=w&&!g)return!1;for(var j=v;j--;){var T=y[j];if(!(g?T in t:q.call(t,T)))return!1}var C=s.get(e);if(C&&s.get(t))return C==t;var E=!0;s.set(e,t),s.set(t,e);for(var z=g;++j<v;){T=y[j];var M=e[T],K=t[T];if(r)var Ye=g?r(K,M,T,t,e,s):r(M,K,T,e,t,s);if(!(Ye===void 0?M===K||l(M,K,n,r,s):Ye)){E=!1;break}z||(z=T=="constructor")}if(E&&!z){var oe=e.constructor,ue=t.constructor;oe!=ue&&"constructor"in e&&"constructor"in t&&!(typeof oe=="function"&&oe instanceof oe&&typeof ue=="function"&&ue instanceof ue)&&(E=!1)}return s.delete(e),s.delete(t),E}function He(e){return ln(e,Cn,yn)}function ie(e,t){var n=e.__data__;return vn(t)?n[typeof t=="string"?"string":"hash"]:n.map}function J(e,t){var n=wt(e,t);return fn(n)?n:void 0}function _n(e){var t=q.call(e,B),n=e[B];try{e[B]=void 0;var r=!0}catch{}var l=Me.call(e);return r&&(t?e[B]=n:delete e[B]),l}var yn=Re?function(e){return e==null?[]:(e=Object(e),mt(Re(e),function(t){return ze.call(e,t)}))}:En,D=Z;(he&&D(new he(new ArrayBuffer(1)))!=ee||X&&D(new X)!=$||_e&&D(_e.resolve())!=xe||ye&&D(new ye)!=k||me&&D(new me)!=de)&&(D=function(e){var t=Z(e),n=t==V?e.constructor:void 0,r=n?H(n):"";if(r)switch(r){case Nt:return ee;case Mt:return $;case Lt:return xe;case Dt:return k;case zt:return de}return t});function mn(e,t){return t=t??o,!!t&&(typeof e=="number"||_t.test(e))&&e>-1&&e%1==0&&e<t}function vn(e){var t=typeof e;return t=="string"||t=="number"||t=="symbol"||t=="boolean"?e!=="__proto__":e===null}function bn(e){return!!Ne&&Ne in e}function Tn(e){var t=e&&e.constructor,n=typeof t=="function"&&t.prototype||te;return e===n}function Sn(e){return Me.call(e)}function H(e){if(e!=null){try{return Ge.call(e)}catch{}try{return e+""}catch{}}return""}function Ke(e,t){return e===t||e!==e&&t!==t}var xn=Be(function(){return arguments}())?Be:function(e){return Q(e)&&q.call(e,"callee")&&!ze.call(e,"callee")},se=Array.isArray;function wn(e){return e!=null&&Je(e.length)&&!Ve(e)}var be=Pt||In;function An(e,t){return Fe(e,t)}function Ve(e){if(!We(e))return!1;var t=Z(e);return t==i||t==x||t==R||t==nt}function Je(e){return typeof e=="number"&&e>-1&&e%1==0&&e<=o}function We(e){var t=typeof e;return e!=null&&(t=="object"||t=="function")}function Q(e){return e!=null&&typeof e=="object"}var Xe=Pe?St(Pe):dn;function Cn(e){return wn(e)?un(e):pn(e)}function En(){return[]}function In(){return!1}I.exports=An})(ce,ce.exports);var qn=ce.exports;const W=On(qn),Pn=function(m,c){return[...m.reduce((_,b)=>(_.has(c(b))||_.set(c(b),b),_),new Map).values()]},et=function(m,c){const _=new Map;return c?Pn(m,c).forEach(f=>{const o=c(f);_.set(o,[]),_.get(o).push(...m.filter(d=>W(o,c(d))))}):_.set(void 0,m),_},fe=function I({items:m,value:c,onInput:_,label:b,tileClass:f,stack:o,id:d}){var h;const[a,R]=P.useState({stacks:et(m,o==null?void 0:o.by),selectedStack:o==null?void 0:o.value,activeClass:`cursor-pointer font-bold bg-[--ods-color-blue-100] border-[--ods-color-blue-600] ${f==null?void 0:f.active}`,inactiveClass:`cursor-pointer border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-100] hover:border-[--ods-color-blue-600] ${f==null?void 0:f.inactive}`}),O={selectedStack:i=>{R(x=>({...x,selectedStack:i}))},value:i=>_(i)},A={stack:{checked:P.useCallback(i=>{var x,$;return(($=(x=a.stacks)==null?void 0:x.get(i))==null?void 0:$.length)>1?W(a.selectedStack,i):W(a.stacks.get(i)[0],c)},[a.stacks,a.selectedStack,c]),singleton:P.useCallback(i=>{var x;return((x=a.stacks.get(i))==null?void 0:x.length)===1},[a.stacks])}};return P.useEffect(()=>{R(i=>({...i,stacks:et(m,o==null?void 0:o.by)}))},[m,o]),P.useEffect(()=>{f&&R(i=>({...i,activeClass:`cursor-pointer font-bold bg-[--ods-color-blue-100] border-[--ods-color-blue-600] ${f==null?void 0:f.active}`,inactiveClass:`cursor-pointer border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-100] hover:border-[--ods-color-blue-600] ${f==null?void 0:f.inactive}`}))},[f]),P.useEffect(()=>{typeof(o==null?void 0:o.onChange)=="function"&&o.onChange(a.selectedStack)},[a.selectedStack]),P.useEffect(()=>{o&&O.selectedStack(c?o.by(c):void 0)},[c]),P.useEffect(()=>{var i;o&&((i=a.stacks.get(a.selectedStack))!=null&&i.length)&&!W(a.selectedStack,o.by(c))&&O.value(a.stacks.get(a.selectedStack)[0])},[a.selectedStack]),S.jsxs("div",{id:typeof d=="function"?d():d,children:[S.jsx("ul",{className:"simple-tiles-input-ul grid gap-6 list-none p-6 m-0 grid-cols-1 md:grid-cols-3",children:o?[...a.stacks.keys()].map(i=>S.jsx("li",{className:"w-full px-1",children:S.jsx(Qe,{onClick:()=>A.stack.singleton(i)?O.value(a.stacks.get(i)[0]):O.selectedStack(i),className:`${ke(A.stack.checked(i)?a.activeClass:a.inactiveClass)} w-full px-[24px] py-[16px]`,children:A.stack.singleton(i)?b(a.stacks.get(i)[0]):o==null?void 0:o.label(i,a.stacks.get(i))})},Ze(i))):m.map(i=>S.jsx("li",{className:"w-full px-1",children:S.jsx(Qe,{onClick:()=>O.value(i),className:`${ke(W(c,i)?a.activeClass:a.inactiveClass)} w-full px-[24px] py-[16px]`,children:b(i)})},Ze(i)))}),a.selectedStack&&((h=a.stacks.get(a.selectedStack))==null?void 0:h.length)>1&&S.jsxs(S.Fragment,{children:[S.jsx("div",{className:"mt-6 ml-8",children:S.jsx("span",{className:"text-[--ods-color-heading] leading-[22px] font-bold",children:o.title(a.selectedStack,a.stacks.get(a.selectedStack))})}),S.jsx(I,{value:c,items:a.stacks.get(a.selectedStack),label:b,onInput:_,tileClass:f})]})]})};try{fe.displayName="SimpleTilesInputComponent",fe.__docgenInfo={description:"",displayName:"SimpleTilesInputComponent",props:{id:{defaultValue:null,description:"",name:"id",required:!1,type:{name:"string | (() => string)"}},items:{defaultValue:null,description:"",name:"items",required:!0,type:{name:"T[]"}},value:{defaultValue:null,description:"",name:"value",required:!0,type:{name:"T"}},onInput:{defaultValue:null,description:"",name:"onInput",required:!0,type:{name:"(value: T) => void"}},label:{defaultValue:null,description:"",name:"label",required:!0,type:{name:"(item: T) => string | Element"}},tileClass:{defaultValue:null,description:"",name:"tileClass",required:!1,type:{name:"{ active?: string; inactive?: string; }"}},stack:{defaultValue:null,description:"",name:"stack",required:!1,type:{name:"{ by: (item: T) => S; label: (stack: S, items: T[]) => string | Element; title: (stack: S, items: T[]) => string | Element; value?: S; onChange?: (stack: S) => void; }"}}}}}catch{}const Te=function({id:m,items:c,value:_,onInput:b,label:f,tileClass:o,stack:d,group:a}){const[R,O]=P.useState({selectedGroup:a==null?void 0:a.value,selectedStack:d==null?void 0:d.value}),A=P.useMemo(()=>{const h=new Map;return a&&typeof a.by=="function"&&(a.showAllTab&&h.set(void 0,[...c]),c.forEach(i=>{const x=a.by(i);h.has(x)||h.set(x,[]),h.get(x).push(i)})),h},[c,a]);return S.jsx(S.Fragment,{children:a?S.jsx(jn,{items:[...A==null?void 0:A.keys()],titleElement:h=>a.label(h,A.get(h)),contentElement:h=>S.jsx(fe,{id:m,items:A.get(h)||[],value:_,onInput:b,label:f,tileClass:o,stack:d?{...d,onChange:i=>{O(x=>({...x,selectedStack:i})),d!=null&&d.onChange&&(d==null||d.onChange(i))}}:void 0}),onChange:h=>{O(i=>({...i,selectedGroup:h})),a.onChange&&!W(R.selectedGroup,h)&&a.onChange(h)}}):S.jsx(fe,{id:m,items:c,value:_,onInput:b,label:f,tileClass:o,stack:d})})},Rn=Te;try{Te.displayName="TilesInputComponent",Te.__docgenInfo={description:"",displayName:"TilesInputComponent",props:{id:{defaultValue:null,description:"",name:"id",required:!1,type:{name:"string | (() => string)"}},items:{defaultValue:null,description:"",name:"items",required:!0,type:{name:"T[]"}},value:{defaultValue:null,description:"",name:"value",required:!0,type:{name:"T"}},onInput:{defaultValue:null,description:"",name:"onInput",required:!0,type:{name:"(value: T) => void"}},label:{defaultValue:null,description:"",name:"label",required:!0,type:{name:"(item: T) => string | Element"}},tileClass:{defaultValue:null,description:"",name:"tileClass",required:!1,type:{name:"{ active?: string; inactive?: string; }"}},stack:{defaultValue:null,description:"",name:"stack",required:!1,type:{name:"{ by: (item: T) => S; label: (stack: S, items: T[]) => string | Element; title: (stack: S, items: T[]) => string | Element; value?: S; onChange?: (stack: S) => void; }"}},group:{defaultValue:null,description:"",name:"group",required:!1,type:{name:"{ by: (item: T) => G; label: (group: G, items: T[]) => string | Element; value?: G; showAllTab: boolean; onChange?: (group: G) => void; }"}}}}}catch{}export{Rn as T};
