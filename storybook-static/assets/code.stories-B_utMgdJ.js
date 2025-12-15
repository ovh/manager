import{j as c}from"./jsx-runtime-BRNY0I4F.js";import{v as e}from"./Code-Bo0soTUb-CrTCIeyO.js";import{e as E,o as L,C as d}from"./controls-BtiQQn1l.js";import{d as w,s as l}from"./ods-docgen-map-C6vdLMLl.js";e.__docgenInfo=w.code;const D={argTypes:E(["onCopy"]),component:e,title:"Manager UI Kit/Components/Code/Base"},o={argTypes:L({canCopy:{table:{category:d.general},control:"boolean"},children:{table:{category:d.general},control:"text"},labelCopy:{table:{category:d.general,defaultValue:{summary:"Copy to clipboard"}},control:"text"},labelCopySuccess:{table:{category:d.general,defaultValue:{summary:"Copied"}},control:"text"}}),args:{children:"import { Text } from '@ovhcloud/ods-react';"}},r={globals:{imports:"import { Code } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...l()}}},render:({})=>c.jsx(e,{children:"console.log('Hello world');"})},n={tags:["!dev"],parameters:{docs:{source:{...l()}},layout:"centered"},render:({})=>c.jsx(e,{canCopy:!0,children:"import { Text } from '@ovhcloud/ods-react';"})},t={globals:{imports:"import { Code } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...l()}}},render:({})=>c.jsx(e,{canCopy:!0,children:"import { Text } from '@ovhcloud/ods-react';"})},a={globals:{imports:"import { Code } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...l()}}},render:({})=>c.jsx(e,{canCopy:!0,labelCopy:"Click to copy",labelCopySuccess:"Successfully copied",children:"console.log('Hello world');"})},s={globals:{imports:"import { Code } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...l()}}},render:({})=>c.jsx(e,{children:`function isTargetInElement(event, element) {
  if (!element) {
    return false;
  }

    return element.contains(event.target) || event.composedPath().includes(element);
  }`})};var m,p,u;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`{
  argTypes: orderControls({
    canCopy: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'boolean'
    },
    children: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'text'
    },
    labelCopy: {
      table: {
        category: CONTROL_CATEGORY.general,
        defaultValue: {
          summary: 'Copy to clipboard'
        }
      },
      control: 'text'
    },
    labelCopySuccess: {
      table: {
        category: CONTROL_CATEGORY.general,
        defaultValue: {
          summary: 'Copied'
        }
      },
      control: 'text'
    }
  }),
  args: {
    children: \`import { Text } from '@ovhcloud/ods-react';\`
  }
}`,...(u=(p=o.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};var i,C,g;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Code } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Code>
      console.log('Hello world');
    </Code>
}`,...(g=(C=r.parameters)==null?void 0:C.docs)==null?void 0:g.source}}};var y,f,v;n.parameters={...n.parameters,docs:{...(y=n.parameters)==null?void 0:y.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    },
    layout: 'centered'
  },
  render: ({}) => <Code canCopy>
      {\`import { Text } from '@ovhcloud/ods-react';\`}
    </Code>
}`,...(v=(f=n.parameters)==null?void 0:f.docs)==null?void 0:v.source}}};var b,h,x;t.parameters={...t.parameters,docs:{...(b=t.parameters)==null?void 0:b.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Code } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Code canCopy>
      {\`import { Text } from '@ovhcloud/ods-react';\`}
    </Code>
}`,...(x=(h=t.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};var T,O,S;a.parameters={...a.parameters,docs:{...(T=a.parameters)==null?void 0:T.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Code } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Code canCopy labelCopy="Click to copy" labelCopySuccess="Successfully copied">
      console.log('Hello world');
    </Code>
}`,...(S=(O=a.parameters)==null?void 0:O.docs)==null?void 0:S.source}}};var R,_,j;s.parameters={...s.parameters,docs:{...(R=s.parameters)==null?void 0:R.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Code } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Code>
      {\`function isTargetInElement(event, element) {
  if (!element) {
    return false;
  }

    return element.contains(event.target) || event.composedPath().includes(element);
  }\`}
    </Code>
}`,...(j=(_=s.parameters)==null?void 0:_.docs)==null?void 0:j.source}}};const M=["Demo","Default","Overview","CanCopy","CustomLabels","Multiline"],H=Object.freeze(Object.defineProperty({__proto__:null,CanCopy:t,CustomLabels:a,Default:r,Demo:o,Multiline:s,Overview:n,__namedExportsOrder:M,default:D},Symbol.toStringTag,{value:"Module"}));export{H as C,r as D,s as M,n as O,t as a,a as b};
