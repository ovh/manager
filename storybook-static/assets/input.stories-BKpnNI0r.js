import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{L as f,S as F}from"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import{p as r,t as ue,r as n,n as x}from"./Input-DcqcPYne-C5PzK7un.js";import{e as ge,o as be,C as a}from"./controls-BtiQQn1l.js";import{d as ye,s as o}from"./ods-docgen-map-C6vdLMLl.js";r.__docgenInfo=ye.input;const Ie={argTypes:ge(["i18n","locale","maskOption","onClear"]),component:r,title:"Manager UI Kit/Components/Input/Base"},s={render:h=>{const{masked:me,...ie}=h;return e.jsx(r,{maskOption:{enable:!!me},...ie})},argTypes:be({clearable:{table:{category:a.general},control:"boolean"},disabled:{table:{category:a.general,type:{summary:"boolean"}},control:"boolean"},invalid:{table:{category:a.general},control:"boolean"},loading:{table:{category:a.general},control:"boolean"},masked:{table:{category:a.general,type:{summary:"boolean"}},control:"boolean"},placeholder:{table:{category:a.general,type:{summary:"string"}},control:"text"},readOnly:{table:{category:a.general,type:{summary:"boolean"}},control:"boolean"},type:{table:{category:a.general,type:{summary:"INPUT_TYPE"}},control:{type:"select"},options:ue}})},t={globals:{imports:"import { Input } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>e.jsx(r,{clearable:!0,defaultValue:"Clearable"})},l={globals:{imports:"import { Input } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(r,{list:"ice-cream-flavors"}),e.jsxs("datalist",{id:"ice-cream-flavors",children:[e.jsx("option",{value:"Chocolate"}),e.jsx("option",{value:"Coconut"}),e.jsx("option",{value:"Mint"}),e.jsx("option",{value:"Strawberry"}),e.jsx("option",{value:"Vanilla"})]})]})},c={globals:{imports:"import { Input } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>e.jsx(r,{})},d={globals:{imports:"import { Input } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>e.jsx(r,{disabled:!0})},p={globals:{imports:"import { INPUT_TYPE, Input } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>e.jsx(r,{defaultValue:"9.99",step:"any",type:n.number})},m={globals:{imports:"import { FormField, FormFieldLabel, Input } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>e.jsxs(f,{children:[e.jsx(F,{children:"Name:"}),e.jsx(r,{})]})},i={globals:{imports:"import { Input } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>e.jsx(r,{loading:!0})},u={globals:{imports:"import { Input } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>e.jsx(r,{maskOption:{enable:!0}})},g={tags:["!dev"],parameters:{layout:"centered",docs:{source:{...o()}}},render:({})=>e.jsx(r,{placeholder:"Input"})},b={globals:{imports:"import { Input } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>e.jsx(r,{defaultValue:"Readonly",readOnly:!0})},y={decorators:[h=>e.jsx("div",{style:{display:"flex",flexFlow:"column",gap:"8px",alignItems:"start"},children:h()})],globals:{imports:"import { INPUT_TYPE, Input } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(r,{type:n.email,placeholder:"email"}),e.jsx("br",{}),e.jsx(r,{type:n.number,placeholder:"number"}),e.jsx("br",{}),e.jsx(r,{type:n.password,placeholder:"password"}),e.jsx("br",{}),e.jsx(r,{type:n.search,placeholder:"search"}),e.jsx("br",{}),e.jsx(r,{type:n.text,placeholder:"text"}),e.jsx("br",{}),e.jsx(r,{type:n.time,placeholder:"time"}),e.jsx("br",{}),e.jsx(r,{type:n.url,placeholder:"url"}),e.jsx("br",{})]})},I={globals:{imports:"import { FormField, FormFieldLabel, Input } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>e.jsxs(f,{children:[e.jsx(F,{children:"Name:"}),e.jsx(r,{})]})},v={globals:{imports:"import { INPUT_I18N, FormField, FormFieldLabel, Input } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>e.jsxs(f,{children:[e.jsx(F,{children:"Search:"}),e.jsx(r,{clearable:!0,defaultValue:"my search",i18n:{[x.clearButton]:"Clear current search",[x.searchButton]:"Search in database"},type:"search"})]})};var T,C,j;s.parameters={...s.parameters,docs:{...(T=s.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: (arg: DemoArg) => {
    const {
      masked,
      ...inputArg
    } = arg;
    return <Input maskOption={{
      enable: !!masked
    }} {...inputArg} />;
  },
  argTypes: orderControls({
    clearable: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'boolean'
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
    loading: {
      table: {
        category: CONTROL_CATEGORY.general
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
    type: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: {
          summary: 'INPUT_TYPE'
        }
      },
      control: {
        type: 'select'
      },
      options: INPUT_TYPES
    }
  })
}`,...(j=(C=s.parameters)==null?void 0:C.docs)==null?void 0:j.source}}};var O,S,N;t.parameters={...t.parameters,docs:{...(O=t.parameters)==null?void 0:O.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Input } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Input clearable defaultValue="Clearable" />
}`,...(N=(S=t.parameters)==null?void 0:S.docs)==null?void 0:N.source}}};var R,_,P;l.parameters={...l.parameters,docs:{...(R=l.parameters)==null?void 0:R.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Input } from '@ovhcloud/ods-react';\`
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
      <Input list="ice-cream-flavors" />

      <datalist id="ice-cream-flavors">
        <option value="Chocolate"></option>
        <option value="Coconut"></option>
        <option value="Mint"></option>
        <option value="Strawberry"></option>
        <option value="Vanilla"></option>
      </datalist>
    </>
}`,...(P=(_=l.parameters)==null?void 0:_.docs)==null?void 0:P.source}}};var E,L,Y;c.parameters={...c.parameters,docs:{...(E=c.parameters)==null?void 0:E.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Input } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Input />
}`,...(Y=(L=c.parameters)==null?void 0:L.docs)==null?void 0:Y.source}}};var U,A,k;d.parameters={...d.parameters,docs:{...(U=d.parameters)==null?void 0:U.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Input } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Input disabled />
}`,...(k=(A=d.parameters)==null?void 0:A.docs)==null?void 0:k.source}}};var D,w,V;p.parameters={...p.parameters,docs:{...(D=p.parameters)==null?void 0:D.docs,source:{originalSource:`{
  globals: {
    imports: \`import { INPUT_TYPE, Input } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Input defaultValue="9.99" step="any" type={INPUT_TYPE.number} />
}`,...(V=(w=p.parameters)==null?void 0:w.docs)==null?void 0:V.source}}};var G,M,B;m.parameters={...m.parameters,docs:{...(G=m.parameters)==null?void 0:G.docs,source:{originalSource:`{
  globals: {
    imports: \`import { FormField, FormFieldLabel, Input } from '@ovhcloud/ods-react';\`
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
        Name:
      </FormFieldLabel>

      <Input />
    </FormField>
}`,...(B=(M=m.parameters)==null?void 0:M.docs)==null?void 0:B.source}}};var z,K,q;i.parameters={...i.parameters,docs:{...(z=i.parameters)==null?void 0:z.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Input } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Input loading />
}`,...(q=(K=i.parameters)==null?void 0:K.docs)==null?void 0:q.source}}};var H,J,Q;u.parameters={...u.parameters,docs:{...(H=u.parameters)==null?void 0:H.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Input } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Input maskOption={{
    enable: true
  }} />
}`,...(Q=(J=u.parameters)==null?void 0:J.docs)==null?void 0:Q.source}}};var W,X,Z;g.parameters={...g.parameters,docs:{...(W=g.parameters)==null?void 0:W.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Input placeholder="Input" />
}`,...(Z=(X=g.parameters)==null?void 0:X.docs)==null?void 0:Z.source}}};var $,ee,re;b.parameters={...b.parameters,docs:{...($=b.parameters)==null?void 0:$.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Input } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Input defaultValue="Readonly" readOnly />
}`,...(re=(ee=b.parameters)==null?void 0:ee.docs)==null?void 0:re.source}}};var oe,ae,ne;y.parameters={...y.parameters,docs:{...(oe=y.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'column',
    gap: '8px',
    alignItems: 'start'
  }}>{story()}</div>],
  globals: {
    imports: \`import { INPUT_TYPE, Input } from '@ovhcloud/ods-react';\`
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
      <Input type={INPUT_TYPE.email} placeholder="email" /><br />
      <Input type={INPUT_TYPE.number} placeholder="number" /><br />
      <Input type={INPUT_TYPE.password} placeholder="password" /><br />
      <Input type={INPUT_TYPE.search} placeholder="search" /><br />
      <Input type={INPUT_TYPE.text} placeholder="text" /><br />
      <Input type={INPUT_TYPE.time} placeholder="time" /><br />
      <Input type={INPUT_TYPE.url} placeholder="url" /><br />
    </>
}`,...(ne=(ae=y.parameters)==null?void 0:ae.docs)==null?void 0:ne.source}}};var se,te,le;I.parameters={...I.parameters,docs:{...(se=I.parameters)==null?void 0:se.docs,source:{originalSource:`{
  globals: {
    imports: \`import { FormField, FormFieldLabel, Input } from '@ovhcloud/ods-react';\`
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
        Name:
      </FormFieldLabel>

      <Input />
    </FormField>
}`,...(le=(te=I.parameters)==null?void 0:te.docs)==null?void 0:le.source}}};var ce,de,pe;v.parameters={...v.parameters,docs:{...(ce=v.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  globals: {
    imports: \`import { INPUT_I18N, FormField, FormFieldLabel, Input } from '@ovhcloud/ods-react';\`
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
        Search:
      </FormFieldLabel>

      <Input clearable defaultValue="my search" i18n={{
      [INPUT_I18N.clearButton]: 'Clear current search',
      [INPUT_I18N.searchButton]: 'Search in database'
    }} type='search' />
    </FormField>
}`,...(pe=(de=v.parameters)==null?void 0:de.docs)==null?void 0:pe.source}}};const ve=["Demo","Clearable","Datalist","Default","Disabled","FloatingNumber","InFormField","Loading","Masked","Overview","ReadOnly","Types","AccessibilityFormField","AccessibilityI18n"],Ce=Object.freeze(Object.defineProperty({__proto__:null,AccessibilityFormField:I,AccessibilityI18n:v,Clearable:t,Datalist:l,Default:c,Demo:s,Disabled:d,FloatingNumber:p,InFormField:m,Loading:i,Masked:u,Overview:g,ReadOnly:b,Types:y,__namedExportsOrder:ve,default:Ie},Symbol.toStringTag,{value:"Module"}));export{I as A,t as C,c as D,p as F,Ce as I,i as L,u as M,g as O,b as R,y as T,v as a,d as b,l as c,m as d};
