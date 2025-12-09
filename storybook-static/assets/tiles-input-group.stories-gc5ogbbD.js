import{j as t}from"./jsx-runtime-BRNY0I4F.js";import{c as L}from"./clsx-B-dksMZM.js";import{m as T,V as m}from"./lib-sJyaz0Xv-D87u2is_.js";import"./index-Bnop-kX6.js";import"./iframe-CMtJSjaz.js";import"./QueryClientProvider-BPX08D6Z.js";import"./index-DnqQo6oJ.js";import"./index-4pTrEEYx.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./Badge-YOwwmnsf-CJ8iv41_.js";import"./ods-react236-aAAP9SXj.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./PopoverTrigger-4w4N6iLp-C-LGD_7X.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-BAi52a_A-BVjZSJoF.js";import"./index-DB9CF8IY-DC0Y2KvY.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./Card-D5fMAkqX-3SHynhw3.js";import"./Skeleton-tM01pV-R-CR0rfR_T.js";import"./Input-DcqcPYne-DrbRSC9d.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./Divider-THit99OS-DE11lmva.js";import"./Table-DeFepqjL-ijVQdBcH.js";import"./CheckboxLabel-BNqUGOsg-n6RGKdXc.js";import"./use-field-context-C3OOq-03-DvM5qnyl.js";import"./Tag-B7nBeuPX-CPCfmWrN.js";import"./SelectControl-C7d9WPuE-Bxj24dHo.js";import"./index-_7D5ljJ2-LyAubAEn.js";import"./ClipboardTrigger-TeqCWvgk-PkhT1oq0.js";import"./ModalTrigger-tZKHx0Fx-Dgqcdxhl.js";import"./dialog-trigger-DhWI7POy-2Tl6aad4.js";import"./render-strategy-BVcZ76SI-DDawKQXU.js";import"./TabContent-fruP9qhA-B5VnEOA-.js";import"./MessageIcon-yhpEHWAg-BtZxEFo4.js";import"./BreadcrumbItem-elPaHQlb-CNpnNsvr.js";import"./DrawerTrigger-omPTo2Bn-DB5oJcOC.js";import"./DatepickerControl-4VwQb-ep-Ct4shRTG.js";import"./ComboboxControl-sJOkWHeT-CC0kWNMj.js";import"./index-D_fe-3SC-C5ZKsUXO.js";const{useArgs:v}=__STORYBOOK_MODULE_PREVIEW_API__;var G=(n=>(n.AR="ARABIC",n.FR="FRENCH",n.EN="ENGLISH",n.MN="MANDARIN",n))(G||{}),O=(n=>(n.AFRICA="AFRICA",n.EUROPE="EUROPE",n.AMERICA="AMERICA",n.ASIA="ASIA",n))(O||{});const a=[{name:"Morocco",continent:"AFRICA",language:"ARABIC"},{name:"Algeria",continent:"AFRICA",language:"ARABIC"},{name:"Tunisia",continent:"AFRICA",language:"ARABIC"},{name:"Cameron",continent:"AFRICA",language:"FRENCH"},{name:"South Africa",continent:"AFRICA",language:"ENGLISH"},{name:"France",continent:"EUROPE",language:"FRENCH"},{name:"Luxembourg",continent:"EUROPE",language:"FRENCH"},{name:"England",continent:"EUROPE",language:"ENGLISH"},{name:"Saoudi Arabia",continent:"ASIA",language:"ARABIC"},{name:"Palestine",continent:"ASIA",language:"ARABIC"},{name:"United states",continent:"AMERICA",language:"ENGLISH"},{name:"China",continent:"ASIA",language:"MANDARIN"}],On={title:"Manager UI Kit/Components/TilesInputGroup",component:T,tags:["autodocs"],parameters:{docs:{description:{component:"This is an interactive tiles input component."}}}},u=n=>{const[,e]=v();return t.jsx(T,{...n,onInput:f=>e({value:f})})},r=u.bind({}),g={items:a,value:void 0,label:n=>t.jsx(m,{preset:"span",className:"text-center w-full",children:n==null?void 0:n.name}),tileClass:{active:"font-bold text-red-500 bg-orange-100"}};r.args={...g};const o=u.bind({});o.args={...g,stack:{by:n=>n==null?void 0:n.language,label:(n,e)=>t.jsx(m,{preset:"span",className:"text-center w-full",children:`${n} (${e.length})`}),title:(n,e)=>`Countries of ${n}(${e.length}):`}};const s=u.bind({});s.args={...g,group:{by:n=>n==null?void 0:n.continent,label:n=>t.jsx("div",{className:L("font-bold","whitespace-nowrap px-2 text-lg"),children:t.jsx(m,{children:n})}),showAllTab:!0}};const i=u.bind({});i.args={...g,group:{by:n=>n.continent,label:n=>t.jsx("div",{className:L("font-bold","whitespace-nowrap px-2 text-lg"),children:t.jsx(m,{children:n})}),showAllTab:!0},tileClass:{active:"font-bold text-red-500 bg-orange-100"},stack:{by:n=>n==null?void 0:n.language,label:(n,e)=>t.jsx(m,{preset:"span",className:"text-center w-full",children:`${n} (${e.length})`}),title:(n,e)=>`Countries of ${n}(${e.length}):`}};var p,c,l;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:`[{
  name: 'Morocco',
  continent: ContinentsEnum.AFRICA,
  language: LanguagesEnum.AR
}, {
  name: 'Algeria',
  continent: ContinentsEnum.AFRICA,
  language: LanguagesEnum.AR
}, {
  name: 'Tunisia',
  continent: ContinentsEnum.AFRICA,
  language: LanguagesEnum.AR
}, {
  name: 'Cameron',
  continent: ContinentsEnum.AFRICA,
  language: LanguagesEnum.FR
}, {
  name: 'South Africa',
  continent: ContinentsEnum.AFRICA,
  language: LanguagesEnum.EN
}, {
  name: 'France',
  continent: ContinentsEnum.EUROPE,
  language: LanguagesEnum.FR
}, {
  name: 'Luxembourg',
  continent: ContinentsEnum.EUROPE,
  language: LanguagesEnum.FR
}, {
  name: 'England',
  continent: ContinentsEnum.EUROPE,
  language: LanguagesEnum.EN
}, {
  name: 'Saoudi Arabia',
  continent: ContinentsEnum.ASIA,
  language: LanguagesEnum.AR
}, {
  name: 'Palestine',
  continent: ContinentsEnum.ASIA,
  language: LanguagesEnum.AR
}, {
  name: 'United states',
  continent: ContinentsEnum.AMERICA,
  language: LanguagesEnum.EN
}, {
  name: 'China',
  continent: ContinentsEnum.ASIA,
  language: LanguagesEnum.MN
}]`,...(l=(c=a.parameters)==null?void 0:c.docs)==null?void 0:l.source}}};var A,E,d;r.parameters={...r.parameters,docs:{...(A=r.parameters)==null?void 0:A.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputGroupComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(d=(E=r.parameters)==null?void 0:E.docs)==null?void 0:d.source}}};var C,I,R;o.parameters={...o.parameters,docs:{...(C=o.parameters)==null?void 0:C.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputGroupComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(R=(I=o.parameters)==null?void 0:I.docs)==null?void 0:R.source}}};var S,b,x;s.parameters={...s.parameters,docs:{...(S=s.parameters)==null?void 0:S.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputGroupComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(x=(b=s.parameters)==null?void 0:b.docs)==null?void 0:x.source}}};var N,F,h;i.parameters={...i.parameters,docs:{...(N=i.parameters)==null?void 0:N.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputGroupComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(h=(F=i.parameters)==null?void 0:F.docs)==null?void 0:h.source}}};const Mn=["LanguagesEnum","ContinentsEnum","allCountries","DemoSimple","DemoStack","DemoGroup","DemoGroupStack"];export{O as ContinentsEnum,s as DemoGroup,i as DemoGroupStack,r as DemoSimple,o as DemoStack,G as LanguagesEnum,Mn as __namedExportsOrder,a as allCountries,On as default};
