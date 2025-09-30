import{j as t}from"./jsx-runtime-BRNY0I4F.js";import{N as s}from"./manager-react-components-lib.es-BWRfimW3.js";import{D as p}from"./DrawerContent.component-BOU1ug-7.js";import"./index-Bnop-kX6.js";import"./iframe-BboHc1zZ.js";import"./QueryClientProvider-DbnhbVMg.js";import"./index-D1HcsAmU.js";import"./context-Cuu9iSAu.js";import"./index-D0sJu8id.js";const{useArgs:C}=__STORYBOOK_MODULE_PREVIEW_API__,w={title:"Manager React Components/Components/Drawer",component:s,args:{heading:"Drawer Title",isOpen:!0,isLoading:!1,primaryButtonLabel:"Confirm",onPrimaryButtonClick:()=>{},secondaryButtonLabel:"Cancel",onSecondaryButtonClick:()=>{},onDismiss:()=>{},isPrimaryButtonLoading:!1,isPrimaryButtonDisabled:!1,isSecondaryButtonLoading:!1,isSecondaryButtonDisabled:!1,children:t.jsx(p,{size:"short"})},argTypes:{heading:{description:"Header title of the drawer"}},parameters:{controls:{exclude:["children"]}},render:function(u){const[{isOpen:o},g]=C(),n=()=>g({isOpen:!o});return t.jsx(s,{...u,isOpen:o,onDismiss:n,onPrimaryButtonClick:n,onSecondaryButtonClick:n})}},e={args:{heading:"Classic Drawer",isOpen:!0}},r={args:{heading:"Scrollable Content",isOpen:!0,children:t.jsx(p,{size:"long"})}};var a,i,c;e.parameters={...e.parameters,docs:{...(a=e.parameters)==null?void 0:a.docs,source:{originalSource:`{
  args: {
    heading: 'Classic Drawer',
    isOpen: true
  }
}`,...(c=(i=e.parameters)==null?void 0:i.docs)==null?void 0:c.source}}};var l,d,m;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    heading: 'Scrollable Content',
    isOpen: true,
    children: <DrawerContent size="long" />
  }
}`,...(m=(d=r.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};const L=["Default","ScrollableContent"];export{e as Default,r as ScrollableContent,L as __namedExportsOrder,w as default};
