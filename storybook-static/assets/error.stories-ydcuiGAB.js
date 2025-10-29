import{j as s}from"./jsx-runtime-BRNY0I4F.js";import{w as a}from"./lib-Dk32xhqR-BnP8dUtW.js";import"./index-Bnop-kX6.js";import"./iframe-IyM3Vz8H.js";import"./index-4pTrEEYx.js";import"./index-GPs4uoxI.js";const l={error:{}},x={error:{status:404}},f={error:{status:401,data:{message:"[serviceId] Given data (undefined) is not valid for type long"},headers:{"x-ovh-queryid":"123456789"}}},W={title:"Manager UI Kit/Components/Errors",decorators:[g=>s.jsx("div",{children:g()})],component:a,tags:["autodocs"],argTypes:{},args:l,parameters:{layout:"centered"}},r=()=>s.jsx(a,{...l});r.parameters={docs:{source:{code:"<Error error={{}} />"}}};const e=()=>s.jsx(a,{...x});e.parameters={docs:{source:{code:`<Error 
  error={{
    status: 404,
  }} 
/>`}}};const o=()=>s.jsx(a,{...f});o.parameters={docs:{source:{code:`<Error 
  error={{
    status: 401,
    data: {
      message: '[serviceId] Given data (undefined) is not valid for type long',
    },
    headers: { 'x-ovh-queryid': '123456789' },
  }} 
/>`}}};var t,d,c;r.parameters={...r.parameters,docs:{...(t=r.parameters)==null?void 0:t.docs,source:{originalSource:"() => <Error {...defaultError} />",...(c=(d=r.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};var i,p,n;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:"() => <Error {...error404} />",...(n=(p=e.parameters)==null?void 0:p.docs)==null?void 0:n.source}}};var m,u,E;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:"() => <Error {...errorApiWithCode} />",...(E=(u=o.parameters)==null?void 0:u.docs)==null?void 0:E.source}}};const I=["ErrorBoundary","Error404","ErrorApiWithCode"];export{e as Error404,o as ErrorApiWithCode,r as ErrorBoundary,I as __namedExportsOrder,W as default};
