import{j as p}from"./jsx-runtime-BRNY0I4F.js";import{r as U}from"./index-Bnop-kX6.js";import{x as _,z as q,Y as G}from"./lib-7WI39Bnb-B8YmdMzd.js";import"./iframe-COCNz2cq.js";import"./QueryClientProvider-BPX08D6Z.js";import"./index-DnqQo6oJ.js";import"./index-4pTrEEYx.js";import"./Icon-xxQ9IRzi-ORI6lMWl.js";import"./index-CWkFp9WS-BSIT86NH.js";import"./Link-TMoA1i18-DiBAU0SL.js";import"./Text-BGoUCJU7-BjFZdlzU.js";import"./ComboboxControl-EYkaEIlI-CWYTos8A.js";import"./Divider-wQyo85oE-5vlIiwia.js";const r={heading:"Example of modal",children:p.jsx("div",{children:"Example of content"})},d={primaryButton:{label:"Confirm",loading:!1,onClick:()=>"onPrimaryButtonClick",disabled:!1},secondaryButton:{label:"Cancel",loading:!1,onClick:()=>"onSecondaryButtonClick",disabled:!1},onOpenChange:()=>"onOpenChange"},A={type:"warning"},L={step:{current:1,total:3}},H={loading:!0},J={open:!1},s=({heading:Y,type:P=G.information,loading:D,primaryButton:j,secondaryButton:F,open:z=!1,children:w,step:K})=>{const[l,c]=U.useState(z),R=()=>{c(!l)};return p.jsxs(p.Fragment,{children:[p.jsx(q,{onClick:()=>c(!0),children:"Open Modal"}),p.jsx(_,{heading:Y,type:P,loading:D,primaryButton:j,secondaryButton:F,onOpenChange:R,open:l,step:K,children:w})]})},n=s.bind({});n.parameters={argTypes:{open:{control:"boolean"}},controls:{include:["heading","children"]},docs:{source:{code:`<Modal
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
</Modal>`}}};e.args={...r,...d};const o=s.bind({});o.parameters={controls:{include:["type"]},docs:{source:{code:`<Modal
  heading="Example of modal"
  type={MODAL_TYPE.critical}
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
</Modal>`}}};o.args={...r,...d,...A};const t=s.bind({});t.parameters={controls:{include:["loading"]},docs:{source:{code:`<Modal
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
</Modal>`}}};t.args={...r,...d,...H};const a=s.bind({});a.parameters={controls:{include:["step"]},docs:{source:{code:`<Modal
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
</Modal>`}}};a.args={...r,...d,...L};const i=s.bind({});i.args={...r,...A,...d,...J,...L};const sn={title:"Manager UI Kit/Components/Modal",component:_,tags:["autodocs"]};var u,m,g;n.parameters={...n.parameters,docs:{...(u=n.parameters)==null?void 0:u.docs,source:{originalSource:`({
  heading,
  type = MODAL_TYPE.information,
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
}`,...(g=(m=n.parameters)==null?void 0:m.docs)==null?void 0:g.source}}};var h,O,y;e.parameters={...e.parameters,docs:{...(h=e.parameters)==null?void 0:h.docs,source:{originalSource:`({
  heading,
  type = MODAL_TYPE.information,
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
}`,...(y=(O=e.parameters)==null?void 0:O.docs)==null?void 0:y.source}}};var B,C,M;o.parameters={...o.parameters,docs:{...(B=o.parameters)==null?void 0:B.docs,source:{originalSource:`({
  heading,
  type = MODAL_TYPE.information,
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
}`,...(M=(C=o.parameters)==null?void 0:C.docs)==null?void 0:M.source}}};var f,x,E;t.parameters={...t.parameters,docs:{...(f=t.parameters)==null?void 0:f.docs,source:{originalSource:`({
  heading,
  type = MODAL_TYPE.information,
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
}`,...(E=(x=t.parameters)==null?void 0:x.docs)==null?void 0:E.source}}};var b,I,k;a.parameters={...a.parameters,docs:{...(b=a.parameters)==null?void 0:b.docs,source:{originalSource:`({
  heading,
  type = MODAL_TYPE.information,
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
}`,...(k=(I=a.parameters)==null?void 0:I.docs)==null?void 0:k.source}}};var S,v,T;i.parameters={...i.parameters,docs:{...(S=i.parameters)==null?void 0:S.docs,source:{originalSource:`({
  heading,
  type = MODAL_TYPE.information,
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
}`,...(T=(v=i.parameters)==null?void 0:v.docs)==null?void 0:T.source}}};const pn=["Basic","Actions","Type","Loading","Step","Full"];export{e as Actions,n as Basic,i as Full,t as Loading,a as Step,o as Type,pn as __namedExportsOrder,sn as default};
