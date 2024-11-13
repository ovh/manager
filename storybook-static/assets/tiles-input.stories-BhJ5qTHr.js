import{j as t}from"./jsx-runtime-CKrituN3.js";import{c}from"./index-DWFHwCPM.js";import{c as h}from"./v4-DDYElseJ.js";import{T as E}from"./TilesInput.component-BuAlv7ui.js";import"./index-CBqU2yxZ.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-BtM5VmRH.js";import"./Tabs.component-BRnNSs-C.js";import"./index-Q-VytQcI.js";const f=[{name:"Morocco",continent:"AFRICA",language:"ARABIC"},{name:"Algeria",continent:"AFRICA",language:"ARABIC"},{name:"Tunisia",continent:"AFRICA",language:"ARABIC"},{name:"Cameron",continent:"AFRICA",language:"FRENCH"},{name:"South Africa",continent:"AFRICA",language:"ENGLISH"},{name:"France",continent:"EUROPE",language:"FRENCH"},{name:"Luxembourg",continent:"EUROPE",language:"FRENCH"},{name:"England",continent:"EUROPE",language:"ENGLISH"},{name:"Saoudi Arabia",continent:"ASIA",language:"ARABIC"},{name:"Palestine",continent:"ASIA",language:"ARABIC"},{name:"United states",continent:"AMERICA",language:"ENGLISH"},{name:"China",continent:"ASIA",language:"MANDARIN"}],{useArgs:N}=__STORYBOOK_MODULE_CLIENT_API__,$={title:"Components/TilesInput",component:E,parameters:{docs:{description:{component:"This is an interactive tiles input component."}}}},l=n=>{const[,e]=N();return t.jsx(E,{...n,onInput:a=>e({value:a})})},r=l.bind({}),u={items:f,value:void 0,label:n=>t.jsx(c,{preset:"span",className:"text-center w-full",children:n==null?void 0:n.name}),tileClass:{active:"font-bold text-red-500 bg-orange-100"}};r.args={...u};const s=l.bind({});s.args={...u,stack:{by:n=>n.language,label:(n,e)=>t.jsx(c,{preset:"span",className:"text-center w-full",children:`${n} (${e.length})`}),title:(n,e)=>`Countries of ${n}(${e.length}):`}};const o=l.bind({});o.args={...u,group:{by:n=>n.continent,label:(n,e,a)=>t.jsx("div",{className:h(a&&"font-bold","whitespace-nowrap px-2 text-lg"),children:t.jsx(c,{children:n===void 0?"All countries":e[0].continent})}),showAllTab:!0}};const i=l.bind({});i.args={...u,group:{by:n=>n.continent,label:(n,e,a)=>t.jsx("div",{className:h(a&&"font-bold text-[--ods-color-text]","text-[--ods-color-primary-500] whitespace-nowrap px-2 text-lg"),children:t.jsx(c,{children:n===void 0?"All countries":e[0].continent})}),showAllTab:!0},stack:{by:n=>n==null?void 0:n.language,label:(n,e)=>t.jsx(c,{preset:"span",className:"text-center w-full",children:`${n} (${e==null?void 0:e.length})`}),title:(n,e)=>`Countries of ${n}(${e==null?void 0:e.length}):`}};var g,p,m;r.parameters={...r.parameters,docs:{...(g=r.parameters)==null?void 0:g.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(m=(p=r.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var A,d,I;s.parameters={...s.parameters,docs:{...(A=s.parameters)==null?void 0:A.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(I=(d=s.parameters)==null?void 0:d.docs)==null?void 0:I.source}}};var C,x,b;o.parameters={...o.parameters,docs:{...(C=o.parameters)==null?void 0:C.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(b=(x=o.parameters)==null?void 0:x.docs)==null?void 0:b.source}}};var R,S,T;i.parameters={...i.parameters,docs:{...(R=i.parameters)==null?void 0:R.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(T=(S=i.parameters)==null?void 0:S.docs)==null?void 0:T.source}}};const G=["DemoSimple","DemoStack","DemoGroup","DemoGroupStack"];export{o as DemoGroup,i as DemoGroupStack,r as DemoSimple,s as DemoStack,G as __namedExportsOrder,$ as default};
//# sourceMappingURL=tiles-input.stories-BhJ5qTHr.js.map
