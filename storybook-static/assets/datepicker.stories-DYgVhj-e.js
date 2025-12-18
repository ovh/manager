import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{h as le,e as ie}from"./Text-CcNd6qQr-D2KuMUPS.js";import{L as x,S as y,P as de}from"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import{n as pe}from"./Input-DcqcPYne-DrbRSC9d.js";import{l as r,p as n,P as o}from"./DatepickerControl-4VwQb-ep-Ct4shRTG.js";import{e as me,o as De,C as s}from"./controls-BtiQQn1l.js";import{d as h,s as a}from"./ods-docgen-map-C6vdLMLl.js";r.__docgenInfo=h.datepicker;n.__docgenInfo=h.datepickerContent;o.__docgenInfo=h.datepickerControl;const ke={argTypes:me(["dateFormatter","defaultOpen","defaultValue","defaultView","disabledDates","disabledWeekDays","i18n","max","maxView","min","minView","name","onValueChange","open","required","value","view"]),component:r,subcomponents:{DatepickerContent:n,DatepickerControl:o},title:"Manager UI Kit/Components/Datepicker/Base"},c={render:t=>e.jsxs(r,{disabled:t.disabled,invalid:t.invalid,locale:t.locale,placeholder:t.placeholder,readOnly:t.readOnly,children:[e.jsx(o,{clearable:t.clearable,loading:t.loading}),e.jsx(n,{})]}),argTypes:De({clearable:{table:{category:s.general,type:{summary:"boolean"}},control:{type:"boolean"}},disabled:{table:{category:s.general},control:{type:"boolean"}},invalid:{table:{category:s.general},control:{type:"boolean"}},loading:{table:{category:s.general,type:{summary:"boolean"}},control:{type:"boolean"}},locale:{table:{category:s.general,type:{summary:"iso code"}},control:{type:"select"},options:["de","en","es","fr","it","nl","pl","pt"]},placeholder:{table:{category:s.general},control:"text"},readOnly:{table:{category:s.general},control:{type:"boolean"}}})},l={globals:{imports:"import { Datepicker, DatepickerContent, DatepickerControl } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsxs(r,{dateFormatter:({date:t})=>`${t.getFullYear()}`,placeholder:"yyyy",children:[e.jsx(o,{}),e.jsx(n,{})]})},i={globals:{imports:"import { Datepicker, DatepickerContent, DatepickerControl } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsxs(r,{children:[e.jsx(o,{}),e.jsx(n,{})]})},d={decorators:[t=>e.jsx("div",{style:{display:"flex",flexFlow:"column",gap:"8px"},children:t()})],globals:{imports:"import { Datepicker, DatepickerContent, DatepickerControl } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"Disabled:"}),e.jsxs(r,{disabled:!0,children:[e.jsx(o,{}),e.jsx(n,{})]}),e.jsx("p",{children:"Disabled Dates:"}),e.jsxs(r,{disabledDates:[new Date(Date.now()-864e5),new Date,new Date(Date.now()+864e5)],children:[e.jsx(o,{}),e.jsx(n,{})]}),e.jsx("p",{children:"Disabled Week Days:"}),e.jsxs(r,{disabledWeekDays:[0,3],children:[e.jsx(o,{}),e.jsx(n,{})]})]})},p={globals:{imports:"import { Datepicker, DatepickerContent, DatepickerControl, FormField, FormFieldLabel } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsxs(x,{children:[e.jsx(y,{children:"Label:"}),e.jsxs(r,{children:[e.jsx(o,{}),e.jsx(n,{})]})]})},m={globals:{imports:"import { Datepicker, DatepickerContent, DatepickerControl } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsxs(r,{maxView:"day",children:[e.jsx(o,{}),e.jsx(n,{})]})},D={globals:{imports:"import { Datepicker, DatepickerContent, DatepickerControl } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsxs(r,{max:new Date(Date.now()+864e5*10),min:new Date(Date.now()-864e5*10),children:[e.jsx(o,{}),e.jsx(n,{})]})},k={globals:{imports:"import { Datepicker, DatepickerContent, DatepickerControl } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsxs(r,{minView:"month",children:[e.jsx(o,{}),e.jsx(n,{})]})},u={tags:["!dev"],parameters:{layout:"centered",docs:{source:{...a()}}},render:({})=>e.jsxs(r,{defaultValue:new Date,children:[e.jsx(o,{}),e.jsx(n,{})]})},g={globals:{imports:"import { Datepicker, DatepickerContent, DatepickerControl } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsxs(r,{readOnly:!0,children:[e.jsx(o,{}),e.jsx(n,{})]})},C={globals:{imports:"import { Datepicker, DatepickerContent, DatepickerControl, FormField, FormFieldLabel } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsxs(x,{children:[e.jsx(y,{children:"Start date:"}),e.jsxs(r,{children:[e.jsx(o,{}),e.jsx(n,{})]})]})},b={globals:{imports:"import { TEXT_PRESET, Datepicker, DatepickerContent, DatepickerControl, FormField, FormFieldHelper, FormFieldLabel, Text } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsxs(x,{children:[e.jsx(y,{children:"Start date:"}),e.jsxs(r,{children:[e.jsx(o,{placeholder:"DD-MM-YYYY"}),e.jsx(n,{})]}),e.jsx(de,{children:e.jsx(le,{preset:ie.caption,children:"Expected format: DD-MM-YYYY"})})]})},F={globals:{imports:"import { INPUT_I18N, Datepicker, DatepickerContent, DatepickerControl, FormField, FormFieldLabel } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsxs(x,{children:[e.jsx(y,{children:"Start date:"}),e.jsxs(r,{i18n:{[pe.clearButton]:"Clear date"},children:[e.jsx(o,{clearable:!0}),e.jsx(n,{})]})]})};var f,j,v;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: (arg: DemoArg) => <Datepicker disabled={arg.disabled} invalid={arg.invalid} locale={arg.locale} placeholder={arg.placeholder} readOnly={arg.readOnly}>
      <DatepickerControl clearable={arg.clearable} loading={arg.loading} />

      <DatepickerContent />
    </Datepicker>,
  argTypes: orderControls({
    clearable: {
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
        category: CONTROL_CATEGORY.general
      },
      control: {
        type: 'boolean'
      }
    },
    loading: {
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
    locale: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: {
          summary: 'iso code'
        }
      },
      control: {
        type: 'select'
      },
      options: ['de', 'en', 'es', 'fr', 'it', 'nl', 'pl', 'pt']
    },
    placeholder: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'text'
    },
    readOnly: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: {
        type: 'boolean'
      }
    }
  })
}`,...(v=(j=c.parameters)==null?void 0:j.docs)==null?void 0:v.source}}};var O,S,w;l.parameters={...l.parameters,docs:{...(O=l.parameters)==null?void 0:O.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Datepicker, DatepickerContent, DatepickerControl } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Datepicker dateFormatter={({
    date
  }) => \`\${date.getFullYear()}\`} placeholder="yyyy">
      <DatepickerControl />

      <DatepickerContent />
    </Datepicker>
}`,...(w=(S=l.parameters)==null?void 0:S.docs)==null?void 0:w.source}}};var R,T,L;i.parameters={...i.parameters,docs:{...(R=i.parameters)==null?void 0:R.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Datepicker, DatepickerContent, DatepickerControl } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Datepicker>
      <DatepickerControl />

      <DatepickerContent />
    </Datepicker>
}`,...(L=(T=i.parameters)==null?void 0:T.docs)==null?void 0:L.source}}};var Y,_,E;d.parameters={...d.parameters,docs:{...(Y=d.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'column',
    gap: '8px'
  }}>{story()}</div>],
  globals: {
    imports: \`import { Datepicker, DatepickerContent, DatepickerControl } from '@ovhcloud/ods-react';\`
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
      <p>Disabled:</p>

      <Datepicker disabled>
        <DatepickerControl />

        <DatepickerContent />
      </Datepicker>

      <p>Disabled Dates:</p>

      <Datepicker disabledDates={[new Date(Date.now() - 86400000), new Date(), new Date(Date.now() + 86400000)]}>
        <DatepickerControl />

        <DatepickerContent />
      </Datepicker>

      <p>Disabled Week Days:</p>

      <Datepicker disabledWeekDays={[0, 3]}>
        <DatepickerControl />

        <DatepickerContent />
      </Datepicker>
    </>
}`,...(E=(_=d.parameters)==null?void 0:_.docs)==null?void 0:E.source}}};var M,A,I;p.parameters={...p.parameters,docs:{...(M=p.parameters)==null?void 0:M.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Datepicker, DatepickerContent, DatepickerControl, FormField, FormFieldLabel } from '@ovhcloud/ods-react';\`
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
        Label:
      </FormFieldLabel>

      <Datepicker>
        <DatepickerControl />

        <DatepickerContent />
      </Datepicker>
    </FormField>
}`,...(I=(A=p.parameters)==null?void 0:A.docs)==null?void 0:I.source}}};var V,N,P;m.parameters={...m.parameters,docs:{...(V=m.parameters)==null?void 0:V.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Datepicker, DatepickerContent, DatepickerControl } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Datepicker maxView="day">
      <DatepickerControl />

      <DatepickerContent />
    </Datepicker>
}`,...(P=(N=m.parameters)==null?void 0:N.docs)==null?void 0:P.source}}};var G,W,H;D.parameters={...D.parameters,docs:{...(G=D.parameters)==null?void 0:G.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Datepicker, DatepickerContent, DatepickerControl } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Datepicker max={new Date(Date.now() + 86400000 * 10)} min={new Date(Date.now() - 86400000 * 10)}>
      <DatepickerControl />

      <DatepickerContent />
    </Datepicker>
}`,...(H=(W=D.parameters)==null?void 0:W.docs)==null?void 0:H.source}}};var U,B,X;k.parameters={...k.parameters,docs:{...(U=k.parameters)==null?void 0:U.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Datepicker, DatepickerContent, DatepickerControl } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Datepicker minView="month">
      <DatepickerControl />

      <DatepickerContent />
    </Datepicker>
}`,...(X=(B=k.parameters)==null?void 0:B.docs)==null?void 0:X.source}}};var $,q,z;u.parameters={...u.parameters,docs:{...($=u.parameters)==null?void 0:$.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Datepicker defaultValue={new Date()}>
      <DatepickerControl />

      <DatepickerContent />
    </Datepicker>
}`,...(z=(q=u.parameters)==null?void 0:q.docs)==null?void 0:z.source}}};var K,J,Q;g.parameters={...g.parameters,docs:{...(K=g.parameters)==null?void 0:K.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Datepicker, DatepickerContent, DatepickerControl } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Datepicker readOnly>
      <DatepickerControl />

      <DatepickerContent />
    </Datepicker>
}`,...(Q=(J=g.parameters)==null?void 0:J.docs)==null?void 0:Q.source}}};var Z,ee,re;C.parameters={...C.parameters,docs:{...(Z=C.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Datepicker, DatepickerContent, DatepickerControl, FormField, FormFieldLabel } from '@ovhcloud/ods-react';\`
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
        Start date:
      </FormFieldLabel>

      <Datepicker>
        <DatepickerControl />

        <DatepickerContent />
      </Datepicker>
    </FormField>
}`,...(re=(ee=C.parameters)==null?void 0:ee.docs)==null?void 0:re.source}}};var ne,oe,ae;b.parameters={...b.parameters,docs:{...(ne=b.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  globals: {
    imports: \`import { TEXT_PRESET, Datepicker, DatepickerContent, DatepickerControl, FormField, FormFieldHelper, FormFieldLabel, Text } from '@ovhcloud/ods-react';\`
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
        Start date:
      </FormFieldLabel>

      <Datepicker>
        <DatepickerControl placeholder="DD-MM-YYYY" />

        <DatepickerContent />
      </Datepicker>

      <FormFieldHelper>
        <Text preset={TEXT_PRESET.caption}>
          Expected format: DD-MM-YYYY
        </Text>
      </FormFieldHelper>
    </FormField>
}`,...(ae=(oe=b.parameters)==null?void 0:oe.docs)==null?void 0:ae.source}}};var te,se,ce;F.parameters={...F.parameters,docs:{...(te=F.parameters)==null?void 0:te.docs,source:{originalSource:`{
  globals: {
    imports: \`import { INPUT_I18N, Datepicker, DatepickerContent, DatepickerControl, FormField, FormFieldLabel } from '@ovhcloud/ods-react';\`
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
        Start date:
      </FormFieldLabel>

      <Datepicker i18n={{
      [INPUT_I18N.clearButton]: 'Clear date'
    }}>
        <DatepickerControl clearable />

        <DatepickerContent />
      </Datepicker>
    </FormField>
}`,...(ce=(se=F.parameters)==null?void 0:se.docs)==null?void 0:ce.source}}};const ue=["Demo","DateFormatter","Default","Disabled","InFormField","MaxView","MinMax","MinView","Overview","Readonly","AccessibilityFormField","AccessibilityDateFormat","AccessibilityI18n"],fe=Object.freeze(Object.defineProperty({__proto__:null,AccessibilityDateFormat:b,AccessibilityFormField:C,AccessibilityI18n:F,DateFormatter:l,Default:i,Demo:c,Disabled:d,InFormField:p,MaxView:m,MinMax:D,MinView:k,Overview:u,Readonly:g,__namedExportsOrder:ue,default:ke},Symbol.toStringTag,{value:"Module"}));export{C as A,fe as D,p as I,D as M,u as O,g as R,b as a,F as b,i as c,d,l as e,m as f,k as g};
