import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{r as J}from"./index-Bnop-kX6.js";import{h as b}from"./Text-CcNd6qQr-FOgQIkhx.js";import{e as T}from"./ods-react61-4lD3hp9p.js";import{p as r}from"./Textarea-D6qUk_wE-BqgQ1PRl.js";import{L as u,S as g,P as V,C as Q}from"./FormFieldLabel-DerGjSSG-BDyW1aTt.js";import{o as W,C as n}from"./controls-BtiQQn1l.js";import{d as Z,s as o}from"./ods-docgen-map-C6vdLMLl.js";r.__docgenInfo=Z.textarea;const $={component:r,title:"Manager UI Kit/Components/Textarea/Base"},a={argTypes:W({cols:{table:{category:n.general,type:{summary:"number"}},control:"number"},disabled:{table:{category:n.general,type:{summary:"boolean"}},control:"boolean"},invalid:{table:{category:n.general},control:"boolean"},placeholder:{table:{category:n.general,type:{summary:"string"}},control:"text"},readOnly:{table:{category:n.general,type:{summary:"boolean"}},control:"boolean"},rows:{table:{category:n.general,type:{summary:"number"}},control:"number"}})},t={globals:{imports:"import { FormField, FormFieldHelper, FormFieldLabel, Textarea } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>e.jsxs(u,{children:[e.jsx(g,{children:"Description:"}),e.jsx(r,{}),e.jsx(V,{children:"Enter a brief description"})]})},s={globals:{imports:"import { FormField, FormFieldLabel, Textarea } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>e.jsxs(u,{children:[e.jsx(g,{children:"Description:"}),e.jsx(r,{})]})},l={globals:{imports:"import { Textarea } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>e.jsx(r,{})},c={globals:{imports:"import { Textarea } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>e.jsx(r,{disabled:!0})},d={globals:{imports:`import { TEXT_PRESET, FormField, FormFieldError, FormFieldHelper, FormFieldLabel, Text, Textarea } from '@ovhcloud/ods-react';
import { useState } from 'react';`},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>{const[F,K]=J.useState(0);function k(q){K(q.target.value.length)}return e.jsxs(u,{invalid:F>200,children:[e.jsx(g,{children:"Description:"}),e.jsx(r,{name:"description",onInput:k}),e.jsxs(V,{style:{display:"flex",justifyContent:"space-between"},children:[e.jsx(b,{preset:T.caption,children:"Helper text"}),e.jsxs(b,{preset:T.caption,children:[F,"/",200]})]}),e.jsx(Q,{children:"Error message"})]})}},i={tags:["!dev"],parameters:{layout:"centered",docs:{source:{...o()}}},render:({})=>e.jsx(r,{placeholder:"Textarea"})},m={globals:{imports:"import { Textarea } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>e.jsx(r,{defaultValue:"Readonly",readOnly:!0})},p={globals:{imports:"import { Textarea } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>e.jsx(r,{style:{resize:"both"}})};var x,y,f;a.parameters={...a.parameters,docs:{...(x=a.parameters)==null?void 0:x.docs,source:{originalSource:`{
  argTypes: orderControls({
    cols: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: {
          summary: 'number'
        }
      },
      control: 'number'
    },
    disabled: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: {
          summary: 'boolean'
        }
      },
      control: 'boolean'
    },
    invalid: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'boolean'
    },
    placeholder: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: {
          summary: 'string'
        }
      },
      control: 'text'
    },
    readOnly: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: {
          summary: 'boolean'
        }
      },
      control: 'boolean'
    },
    rows: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: {
          summary: 'number'
        }
      },
      control: 'number'
    }
  })
}`,...(f=(y=a.parameters)==null?void 0:y.docs)==null?void 0:f.source}}};var v,C,O;t.parameters={...t.parameters,docs:{...(v=t.parameters)==null?void 0:v.docs,source:{originalSource:`{
  globals: {
    imports: \`import { FormField, FormFieldHelper, FormFieldLabel, Textarea } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <FormField>
      <FormFieldLabel>
        Description:
      </FormFieldLabel>

      <Textarea />

      <FormFieldHelper>
        Enter a brief description
      </FormFieldHelper>
    </FormField>
}`,...(O=(C=t.parameters)==null?void 0:C.docs)==null?void 0:O.source}}};var R,h,E;s.parameters={...s.parameters,docs:{...(R=s.parameters)==null?void 0:R.docs,source:{originalSource:`{
  globals: {
    imports: \`import { FormField, FormFieldLabel, Textarea } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <FormField>
      <FormFieldLabel>
        Description:
      </FormFieldLabel>

      <Textarea />
    </FormField>
}`,...(E=(h=s.parameters)==null?void 0:h.docs)==null?void 0:E.source}}};var S,j,_;l.parameters={...l.parameters,docs:{...(S=l.parameters)==null?void 0:S.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Textarea } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Textarea />
}`,...(_=(j=l.parameters)==null?void 0:j.docs)==null?void 0:_.source}}};var L,A,D;c.parameters={...c.parameters,docs:{...(L=c.parameters)==null?void 0:L.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Textarea } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Textarea disabled />
}`,...(D=(A=c.parameters)==null?void 0:A.docs)==null?void 0:D.source}}};var N,H,M;d.parameters={...d.parameters,docs:{...(N=d.parameters)==null?void 0:N.docs,source:{originalSource:`{
  globals: {
    imports: \`import { TEXT_PRESET, FormField, FormFieldError, FormFieldHelper, FormFieldLabel, Text, Textarea } from '@ovhcloud/ods-react';
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
    const MAX_COUNT = 200;
    const [count, setCount] = useState(0);
    function onInput(e: FormEvent): void {
      setCount((e.target as HTMLTextAreaElement).value.length);
    }
    return <FormField invalid={count > MAX_COUNT}>
        <FormFieldLabel>
          Description:
        </FormFieldLabel>

        <Textarea name="description" onInput={onInput} />

        <FormFieldHelper style={{
        display: 'flex',
        justifyContent: 'space-between'
      }}>
          <Text preset={TEXT_PRESET.caption}>
            Helper text
          </Text>

          <Text preset={TEXT_PRESET.caption}>
            {count}/{MAX_COUNT}
          </Text>
        </FormFieldHelper>

        <FormFieldError>
          Error message
        </FormFieldError>
      </FormField>;
  }
}`,...(M=(H=d.parameters)==null?void 0:H.docs)==null?void 0:M.source}}};var X,I,G;i.parameters={...i.parameters,docs:{...(X=i.parameters)==null?void 0:X.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Textarea placeholder="Textarea" />
}`,...(G=(I=i.parameters)==null?void 0:I.docs)==null?void 0:G.source}}};var U,Y,w;m.parameters={...m.parameters,docs:{...(U=m.parameters)==null?void 0:U.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Textarea } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Textarea defaultValue="Readonly" readOnly />
}`,...(w=(Y=m.parameters)==null?void 0:Y.docs)==null?void 0:w.source}}};var P,z,B;p.parameters={...p.parameters,docs:{...(P=p.parameters)==null?void 0:P.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Textarea } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Textarea style={{
    resize: 'both'
  }} />
}`,...(B=(z=p.parameters)==null?void 0:z.docs)==null?void 0:B.source}}};const ee=["Demo","AccessibilityDescribedBy","AccessibilityFormField","Default","Disabled","InFormField","Overview","ReadOnly","Resizable"],ie=Object.freeze(Object.defineProperty({__proto__:null,AccessibilityDescribedBy:t,AccessibilityFormField:s,Default:l,Demo:a,Disabled:c,InFormField:d,Overview:i,ReadOnly:m,Resizable:p,__namedExportsOrder:ee,default:$},Symbol.toStringTag,{value:"Module"}));export{s as A,l as D,d as I,i as O,m as R,ie as T,t as a,c as b,p as c};
