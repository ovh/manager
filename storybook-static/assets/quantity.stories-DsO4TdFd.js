import{j as n}from"./jsx-runtime-BRNY0I4F.js";import{L as H,S as J}from"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import{F as t,L as e,B as r}from"./QuantityInput-C9HPxWFJ-BDpHMtJO.js";import{e as W,o as X,C as s}from"./controls-BtiQQn1l.js";import{d as C,s as o}from"./ods-docgen-map-C6vdLMLl.js";t.__docgenInfo=C.quantity;e.__docgenInfo=C.quantityControl;r.__docgenInfo=C.quantityInput;const Z={argTypes:W(["defaultValue","name","onValueChange","required","value"]),component:t,subcomponents:{QuantityControl:e,QuantityInput:r},title:"Manager UI Kit/Components/Quantity/Base"},i={render:a=>n.jsx(t,{disabled:a.disabled,invalid:a.invalid,max:a.max,min:a.min,readOnly:a.readOnly,step:a.step,children:n.jsx(e,{children:n.jsx(r,{placeholder:a.placeholder})})}),argTypes:X({disabled:{table:{category:s.general},control:{type:"boolean"}},invalid:{table:{category:s.general},control:"boolean"},max:{table:{category:s.general},control:{type:"number"}},min:{table:{category:s.general},control:{type:"number"}},placeholder:{table:{category:s.general,type:{summary:"string"}},control:"text"},readOnly:{table:{category:s.general},control:"boolean"},step:{table:{category:s.general},control:{type:"number"}}})},l={globals:{imports:"import { FormField, FormFieldLabel, Quantity, QuantityControl, QuantityInput } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>n.jsxs(H,{children:[n.jsx(J,{children:"Number of CPUs:"}),n.jsx(t,{max:10,min:0,children:n.jsx(e,{children:n.jsx(r,{})})})]})},u={globals:{imports:"import { Quantity, QuantityControl, QuantityInput } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>n.jsx(t,{children:n.jsx(e,{children:n.jsx(r,{})})})},c={globals:{imports:"import { Quantity, QuantityControl, QuantityInput } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>n.jsx(t,{disabled:!0,children:n.jsx(e,{children:n.jsx(r,{})})})},d={globals:{imports:"import { FormField, FormFieldLabel, Quantity, QuantityControl, QuantityInput } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>n.jsxs(H,{children:[n.jsx(J,{children:"Set a quantity:"}),n.jsx(t,{children:n.jsx(e,{children:n.jsx(r,{})})})]})},m={globals:{imports:"import { Quantity, QuantityControl, QuantityInput } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>n.jsx(t,{max:10,children:n.jsx(e,{children:n.jsx(r,{})})})},p={globals:{imports:"import { Quantity, QuantityControl, QuantityInput } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>n.jsx(t,{min:0,children:n.jsx(e,{children:n.jsx(r,{})})})},y={tags:["!dev"],parameters:{layout:"centered",docs:{source:{...o()}}},render:({})=>n.jsx(t,{defaultValue:"0",min:0,children:n.jsx(e,{children:n.jsx(r,{})})})},Q={globals:{imports:"import { Quantity, QuantityControl, QuantityInput } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>n.jsx(t,{readOnly:!0,children:n.jsx(e,{children:n.jsx(r,{})})})},g={globals:{imports:"import { Quantity, QuantityControl, QuantityInput } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>n.jsx(t,{step:10,children:n.jsx(e,{children:n.jsx(r,{})})})};var b,x,h;i.parameters={...i.parameters,docs:{...(b=i.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: (arg: DemoArg) => <Quantity disabled={arg.disabled} invalid={arg.invalid} max={arg.max} min={arg.min} readOnly={arg.readOnly} step={arg.step}>
      <QuantityControl>
        <QuantityInput placeholder={arg.placeholder} />
      </QuantityControl>
    </Quantity>,
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
    max: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: {
        type: 'number'
      }
    },
    min: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: {
        type: 'number'
      }
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
        category: CONTROL_CATEGORY.general
      },
      control: 'boolean'
    },
    step: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: {
        type: 'number'
      }
    }
  })
}`,...(h=(x=i.parameters)==null?void 0:x.docs)==null?void 0:h.source}}};var v,f,F;l.parameters={...l.parameters,docs:{...(v=l.parameters)==null?void 0:v.docs,source:{originalSource:`{
  globals: {
    imports: \`import { FormField, FormFieldLabel, Quantity, QuantityControl, QuantityInput } from '@ovhcloud/ods-react';\`
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
        Number of CPUs:
      </FormFieldLabel>

      <Quantity max={10} min={0}>
        <QuantityControl>
          <QuantityInput />
        </QuantityControl>
      </Quantity>
    </FormField>
}`,...(F=(f=l.parameters)==null?void 0:f.docs)==null?void 0:F.source}}};var j,O,I;u.parameters={...u.parameters,docs:{...(j=u.parameters)==null?void 0:j.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Quantity, QuantityControl, QuantityInput } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Quantity>
      <QuantityControl>
        <QuantityInput />
      </QuantityControl>
    </Quantity>
}`,...(I=(O=u.parameters)==null?void 0:O.docs)==null?void 0:I.source}}};var R,S,L;c.parameters={...c.parameters,docs:{...(R=c.parameters)==null?void 0:R.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Quantity, QuantityControl, QuantityInput } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Quantity disabled>
      <QuantityControl>
        <QuantityInput />
      </QuantityControl>
    </Quantity>
}`,...(L=(S=c.parameters)==null?void 0:S.docs)==null?void 0:L.source}}};var T,_,A;d.parameters={...d.parameters,docs:{...(T=d.parameters)==null?void 0:T.docs,source:{originalSource:`{
  globals: {
    imports: \`import { FormField, FormFieldLabel, Quantity, QuantityControl, QuantityInput } from '@ovhcloud/ods-react';\`
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
        Set a quantity:
      </FormFieldLabel>

      <Quantity>
        <QuantityControl>
          <QuantityInput />
        </QuantityControl>
      </Quantity>
    </FormField>
}`,...(A=(_=d.parameters)==null?void 0:_.docs)==null?void 0:A.source}}};var E,N,D;m.parameters={...m.parameters,docs:{...(E=m.parameters)==null?void 0:E.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Quantity, QuantityControl, QuantityInput } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Quantity max={10}>
      <QuantityControl>
        <QuantityInput />
      </QuantityControl>
    </Quantity>
}`,...(D=(N=m.parameters)==null?void 0:N.docs)==null?void 0:D.source}}};var G,M,Y;p.parameters={...p.parameters,docs:{...(G=p.parameters)==null?void 0:G.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Quantity, QuantityControl, QuantityInput } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Quantity min={0}>
      <QuantityControl>
        <QuantityInput />
      </QuantityControl>
    </Quantity>
}`,...(Y=(M=p.parameters)==null?void 0:M.docs)==null?void 0:Y.source}}};var q,V,B;y.parameters={...y.parameters,docs:{...(q=y.parameters)==null?void 0:q.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Quantity defaultValue="0" min={0}>
      <QuantityControl>
        <QuantityInput />
      </QuantityControl>
    </Quantity>
}`,...(B=(V=y.parameters)==null?void 0:V.docs)==null?void 0:B.source}}};var P,U,w;Q.parameters={...Q.parameters,docs:{...(P=Q.parameters)==null?void 0:P.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Quantity, QuantityControl, QuantityInput } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Quantity readOnly>
      <QuantityControl>
        <QuantityInput />
      </QuantityControl>
    </Quantity>
}`,...(w=(U=Q.parameters)==null?void 0:U.docs)==null?void 0:w.source}}};var z,K,k;g.parameters={...g.parameters,docs:{...(z=g.parameters)==null?void 0:z.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Quantity, QuantityControl, QuantityInput } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Quantity step={10}>
      <QuantityControl>
        <QuantityInput />
      </QuantityControl>
    </Quantity>
}`,...(k=(K=g.parameters)==null?void 0:K.docs)==null?void 0:k.source}}};const $=["Demo","AccessibilityLabel","Default","Disabled","InFormField","Max","Min","Overview","Readonly","Step"],an=Object.freeze(Object.defineProperty({__proto__:null,AccessibilityLabel:l,Default:u,Demo:i,Disabled:c,InFormField:d,Max:m,Min:p,Overview:y,Readonly:Q,Step:g,__namedExportsOrder:$,default:Z},Symbol.toStringTag,{value:"Module"}));export{l as A,u as D,d as I,m as M,y as O,an as Q,Q as R,g as S,c as a,p as b};
