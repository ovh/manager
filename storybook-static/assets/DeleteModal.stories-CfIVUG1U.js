import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{r}from"./index-Bnop-kX6.js";import{N as c,g as i}from"./lib-D44cvI9Y-Bb2oAnDh.js";import"./iframe-Bru3zJiY.js";import"./QueryClientProvider-BPX08D6Z.js";import"./with-selector-CbDTc_Tw.js";import"./index-4pTrEEYx.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./Link-BWQEuWpd-D0wspT2_.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./ComboboxControl-sJOkWHeT-8SVRT3vS.js";import"./Divider-THit99OS-Di1FabXz.js";const a=o=>{const[n,s]=r.useState(o.open),t=r.useCallback(()=>{s(!n)},[n]);return e.jsxs(e.Fragment,{children:[e.jsx(c,{onClick:()=>s(!0),children:"Open Modal"}),e.jsx(i,{...o,open:n,onClose:t,onOpenChange:t})]})};a.parameters={docs:{source:{code:`<DeleteModal 
  open={isOpen}
  onClose={handleClose}
  onConfirmDelete={() => console.log('onDelete')}
  serviceTypeName="SQL Server"
/>`}}};const p=o=>{const[n,s]=r.useState(o.open),t=r.useCallback(()=>{s(!n)},[n]);return e.jsxs(e.Fragment,{children:[e.jsx(c,{onClick:()=>s(!0),children:"Open Modal"}),e.jsx(i,{...o,error:"Error Message",open:n,onClose:t,onOpenChange:t})]})},l=o=>{const[n,s]=r.useState(o.open),t=r.useCallback(()=>{s(!n)},[n]);return e.jsxs(e.Fragment,{children:[e.jsx(c,{onClick:()=>s(!0),children:"Open Modal"}),e.jsx(i,{...o,open:n,onClose:t,onOpenChange:t,isLoading:!0})]})},F={title:"Manager UI Kit/Components/Delete Modal",component:i,tags:["autodocs"],argTypes:{isOpen:{control:"boolean"},isLoading:{control:"boolean"},error:{control:"text"}},args:{onConfirmDelete:()=>{},serviceTypeName:"SQL Server",isLoading:!1,open:!1}};var O,d,u;a.parameters={...a.parameters,docs:{...(O=a.parameters)==null?void 0:O.docs,source:{originalSource:`(props: DeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(props.open);
  const onOpenChange = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  return <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <DeleteModal {...props} open={isOpen} onClose={onOpenChange} onOpenChange={onOpenChange} />
    </>;
}`,...(u=(d=a.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var m,C,g;p.parameters={...p.parameters,docs:{...(m=p.parameters)==null?void 0:m.docs,source:{originalSource:`(props: DeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(props.open);
  const onOpenChange = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  return <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <DeleteModal {...props} error="Error Message" open={isOpen} onClose={onOpenChange} onOpenChange={onOpenChange} />
    </>;
}`,...(g=(C=p.parameters)==null?void 0:C.docs)==null?void 0:g.source}}};var h,M,D;l.parameters={...l.parameters,docs:{...(h=l.parameters)==null?void 0:h.docs,source:{originalSource:`(props: DeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(props.open);
  const onOpenChange = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  return <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <DeleteModal {...props} open={isOpen} onClose={onOpenChange} onOpenChange={onOpenChange} isLoading={true} />
    </>;
}`,...(D=(M=l.parameters)==null?void 0:M.docs)==null?void 0:D.source}}};const P=["DeleteModalDefault","DeleteModalWithError","DeleteModalIsLoading"];export{a as DeleteModalDefault,l as DeleteModalIsLoading,p as DeleteModalWithError,P as __namedExportsOrder,F as default};
