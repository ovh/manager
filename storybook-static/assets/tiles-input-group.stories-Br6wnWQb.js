import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{c as S}from"./clsx-B-dksMZM.js";import{q as h,W as i}from"./lib-3BNUHx3P-DQ0dZkTw.js";import"./index-Bnop-kX6.js";import"./iframe-D5tzyF_8.js";import"./QueryClientProvider-YWZt9LhG.js";import"./index-BvE2bIaB.js";import"./index-4pTrEEYx.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./Badge-YOwwmnsf-CJ8iv41_.js";import"./ods-react236-aAAP9SXj.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./PopoverTrigger-4w4N6iLp-C-LGD_7X.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-BAi52a_A-BVjZSJoF.js";import"./index-DB9CF8IY-DC0Y2KvY.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./Card-D5fMAkqX-3SHynhw3.js";import"./Skeleton-tM01pV-R-CR0rfR_T.js";import"./Input-DcqcPYne-DrbRSC9d.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./Divider-THit99OS-DE11lmva.js";import"./Table-DeFepqjL-yMJhEyPY.js";import"./CheckboxLabel-BNqUGOsg-n6RGKdXc.js";import"./use-field-context-C3OOq-03-DvM5qnyl.js";import"./Tag-B7nBeuPX-CPCfmWrN.js";import"./SelectControl-C7d9WPuE-Bxj24dHo.js";import"./index-_7D5ljJ2-LyAubAEn.js";import"./ClipboardTrigger-TeqCWvgk-PkhT1oq0.js";import"./ModalTrigger-tZKHx0Fx-Dgqcdxhl.js";import"./dialog-trigger-DhWI7POy-2Tl6aad4.js";import"./render-strategy-BVcZ76SI-DDawKQXU.js";import"./TabContent-fruP9qhA-B5VnEOA-.js";import"./MessageIcon-yhpEHWAg-BtZxEFo4.js";import"./BreadcrumbItem-elPaHQlb-CNpnNsvr.js";import"./DrawerTrigger-omPTo2Bn-DB5oJcOC.js";import"./DatepickerControl-4VwQb-ep-Ct4shRTG.js";import"./ComboboxControl-sJOkWHeT-CC0kWNMj.js";import"./index-D_fe-3SC-C5ZKsUXO.js";const f=[{name:"Morocco",continent:"AFRICA",language:"ARABIC"},{name:"Algeria",continent:"AFRICA",language:"ARABIC"},{name:"Tunisia",continent:"AFRICA",language:"ARABIC"},{name:"Cameron",continent:"AFRICA",language:"FRENCH"},{name:"South Africa",continent:"AFRICA",language:"ENGLISH"},{name:"France",continent:"EUROPE",language:"FRENCH"},{name:"Luxembourg",continent:"EUROPE",language:"FRENCH"},{name:"England",continent:"EUROPE",language:"ENGLISH"},{name:"Saoudi Arabia",continent:"ASIA",language:"ARABIC"},{name:"Palestine",continent:"ASIA",language:"ARABIC"},{name:"United states",continent:"AMERICA",language:"ENGLISH"},{name:"China",continent:"ASIA",language:"MANDARIN"}],{useArgs:G}=__STORYBOOK_MODULE_PREVIEW_API__,ft={title:"Manager UI Kit/Components/TilesInputGroup",component:h,tags:["autodocs"],parameters:{docs:{description:{component:"This is an interactive tiles input component."}}}},p=t=>{const[,n]=G();return e.jsx(h,{...t,onInput:T=>n({value:T})})},r=p.bind({}),m={items:f,value:void 0,label:t=>e.jsx(i,{preset:"span",className:"text-center w-full",children:t==null?void 0:t.name}),tileClass:{active:"font-bold text-red-500 bg-orange-100"}};r.args={...m};const o=p.bind({});o.args={...m,stack:{by:t=>t==null?void 0:t.language,label:(t,n)=>e.jsx(i,{preset:"span",className:"text-center w-full",children:`${t} (${n.length})`}),title:(t,n)=>`Countries of ${t}(${n.length}):`}};const a=p.bind({});a.args={...m,group:{by:t=>t==null?void 0:t.continent,label:t=>e.jsx("div",{className:S("font-bold","whitespace-nowrap px-2 text-lg"),children:e.jsx(i,{children:t})}),showAllTab:!0}};const s=p.bind({});s.args={...m,group:{by:t=>t.continent,label:t=>e.jsx("div",{className:S("font-bold","whitespace-nowrap px-2 text-lg"),children:e.jsx(i,{children:t})}),showAllTab:!0},stack:{by:t=>t==null?void 0:t.language,label:(t,n)=>e.jsx(i,{preset:"span",className:"text-center w-full",children:`${t} (${n.length})`}),title:(t,n)=>`Countries of ${t}(${n.length}):`}};var u,c,g;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputGroupComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(g=(c=r.parameters)==null?void 0:c.docs)==null?void 0:g.source}}};var l,A,d;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputGroupComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(d=(A=o.parameters)==null?void 0:A.docs)==null?void 0:d.source}}};var I,C,b;a.parameters={...a.parameters,docs:{...(I=a.parameters)==null?void 0:I.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputGroupComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(b=(C=a.parameters)==null?void 0:C.docs)==null?void 0:b.source}}};var x,R,E;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputGroupComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(E=(R=s.parameters)==null?void 0:R.docs)==null?void 0:E.source}}};const Gt=["DemoSimple","DemoStack","DemoGroup","DemoGroupStack"];export{a as DemoGroup,s as DemoGroupStack,r as DemoSimple,o as DemoStack,Gt as __namedExportsOrder,ft as default};
