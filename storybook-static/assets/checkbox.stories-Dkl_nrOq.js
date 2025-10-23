import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{h as X}from"./Text-CcNd6qQr-FOgQIkhx.js";import{e as H}from"./ods-react61-4lD3hp9p.js";import{L as p}from"./FormFieldLabel-DerGjSSG-BDyW1aTt.js";import{O as o,G as r,H as k,R as n}from"./CheckboxLabel-BNqUGOsg-lMsT6S1z.js";import{e as V,o as q,C as m}from"./controls-BtiQQn1l.js";import{d as C,s as a}from"./ods-docgen-map-C6vdLMLl.js";o.__docgenInfo=C.checkbox;r.__docgenInfo=C.checkboxControl;k.__docgenInfo=C.checkboxGroup;n.__docgenInfo=C.checkboxLabel;const z={argTypes:V(["checked","defaultChecked","name","onCheckedChange","required","value"]),component:o,subcomponents:{CheckboxControl:r,CheckboxGroup:k,CheckboxLabel:n},title:"Manager UI Kit/Components/Checkbox/Base"},s={render:c=>e.jsxs(o,{disabled:c.disabled,invalid:c.invalid,children:[e.jsx(r,{}),e.jsx(n,{children:c.label})]}),argTypes:q({disabled:{table:{category:m.general},control:"boolean"},invalid:{table:{category:m.general},control:"boolean"},label:{table:{category:m.slot},control:"text"}}),args:{label:"My checkbox"}},t={globals:{imports:"import { Checkbox, CheckboxControl } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsx(o,{children:e.jsx(r,{})})},l={globals:{imports:"import { Checkbox, CheckboxControl, CheckboxLabel } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsxs(o,{disabled:!0,children:[e.jsx(r,{}),e.jsx(n,{children:"Checkbox"})]})},d={decorators:[c=>e.jsx("div",{style:{display:"flex",flexFlow:"column",gap:"8px"},children:c()})],globals:{imports:"import { TEXT_PRESET, Checkbox, CheckboxControl, CheckboxLabel, FormField, Text } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(X,{preset:H.label,children:"Legal considerations:"}),e.jsx(p,{children:e.jsxs(o,{children:[e.jsx(r,{}),e.jsx(n,{children:"I agree to the terms and conditions."})]})}),e.jsx(p,{children:e.jsxs(o,{children:[e.jsx(r,{}),e.jsx(n,{children:"I agree to receive marketing communications."})]})})]})},b={globals:{imports:"import { Checkbox, CheckboxControl, CheckboxGroup, CheckboxLabel } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsxs(k,{defaultValue:["marketing"],name:"acknowledgments",children:[e.jsxs(o,{value:"term",children:[e.jsx(r,{}),e.jsx(n,{children:"I agree to the terms and conditions."})]}),e.jsxs(o,{value:"marketing",children:[e.jsx(r,{}),e.jsx(n,{children:"I agree to receive marketing communications."})]})]})},i={globals:{imports:"import { Checkbox, CheckboxControl, CheckboxLabel } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsxs(o,{invalid:!0,children:[e.jsx(r,{}),e.jsx(n,{children:"Checkbox"})]})},x={tags:["!dev"],parameters:{layout:"centered",docs:{source:{...a()}}},render:({})=>e.jsxs(o,{children:[e.jsx(r,{}),e.jsx(n,{children:"Checkbox"})]})},h={decorators:[c=>e.jsx("div",{style:{display:"flex",flexFlow:"column",gap:"8px"},children:c()})],globals:{imports:"import { Checkbox, CheckboxControl, CheckboxLabel } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsxs(o,{checked:!1,children:[e.jsx(r,{}),e.jsx(n,{children:"Unchecked"})]}),e.jsxs(o,{checked:!0,children:[e.jsx(r,{}),e.jsx(n,{children:"Checked"})]}),e.jsxs(o,{checked:"indeterminate",children:[e.jsx(r,{}),e.jsx(n,{children:"Indeterminate"})]})]})};var u,g,v;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: (arg: DemoArg) => <Checkbox disabled={arg.disabled} invalid={arg.invalid}>
      <CheckboxControl />

      <CheckboxLabel>
        {arg.label}
      </CheckboxLabel>
    </Checkbox>,
  argTypes: orderControls({
    disabled: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'boolean'
    },
    invalid: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'boolean'
    },
    label: {
      table: {
        category: CONTROL_CATEGORY.slot
      },
      control: 'text'
    }
  }),
  args: {
    label: 'My checkbox'
  }
}`,...(v=(g=s.parameters)==null?void 0:g.docs)==null?void 0:v.source}}};var f,j,L;t.parameters={...t.parameters,docs:{...(f=t.parameters)==null?void 0:f.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Checkbox, CheckboxControl } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Checkbox>
      <CheckboxControl />
    </Checkbox>
}`,...(L=(j=t.parameters)==null?void 0:j.docs)==null?void 0:L.source}}};var y,S,T;l.parameters={...l.parameters,docs:{...(y=l.parameters)==null?void 0:y.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Checkbox, CheckboxControl, CheckboxLabel } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Checkbox disabled>
      <CheckboxControl />

      <CheckboxLabel>
        Checkbox
      </CheckboxLabel>
    </Checkbox>
}`,...(T=(S=l.parameters)==null?void 0:S.docs)==null?void 0:T.source}}};var F,R,_;d.parameters={...d.parameters,docs:{...(F=d.parameters)==null?void 0:F.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'column',
    gap: '8px'
  }}>{story()}</div>],
  globals: {
    imports: \`import { TEXT_PRESET, Checkbox, CheckboxControl, CheckboxLabel, FormField, Text } from '@ovhcloud/ods-react';\`
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
      <Text preset={TEXT_PRESET.label}>
        Legal considerations:
      </Text>

      <FormField>
        <Checkbox>
          <CheckboxControl />

          <CheckboxLabel>
            I agree to the terms and conditions.
          </CheckboxLabel>
        </Checkbox>
      </FormField>

      <FormField>
        <Checkbox>
          <CheckboxControl />

          <CheckboxLabel>
            I agree to receive marketing communications.
          </CheckboxLabel>
        </Checkbox>
      </FormField>
    </>
}`,...(_=(R=d.parameters)==null?void 0:R.docs)==null?void 0:_.source}}};var I,O,E;b.parameters={...b.parameters,docs:{...(I=b.parameters)==null?void 0:I.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Checkbox, CheckboxControl, CheckboxGroup, CheckboxLabel } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <CheckboxGroup defaultValue={['marketing']} name="acknowledgments">
      <Checkbox value="term">
        <CheckboxControl />

        <CheckboxLabel>
          I agree to the terms and conditions.
        </CheckboxLabel>
      </Checkbox>

      <Checkbox value="marketing">
        <CheckboxControl />

        <CheckboxLabel>
          I agree to receive marketing communications.
        </CheckboxLabel>
      </Checkbox>
    </CheckboxGroup>
}`,...(E=(O=b.parameters)==null?void 0:O.docs)==null?void 0:E.source}}};var G,D,w;i.parameters={...i.parameters,docs:{...(G=i.parameters)==null?void 0:G.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Checkbox, CheckboxControl, CheckboxLabel } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Checkbox invalid>
      <CheckboxControl />

      <CheckboxLabel>
        Checkbox
      </CheckboxLabel>
    </Checkbox>
}`,...(w=(D=i.parameters)==null?void 0:D.docs)==null?void 0:w.source}}};var A,M,N;x.parameters={...x.parameters,docs:{...(A=x.parameters)==null?void 0:A.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Checkbox>
      <CheckboxControl />

      <CheckboxLabel>
        Checkbox
      </CheckboxLabel>
    </Checkbox>
}`,...(N=(M=x.parameters)==null?void 0:M.docs)==null?void 0:N.source}}};var P,Y,U;h.parameters={...h.parameters,docs:{...(P=h.parameters)==null?void 0:P.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'column',
    gap: '8px'
  }}>{story()}</div>],
  globals: {
    imports: \`import { Checkbox, CheckboxControl, CheckboxLabel } from '@ovhcloud/ods-react';\`
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
      <Checkbox checked={false}>
        <CheckboxControl />

        <CheckboxLabel>
          Unchecked
        </CheckboxLabel>
      </Checkbox>

      <Checkbox checked={true}>
        <CheckboxControl />

        <CheckboxLabel>
          Checked
        </CheckboxLabel>
      </Checkbox>

      <Checkbox checked="indeterminate">
        <CheckboxControl />

        <CheckboxLabel>
          Indeterminate
        </CheckboxLabel>
      </Checkbox>
    </>
}`,...(U=(Y=h.parameters)==null?void 0:Y.docs)==null?void 0:U.source}}};const B=["Demo","Default","Disabled","InFormField","Group","Invalid","Overview","States"],oe=Object.freeze(Object.defineProperty({__proto__:null,Default:t,Demo:s,Disabled:l,Group:b,InFormField:d,Invalid:i,Overview:x,States:h,__namedExportsOrder:B,default:z},Symbol.toStringTag,{value:"Module"}));export{oe as C,t as D,b as G,i as I,x as O,h as S,l as a,d as b};
