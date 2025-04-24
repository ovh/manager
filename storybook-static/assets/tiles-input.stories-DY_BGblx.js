import{j as a}from"./jsx-runtime-BRNY0I4F.js";import{O as c}from"./index-w9OafIJF.js";import{c as y}from"./clsx-B-dksMZM.js";import{T as N}from"./TilesInput.component-Cwa8xEFT.js";import"./index-Bnop-kX6.js";import"./index-4pTrEEYx.js";import"./ods-toggle2-B24SOLJO.js";import"./Tabs.component-CI4tuupm.js";import"./index-CYx7_Ein.js";import"./v4-CQkTLCs1.js";const{Channel:H}=__STORYBOOK_MODULE_CHANNELS__,{global:h}=__STORYBOOK_MODULE_GLOBAL__,{logger:g}=__STORYBOOK_MODULE_CLIENT_LOGGER__,{STORY_RENDERED:oe,UPDATE_STORY_ARGS:L,RESET_STORY_ARGS:$,UPDATE_GLOBALS:ae,FORCE_RE_RENDER:se}=__STORYBOOK_MODULE_CORE_EVENTS__;function B(){let e={setHandler:()=>{},send:()=>{}};return new H({transport:e})}var G=class{constructor(){this.getChannel=()=>{if(!this.channel){let e=B();return this.setChannel(e),e}return this.channel},this.getServerChannel=()=>{if(!this.serverChannel)throw new Error("Accessing non-existent serverChannel");return this.serverChannel},this.ready=()=>this.promise,this.hasChannel=()=>!!this.channel,this.hasServerChannel=()=>!!this.serverChannel,this.setChannel=e=>{this.channel=e,this.resolve()},this.setServerChannel=e=>{this.serverChannel=e},this.promise=new Promise(e=>{this.resolve=()=>e(this.getChannel())})}},A="__STORYBOOK_ADDONS_PREVIEW";function P(){return h[A]||(h[A]=new G),h[A]}var U=P(),j=(e,n)=>e.length===n.length&&e.every((t,o)=>t===n[o]),C=()=>new Error("Storybook preview hooks can only be called inside decorators and story functions.");function F(){return h.STORYBOOK_HOOKS_CONTEXT||null}function D(){let e=F();if(e==null)throw C();return e}function Y(e,n,t){let o=D();if(o.currentPhase==="MOUNT"){t!=null&&!Array.isArray(t)&&g.warn(`${e} received a final argument that is not an array (instead, received ${t}). When specified, the final argument must be an array.`);let r={name:e,deps:t};return o.currentHooks.push(r),n(r),r}if(o.currentPhase==="UPDATE"){let r=o.getNextHook();if(r==null)throw new Error("Rendered more hooks than during the previous render.");return r.name!==e&&g.warn(`Storybook has detected a change in the order of Hooks${o.currentDecoratorName?` called by ${o.currentDecoratorName}`:""}. This will lead to bugs and errors if not fixed.`),t!=null&&r.deps==null&&g.warn(`${e} received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.`),t!=null&&r.deps!=null&&t.length!==r.deps.length&&g.warn(`The final argument passed to ${e} changed size between renders. The order and size of this array must remain constant.
Previous: ${r.deps}
Incoming: ${t}`),(t==null||r.deps==null||!j(t,r.deps))&&(n(r),r.deps=t),r}throw C()}function M(e,n,t){let{memoizedState:o}=Y(e,r=>{r.memoizedState=n()},t);return o}function E(e,n){return M("useCallback",()=>e,n)}function K(){let{currentContext:e}=D();if(e==null)throw C();return e}function z(){let e=U.getChannel(),{id:n,args:t}=K(),o=E(p=>e.emit(L,{storyId:n,updatedArgs:p}),[e,n]),r=E(p=>e.emit($,{storyId:n,argNames:p}),[e,n]);return[t,o,r]}const V=[{name:"Morocco",continent:"AFRICA",language:"ARABIC"},{name:"Algeria",continent:"AFRICA",language:"ARABIC"},{name:"Tunisia",continent:"AFRICA",language:"ARABIC"},{name:"Cameron",continent:"AFRICA",language:"FRENCH"},{name:"South Africa",continent:"AFRICA",language:"ENGLISH"},{name:"France",continent:"EUROPE",language:"FRENCH"},{name:"Luxembourg",continent:"EUROPE",language:"FRENCH"},{name:"England",continent:"EUROPE",language:"ENGLISH"},{name:"Saoudi Arabia",continent:"ASIA",language:"ARABIC"},{name:"Palestine",continent:"ASIA",language:"ARABIC"},{name:"United states",continent:"AMERICA",language:"ENGLISH"},{name:"China",continent:"ASIA",language:"MANDARIN"}],ie={title:"Components/TilesInput",component:N,parameters:{docs:{description:{component:"This is an interactive tiles input component."}}}},m=e=>{const[,n]=z();return a.jsx(N,{...e,onInput:t=>n({value:t})})},s=m.bind({}),d={items:V,value:void 0,label:e=>a.jsx(c,{preset:"span",className:"text-center w-full",children:e==null?void 0:e.name}),tileClass:{active:"font-bold text-red-500 bg-orange-100"}};s.args={...d};const i=m.bind({});i.args={...d,stack:{by:e=>e.language,label:(e,n)=>a.jsx(c,{preset:"span",className:"text-center w-full",children:`${e} (${n.length})`}),title:(e,n)=>`Countries of ${e}(${n.length}):`}};const l=m.bind({});l.args={...d,group:{by:e=>e.continent,label:(e,n,t)=>a.jsx("div",{className:y(t&&"font-bold","whitespace-nowrap px-2 text-lg"),children:a.jsx(c,{children:e===void 0?"All countries":n[0].continent})}),showAllTab:!0}};const u=m.bind({});u.args={...d,group:{by:e=>e.continent,label:(e,n,t)=>a.jsx("div",{className:y(t&&"font-bold text-[--ods-color-text]","text-[--ods-color-primary-500] whitespace-nowrap px-2 text-lg"),children:a.jsx(c,{children:e===void 0?"All countries":n[0].continent})}),showAllTab:!0},stack:{by:e=>e==null?void 0:e.language,label:(e,n)=>a.jsx(c,{preset:"span",className:"text-center w-full",children:`${e} (${n==null?void 0:n.length})`}),title:(e,n)=>`Countries of ${e}(${n==null?void 0:n.length}):`}};var S,O,_;s.parameters={...s.parameters,docs:{...(S=s.parameters)==null?void 0:S.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(_=(O=s.parameters)==null?void 0:O.docs)==null?void 0:_.source}}};var f,R,T;i.parameters={...i.parameters,docs:{...(f=i.parameters)==null?void 0:f.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(T=(R=i.parameters)==null?void 0:R.docs)==null?void 0:T.source}}};var v,I,b;l.parameters={...l.parameters,docs:{...(v=l.parameters)==null?void 0:v.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(b=(I=l.parameters)==null?void 0:I.docs)==null?void 0:b.source}}};var x,w,k;u.parameters={...u.parameters,docs:{...(x=u.parameters)==null?void 0:x.docs,source:{originalSource:`args => {
  const [, updateArgs] = useArgs();
  return <TilesInputComponent<TCountry, string, {
    continent: string;
    key: string;
  }> {...args} onInput={country => updateArgs({
    value: country
  })} />;
}`,...(k=(w=u.parameters)==null?void 0:w.docs)==null?void 0:k.source}}};const le=["DemoSimple","DemoStack","DemoGroup","DemoGroupStack"];export{l as DemoGroup,u as DemoGroupStack,s as DemoSimple,i as DemoStack,le as __namedExportsOrder,ie as default};
