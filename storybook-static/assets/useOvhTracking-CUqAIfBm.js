import{r as v,R as C}from"./index-CBqU2yxZ.js";import{f as h}from"./index-DaQ_SeLH.js";const x=v.createContext({shell:null,environment:null,tracking:null}),d=n=>n.replace(/\s/g,"_").replace(/:/g,"");var f;(function(n){n.onboarding="onboarding",n.listing="listing",n.dashboard="dashboard",n.popup="pop-up",n.bannerSuccess="banner-success",n.bannerError="banner-error",n.bannerInfo="banner-info",n.bannerWarning="banner-warning",n.funnel="funnel"})(f||(f={}));var k;(function(n){n.page="page",n.funnel="funnel",n.banner="banner",n.popup="pop-up",n.datagrid="datagrid",n.tile="tile"})(k||(k={}));var m;(function(n){n.button="button",n.link="link",n.select="select",n.externalLink="external-link",n.tile="tile",n.tutorial="tile-tutorial",n.tab="go-to-tab"})(m||(m={}));const b=({chapter1:n,chapter2:r,chapter3:e,level2:i,appName:a,pageTheme:l,pageType:t,pageName:o})=>({name:[n,r,e,a,t,o].filter(Boolean).map(d).join("::"),page:[a,t,o].filter(Boolean).join("::"),page_category:t,page_theme:l,type:"display",level2:i}),_=({pageName:n,pageType:r,chapter1:e,chapter2:i,chapter3:a,appName:l,pageTheme:t,level2:o,location:c,buttonType:s,actions:g=[],actionType:u="action"})=>({name:[e,i,a,c,s,...g].filter(Boolean).map(d).join("::"),page:b({chapter1:e,chapter2:i,chapter3:a,appName:l,pageName:n,pageType:r}),page_category:r,page_theme:t,type:u,level2:o}),j=()=>{const n=h(),{handle:r}=n[n.length-1];return r==null?void 0:r.tracking},E=()=>{var t,o,c;const n=j(),{shell:r,tracking:e,environment:i}=C.useContext(x),a=i.getRegion(),l=((c=(o=(t=e==null?void 0:e.level2Config)==null?void 0:t[a])==null?void 0:o.config)==null?void 0:c.level2)||(e==null?void 0:e.level2);return{trackCurrentPage:()=>{e&&n&&r.tracking.trackPage(b({...e,...n,level2:l}))},trackPage:s=>{r.tracking.trackPage(b({...e,...s,level2:l}))},trackClick:({location:s,buttonType:g,actions:u,actionType:p})=>{r.tracking.trackClick(_({...e,...n,location:s,buttonType:g,actionType:p,actions:u,level2:l}))}}};export{f as P,x as S,E as u};
