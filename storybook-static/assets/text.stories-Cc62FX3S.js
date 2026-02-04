import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{l as r,n as X,e as t}from"./Text-BGoUCJU7-BjFZdlzU.js";import{d as O,o as H,C as p,s as d}from"./ods-docgen-map-Df86OYwU.js";r.__docgenInfo=O.text;const L={component:r,title:"Manager UI Kit/Components/Text/Base"},o={argTypes:H({children:{table:{category:p.slot},control:"text"},preset:{table:{category:p.general,type:{summary:"TEXT_PRESET"}},control:{type:"select"},options:X}}),args:{children:"Lorem ipsum dolor sit amet"}},s={globals:{imports:"import { Text } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...d()}}},render:({})=>e.jsx(r,{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit."})},a={globals:{imports:"import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...d()}}},render:({})=>e.jsxs("figure",{children:[e.jsx("img",{alt:"OVHcloud logo",src:"https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/ayzwkdawmlyzvuummuf4",style:{height:"100px"}}),e.jsx("figcaption",{children:e.jsx(r,{preset:t.caption,children:"My picture title"})})]})},n={tags:["!dev"],parameters:{layout:"centered",docs:{source:{...d()}}},render:({})=>e.jsx(r,{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit."})},c={globals:{imports:"import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...d()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(r,{preset:t.caption,children:"Caption"}),e.jsx("br",{}),e.jsx(r,{preset:t.code,children:"Code"}),e.jsx("br",{}),e.jsx(r,{preset:t.label,children:"Label"}),e.jsx(r,{preset:t.paragraph,children:"Paragraph"}),e.jsx(r,{preset:t.span,children:"Span"}),e.jsx("br",{}),e.jsx(r,{preset:t.heading1,children:"Heading-1"}),e.jsx(r,{preset:t.heading2,children:"Heading-2"}),e.jsx(r,{preset:t.heading3,children:"Heading-3"}),e.jsx(r,{preset:t.heading4,children:"Heading-4"}),e.jsx(r,{preset:t.heading5,children:"Heading-5"}),e.jsx(r,{preset:t.heading6,children:"Heading-6"})]})},i={globals:{imports:"import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...d()}}},render:({})=>e.jsxs("table",{style:{border:"2px solid rgb(140 140 140)",borderCollapse:"collapse"},children:[e.jsx("caption",{style:{captionSide:"bottom"},children:e.jsx(r,{preset:"caption",children:"My table title"})}),e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{scope:"col",children:"Person"}),e.jsx("th",{scope:"col",children:"Age"})]})}),e.jsx("tbody",{children:e.jsxs("tr",{children:[e.jsx("th",{scope:"row",children:"Chris"}),e.jsx("td",{children:"22"})]})})]})};var l,T,m;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
  argTypes: orderControls({
    children: {
      table: {
        category: CONTROL_CATEGORY.slot
      },
      control: 'text'
    },
    preset: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: {
          summary: 'TEXT_PRESET'
        }
      },
      control: {
        type: 'select'
      },
      options: TEXT_PRESETS
    }
  }),
  args: {
    children: 'Lorem ipsum dolor sit amet'
  }
}`,...(m=(T=o.parameters)==null?void 0:T.docs)==null?void 0:m.source}}};var g,u,x;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Text } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Text>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </Text>
}`,...(x=(u=s.parameters)==null?void 0:u.docs)==null?void 0:x.source}}};var h,E,b;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  globals: {
    imports: \`import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <figure>
      <img alt="OVHcloud logo" src="https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/ayzwkdawmlyzvuummuf4" style={{
      height: '100px'
    }} />

      <figcaption>
        <Text preset={TEXT_PRESET.caption}>
          My picture title
        </Text>
      </figcaption>
    </figure>
}`,...(b=(E=a.parameters)==null?void 0:E.docs)==null?void 0:b.source}}};var _,S,j;n.parameters={...n.parameters,docs:{...(_=n.parameters)==null?void 0:_.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
}`,...(j=(S=n.parameters)==null?void 0:S.docs)==null?void 0:j.source}}};var R,f,y;c.parameters={...c.parameters,docs:{...(R=c.parameters)==null?void 0:R.docs,source:{originalSource:`{
  globals: {
    imports: \`import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';\`
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
      <Text preset={TEXT_PRESET.caption}>Caption</Text><br />
      <Text preset={TEXT_PRESET.code}>Code</Text><br />
      <Text preset={TEXT_PRESET.label}>Label</Text>
      <Text preset={TEXT_PRESET.paragraph}>Paragraph</Text>
      <Text preset={TEXT_PRESET.span}>Span</Text><br />
      <Text preset={TEXT_PRESET.heading1}>Heading-1</Text>
      <Text preset={TEXT_PRESET.heading2}>Heading-2</Text>
      <Text preset={TEXT_PRESET.heading3}>Heading-3</Text>
      <Text preset={TEXT_PRESET.heading4}>Heading-4</Text>
      <Text preset={TEXT_PRESET.heading5}>Heading-5</Text>
      <Text preset={TEXT_PRESET.heading6}>Heading-6</Text>
    </>
}`,...(y=(f=c.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};var P,C,v;i.parameters={...i.parameters,docs:{...(P=i.parameters)==null?void 0:P.docs,source:{originalSource:`{
  globals: {
    imports: \`import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <table style={{
    border: '2px solid rgb(140 140 140)',
    borderCollapse: 'collapse'
  }}>
      <caption style={{
      captionSide: 'bottom'
    }}>
        <Text preset="caption">
          My table title
        </Text>
      </caption>

      <thead>
      <tr>
        <th scope="col">Person</th>
        <th scope="col">Age</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <th scope="row">Chris</th>
        <td>22</td>
      </tr>
      </tbody>
    </table>
}`,...(v=(C=i.parameters)==null?void 0:C.docs)==null?void 0:v.source}}};const w=["Demo","Default","FigCaption","Overview","Preset","TableCaption"],D=Object.freeze(Object.defineProperty({__proto__:null,Default:s,Demo:o,FigCaption:a,Overview:n,Preset:c,TableCaption:i,__namedExportsOrder:w,default:L},Symbol.toStringTag,{value:"Module"}));export{s as D,a as F,n as O,c as P,D as T,i as a};
