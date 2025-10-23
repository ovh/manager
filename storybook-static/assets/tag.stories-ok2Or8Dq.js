import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{e as B,a as s}from"./ods-react236-aAAP9SXj.js";import{b as r,t as K,r as T}from"./Tag-B7nBeuPX-CPCfmWrN.js";import{e as U,o as k,C as p}from"./controls-BtiQQn1l.js";import{d as q,s as o}from"./ods-docgen-map-C6vdLMLl.js";r.__docgenInfo=q.tag;const H={argTypes:U(["onRemove"]),component:r,title:"Manager UI Kit/Components/Tag/Base"},a={argTypes:k({color:{table:{category:p.design,type:{summary:"TAG_COLOR"}},control:{type:"select"},options:B},children:{table:{category:p.general},control:"text"},disabled:{table:{category:p.general,type:{summary:"boolean"}},control:{type:"boolean"}},size:{table:{category:p.design,type:{summary:"TAG_SIZE"}},control:{type:"select"},options:K}}),args:{children:"My tag"}},n={decorators:[u=>e.jsx("div",{style:{display:"flex",flexFlow:"row",gap:"8px",alignItems:"center"},children:u()})],globals:{imports:"import { TAG_COLOR, Tag } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{layout:"centered",docs:{source:{...o()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(r,{color:s.critical,children:"Critical"}),e.jsx(r,{color:s.information,children:"Information"}),e.jsx(r,{color:s.neutral,children:"Neutral"}),e.jsx(r,{color:s.primary,children:"Primary"}),e.jsx(r,{color:s.success,children:"Success"}),e.jsx(r,{color:s.warning,children:"Warning"})]})},t={globals:{imports:"import { Tag } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{layout:"centered",docs:{source:{...o()}}},render:({})=>e.jsx(r,{children:"My tag"})},c={globals:{imports:"import { Tag } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{layout:"centered",docs:{source:{...o()}}},render:({})=>e.jsx(r,{disabled:!0,children:"My tag"})},i={tags:["!dev"],parameters:{layout:"centered",docs:{source:{...o()}}},render:({})=>e.jsx(r,{children:"My tag"})},l={decorators:[u=>e.jsx("div",{style:{display:"flex",flexFlow:"row",gap:"8px",alignItems:"center"},children:u()})],globals:{imports:"import { TAG_SIZE, Tag } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{layout:"centered",docs:{source:{...o()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(r,{size:T.md,children:"MD tag"}),e.jsx(r,{size:T.lg,children:"LG tag"})]})},d={globals:{imports:"import { Tag } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>e.jsxs("ul",{children:[e.jsx("li",{children:e.jsx(r,{children:"Design"})}),e.jsx("li",{children:e.jsx(r,{children:"Development"})}),e.jsx("li",{children:e.jsx(r,{children:"Accessibility"})})]})},g={globals:{imports:"import { Tag } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>e.jsxs("div",{role:"list",children:[e.jsx("div",{role:"listitem",children:e.jsx(r,{children:"Design"})}),e.jsx("div",{role:"listitem",children:e.jsx(r,{children:"Development"})}),e.jsx("div",{role:"listitem",children:e.jsx(r,{children:"Accessibility"})})]})},m={globals:{imports:"import { Tag } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>e.jsx(r,{"aria-label":"Remove my tag",children:"My tag"})};var y,v,b;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`{
  argTypes: orderControls({
    color: {
      table: {
        category: CONTROL_CATEGORY.design,
        type: {
          summary: 'TAG_COLOR'
        }
      },
      control: {
        type: 'select'
      },
      options: TAG_COLORS
    },
    children: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'text'
    },
    disabled: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: {
          summary: 'boolean'
        }
      },
      control: {
        type: 'boolean'
      }
    },
    size: {
      table: {
        category: CONTROL_CATEGORY.design,
        type: {
          summary: 'TAG_SIZE'
        }
      },
      control: {
        type: 'select'
      },
      options: TAG_SIZES
    }
  }),
  args: {
    children: 'My tag'
  }
}`,...(b=(v=a.parameters)==null?void 0:v.docs)==null?void 0:b.source}}};var x,h,f;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'row',
    gap: '8px',
    alignItems: 'center'
  }}>{story()}</div>],
  globals: {
    imports: \`import { TAG_COLOR, Tag } from '@ovhcloud/ods-react';\`
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
  render: ({}) => <>
      <Tag color={TAG_COLOR.critical}>Critical</Tag>
      <Tag color={TAG_COLOR.information}>Information</Tag>
      <Tag color={TAG_COLOR.neutral}>Neutral</Tag>
      <Tag color={TAG_COLOR.primary}>Primary</Tag>
      <Tag color={TAG_COLOR.success}>Success</Tag>
      <Tag color={TAG_COLOR.warning}>Warning</Tag>
    </>
}`,...(f=(h=n.parameters)==null?void 0:h.docs)==null?void 0:f.source}}};var O,C,A;t.parameters={...t.parameters,docs:{...(O=t.parameters)==null?void 0:O.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Tag } from '@ovhcloud/ods-react';\`
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
  render: ({}) => <Tag>
      My tag
    </Tag>
}`,...(A=(C=t.parameters)==null?void 0:C.docs)==null?void 0:A.source}}};var R,S,j;c.parameters={...c.parameters,docs:{...(R=c.parameters)==null?void 0:R.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Tag } from '@ovhcloud/ods-react';\`
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
  render: ({}) => <Tag disabled>
      My tag
    </Tag>
}`,...(j=(S=c.parameters)==null?void 0:S.docs)==null?void 0:j.source}}};var _,G,L;i.parameters={...i.parameters,docs:{...(_=i.parameters)==null?void 0:_.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Tag>
      My tag
    </Tag>
}`,...(L=(G=i.parameters)==null?void 0:G.docs)==null?void 0:L.source}}};var D,I,M;l.parameters={...l.parameters,docs:{...(D=l.parameters)==null?void 0:D.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'row',
    gap: '8px',
    alignItems: 'center'
  }}>{story()}</div>],
  globals: {
    imports: \`import { TAG_SIZE, Tag } from '@ovhcloud/ods-react';\`
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
  render: ({}) => <>
      <Tag size={TAG_SIZE.md}>MD tag</Tag>
      <Tag size={TAG_SIZE.lg}>LG tag</Tag>
    </>
}`,...(M=(I=l.parameters)==null?void 0:I.docs)==null?void 0:M.source}}};var E,w,z;d.parameters={...d.parameters,docs:{...(E=d.parameters)==null?void 0:E.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Tag } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <ul>
      <li>
        <Tag>Design</Tag>
      </li>

      <li>
        <Tag>Development</Tag>
      </li>

      <li>
        <Tag>Accessibility</Tag>
      </li>
    </ul>
}`,...(z=(w=d.parameters)==null?void 0:w.docs)==null?void 0:z.source}}};var F,N,Z;g.parameters={...g.parameters,docs:{...(F=g.parameters)==null?void 0:F.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Tag } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <div role="list">
      <div role="listitem">
        <Tag>Design</Tag>
      </div>

      <div role="listitem">
        <Tag>Development</Tag>
      </div>

      <div role="listitem">
        <Tag>Accessibility</Tag>
      </div>
    </div>
}`,...(Z=(N=g.parameters)==null?void 0:N.docs)==null?void 0:Z.source}}};var Y,P,W;m.parameters={...m.parameters,docs:{...(Y=m.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Tag } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Tag aria-label="Remove my tag">
      My tag
    </Tag>
}`,...(W=(P=m.parameters)==null?void 0:P.docs)==null?void 0:W.source}}};const J=["Demo","Color","Default","Disabled","Overview","Size","AccessibilityList","AccessibilityAriaRoles","AccessibilityAriaLabel"],re=Object.freeze(Object.defineProperty({__proto__:null,AccessibilityAriaLabel:m,AccessibilityAriaRoles:g,AccessibilityList:d,Color:n,Default:t,Demo:a,Disabled:c,Overview:i,Size:l,__namedExportsOrder:J,default:H},Symbol.toStringTag,{value:"Module"}));export{d as A,n as C,t as D,i as O,l as S,re as T,g as a,m as b,c};
