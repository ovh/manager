import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{T as d}from"./manager-react-components-lib.es-XHmROoQx.js";import{I as p,a as T}from"./iam.constants-DtqzYIv-.js";import"./index-Bnop-kX6.js";import"./iframe-AYzKZ5zH.js";import"./QueryClientProvider-BkgfFh-U.js";import"./index-BA2H_d3W.js";import"./context-BVP_XnaJ.js";import"./index-D0sJu8id.js";const r={args:{urn:p.WITH_AUTH,iamActions:T}};function u(c){return e.jsxs(d,{...c,children:["Confidential information will be displayed only for users with authorization. ",e.jsx("br",{}),"For users without authorization, 'HIDDEN' text will be displayed with warning message in the tooltip."]})}const _={title:"Manager React Components/Components/Manager Text",render:u},t={title:"Manager React Components/Components/Manager Text",args:{...r.args,urn:p.WITHOUT_AUTH},render:u};var o,n,a;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    urn: IAM_URNS.WITH_AUTH,
    iamActions: IAM_ACTIONS
  }
}`,...(a=(n=r.parameters)==null?void 0:n.docs)==null?void 0:a.source}}};var s,i,m;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`{
  title: 'Manager React Components/Components/Manager Text',
  args: {
    ...Default.args,
    urn: IAM_URNS.WITHOUT_AUTH
  },
  render: renderComponent
}`,...(m=(i=t.parameters)==null?void 0:i.docs)==null?void 0:m.source}}};const H=["Default","TextWithoutAuthorization"];export{r as Default,t as TextWithoutAuthorization,H as __namedExportsOrder,_ as default};
