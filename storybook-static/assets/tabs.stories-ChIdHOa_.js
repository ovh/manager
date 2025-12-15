import{j as a}from"./jsx-runtime-BRNY0I4F.js";import{r as B}from"./index-Bnop-kX6.js";import{G as t,_ as s,m as e,h as b}from"./TabContent-fruP9qhA-Dd2qW9V5.js";import{o as K,C as P}from"./controls-BtiQQn1l.js";import{d as U,s as k}from"./ods-docgen-map-C6vdLMLl.js";t.__docgenInfo=U.table;const q={component:t,title:"Manager UI Kit/Components/Tabs/Base"},r={render:c=>a.jsxs(t,{defaultValue:"tab1",withArrows:c.withArrows,children:[a.jsxs(s,{children:[a.jsx(e,{value:"tab1",children:"Tab 1"}),a.jsx(e,{value:"tab2",children:"Tab 2"}),a.jsx(e,{value:"tab3",children:"Tab 3"}),a.jsx(e,{value:"tab4",children:"Tab 4"}),a.jsx(e,{value:"tab5",children:"Tab 5"}),a.jsx(e,{value:"tab6",children:"Tab 6"})]}),a.jsx(b,{value:"tab1",children:a.jsx("p",{children:"Tab 1 Content"})}),a.jsx(b,{value:"tab2",children:a.jsx("p",{children:"Tab 2 Content"})}),a.jsx(b,{value:"tab3",children:a.jsx("p",{children:"Tab 3 Content"})}),a.jsx(b,{value:"tab4",children:a.jsx("p",{children:"Tab 4 Content"})}),a.jsx(b,{value:"tab5",children:a.jsx("p",{children:"Tab 5 Content"})}),a.jsx(b,{value:"tab6",children:a.jsx("p",{children:"Tab 6 Content"})})]}),argTypes:K({withArrows:{table:{category:P.design},control:{type:"boolean"}}})},l={tags:["!dev"],parameters:{layout:"centered"},render:({})=>a.jsx(t,{defaultValue:"tab1",children:a.jsxs(s,{children:[a.jsx(e,{value:"tab1",children:"Tab 1"}),a.jsx(e,{value:"tab2",children:"Tab 2"}),a.jsx(e,{value:"tab3",children:"Tab 3"})]})})},T={globals:{imports:`import { Tabs, TabList, Tab } from '@ovhcloud/ods-react';
import { useState } from 'react';`},tags:["!dev"],parameters:{docs:{source:{...k()}}},render:({})=>{const[c,N]=B.useState("tab1"),Y=z=>{N(z.value)};return a.jsx(t,{onValueChange:Y,value:c,children:a.jsxs(s,{children:[a.jsx(e,{value:"tab1",children:"Tab 1"}),a.jsx(e,{value:"tab2",children:"Tab 2"}),a.jsx(e,{value:"tab3",children:"Tab 3"})]})})}},o={globals:{imports:"import { Tabs, TabList, Tab } from '@ovhcloud/ods-react';"},tags:["!dev"],render:({})=>a.jsx(t,{defaultValue:"tab1",children:a.jsxs(s,{children:[a.jsx(e,{value:"tab1",children:"Tab 1"}),a.jsx(e,{value:"tab2",children:"Tab 2"}),a.jsx(e,{value:"tab3",children:"Tab 3"})]})})},n={globals:{imports:"import { Tabs, TabList, Tab } from '@ovhcloud/ods-react';"},tags:["!dev"],render:({})=>a.jsx(t,{defaultValue:"tab1",children:a.jsxs(s,{children:[a.jsx(e,{value:"tab1",children:"Tab 1"}),a.jsx(e,{value:"tab2",disabled:!0,children:"Tab 2"}),a.jsx(e,{value:"tab3",children:"Tab 3"})]})})},d={globals:{imports:"import { Tabs, TabList, Tab } from '@ovhcloud/ods-react';"},tags:["!dev"],render:({})=>a.jsx("div",{style:{width:"300px"},children:a.jsx(t,{defaultValue:"tab1",children:a.jsxs(s,{children:[a.jsx(e,{value:"tab1",children:"Tab 1"}),a.jsx(e,{value:"tab2",children:"Tab 2"}),a.jsx(e,{value:"tab3",children:"Tab 3"}),a.jsx(e,{value:"tab4",children:"Tab 4"}),a.jsx(e,{value:"tab5",children:"Tab 5"}),a.jsx(e,{value:"tab6",children:"Tab 6"})]})})})},u={globals:{imports:"import { Tabs, TabList, Tab } from '@ovhcloud/ods-react';"},tags:["!dev"],render:({})=>a.jsx(t,{defaultValue:"tab1",withArrows:!0,children:a.jsxs(s,{children:[a.jsx(e,{value:"tab1",children:"Tab 1"}),a.jsx(e,{value:"tab2",children:"Tab 2"}),a.jsx(e,{value:"tab3",children:"Tab 3"}),a.jsx(e,{value:"tab4",children:"Tab 4"}),a.jsx(e,{value:"tab5",children:"Tab 5"}),a.jsx(e,{value:"tab6",children:"Tab 6"}),a.jsx(e,{value:"tab7",children:"Tab 7"}),a.jsx(e,{value:"tab8",children:"Tab 8"}),a.jsx(e,{value:"tab9",children:"Tab 9"}),a.jsx(e,{value:"tab10",children:"Tab 10"}),a.jsx(e,{value:"tab11",children:"Tab 11"}),a.jsx(e,{value:"tab12",children:"Tab 12"}),a.jsx(e,{value:"tab13",children:"Tab 13"}),a.jsx(e,{value:"tab14",children:"Tab 14"}),a.jsx(e,{value:"tab15",children:"Tab 15"})]})})},i={globals:{imports:"import { Tabs, TabContent, TabList, Tab } from '@ovhcloud/ods-react';"},tags:["!dev"],render:({})=>a.jsxs(t,{defaultValue:"tab1",children:[a.jsxs(s,{children:[a.jsx(e,{value:"tab1",children:"Tab 1"}),a.jsx(e,{value:"tab2",children:"Tab 2"}),a.jsx(e,{value:"tab3",children:"Tab 3"})]}),a.jsx(b,{value:"tab1",children:a.jsx("p",{children:"Content 1"})}),a.jsx(b,{value:"tab2",children:a.jsx("p",{children:"Content 2"})}),a.jsx(b,{value:"tab3",children:a.jsx("p",{children:"Content 3"})})]})};var v,h,p;r.parameters={...r.parameters,docs:{...(v=r.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: arg => <Tabs defaultValue='tab1' withArrows={arg.withArrows}>
      <TabList>
        <Tab value="tab1">Tab 1</Tab>
        <Tab value="tab2">Tab 2</Tab>
        <Tab value="tab3">Tab 3</Tab>
        <Tab value="tab4">Tab 4</Tab>
        <Tab value="tab5">Tab 5</Tab>
        <Tab value="tab6">Tab 6</Tab>
      </TabList>

      <TabContent value="tab1">
        <p>Tab 1 Content</p>
      </TabContent>

      <TabContent value="tab2">
        <p>Tab 2 Content</p>
      </TabContent>

      <TabContent value="tab3">
        <p>Tab 3 Content</p>
      </TabContent>

      <TabContent value="tab4">
        <p>Tab 4 Content</p>
      </TabContent>

      <TabContent value="tab5">
        <p>Tab 5 Content</p>
      </TabContent>

      <TabContent value="tab6">
        <p>Tab 6 Content</p>
      </TabContent>
    </Tabs>,
  argTypes: orderControls({
    withArrows: {
      table: {
        category: CONTROL_CATEGORY.design
      },
      control: {
        type: 'boolean'
      }
    }
  })
}`,...(p=(h=r.parameters)==null?void 0:h.docs)==null?void 0:p.source}}};var m,x,j;l.parameters={...l.parameters,docs:{...(m=l.parameters)==null?void 0:m.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    layout: 'centered'
  },
  render: ({}) => <Tabs defaultValue="tab1">
      <TabList>
        <Tab value="tab1">Tab 1</Tab>
        <Tab value="tab2">Tab 2</Tab>
        <Tab value="tab3">Tab 3</Tab>
      </TabList>
    </Tabs>
}`,...(j=(x=l.parameters)==null?void 0:x.docs)==null?void 0:j.source}}};var C,g,f;T.parameters={...T.parameters,docs:{...(C=T.parameters)==null?void 0:C.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Tabs, TabList, Tab } from '@ovhcloud/ods-react';
import { useState } from 'react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => {
    const [value, setValue] = useState('tab1');
    const handleValueChange = (event: TabsValueChangeEvent) => {
      setValue(event.value);
    };
    return <Tabs onValueChange={handleValueChange} value={value}>
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
          <Tab value="tab3">Tab 3</Tab>
        </TabList>
      </Tabs>;
  }
}`,...(f=(g=T.parameters)==null?void 0:g.docs)==null?void 0:f.source}}};var L,w,V;o.parameters={...o.parameters,docs:{...(L=o.parameters)==null?void 0:L.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Tabs, TabList, Tab } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  render: ({}) => <Tabs defaultValue='tab1'>
      <TabList>
        <Tab value="tab1">Tab 1</Tab>
        <Tab value="tab2">Tab 2</Tab>
        <Tab value="tab3">Tab 3</Tab>
      </TabList>
    </Tabs>
}`,...(V=(w=o.parameters)==null?void 0:w.docs)==null?void 0:V.source}}};var S,O,y;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Tabs, TabList, Tab } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  render: ({}) => <Tabs defaultValue="tab1">
      <TabList>
        <Tab value="tab1">Tab 1</Tab>
        <Tab value="tab2" disabled>Tab 2</Tab>
        <Tab value="tab3">Tab 3</Tab>
      </TabList>
    </Tabs>
}`,...(y=(O=n.parameters)==null?void 0:O.docs)==null?void 0:y.source}}};var A,_,D;d.parameters={...d.parameters,docs:{...(A=d.parameters)==null?void 0:A.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Tabs, TabList, Tab } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  render: ({}) => <div style={{
    width: '300px'
  }}>
      <Tabs defaultValue="tab1">
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
          <Tab value="tab3">Tab 3</Tab>
          <Tab value="tab4">Tab 4</Tab>
          <Tab value="tab5">Tab 5</Tab>
          <Tab value="tab6">Tab 6</Tab>
        </TabList>
      </Tabs>
    </div>
}`,...(D=(_=d.parameters)==null?void 0:_.docs)==null?void 0:D.source}}};var R,E,W;u.parameters={...u.parameters,docs:{...(R=u.parameters)==null?void 0:R.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Tabs, TabList, Tab } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  render: ({}) => <Tabs defaultValue="tab1" withArrows>
      <TabList>
        <Tab value="tab1">Tab 1</Tab>
        <Tab value="tab2">Tab 2</Tab>
        <Tab value="tab3">Tab 3</Tab>
        <Tab value="tab4">Tab 4</Tab>
        <Tab value="tab5">Tab 5</Tab>
        <Tab value="tab6">Tab 6</Tab>
        <Tab value="tab7">Tab 7</Tab>
        <Tab value="tab8">Tab 8</Tab>
        <Tab value="tab9">Tab 9</Tab>
        <Tab value="tab10">Tab 10</Tab>
        <Tab value="tab11">Tab 11</Tab>
        <Tab value="tab12">Tab 12</Tab>
        <Tab value="tab13">Tab 13</Tab>
        <Tab value="tab14">Tab 14</Tab>
        <Tab value="tab15">Tab 15</Tab>
      </TabList>
    </Tabs>
}`,...(W=(E=u.parameters)==null?void 0:E.docs)==null?void 0:W.source}}};var G,M,I;i.parameters={...i.parameters,docs:{...(G=i.parameters)==null?void 0:G.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Tabs, TabContent, TabList, Tab } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  render: ({}) => <Tabs defaultValue="tab1">
      <TabList>
        <Tab value="tab1">Tab 1</Tab>
        <Tab value="tab2">Tab 2</Tab>
        <Tab value="tab3">Tab 3</Tab>
      </TabList>
      <TabContent value="tab1">
        <p>Content 1</p>
      </TabContent>
      <TabContent value="tab2">
        <p>Content 2</p>
      </TabContent>
      <TabContent value="tab3">
        <p>Content 3</p>
      </TabContent>
    </Tabs>
}`,...(I=(M=i.parameters)==null?void 0:M.docs)==null?void 0:I.source}}};const F=["Demo","Overview","Controlled","Default","Disabled","Overflow","WithArrows","WithContent"],$=Object.freeze(Object.defineProperty({__proto__:null,Controlled:T,Default:o,Demo:r,Disabled:n,Overflow:d,Overview:l,WithArrows:u,WithContent:i,__namedExportsOrder:F,default:q},Symbol.toStringTag,{value:"Module"}));export{T as C,n as D,l as O,$ as T,i as W,d as a,u as b};
