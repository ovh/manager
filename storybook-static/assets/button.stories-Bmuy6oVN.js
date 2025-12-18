import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{r as T}from"./index-Bnop-kX6.js";import{t as S}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l as N}from"./ods-react60-0db41gCx.js";import{x as r,r as Oe,o as Te,s as A,t as I}from"./Button-BC-ipw2F-CXZv4wj7.js";import{e as Se,a}from"./ods-react236-aAAP9SXj.js";import{o as Ne,C as c}from"./controls-BtiQQn1l.js";import{d as Ae,s as t}from"./ods-docgen-map-C6vdLMLl.js";r.__docgenInfo=Ae.button;const Ie={component:r,title:"Manager UI Kit/Components/Button/Base"},l={argTypes:Ne({children:{table:{category:c.slot},control:"text"},color:{table:{category:c.design,type:{summary:"BUTTON_COLOR"}},control:{type:"select"},options:Se},disabled:{table:{category:c.general,type:{summary:"boolean"}},control:"boolean"},loading:{table:{category:c.general},control:"boolean"},size:{table:{category:c.design,type:{summary:"BUTTON_SIZE"}},control:{type:"select"},options:Oe},variant:{table:{category:c.design,type:{summary:"BUTTON_VARIANT"}},control:{type:"select"},options:Te}}),args:{children:"My button"}},i={decorators:[o=>e.jsx("div",{style:{display:"flex",flexFlow:"row",gap:"8px",alignItems:"center"},children:o()})],globals:{imports:"import { BUTTON_COLOR, Button } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...t()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(r,{color:a.critical,children:"Critical"}),e.jsx(r,{color:a.information,children:"Information"}),e.jsx(r,{color:a.neutral,children:"Neutral"}),e.jsx(r,{color:a.primary,children:"Primary"}),e.jsx(r,{color:a.success,children:"Success"}),e.jsx(r,{color:a.warning,children:"Warning"})]})},d={globals:{imports:"import { Button } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...t()}}},render:({})=>e.jsx(r,{children:"My button"})},m={globals:{imports:"import { Button } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...t()}}},render:({})=>e.jsx(r,{loading:!0,children:"Loading button"})},u={tags:["!dev"],parameters:{layout:"centered",docs:{source:{...t()}}},render:({})=>e.jsx(r,{children:"Button"})},p={decorators:[o=>e.jsx("div",{style:{display:"flex",flexFlow:"row",gap:"8px",alignItems:"center"},children:o()})],globals:{imports:"import { BUTTON_SIZE, Button } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...t()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(r,{size:A.md,children:"MD button"}),e.jsx(r,{size:A.sm,children:"SM button"}),e.jsx(r,{size:A.xs,children:"XS button"})]})},g={decorators:[o=>e.jsx("div",{style:{display:"flex",flexFlow:"row",gap:"8px",alignItems:"center"},children:o()})],globals:{imports:"import { BUTTON_VARIANT, Button } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...t()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(r,{variant:I.default,children:"Default button"}),e.jsx(r,{variant:I.outline,children:"Outline button"}),e.jsx(r,{variant:I.ghost,children:"Ghost button"})]})},y={globals:{imports:"import { Button } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...t()}}},render:({})=>e.jsx(r,{children:"Clear"})},B={globals:{imports:"import { ICON_NAME, Button, Icon } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...t()}}},render:({})=>e.jsx(r,{"aria-label":"Clear",children:e.jsx(S,{name:N.xmark})})},f={globals:{imports:"import { ICON_NAME, Button, Icon } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...t()}}},render:({})=>e.jsx(r,{children:e.jsx(S,{name:N.xmark})})},b={decorators:[o=>e.jsx("div",{style:{display:"flex",flexFlow:"row",gap:"8px",alignItems:"center"},children:o()})],globals:{imports:"import { ICON_NAME, Button, Icon } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...t()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(r,{"aria-labelledby":"filter-btn",children:e.jsx(S,{name:N.filter})}),e.jsx("span",{id:"filter-btn",children:"Filter your search results"})]})},h={decorators:[o=>e.jsx("div",{style:{display:"flex",flexFlow:"row",gap:"8px",alignItems:"center"},children:o()})],globals:{imports:"import { ICON_NAME, Button, Icon } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...t()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(r,{children:e.jsx(S,{name:N.filter})}),e.jsx("span",{children:"Filter your search results"})]})},v={globals:{imports:`import { Button } from '@ovhcloud/ods-react';
import { useState } from 'react';`},tags:["!dev"],parameters:{docs:{source:{...t()}}},render:()=>{const[o,n]=T.useState(""),s=()=>{n("Copied to clipboard.")};return e.jsxs(e.Fragment,{children:[e.jsx(r,{onClick:s,children:"Copy"}),e.jsx("span",{style:{marginLeft:"1rem"},children:o})]})}},x={globals:{imports:`import { Button } from '@ovhcloud/ods-react';
import { useState } from 'react';`},tags:["!dev"],parameters:{docs:{source:{...t()}}},render:()=>{const[o,n]=T.useState(""),s=()=>{n("Copied to clipboard.")};return e.jsxs(e.Fragment,{children:[e.jsx(r,{onClick:s,children:"Copy"}),e.jsx("span",{"aria-live":"polite",role:"status",style:{marginLeft:"1rem"},children:o})]})}},C={globals:{imports:`import { Button } from '@ovhcloud/ods-react';
import { useState } from 'react';`},tags:["!dev"],parameters:{docs:{source:{...t()}}},render:()=>{const[o,n]=T.useState(""),s=()=>{n("A critical error occurred while saving.")};return e.jsxs(e.Fragment,{children:[e.jsx(r,{onClick:s,children:"Save"}),e.jsx("span",{style:{marginLeft:"1rem",color:"red"},children:o})]})}},O={globals:{imports:`import { Button } from '@ovhcloud/ods-react';
import { useState } from 'react';`},tags:["!dev"],parameters:{docs:{source:{...t()}}},render:()=>{const[o,n]=T.useState(""),s=()=>{n("A critical error occurred while saving!")};return e.jsxs(e.Fragment,{children:[e.jsx(r,{onClick:s,children:"Save"}),e.jsx("span",{role:"alert",style:{marginLeft:"1rem",color:"red"},children:o})]})}};var R,_,j;l.parameters={...l.parameters,docs:{...(R=l.parameters)==null?void 0:R.docs,source:{originalSource:`{
  argTypes: orderControls({
    children: {
      table: {
        category: CONTROL_CATEGORY.slot
      },
      control: 'text'
    },
    color: {
      table: {
        category: CONTROL_CATEGORY.design,
        type: {
          summary: 'BUTTON_COLOR'
        }
      },
      control: {
        type: 'select'
      },
      options: BUTTON_COLORS
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
    loading: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'boolean'
    },
    size: {
      table: {
        category: CONTROL_CATEGORY.design,
        type: {
          summary: 'BUTTON_SIZE'
        }
      },
      control: {
        type: 'select'
      },
      options: BUTTON_SIZES
    },
    variant: {
      table: {
        category: CONTROL_CATEGORY.design,
        type: {
          summary: 'BUTTON_VARIANT'
        }
      },
      control: {
        type: 'select'
      },
      options: BUTTON_VARIANTS
    }
  }),
  args: {
    children: 'My button'
  }
}`,...(j=(_=l.parameters)==null?void 0:_.docs)==null?void 0:j.source}}};var E,L,M;i.parameters={...i.parameters,docs:{...(E=i.parameters)==null?void 0:E.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'row',
    gap: '8px',
    alignItems: 'center'
  }}>{story()}</div>],
  globals: {
    imports: \`import { BUTTON_COLOR, Button } from '@ovhcloud/ods-react';\`
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
      <Button color={BUTTON_COLOR.critical}>Critical</Button>
      <Button color={BUTTON_COLOR.information}>Information</Button>
      <Button color={BUTTON_COLOR.neutral}>Neutral</Button>
      <Button color={BUTTON_COLOR.primary}>Primary</Button>
      <Button color={BUTTON_COLOR.success}>Success</Button>
      <Button color={BUTTON_COLOR.warning}>Warning</Button>
    </>
}`,...(M=(L=i.parameters)==null?void 0:L.docs)==null?void 0:M.source}}};var w,U,k;d.parameters={...d.parameters,docs:{...(w=d.parameters)==null?void 0:w.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Button } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Button>
      My button
    </Button>
}`,...(k=(U=d.parameters)==null?void 0:U.docs)==null?void 0:k.source}}};var F,z,P;m.parameters={...m.parameters,docs:{...(F=m.parameters)==null?void 0:F.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Button } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Button loading={true}>
      Loading button
    </Button>
}`,...(P=(z=m.parameters)==null?void 0:z.docs)==null?void 0:P.source}}};var V,D,G;u.parameters={...u.parameters,docs:{...(V=u.parameters)==null?void 0:V.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Button>
      Button
    </Button>
}`,...(G=(D=u.parameters)==null?void 0:D.docs)==null?void 0:G.source}}};var Z,Y,W;p.parameters={...p.parameters,docs:{...(Z=p.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'row',
    gap: '8px',
    alignItems: 'center'
  }}>{story()}</div>],
  globals: {
    imports: \`import { BUTTON_SIZE, Button } from '@ovhcloud/ods-react';\`
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
      <Button size={BUTTON_SIZE.md}>MD button</Button>
      <Button size={BUTTON_SIZE.sm}>SM button</Button>
      <Button size={BUTTON_SIZE.xs}>XS button</Button>
    </>
}`,...(W=(Y=p.parameters)==null?void 0:Y.docs)==null?void 0:W.source}}};var X,K,$;g.parameters={...g.parameters,docs:{...(X=g.parameters)==null?void 0:X.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'row',
    gap: '8px',
    alignItems: 'center'
  }}>{story()}</div>],
  globals: {
    imports: \`import { BUTTON_VARIANT, Button } from '@ovhcloud/ods-react';\`
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
      <Button variant={BUTTON_VARIANT.default}>Default button</Button>
      <Button variant={BUTTON_VARIANT.outline}>Outline button</Button>
      <Button variant={BUTTON_VARIANT.ghost}>Ghost button</Button>
    </>
}`,...($=(K=g.parameters)==null?void 0:K.docs)==null?void 0:$.source}}};var q,H,J;y.parameters={...y.parameters,docs:{...(q=y.parameters)==null?void 0:q.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Button } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Button>
      Clear
    </Button>
}`,...(J=(H=y.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};var Q,ee,re;B.parameters={...B.parameters,docs:{...(Q=B.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  globals: {
    imports: \`import { ICON_NAME, Button, Icon } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Button aria-label='Clear'>
        <Icon name={ICON_NAME.xmark} />
    </Button>
}`,...(re=(ee=B.parameters)==null?void 0:ee.docs)==null?void 0:re.source}}};var oe,te,ne;f.parameters={...f.parameters,docs:{...(oe=f.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  globals: {
    imports: \`import { ICON_NAME, Button, Icon } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Button>
      <Icon name={ICON_NAME.xmark} />
    </Button>
}`,...(ne=(te=f.parameters)==null?void 0:te.docs)==null?void 0:ne.source}}};var se,ae,ce;b.parameters={...b.parameters,docs:{...(se=b.parameters)==null?void 0:se.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'row',
    gap: '8px',
    alignItems: 'center'
  }}>{story()}</div>],
  globals: {
    imports: \`import { ICON_NAME, Button, Icon } from '@ovhcloud/ods-react';\`
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
      <Button aria-labelledby="filter-btn">
        <Icon name={ICON_NAME.filter} />
      </Button>
      <span id="filter-btn">Filter your search results</span>
    </>
}`,...(ce=(ae=b.parameters)==null?void 0:ae.docs)==null?void 0:ce.source}}};var le,ie,de;h.parameters={...h.parameters,docs:{...(le=h.parameters)==null?void 0:le.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'row',
    gap: '8px',
    alignItems: 'center'
  }}>{story()}</div>],
  globals: {
    imports: \`import { ICON_NAME, Button, Icon } from '@ovhcloud/ods-react';\`
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
      <Button>
        <Icon name={ICON_NAME.filter} />
      </Button>
      <span>Filter your search results</span>
    </>
}`,...(de=(ie=h.parameters)==null?void 0:ie.docs)==null?void 0:de.source}}};var me,ue,pe;v.parameters={...v.parameters,docs:{...(me=v.parameters)==null?void 0:me.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Button } from '@ovhcloud/ods-react';
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
  render: () => {
    const [message, setMessage] = useState('');
    const handleClick = () => {
      setMessage('Copied to clipboard.');
    };
    return <>
        <Button onClick={handleClick}>
          Copy
        </Button>

        <span style={{
        marginLeft: '1rem'
      }}>
          {message}
        </span>
      </>;
  }
}`,...(pe=(ue=v.parameters)==null?void 0:ue.docs)==null?void 0:pe.source}}};var ge,ye,Be;x.parameters={...x.parameters,docs:{...(ge=x.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Button } from '@ovhcloud/ods-react';
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
  render: () => {
    const [message, setMessage] = useState('');
    const handleClick = () => {
      setMessage('Copied to clipboard.');
    };
    return <>
        <Button onClick={handleClick}>
          Copy
        </Button>

        <span aria-live="polite" role="status" style={{
        marginLeft: '1rem'
      }}>
          {message}
        </span>
      </>;
  }
}`,...(Be=(ye=x.parameters)==null?void 0:ye.docs)==null?void 0:Be.source}}};var fe,be,he;C.parameters={...C.parameters,docs:{...(fe=C.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Button } from '@ovhcloud/ods-react';
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
  render: () => {
    const [error, setError] = useState('');
    const handleClick = () => {
      setError('A critical error occurred while saving.');
    };
    return <>
        <Button onClick={handleClick}>
          Save
        </Button>

        <span style={{
        marginLeft: '1rem',
        color: 'red'
      }}>
          {error}
        </span>
      </>;
  }
}`,...(he=(be=C.parameters)==null?void 0:be.docs)==null?void 0:he.source}}};var ve,xe,Ce;O.parameters={...O.parameters,docs:{...(ve=O.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Button } from '@ovhcloud/ods-react';
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
  render: () => {
    const [error, setError] = useState('');
    const handleClick = () => {
      setError('A critical error occurred while saving!');
    };
    return <>
        <Button onClick={handleClick}>
          Save
        </Button>

        <span role="alert" style={{
        marginLeft: '1rem',
        color: 'red'
      }}>
          {error}
        </span>
      </>;
  }
}`,...(Ce=(xe=O.parameters)==null?void 0:xe.docs)==null?void 0:Ce.source}}};const Re=["Demo","Color","Default","Loading","Overview","Size","Variant","AccessibilityExplicitTextContent","AccessibilityIconOnly","AccessibilityBadPracticeIconOnly","AccessibilityLabelledBy","AccessibilityBadPracticeLabelledBy","AccessibilityBadPracticesRoleStatus","AccessibilityRoleStatus","AccessibilityBadPracticesRoleAlert","AccessibilityRoleAlert"],Fe=Object.freeze(Object.defineProperty({__proto__:null,AccessibilityBadPracticeIconOnly:f,AccessibilityBadPracticeLabelledBy:h,AccessibilityBadPracticesRoleAlert:C,AccessibilityBadPracticesRoleStatus:v,AccessibilityExplicitTextContent:y,AccessibilityIconOnly:B,AccessibilityLabelledBy:b,AccessibilityRoleAlert:O,AccessibilityRoleStatus:x,Color:i,Default:d,Demo:l,Loading:m,Overview:u,Size:p,Variant:g,__namedExportsOrder:Re,default:Ie},Symbol.toStringTag,{value:"Module"}));export{y as A,Fe as B,i as C,d as D,m as L,u as O,p as S,g as V,B as a,b};
