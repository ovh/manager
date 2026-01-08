import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{r as s}from"./index-Bnop-kX6.js";import{D as h,u as i}from"./lib-Z3xjUGyf-DiIwvzym.js";import"./iframe-DxxJ0EuQ.js";import"./QueryClientProvider-BPX08D6Z.js";import"./index-DnqQo6oJ.js";import"./index-4pTrEEYx.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./Badge-YOwwmnsf-CJ8iv41_.js";import"./ods-react236-aAAP9SXj.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./PopoverTrigger-4w4N6iLp-C-LGD_7X.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-BAi52a_A-BVjZSJoF.js";import"./index-DB9CF8IY-DC0Y2KvY.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./Card-D5fMAkqX-3SHynhw3.js";import"./Skeleton-tM01pV-R-CR0rfR_T.js";import"./Input-DcqcPYne-DrbRSC9d.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./Divider-THit99OS-DE11lmva.js";import"./Table-DeFepqjL-ijVQdBcH.js";import"./CheckboxLabel-BNqUGOsg-n6RGKdXc.js";import"./use-field-context-C3OOq-03-DvM5qnyl.js";import"./Tag-B7nBeuPX-CPCfmWrN.js";import"./SelectControl-C7d9WPuE-Bxj24dHo.js";import"./index-_7D5ljJ2-LyAubAEn.js";import"./ClipboardTrigger-TeqCWvgk-PkhT1oq0.js";import"./ModalTrigger-tZKHx0Fx-Dgqcdxhl.js";import"./dialog-trigger-DhWI7POy-2Tl6aad4.js";import"./render-strategy-BVcZ76SI-DDawKQXU.js";import"./TabContent-fruP9qhA-B5VnEOA-.js";import"./MessageIcon-yhpEHWAg-BtZxEFo4.js";import"./BreadcrumbItem-elPaHQlb-CNpnNsvr.js";import"./DrawerTrigger-omPTo2Bn-DB5oJcOC.js";import"./DatepickerControl-4VwQb-ep-Ct4shRTG.js";import"./ComboboxControl-sJOkWHeT-CC0kWNMj.js";import"./index-D_fe-3SC-C5ZKsUXO.js";const r=o=>{const[t,n]=s.useState(o.isOpen),a=s.useCallback(()=>{n(!t)},[t]);return e.jsxs(e.Fragment,{children:[e.jsx(h,{onClick:()=>n(!0),children:"Open Modal"}),e.jsx(i,{...o,isOpen:t,onClose:a,onOpenChange:a})]})};r.parameters={args:{isOpen:!1},argTypes:{isOpen:{control:"boolean"}},docs:{source:{code:`<UpdateNameModal 
  isOpen={isOpen}
  onClose={handleClose}
  updateDisplayName={(name) => console.log('updateDisplayName', name)}
  headline="Update Resource Name"
  description="Do you really want to update the display name of this resource?"
  inputLabel="New display name"
  defaultValue="oldDisplayName"
  cancelButtonLabel="Cancel"
  confirmButtonLabel="Confirm"
/>`}}};const p=o=>{const[t,n]=s.useState(o.isOpen),a=s.useCallback(()=>{n(!t)},[t]);return e.jsxs(e.Fragment,{children:[e.jsx(h,{onClick:()=>n(!0),children:"Open Modal"}),e.jsx(i,{...o,isOpen:t,onClose:a,onOpenChange:a,error:"Message error update name"})]})},ue={title:"Manager UI Kit/Components/Update Name Modal",component:i,tags:["autodocs"],argTypes:{isLoading:{control:"boolean"},error:{control:"text"},headline:{control:"text"},description:{control:"text"},inputLabel:{control:"text"},defaultValue:{control:"text"},cancelButtonLabel:{control:"text"},confirmButtonLabel:{control:"text"},pattern:{control:"text"},patternMessage:{control:"text"},isOpen:{control:"text"}},args:{isOpen:!1,onClose:()=>{},updateDisplayName:()=>{},headline:"headline",description:"Do you really want to update the display name of this resource ?",inputLabel:"New display name",isLoading:!1,defaultValue:"oldDisplayName",cancelButtonLabel:"Cancel",confirmButtonLabel:"Confirm",error:"",pattern:"^[a-zA-Z0-9-_s]*$",patternMessage:"put your pattern message here"}};var l,m,d;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`(props: UpdateNameModalProps) => {
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const handleOpenChange = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  return <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <UpdateNameModalComponent {...props} isOpen={isOpen} onClose={handleOpenChange} onOpenChange={handleOpenChange} />
    </>;
}`,...(d=(m=r.parameters)==null?void 0:m.docs)==null?void 0:d.source}}};var c,u,O;p.parameters={...p.parameters,docs:{...(c=p.parameters)==null?void 0:c.docs,source:{originalSource:`(props: UpdateNameModalProps) => {
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const handleOpenChange = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  return <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <UpdateNameModalComponent {...props} isOpen={isOpen} onClose={handleOpenChange} onOpenChange={handleOpenChange} error="Message error update name" />
    </>;
}`,...(O=(u=p.parameters)==null?void 0:u.docs)==null?void 0:O.source}}};const Oe=["UpdateNameModalDefault","UpdateNameModalWithError"];export{r as UpdateNameModalDefault,p as UpdateNameModalWithError,Oe as __namedExportsOrder,ue as default};
