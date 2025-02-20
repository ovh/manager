import{j as t}from"./jsx-runtime-CKrituN3.js";import{r as u}from"./index-CBqU2yxZ.js";import{c as p,v as j}from"./clsx-B5jdQy5X.js";import{O as w,f as x}from"./index-D2Jq8zTl.js";import{a as g}from"./index-WQl7iQZP.js";var I=typeof window<"u",N=function(s,r){return I?window.matchMedia(s).matches:!1},$=function(s,r){var o=u.useState(N(s)),i=o[0],l=o[1];return u.useEffect(function(){var a=!0,d=window.matchMedia(s),c=function(){a&&l(!!d.matches)};return d.addEventListener("change",c),l(d.matches),function(){a=!1,d.removeEventListener("change",c)}},[s]),i};const E=s=>{let r=0;const o=(a=>{switch(typeof a){case"number":return`${a}`;case"bigint":return`${a}`;case"string":return`${a}`;case"boolean":return`${a}`;case"object":return JSON.stringify(a);case"function":return"function";case"undefined":return"undefined";default:return"symbol"}})(s),i=(o==null?void 0:o.length)||0;let l=0;if(i>0)for(;l<i;)r=(r<<5)-r+o.charCodeAt(l++)|0;return r};function v({id:s=j(),items:r=[],itemKey:o,titleElement:i=n=>t.jsx("div",{children:`title ${n}`}),contentElement:l=n=>t.jsx("div",{children:`content ${n}`}),mobileBreakPoint:a,className:d,onChange:c}){const[n,b]=u.useState({items:r,selectedItem:r==null?void 0:r[0]}),m=e=>{b(f=>({...f,selectedItem:e}))},h=e=>o?o(e):`${E(e)}`;u.useEffect(()=>{Array.isArray(r)&&r.length&&(r.length!==n.items.length||r.some((e,f)=>!Object.is(e,n.items[f])))&&b(()=>({items:r,selectedItem:r[0]}))},[r]),u.useEffect(()=>{typeof c=="function"&&c(n.selectedItem)},[n.selectedItem]);const y=$(`(min-width: ${a||760}px)`);return t.jsx(t.Fragment,{children:y?t.jsxs("section",{className:p("rounded-sm flex flex-col",d),"data-testid":"desktop",children:[t.jsxs("ul",{className:"flex flex-row list-none p-0 m-0 w-full","data-testid":"titles",children:[n.items.map(e=>t.jsx("li",{className:p("px-4 py-4 cursor-pointer border border-solid border-[--ods-color-primary-100] rounded-t-lg",e===n.selectedItem?"border-b-0 bg-[--ods-color-primary-050]":"border-b bg-white"),children:t.jsx("button",{className:"border-0 bg-transparent cursor-pointer w-full",onClick:()=>m(e),onKeyDown:()=>m(e),children:i(e,e===n.selectedItem)})},`tabs-${s}title-${h(e)}`)),t.jsx("li",{className:"border-0 border-b border-solid border-b-[--ods-color-primary-100] w-full"},"none")]}),t.jsx("div",{className:"bg-[--ods-color-primary-050] border border-solid border-[--ods-color-primary-100] border-t-0",children:l(n.selectedItem)})]}):t.jsx("section",{className:p("grid gap-6 grid-cols-1",d),"data-testid":"mobile",children:n.items.map(e=>t.jsxs("div",{className:"px-2 bg-[--ods-color-primary-050] border border-solid border-[--ods-color-primary-100] rounded-lg",children:[t.jsxs("button",{className:"flex cursor-pointer px-4 py-4 w-full border-0 bg-transparent",onClick:()=>m(e),onKeyDown:()=>m(e),children:[t.jsx("div",{className:"w-full",children:t.jsx(w,{children:i(e,e===n.selectedItem)})}),t.jsx("div",{className:"w-fit flex items-center",children:Object.is(n.selectedItem,e)?t.jsx(x,{name:g.chevronUp}):t.jsx(x,{name:g.chevronDown})})]}),Object.is(n.selectedItem,e)&&t.jsx("div",{children:l(e)})]},`tabs-${s}title-${h(e)}`))})})}try{v.displayName="TabsComponent",v.__docgenInfo={description:"",displayName:"TabsComponent",props:{id:{defaultValue:{value:"uuidV4()"},description:"",name:"id",required:!1,type:{name:"string"}},items:{defaultValue:{value:"[]"},description:"",name:"items",required:!1,type:{name:"Item[]"}},itemKey:{defaultValue:null,description:"",name:"itemKey",required:!1,type:{name:"(item: Item) => string"}},titleElement:{defaultValue:{value:"(item) => <div>{`title ${item}`}</div>"},description:"",name:"titleElement",required:!1,type:{name:"(item: Item, isSelected?: boolean) => string | Element"}},contentElement:{defaultValue:{value:"(item) => <div>{`content ${item}`}</div>"},description:"",name:"contentElement",required:!1,type:{name:"(item: Item) => Element"}},mobileBreakPoint:{defaultValue:null,description:"",name:"mobileBreakPoint",required:!1,type:{name:"number"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!1,type:{name:"(item: Item) => void"}}}}}catch{}export{v as T,E as h};
