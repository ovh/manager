import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{L as q,S as B}from"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import{D as r,G as o,H as i}from"./TimepickerTimezoneList-CRVzDFsF-DbsGZTPJ.js";import{e as H,o as K,C as t}from"./controls-BtiQQn1l.js";import{d as k,s}from"./ods-docgen-map-C6vdLMLl.js";r.__docgenInfo=k.timepicker;o.__docgenInfo=k.timepickerControl;i.__docgenInfo=k.timepickerTimezoneList;const P={argTypes:H(["defaultValue","i18n","id","locale","name","onTimezoneChange","onValueChange","required","timezone","timezones","value"]),component:r,subcomponents:{TimepickerControl:o,TimepickerTimezoneList:i},title:"Manager UI Kit/Components/Timepicker/Base"},a={render:n=>e.jsxs(r,{disabled:n.disabled,invalid:n.invalid,readOnly:n.readOnly,withSeconds:n.withSeconds,children:[e.jsx(o,{}),n.withTimezones&&e.jsx(i,{})]}),argTypes:K({disabled:{table:{category:t.general},control:{type:"boolean"}},invalid:{table:{category:t.general},control:"boolean"},readOnly:{table:{category:t.general},control:"boolean"},withSeconds:{table:{category:t.general,type:{summary:"boolean"}},control:"boolean"},withTimezones:{table:{category:t.general,type:{summary:"boolean"}},control:"boolean"}})},c={globals:{imports:"import { FormField, FormFieldLabel, Timepicker, TimepickerControl, TimepickerTimezoneList } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...s()}}},render:({})=>e.jsxs(q,{children:[e.jsx(B,{children:"Starting time:"}),e.jsxs(r,{withSeconds:!0,children:[e.jsx(o,{}),e.jsx(i,{})]})]})},m={globals:{imports:"import { Timepicker, TimepickerControl } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...s()}}},render:({})=>e.jsx(r,{children:e.jsx(o,{})})},l={decorators:[n=>e.jsx("div",{style:{display:"flex",flexFlow:"column",gap:"8px"},children:n()})],globals:{imports:"import { Timepicker, TimepickerControl, TimepickerTimezoneList } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...s()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(r,{disabled:!0,children:e.jsx(o,{})}),e.jsxs(r,{disabled:!0,children:[e.jsx(o,{}),e.jsx(i,{})]})]})},d={globals:{imports:"import { FormField, FormFieldLabel, Timepicker, TimepickerControl, TimepickerTimezoneList } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...s()}}},render:({})=>e.jsxs(q,{children:[e.jsx(B,{children:"Timepicker:"}),e.jsx(r,{children:e.jsx(o,{})})]})},p={tags:["!dev"],parameters:{layout:"centered",docs:{source:{...s()}}},render:({})=>e.jsxs(r,{defaultValue:"12:00",children:[e.jsx(o,{}),e.jsx(i,{})]})},T={decorators:[n=>e.jsx("div",{style:{display:"flex",flexFlow:"column",gap:"8px"},children:n()})],globals:{imports:"import { Timepicker, TimepickerControl, TimepickerTimezoneList } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...s()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(r,{readOnly:!0,children:e.jsx(o,{})}),e.jsxs(r,{readOnly:!0,children:[e.jsx(o,{}),e.jsx(i,{})]})]})},u={decorators:[n=>e.jsx("div",{style:{display:"flex",flexFlow:"column",gap:"8px"},children:n()})],globals:{imports:"import { Timepicker, TimepickerControl, TimepickerTimezoneList } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...s()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx("span",{children:"All timezones"}),e.jsxs(r,{children:[e.jsx(o,{}),e.jsx(i,{})]}),e.jsx("span",{children:"Subset of timezone"}),e.jsxs(r,{timezones:["UTC-10","UTC+0","UTC+10"],children:[e.jsx(o,{}),e.jsx(i,{})]})]})},g={decorators:[n=>e.jsx("div",{style:{display:"flex",flexFlow:"column",gap:"8px"},children:n()})],globals:{imports:"import { Timepicker, TimepickerControl, TimepickerTimezoneList } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...s()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(r,{withSeconds:!0,children:e.jsx(o,{})}),e.jsxs(r,{withSeconds:!0,children:[e.jsx(o,{}),e.jsx(i,{})]})]})};var x,b,y;a.parameters={...a.parameters,docs:{...(x=a.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: (arg: DemoArg) => <Timepicker disabled={arg.disabled} invalid={arg.invalid} readOnly={arg.readOnly} withSeconds={arg.withSeconds}>
      <TimepickerControl />

      {arg.withTimezones && <TimepickerTimezoneList />}
    </Timepicker>,
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
        category: CONTROL_CATEGORY.general
      },
      control: 'boolean'
    },
    readOnly: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'boolean'
    },
    withSeconds: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: {
          summary: 'boolean'
        }
      },
      control: 'boolean'
    },
    withTimezones: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: {
          summary: 'boolean'
        }
      },
      control: 'boolean'
    }
  })
}`,...(y=(b=a.parameters)==null?void 0:b.docs)==null?void 0:y.source}}};var C,h,f;c.parameters={...c.parameters,docs:{...(C=c.parameters)==null?void 0:C.docs,source:{originalSource:`{
  globals: {
    imports: \`import { FormField, FormFieldLabel, Timepicker, TimepickerControl, TimepickerTimezoneList } from '@ovhcloud/ods-react';\`
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
        Starting time:
      </FormFieldLabel>

      <Timepicker withSeconds>
        <TimepickerControl />

        <TimepickerTimezoneList />
      </Timepicker>
    </FormField>
}`,...(f=(h=c.parameters)==null?void 0:h.docs)==null?void 0:f.source}}};var v,j,F;m.parameters={...m.parameters,docs:{...(v=m.parameters)==null?void 0:v.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Timepicker, TimepickerControl } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Timepicker>
      <TimepickerControl />
    </Timepicker>
}`,...(F=(j=m.parameters)==null?void 0:j.docs)==null?void 0:F.source}}};var L,S,z;l.parameters={...l.parameters,docs:{...(L=l.parameters)==null?void 0:L.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'column',
    gap: '8px'
  }}>{story()}</div>],
  globals: {
    imports: \`import { Timepicker, TimepickerControl, TimepickerTimezoneList } from '@ovhcloud/ods-react';\`
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
      <Timepicker disabled>
        <TimepickerControl />
      </Timepicker>

      <Timepicker disabled>
        <TimepickerControl />

        <TimepickerTimezoneList />
      </Timepicker>
    </>
}`,...(z=(S=l.parameters)==null?void 0:S.docs)==null?void 0:z.source}}};var O,w,R;d.parameters={...d.parameters,docs:{...(O=d.parameters)==null?void 0:O.docs,source:{originalSource:`{
  globals: {
    imports: \`import { FormField, FormFieldLabel, Timepicker, TimepickerControl, TimepickerTimezoneList } from '@ovhcloud/ods-react';\`
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
        Timepicker:
      </FormFieldLabel>

      <Timepicker>
        <TimepickerControl />
      </Timepicker>
    </FormField>
}`,...(R=(w=d.parameters)==null?void 0:w.docs)==null?void 0:R.source}}};var _,A,D;p.parameters={...p.parameters,docs:{...(_=p.parameters)==null?void 0:_.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Timepicker defaultValue="12:00">
      <TimepickerControl />

      <TimepickerTimezoneList />
    </Timepicker>
}`,...(D=(A=p.parameters)==null?void 0:A.docs)==null?void 0:D.source}}};var E,G,I;T.parameters={...T.parameters,docs:{...(E=T.parameters)==null?void 0:E.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'column',
    gap: '8px'
  }}>{story()}</div>],
  globals: {
    imports: \`import { Timepicker, TimepickerControl, TimepickerTimezoneList } from '@ovhcloud/ods-react';\`
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
      <Timepicker readOnly>
        <TimepickerControl />
      </Timepicker>

      <Timepicker readOnly>
        <TimepickerControl />

        <TimepickerTimezoneList />
      </Timepicker>
    </>
}`,...(I=(G=T.parameters)==null?void 0:G.docs)==null?void 0:I.source}}};var U,N,Y;u.parameters={...u.parameters,docs:{...(U=u.parameters)==null?void 0:U.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'column',
    gap: '8px'
  }}>{story()}</div>],
  globals: {
    imports: \`import { Timepicker, TimepickerControl, TimepickerTimezoneList } from '@ovhcloud/ods-react';\`
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
      <span>All timezones</span>

      <Timepicker>
        <TimepickerControl />

        <TimepickerTimezoneList />
      </Timepicker>

      <span>Subset of timezone</span>

      <Timepicker timezones={['UTC-10', 'UTC+0', 'UTC+10']}>
        <TimepickerControl />

        <TimepickerTimezoneList />
      </Timepicker>
    </>
}`,...(Y=(N=u.parameters)==null?void 0:N.docs)==null?void 0:Y.source}}};var V,M,W;g.parameters={...g.parameters,docs:{...(V=g.parameters)==null?void 0:V.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'column',
    gap: '8px'
  }}>{story()}</div>],
  globals: {
    imports: \`import { Timepicker, TimepickerControl, TimepickerTimezoneList } from '@ovhcloud/ods-react';\`
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
      <Timepicker withSeconds>
        <TimepickerControl />
      </Timepicker>

      <Timepicker withSeconds>
        <TimepickerControl />

        <TimepickerTimezoneList />
      </Timepicker>
    </>
}`,...(W=(M=g.parameters)==null?void 0:M.docs)==null?void 0:W.source}}};const J=["Demo","AccessibilityLabel","Default","Disabled","InFormField","Overview","Readonly","TimezoneList","WithSeconds"],re=Object.freeze(Object.defineProperty({__proto__:null,AccessibilityLabel:c,Default:m,Demo:a,Disabled:l,InFormField:d,Overview:p,Readonly:T,TimezoneList:u,WithSeconds:g,__namedExportsOrder:J,default:P},Symbol.toStringTag,{value:"Module"}));export{c as A,m as D,d as I,p as O,T as R,re as T,g as W,l as a,u as b};
