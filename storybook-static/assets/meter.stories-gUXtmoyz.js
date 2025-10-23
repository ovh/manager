import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{h as Y}from"./Text-CcNd6qQr-FOgQIkhx.js";import{e as D}from"./ods-react61-4lD3hp9p.js";import{M as r}from"./Meter-Q4oNu6aG-BjjvBiEL.js";import{o as P,C as o}from"./controls-BtiQQn1l.js";import{d as F,s as a}from"./ods-docgen-map-C6vdLMLl.js";r.__docgenInfo=F.meter;const X={component:r,tags:["new"],title:"Manager UI Kit/Components/Meter/Base"},s={argTypes:P({high:{table:{category:o.general}},low:{table:{category:o.general}},max:{table:{category:o.general}},min:{table:{category:o.general}},optimum:{table:{category:o.general}},value:{table:{category:o.general}}})},t={globals:{imports:"import { Meter } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsx(r,{"aria-label":"Gauge",low:40,value:35})},n={globals:{imports:"import { TEXT_PRESET, Meter, Text } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(Y,{id:"meter-label",preset:D.label,children:"Gauge:"}),e.jsx(r,{"aria-labelledby":"meter-label",low:40,value:35})]})},l={globals:{imports:"import { Meter } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsx(r,{"aria-label":"Gauge","aria-valuetext":"35 files uploaded",low:40,value:35})},c={globals:{imports:"import { Meter } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsx(r,{})},i={globals:{imports:"import { Meter } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"Low optimum and low value:"}),e.jsx(r,{high:80,low:40,optimum:30,value:20}),e.jsx("p",{children:"Low optimum and high value:"}),e.jsx(r,{high:80,low:40,optimum:30,value:60}),e.jsx("p",{children:"Low optimum and very high value:"}),e.jsx(r,{high:80,low:40,optimum:30,value:90})]})},m={tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsx(r,{low:40,value:35})},d={globals:{imports:"import { Meter } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"Value under low threshold:"}),e.jsx(r,{low:40,value:35}),e.jsx("p",{children:"Value between both thresholds:"}),e.jsx(r,{high:80,low:40,value:60}),e.jsx("p",{children:"Value above high threshold:"}),e.jsx(r,{high:80,value:90})]})};var u,p,g;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  argTypes: orderControls({
    high: {
      table: {
        category: CONTROL_CATEGORY.general
      }
    },
    low: {
      table: {
        category: CONTROL_CATEGORY.general
      }
    },
    max: {
      table: {
        category: CONTROL_CATEGORY.general
      }
    },
    min: {
      table: {
        category: CONTROL_CATEGORY.general
      }
    },
    optimum: {
      table: {
        category: CONTROL_CATEGORY.general
      }
    },
    value: {
      table: {
        category: CONTROL_CATEGORY.general
      }
    }
  })
}`,...(g=(p=s.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};var h,v,b;t.parameters={...t.parameters,docs:{...(h=t.parameters)==null?void 0:h.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Meter } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Meter aria-label="Gauge" low={40} value={35} />
}`,...(b=(v=t.parameters)==null?void 0:v.docs)==null?void 0:b.source}}};var w,x,f;n.parameters={...n.parameters,docs:{...(w=n.parameters)==null?void 0:w.docs,source:{originalSource:`{
  globals: {
    imports: \`import { TEXT_PRESET, Meter, Text } from '@ovhcloud/ods-react';\`
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
      <Text id="meter-label" preset={TEXT_PRESET.label}>
        Gauge:
      </Text>

      <Meter aria-labelledby="meter-label" low={40} value={35} />
    </>
}`,...(f=(x=n.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};var T,M,O;l.parameters={...l.parameters,docs:{...(T=l.parameters)==null?void 0:T.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Meter } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Meter aria-label="Gauge" aria-valuetext="35 files uploaded" low={40} value={35} />
}`,...(O=(M=l.parameters)==null?void 0:M.docs)==null?void 0:O.source}}};var y,C,R;c.parameters={...c.parameters,docs:{...(y=c.parameters)==null?void 0:y.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Meter } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Meter />
}`,...(R=(C=c.parameters)==null?void 0:C.docs)==null?void 0:R.source}}};var j,S,A;i.parameters={...i.parameters,docs:{...(j=i.parameters)==null?void 0:j.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Meter } from '@ovhcloud/ods-react';\`
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
      <p>Low optimum and low value:</p>
      <Meter high={80} low={40} optimum={30} value={20} />

      <p>Low optimum and high value:</p>
      <Meter high={80} low={40} optimum={30} value={60} />

      <p>Low optimum and very high value:</p>
      <Meter high={80} low={40} optimum={30} value={90} />
    </>
}`,...(A=(S=i.parameters)==null?void 0:S.docs)==null?void 0:A.source}}};var E,_,L;m.parameters={...m.parameters,docs:{...(E=m.parameters)==null?void 0:E.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Meter low={40} value={35} />
}`,...(L=(_=m.parameters)==null?void 0:_.docs)==null?void 0:L.source}}};var G,V,N;d.parameters={...d.parameters,docs:{...(G=d.parameters)==null?void 0:G.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Meter } from '@ovhcloud/ods-react';\`
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
      <p>Value under low threshold:</p>
      <Meter low={40} value={35} />

      <p>Value between both thresholds:</p>
      <Meter high={80} low={40} value={60} />

      <p>Value above high threshold:</p>
      <Meter high={80} value={90} />
    </>
}`,...(N=(V=d.parameters)==null?void 0:V.docs)==null?void 0:N.source}}};const I=["Demo","AccessibilityAriaLabel","AccessibilityAriaLabelledby","AccessibilityAriaValuetext","Default","Optimum","Overview","Thresholds"],H=Object.freeze(Object.defineProperty({__proto__:null,AccessibilityAriaLabel:t,AccessibilityAriaLabelledby:n,AccessibilityAriaValuetext:l,Default:c,Demo:s,Optimum:i,Overview:m,Thresholds:d,__namedExportsOrder:I,default:X},Symbol.toStringTag,{value:"Module"}));export{t as A,c as D,H as M,m as O,d as T,n as a,l as b,i as c};
