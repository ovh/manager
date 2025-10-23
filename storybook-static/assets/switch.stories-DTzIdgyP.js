import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{h as P}from"./Text-CcNd6qQr-FOgQIkhx.js";import{e as G}from"./ods-react61-4lD3hp9p.js";import{b as r,v as t,t as M,r as S}from"./SwitchItem-bGtISEN6-D2kiHTKw.js";import{e as N,o as X,C as n}from"./controls-BtiQQn1l.js";import{d as V,s as i}from"./ods-docgen-map-C6vdLMLl.js";r.__docgenInfo=V.switch;t.__docgenInfo=V.switchItem;const Y={argTypes:N(["defaultValue","onValueChange","value"]),component:r,subcomponents:{SwitchItem:t},title:"Manager UI Kit/Components/Switch/Base"},a={render:s=>e.jsxs(r,{...s,children:[e.jsx(t,{value:"item-1",children:"Item 1"}),e.jsx(t,{value:"item-2",children:"Item 2"}),e.jsx(t,{value:"item-3",children:"Item 3"})]}),argTypes:X({disabled:{table:{category:n.general},control:"boolean"},size:{table:{category:n.design,type:{summary:"SWITCH_SIZE"}},control:{type:"select"},options:M}})},c={globals:{imports:"import { Switch, SwitchItem } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...i()}}},render:({})=>e.jsxs(r,{"aria-label":"Select an item",children:[e.jsx(t,{value:"item-1",children:"Item 1"}),e.jsx(t,{value:"item-2",children:"Item 2"}),e.jsx(t,{value:"item-3",children:"Item 3"})]})},m={decorators:[s=>e.jsx("div",{style:{display:"flex",flexFlow:"column",alignItems:"start"},children:s()})],globals:{imports:"import { TEXT_PRESET, Switch, SwitchItem, Text } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...i()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(P,{id:"switch-label",preset:G.label,children:"Select an item:"}),e.jsxs(r,{"aria-labelledby":"switch-label",children:[e.jsx(t,{value:"item-1",children:"Item 1"}),e.jsx(t,{value:"item-2",children:"Item 2"}),e.jsx(t,{value:"item-3",children:"Item 3"})]})]})},o={globals:{imports:"import { Switch, SwitchItem } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...i()}}},render:({})=>e.jsxs(r,{defaultValue:"item-1",children:[e.jsx(t,{value:"item-1",children:"Item 1"}),e.jsx(t,{value:"item-2",children:"Item 2"}),e.jsx(t,{value:"item-3",children:"Item 3"})]})},l={globals:{imports:"import { Switch, SwitchItem } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...i()}}},render:({})=>e.jsxs(r,{children:[e.jsx(t,{value:"item-1",children:"Item 1"}),e.jsx(t,{value:"item-2",children:"Item 2"}),e.jsx(t,{value:"item-3",children:"Item 3"})]})},d={globals:{imports:"import { Switch, SwitchItem } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...i()}}},render:({})=>e.jsxs(r,{disabled:!0,children:[e.jsx(t,{value:"item-1",children:"Item 1"}),e.jsx(t,{value:"item-2",children:"Item 2"}),e.jsx(t,{value:"item-3",children:"Item 3"})]})},h={tags:["!dev"],parameters:{layout:"centered",docs:{source:{...i()}}},render:({})=>e.jsxs(r,{defaultValue:"item-1",children:[e.jsx(t,{value:"item-1",children:"Item 1"}),e.jsx(t,{value:"item-2",children:"Item 2"}),e.jsx(t,{value:"item-3",children:"Item 3"})]})},I={decorators:[s=>e.jsx("div",{style:{display:"flex",flexFlow:"row",gap:"8px",alignItems:"center"},children:s()})],globals:{imports:"import { SWITCH_SIZE, Switch, SwitchItem } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...i()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsxs(r,{size:S.sm,children:[e.jsx(t,{value:"item-1",children:"Item 1"}),e.jsx(t,{value:"item-2",children:"Item 2"}),e.jsx(t,{value:"item-3",children:"Item 3"})]}),e.jsxs(r,{size:S.md,children:[e.jsx(t,{value:"item-1",children:"Item 1"}),e.jsx(t,{value:"item-2",children:"Item 2"}),e.jsx(t,{value:"item-3",children:"Item 3"})]})]})};var u,w,p;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: arg => <Switch {...arg}>
      <SwitchItem value="item-1">Item 1</SwitchItem>
      <SwitchItem value="item-2">Item 2</SwitchItem>
      <SwitchItem value="item-3">Item 3</SwitchItem>
    </Switch>,
  argTypes: orderControls({
    disabled: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'boolean'
    },
    size: {
      table: {
        category: CONTROL_CATEGORY.design,
        type: {
          summary: 'SWITCH_SIZE'
        }
      },
      control: {
        type: 'select'
      },
      options: SWITCH_SIZES
    }
  })
}`,...(p=(w=a.parameters)==null?void 0:w.docs)==null?void 0:p.source}}};var v,g,x;c.parameters={...c.parameters,docs:{...(v=c.parameters)==null?void 0:v.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Switch, SwitchItem } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Switch aria-label="Select an item">
      <SwitchItem value="item-1">Item 1</SwitchItem>
      <SwitchItem value="item-2">Item 2</SwitchItem>
      <SwitchItem value="item-3">Item 3</SwitchItem>
    </Switch>
}`,...(x=(g=c.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};var b,f,j;m.parameters={...m.parameters,docs:{...(b=m.parameters)==null?void 0:b.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'start'
  }}>{story()}</div>],
  globals: {
    imports: \`import { TEXT_PRESET, Switch, SwitchItem, Text } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <>
      <Text id="switch-label" preset={TEXT_PRESET.label}>
        Select an item:
      </Text>

      <Switch aria-labelledby="switch-label">
        <SwitchItem value="item-1">Item 1</SwitchItem>
        <SwitchItem value="item-2">Item 2</SwitchItem>
        <SwitchItem value="item-3">Item 3</SwitchItem>
      </Switch>
    </>
}`,...(j=(f=m.parameters)==null?void 0:f.docs)==null?void 0:j.source}}};var y,C,T;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Switch, SwitchItem } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Switch defaultValue="item-1">
      <SwitchItem value="item-1">Item 1</SwitchItem>
      <SwitchItem value="item-2">Item 2</SwitchItem>
      <SwitchItem value="item-3">Item 3</SwitchItem>
    </Switch>
}`,...(T=(C=o.parameters)==null?void 0:C.docs)==null?void 0:T.source}}};var _,E,R;l.parameters={...l.parameters,docs:{...(_=l.parameters)==null?void 0:_.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Switch, SwitchItem } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Switch>
      <SwitchItem value="item-1">Item 1</SwitchItem>
      <SwitchItem value="item-2">Item 2</SwitchItem>
      <SwitchItem value="item-3">Item 3</SwitchItem>
    </Switch>
}`,...(R=(E=l.parameters)==null?void 0:E.docs)==null?void 0:R.source}}};var O,A,z;d.parameters={...d.parameters,docs:{...(O=d.parameters)==null?void 0:O.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Switch, SwitchItem } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Switch disabled>
      <SwitchItem value="item-1">Item 1</SwitchItem>
      <SwitchItem value="item-2">Item 2</SwitchItem>
      <SwitchItem value="item-3">Item 3</SwitchItem>
    </Switch>
}`,...(z=(A=d.parameters)==null?void 0:A.docs)==null?void 0:z.source}}};var D,F,H;h.parameters={...h.parameters,docs:{...(D=h.parameters)==null?void 0:D.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Switch defaultValue="item-1">
      <SwitchItem value="item-1">Item 1</SwitchItem>
      <SwitchItem value="item-2">Item 2</SwitchItem>
      <SwitchItem value="item-3">Item 3</SwitchItem>
    </Switch>
}`,...(H=(F=h.parameters)==null?void 0:F.docs)==null?void 0:H.source}}};var L,W,Z;I.parameters={...I.parameters,docs:{...(L=I.parameters)==null?void 0:L.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'row',
    gap: '8px',
    alignItems: 'center'
  }}>{story()}</div>],
  globals: {
    imports: \`import { SWITCH_SIZE, Switch, SwitchItem } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <>
      <Switch size={SWITCH_SIZE.sm}>
        <SwitchItem value="item-1">Item 1</SwitchItem>
        <SwitchItem value="item-2">Item 2</SwitchItem>
        <SwitchItem value="item-3">Item 3</SwitchItem>
      </Switch>

      <Switch size={SWITCH_SIZE.md}>
        <SwitchItem value="item-1">Item 1</SwitchItem>
        <SwitchItem value="item-2">Item 2</SwitchItem>
        <SwitchItem value="item-3">Item 3</SwitchItem>
      </Switch>
    </>
}`,...(Z=(W=I.parameters)==null?void 0:W.docs)==null?void 0:Z.source}}};const k=["Demo","AccessibilityAriaLabel","AccessibilityAriaLabelledby","Checked","Default","Disabled","Overview","Sizes"],$=Object.freeze(Object.defineProperty({__proto__:null,AccessibilityAriaLabel:c,AccessibilityAriaLabelledby:m,Checked:o,Default:l,Demo:a,Disabled:d,Overview:h,Sizes:I,__namedExportsOrder:k,default:Y},Symbol.toStringTag,{value:"Module"}));export{c as A,o as C,l as D,h as O,$ as S,m as a,d as b,I as c};
