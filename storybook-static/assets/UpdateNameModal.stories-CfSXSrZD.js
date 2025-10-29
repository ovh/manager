import{j as u}from"./jsx-runtime-BRNY0I4F.js";import{r as f}from"./index-Bnop-kX6.js";import{W as r}from"./lib-Dk32xhqR-BnP8dUtW.js";import"./iframe-IyM3Vz8H.js";import"./index-4pTrEEYx.js";import"./index-GPs4uoxI.js";const e=a=>{const[o,s]=f.useState(!0),n=()=>{s(!1)};return u.jsx(r,{...a,isOpen:o,onClose:n})};e.parameters={docs:{source:{code:`<UpdateNameModal 
  isOpen={isOpen}
  onClose={handleClose}
  updateDisplayName={(name) => console.log('updateDisplayName', name)}
  headline="Update Resource Name"
  description="Do you really want to update the display name of this resource?"
  inputLabel="New display name"
  defaultValue="oldDisplayName"
  cancelButtonLabel="Cancel"
  confirmButtonLabel="Confirm"
/>`}}};const t=a=>{const[o,s]=f.useState(!0),n=()=>{s(!1)};return u.jsx(r,{...a,isOpen:o,onClose:n,error:"Message error update name"})},M={title:"Manager UI Kit/Components/Update Name Modal",component:r,tags:["autodocs"],argTypes:{isLoading:{control:"boolean"},error:{control:"text"},headline:{control:"text"},description:{control:"text"},inputLabel:{control:"text"},defaultValue:{control:"text"},cancelButtonLabel:{control:"text"},confirmButtonLabel:{control:"text"},pattern:{control:"text"},patternMessage:{control:"text"},isOpen:{control:"text"}},args:{isOpen:!0,onClose:()=>{},updateDisplayName:()=>{},headline:"headline",description:"Do you really want to update the display name of this resource ?",inputLabel:"New display name",isLoading:!1,defaultValue:"oldDisplayName",cancelButtonLabel:"Cancel",confirmButtonLabel:"Confirm",error:"",pattern:"^[a-zA-Z0-9-_s]*$",patternMessage:"put your pattern message here"}};var l,p,d;e.parameters={...e.parameters,docs:{...(l=e.parameters)==null?void 0:l.docs,source:{originalSource:`(props: UpdateNameModalProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = () => {
    setIsOpen(false);
  };
  return <UpdateNameModalComponent {...props} isOpen={isOpen} onClose={handleClose} />;
}`,...(d=(p=e.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var i,c,m;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`(props: UpdateNameModalProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = () => {
    setIsOpen(false);
  };
  return <UpdateNameModalComponent {...props} isOpen={isOpen} onClose={handleClose} error="Message error update name" />;
}`,...(m=(c=t.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};const g=["UpdateNameModalDefault","UpdateNameModalWithError"];export{e as UpdateNameModalDefault,t as UpdateNameModalWithError,g as __namedExportsOrder,M as default};
