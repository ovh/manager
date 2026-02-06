import{z as I}from"./lib-7WI39Bnb-D_SCLDHY.js";import{I as A,a as g}from"./iam.constants-CZSXEnm9.js";import"./iframe-lMOw8NAl.js";import"./QueryClientProvider-BRZnJt9g.js";import"./index-Bnop-kX6.js";import"./jsx-runtime-BRNY0I4F.js";import"./index-Do5RsF8R.js";import"./index-4pTrEEYx.js";import"./Icon-xxQ9IRzi-ORI6lMWl.js";import"./index-CWkFp9WS-BSIT86NH.js";import"./Link-TMoA1i18-DiBAU0SL.js";import"./Text-BGoUCJU7-BjFZdlzU.js";import"./ComboboxControl-EYkaEIlI-CWYTos8A.js";import"./Divider-wQyo85oE-5vlIiwia.js";const o={args:{children:"Remove Button"},parameters:{docs:{source:{code:"<Button>Remove Button</Button>"}}}},t={args:{children:"Remove Button",loading:!0},parameters:{docs:{source:{code:`<Button loading={true}>
  Remove Button
</Button>`}}}},e={args:{children:"Remove button",urn:A.WITH_AUTH,iamActions:g},parameters:{docs:{source:{code:`<Button
  urn="urn:v9:eu:resource:vrackServices:vrs-xxx-xxx"
  iamActions={['vrackServices:apiovh:iam/resource/tag/remove']}
>
  Remove button
</Button>`}}}},r={args:{children:"Remove button",urn:A.WITHOUT_AUTH,iamActions:g},parameters:{docs:{source:{code:`<Button
  urn="urn:v9:eu:resource:vrackServices:vrs-xxx-xxx"
  iamActions={['vrackServices:apiovh:iam/resource/tag/remove']}
>
  Remove button
</Button>`}}}},W={title:"Manager UI Kit/Components/Button",component:I,tags:["autodocs"],args:{children:"Remove button"},argTypes:{iamActions:{description:"IAM actions required to enable this button. Used for permission-based access control.",control:{type:"object"},table:{category:"IAM Authorization"}},urn:{description:"Uniform Resource Name for IAM authorization check.",control:{type:"text"},table:{category:"IAM Authorization"}},displayTooltip:{description:"Whether to display a tooltip when the button is disabled due to IAM permissions.",control:{type:"boolean"},table:{category:"IAM Authorization",defaultValue:{summary:"false"}}},tooltipPosition:{description:"Position of the tooltip relative to the button.",control:{type:"select"},table:{category:"IAM Authorization",defaultValue:{summary:"TOOLTIP_POSITION.top"}}},children:{description:"The content to display inside the button (text or React elements).",control:{type:"text"}}},parameters:{docs:{description:{component:"The `Button` component is used to trigger an action or event."}}}};var n,a,s;o.parameters={...o.parameters,docs:{...(n=o.parameters)==null?void 0:n.docs,source:{originalSource:`{
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
}`,...(s=(a=o.parameters)==null?void 0:a.docs)==null?void 0:s.source}}};var i,c,u;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
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
}`,...(u=(c=t.parameters)==null?void 0:c.docs)==null?void 0:u.source}}};var m,p,d;e.parameters={...e.parameters,docs:{...(m=e.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
}`,...(d=(p=e.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var v,l,h;r.parameters={...r.parameters,docs:{...(v=r.parameters)==null?void 0:v.docs,source:{originalSource:`{
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
}`,...(h=(l=r.parameters)==null?void 0:l.docs)==null?void 0:h.source}}};const H=["Default","IsLoading","ButtonWithIamAuthorization","ButtonWithoutIamAuthorization"];export{e as ButtonWithIamAuthorization,r as ButtonWithoutIamAuthorization,o as Default,t as IsLoading,H as __namedExportsOrder,W as default};
