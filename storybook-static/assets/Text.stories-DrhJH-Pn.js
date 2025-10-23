import{Q as d}from"./lib-Bpiw0_2K-CzLxCNwi.js";import{I as t,a as p}from"./iam.constants-CZSXEnm9.js";import"./iframe-BMOkqioy.js";import"./index-Bnop-kX6.js";import"./index-4pTrEEYx.js";import"./index-f6p-lzcj.js";import"./jsx-runtime-BRNY0I4F.js";const r={args:{urn:t.WITH_AUTH,iamActions:p,children:"lorem ipsum dolor sit amet"},parameters:{docs:{source:{code:`<Text 
  urn="urn:v9:eu:resource:vrackServices:vrs-xxx-xxx"
  iamActions={['vrackServices:apiovh:iam/resource/tag/remove']}
>
  lorem ipsum dolor sit amet
</Text>`}}}},e={args:{urn:t.WITH_AUTH,iamActions:p},parameters:{docs:{source:{code:`<Text 
  urn="urn:v9:eu:resource:vrackServices:vrs-xxx-xxx"
  iamActions={['vrackServices:apiovh:iam/resource/tag/remove']}
>
  Confidential information
</Text>`}}}},o={args:{...r.args,urn:t.WITHOUT_AUTH},parameters:{docs:{source:{code:`<Text 
  urn="urn:v9:eu:resource:vrackServices:vrs-xxx-xxx-unauthorized"
  iamActions={['vrackServices:apiovh:iam/resource/tag/remove']}
>
  HIDDEN (user without authorization)
</Text>`}}}},H={title:"Manager UI Kit/Components/Text",component:d,tags:["autodocs"],args:{...r.args,children:" Confidential information will be displayed only for users with authorization. For users without authorization, HIDDEN text will be displayed with warning message in the tooltip."},parameters:{docs:{description:{component:"The `Text` component is used to display content with IAM authorization."}}}};var a,s,n;r.parameters={...r.parameters,docs:{...(a=r.parameters)==null?void 0:a.docs,source:{originalSource:`{
  args: {
    urn: IAM_URNS.WITH_AUTH,
    iamActions: IAM_ACTIONS,
    children: 'lorem ipsum dolor sit amet'
  },
  parameters: {
    docs: {
      source: {
        code: \`<Text 
  urn="urn:v9:eu:resource:vrackServices:vrs-xxx-xxx"
  iamActions={['vrackServices:apiovh:iam/resource/tag/remove']}
>
  lorem ipsum dolor sit amet
</Text>\`
      }
    }
  }
}`,...(n=(s=r.parameters)==null?void 0:s.docs)==null?void 0:n.source}}};var i,c,u;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    urn: IAM_URNS.WITH_AUTH,
    iamActions: IAM_ACTIONS
  },
  parameters: {
    docs: {
      source: {
        code: \`<Text 
  urn="urn:v9:eu:resource:vrackServices:vrs-xxx-xxx"
  iamActions={['vrackServices:apiovh:iam/resource/tag/remove']}
>
  Confidential information
</Text>\`
      }
    }
  }
}`,...(u=(c=e.parameters)==null?void 0:c.docs)==null?void 0:u.source}}};var m,x,v;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    urn: IAM_URNS.WITHOUT_AUTH
  },
  parameters: {
    docs: {
      source: {
        code: \`<Text 
  urn="urn:v9:eu:resource:vrackServices:vrs-xxx-xxx-unauthorized"
  iamActions={['vrackServices:apiovh:iam/resource/tag/remove']}
>
  HIDDEN (user without authorization)
</Text>\`
      }
    }
  }
}`,...(v=(x=o.parameters)==null?void 0:x.docs)==null?void 0:v.source}}};const _=["Default","TextWithAuthorization","TextWithoutAuthorization"];export{r as Default,e as TextWithAuthorization,o as TextWithoutAuthorization,_ as __namedExportsOrder,H as default};
