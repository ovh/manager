import{j as o}from"./jsx-runtime-BRNY0I4F.js";import{r as n,i as S}from"./lib-Bpiw0_2K-CzLxCNwi.js";import"./index-Bnop-kX6.js";import"./iframe-BMOkqioy.js";import"./index-4pTrEEYx.js";import"./index-f6p-lzcj.js";const H=({date:b,format:h,invalidDateDisplayLabel:v})=>{const P=S({invalidDateDisplayLabel:v});return o.jsxs(o.Fragment,{children:[o.jsx("strong",{children:"Date :"})," ",P({date:b,format:h})]})},e={args:{date:new Date}},a={args:{date:new Date,format:"dd/MM/yyyy"}},t={args:{date:new Date,format:"dd/MM/yyyy HH:mm"}},r={args:{date:new Date,format:"PPpp"}},s={args:{date:"invalid-date",invalidDateDisplayLabel:"Date inconnue"}},V={title:"Manager UI Kit/Hooks/useFormatDate",component:H,tags:["autodocs"],argTypes:{invalidDateDisplayLabel:{control:"text",value:n,description:"Label used when the date is invalid or missing.",table:{defaultValue:{summary:n},type:{summary:"string"}}},date:{control:"date",description:"Date to format",table:{defaultValue:{summary:"undefined"},type:{summary:"date | string"}}},format:{control:"text",description:"Format of date expected see : https://date-fns.org/docs/format",table:{defaultValue:{summary:"PP"}}}}};var m,d,i;e.parameters={...e.parameters,docs:{...(m=e.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    date: new Date()
  }
}`,...(i=(d=e.parameters)==null?void 0:d.docs)==null?void 0:i.source}}};var c,p,u;a.parameters={...a.parameters,docs:{...(c=a.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    date: new Date(),
    format: 'dd/MM/yyyy'
  }
}`,...(u=(p=a.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};var l,D,y;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    date: new Date(),
    format: 'dd/MM/yyyy HH:mm'
  }
}`,...(y=(D=t.parameters)==null?void 0:D.docs)==null?void 0:y.source}}};var g,f,w;r.parameters={...r.parameters,docs:{...(g=r.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    date: new Date(),
    format: 'PPpp'
  }
}`,...(w=(f=r.parameters)==null?void 0:f.docs)==null?void 0:w.source}}};var x,F,M;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    date: 'invalid-date',
    invalidDateDisplayLabel: 'Date inconnue'
  }
}`,...(M=(F=s.parameters)==null?void 0:F.docs)==null?void 0:M.source}}};const E=["Default","CustomFormat","WithTime","FullDateTime","UnknownDate"];export{a as CustomFormat,e as Default,r as FullDateTime,s as UnknownDate,t as WithTime,E as __namedExportsOrder,V as default};
