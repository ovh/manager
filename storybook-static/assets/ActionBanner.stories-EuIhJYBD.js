import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{a as n}from"./ods-react236-aAAP9SXj.js";import{t as C}from"./ods-react78-B8-_EgR8.js";import{v as s}from"./lib-Bpiw0_2K-CzLxCNwi.js";import"./index-Bnop-kX6.js";import"./iframe-BMOkqioy.js";import"./index-4pTrEEYx.js";import"./index-f6p-lzcj.js";const o={args:{message:"This is a test message. <strong>This message is in bold.</strong>",variant:C.default,color:n.information,dismissible:!0},parameters:{docs:{source:{code:`<ActionBanner
  message="This is a test message. <strong>This message is in bold.</strong>"
  color={MESSAGE_COLOR.information}
  dismissible={true}
/>`}}}},R={title:"Manager UI Kit/Components/Action Banner",component:s,tags:["autodocs"]},a={decorators:[h=>e.jsx("div",{style:{display:"inline-flex",flexFlow:"column",gap:"8px"},children:h()})],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(s,{message:"Critical message",color:n.critical}),e.jsx(s,{message:"Danger message",color:n.danger}),e.jsx(s,{message:"Information message",color:n.information}),e.jsx(s,{message:"Success message",color:n.success}),e.jsx(s,{message:"Warning message",color:n.warning})]})},r={title:"Manager UI Kit/Components/ActionBanner",args:{...o.args,label:"Click Me!",onClick:()=>{}},component:s},t={title:"Manager UI Kit/Components/ActionBanner",args:{...o.args,label:"Click Me!",href:"https://www.ovhcloud.com/"},component:s};var i,c,m;o.parameters={...o.parameters,docs:{...(i=o.parameters)==null?void 0:i.docs,source:{originalSource:`{
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
}`,...(m=(c=o.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var l,g,p;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(p=(g=a.parameters)==null?void 0:g.docs)==null?void 0:p.source}}};var d,u,A;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  title: 'Manager UI Kit/Components/ActionBanner',
  args: {
    ...Default.args,
    label: 'Click Me!',
    onClick: () => {}
  },
  component: ActionBanner
}`,...(A=(u=r.parameters)==null?void 0:u.docs)==null?void 0:A.source}}};var f,S,B;t.parameters={...t.parameters,docs:{...(f=t.parameters)==null?void 0:f.docs,source:{originalSource:`{
  title: 'Manager UI Kit/Components/ActionBanner',
  args: {
    ...Default.args,
    label: 'Click Me!',
    href: 'https://www.ovhcloud.com/'
  },
  component: ActionBanner
}`,...(B=(S=t.parameters)==null?void 0:S.docs)==null?void 0:B.source}}};const j=["Default","ActionBannerWithMessageVariants","ActionBannerWithButton","ActionBannerWithLink"];export{r as ActionBannerWithButton,t as ActionBannerWithLink,a as ActionBannerWithMessageVariants,o as Default,j as __namedExportsOrder,R as default};
