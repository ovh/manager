import{D as I}from"./lib-sJyaz0Xv-BlWaqhkt.js";import{I as A,a as g}from"./iam.constants-CZSXEnm9.js";import"./iframe-C-_YPmA_.js";import"./QueryClientProvider-C1FTVqK-.js";import"./index-Bnop-kX6.js";import"./jsx-runtime-BRNY0I4F.js";import"./index-ChsYPcXR.js";import"./index-4pTrEEYx.js";const e={args:{children:"Remove Button"},parameters:{docs:{source:{code:"<Button>Remove Button</Button>"}}}},t={args:{children:"Remove Button",loading:!0},parameters:{docs:{source:{code:`<Button loading={true}>
  Remove Button
</Button>`}}}},o={args:{children:"Remove button",urn:A.WITH_AUTH,iamActions:g},parameters:{docs:{source:{code:`<Button
  urn="urn:v9:eu:resource:vrackServices:vrs-xxx-xxx"
  iamActions={['vrackServices:apiovh:iam/resource/tag/remove']}
>
  Remove button
</Button>`}}}},r={args:{children:"Remove button",urn:A.WITHOUT_AUTH,iamActions:g},parameters:{docs:{source:{code:`<Button
  urn="urn:v9:eu:resource:vrackServices:vrs-xxx-xxx"
  iamActions={['vrackServices:apiovh:iam/resource/tag/remove']}
>
  Remove button
</Button>`}}}},f={title:"Manager UI Kit/Components/Button",component:I,tags:["autodocs"],args:{children:"Remove button"},argTypes:{iamActions:{description:"IAM actions required to enable this button. Used for permission-based access control.",control:{type:"object"},table:{category:"IAM Authorization"}},urn:{description:"Uniform Resource Name for IAM authorization check.",control:{type:"text"},table:{category:"IAM Authorization"}},displayTooltip:{description:"Whether to display a tooltip when the button is disabled due to IAM permissions.",control:{type:"boolean"},table:{category:"IAM Authorization",defaultValue:{summary:"false"}}},isIamTrigger:{description:"Whether this button triggers IAM authorization checks.",control:{type:"boolean"},table:{category:"IAM Authorization",defaultValue:{summary:"false"}}},tooltipPosition:{description:"Position of the tooltip relative to the button.",control:{type:"select"},table:{category:"IAM Authorization",defaultValue:{summary:"TOOLTIP_POSITION.top"}}},children:{description:"The content to display inside the button (text or React elements).",control:{type:"text"}}},parameters:{docs:{description:{component:"The `Button` component is used to trigger an action or event."}}}};var n,a,s;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    children: 'Remove Button'
  },
  parameters: {
    docs: {
      source: {
        code: \`<Button>Remove Button</Button>\`
      }
    }
  }
}`,...(s=(a=e.parameters)==null?void 0:a.docs)==null?void 0:s.source}}};var i,c,u;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    children: 'Remove Button',
    loading: true
  },
  parameters: {
    docs: {
      source: {
        code: \`<Button loading={true}>
  Remove Button
</Button>\`
      }
    }
  }
}`,...(u=(c=t.parameters)==null?void 0:c.docs)==null?void 0:u.source}}};var m,d,p;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    children: 'Remove button',
    urn: IAM_URNS.WITH_AUTH,
    iamActions: IAM_ACTIONS
  },
  parameters: {
    docs: {
      source: {
        code: \`<Button
  urn="urn:v9:eu:resource:vrackServices:vrs-xxx-xxx"
  iamActions={['vrackServices:apiovh:iam/resource/tag/remove']}
>
  Remove button
</Button>\`
      }
    }
  }
}`,...(p=(d=o.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};var l,v,h;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    children: 'Remove button',
    urn: IAM_URNS.WITHOUT_AUTH,
    iamActions: IAM_ACTIONS
  },
  parameters: {
    docs: {
      source: {
        code: \`<Button
  urn="urn:v9:eu:resource:vrackServices:vrs-xxx-xxx"
  iamActions={['vrackServices:apiovh:iam/resource/tag/remove']}
>
  Remove button
</Button>\`
      }
    }
  }
}`,...(h=(v=r.parameters)==null?void 0:v.docs)==null?void 0:h.source}}};const _=["Default","IsLoading","ButtonWithIamAuthorization","ButtonWithoutIamAuthorization"];export{o as ButtonWithIamAuthorization,r as ButtonWithoutIamAuthorization,e as Default,t as IsLoading,_ as __namedExportsOrder,f as default};
