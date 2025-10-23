import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{f as r,m as j,t as x,a as p,r as s}from"./Divider-THit99OS-DE11lmva.js";import{o as V,C as d}from"./controls-BtiQQn1l.js";import{d as A,s as c}from"./ods-docgen-map-C6vdLMLl.js";r.__docgenInfo=A.divider;const G={component:r,title:"Manager UI Kit/Components/Divider/Base"},n={argTypes:V({color:{table:{category:d.design,type:{summary:"DIVIDER_COLOR"}},control:{type:"select"},options:j},spacing:{table:{category:d.design,type:{summary:"DIVIDER_SPACING"}},control:{type:"select"},options:x}})},o={globals:{imports:"import { Divider } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...c()}}},render:({})=>e.jsx(r,{})},a={tags:["!dev"],parameters:{layout:"centered",docs:{source:{...c()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit."}),e.jsx(r,{color:p.primary}),e.jsx("p",{children:"Interdum et malesuada fames ac ante ipsum primis in faucibus."})]})},i={globals:{imports:"import { DIVIDER_COLOR, Divider } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...c()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(r,{color:p.neutral}),e.jsx(r,{color:p.primary})]})},t={globals:{imports:"import { DIVIDER_SPACING, Divider } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...c()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(r,{spacing:s._0}),e.jsx(r,{spacing:s._2}),e.jsx(r,{spacing:s._4}),e.jsx(r,{spacing:s._6}),e.jsx(r,{spacing:s._8}),e.jsx(r,{spacing:s._12}),e.jsx(r,{spacing:s._16}),e.jsx(r,{spacing:s._24}),e.jsx(r,{spacing:s._32}),e.jsx(r,{spacing:s._40}),e.jsx(r,{spacing:s._48}),e.jsx(r,{spacing:s._64})]})};var m,D,g;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
  argTypes: orderControls({
    color: {
      table: {
        category: CONTROL_CATEGORY.design,
        type: {
          summary: 'DIVIDER_COLOR'
        }
      },
      control: {
        type: 'select'
      },
      options: DIVIDER_COLORS
    },
    spacing: {
      table: {
        category: CONTROL_CATEGORY.design,
        type: {
          summary: 'DIVIDER_SPACING'
        }
      },
      control: {
        type: 'select'
      },
      options: DIVIDER_SPACINGS
    }
  })
}`,...(g=(D=n.parameters)==null?void 0:D.docs)==null?void 0:g.source}}};var l,I,u;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Divider } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Divider />
}`,...(u=(I=o.parameters)==null?void 0:I.docs)==null?void 0:u.source}}};var _,R,v;a.parameters={...a.parameters,docs:{...(_=a.parameters)==null?void 0:_.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      <Divider color={DIVIDER_COLOR.primary} />
      <p>Interdum et malesuada fames ac ante ipsum primis in faucibus.</p>
    </>
}`,...(v=(R=a.parameters)==null?void 0:R.docs)==null?void 0:v.source}}};var C,S,O;i.parameters={...i.parameters,docs:{...(C=i.parameters)==null?void 0:C.docs,source:{originalSource:`{
  globals: {
    imports: \`import { DIVIDER_COLOR, Divider } from '@ovhcloud/ods-react';\`
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
      <Divider color={DIVIDER_COLOR.neutral} />
      <Divider color={DIVIDER_COLOR.primary} />
    </>
}`,...(O=(S=i.parameters)==null?void 0:S.docs)==null?void 0:O.source}}};var E,f,y;t.parameters={...t.parameters,docs:{...(E=t.parameters)==null?void 0:E.docs,source:{originalSource:`{
  globals: {
    imports: \`import { DIVIDER_SPACING, Divider } from '@ovhcloud/ods-react';\`
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
      <Divider spacing={DIVIDER_SPACING._0} />
      <Divider spacing={DIVIDER_SPACING._2} />
      <Divider spacing={DIVIDER_SPACING._4} />
      <Divider spacing={DIVIDER_SPACING._6} />
      <Divider spacing={DIVIDER_SPACING._8} />
      <Divider spacing={DIVIDER_SPACING._12} />
      <Divider spacing={DIVIDER_SPACING._16} />
      <Divider spacing={DIVIDER_SPACING._24} />
      <Divider spacing={DIVIDER_SPACING._32} />
      <Divider spacing={DIVIDER_SPACING._40} />
      <Divider spacing={DIVIDER_SPACING._48} />
      <Divider spacing={DIVIDER_SPACING._64} />
    </>
}`,...(y=(f=t.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};const N=["Demo","Default","Overview","Color","Spacing"],T=Object.freeze(Object.defineProperty({__proto__:null,Color:i,Default:o,Demo:n,Overview:a,Spacing:t,__namedExportsOrder:N,default:G},Symbol.toStringTag,{value:"Module"}));export{i as C,T as D,a as O,t as S,o as a};
