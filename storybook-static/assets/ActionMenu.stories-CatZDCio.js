import{l as x}from"./ods-react60-0db41gCx.js";import{t as l}from"./ods-react65-wKxTpDjY.js";import{o as t}from"./ods-react235-BTQ8kVBe.js";import{$ as E}from"./lib-CWaID5dp-BsSnuVqJ.js";import"./iframe-DvogHFNi.js";import"./index-Bnop-kX6.js";import"./index-4pTrEEYx.js";import"./index-DJBc9Vat.js";import"./jsx-runtime-BRNY0I4F.js";const o=[{id:1,href:"https://www.ovhcloud.com",target:"_blank",label:"external link"},{id:2,href:`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify({name:"john"}))}`,download:"test.json",target:"_blank",label:"download"},{id:3,href:"https://ovhcloud.com",target:"_blank",label:"disabled link",isDisabled:!0},{id:4,onClick:()=>window.open("https://ovhcloud.com","_blank","noopener"),label:"action"},{id:5,onClick:()=>window.open("https://ovhcloud.com","_blank","noopener"),label:"action without iam permissions",urn:"urn:v9:eu:resource:manager-ui-kit:vrz-a878-dsflkds-fdsfsd",iamActions:["vrackServices:apiovh:iam/resource/tag/remove"]}],e={args:{id:"action-menu-default",items:o,isCompact:!1,popoverPosition:t.bottom,variant:l.outline,displayIcon:!0,isDisabled:!1,isLoading:!1},parameters:{docs:{source:{code:`const actionItems = [
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
/>`}}}},n={args:{id:"action-menu-loading",items:o,isLoading:!0,isCompact:!1}},s={args:{id:"action-menu-disabled",items:o,isDisabled:!0,isCompact:!1}},i={args:{id:"action-menu-custom-label",items:o,label:"Custom Actions",isCompact:!1}},r={args:{id:"action-menu-ghost",items:o,variant:l.ghost,isCompact:!1}},c={args:{id:"action-menu-custom-icon",items:o,icon:x.ellipsisHorizontal,isCompact:!1}},m={args:{id:"action-menu-top",items:o,popoverPosition:t.top,isCompact:!1}},q={title:"Manager UI Kit/Components/ActionMenu",component:E,tags:["autodocs"],args:{id:"action-menu-example",items:o,isCompact:!1,popoverPosition:t.bottom,variant:l.outline,displayIcon:!0,isDisabled:!1,isLoading:!1},argTypes:{items:{control:{type:"object"},table:{category:"Content"}},id:{control:{type:"text"},table:{category:"Content"}},label:{control:{type:"text"},table:{category:"Content"}},isCompact:{control:{type:"boolean"},table:{category:"Appearance"}},displayIcon:{control:{type:"boolean"},table:{category:"Appearance"}},icon:{control:{type:"select"},options:Object.values(x),table:{category:"Appearance"}},variant:{control:{type:"select"},options:Object.values(l),table:{category:"Appearance"}},popoverPosition:{control:{type:"select"},options:Object.values(t),table:{category:"Layout"}},isDisabled:{control:{type:"boolean"},table:{category:"State"}},isLoading:{control:{type:"boolean"},table:{category:"State"}}},parameters:{docs:{description:{component:"The `ActionMenu` component provides a dropdown menu with multiple action items. It supports links, downloads, custom actions, IAM permissions, and various styling options. Use it to group related actions in a compact interface."}}}};var p,d,u;e.parameters={...e.parameters,docs:{...(p=e.parameters)==null?void 0:p.docs,source:{originalSource:`{
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
}`,...(u=(d=e.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var g,b,f;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
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
}`,...(f=(b=a.parameters)==null?void 0:b.docs)==null?void 0:f.source}}};var I,C,O;n.parameters={...n.parameters,docs:{...(I=n.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    id: 'action-menu-loading',
    items: actionItems,
    isLoading: true,
    isCompact: false
  }
}`,...(O=(C=n.parameters)==null?void 0:C.docs)==null?void 0:O.source}}};var v,P,h;s.parameters={...s.parameters,docs:{...(v=s.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    id: 'action-menu-disabled',
    items: actionItems,
    isDisabled: true,
    isCompact: false
  }
}`,...(h=(P=s.parameters)==null?void 0:P.docs)==null?void 0:h.source}}};var y,A,T;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    id: 'action-menu-custom-label',
    items: actionItems,
    label: 'Custom Actions',
    isCompact: false
  }
}`,...(T=(A=i.parameters)==null?void 0:A.docs)==null?void 0:T.source}}};var _,k,w;r.parameters={...r.parameters,docs:{...(_=r.parameters)==null?void 0:_.docs,source:{originalSource:`{
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
}`,...(L=(R=m.parameters)==null?void 0:R.docs)==null?void 0:L.source}}};const F=["Default","Compact","Loading","Disabled","CustomLabel","DifferentVariants","CustomIcon","PositionTop"];export{a as Compact,c as CustomIcon,i as CustomLabel,e as Default,r as DifferentVariants,s as Disabled,n as Loading,m as PositionTop,F as __namedExportsOrder,q as default};
