import{j as v}from"./jsx-runtime-BRNY0I4F.js";import{a as U}from"./ods-react236-aAAP9SXj.js";import{m as S}from"./lib-CWaID5dp-BJDNWG0v.js";import"./index-Bnop-kX6.js";import"./iframe-CUYazWvm.js";import"./index-4pTrEEYx.js";import"./index-C2BvAoka.js";const r={heading:"Example of modal",children:v.jsx("div",{children:"Example of content"})},s={primaryButton:{label:"Confirm",loading:!1,onClick:()=>"onPrimaryButtonClick",disabled:!1},secondaryButton:{label:"Cancel",loading:!1,onClick:()=>"onSecondaryButtonClick",disabled:!1},onOpenChange:()=>"onOpenChange"},_={type:"warning"},A={step:{current:1,total:3}},q={loading:!0},z={open:!0},d=({heading:R,type:D=U.neutral,loading:j,primaryButton:w,secondaryButton:F,onOpenChange:T,open:I=!0,children:K,step:P})=>v.jsx(S,{heading:R,type:D,loading:j,primaryButton:w,secondaryButton:F,onOpenChange:T,open:I,step:P,children:K}),n=d.bind({});n.parameters={controls:{include:["heading","children"]},docs:{source:{code:`<Modal
  heading="Example of modal"
  open={true}
>
  <div>Example of content</div>
</Modal>`}}};n.args=r;const e=d.bind({});e.parameters={controls:{include:["onOpenChange","primaryButton","secondaryButton"]},docs:{source:{code:`<Modal
  heading="Example of modal"
  open={true}
  primaryButton={{
    label: 'Confirm',
    onClick: () => {},
  }}
  secondaryButton={{
    label: 'Cancel',
    onClick: () => {},
  }}
  onOpenChange={() => {}}
>
  <div>Example of content</div>
</Modal>`}}};e.args={...r,...s};const o=d.bind({});o.parameters={controls:{include:["type"]},docs:{source:{code:`<Modal
  heading="Example of modal"
  type={MODAL_COLOR.warning}
  open={true}
  primaryButton={{
    label: 'Confirm',
    onClick: () => {},
  }}
  secondaryButton={{
    label: 'Cancel',
    onClick: () => {},
  }}
>
  <div>Example of content</div>
</Modal>`}}};o.args={...r,...s,..._};const a=d.bind({});a.parameters={controls:{include:["loading"]},docs:{source:{code:`<Modal
  heading="Example of modal"
  loading={true}
  open={true}
  primaryButton={{
    label: 'Confirm',
    onClick: () => {},
  }}
  secondaryButton={{
    label: 'Cancel',
    onClick: () => {},
  }}
>
  <div>Example of content</div>
</Modal>`}}};a.args={...r,...s,...q};const t=d.bind({});t.parameters={controls:{include:["step"]},docs:{source:{code:`<Modal
  heading="Example of modal"
  open={true}
  step={{
    current: 1,
    total: 3,
  }}
  primaryButton={{
    label: 'Confirm',
    onClick: () => {},
  }}
  secondaryButton={{
    label: 'Cancel',
    onClick: () => {},
  }}
>
  <div>Example of content</div>
</Modal>`}}};t.args={...r,...s,...A};const p=d.bind({});p.args={...r,..._,...s,...z,...A};const X={title:"Manager UI Kit/Components/Modal",component:S,tags:["autodocs"]};var i,l,c;n.parameters={...n.parameters,docs:{...(i=n.parameters)==null?void 0:i.docs,source:{originalSource:`({
  heading,
  type = MODAL_COLOR.neutral,
  loading,
  primaryButton,
  secondaryButton,
  onOpenChange,
  open = true,
  children,
  step
}) => {
  return <Modal heading={heading} type={type} loading={loading} primaryButton={primaryButton} secondaryButton={secondaryButton} onOpenChange={onOpenChange} open={open} step={step}>
      {children}
    </Modal>;
}`,...(c=(l=n.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};var u,m,g;e.parameters={...e.parameters,docs:{...(u=e.parameters)==null?void 0:u.docs,source:{originalSource:`({
  heading,
  type = MODAL_COLOR.neutral,
  loading,
  primaryButton,
  secondaryButton,
  onOpenChange,
  open = true,
  children,
  step
}) => {
  return <Modal heading={heading} type={type} loading={loading} primaryButton={primaryButton} secondaryButton={secondaryButton} onOpenChange={onOpenChange} open={open} step={step}>
      {children}
    </Modal>;
}`,...(g=(m=e.parameters)==null?void 0:m.docs)==null?void 0:g.source}}};var y,h,B;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`({
  heading,
  type = MODAL_COLOR.neutral,
  loading,
  primaryButton,
  secondaryButton,
  onOpenChange,
  open = true,
  children,
  step
}) => {
  return <Modal heading={heading} type={type} loading={loading} primaryButton={primaryButton} secondaryButton={secondaryButton} onOpenChange={onOpenChange} open={open} step={step}>
      {children}
    </Modal>;
}`,...(B=(h=o.parameters)==null?void 0:h.docs)==null?void 0:B.source}}};var C,O,M;a.parameters={...a.parameters,docs:{...(C=a.parameters)==null?void 0:C.docs,source:{originalSource:`({
  heading,
  type = MODAL_COLOR.neutral,
  loading,
  primaryButton,
  secondaryButton,
  onOpenChange,
  open = true,
  children,
  step
}) => {
  return <Modal heading={heading} type={type} loading={loading} primaryButton={primaryButton} secondaryButton={secondaryButton} onOpenChange={onOpenChange} open={open} step={step}>
      {children}
    </Modal>;
}`,...(M=(O=a.parameters)==null?void 0:O.docs)==null?void 0:M.source}}};var f,b,x;t.parameters={...t.parameters,docs:{...(f=t.parameters)==null?void 0:f.docs,source:{originalSource:`({
  heading,
  type = MODAL_COLOR.neutral,
  loading,
  primaryButton,
  secondaryButton,
  onOpenChange,
  open = true,
  children,
  step
}) => {
  return <Modal heading={heading} type={type} loading={loading} primaryButton={primaryButton} secondaryButton={secondaryButton} onOpenChange={onOpenChange} open={open} step={step}>
      {children}
    </Modal>;
}`,...(x=(b=t.parameters)==null?void 0:b.docs)==null?void 0:x.source}}};var L,E,k;p.parameters={...p.parameters,docs:{...(L=p.parameters)==null?void 0:L.docs,source:{originalSource:`({
  heading,
  type = MODAL_COLOR.neutral,
  loading,
  primaryButton,
  secondaryButton,
  onOpenChange,
  open = true,
  children,
  step
}) => {
  return <Modal heading={heading} type={type} loading={loading} primaryButton={primaryButton} secondaryButton={secondaryButton} onOpenChange={onOpenChange} open={open} step={step}>
      {children}
    </Modal>;
}`,...(k=(E=p.parameters)==null?void 0:E.docs)==null?void 0:k.source}}};const Y=["Basic","Actions","Type","Loading","Step","Full"];export{e as Actions,n as Basic,p as Full,a as Loading,t as Step,o as Type,Y as __namedExportsOrder,X as default};
