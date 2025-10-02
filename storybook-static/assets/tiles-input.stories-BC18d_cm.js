import{j as a}from"./jsx-runtime-BRNY0I4F.js";import{O as l}from"./index-DXhrqGIV.js";import{a1 as y}from"./manager-react-components-lib.es-CB6a8vIK.js";import"./index-Bnop-kX6.js";import"./index-D0sJu8id.js";import"./iframe-DqxQzjvh.js";import"./QueryClientProvider-DbnhbVMg.js";import"./index-D1HcsAmU.js";import"./context-Cuu9iSAu.js";function v(n){var e,t,r="";if(typeof n=="string"||typeof n=="number")r+=n;else if(typeof n=="object")if(Array.isArray(n)){var p=n.length;for(e=0;e<p;e++)n[e]&&(t=v(n[e]))&&(r&&(r+=" "),r+=t)}else for(t in n)n[t]&&(r&&(r+=" "),r+=t);return r}function T(){for(var n,e,t=0,r="",p=arguments.length;t<p;t++)(n=arguments[t])&&(e=v(n))&&(r&&(r+=" "),r+=e);return r}const N=[{name:"Morocco",continent:"AFRICA",language:"ARABIC"},{name:"Algeria",continent:"AFRICA",language:"ARABIC"},{name:"Tunisia",continent:"AFRICA",language:"ARABIC"},{name:"Cameron",continent:"AFRICA",language:"FRENCH"},{name:"South Africa",continent:"AFRICA",language:"ENGLISH"},{name:"France",continent:"EUROPE",language:"FRENCH"},{name:"Luxembourg",continent:"EUROPE",language:"FRENCH"},{name:"England",continent:"EUROPE",language:"ENGLISH"},{name:"Saoudi Arabia",continent:"ASIA",language:"ARABIC"},{name:"Palestine",continent:"ASIA",language:"ARABIC"},{name:"United states",continent:"AMERICA",language:"ENGLISH"},{name:"China",continent:"ASIA",language:"MANDARIN"}],{useArgs:j}=__STORYBOOK_MODULE_PREVIEW_API__,H={title:"Manager React Components/Components/TilesInput",component:y,parameters:{docs:{description:{component:"This is an interactive tiles input component."}}}},u=n=>{const[,e]=j();return a.jsx(y,{...n,onInput:t=>e({value:t})})},s=u.bind({}),g={items:N,value:void 0,label:n=>a.jsx(l,{preset:"span",className:"text-center w-full",children:n==null?void 0:n.name}),tileClass:{active:"font-bold text-red-500 bg-orange-100"}};s.args={...g};const o=u.bind({});o.args={...g,stack:{by:n=>n.language,label:(n,e)=>a.jsx(l,{preset:"span",className:"text-center w-full",children:`${n} (${e.length})`}),title:(n,e)=>`Countries of ${n}(${e.length}):`}};const i=u.bind({});i.args={...g,group:{by:n=>n.continent,label:(n,e,t)=>a.jsx("div",{className:T(t&&"font-bold","whitespace-nowrap px-2 text-lg"),children:a.jsx(l,{children:n===void 0?"All countries":e[0].continent})}),showAllTab:!0}};const c=u.bind({});c.args={...g,group:{by:n=>n.continent,label:(n,e,t)=>a.jsx("div",{className:T(t&&"font-bold text-[--ods-color-text]","text-[--ods-color-primary-500] whitespace-nowrap px-2 text-lg"),children:a.jsx(l,{children:n===void 0?"All countries":e[0].continent})}),showAllTab:!0},stack:{by:n=>n==null?void 0:n.language,label:(n,e)=>a.jsx(l,{preset:"span",className:"text-center w-full",children:`${n} (${e==null?void 0:e.length})`}),title:(n,e)=>`Countries of ${n}(${e==null?void 0:e.length}):`}};var m,A,d;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(d=(A=s.parameters)==null?void 0:A.docs)==null?void 0:d.source}}};var I,C,x;o.parameters={...o.parameters,docs:{...(I=o.parameters)==null?void 0:I.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(x=(C=o.parameters)==null?void 0:C.docs)==null?void 0:x.source}}};var b,f,R;i.parameters={...i.parameters,docs:{...(b=i.parameters)==null?void 0:b.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(R=(f=i.parameters)==null?void 0:f.docs)==null?void 0:R.source}}};var h,E,S;c.parameters={...c.parameters,docs:{...(h=c.parameters)==null?void 0:h.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(S=(E=c.parameters)==null?void 0:E.docs)==null?void 0:S.source}}};const P=["DemoSimple","DemoStack","DemoGroup","DemoGroupStack"];export{i as DemoGroup,c as DemoGroupStack,s as DemoSimple,o as DemoStack,P as __namedExportsOrder,H as default};
