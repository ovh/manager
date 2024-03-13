import{_ as h,o as s,c as t,e as n,F as k,D as f,k as a,t as r,a as m,p as y,m as b}from"./framework.2eec50d8.js";const v=e=>{switch(e){case"apps":case"modules":case"tools":return`packages/manager/${e}/*`;default:return"packages/components/*"}},j={props:{type:String},data(){return{loading:!1,success:!1,rejected:!1,packages:[]}},async mounted(){this.loading=!0;try{const i=await(await fetch("/manager/assets/json/packages.json")).json(),{packagesList:p}=i.find(l=>l.workspace===v(this.type));this.packages=p,this.success=!0}catch{this.rejected=!0}finally{this.loading=!1}}},c=e=>(y("data-v-141ab855"),e=e(),b(),e),L={key:0},w=c(()=>a("p",null,"Loading…",-1)),x=[w],S={key:1},I={key:2},B=["href"],D=c(()=>a("br",null,null,-1)),N=c(()=>a("strong",null,"Description",-1)),V=c(()=>a("hr",null,null,-1));function F(e,i,p,l,o,P){return s(),t("div",null,[o.loading?(s(),t("div",L,x)):n("",!0),o.rejected?(s(),t("p",S," Unable to get the packages list. ")):n("",!0),o.success?(s(),t("ul",I,[(s(!0),t(k,null,f(o.packages,({package:{name:_,description:d,repository:u,version:g}})=>(s(),t("li",{key:_},[a("a",{href:"https://github.com/ovh/manager/tree/master/"+u.directory,rel:"noopener noreferrer",target:"_blank"},r(_)+"@"+r(g),9,B),D,a("span",null,[N,m(": "+r(d||"n/a"),1)]),V]))),128))])):n("",!0)])}const C=h(j,[["render",F],["__scopeId","data-v-141ab855"]]);export{C as L};
