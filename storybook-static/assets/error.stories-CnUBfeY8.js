import{j as s}from"./jsx-runtime-BRNY0I4F.js";import{x as a}from"./lib-sJyaz0Xv-BL1_0Bz9.js";import"./index-Bnop-kX6.js";import"./iframe-BRebac83.js";import"./QueryClientProvider-C1FTVqK-.js";import"./index-ChsYPcXR.js";import"./index-4pTrEEYx.js";const l={error:{}},g={error:{status:404}},f={error:{status:401,data:{message:"[serviceId] Given data (undefined) is not valid for type long"},headers:{"x-ovh-queryid":"123456789"}}},I={title:"Manager UI Kit/Components/Errors",decorators:[x=>s.jsx("div",{children:x()})],component:a,tags:["autodocs"],argTypes:{},args:l,parameters:{layout:"centered"}},r=()=>s.jsx(a,{...l});r.parameters={docs:{source:{code:"<Error error={{}} />"}}};const e=()=>s.jsx(a,{...g});e.parameters={docs:{source:{code:`<Error 
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
/>`}}};var t,d,c;r.parameters={...r.parameters,docs:{...(t=r.parameters)==null?void 0:t.docs,source:{originalSource:"() => <Error {...defaultError} />",...(c=(d=r.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};var i,p,m;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:"() => <Error {...error404} />",...(m=(p=e.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var n,u,E;o.parameters={...o.parameters,docs:{...(n=o.parameters)==null?void 0:n.docs,source:{originalSource:"() => <Error {...errorApiWithCode} />",...(E=(u=o.parameters)==null?void 0:u.docs)==null?void 0:E.source}}};const S=["ErrorBoundary","Error404","ErrorApiWithCode"];export{e as Error404,o as ErrorApiWithCode,r as ErrorBoundary,S as __namedExportsOrder,I as default};
