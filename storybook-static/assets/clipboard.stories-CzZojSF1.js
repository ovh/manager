import{j as r}from"./jsx-runtime-BRNY0I4F.js";import{L as P,S as w}from"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import{u as o,b as e,C as a}from"./ClipboardTrigger-TeqCWvgk-BeUXIoiA.js";import{e as z,o as B,C as n}from"./controls-BtiQQn1l.js";import{d as g,s as l}from"./ods-docgen-map-C6vdLMLl.js";o.__docgenInfo=g.clipboard;e.__docgenInfo=g.clipboardControl;a.__docgenInfo=g.clipboardTrigger;const K={argTypes:z(["i18n","locale","onCopy"]),component:o,subcomponents:{ClipboardControl:e,ClipboardTrigger:a},title:"Manager UI Kit/Components/Clipboard/Base"},d={render:s=>r.jsxs(o,{disabled:s.disabled,value:s.value,children:[r.jsx(e,{loading:s.loading,maskOption:{enable:!!s.masked}}),r.jsx(a,{labelCopy:s.labelCopy,labelCopySuccess:s.labelCopySuccess})]}),argTypes:B({disabled:{table:{category:n.general},control:"boolean"},labelCopy:{table:{category:n.general,defaultValue:{summary:"Copy"}},control:"text"},labelCopySuccess:{table:{category:n.general,defaultValue:{summary:"Copied"}},control:"text"},loading:{table:{category:n.general,type:{summary:"boolean"}},control:"boolean"},masked:{table:{category:n.general,type:{summary:"boolean"}},control:"boolean"},value:{table:{category:n.general},control:"text"}}),args:{value:"Clipboard"}},t={globals:{imports:"import { Clipboard, ClipboardControl, ClipboardTrigger } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...l()}}},render:({})=>r.jsxs(o,{value:"Clipboard",children:[r.jsx(e,{}),r.jsx(a,{})]})},i={tags:["!dev"],parameters:{layout:"centered",docs:{source:{...l()}}},render:({})=>r.jsxs(o,{value:"Clipboard",children:[r.jsx(e,{}),r.jsx(a,{})]})},c={globals:{imports:"import { Clipboard, ClipboardControl, ClipboardTrigger } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...l()}}},render:({})=>r.jsxs(o,{value:"Masked",children:[r.jsx(e,{maskOption:{enable:!0}}),r.jsx(a,{})]})},p={globals:{imports:"import { Clipboard, ClipboardControl, ClipboardTrigger } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...l()}}},render:({})=>r.jsxs(o,{value:"Custom labels",children:[r.jsx(e,{}),r.jsx(a,{labelCopy:"Click to copy",labelCopySuccess:"Successfully copied"})]})},b={globals:{imports:"import { Clipboard, ClipboardControl, ClipboardTrigger } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...l()}}},render:({})=>r.jsxs(o,{value:"Loading",children:[r.jsx(e,{loading:!0}),r.jsx(a,{})]})},C={globals:{imports:"import { Clipboard, ClipboardControl, ClipboardTrigger } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...l()}}},render:({})=>r.jsxs(o,{value:"Disabled",disabled:!0,children:[r.jsx(e,{}),r.jsx(a,{})]})},m={globals:{imports:"import { Clipboard, ClipboardControl, ClipboardTrigger, FormField, FormFieldLabel } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...l()}}},render:({})=>r.jsxs(P,{children:[r.jsx(w,{children:"API key:"}),r.jsxs(o,{value:"loremipsum",children:[r.jsx(e,{}),r.jsx(a,{})]})]})};var u,y,v;d.parameters={...d.parameters,docs:{...(u=d.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: (arg: DemoArg) => <Clipboard disabled={arg.disabled} value={arg.value}>
      <ClipboardControl loading={arg.loading} maskOption={{
      enable: !!arg.masked
    }} />

      <ClipboardTrigger labelCopy={arg.labelCopy} labelCopySuccess={arg.labelCopySuccess} />
    </Clipboard>,
  argTypes: orderControls({
    disabled: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'boolean'
    },
    labelCopy: {
      table: {
        category: CONTROL_CATEGORY.general,
        defaultValue: {
          summary: 'Copy'
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
    },
    loading: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: {
          summary: 'boolean'
        }
      },
      control: 'boolean'
    },
    masked: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: {
          summary: 'boolean'
        }
      },
      control: 'boolean'
    },
    value: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'text'
    }
  }),
  args: {
    value: 'Clipboard'
  }
}`,...(v=(y=d.parameters)==null?void 0:y.docs)==null?void 0:v.source}}};var T,f,x;t.parameters={...t.parameters,docs:{...(T=t.parameters)==null?void 0:T.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Clipboard, ClipboardControl, ClipboardTrigger } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Clipboard value="Clipboard">
      <ClipboardControl />

      <ClipboardTrigger />
    </Clipboard>
}`,...(x=(f=t.parameters)==null?void 0:f.docs)==null?void 0:x.source}}};var O,j,S;i.parameters={...i.parameters,docs:{...(O=i.parameters)==null?void 0:O.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Clipboard value="Clipboard">
      <ClipboardControl />

      <ClipboardTrigger />
    </Clipboard>
}`,...(S=(j=i.parameters)==null?void 0:j.docs)==null?void 0:S.source}}};var R,h,F;c.parameters={...c.parameters,docs:{...(R=c.parameters)==null?void 0:R.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Clipboard, ClipboardControl, ClipboardTrigger } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Clipboard value="Masked">
      <ClipboardControl maskOption={{
      enable: true
    }} />

      <ClipboardTrigger />
    </Clipboard>
}`,...(F=(h=c.parameters)==null?void 0:h.docs)==null?void 0:F.source}}};var L,_,k;p.parameters={...p.parameters,docs:{...(L=p.parameters)==null?void 0:L.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Clipboard, ClipboardControl, ClipboardTrigger } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Clipboard value="Custom labels">
      <ClipboardControl />

      <ClipboardTrigger labelCopy="Click to copy" labelCopySuccess="Successfully copied" />
    </Clipboard>
}`,...(k=(_=p.parameters)==null?void 0:_.docs)==null?void 0:k.source}}};var A,D,E;b.parameters={...b.parameters,docs:{...(A=b.parameters)==null?void 0:A.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Clipboard, ClipboardControl, ClipboardTrigger } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Clipboard value="Loading">
      <ClipboardControl loading />

      <ClipboardTrigger />
    </Clipboard>
}`,...(E=(D=b.parameters)==null?void 0:D.docs)==null?void 0:E.source}}};var M,G,N;C.parameters={...C.parameters,docs:{...(M=C.parameters)==null?void 0:M.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Clipboard, ClipboardControl, ClipboardTrigger } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Clipboard value="Disabled" disabled>
      <ClipboardControl />

      <ClipboardTrigger />
    </Clipboard>
}`,...(N=(G=C.parameters)==null?void 0:G.docs)==null?void 0:N.source}}};var Y,I,V;m.parameters={...m.parameters,docs:{...(Y=m.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Clipboard, ClipboardControl, ClipboardTrigger, FormField, FormFieldLabel } from '@ovhcloud/ods-react';\`
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
        API key:
      </FormFieldLabel>

      <Clipboard value="loremipsum">
        <ClipboardControl />

        <ClipboardTrigger />
      </Clipboard>
    </FormField>
}`,...(V=(I=m.parameters)==null?void 0:I.docs)==null?void 0:V.source}}};const U=["Demo","Default","Overview","Masked","CustomLabels","Loading","Disabled","AccessibilityFormField"],X=Object.freeze(Object.defineProperty({__proto__:null,AccessibilityFormField:m,CustomLabels:p,Default:t,Demo:d,Disabled:C,Loading:b,Masked:c,Overview:i,__namedExportsOrder:U,default:K},Symbol.toStringTag,{value:"Module"}));export{m as A,X as C,t as D,b as L,c as M,i as O,C as a,p as b};
