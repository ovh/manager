import{_ as h,o as s,c as t,e as n,F as k,E as f,k as a,t as r,a as m,p as y,q as b}from"./framework.D09SL32Y.js";const j=e=>{switch(e){case"apps":case"modules":case"tools":return`packages/manager/${e}/*`;default:return"packages/components/*"}},v={props:{type:String},data(){return{loading:!1,success:!1,rejected:!1,packages:[]}},async mounted(){this.loading=!0;try{const i=await(await fetch("/manager/assets/json/packages.json")).json(),{packagesList:p}=i.find(l=>l.workspace===j(this.type));this.packages=p,this.success=!0}catch{this.rejected=!0}finally{this.loading=!1}}},c=e=>(y("data-v-141ab855"),e=e(),b(),e),w={key:0},L=c(()=>a("p",null,"Loading…",-1)),S=[L],x={key:1},I={key:2},B=["href"],N=c(()=>a("br",null,null,-1)),V=c(()=>a("strong",null,"Description",-1)),D=c(()=>a("hr",null,null,-1));function E(e,i,p,l,o,F){return s(),t("div",null,[o.loading?(s(),t("div",w,S)):n("",!0),o.rejected?(s(),t("p",x," Unable to get the packages list. ")):n("",!0),o.success?(s(),t("ul",I,[(s(!0),t(k,null,f(o.packages,({package:{name:d,description:u,repository:_,version:g}})=>(s(),t("li",{key:d},[a("a",{href:"https://github.com/ovh/manager/tree/master/"+_.directory,rel:"noopener noreferrer",target:"_blank"},r(d)+"@"+r(g),9,B),N,a("span",null,[V,m(": "+r(u||"n/a"),1)]),D]))),128))])):n("",!0)])}const A=h(v,[["render",E],["__scopeId","data-v-141ab855"]]);export{A as L};
