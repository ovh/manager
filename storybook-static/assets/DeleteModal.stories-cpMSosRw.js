import{j as p}from"./jsx-runtime-BRNY0I4F.js";import{r as c}from"./index-Bnop-kX6.js";import{d as l}from"./lib-CKnpYlbA-djy7yrp4.js";import"./iframe-CWlwMVn9.js";import"./index-4pTrEEYx.js";import"./index-GPs4uoxI.js";const n=e=>{const[o,s]=c.useState(!0),r=()=>{s(!1)};return p.jsx(l,{...e,open:o,onClose:r})};n.parameters={docs:{source:{code:`<DeleteModal 
  open={isOpen}
  onClose={handleClose}
  onConfirmDelete={() => console.log('onDelete')}
  serviceTypeName="SQL Server"
/>`}}};const t=e=>{const[o,s]=c.useState(!0),r=()=>{s(!1)};return p.jsx(l,{...e,error:"Error Message",open:o,onClose:r})},a=e=>{const[o,s]=c.useState(!0),r=()=>{s(!1)};return p.jsx(l,{...e,open:o,onClose:r,isLoading:!0})},E={title:"Manager UI Kit/Components/Delete Modal",component:l,tags:["autodocs"],argTypes:{isOpen:{control:"boolean"},isLoading:{control:"boolean"},error:{control:"text"}},args:{onConfirmDelete:()=>{},serviceTypeName:"SQL Server",isLoading:!1}};var d,i,u;n.parameters={...n.parameters,docs:{...(d=n.parameters)==null?void 0:d.docs,source:{originalSource:`(props: DeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = () => {
    setIsOpen(false);
  };
  return <DeleteModal {...props} open={isOpen} onClose={handleClose} />;
}`,...(u=(i=n.parameters)==null?void 0:i.docs)==null?void 0:u.source}}};var m,O,C;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`(props: DeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = () => {
    setIsOpen(false);
  };
  return <DeleteModal {...props} error="Error Message" open={isOpen} onClose={handleClose} />;
}`,...(C=(O=t.parameters)==null?void 0:O.docs)==null?void 0:C.source}}};var D,M,g;a.parameters={...a.parameters,docs:{...(D=a.parameters)==null?void 0:D.docs,source:{originalSource:`(props: DeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = () => {
    setIsOpen(false);
  };
  return <DeleteModal {...props} open={isOpen} onClose={handleClose} isLoading={true} />;
}`,...(g=(M=a.parameters)==null?void 0:M.docs)==null?void 0:g.source}}};const j=["DeleteModalDefault","DeleteModalWithError","DeleteModalIsLoading"];export{n as DeleteModalDefault,a as DeleteModalIsLoading,t as DeleteModalWithError,j as __namedExportsOrder,E as default};
