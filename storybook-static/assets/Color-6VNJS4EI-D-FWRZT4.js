import{r as g,R as h}from"./index-CBqU2yxZ.js";import{t as O,Z as T,H as L,u as X,c as d}from"./throttle-CLvCguEj.js";import{n as x,d as R,T as z,F as B,I as G}from"./1.25-to-1.26.0-DrLs_qLQ.js";import"./_commonjsHelpers-BosuxZz1.js";import"./_getPrototype-DZQDOC48.js";import"./jsx-runtime-CKrituN3.js";import"./iframe-Cp3vM5sD.js";import"../sb-preview/runtime.js";import"./index-Js5CwwSK.js";import"./index-BtM5VmRH.js";import"./index-D_r38UMq.js";import"./lib-Izy6Ibba.js";import"./QueryClientProvider-CDvRjfR1.js";import"./pci-guides-header.component-CV9FpeOb.js";import"./useOvhIam-ClA5hGHb.js";import"./filter-list.component-Bug9_2lX.js";import"./index-Q-VytQcI.js";import"./index-DP43DFaX.js";import"./useTranslation-CvcVFFFk.js";import"./i18next-ihUiNgJT.js";import"./index-4N_owrwP.js";import"./delete-modal.component-BjDUbhdi.js";import"./click-utils-ByCElPrV.js";import"./price.component-DWJdk9-Z.js";import"./update-name-modal.component-Cg9uoFVw.js";import"./clipboard.component-cyGtq-9s.js";import"./Step.component-D2SFH0me.js";import"./v4-DDYElseJ.js";import"./Tabs.component-CQJ3RPtT.js";import"./TilesInput.component-BhQnwzgx.js";import"./headers.component-CdB4WDB_.js";import"./card.component-B6CWp-kH.js";import"./title.component-W8VTwPen.js";import"./links.component-VacKWywg.js";import"./dashboard-tile.component-BHwXF-Rw.js";import"./action.component-eB5qpv9J.js";import"./translation-CBNwEvwd.js";import"./ManagerButton-xscdT8pQ.js";import"./guide.component-BWphwWdg.js";import"./dashboard.component-B52snJOG.js";import"./layout.component-DBLu0Nss.js";import"./base.component-Dg4_1DYh.js";import"./error.component-CNOKIvA3.js";import"./onboarding.component-DhZ7QQgk.js";import"./table.component-BfNjIkvp.js";import"./datagrid.component-hst3wSZU.js";import"./datagrid.contants-DE5a_Gky.js";import"./notifications.component-CgyDPP7a.js";import"./ods-notification-CaNS6ZYS.js";import"./ManagerText-BQqHD0JV.js";import"./PciMaintenanceBanner.component-Bh9VXP43.js";import"./region.component-kKtC3z04.js";import"./index-DI5IigMn.js";var V=t=>`control-${t.replace(/\s+/g,"-")}`,F=x.div({position:"relative",maxWidth:250}),M=x(R)({position:"absolute",zIndex:1,top:4,left:4}),W=x.div({width:200,margin:5,".react-colorful__saturation":{borderRadius:"4px 4px 0 0"},".react-colorful__hue":{boxShadow:"inset 0 0 0 1px rgb(0 0 0 / 5%)"},".react-colorful__last-control":{borderRadius:"0 0 4px 4px"}}),N=x(z)(({theme:t})=>({fontFamily:t.typography.fonts.base})),A=x.div({display:"grid",gridTemplateColumns:"repeat(9, 16px)",gap:6,padding:3,marginTop:5,width:200}),j=x.div(({theme:t,active:e})=>({width:16,height:16,boxShadow:e?`${t.appBorderColor} 0 0 0 1px inset, ${t.textMutedColor}50 0 0 0 4px`:`${t.appBorderColor} 0 0 0 1px inset`,borderRadius:t.appBorderRadius})),Z=`url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill-opacity=".05"><path d="M8 0h8v8H8zM0 8h8v8H0z"/></svg>')`,S=({value:t,active:e,onClick:o,style:l,...r})=>{let s=`linear-gradient(${t}, ${t}), ${Z}, linear-gradient(#fff, #fff)`;return h.createElement(j,{...r,active:e,onClick:o,style:{...l,backgroundImage:s}})},q=x(B.Input)(({theme:t})=>({width:"100%",paddingLeft:30,paddingRight:30,boxSizing:"border-box",fontFamily:t.typography.fonts.base})),D=x(G)(({theme:t})=>({position:"absolute",zIndex:1,top:6,right:7,width:20,height:20,padding:4,boxSizing:"border-box",cursor:"pointer",color:t.input.color})),_=(t=>(t.RGB="rgb",t.HSL="hsl",t.HEX="hex",t))(_||{}),w=Object.values(_),J=/\(([0-9]+),\s*([0-9]+)%?,\s*([0-9]+)%?,?\s*([0-9.]+)?\)/,K=/^\s*rgba?\(([0-9]+),\s*([0-9]+),\s*([0-9]+),?\s*([0-9.]+)?\)\s*$/i,Q=/^\s*hsla?\(([0-9]+),\s*([0-9]+)%,\s*([0-9]+)%,?\s*([0-9.]+)?\)\s*$/i,k=/^\s*#?([0-9a-f]{3}|[0-9a-f]{6})\s*$/i,U=/^\s*#?([0-9a-f]{3})\s*$/i,Y={hex:T,rgb:L,hsl:X},y={hex:"transparent",rgb:"rgba(0, 0, 0, 0)",hsl:"hsla(0, 0%, 0%, 0)"},v=t=>{let e=t==null?void 0:t.match(J);if(!e)return[0,0,0,1];let[,o,l,r,s=1]=e;return[o,l,r,s].map(Number)},f=t=>{if(!t)return;let e=!0;if(K.test(t)){let[p,a,n,c]=v(t),[b,m,i]=d.rgb.hsl([p,a,n])||[0,0,0];return{valid:e,value:t,keyword:d.rgb.keyword([p,a,n]),colorSpace:"rgb",rgb:t,hsl:`hsla(${b}, ${m}%, ${i}%, ${c})`,hex:`#${d.rgb.hex([p,a,n]).toLowerCase()}`}}if(Q.test(t)){let[p,a,n,c]=v(t),[b,m,i]=d.hsl.rgb([p,a,n])||[0,0,0];return{valid:e,value:t,keyword:d.hsl.keyword([p,a,n]),colorSpace:"hsl",rgb:`rgba(${b}, ${m}, ${i}, ${c})`,hsl:t,hex:`#${d.hsl.hex([p,a,n]).toLowerCase()}`}}let o=t.replace("#",""),l=d.keyword.rgb(o)||d.hex.rgb(o),r=d.rgb.hsl(l),s=t;if(/[^#a-f0-9]/i.test(t)?s=o:k.test(t)&&(s=`#${o}`),s.startsWith("#"))e=k.test(s);else try{d.keyword.hex(s)}catch{e=!1}return{valid:e,value:s,keyword:d.rgb.keyword(l),colorSpace:"hex",rgb:`rgba(${l[0]}, ${l[1]}, ${l[2]}, 1)`,hsl:`hsla(${r[0]}, ${r[1]}%, ${r[2]}%, 1)`,hex:s}},tt=(t,e,o)=>{if(!t||!(e!=null&&e.valid))return y[o];if(o!=="hex")return(e==null?void 0:e[o])||y[o];if(!e.hex.startsWith("#"))try{return`#${d.keyword.hex(e.hex)}`}catch{return y.hex}let l=e.hex.match(U);if(!l)return k.test(e.hex)?e.hex:y.hex;let[r,s,p]=l[1].split("");return`#${r}${r}${s}${s}${p}${p}`},et=(t,e)=>{let[o,l]=g.useState(t||""),[r,s]=g.useState(()=>f(o)),[p,a]=g.useState((r==null?void 0:r.colorSpace)||"hex");g.useEffect(()=>{let m=t||"",i=f(m);l(m),s(i),a((i==null?void 0:i.colorSpace)||"hex")},[t]);let n=g.useMemo(()=>tt(o,r,p).toLowerCase(),[o,r,p]),c=g.useCallback(m=>{let i=f(m),$=(i==null?void 0:i.value)||m||"";l($),$===""&&(s(void 0),e(void 0)),i&&(s(i),a(i.colorSpace),e(i.value))},[e]),b=g.useCallback(()=>{let m=w.indexOf(p)+1;m>=w.length&&(m=0),a(w[m]);let i=(r==null?void 0:r[w[m]])||"";l(i),e(i)},[r,p,e]);return{value:o,realValue:n,updateValue:c,color:r,colorSpace:p,cycleColorSpace:b}},E=t=>t.replace(/\s*/,"").toLowerCase(),rt=(t,e,o)=>{let[l,r]=g.useState(e!=null&&e.valid?[e]:[]);g.useEffect(()=>{e===void 0&&r([])},[e]);let s=g.useMemo(()=>(t||[]).map(a=>typeof a=="string"?f(a):a.title?{...f(a.color),keyword:a.title}:f(a.color)).concat(l).filter(Boolean).slice(-27),[t,l]),p=g.useCallback(a=>{a!=null&&a.valid&&(s.some(n=>E(n[o])===E(a[o]))||r(n=>n.concat(a)))},[o,s]);return{presets:s,addPreset:p}},at=({name:t,value:e,onChange:o,onFocus:l,onBlur:r,presetColors:s,startOpen:p=!1})=>{let a=g.useCallback(O(o,200),[o]),{value:n,realValue:c,updateValue:b,color:m,colorSpace:i,cycleColorSpace:$}=et(e,a),{presets:C,addPreset:P}=rt(s,m,i),H=Y[i];return h.createElement(F,null,h.createElement(M,{startOpen:p,closeOnOutsideClick:!0,onVisibleChange:()=>P(m),tooltip:h.createElement(W,null,h.createElement(H,{color:c==="transparent"?"#000000":c,onChange:b,onFocus:l,onBlur:r}),C.length>0&&h.createElement(A,null,C.map((u,I)=>h.createElement(R,{key:`${u.value}-${I}`,hasChrome:!1,tooltip:h.createElement(N,{note:u.keyword||u.value})},h.createElement(S,{value:u[i],active:m&&E(u[i])===E(m[i]),onClick:()=>b(u.value)})))))},h.createElement(S,{value:c,style:{margin:4}})),h.createElement(q,{id:V(t),value:n,onChange:u=>b(u.target.value),onFocus:u=>u.target.select(),placeholder:"Choose color..."}),n?h.createElement(D,{icon:"markup",onClick:$}):null)},ae=at;export{at as ColorControl,ae as default};
//# sourceMappingURL=Color-6VNJS4EI-D-FWRZT4.js.map
