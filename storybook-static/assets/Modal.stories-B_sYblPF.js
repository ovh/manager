import{j as n}from"./jsx-runtime-BRNY0I4F.js";import{j as L,g as G,b as H,O as h,f as _}from"./index-C7RZ_VRQ.js";import{e as J}from"./index-Bnop-kX6.js";import{p as K,O as Q,e as W,c as M}from"./index-vm89uYmh.js";import"./index-4pTrEEYx.js";const Y=a=>a===L.critical?_.critical:_.primary,b=J.forwardRef(({heading:a,type:l=L.information,isLoading:c,primaryLabel:u,isPrimaryButtonLoading:S,isPrimaryButtonDisabled:y,onPrimaryButtonClick:D,secondaryLabel:m,isSecondaryButtonDisabled:p,isSecondaryButtonLoading:f,onSecondaryButtonClick:O,onDismiss:B,isOpen:P=!0,children:C},Z)=>{const k=Y(l);return n.jsxs(K,{"data-testid":"modal",color:L[l],isDismissible:!!B,className:"text-left",onOdsClose:B,isOpen:P,ref:Z,children:[a&&n.jsx(Q,{className:"mb-4",preset:G.heading4,children:a}),c&&n.jsx("div",{"data-testid":"spinner",className:"flex justify-center my-5",children:n.jsx(W,{size:H.md,"inline-block":!0})}),!c&&n.jsxs(n.Fragment,{children:[n.jsx("div",{className:"flex text-left",children:C}),m&&n.jsx(M,{"data-testid":"secondary-button",slot:"actions",color:k,onClick:p?null:O,isDisabled:p,isLoading:f,variant:h.ghost,label:m,className:"mt-4",type:"button"}),u&&n.jsx(M,{"data-testid":"primary-button",slot:"actions",color:k,onClick:y?null:D,isDisabled:y,isLoading:S,variant:h.default,label:u,className:"mt-4",type:"button"})]})]})});try{b.displayName="Modal",b.__docgenInfo={description:"",displayName:"Modal",props:{heading:{defaultValue:null,description:"Title of modal",name:"heading",required:!1,type:{name:"string"}},type:{defaultValue:{value:"ODS_MODAL_COLOR.information"},description:"Type of modal. It can be any of `ODS_MODAL_COLOR`",name:"type",required:!1,type:{name:"enum",value:[{value:'"critical"'},{value:'"information"'},{value:'"neutral"'},{value:'"success"'},{value:'"warning"'}]}},isLoading:{defaultValue:null,description:"Is loading state for display a spinner",name:"isLoading",required:!1,type:{name:"boolean"}},primaryLabel:{defaultValue:null,description:"Label of primary button",name:"primaryLabel",required:!1,type:{name:"string"}},isPrimaryButtonLoading:{defaultValue:null,description:"Is loading state for primary button",name:"isPrimaryButtonLoading",required:!1,type:{name:"boolean"}},isPrimaryButtonDisabled:{defaultValue:null,description:"Is disabled state for primary button",name:"isPrimaryButtonDisabled",required:!1,type:{name:"boolean"}},onPrimaryButtonClick:{defaultValue:null,description:"Action of primary button",name:"onPrimaryButtonClick",required:!1,type:{name:"() => void"}},secondaryLabel:{defaultValue:null,description:"Label of secondary button",name:"secondaryLabel",required:!1,type:{name:"string"}},isSecondaryButtonDisabled:{defaultValue:null,description:"Is loading state for secondary button",name:"isSecondaryButtonDisabled",required:!1,type:{name:"boolean"}},isSecondaryButtonLoading:{defaultValue:null,description:"Is loading state for secondary button",name:"isSecondaryButtonLoading",required:!1,type:{name:"boolean"}},onSecondaryButtonClick:{defaultValue:null,description:"Is disabled state for secondary button",name:"onSecondaryButtonClick",required:!1,type:{name:"() => void"}},onDismiss:{defaultValue:null,description:"Is dismissible action",name:"onDismiss",required:!1,type:{name:"() => void"}},isOpen:{defaultValue:{value:"true"},description:"Is modal open state",name:"isOpen",required:!1,type:{name:"boolean"}},children:{defaultValue:null,description:"Children of modal",name:"children",required:!1,type:{name:"ReactNode"}}}}}catch{}const s={heading:"Example of modal",children:n.jsx("div",{children:"Example of content"})},g={primaryLabel:"Confirm",isPrimaryButtonLoading:!1,isPrimaryButtonDisabled:!1,onPrimaryButtonClick:()=>"onPrimaryButtonClick",secondaryLabel:"Cancel",isSecondaryButtonDisabled:!1,isSecondaryButtonLoading:!1,onSecondaryButtonClick:()=>"onSecondaryButtonClick",onDismiss:()=>"onDismiss"},X={type:"warning"},$={isLoading:!0},nn={isOpen:!0},d=({heading:a,type:l=L.neutral,isLoading:c,primaryLabel:u,isPrimaryButtonLoading:S,isPrimaryButtonDisabled:y,onPrimaryButtonClick:D,secondaryLabel:m,isSecondaryButtonDisabled:p,isSecondaryButtonLoading:f,onSecondaryButtonClick:O,onDismiss:B,isOpen:P=!0,children:C})=>n.jsx(b,{heading:a,type:l,isLoading:c,primaryLabel:u,isPrimaryButtonLoading:S,isPrimaryButtonDisabled:y,onPrimaryButtonClick:D,secondaryLabel:m,isSecondaryButtonDisabled:p,isSecondaryButtonLoading:f,onSecondaryButtonClick:O,onDismiss:B,isOpen:P,children:C}),i=d.bind({});i.parameters={controls:{include:["heading","children"]}};i.args=s;const e=d.bind({});e.parameters={controls:{include:["onDismiss","primaryLabel","isPrimaryButtonLoading","isPrimaryButtonDisabled","onPrimaryButtonClick","secondaryLabel","isSecondaryButtonDisabled","isSecondaryButtonLoading","onSecondaryButtonClick"]}};e.args={...s,...g};const o=d.bind({});o.parameters={controls:{include:["type"]}};o.args={...s,...g,...X};const t=d.bind({});t.parameters={controls:{include:["isLoading"]}};t.args={...s,...g,...$};const r=d.bind({});r.args={...s,...X,...g,...nn};const sn={title:"components/Modal",component:b};var x,v,R;i.parameters={...i.parameters,docs:{...(x=i.parameters)==null?void 0:x.docs,source:{originalSource:`({
  heading,
  type = ODS_MODAL_COLOR.neutral,
  isLoading,
  primaryLabel,
  isPrimaryButtonLoading,
  isPrimaryButtonDisabled,
  onPrimaryButtonClick,
  secondaryLabel,
  isSecondaryButtonDisabled,
  isSecondaryButtonLoading,
  onSecondaryButtonClick,
  onDismiss,
  isOpen = true,
  children
}) => {
  return <Modal heading={heading} type={type} isLoading={isLoading} primaryLabel={primaryLabel} isPrimaryButtonLoading={isPrimaryButtonLoading} isPrimaryButtonDisabled={isPrimaryButtonDisabled} onPrimaryButtonClick={onPrimaryButtonClick} secondaryLabel={secondaryLabel} isSecondaryButtonDisabled={isSecondaryButtonDisabled} isSecondaryButtonLoading={isSecondaryButtonLoading} onSecondaryButtonClick={onSecondaryButtonClick} onDismiss={onDismiss} isOpen={isOpen}>
      {children}
    </Modal>;
}`,...(R=(v=i.parameters)==null?void 0:v.docs)==null?void 0:R.source}}};var V,j,q;e.parameters={...e.parameters,docs:{...(V=e.parameters)==null?void 0:V.docs,source:{originalSource:`({
  heading,
  type = ODS_MODAL_COLOR.neutral,
  isLoading,
  primaryLabel,
  isPrimaryButtonLoading,
  isPrimaryButtonDisabled,
  onPrimaryButtonClick,
  secondaryLabel,
  isSecondaryButtonDisabled,
  isSecondaryButtonLoading,
  onSecondaryButtonClick,
  onDismiss,
  isOpen = true,
  children
}) => {
  return <Modal heading={heading} type={type} isLoading={isLoading} primaryLabel={primaryLabel} isPrimaryButtonLoading={isPrimaryButtonLoading} isPrimaryButtonDisabled={isPrimaryButtonDisabled} onPrimaryButtonClick={onPrimaryButtonClick} secondaryLabel={secondaryLabel} isSecondaryButtonDisabled={isSecondaryButtonDisabled} isSecondaryButtonLoading={isSecondaryButtonLoading} onSecondaryButtonClick={onSecondaryButtonClick} onDismiss={onDismiss} isOpen={isOpen}>
      {children}
    </Modal>;
}`,...(q=(j=e.parameters)==null?void 0:j.docs)==null?void 0:q.source}}};var N,A,I;o.parameters={...o.parameters,docs:{...(N=o.parameters)==null?void 0:N.docs,source:{originalSource:`({
  heading,
  type = ODS_MODAL_COLOR.neutral,
  isLoading,
  primaryLabel,
  isPrimaryButtonLoading,
  isPrimaryButtonDisabled,
  onPrimaryButtonClick,
  secondaryLabel,
  isSecondaryButtonDisabled,
  isSecondaryButtonLoading,
  onSecondaryButtonClick,
  onDismiss,
  isOpen = true,
  children
}) => {
  return <Modal heading={heading} type={type} isLoading={isLoading} primaryLabel={primaryLabel} isPrimaryButtonLoading={isPrimaryButtonLoading} isPrimaryButtonDisabled={isPrimaryButtonDisabled} onPrimaryButtonClick={onPrimaryButtonClick} secondaryLabel={secondaryLabel} isSecondaryButtonDisabled={isSecondaryButtonDisabled} isSecondaryButtonLoading={isSecondaryButtonLoading} onSecondaryButtonClick={onSecondaryButtonClick} onDismiss={onDismiss} isOpen={isOpen}>
      {children}
    </Modal>;
}`,...(I=(A=o.parameters)==null?void 0:A.docs)==null?void 0:I.source}}};var T,E,w;t.parameters={...t.parameters,docs:{...(T=t.parameters)==null?void 0:T.docs,source:{originalSource:`({
  heading,
  type = ODS_MODAL_COLOR.neutral,
  isLoading,
  primaryLabel,
  isPrimaryButtonLoading,
  isPrimaryButtonDisabled,
  onPrimaryButtonClick,
  secondaryLabel,
  isSecondaryButtonDisabled,
  isSecondaryButtonLoading,
  onSecondaryButtonClick,
  onDismiss,
  isOpen = true,
  children
}) => {
  return <Modal heading={heading} type={type} isLoading={isLoading} primaryLabel={primaryLabel} isPrimaryButtonLoading={isPrimaryButtonLoading} isPrimaryButtonDisabled={isPrimaryButtonDisabled} onPrimaryButtonClick={onPrimaryButtonClick} secondaryLabel={secondaryLabel} isSecondaryButtonDisabled={isSecondaryButtonDisabled} isSecondaryButtonLoading={isSecondaryButtonLoading} onSecondaryButtonClick={onSecondaryButtonClick} onDismiss={onDismiss} isOpen={isOpen}>
      {children}
    </Modal>;
}`,...(w=(E=t.parameters)==null?void 0:E.docs)==null?void 0:w.source}}};var F,U,z;r.parameters={...r.parameters,docs:{...(F=r.parameters)==null?void 0:F.docs,source:{originalSource:`({
  heading,
  type = ODS_MODAL_COLOR.neutral,
  isLoading,
  primaryLabel,
  isPrimaryButtonLoading,
  isPrimaryButtonDisabled,
  onPrimaryButtonClick,
  secondaryLabel,
  isSecondaryButtonDisabled,
  isSecondaryButtonLoading,
  onSecondaryButtonClick,
  onDismiss,
  isOpen = true,
  children
}) => {
  return <Modal heading={heading} type={type} isLoading={isLoading} primaryLabel={primaryLabel} isPrimaryButtonLoading={isPrimaryButtonLoading} isPrimaryButtonDisabled={isPrimaryButtonDisabled} onPrimaryButtonClick={onPrimaryButtonClick} secondaryLabel={secondaryLabel} isSecondaryButtonDisabled={isSecondaryButtonDisabled} isSecondaryButtonLoading={isSecondaryButtonLoading} onSecondaryButtonClick={onSecondaryButtonClick} onDismiss={onDismiss} isOpen={isOpen}>
      {children}
    </Modal>;
}`,...(z=(U=r.parameters)==null?void 0:U.docs)==null?void 0:z.source}}};const dn=["Basic","Actions","Type","Loading","Full"];export{e as Actions,i as Basic,r as Full,t as Loading,o as Type,dn as __namedExportsOrder,sn as default};
