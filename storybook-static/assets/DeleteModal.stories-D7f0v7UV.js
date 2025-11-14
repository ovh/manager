import{j as i}from"./jsx-runtime-BRNY0I4F.js";import{r as l}from"./index-Bnop-kX6.js";import{t as a}from"./lib-3BNUHx3P-DQ0dZkTw.js";import"./iframe-D5tzyF_8.js";import"./QueryClientProvider-YWZt9LhG.js";import"./index-BvE2bIaB.js";import"./index-4pTrEEYx.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./Badge-YOwwmnsf-CJ8iv41_.js";import"./ods-react236-aAAP9SXj.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./PopoverTrigger-4w4N6iLp-C-LGD_7X.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-BAi52a_A-BVjZSJoF.js";import"./index-DB9CF8IY-DC0Y2KvY.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./Card-D5fMAkqX-3SHynhw3.js";import"./Skeleton-tM01pV-R-CR0rfR_T.js";import"./Input-DcqcPYne-DrbRSC9d.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./Divider-THit99OS-DE11lmva.js";import"./Table-DeFepqjL-yMJhEyPY.js";import"./CheckboxLabel-BNqUGOsg-n6RGKdXc.js";import"./use-field-context-C3OOq-03-DvM5qnyl.js";import"./Tag-B7nBeuPX-CPCfmWrN.js";import"./SelectControl-C7d9WPuE-Bxj24dHo.js";import"./index-_7D5ljJ2-LyAubAEn.js";import"./ClipboardTrigger-TeqCWvgk-PkhT1oq0.js";import"./ModalTrigger-tZKHx0Fx-Dgqcdxhl.js";import"./dialog-trigger-DhWI7POy-2Tl6aad4.js";import"./render-strategy-BVcZ76SI-DDawKQXU.js";import"./TabContent-fruP9qhA-B5VnEOA-.js";import"./MessageIcon-yhpEHWAg-BtZxEFo4.js";import"./BreadcrumbItem-elPaHQlb-CNpnNsvr.js";import"./DrawerTrigger-omPTo2Bn-DB5oJcOC.js";import"./DatepickerControl-4VwQb-ep-Ct4shRTG.js";import"./ComboboxControl-sJOkWHeT-CC0kWNMj.js";import"./index-D_fe-3SC-C5ZKsUXO.js";const s=e=>{const[o,r]=l.useState(!0),t=()=>{r(!1)};return i.jsx(a,{...e,open:o,onClose:t})};s.parameters={docs:{source:{code:`<DeleteModal 
  open={isOpen}
  onClose={handleClose}
  onConfirmDelete={() => console.log('onDelete')}
  serviceTypeName="SQL Server"
/>`}}};const p=e=>{const[o,r]=l.useState(!0),t=()=>{r(!1)};return i.jsx(a,{...e,error:"Error Message",open:o,onClose:t})},n=e=>{const[o,r]=l.useState(!0),t=()=>{r(!1)};return i.jsx(a,{...e,open:o,onClose:t,isLoading:!0})},De={title:"Manager UI Kit/Components/Delete Modal",component:a,tags:["autodocs"],argTypes:{isOpen:{control:"boolean"},isLoading:{control:"boolean"},error:{control:"text"}},args:{onConfirmDelete:()=>{},serviceTypeName:"SQL Server",isLoading:!1}};var m,c,d;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`(props: DeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = () => {
    setIsOpen(false);
  };
  return <DeleteModal {...props} open={isOpen} onClose={handleClose} />;
}`,...(d=(c=s.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var u,O,C;p.parameters={...p.parameters,docs:{...(u=p.parameters)==null?void 0:u.docs,source:{originalSource:`(props: DeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = () => {
    setIsOpen(false);
  };
  return <DeleteModal {...props} error="Error Message" open={isOpen} onClose={handleClose} />;
}`,...(C=(O=p.parameters)==null?void 0:O.docs)==null?void 0:C.source}}};var D,M,g;n.parameters={...n.parameters,docs:{...(D=n.parameters)==null?void 0:D.docs,source:{originalSource:`(props: DeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = () => {
    setIsOpen(false);
  };
  return <DeleteModal {...props} open={isOpen} onClose={handleClose} isLoading={true} />;
}`,...(g=(M=n.parameters)==null?void 0:M.docs)==null?void 0:g.source}}};const Me=["DeleteModalDefault","DeleteModalWithError","DeleteModalIsLoading"];export{s as DeleteModalDefault,n as DeleteModalIsLoading,p as DeleteModalWithError,Me as __namedExportsOrder,De as default};
