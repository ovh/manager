import{j as o}from"./jsx-runtime-BRNY0I4F.js";import{L as N,S as V}from"./FormFieldLabel-DerGjSSG-BDyW1aTt.js";import{k as i,P as a,S as e,_ as r}from"./RadioLabel-t6l-QStJ-Db27VUF5.js";import{e as Y,o as w,C as b}from"./controls-BtiQQn1l.js";import{d as v,s as d}from"./ods-docgen-map-C6vdLMLl.js";i.__docgenInfo=v.radioGroup;a.__docgenInfo=v.radio;e.__docgenInfo=v.radioControl;r.__docgenInfo=v.radioLabel;const B={argTypes:Y(["defaultValue","name","onValueChange","value"]),component:i,subcomponents:{Radio:a,RadioControl:e,RadioLabel:r},title:"Manager UI Kit/Components/Radio Group/Base"},l={render:s=>o.jsxs(i,{disabled:s.disabled,orientation:s.orientation,children:[o.jsxs(a,{invalid:s.invalid,value:"html",children:[o.jsx(e,{}),o.jsx(r,{children:"HTML"})]}),o.jsxs(a,{invalid:s.invalid,value:"css",children:[o.jsx(e,{}),o.jsx(r,{children:"CSS"})]}),o.jsxs(a,{invalid:s.invalid,value:"js",children:[o.jsx(e,{}),o.jsx(r,{children:"JavaScript"})]})]}),argTypes:w({disabled:{table:{category:b.general},control:{type:"boolean"}},invalid:{table:{category:b.general,type:{summary:"boolean"}},control:"boolean"},orientation:{table:{category:b.general,type:{summary:["horizontal","vertical"]}},control:{type:"select"},options:["horizontal","vertical"]}})},t={globals:{imports:"import { Radio, RadioControl, RadioGroup, RadioLabel } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...d()}}},render:({})=>o.jsxs(i,{children:[o.jsxs(a,{value:"html",children:[o.jsx(e,{}),o.jsx(r,{children:"HTML"})]}),o.jsxs(a,{value:"css",children:[o.jsx(e,{}),o.jsx(r,{children:"CSS"})]}),o.jsxs(a,{value:"js",children:[o.jsx(e,{}),o.jsx(r,{children:"JavaScript"})]})]})},c={globals:{imports:"import { Radio, RadioControl, RadioGroup, RadioLabel } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...d()}}},render:({})=>o.jsxs(i,{disabled:!0,children:[o.jsxs(a,{value:"html",children:[o.jsx(e,{}),o.jsx(r,{children:"HTML"})]}),o.jsxs(a,{value:"css",children:[o.jsx(e,{}),o.jsx(r,{children:"CSS"})]}),o.jsxs(a,{value:"js",children:[o.jsx(e,{}),o.jsx(r,{children:"JavaScript"})]})]})},n={globals:{imports:"import { Radio, RadioControl, RadioGroup, RadioLabel } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...d()}}},render:({})=>o.jsxs(i,{children:[o.jsxs(a,{value:"html",children:[o.jsx(e,{}),o.jsx(r,{children:"HTML"})]}),o.jsxs(a,{disabled:!0,value:"css",children:[o.jsx(e,{}),o.jsx(r,{children:"CSS"})]}),o.jsxs(a,{value:"js",children:[o.jsx(e,{}),o.jsx(r,{children:"JavaScript"})]})]})},R={globals:{imports:"import { FormField, FormFieldLabel, Radio, RadioControl, RadioGroup, RadioLabel } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...d()}}},render:({})=>o.jsxs(N,{children:[o.jsx(V,{children:"Pick a language:"}),o.jsxs(i,{children:[o.jsxs(a,{value:"html",children:[o.jsx(e,{}),o.jsx(r,{children:"HTML"})]}),o.jsxs(a,{value:"css",children:[o.jsx(e,{}),o.jsx(r,{children:"CSS"})]}),o.jsxs(a,{value:"js",children:[o.jsx(e,{}),o.jsx(r,{children:"JavaScript"})]})]})]})},u={globals:{imports:"import { Radio, RadioControl, RadioGroup, RadioLabel } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...d()}}},render:({})=>o.jsxs(i,{defaultValue:"html",children:[o.jsxs(a,{value:"html",invalid:!0,children:[o.jsx(e,{}),o.jsx(r,{children:"HTML"})]}),o.jsxs(a,{invalid:!0,value:"css",children:[o.jsx(e,{}),o.jsx(r,{children:"CSS"})]}),o.jsxs(a,{value:"js",children:[o.jsx(e,{}),o.jsx(r,{children:"JavaScript"})]})]})},p={globals:{imports:"import { Radio, RadioControl, RadioGroup, RadioLabel } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...d()}}},render:({})=>o.jsxs(i,{orientation:"horizontal",children:[o.jsxs(a,{value:"html",children:[o.jsx(e,{}),o.jsx(r,{children:"HTML"})]}),o.jsxs(a,{value:"css",children:[o.jsx(e,{}),o.jsx(r,{children:"CSS"})]}),o.jsxs(a,{value:"js",children:[o.jsx(e,{}),o.jsx(r,{children:"JavaScript"})]})]})},m={tags:["!dev"],parameters:{layout:"centered",docs:{source:{...d()}}},render:({})=>o.jsxs(i,{children:[o.jsxs(a,{value:"html",children:[o.jsx(e,{}),o.jsx(r,{children:"HTML"})]}),o.jsxs(a,{value:"css",children:[o.jsx(e,{}),o.jsx(r,{children:"CSS"})]}),o.jsxs(a,{value:"js",children:[o.jsx(e,{}),o.jsx(r,{children:"JavaScript"})]})]})};var j,h,x;l.parameters={...l.parameters,docs:{...(j=l.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: (arg: DemoArg) => <RadioGroup disabled={arg.disabled} orientation={arg.orientation}>
      <Radio invalid={arg.invalid} value="html">
        <RadioControl />

        <RadioLabel>HTML</RadioLabel>
      </Radio>

      <Radio invalid={arg.invalid} value="css">
        <RadioControl />

        <RadioLabel>CSS</RadioLabel>
      </Radio>

      <Radio invalid={arg.invalid} value="js">
        <RadioControl />

        <RadioLabel>JavaScript</RadioLabel>
      </Radio>
    </RadioGroup>,
  argTypes: orderControls({
    disabled: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: {
        type: 'boolean'
      }
    },
    invalid: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: {
          summary: 'boolean'
        }
      },
      control: 'boolean'
    },
    orientation: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: {
          summary: ['horizontal', 'vertical']
        }
      },
      control: {
        type: 'select'
      },
      options: ['horizontal', 'vertical']
    }
  })
}`,...(x=(h=l.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};var L,C,g;t.parameters={...t.parameters,docs:{...(L=t.parameters)==null?void 0:L.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Radio, RadioControl, RadioGroup, RadioLabel } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <RadioGroup>
      <Radio value="html">
        <RadioControl />

        <RadioLabel>HTML</RadioLabel>
      </Radio>

      <Radio value="css">
        <RadioControl />

        <RadioLabel>CSS</RadioLabel>
      </Radio>

      <Radio value="js">
        <RadioControl />

        <RadioLabel>JavaScript</RadioLabel>
      </Radio>
    </RadioGroup>
}`,...(g=(C=t.parameters)==null?void 0:C.docs)==null?void 0:g.source}}};var S,f,G;c.parameters={...c.parameters,docs:{...(S=c.parameters)==null?void 0:S.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Radio, RadioControl, RadioGroup, RadioLabel } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <RadioGroup disabled>
      <Radio value="html">
        <RadioControl />

        <RadioLabel>HTML</RadioLabel>
      </Radio>

      <Radio value="css">
        <RadioControl />

        <RadioLabel>CSS</RadioLabel>
      </Radio>

      <Radio value="js">
        <RadioControl />

        <RadioLabel>JavaScript</RadioLabel>
      </Radio>
    </RadioGroup>
}`,...(G=(f=c.parameters)==null?void 0:f.docs)==null?void 0:G.source}}};var T,y,F;n.parameters={...n.parameters,docs:{...(T=n.parameters)==null?void 0:T.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Radio, RadioControl, RadioGroup, RadioLabel } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <RadioGroup>
      <Radio value="html">
        <RadioControl />

        <RadioLabel>HTML</RadioLabel>
      </Radio>

      <Radio disabled value="css">
        <RadioControl />

        <RadioLabel>CSS</RadioLabel>
      </Radio>

      <Radio value="js">
        <RadioControl />

        <RadioLabel>JavaScript</RadioLabel>
      </Radio>
    </RadioGroup>
}`,...(F=(y=n.parameters)==null?void 0:y.docs)==null?void 0:F.source}}};var O,_,M;R.parameters={...R.parameters,docs:{...(O=R.parameters)==null?void 0:O.docs,source:{originalSource:`{
  globals: {
    imports: \`import { FormField, FormFieldLabel, Radio, RadioControl, RadioGroup, RadioLabel } from '@ovhcloud/ods-react';\`
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
        Pick a language:
      </FormFieldLabel>

      <RadioGroup>
        <Radio value="html">
          <RadioControl />

          <RadioLabel>HTML</RadioLabel>
        </Radio>

        <Radio value="css">
          <RadioControl />

          <RadioLabel>CSS</RadioLabel>
        </Radio>

        <Radio value="js">
          <RadioControl />

          <RadioLabel>JavaScript</RadioLabel>
        </Radio>
      </RadioGroup>
    </FormField>
}`,...(M=(_=R.parameters)==null?void 0:_.docs)==null?void 0:M.source}}};var H,J,I;u.parameters={...u.parameters,docs:{...(H=u.parameters)==null?void 0:H.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Radio, RadioControl, RadioGroup, RadioLabel } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <RadioGroup defaultValue="html">
      <Radio value="html" invalid>
        <RadioControl />

        <RadioLabel>HTML</RadioLabel>
      </Radio>

      <Radio invalid value="css">
        <RadioControl />

        <RadioLabel>CSS</RadioLabel>
      </Radio>

      <Radio value="js">
        <RadioControl />

        <RadioLabel>JavaScript</RadioLabel>
      </Radio>
    </RadioGroup>
}`,...(I=(J=u.parameters)==null?void 0:J.docs)==null?void 0:I.source}}};var D,z,E;p.parameters={...p.parameters,docs:{...(D=p.parameters)==null?void 0:D.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Radio, RadioControl, RadioGroup, RadioLabel } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <RadioGroup orientation="horizontal">
      <Radio value="html">
        <RadioControl />

        <RadioLabel>HTML</RadioLabel>
      </Radio>

      <Radio value="css">
        <RadioControl />

        <RadioLabel>CSS</RadioLabel>
      </Radio>

      <Radio value="js">
        <RadioControl />

        <RadioLabel>JavaScript</RadioLabel>
      </Radio>
    </RadioGroup>
}`,...(E=(z=p.parameters)==null?void 0:z.docs)==null?void 0:E.source}}};var A,P,k;m.parameters={...m.parameters,docs:{...(A=m.parameters)==null?void 0:A.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <RadioGroup>
      <Radio value="html">
        <RadioControl />

        <RadioLabel>HTML</RadioLabel>
      </Radio>

      <Radio value="css">
        <RadioControl />

        <RadioLabel>CSS</RadioLabel>
      </Radio>

      <Radio value="js">
        <RadioControl />

        <RadioLabel>JavaScript</RadioLabel>
      </Radio>
    </RadioGroup>
}`,...(k=(P=m.parameters)==null?void 0:P.docs)==null?void 0:k.source}}};const K=["Demo","Default","DisabledGroup","DisabledItem","InFormField","Invalid","Orientation","Overview"],Z=Object.freeze(Object.defineProperty({__proto__:null,Default:t,Demo:l,DisabledGroup:c,DisabledItem:n,InFormField:R,Invalid:u,Orientation:p,Overview:m,__namedExportsOrder:K,default:B},Symbol.toStringTag,{value:"Module"}));export{t as D,u as I,m as O,Z as R,c as a,n as b,p as c,R as d};
