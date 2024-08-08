import{j as e}from"./jsx-runtime-CKrituN3.js";import{u as N,K as _}from"./index-D_zAMuUt.js";import{d as a}from"./index-A2RwyqN4.js";import{c as s}from"./index-D8LG6A4J.js";import{O as n}from"./ods-theme-typography-size-DKhhZ49-.js";import{r as d}from"./index-CBqU2yxZ.js";import{u as h,O as g}from"./ods-notification-ClajxhRd.js";import"./index-BtM5VmRH.js";import"./_commonjsHelpers-BosuxZz1.js";const l=({clearAfterRead:o=!0})=>{const t=N(),[c]=d.useState(t),{notifications:r,clearNotifications:y}=h();return d.useEffect(()=>{o&&c.pathname!==t.pathname&&y()},[o,t.pathname]),e.jsx(e.Fragment,{children:r.map(m=>e.jsx(g,{notification:m},m.uid))})};try{l.displayName="Notifications",l.__docgenInfo={description:`This component display the list of notifications. It acts
as a "flash" component because by default once the notifications have been
shown they are cleared. It means that you can use this component on multiple
pages, switching page won't display notifications twice.

It replicates the current behavior of public cloud notifications for
actions (success / errors / etc)`,displayName:"Notifications",props:{clearAfterRead:{defaultValue:{value:"true"},description:"Clear notifications once they have been displayed (on location changes)",name:"clearAfterRead",required:!1,type:{name:"boolean"}}}}}catch{}try{notificationscomponent.displayName="notificationscomponent",notificationscomponent.__docgenInfo={description:`This component display the list of notifications. It acts
as a "flash" component because by default once the notifications have been
shown they are cleared. It means that you can use this component on multiple
pages, switching page won't display notifications twice.

It replicates the current behavior of public cloud notifications for
actions (success / errors / etc)`,displayName:"notificationscomponent",props:{clearAfterRead:{defaultValue:{value:"true"},description:"Clear notifications once they have been displayed (on location changes)",name:"clearAfterRead",required:!1,type:{name:"boolean"}}}}}catch{}const x=()=>{const{addSuccess:o,addWarning:t,addError:c,clearNotifications:r}=h();return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex",children:[e.jsx(a,{className:"mr-2",size:s.md,color:n.success,onClick:()=>o("success message"),children:"Add success"}),e.jsx(a,{className:"mr-2",size:s.md,color:n.warning,onClick:()=>t("warning message"),children:"Add warning"}),e.jsx(a,{className:"mr-2",size:s.md,color:n.error,onClick:()=>c("error message"),children:"Add error"}),e.jsx(a,{className:"mr-2",size:s.md,color:n.primary,onClick:r,children:"Clear"})]}),e.jsx("div",{className:"mt-4",children:e.jsx(l,{})})]})},i={name:"Notifications"},T={title:"Components/Notifications",component:x,decorators:[_]};var p,f,u;i.parameters={...i.parameters,docs:{...(p=i.parameters)==null?void 0:p.docs,source:{originalSource:`{
  name: 'Notifications'
}`,...(u=(f=i.parameters)==null?void 0:f.docs)==null?void 0:u.source}}};const A=["Primary"];export{i as Primary,A as __namedExportsOrder,T as default};
//# sourceMappingURL=notifications.stories-BTIJ9_YD.js.map
