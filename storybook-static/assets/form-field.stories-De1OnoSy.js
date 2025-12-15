import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{h as T,e as b}from"./Text-CcNd6qQr-D2KuMUPS.js";import{p as o}from"./Textarea-D6qUk_wE-C2UZKwoJ.js";import{L as r,C as u,P as t,S as a}from"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import{p as z}from"./Input-DcqcPYne-C5PzK7un.js";import{r as B}from"./index-Bnop-kX6.js";import{e as K,o as k,C as x}from"./controls-BtiQQn1l.js";import{d as g,s}from"./ods-docgen-map-C6vdLMLl.js";r.__docgenInfo=g.formField;u.__docgenInfo=g.formFieldError;t.__docgenInfo=g.formFieldHelper;a.__docgenInfo=g.formFieldLabel;const J={argTypes:K(["id","required"]),component:r,subcomponents:{FormFieldError:u,FormFieldHelper:t,FormFieldLabel:a},title:"Manager UI Kit/Components/Form Field/Base"},l={render:n=>e.jsxs(r,{invalid:n.invalid,children:[e.jsx(a,{children:n.label}),e.jsx(o,{name:"demo"}),e.jsx(t,{children:n.helperText}),e.jsx(u,{children:n.errorText})]}),argTypes:k({errorText:{table:{category:x.slot,type:{summary:"string"}},control:"text"},helperText:{table:{category:x.slot,type:{summary:"string"}},control:"text"},invalid:{table:{category:x.general},control:"boolean"},label:{table:{category:x.slot,type:{summary:"string"}},control:"text"}})},i={globals:{imports:"import { FormField, Textarea } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...s()}}},render:({})=>e.jsx(r,{children:e.jsx(o,{name:"textarea"})})},d={globals:{imports:"import { FormField, FormFieldError, Textarea } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...s()}}},render:({})=>e.jsxs(r,{invalid:!0,children:[e.jsx(o,{name:"textarea"}),e.jsx(u,{children:"Error message"})]})},m={globals:{imports:"import { TEXT_PRESET, FormField, FormFieldHelper, Text, Textarea } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...s()}}},render:({})=>e.jsxs(r,{children:[e.jsx(o,{name:"textarea"}),e.jsx(t,{children:e.jsx(T,{preset:b.caption,children:"Helper text"})})]})},c={globals:{imports:"import { FormField, FormFieldLabel, Textarea } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...s()}}},render:({})=>e.jsxs(r,{children:[e.jsx(a,{children:"Description:"}),e.jsx(o,{name:"textarea"})]})},p={tags:["!dev"],parameters:{layout:"centered",docs:{source:{...s()}}},render:({})=>{const[f,Y]=B.useState(0);function w(q){Y(q.target.value.length)}return e.jsxs(r,{invalid:f>200,children:[e.jsx(a,{children:"Description:"}),e.jsx(o,{name:"description",onInput:w}),e.jsxs(t,{style:{display:"flex",justifyContent:"space-between"},children:[e.jsx(T,{preset:b.caption,children:"Helper text"}),e.jsxs(T,{preset:b.caption,children:[f,"/",200]})]}),e.jsx(u,{children:"Error message"})]})}},F={globals:{imports:"import { FormField, FormFieldHelper, FormFieldLabel, Input } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...s()}}},render:({})=>e.jsxs(r,{children:[e.jsx(a,{children:"Login:"}),e.jsx(z,{name:"input"}),e.jsx(t,{children:"Username or email address"})]})};var E,v,h;l.parameters={...l.parameters,docs:{...(E=l.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: (args: DemoArg) => <FormField invalid={args.invalid}>
      <FormFieldLabel>
        {args.label}
      </FormFieldLabel>

      <Textarea name="demo" />

      <FormFieldHelper>
        {args.helperText}
      </FormFieldHelper>

      <FormFieldError>
        {args.errorText}
      </FormFieldError>
    </FormField>,
  argTypes: orderControls({
    errorText: {
      table: {
        category: CONTROL_CATEGORY.slot,
        type: {
          summary: 'string'
        }
      },
      control: 'text'
    },
    helperText: {
      table: {
        category: CONTROL_CATEGORY.slot,
        type: {
          summary: 'string'
        }
      },
      control: 'text'
    },
    invalid: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'boolean'
    },
    label: {
      table: {
        category: CONTROL_CATEGORY.slot,
        type: {
          summary: 'string'
        }
      },
      control: 'text'
    }
  })
}`,...(h=(v=l.parameters)==null?void 0:v.docs)==null?void 0:h.source}}};var y,j,C;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
  globals: {
    imports: \`import { FormField, Textarea } from '@ovhcloud/ods-react';\`
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
      <Textarea name="textarea" />
    </FormField>
}`,...(C=(j=i.parameters)==null?void 0:j.docs)==null?void 0:C.source}}};var _,L,O;d.parameters={...d.parameters,docs:{...(_=d.parameters)==null?void 0:_.docs,source:{originalSource:`{
  globals: {
    imports: \`import { FormField, FormFieldError, Textarea } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <FormField invalid>
      <Textarea name="textarea" />

      <FormFieldError>
        Error message
      </FormFieldError>
    </FormField>
}`,...(O=(L=d.parameters)==null?void 0:L.docs)==null?void 0:O.source}}};var S,R,H;m.parameters={...m.parameters,docs:{...(S=m.parameters)==null?void 0:S.docs,source:{originalSource:`{
  globals: {
    imports: \`import { TEXT_PRESET, FormField, FormFieldHelper, Text, Textarea } from '@ovhcloud/ods-react';\`
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
      <Textarea name="textarea" />

      <FormFieldHelper>
        <Text preset={TEXT_PRESET.caption}>
          Helper text
        </Text>
      </FormFieldHelper>
    </FormField>
}`,...(H=(R=m.parameters)==null?void 0:R.docs)==null?void 0:H.source}}};var A,I,D;c.parameters={...c.parameters,docs:{...(A=c.parameters)==null?void 0:A.docs,source:{originalSource:`{
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

      <Textarea name="textarea" />
    </FormField>
}`,...(D=(I=c.parameters)==null?void 0:I.docs)==null?void 0:D.source}}};var N,X,M;p.parameters={...p.parameters,docs:{...(N=p.parameters)==null?void 0:N.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
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
}`,...(M=(X=p.parameters)==null?void 0:X.docs)==null?void 0:M.source}}};var U,P,G;F.parameters={...F.parameters,docs:{...(U=F.parameters)==null?void 0:U.docs,source:{originalSource:`{
  globals: {
    imports: \`import { FormField, FormFieldHelper, FormFieldLabel, Input } from '@ovhcloud/ods-react';\`
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
        Login:
      </FormFieldLabel>

      <Input name="input" />

      <FormFieldHelper>
        Username or email address
      </FormFieldHelper>
    </FormField>
}`,...(G=(P=F.parameters)==null?void 0:P.docs)==null?void 0:G.source}}};const Q=["Demo","Default","Error","Helper","Label","Overview","AccessibilityLabel"],ae=Object.freeze(Object.defineProperty({__proto__:null,AccessibilityLabel:F,Default:i,Demo:l,Error:d,Helper:m,Label:c,Overview:p,__namedExportsOrder:Q,default:J},Symbol.toStringTag,{value:"Module"}));export{F as A,i as D,d as E,ae as F,m as H,c as L,p as O};
