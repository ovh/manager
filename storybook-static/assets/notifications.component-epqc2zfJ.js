import{j as o}from"./jsx-runtime-CKrituN3.js";import{r as a}from"./index-CBqU2yxZ.js";import{u as p,O as l}from"./ods-notification-CivT_VtR.js";import{u as f}from"./index-4N_owrwP.js";const i=({clearAfterRead:e=!0})=>{const t=f(),[s]=a.useState(t),{notifications:c,clearNotifications:r}=p();return a.useEffect(()=>{e&&s.pathname!==t.pathname&&r()},[e,t.pathname]),o.jsx(o.Fragment,{children:c.map(n=>o.jsx(l,{notification:n},n.uid))})};try{i.displayName="Notifications",i.__docgenInfo={description:`This component display the list of notifications. It acts
as a "flash" component because by default once the notifications have been
shown they are cleared. It means that you can use this component on multiple
pages, switching page won't display notifications twice.

It replicates the current behavior of public cloud notifications for
actions (success / errors / etc)`,displayName:"Notifications",props:{clearAfterRead:{defaultValue:{value:"true"},description:"Clear notifications once they have been displayed (on location changes)",name:"clearAfterRead",required:!1,type:{name:"boolean"}}}}}catch{}try{notificationscomponent.displayName="notificationscomponent",notificationscomponent.__docgenInfo={description:`This component display the list of notifications. It acts
as a "flash" component because by default once the notifications have been
shown they are cleared. It means that you can use this component on multiple
pages, switching page won't display notifications twice.

It replicates the current behavior of public cloud notifications for
actions (success / errors / etc)`,displayName:"notificationscomponent",props:{clearAfterRead:{defaultValue:{value:"true"},description:"Clear notifications once they have been displayed (on location changes)",name:"clearAfterRead",required:!1,type:{name:"boolean"}}}}}catch{}export{i as N};
//# sourceMappingURL=notifications.component-epqc2zfJ.js.map
