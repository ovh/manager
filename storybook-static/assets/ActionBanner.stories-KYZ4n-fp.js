import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{a as n}from"./Divider-THit99OS-Di1FabXz.js";import{b as C}from"./ComboboxControl-sJOkWHeT-8SVRT3vS.js";import{Y as s}from"./lib-D44cvI9Y-Bb2oAnDh.js";import"./index-Bnop-kX6.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./Link-BWQEuWpd-D0wspT2_.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./index-4pTrEEYx.js";import"./iframe-Bru3zJiY.js";import"./QueryClientProvider-BPX08D6Z.js";import"./with-selector-CbDTc_Tw.js";const o={args:{message:"This is a test message. <strong>This message is in bold.</strong>",variant:C.default,color:n.information,dismissible:!0},parameters:{docs:{source:{code:`<ActionBanner
  message="This is a test message. <strong>This message is in bold.</strong>"
  color={MESSAGE_COLOR.information}
  dismissible={true}
/>`}}}},I={title:"Manager UI Kit/Components/Action Banner",component:s,tags:["autodocs"]},r={decorators:[h=>e.jsx("div",{style:{display:"inline-flex",flexFlow:"column",gap:"8px"},children:h()})],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(s,{message:"Critical message",color:n.critical}),e.jsx(s,{message:"Danger message",color:n.danger}),e.jsx(s,{message:"Information message",color:n.information}),e.jsx(s,{message:"Success message",color:n.success}),e.jsx(s,{message:"Warning message",color:n.warning})]})},a={title:"Manager UI Kit/Components/ActionBanner",args:{...o.args,label:"Click Me!",onClick:()=>{}},component:s},t={title:"Manager UI Kit/Components/ActionBanner",args:{...o.args,label:"Click Me!",href:"https://www.ovhcloud.com/"},component:s};var i,c,m;o.parameters={...o.parameters,docs:{...(i=o.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    message: 'This is a test message. <strong>This message is in bold.</strong>',
    variant: MESSAGE_VARIANT.default,
    color: MESSAGE_COLOR.information,
    dismissible: true
  },
  parameters: {
    docs: {
      source: {
        code: \`<ActionBanner
  message="This is a test message. <strong>This message is in bold.</strong>"
  color={MESSAGE_COLOR.information}
  dismissible={true}
/>\`
      }
    }
  }
}`,...(m=(c=o.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var l,g,p;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'inline-flex',
    flexFlow: 'column',
    gap: '8px'
  }}>
        {story()}
      </div>],
  render: () => <>
      <ActionBanner message="Critical message" color={MESSAGE_COLOR.critical} />
      <ActionBanner message="Danger message" color={MESSAGE_COLOR.danger} />
      <ActionBanner message="Information message" color={MESSAGE_COLOR.information} />
      <ActionBanner message="Success message" color={MESSAGE_COLOR.success} />
      <ActionBanner message="Warning message" color={MESSAGE_COLOR.warning} />
    </>
}`,...(p=(g=r.parameters)==null?void 0:g.docs)==null?void 0:p.source}}};var d,u,A;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
  title: 'Manager UI Kit/Components/ActionBanner',
  args: {
    ...Default.args,
    label: 'Click Me!',
    onClick: () => {}
  },
  component: ActionBanner
}`,...(A=(u=a.parameters)==null?void 0:u.docs)==null?void 0:A.source}}};var f,S,B;t.parameters={...t.parameters,docs:{...(f=t.parameters)==null?void 0:f.docs,source:{originalSource:`{
  title: 'Manager UI Kit/Components/ActionBanner',
  args: {
    ...Default.args,
    label: 'Click Me!',
    href: 'https://www.ovhcloud.com/'
  },
  component: ActionBanner
}`,...(B=(S=t.parameters)==null?void 0:S.docs)==null?void 0:B.source}}};const W=["Default","ActionBannerWithMessageVariants","ActionBannerWithButton","ActionBannerWithLink"];export{a as ActionBannerWithButton,t as ActionBannerWithLink,r as ActionBannerWithMessageVariants,o as Default,W as __namedExportsOrder,I as default};
