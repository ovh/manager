import{j as r}from"./jsx-runtime-BRNY0I4F.js";import{h}from"./lib-Dk32xhqR-BnP8dUtW.js";import"./index-Bnop-kX6.js";import"./iframe-IyM3Vz8H.js";import"./index-4pTrEEYx.js";import"./index-GPs4uoxI.js";const O=({region:e})=>{const{translateMicroRegion:j,translateMacroRegion:U,translateContinentRegion:T}=h();return r.jsxs("div",{className:"space-y-4",children:[r.jsx("strong",{children:"Region Code:"})," ",e,r.jsx("br",{}),r.jsx("strong",{children:"Micro-region:"})," ",j(e)||"N/A",r.jsx("br",{}),r.jsx("strong",{children:"Macro-region:"})," ",U(e)||"N/A",r.jsx("br",{}),r.jsx("strong",{children:"Continent:"})," ",T(e)||"N/A"]})},b={title:"Manager UI Kit/Hooks/useTranslatedMicroRegions",component:O,tags:["autodocs"],argTypes:{region:{control:"text",description:"OVHcloud region identifier"}}},o={args:{region:"GRA-1"}},n={args:{region:"EU-WEST-LZ-MAD-A"}},s={args:{region:"WES1"}},a={args:{region:"US-EAST-VA-1"}},t={args:{region:"UNKNOWN-REGION"}};var i,c,g;o.parameters={...o.parameters,docs:{...(i=o.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    region: 'GRA-1'
  }
}`,...(g=(c=o.parameters)==null?void 0:c.docs)==null?void 0:g.source}}};var m,d,p;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    region: 'EU-WEST-LZ-MAD-A'
  }
}`,...(p=(d=n.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};var l,u,S;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    region: 'WES1'
  }
}`,...(S=(u=s.parameters)==null?void 0:u.docs)==null?void 0:S.source}}};var R,x,A;a.parameters={...a.parameters,docs:{...(R=a.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    region: 'US-EAST-VA-1'
  }
}`,...(A=(x=a.parameters)==null?void 0:x.docs)==null?void 0:A.source}}};var E,N,M;t.parameters={...t.parameters,docs:{...(E=t.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    region: 'UNKNOWN-REGION'
  }
}`,...(M=(N=t.parameters)==null?void 0:N.docs)==null?void 0:M.source}}};const k=["StandardRegion","LocalZone","SingleSegment","MultiSegment","UnknownRegion"];export{n as LocalZone,a as MultiSegment,s as SingleSegment,o as StandardRegion,t as UnknownRegion,k as __namedExportsOrder,b as default};
