import{j as p}from"./jsx-runtime-BRNY0I4F.js";import{r as q}from"./index-Bnop-kX6.js";import{a as z}from"./Divider-THit99OS-Di1FabXz.js";import{u as _,N as G}from"./lib-D44cvI9Y-Bb2oAnDh.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./iframe-Bru3zJiY.js";import"./QueryClientProvider-BPX08D6Z.js";import"./with-selector-CbDTc_Tw.js";import"./index-4pTrEEYx.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./Link-BWQEuWpd-D0wspT2_.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./ComboboxControl-sJOkWHeT-8SVRT3vS.js";const r={heading:"Example of modal",children:p.jsx("div",{children:"Example of content"})},i={primaryButton:{label:"Confirm",loading:!1,onClick:()=>"onPrimaryButtonClick",disabled:!1},secondaryButton:{label:"Cancel",loading:!1,onClick:()=>"onSecondaryButtonClick",disabled:!1},onOpenChange:()=>"onOpenChange"},A={type:"warning"},R={step:{current:1,total:3}},H={loading:!0},J={open:!1},s=({heading:D,type:j=z.neutral,loading:F,primaryButton:T,secondaryButton:w,open:N=!1,children:K,step:P})=>{const[l,c]=q.useState(N),U=()=>{c(!l)};return p.jsxs(p.Fragment,{children:[p.jsx(G,{onClick:()=>c(!0),children:"Open Modal"}),p.jsx(_,{heading:D,type:j,loading:F,primaryButton:T,secondaryButton:w,onOpenChange:U,open:l,step:P,children:K})]})},n=s.bind({});n.parameters={argTypes:{open:{control:"boolean"}},controls:{include:["heading","children"]},docs:{source:{code:`<Modal
  heading="Example of modal"
  open={true}
>
  <div>Example of content</div>
</Modal>`}}};n.args=r;const e=s.bind({});e.parameters={controls:{include:["onOpenChange","primaryButton","secondaryButton"]},docs:{source:{code:`<Modal
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
</Modal>`}}};e.args={...r,...i};const o=s.bind({});o.parameters={controls:{include:["type"]},docs:{source:{code:`<Modal
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
</Modal>`}}};o.args={...r,...i,...A};const t=s.bind({});t.parameters={controls:{include:["loading"]},docs:{source:{code:`<Modal
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
</Modal>`}}};t.args={...r,...i,...H};const a=s.bind({});a.parameters={controls:{include:["step"]},docs:{source:{code:`<Modal
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
</Modal>`}}};a.args={...r,...i,...R};const d=s.bind({});d.args={...r,...A,...i,...J,...R};const sn={title:"Manager UI Kit/Components/Modal",component:_,tags:["autodocs"]};var u,m,g;n.parameters={...n.parameters,docs:{...(u=n.parameters)==null?void 0:u.docs,source:{originalSource:`({
  heading,
  type = MODAL_COLOR.neutral,
  loading,
  primaryButton,
  secondaryButton,
  open = false,
  children,
  step
}) => {
  const [isOpen, setIsOpen] = useState(open);
  const handleOpenChange = () => {
    setIsOpen(!isOpen);
  };
  return <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal heading={heading} type={type} loading={loading} primaryButton={primaryButton} secondaryButton={secondaryButton} onOpenChange={handleOpenChange} open={isOpen} step={step}>
        {children}
      </Modal>
    </>;
}`,...(g=(m=n.parameters)==null?void 0:m.docs)==null?void 0:g.source}}};var O,h,y;e.parameters={...e.parameters,docs:{...(O=e.parameters)==null?void 0:O.docs,source:{originalSource:`({
  heading,
  type = MODAL_COLOR.neutral,
  loading,
  primaryButton,
  secondaryButton,
  open = false,
  children,
  step
}) => {
  const [isOpen, setIsOpen] = useState(open);
  const handleOpenChange = () => {
    setIsOpen(!isOpen);
  };
  return <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal heading={heading} type={type} loading={loading} primaryButton={primaryButton} secondaryButton={secondaryButton} onOpenChange={handleOpenChange} open={isOpen} step={step}>
        {children}
      </Modal>
    </>;
}`,...(y=(h=e.parameters)==null?void 0:h.docs)==null?void 0:y.source}}};var B,C,M;o.parameters={...o.parameters,docs:{...(B=o.parameters)==null?void 0:B.docs,source:{originalSource:`({
  heading,
  type = MODAL_COLOR.neutral,
  loading,
  primaryButton,
  secondaryButton,
  open = false,
  children,
  step
}) => {
  const [isOpen, setIsOpen] = useState(open);
  const handleOpenChange = () => {
    setIsOpen(!isOpen);
  };
  return <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal heading={heading} type={type} loading={loading} primaryButton={primaryButton} secondaryButton={secondaryButton} onOpenChange={handleOpenChange} open={isOpen} step={step}>
        {children}
      </Modal>
    </>;
}`,...(M=(C=o.parameters)==null?void 0:C.docs)==null?void 0:M.source}}};var f,x,b;t.parameters={...t.parameters,docs:{...(f=t.parameters)==null?void 0:f.docs,source:{originalSource:`({
  heading,
  type = MODAL_COLOR.neutral,
  loading,
  primaryButton,
  secondaryButton,
  open = false,
  children,
  step
}) => {
  const [isOpen, setIsOpen] = useState(open);
  const handleOpenChange = () => {
    setIsOpen(!isOpen);
  };
  return <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal heading={heading} type={type} loading={loading} primaryButton={primaryButton} secondaryButton={secondaryButton} onOpenChange={handleOpenChange} open={isOpen} step={step}>
        {children}
      </Modal>
    </>;
}`,...(b=(x=t.parameters)==null?void 0:x.docs)==null?void 0:b.source}}};var I,k,S;a.parameters={...a.parameters,docs:{...(I=a.parameters)==null?void 0:I.docs,source:{originalSource:`({
  heading,
  type = MODAL_COLOR.neutral,
  loading,
  primaryButton,
  secondaryButton,
  open = false,
  children,
  step
}) => {
  const [isOpen, setIsOpen] = useState(open);
  const handleOpenChange = () => {
    setIsOpen(!isOpen);
  };
  return <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal heading={heading} type={type} loading={loading} primaryButton={primaryButton} secondaryButton={secondaryButton} onOpenChange={handleOpenChange} open={isOpen} step={step}>
        {children}
      </Modal>
    </>;
}`,...(S=(k=a.parameters)==null?void 0:k.docs)==null?void 0:S.source}}};var L,E,v;d.parameters={...d.parameters,docs:{...(L=d.parameters)==null?void 0:L.docs,source:{originalSource:`({
  heading,
  type = MODAL_COLOR.neutral,
  loading,
  primaryButton,
  secondaryButton,
  open = false,
  children,
  step
}) => {
  const [isOpen, setIsOpen] = useState(open);
  const handleOpenChange = () => {
    setIsOpen(!isOpen);
  };
  return <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal heading={heading} type={type} loading={loading} primaryButton={primaryButton} secondaryButton={secondaryButton} onOpenChange={handleOpenChange} open={isOpen} step={step}>
        {children}
      </Modal>
    </>;
}`,...(v=(E=d.parameters)==null?void 0:E.docs)==null?void 0:v.source}}};const pn=["Basic","Actions","Type","Loading","Step","Full"];export{e as Actions,n as Basic,d as Full,t as Loading,a as Step,o as Type,pn as __namedExportsOrder,sn as default};
