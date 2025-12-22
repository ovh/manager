import{j as s}from"./jsx-runtime-BRNY0I4F.js";import{r as U}from"./index-Bnop-kX6.js";import{a as q}from"./ods-react236-aAAP9SXj.js";import{H as _,D as z}from"./lib-BnpaaP8W-DiimR21H.js";import"./iframe-CveYUpa2.js";import"./QueryClientProvider-BPX08D6Z.js";import"./index-DnqQo6oJ.js";import"./index-4pTrEEYx.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./Badge-YOwwmnsf-CJ8iv41_.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./PopoverTrigger-4w4N6iLp-C-LGD_7X.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-BAi52a_A-BVjZSJoF.js";import"./index-DB9CF8IY-DC0Y2KvY.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./Card-D5fMAkqX-3SHynhw3.js";import"./Skeleton-tM01pV-R-CR0rfR_T.js";import"./Input-DcqcPYne-DrbRSC9d.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./Divider-THit99OS-DE11lmva.js";import"./Table-DeFepqjL-ijVQdBcH.js";import"./CheckboxLabel-BNqUGOsg-n6RGKdXc.js";import"./use-field-context-C3OOq-03-DvM5qnyl.js";import"./Tag-B7nBeuPX-CPCfmWrN.js";import"./SelectControl-C7d9WPuE-Bxj24dHo.js";import"./index-_7D5ljJ2-LyAubAEn.js";import"./ClipboardTrigger-TeqCWvgk-PkhT1oq0.js";import"./ModalTrigger-tZKHx0Fx-Dgqcdxhl.js";import"./dialog-trigger-DhWI7POy-2Tl6aad4.js";import"./render-strategy-BVcZ76SI-DDawKQXU.js";import"./TabContent-fruP9qhA-B5VnEOA-.js";import"./MessageIcon-yhpEHWAg-BtZxEFo4.js";import"./BreadcrumbItem-elPaHQlb-CNpnNsvr.js";import"./DrawerTrigger-omPTo2Bn-DB5oJcOC.js";import"./DatepickerControl-4VwQb-ep-Ct4shRTG.js";import"./ComboboxControl-sJOkWHeT-CC0kWNMj.js";import"./index-D_fe-3SC-C5ZKsUXO.js";const r={heading:"Example of modal",children:s.jsx("div",{children:"Example of content"})},d={primaryButton:{label:"Confirm",loading:!1,onClick:()=>"onPrimaryButtonClick",disabled:!1},secondaryButton:{label:"Cancel",loading:!1,onClick:()=>"onSecondaryButtonClick",disabled:!1},onOpenChange:()=>"onOpenChange"},A={type:"warning"},D={step:{current:1,total:3}},G={loading:!0},J={open:!1},p=({heading:R,type:j=q.neutral,loading:F,primaryButton:T,secondaryButton:w,open:H=!1,children:K,step:N})=>{const[l,c]=U.useState(H),P=()=>{c(!l)};return s.jsxs(s.Fragment,{children:[s.jsx(z,{onClick:()=>c(!0),children:"Open Modal"}),s.jsx(_,{heading:R,type:j,loading:F,primaryButton:T,secondaryButton:w,onOpenChange:P,open:l,step:N,children:K})]})},n=p.bind({});n.parameters={argTypes:{open:{control:"boolean"}},controls:{include:["heading","children"]},docs:{source:{code:`<Modal
  heading="Example of modal"
  open={true}
>
  <div>Example of content</div>
</Modal>`}}};n.args=r;const e=p.bind({});e.parameters={controls:{include:["onOpenChange","primaryButton","secondaryButton"]},docs:{source:{code:`<Modal
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
</Modal>`}}};e.args={...r,...d};const o=p.bind({});o.parameters={controls:{include:["type"]},docs:{source:{code:`<Modal
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
</Modal>`}}};o.args={...r,...d,...A};const t=p.bind({});t.parameters={controls:{include:["loading"]},docs:{source:{code:`<Modal
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
</Modal>`}}};t.args={...r,...d,...G};const a=p.bind({});a.parameters={controls:{include:["step"]},docs:{source:{code:`<Modal
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
</Modal>`}}};a.args={...r,...d,...D};const i=p.bind({});i.args={...r,...A,...d,...J,...D};const Gn={title:"Manager UI Kit/Components/Modal",component:_,tags:["autodocs"]};var m,u,g;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`({
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
}`,...(g=(u=n.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var O,h,y;e.parameters={...e.parameters,docs:{...(O=e.parameters)==null?void 0:O.docs,source:{originalSource:`({
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
}`,...(S=(k=a.parameters)==null?void 0:k.docs)==null?void 0:S.source}}};var L,E,v;i.parameters={...i.parameters,docs:{...(L=i.parameters)==null?void 0:L.docs,source:{originalSource:`({
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
}`,...(v=(E=i.parameters)==null?void 0:E.docs)==null?void 0:v.source}}};const Jn=["Basic","Actions","Type","Loading","Step","Full"];export{e as Actions,n as Basic,i as Full,t as Loading,a as Step,o as Type,Jn as __namedExportsOrder,Gn as default};
