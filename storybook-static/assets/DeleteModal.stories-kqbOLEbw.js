import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{r}from"./index-Bnop-kX6.js";import{D as i,u as c}from"./lib-sJyaz0Xv-BlWaqhkt.js";import"./iframe-C-_YPmA_.js";import"./QueryClientProvider-C1FTVqK-.js";import"./index-ChsYPcXR.js";import"./index-4pTrEEYx.js";const a=o=>{const[n,s]=r.useState(o.open),t=r.useCallback(()=>{s(!n)},[n]);return e.jsxs(e.Fragment,{children:[e.jsx(i,{onClick:()=>s(!0),children:"Open Modal"}),e.jsx(c,{...o,open:n,onClose:t,onOpenChange:t})]})};a.parameters={docs:{source:{code:`<DeleteModal 
  open={isOpen}
  onClose={handleClose}
  onConfirmDelete={() => console.log('onDelete')}
  serviceTypeName="SQL Server"
/>`}}};const p=o=>{const[n,s]=r.useState(o.open),t=r.useCallback(()=>{s(!n)},[n]);return e.jsxs(e.Fragment,{children:[e.jsx(i,{onClick:()=>s(!0),children:"Open Modal"}),e.jsx(c,{...o,error:"Error Message",open:n,onClose:t,onOpenChange:t})]})},l=o=>{const[n,s]=r.useState(o.open),t=r.useCallback(()=>{s(!n)},[n]);return e.jsxs(e.Fragment,{children:[e.jsx(i,{onClick:()=>s(!0),children:"Open Modal"}),e.jsx(c,{...o,open:n,onClose:t,onOpenChange:t,isLoading:!0})]})},L={title:"Manager UI Kit/Components/Delete Modal",component:c,tags:["autodocs"],argTypes:{isOpen:{control:"boolean"},isLoading:{control:"boolean"},error:{control:"text"}},args:{onConfirmDelete:()=>{},serviceTypeName:"SQL Server",isLoading:!1,open:!1}};var O,u,d;a.parameters={...a.parameters,docs:{...(O=a.parameters)==null?void 0:O.docs,source:{originalSource:`(props: DeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(props.open);
  const onOpenChange = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  return <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <DeleteModal {...props} open={isOpen} onClose={onOpenChange} onOpenChange={onOpenChange} />
    </>;
}`,...(d=(u=a.parameters)==null?void 0:u.docs)==null?void 0:d.source}}};var C,m,g;p.parameters={...p.parameters,docs:{...(C=p.parameters)==null?void 0:C.docs,source:{originalSource:`(props: DeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(props.open);
  const onOpenChange = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  return <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <DeleteModal {...props} error="Error Message" open={isOpen} onClose={onOpenChange} onOpenChange={onOpenChange} />
    </>;
}`,...(g=(m=p.parameters)==null?void 0:m.docs)==null?void 0:g.source}}};var h,M,D;l.parameters={...l.parameters,docs:{...(h=l.parameters)==null?void 0:h.docs,source:{originalSource:`(props: DeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(props.open);
  const onOpenChange = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  return <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <DeleteModal {...props} open={isOpen} onClose={onOpenChange} onOpenChange={onOpenChange} isLoading={true} />
    </>;
}`,...(D=(M=l.parameters)==null?void 0:M.docs)==null?void 0:D.source}}};const E=["DeleteModalDefault","DeleteModalWithError","DeleteModalIsLoading"];export{a as DeleteModalDefault,l as DeleteModalIsLoading,p as DeleteModalWithError,E as __namedExportsOrder,L as default};
