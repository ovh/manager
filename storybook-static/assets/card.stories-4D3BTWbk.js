import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{e as I,a as s}from"./ods-react236-aAAP9SXj.js";import{f as r}from"./Card-D5fMAkqX-3SHynhw3.js";import{o as T,C as l}from"./controls-BtiQQn1l.js";import{d as G,s as d}from"./ods-docgen-map-C6vdLMLl.js";r.__docgenInfo=G.card;const w={component:r,title:"Manager UI Kit/Components/Card/Base"},a={argTypes:T({color:{table:{category:l.design,type:{summary:"CARD_COLOR"}},control:"select",options:I},children:{table:{category:l.slot},control:"text"}}),args:{children:"Hello, world!"}},n={decorators:[D=>e.jsx("div",{style:{display:"flex",gap:"16px"},children:D()})],globals:{imports:"import { CARD_COLOR, Card } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...d()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(r,{color:s.critical,children:e.jsx("p",{children:"Critical"})}),e.jsx(r,{color:s.information,children:e.jsx("p",{children:"Information"})}),e.jsx(r,{color:s.neutral,children:e.jsx("p",{children:"Neutral"})}),e.jsx(r,{color:s.primary,children:e.jsx("p",{children:"Primary"})}),e.jsx(r,{color:s.success,children:e.jsx("p",{children:"Success"})}),e.jsx(r,{color:s.warning,children:e.jsx("p",{children:"Warning"})})]})},o={globals:{imports:"import { Card } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...d()}}},render:({})=>e.jsx(r,{children:e.jsxs("p",{children:["Lorem ipsum dolor sit amet, consectetur adipiscing elit.",e.jsx("br",{}),"Interdum et malesuada fames ac ante ipsum primis in faucibus."]})})},t={tags:["!dev"],parameters:{layout:"centered",docs:{source:{...d()}}},render:({})=>e.jsxs(r,{style:{padding:"8px"},children:["Lorem ipsum dolor sit amet, consectetur adipiscing elit.",e.jsx("br",{}),"Interdum et malesuada fames ac ante ipsum primis in faucibus."]})},i={globals:{imports:"import { Card } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{layout:"centered",docs:{source:{...d()}}},render:({})=>e.jsxs("ul",{style:{display:"flex",gap:"16px",padding:0,margin:0,listStyleType:"none"},children:[e.jsx("li",{children:e.jsxs(r,{style:{padding:"8px"},children:["Lorem ipsum dolor sit amet, consectetur adipiscing elit.",e.jsx("br",{}),"Interdum et malesuada fames ac ante ipsum primis in faucibus."]})}),e.jsx("li",{children:e.jsxs(r,{style:{padding:"8px"},children:["Lorem ipsum dolor sit amet, consectetur adipiscing elit.",e.jsx("br",{}),"Interdum et malesuada fames ac ante ipsum primis in faucibus."]})})]})},c={globals:{imports:"import { Card } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{layout:"centered",docs:{source:{...d()}}},render:({})=>e.jsxs("div",{role:"list",style:{display:"flex",gap:"16px"},children:[e.jsxs(r,{role:"listitem",style:{padding:"8px"},children:["Lorem ipsum dolor sit amet, consectetur adipiscing elit.",e.jsx("br",{}),"Interdum et malesuada fames ac ante ipsum primis in faucibus."]}),e.jsxs(r,{role:"listitem",style:{padding:"8px"},children:["Lorem ipsum dolor sit amet, consectetur adipiscing elit.",e.jsx("br",{}),"Interdum et malesuada fames ac ante ipsum primis in faucibus."]})]})};var m,p,u;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  argTypes: orderControls({
    color: {
      table: {
        category: CONTROL_CATEGORY.design,
        type: {
          summary: 'CARD_COLOR'
        }
      },
      control: 'select',
      options: CARD_COLORS
    },
    children: {
      table: {
        category: CONTROL_CATEGORY.slot
      },
      control: 'text'
    }
  }),
  args: {
    children: 'Hello, world!'
  }
}`,...(u=(p=a.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};var g,C,f;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    gap: '16px'
  }}>{story()}</div>],
  globals: {
    imports: \`import { CARD_COLOR, Card } from '@ovhcloud/ods-react';\`
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
      <Card color={CARD_COLOR.critical}>
        <p>Critical</p>
      </Card>

      <Card color={CARD_COLOR.information}>
        <p>Information</p>
      </Card>

      <Card color={CARD_COLOR.neutral}>
        <p>Neutral</p>
      </Card>

      <Card color={CARD_COLOR.primary}>
        <p>Primary</p>
      </Card>

      <Card color={CARD_COLOR.success}>
        <p>Success</p>
      </Card>

      <Card color={CARD_COLOR.warning}>
        <p>Warning</p>
      </Card>
    </>
}`,...(f=(C=n.parameters)==null?void 0:C.docs)==null?void 0:f.source}}};var x,y,b;o.parameters={...o.parameters,docs:{...(x=o.parameters)==null?void 0:x.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Card } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Card>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />Interdum et malesuada fames ac ante ipsum primis in faucibus.</p>
    </Card>
}`,...(b=(y=o.parameters)==null?void 0:y.docs)==null?void 0:b.source}}};var h,O,j;t.parameters={...t.parameters,docs:{...(h=t.parameters)==null?void 0:h.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Card style={{
    padding: '8px'
  }}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />
      Interdum et malesuada fames ac ante ipsum primis in faucibus.
    </Card>
}`,...(j=(O=t.parameters)==null?void 0:O.docs)==null?void 0:j.source}}};var R,v,L;i.parameters={...i.parameters,docs:{...(R=i.parameters)==null?void 0:R.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Card } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <ul style={{
    display: 'flex',
    gap: '16px',
    padding: 0,
    margin: 0,
    listStyleType: 'none'
  }}>
      <li>
        <Card style={{
        padding: '8px'
      }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />
          Interdum et malesuada fames ac ante ipsum primis in faucibus.
        </Card>
      </li>
      <li>
        <Card style={{
        padding: '8px'
      }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />
          Interdum et malesuada fames ac ante ipsum primis in faucibus.
        </Card>
      </li>
    </ul>
}`,...(L=(v=i.parameters)==null?void 0:v.docs)==null?void 0:L.source}}};var _,A,S;c.parameters={...c.parameters,docs:{...(_=c.parameters)==null?void 0:_.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Card } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <div role="list" style={{
    display: 'flex',
    gap: '16px'
  }}>
      <Card role="listitem" style={{
      padding: '8px'
    }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />
        Interdum et malesuada fames ac ante ipsum primis in faucibus.
      </Card>
      <Card role="listitem" style={{
      padding: '8px'
    }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />
        Interdum et malesuada fames ac ante ipsum primis in faucibus.
      </Card>
    </div>
}`,...(S=(A=c.parameters)==null?void 0:A.docs)==null?void 0:S.source}}};const E=["Demo","Color","Default","Overview","AccessibilityGrouping","AccessibilityAlternativeGrouping"],W=Object.freeze(Object.defineProperty({__proto__:null,AccessibilityAlternativeGrouping:c,AccessibilityGrouping:i,Color:n,Default:o,Demo:a,Overview:t,__namedExportsOrder:E,default:w},Symbol.toStringTag,{value:"Module"}));export{i as A,W as C,o as D,t as O,c as a,n as b};
