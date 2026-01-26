import{j as t}from"./jsx-runtime-BRNY0I4F.js";import{c as L}from"./clsx-B-dksMZM.js";import{v,X as i}from"./lib-D44cvI9Y-Bb2oAnDh.js";import"./index-Bnop-kX6.js";import"./iframe-Bru3zJiY.js";import"./QueryClientProvider-BPX08D6Z.js";import"./with-selector-CbDTc_Tw.js";import"./index-4pTrEEYx.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./Link-BWQEuWpd-D0wspT2_.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./ComboboxControl-sJOkWHeT-8SVRT3vS.js";import"./Divider-THit99OS-Di1FabXz.js";const{useArgs:f}=__STORYBOOK_MODULE_PREVIEW_API__;var G=(n=>(n.AR="ARABIC",n.FR="FRENCH",n.EN="ENGLISH",n.MN="MANDARIN",n))(G||{}),O=(n=>(n.AFRICA="AFRICA",n.EUROPE="EUROPE",n.AMERICA="AMERICA",n.ASIA="ASIA",n))(O||{});const a=[{name:"Morocco",continent:"AFRICA",language:"ARABIC"},{name:"Algeria",continent:"AFRICA",language:"ARABIC"},{name:"Tunisia",continent:"AFRICA",language:"ARABIC"},{name:"Cameron",continent:"AFRICA",language:"FRENCH"},{name:"South Africa",continent:"AFRICA",language:"ENGLISH"},{name:"France",continent:"EUROPE",language:"FRENCH"},{name:"Luxembourg",continent:"EUROPE",language:"FRENCH"},{name:"England",continent:"EUROPE",language:"ENGLISH"},{name:"Saoudi Arabia",continent:"ASIA",language:"ARABIC"},{name:"Palestine",continent:"ASIA",language:"ARABIC"},{name:"United states",continent:"AMERICA",language:"ENGLISH"},{name:"China",continent:"ASIA",language:"MANDARIN"}],V={title:"Manager UI Kit/Components/TilesInputGroup",component:v,tags:["autodocs"],parameters:{docs:{description:{component:"This is an interactive tiles input component."}}}},g=n=>{const[,e]=f();return t.jsx(v,{...n,onInput:T=>e({value:T})})},s=g.bind({}),m={items:a,value:void 0,label:n=>t.jsx(i,{preset:"span",className:"text-center w-full",children:n==null?void 0:n.name}),tileClass:{active:"font-bold text-red-500 bg-orange-100"}};s.args={...m};const r=g.bind({});r.args={...m,stack:{by:n=>n==null?void 0:n.language,label:(n,e)=>t.jsx(i,{preset:"span",className:"text-center w-full",children:`${n} (${e.length})`}),title:(n,e)=>`Countries of ${n}(${e.length}):`}};const o=g.bind({});o.args={...m,group:{by:n=>n==null?void 0:n.continent,label:n=>t.jsx("div",{className:L("font-bold","whitespace-nowrap px-2 text-lg"),children:t.jsx(i,{children:n})}),showAllTab:!0}};const u=g.bind({});u.args={...m,group:{by:n=>n.continent,label:n=>t.jsx("div",{className:L("font-bold","whitespace-nowrap px-2 text-lg"),children:t.jsx(i,{children:n})}),showAllTab:!0},tileClass:{active:"font-bold text-red-500 bg-orange-100"},stack:{by:n=>n==null?void 0:n.language,label:(n,e)=>t.jsx(i,{preset:"span",className:"text-center w-full",children:`${n} (${e.length})`}),title:(n,e)=>`Countries of ${n}(${e.length}):`}};var c,l,p;a.parameters={...a.parameters,docs:{...(c=a.parameters)==null?void 0:c.docs,source:{originalSource:`[{
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
}]`,...(p=(l=a.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};var A,E,d;s.parameters={...s.parameters,docs:{...(A=s.parameters)==null?void 0:A.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputGroupComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(d=(E=s.parameters)==null?void 0:E.docs)==null?void 0:d.source}}};var C,I,R;r.parameters={...r.parameters,docs:{...(C=r.parameters)==null?void 0:C.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputGroupComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(R=(I=r.parameters)==null?void 0:I.docs)==null?void 0:R.source}}};var S,b,x;o.parameters={...o.parameters,docs:{...(S=o.parameters)==null?void 0:S.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputGroupComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(x=(b=o.parameters)==null?void 0:b.docs)==null?void 0:x.source}}};var N,F,h;u.parameters={...u.parameters,docs:{...(N=u.parameters)==null?void 0:N.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputGroupComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(h=(F=u.parameters)==null?void 0:F.docs)==null?void 0:h.source}}};const W=["LanguagesEnum","ContinentsEnum","allCountries","DemoSimple","DemoStack","DemoGroup","DemoGroupStack"];export{O as ContinentsEnum,o as DemoGroup,u as DemoGroupStack,s as DemoSimple,r as DemoStack,G as LanguagesEnum,W as __namedExportsOrder,a as allCountries,V as default};
