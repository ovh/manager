import{j as s}from"./jsx-runtime-BRNY0I4F.js";import{w as n,p as S}from"./lib-D44cvI9Y-Bb2oAnDh.js";import"./index-Bnop-kX6.js";import"./iframe-Bru3zJiY.js";import"./QueryClientProvider-BPX08D6Z.js";import"./with-selector-CbDTc_Tw.js";import"./index-4pTrEEYx.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./Link-BWQEuWpd-D0wspT2_.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./ComboboxControl-sJOkWHeT-8SVRT3vS.js";import"./Divider-THit99OS-Di1FabXz.js";const H=({date:b,format:h,invalidDateDisplayLabel:v})=>{const P=S({invalidDateDisplayLabel:v});return s.jsxs(s.Fragment,{children:[s.jsx("strong",{children:"Date :"})," ",P({date:b,format:h})]})},e={args:{date:new Date}},a={args:{date:new Date,format:"dd/MM/yyyy"}},t={args:{date:new Date,format:"dd/MM/yyyy HH:mm"}},r={args:{date:new Date,format:"PPpp"}},o={args:{date:"invalid-date",invalidDateDisplayLabel:"Date inconnue"}},R={title:"Manager UI Kit/Hooks/useFormatDate",component:H,tags:["autodocs"],argTypes:{invalidDateDisplayLabel:{control:"text",value:n,description:"Label used when the date is invalid or missing.",table:{defaultValue:{summary:n},type:{summary:"string"}}},date:{control:"date",description:"Date to format",table:{defaultValue:{summary:"undefined"},type:{summary:"date | string"}}},format:{control:"text",description:"Format of date expected see : https://date-fns.org/docs/format",table:{defaultValue:{summary:"PP"}}}}};var m,d,i;e.parameters={...e.parameters,docs:{...(m=e.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    date: new Date()
  }
}`,...(i=(d=e.parameters)==null?void 0:d.docs)==null?void 0:i.source}}};var p,c,u;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    date: new Date(),
    format: 'dd/MM/yyyy'
  }
}`,...(u=(c=a.parameters)==null?void 0:c.docs)==null?void 0:u.source}}};var l,D,y;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(M=(F=o.parameters)==null?void 0:F.docs)==null?void 0:M.source}}};const q=["Default","CustomFormat","WithTime","FullDateTime","UnknownDate"];export{a as CustomFormat,e as Default,r as FullDateTime,o as UnknownDate,t as WithTime,q as __namedExportsOrder,R as default};
