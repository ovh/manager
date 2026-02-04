import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{r}from"./index-Bnop-kX6.js";import{z as c,i}from"./lib-7WI39Bnb-B8YmdMzd.js";import"./iframe-COCNz2cq.js";import"./QueryClientProvider-BPX08D6Z.js";import"./index-DnqQo6oJ.js";import"./index-4pTrEEYx.js";import"./Icon-xxQ9IRzi-ORI6lMWl.js";import"./index-CWkFp9WS-BSIT86NH.js";import"./Link-TMoA1i18-DiBAU0SL.js";import"./Text-BGoUCJU7-BjFZdlzU.js";import"./ComboboxControl-EYkaEIlI-CWYTos8A.js";import"./Divider-wQyo85oE-5vlIiwia.js";const a=o=>{const[n,s]=r.useState(o.open),t=r.useCallback(()=>{s(!n)},[n]);return e.jsxs(e.Fragment,{children:[e.jsx(c,{onClick:()=>s(!0),children:"Open Modal"}),e.jsx(i,{...o,open:n,onClose:t,onOpenChange:t})]})};a.parameters={docs:{source:{code:`<DeleteModal 
  open={isOpen}
  onClose={handleClose}
  onConfirmDelete={() => console.log('onDelete')}
  serviceTypeName="SQL Server"
/>`}}};const p=o=>{const[n,s]=r.useState(o.open),t=r.useCallback(()=>{s(!n)},[n]);return e.jsxs(e.Fragment,{children:[e.jsx(c,{onClick:()=>s(!0),children:"Open Modal"}),e.jsx(i,{...o,error:"Error Message",open:n,onClose:t,onOpenChange:t})]})},l=o=>{const[n,s]=r.useState(o.open),t=r.useCallback(()=>{s(!n)},[n]);return e.jsxs(e.Fragment,{children:[e.jsx(c,{onClick:()=>s(!0),children:"Open Modal"}),e.jsx(i,{...o,open:n,onClose:t,onOpenChange:t,isLoading:!0})]})},P={title:"Manager UI Kit/Components/Delete Modal",component:i,tags:["autodocs"],argTypes:{isOpen:{control:"boolean"},isLoading:{control:"boolean"},error:{control:"text"}},args:{onConfirmDelete:()=>{},serviceTypeName:"SQL Server",isLoading:!1,open:!1}};var O,d,u;a.parameters={...a.parameters,docs:{...(O=a.parameters)==null?void 0:O.docs,source:{originalSource:`(props: DeleteModalProps) => {
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
}`,...(D=(M=l.parameters)==null?void 0:M.docs)==null?void 0:D.source}}};const T=["DeleteModalDefault","DeleteModalWithError","DeleteModalIsLoading"];export{a as DeleteModalDefault,l as DeleteModalIsLoading,p as DeleteModalWithError,T as __namedExportsOrder,P as default};
