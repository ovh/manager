import{l as x}from"./ods-react60-0db41gCx.js";import{t as p}from"./Button-BC-ipw2F-CXZv4wj7.js";import{o as t}from"./ods-react235-BTQ8kVBe.js";import{C as E}from"./lib-D44cvI9Y-BEmnv0Ot.js";import"./jsx-runtime-BRNY0I4F.js";import"./index-Bnop-kX6.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./ods-react236-aAAP9SXj.js";import"./iframe-DVaWS9ZP.js";import"./QueryClientProvider-BPX08D6Z.js";import"./index-DnqQo6oJ.js";import"./index-4pTrEEYx.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./Badge-YOwwmnsf-CJ8iv41_.js";import"./PopoverTrigger-4w4N6iLp-C-LGD_7X.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-BAi52a_A-BVjZSJoF.js";import"./index-DB9CF8IY-DC0Y2KvY.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./Card-D5fMAkqX-3SHynhw3.js";import"./Skeleton-tM01pV-R-CR0rfR_T.js";import"./Input-DcqcPYne-DrbRSC9d.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./Divider-THit99OS-DE11lmva.js";import"./Table-DeFepqjL-ijVQdBcH.js";import"./CheckboxLabel-BNqUGOsg-n6RGKdXc.js";import"./use-field-context-C3OOq-03-DvM5qnyl.js";import"./Tag-B7nBeuPX-CPCfmWrN.js";import"./SelectControl-C7d9WPuE-Bxj24dHo.js";import"./index-_7D5ljJ2-LyAubAEn.js";import"./ClipboardTrigger-TeqCWvgk-PkhT1oq0.js";import"./ModalTrigger-tZKHx0Fx-Dgqcdxhl.js";import"./dialog-trigger-DhWI7POy-2Tl6aad4.js";import"./render-strategy-BVcZ76SI-DDawKQXU.js";import"./TabContent-fruP9qhA-B5VnEOA-.js";import"./MessageIcon-yhpEHWAg-BtZxEFo4.js";import"./BreadcrumbItem-elPaHQlb-CNpnNsvr.js";import"./DrawerTrigger-omPTo2Bn-DB5oJcOC.js";import"./DatepickerControl-4VwQb-ep-Ct4shRTG.js";import"./ComboboxControl-sJOkWHeT-CC0kWNMj.js";import"./index-D_fe-3SC-C5ZKsUXO.js";const o=[{id:1,href:"https://www.ovhcloud.com",target:"_blank",label:"external link"},{id:2,href:`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify({name:"john"}))}`,download:"test.json",target:"_blank",label:"download"},{id:3,href:"https://ovhcloud.com",target:"_blank",label:"disabled link",isDisabled:!0},{id:4,onClick:()=>window.open("https://ovhcloud.com","_blank","noopener"),label:"action",isDisabled:!0},{id:5,onClick:()=>window.open("https://ovhcloud.com","_blank","noopener"),label:"button disabled",isDisabled:!0},{id:6,onClick:()=>window.open("https://ovhcloud.com","_blank","noopener"),label:"action without iam permissions",urn:"urn:v9:eu:resource:manager-ui-kit:vrz-a878-dsflkds-fdsfsd",iamActions:["vrackServices:apiovh:iam/resource/tag/remove"]}],e={args:{id:"action-menu-default",items:o,isCompact:!1,popoverPosition:t.bottom,variant:p.outline,displayIcon:!0,isDisabled:!1,isLoading:!1},parameters:{docs:{source:{code:`const actionItems = [
  {
    id: 1,
    href: 'https://www.ovhcloud.com',
    target: '_blank',
    label: 'external link',
  },
  {
    id: 2,
    onClick: () => handleAction(),
    label: 'action',
  },
];

<ActionMenu
  id="action-menu-default"
  items={actionItems}
  isCompact={false}
  popoverPosition={POPOVER_POSITION.bottom}
  variant={BUTTON_VARIANT.outline}
/>`}}}},a={args:{id:"action-menu-compact",items:o,isCompact:!0,popoverPosition:t.bottom},parameters:{docs:{source:{code:`<ActionMenu
  id="action-menu-compact"
  items={actionItems}
  isCompact={true}
  popoverPosition={POPOVER_POSITION.bottom}
/>`}}}},n={args:{id:"action-menu-loading",items:o,isLoading:!0,isCompact:!1}},i={args:{id:"action-menu-disabled",items:o,isDisabled:!0,isCompact:!1}},s={args:{id:"action-menu-custom-label",items:o,label:"Custom Actions",isCompact:!1}},r={args:{id:"action-menu-ghost",items:o,variant:p.ghost,isCompact:!1}},c={args:{id:"action-menu-custom-icon",items:o,icon:x.ellipsisHorizontal,isCompact:!1}},m={args:{id:"action-menu-top",items:o,popoverPosition:t.top,isCompact:!1}},xo={title:"Manager UI Kit/Components/ActionMenu",component:E,tags:["autodocs"],args:{id:"action-menu-example",items:o,isCompact:!1,popoverPosition:t.bottom,variant:p.outline,displayIcon:!0,isDisabled:!1,isLoading:!1},argTypes:{items:{control:{type:"object"},table:{category:"Content"}},id:{control:{type:"text"},table:{category:"Content"}},label:{control:{type:"text"},table:{category:"Content"}},isCompact:{control:{type:"boolean"},table:{category:"Appearance"}},displayIcon:{control:{type:"boolean"},table:{category:"Appearance"}},icon:{control:{type:"select"},options:Object.values(x),table:{category:"Appearance"}},variant:{control:{type:"select"},options:Object.values(p),table:{category:"Appearance"}},popoverPosition:{control:{type:"select"},options:Object.values(t),table:{category:"Layout"}},isDisabled:{control:{type:"boolean"},table:{category:"State"}},isLoading:{control:{type:"boolean"},table:{category:"State"}}},parameters:{docs:{description:{component:"The `ActionMenu` component provides a dropdown menu with multiple action items. It supports links, downloads, custom actions, IAM permissions, and various styling options. Use it to group related actions in a compact interface."}}}};var l,d,u;e.parameters={...e.parameters,docs:{...(l=e.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    id: 'action-menu-default',
    items: actionItems,
    isCompact: false,
    popoverPosition: POPOVER_POSITION.bottom,
    variant: BUTTON_VARIANT.outline,
    displayIcon: true,
    isDisabled: false,
    isLoading: false
  },
  parameters: {
    docs: {
      source: {
        code: \`const actionItems = [
  {
    id: 1,
    href: 'https://www.ovhcloud.com',
    target: '_blank',
    label: 'external link',
  },
  {
    id: 2,
    onClick: () => handleAction(),
    label: 'action',
  },
];

<ActionMenu
  id="action-menu-default"
  items={actionItems}
  isCompact={false}
  popoverPosition={POPOVER_POSITION.bottom}
  variant={BUTTON_VARIANT.outline}
/>\`
      }
    }
  }
}`,...(u=(d=e.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var b,g,f;a.parameters={...a.parameters,docs:{...(b=a.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    id: 'action-menu-compact',
    items: actionItems,
    isCompact: true,
    popoverPosition: POPOVER_POSITION.bottom
  },
  parameters: {
    docs: {
      source: {
        code: \`<ActionMenu
  id="action-menu-compact"
  items={actionItems}
  isCompact={true}
  popoverPosition={POPOVER_POSITION.bottom}
/>\`
      }
    }
  }
}`,...(f=(g=a.parameters)==null?void 0:g.docs)==null?void 0:f.source}}};var I,C,v;n.parameters={...n.parameters,docs:{...(I=n.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    id: 'action-menu-loading',
    items: actionItems,
    isLoading: true,
    isCompact: false
  }
}`,...(v=(C=n.parameters)==null?void 0:C.docs)==null?void 0:v.source}}};var O,P,h;i.parameters={...i.parameters,docs:{...(O=i.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    id: 'action-menu-disabled',
    items: actionItems,
    isDisabled: true,
    isCompact: false
  }
}`,...(h=(P=i.parameters)==null?void 0:P.docs)==null?void 0:h.source}}};var y,A,T;s.parameters={...s.parameters,docs:{...(y=s.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    id: 'action-menu-custom-label',
    items: actionItems,
    label: 'Custom Actions',
    isCompact: false
  }
}`,...(T=(A=s.parameters)==null?void 0:A.docs)==null?void 0:T.source}}};var _,k,w;r.parameters={...r.parameters,docs:{...(_=r.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    id: 'action-menu-ghost',
    items: actionItems,
    variant: BUTTON_VARIANT.ghost,
    isCompact: false
  }
}`,...(w=(k=r.parameters)==null?void 0:k.docs)==null?void 0:w.source}}};var S,N,D;c.parameters={...c.parameters,docs:{...(S=c.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    id: 'action-menu-custom-icon',
    items: actionItems,
    icon: ICON_NAME.ellipsisHorizontal,
    isCompact: false
  }
}`,...(D=(N=c.parameters)==null?void 0:N.docs)==null?void 0:D.source}}};var V,R,L;m.parameters={...m.parameters,docs:{...(V=m.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    id: 'action-menu-top',
    items: actionItems,
    popoverPosition: POPOVER_POSITION.top,
    isCompact: false
  }
}`,...(L=(R=m.parameters)==null?void 0:R.docs)==null?void 0:L.source}}};const Eo=["Default","Compact","Loading","Disabled","CustomLabel","DifferentVariants","CustomIcon","PositionTop"];export{a as Compact,c as CustomIcon,s as CustomLabel,e as Default,r as DifferentVariants,i as Disabled,n as Loading,m as PositionTop,Eo as __namedExportsOrder,xo as default};
