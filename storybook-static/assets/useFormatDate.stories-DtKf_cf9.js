import{j as s}from"./jsx-runtime-BRNY0I4F.js";import{n,o as S}from"./lib-7WI39Bnb-CLGqEc7s.js";import"./index-Bnop-kX6.js";import"./iframe-BRkcAREb.js";import"./QueryClientProvider-BPX08D6Z.js";import"./index-DnqQo6oJ.js";import"./index-4pTrEEYx.js";import"./Icon-xxQ9IRzi-ORI6lMWl.js";import"./index-CWkFp9WS-BSIT86NH.js";import"./Link-TMoA1i18-DiBAU0SL.js";import"./Text-BGoUCJU7-BjFZdlzU.js";import"./ComboboxControl-EYkaEIlI-CWYTos8A.js";import"./Divider-wQyo85oE-5vlIiwia.js";const H=({date:v,format:b,invalidDateDisplayLabel:h})=>{const P=S({invalidDateDisplayLabel:h});return s.jsxs(s.Fragment,{children:[s.jsx("strong",{children:"Date :"})," ",P({date:v,format:b})]})},e={args:{date:new Date}},a={args:{date:new Date,format:"dd/MM/yyyy"}},t={args:{date:new Date,format:"dd/MM/yyyy HH:mm"}},r={args:{date:new Date,format:"PPpp"}},o={args:{date:"invalid-date",invalidDateDisplayLabel:"Date inconnue"}},R={title:"Manager UI Kit/Hooks/useFormatDate",component:H,tags:["autodocs"],argTypes:{invalidDateDisplayLabel:{control:"text",value:n,description:"Label used when the date is invalid or missing.",table:{defaultValue:{summary:n},type:{summary:"string"}}},date:{control:"date",description:"Date to format",table:{defaultValue:{summary:"undefined"},type:{summary:"date | string"}}},format:{control:"text",description:"Format of date expected see : https://date-fns.org/docs/format",table:{defaultValue:{summary:"PP"}}}}};var m,d,i;e.parameters={...e.parameters,docs:{...(m=e.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
}`,...(w=(f=r.parameters)==null?void 0:f.docs)==null?void 0:w.source}}};var x,F,M;o.parameters={...o.parameters,docs:{...(x=o.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    date: 'invalid-date',
    invalidDateDisplayLabel: 'Date inconnue'
  }
}`,...(M=(F=o.parameters)==null?void 0:F.docs)==null?void 0:M.source}}};const $=["Default","CustomFormat","WithTime","FullDateTime","UnknownDate"];export{a as CustomFormat,e as Default,r as FullDateTime,o as UnknownDate,t as WithTime,$ as __namedExportsOrder,R as default};
