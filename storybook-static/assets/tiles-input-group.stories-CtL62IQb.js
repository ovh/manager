import{j as t}from"./jsx-runtime-BRNY0I4F.js";import{c as S}from"./clsx-B-dksMZM.js";import{z as h,Q as i}from"./lib-CKnpYlbA-djy7yrp4.js";import"./index-Bnop-kX6.js";import"./iframe-CWlwMVn9.js";import"./index-4pTrEEYx.js";import"./index-GPs4uoxI.js";const f=[{name:"Morocco",continent:"AFRICA",language:"ARABIC"},{name:"Algeria",continent:"AFRICA",language:"ARABIC"},{name:"Tunisia",continent:"AFRICA",language:"ARABIC"},{name:"Cameron",continent:"AFRICA",language:"FRENCH"},{name:"South Africa",continent:"AFRICA",language:"ENGLISH"},{name:"France",continent:"EUROPE",language:"FRENCH"},{name:"Luxembourg",continent:"EUROPE",language:"FRENCH"},{name:"England",continent:"EUROPE",language:"ENGLISH"},{name:"Saoudi Arabia",continent:"ASIA",language:"ARABIC"},{name:"Palestine",continent:"ASIA",language:"ARABIC"},{name:"United states",continent:"AMERICA",language:"ENGLISH"},{name:"China",continent:"ASIA",language:"MANDARIN"}],{useArgs:G}=__STORYBOOK_MODULE_PREVIEW_API__,F={title:"Manager UI Kit/Components/TilesInputGroup",component:h,tags:["autodocs"],parameters:{docs:{description:{component:"This is an interactive tiles input component."}}}},u=n=>{const[,e]=G();return t.jsx(h,{...n,onInput:T=>e({value:T})})},a=u.bind({}),c={items:f,value:void 0,label:n=>t.jsx(i,{preset:"span",className:"text-center w-full",children:n==null?void 0:n.name}),tileClass:{active:"font-bold text-red-500 bg-orange-100"}};a.args={...c};const s=u.bind({});s.args={...c,stack:{by:n=>n==null?void 0:n.language,label:(n,e)=>t.jsx(i,{preset:"span",className:"text-center w-full",children:`${n} (${e.length})`}),title:(n,e)=>`Countries of ${n}(${e.length}):`}};const r=u.bind({});r.args={...c,group:{by:n=>n==null?void 0:n.continent,label:n=>t.jsx("div",{className:S("font-bold","whitespace-nowrap px-2 text-lg"),children:t.jsx(i,{children:n})}),showAllTab:!0}};const o=u.bind({});o.args={...c,group:{by:n=>n.continent,label:n=>t.jsx("div",{className:S("font-bold","whitespace-nowrap px-2 text-lg"),children:t.jsx(i,{children:n})}),showAllTab:!0},stack:{by:n=>n==null?void 0:n.language,label:(n,e)=>t.jsx(i,{preset:"span",className:"text-center w-full",children:`${n} (${e.length})`}),title:(n,e)=>`Countries of ${n}(${e.length}):`}};var g,l,p;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputGroupComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(p=(l=a.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};var m,A,d;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputGroupComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(d=(A=s.parameters)==null?void 0:A.docs)==null?void 0:d.source}}};var I,C,x;r.parameters={...r.parameters,docs:{...(I=r.parameters)==null?void 0:I.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputGroupComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(x=(C=r.parameters)==null?void 0:C.docs)==null?void 0:x.source}}};var b,R,E;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputGroupComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(E=(R=o.parameters)==null?void 0:R.docs)==null?void 0:E.source}}};const O=["DemoSimple","DemoStack","DemoGroup","DemoGroupStack"];export{r as DemoGroup,o as DemoGroupStack,a as DemoSimple,s as DemoStack,O as __namedExportsOrder,F as default};
