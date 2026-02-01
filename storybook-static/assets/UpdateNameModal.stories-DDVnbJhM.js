import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{r as p}from"./index-Bnop-kX6.js";import{N as h,k as l}from"./lib-D44cvI9Y-CkpjrNOq.js";import"./iframe-B25DnDzc.js";import"./QueryClientProvider-BPX08D6Z.js";import"./with-selector-CbDTc_Tw.js";import"./index-4pTrEEYx.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-B5_veLQO.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./ComboboxControl-sJOkWHeT-DJbuE-Pm.js";import"./ods-react236-aAAP9SXj.js";import"./MessageIcon-yhpEHWAg-CXHPnT2G.js";import"./Divider-THit99OS-BLm7oKDW.js";const s=a=>{const[n,t]=p.useState(a.isOpen),o=p.useCallback(()=>{t(!n)},[n]);return e.jsxs(e.Fragment,{children:[e.jsx(h,{onClick:()=>t(!0),children:"Open Modal"}),e.jsx(l,{...a,isOpen:n,onClose:o,onOpenChange:o})]})};s.parameters={args:{isOpen:!1},argTypes:{isOpen:{control:"boolean"}},docs:{source:{code:`<UpdateNameModal 
  isOpen={isOpen}
  onClose={handleClose}
  updateDisplayName={(name) => console.log('updateDisplayName', name)}
  headline="Update Resource Name"
  description="Do you really want to update the display name of this resource?"
  inputLabel="New display name"
  defaultValue="oldDisplayName"
  cancelButtonLabel="Cancel"
  confirmButtonLabel="Confirm"
/>`}}};const r=a=>{const[n,t]=p.useState(a.isOpen),o=p.useCallback(()=>{t(!n)},[n]);return e.jsxs(e.Fragment,{children:[e.jsx(h,{onClick:()=>t(!0),children:"Open Modal"}),e.jsx(l,{...a,isOpen:n,onClose:o,onOpenChange:o,error:"Message error update name"})]})},w={title:"Manager UI Kit/Components/Update Name Modal",component:l,tags:["autodocs"],argTypes:{isLoading:{control:"boolean"},error:{control:"text"},headline:{control:"text"},description:{control:"text"},inputLabel:{control:"text"},defaultValue:{control:"text"},cancelButtonLabel:{control:"text"},confirmButtonLabel:{control:"text"},pattern:{control:"text"},patternMessage:{control:"text"},isOpen:{control:"text"}},args:{isOpen:!1,onClose:()=>{},updateDisplayName:()=>{},headline:"headline",description:"Do you really want to update the display name of this resource ?",inputLabel:"New display name",isLoading:!1,defaultValue:"oldDisplayName",cancelButtonLabel:"Cancel",confirmButtonLabel:"Confirm",error:"",pattern:"^[a-zA-Z0-9-_s]*$",patternMessage:"put your pattern message here"}};var i,d,c;s.parameters={...s.parameters,docs:{...(i=s.parameters)==null?void 0:i.docs,source:{originalSource:`(props: UpdateNameModalProps) => {
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const handleOpenChange = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  return <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <UpdateNameModalComponent {...props} isOpen={isOpen} onClose={handleOpenChange} onOpenChange={handleOpenChange} />
    </>;
}`,...(c=(d=s.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};var m,u,O;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`(props: UpdateNameModalProps) => {
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const handleOpenChange = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  return <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <UpdateNameModalComponent {...props} isOpen={isOpen} onClose={handleOpenChange} onOpenChange={handleOpenChange} error="Message error update name" />
    </>;
}`,...(O=(u=r.parameters)==null?void 0:u.docs)==null?void 0:O.source}}};const E=["UpdateNameModalDefault","UpdateNameModalWithError"];export{s as UpdateNameModalDefault,r as UpdateNameModalWithError,E as __namedExportsOrder,w as default};
