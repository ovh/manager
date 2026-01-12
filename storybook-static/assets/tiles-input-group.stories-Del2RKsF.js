import{j as r}from"./jsx-runtime-BRNY0I4F.js";import{H as T,X as g}from"./lib-D44cvI9Y-ABO6_toj.js";import"./index-Bnop-kX6.js";import"./iframe-RBN6eZbm.js";import"./QueryClientProvider-BPX08D6Z.js";import"./index-DnqQo6oJ.js";import"./index-4pTrEEYx.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./Badge-YOwwmnsf-CJ8iv41_.js";import"./ods-react236-aAAP9SXj.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./PopoverTrigger-4w4N6iLp-C-LGD_7X.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-BAi52a_A-BVjZSJoF.js";import"./index-DB9CF8IY-DC0Y2KvY.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./Card-D5fMAkqX-3SHynhw3.js";import"./Skeleton-tM01pV-R-CR0rfR_T.js";import"./Input-DcqcPYne-DrbRSC9d.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./Divider-THit99OS-DE11lmva.js";import"./Table-DeFepqjL-ijVQdBcH.js";import"./CheckboxLabel-BNqUGOsg-n6RGKdXc.js";import"./use-field-context-C3OOq-03-DvM5qnyl.js";import"./Tag-B7nBeuPX-CPCfmWrN.js";import"./SelectControl-C7d9WPuE-Bxj24dHo.js";import"./index-_7D5ljJ2-LyAubAEn.js";import"./ClipboardTrigger-TeqCWvgk-PkhT1oq0.js";import"./ModalTrigger-tZKHx0Fx-Dgqcdxhl.js";import"./dialog-trigger-DhWI7POy-2Tl6aad4.js";import"./render-strategy-BVcZ76SI-DDawKQXU.js";import"./TabContent-fruP9qhA-B5VnEOA-.js";import"./MessageIcon-yhpEHWAg-BtZxEFo4.js";import"./BreadcrumbItem-elPaHQlb-CNpnNsvr.js";import"./DrawerTrigger-omPTo2Bn-DB5oJcOC.js";import"./DatepickerControl-4VwQb-ep-Ct4shRTG.js";import"./ComboboxControl-sJOkWHeT-CC0kWNMj.js";import"./index-D_fe-3SC-C5ZKsUXO.js";function G(n){var e,a,t="";if(typeof n=="string"||typeof n=="number")t+=n;else if(typeof n=="object")if(Array.isArray(n)){var l=n.length;for(e=0;e<l;e++)n[e]&&(a=G(n[e]))&&(t&&(t+=" "),t+=a)}else for(a in n)n[a]&&(t&&(t+=" "),t+=a);return t}function O(){for(var n,e,a=0,t="",l=arguments.length;a<l;a++)(n=arguments[a])&&(e=G(n))&&(t&&(t+=" "),t+=e);return t}const{useArgs:M}=__STORYBOOK_MODULE_PREVIEW_API__;var P=(n=>(n.AR="ARABIC",n.FR="FRENCH",n.EN="ENGLISH",n.MN="MANDARIN",n))(P||{}),U=(n=>(n.AFRICA="AFRICA",n.EUROPE="EUROPE",n.AMERICA="AMERICA",n.ASIA="ASIA",n))(U||{});const o=[{name:"Morocco",continent:"AFRICA",language:"ARABIC"},{name:"Algeria",continent:"AFRICA",language:"ARABIC"},{name:"Tunisia",continent:"AFRICA",language:"ARABIC"},{name:"Cameron",continent:"AFRICA",language:"FRENCH"},{name:"South Africa",continent:"AFRICA",language:"ENGLISH"},{name:"France",continent:"EUROPE",language:"FRENCH"},{name:"Luxembourg",continent:"EUROPE",language:"FRENCH"},{name:"England",continent:"EUROPE",language:"ENGLISH"},{name:"Saoudi Arabia",continent:"ASIA",language:"ARABIC"},{name:"Palestine",continent:"ASIA",language:"ARABIC"},{name:"United states",continent:"AMERICA",language:"ENGLISH"},{name:"China",continent:"ASIA",language:"MANDARIN"}],Pn={title:"Manager UI Kit/Components/TilesInputGroup",component:T,tags:["autodocs"],parameters:{docs:{description:{component:"This is an interactive tiles input component."}}}},p=n=>{const[,e]=M();return r.jsx(T,{...n,onInput:a=>e({value:a})})},s=p.bind({}),c={items:o,value:void 0,label:n=>r.jsx(g,{preset:"span",className:"text-center w-full",children:n==null?void 0:n.name}),tileClass:{active:"font-bold text-red-500 bg-orange-100"}};s.args={...c};const i=p.bind({});i.args={...c,stack:{by:n=>n==null?void 0:n.language,label:(n,e)=>r.jsx(g,{preset:"span",className:"text-center w-full",children:`${n} (${e.length})`}),title:(n,e)=>`Countries of ${n}(${e.length}):`}};const m=p.bind({});m.args={...c,group:{by:n=>n==null?void 0:n.continent,label:n=>r.jsx("div",{className:O("font-bold","whitespace-nowrap px-2 text-lg"),children:r.jsx(g,{children:n})}),showAllTab:!0}};const u=p.bind({});u.args={...c,group:{by:n=>n.continent,label:n=>r.jsx("div",{className:O("font-bold","whitespace-nowrap px-2 text-lg"),children:r.jsx(g,{children:n})}),showAllTab:!0},tileClass:{active:"font-bold text-red-500 bg-orange-100"},stack:{by:n=>n==null?void 0:n.language,label:(n,e)=>r.jsx(g,{preset:"span",className:"text-center w-full",children:`${n} (${e.length})`}),title:(n,e)=>`Countries of ${n}(${e.length}):`}};var A,E,d;o.parameters={...o.parameters,docs:{...(A=o.parameters)==null?void 0:A.docs,source:{originalSource:`[{
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
}]`,...(d=(E=o.parameters)==null?void 0:E.docs)==null?void 0:d.source}}};var C,I,R;s.parameters={...s.parameters,docs:{...(C=s.parameters)==null?void 0:C.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputGroupComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(R=(I=s.parameters)==null?void 0:I.docs)==null?void 0:R.source}}};var b,S,f;i.parameters={...i.parameters,docs:{...(b=i.parameters)==null?void 0:b.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputGroupComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(f=(S=i.parameters)==null?void 0:S.docs)==null?void 0:f.source}}};var x,N,h;m.parameters={...m.parameters,docs:{...(x=m.parameters)==null?void 0:x.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputGroupComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(h=(N=m.parameters)==null?void 0:N.docs)==null?void 0:h.source}}};var F,v,L;u.parameters={...u.parameters,docs:{...(F=u.parameters)==null?void 0:F.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputGroupComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(L=(v=u.parameters)==null?void 0:v.docs)==null?void 0:L.source}}};const Un=["LanguagesEnum","ContinentsEnum","allCountries","DemoSimple","DemoStack","DemoGroup","DemoGroupStack"];export{U as ContinentsEnum,m as DemoGroup,u as DemoGroupStack,s as DemoSimple,i as DemoStack,P as LanguagesEnum,Un as __namedExportsOrder,o as allCountries,Pn as default};
