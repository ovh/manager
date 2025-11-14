import{j as v}from"./jsx-runtime-BRNY0I4F.js";import{a as U}from"./ods-react236-aAAP9SXj.js";import{o as S}from"./lib-3BNUHx3P-DQ0dZkTw.js";import"./index-Bnop-kX6.js";import"./iframe-D5tzyF_8.js";import"./QueryClientProvider-YWZt9LhG.js";import"./index-BvE2bIaB.js";import"./index-4pTrEEYx.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./Badge-YOwwmnsf-CJ8iv41_.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./PopoverTrigger-4w4N6iLp-C-LGD_7X.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-BAi52a_A-BVjZSJoF.js";import"./index-DB9CF8IY-DC0Y2KvY.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./Card-D5fMAkqX-3SHynhw3.js";import"./Skeleton-tM01pV-R-CR0rfR_T.js";import"./Input-DcqcPYne-DrbRSC9d.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./Divider-THit99OS-DE11lmva.js";import"./Table-DeFepqjL-yMJhEyPY.js";import"./CheckboxLabel-BNqUGOsg-n6RGKdXc.js";import"./use-field-context-C3OOq-03-DvM5qnyl.js";import"./Tag-B7nBeuPX-CPCfmWrN.js";import"./SelectControl-C7d9WPuE-Bxj24dHo.js";import"./index-_7D5ljJ2-LyAubAEn.js";import"./ClipboardTrigger-TeqCWvgk-PkhT1oq0.js";import"./ModalTrigger-tZKHx0Fx-Dgqcdxhl.js";import"./dialog-trigger-DhWI7POy-2Tl6aad4.js";import"./render-strategy-BVcZ76SI-DDawKQXU.js";import"./TabContent-fruP9qhA-B5VnEOA-.js";import"./MessageIcon-yhpEHWAg-BtZxEFo4.js";import"./BreadcrumbItem-elPaHQlb-CNpnNsvr.js";import"./DrawerTrigger-omPTo2Bn-DB5oJcOC.js";import"./DatepickerControl-4VwQb-ep-Ct4shRTG.js";import"./ComboboxControl-sJOkWHeT-CC0kWNMj.js";import"./index-D_fe-3SC-C5ZKsUXO.js";const a={heading:"Example of modal",children:v.jsx("div",{children:"Example of content"})},d={primaryButton:{label:"Confirm",loading:!1,onClick:()=>"onPrimaryButtonClick",disabled:!1},secondaryButton:{label:"Cancel",loading:!1,onClick:()=>"onSecondaryButtonClick",disabled:!1},onOpenChange:()=>"onOpenChange"},_={type:"warning"},A={step:{current:1,total:3}},q={loading:!0},z={open:!0},p=({heading:R,type:D=U.neutral,loading:j,primaryButton:w,secondaryButton:F,onOpenChange:T,open:I=!0,children:K,step:P})=>v.jsx(S,{heading:R,type:D,loading:j,primaryButton:w,secondaryButton:F,onOpenChange:T,open:I,step:P,children:K}),n=p.bind({});n.parameters={controls:{include:["heading","children"]},docs:{source:{code:`<Modal
  heading="Example of modal"
  open={true}
>
  <div>Example of content</div>
</Modal>`}}};n.args=a;const o=p.bind({});o.parameters={controls:{include:["onOpenChange","primaryButton","secondaryButton"]},docs:{source:{code:`<Modal
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
</Modal>`}}};o.args={...a,...d};const e=p.bind({});e.parameters={controls:{include:["type"]},docs:{source:{code:`<Modal
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
</Modal>`}}};e.args={...a,...d,..._};const t=p.bind({});t.parameters={controls:{include:["loading"]},docs:{source:{code:`<Modal
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
</Modal>`}}};t.args={...a,...d,...q};const r=p.bind({});r.parameters={controls:{include:["step"]},docs:{source:{code:`<Modal
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
</Modal>`}}};r.args={...a,...d,...A};const i=p.bind({});i.args={...a,..._,...d,...z,...A};const qn={title:"Manager UI Kit/Components/Modal",component:S,tags:["autodocs"]};var s,l,c;n.parameters={...n.parameters,docs:{...(s=n.parameters)==null?void 0:s.docs,source:{originalSource:`({
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
}`,...(c=(l=n.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};var m,u,g;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`({
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
}`,...(g=(u=o.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var y,h,B;e.parameters={...e.parameters,docs:{...(y=e.parameters)==null?void 0:y.docs,source:{originalSource:`({
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
}`,...(B=(h=e.parameters)==null?void 0:h.docs)==null?void 0:B.source}}};var C,O,M;t.parameters={...t.parameters,docs:{...(C=t.parameters)==null?void 0:C.docs,source:{originalSource:`({
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
}`,...(M=(O=t.parameters)==null?void 0:O.docs)==null?void 0:M.source}}};var f,b,x;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`({
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
}`,...(x=(b=r.parameters)==null?void 0:b.docs)==null?void 0:x.source}}};var L,E,k;i.parameters={...i.parameters,docs:{...(L=i.parameters)==null?void 0:L.docs,source:{originalSource:`({
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
}`,...(k=(E=i.parameters)==null?void 0:E.docs)==null?void 0:k.source}}};const zn=["Basic","Actions","Type","Loading","Step","Full"];export{o as Actions,n as Basic,i as Full,t as Loading,r as Step,e as Type,zn as __namedExportsOrder,qn as default};
