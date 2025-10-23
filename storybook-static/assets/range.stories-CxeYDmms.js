import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{r as V}from"./index-Bnop-kX6.js";import{h as de}from"./Text-CcNd6qQr-FOgQIkhx.js";import{e as ce}from"./ods-react61-4lD3hp9p.js";import{L as j,S}from"./FormFieldLabel-DerGjSSG-BDyW1aTt.js";import{s as n}from"./Range-CfZeXvJr-D-npcvqz.js";import{e as ie,o as ue,C as d}from"./controls-BtiQQn1l.js";import{d as me,s as r}from"./ods-docgen-map-C6vdLMLl.js";n.__docgenInfo=me.range;const ge={argTypes:ie(["aria-label","aria-labelledby","defaultValue","max","min","name","onDragging","onValueChange","ticks","value"]),component:n,title:"Manager UI Kit/Components/Range/Base"},i={decorators:[a=>e.jsx("div",{style:{display:"flex",flexFlow:"column",justifyContent:"center",height:"80vh"},children:a()})],render:({dualRange:a,...s})=>{const[o,c]=V.useState([0]);return V.useEffect(()=>{if(a){const l=s.step||1,t=o[0]===100?o[0]-l:o[0];c([t,t+l])}else c([o[0]])},[a]),e.jsx(n,{...s,max:100,onDragging:({value:l})=>c(l),value:o})},argTypes:ue({disabled:{table:{category:d.general},control:{type:"boolean"}},displayBounds:{table:{category:d.general},control:{type:"boolean"}},displayTooltip:{table:{category:d.general},control:{type:"boolean"}},dualRange:{table:{category:d.general,type:{summary:"boolean"}},control:{type:"boolean"}},invalid:{table:{category:d.general},control:"boolean"},step:{table:{category:d.general},control:"number"}})},u={globals:{imports:`import { Range } from '@ovhcloud/ods-react';
import { useState } from 'react';`},tags:["!dev"],parameters:{docs:{source:{...r()}}},render:({})=>{const[a,s]=V.useState(),[h,o]=V.useState();function c(t){s(t.value[0])}function l(t){o(t.value[0])}return e.jsxs(e.Fragment,{children:[e.jsxs("p",{children:[e.jsxs("span",{children:["Final value: ",h]}),e.jsx("br",{}),e.jsxs("span",{children:["Dragged value: ",a]})]}),e.jsx(n,{onDragging:c,onValueChange:l,value:a?[a]:void 0})]})}},m={decorators:[a=>e.jsx("div",{style:{display:"flex",flexFlow:"column",rowGap:"8px"},children:a()})],globals:{imports:"import { Range } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...r()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(n,{}),e.jsx(n,{defaultValue:[50,75]})]})},g={decorators:[a=>e.jsx("div",{style:{display:"flex",flexFlow:"column",rowGap:"8px"},children:a()})],globals:{imports:"import { Range } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...r()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(n,{defaultValue:[20],disabled:!0}),e.jsx(n,{defaultValue:[50,75],disabled:!0})]})},p={decorators:[a=>e.jsx("div",{style:{display:"flex",flexFlow:"column",rowGap:"8px"},children:a()})],globals:{imports:"import { FormField, FormFieldLabel, Range } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...r()}}},render:({})=>e.jsxs(j,{children:[e.jsx(S,{children:"Range:"}),e.jsx(n,{})]})},v={globals:{imports:"import { Range } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...r()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"Max 500"}),e.jsx(n,{defaultValue:[50],max:500}),e.jsx(n,{defaultValue:[50,75],max:500}),e.jsx("p",{children:"Min 25"}),e.jsx(n,{defaultValue:[50],min:25}),e.jsx(n,{defaultValue:[50,75],min:25}),e.jsx("p",{children:"Max 75 & Min 25"}),e.jsx(n,{defaultValue:[50],max:75,min:25}),e.jsx(n,{defaultValue:[50,75],max:75,min:25})]})},f={decorators:[a=>e.jsx("div",{style:{width:"160px"},children:a()})],tags:["!dev"],parameters:{layout:"centered",docs:{source:{...r()}}},render:({})=>e.jsx(n,{defaultValue:[50]})},x={decorators:[a=>e.jsx("div",{style:{display:"flex",flexFlow:"column",rowGap:"8px"},children:a()})],globals:{imports:"import { Range } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...r()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(n,{defaultValue:[20],step:5}),e.jsx(n,{defaultValue:[50,75],step:5})]})},b={decorators:[a=>e.jsx("div",{style:{display:"flex",flexFlow:"column",rowGap:"8px"},children:a()})],globals:{imports:"import { Range } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...r()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(n,{defaultValue:[20],ticks:[10,20,30,40,50,60,70,80,90]}),e.jsx(n,{defaultValue:[50,75],ticks:[10,20,30,40,50,60,70,80,90]})]})},y={decorators:[a=>e.jsx("div",{style:{display:"flex",flexFlow:"column",rowGap:"8px"},children:a()})],globals:{imports:"import { Range } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...r()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(n,{ticks:[{label:"Low",value:25},{label:"Medium",value:50},{label:"High",value:75}]}),e.jsx(n,{displayBounds:!1,displayTooltip:!1,max:5,min:1,ticks:[{label:"Very Poor",value:1},{label:"Poor",value:2},{label:"Average",value:3},{label:"Good",value:4},{label:"Excellent",value:5}]})]})},R={globals:{imports:"import { FormField, FormFieldLabel, Range } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...r()}}},render:({})=>e.jsxs(j,{children:[e.jsx(S,{children:"Volume"}),e.jsx(n,{defaultValue:[50]})]})},F={globals:{imports:`import { TEXT_PRESET, FormField, FormFieldLabel, Range, Text } from '@ovhcloud/ods-react';
import { useState } from 'react';`},parameters:{docs:{source:{...r()}}},tags:["!dev"],parameters:{docs:{source:{...r()}}},render:({})=>{const[a,s]=V.useState([30,70]);return e.jsxs(j,{children:[e.jsx(S,{id:"range-label",children:"Price range"}),e.jsxs(de,{"aria-live":"polite",id:"range-sublabel",preset:ce.caption,children:["Selected values: ",a[0]," - ",a[1],"€"]}),e.jsx(n,{"aria-labelledby":["range-label","range-sublabel"],onDragging:({value:h})=>s(h),value:a})]})}};var C,T,w;i.parameters={...i.parameters,docs:{...(C=i.parameters)==null?void 0:C.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    height: '80vh'
  }}>{story()}</div>],
  render: ({
    dualRange,
    ...arg
  }: DemoArg) => {
    const MAX_VALUE = 100;
    const [values, setValues] = useState([0]);
    useEffect(() => {
      if (dualRange) {
        const step = arg.step || 1;
        const newValue = values[0] === MAX_VALUE ? values[0] - step : values[0];
        setValues([newValue, newValue + step]);
      } else {
        setValues([values[0]]);
      }
    }, [dualRange]);
    return <Range {...arg} max={MAX_VALUE} onDragging={({
      value
    }) => setValues(value)} value={values} />;
  },
  argTypes: orderControls({
    disabled: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: {
        type: 'boolean'
      }
    },
    displayBounds: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: {
        type: 'boolean'
      }
    },
    displayTooltip: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: {
        type: 'boolean'
      }
    },
    dualRange: {
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
    invalid: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'boolean'
    },
    step: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'number'
    }
  })
}`,...(w=(T=i.parameters)==null?void 0:T.docs)==null?void 0:w.source}}};var L,E,A;u.parameters={...u.parameters,docs:{...(L=u.parameters)==null?void 0:L.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Range } from '@ovhcloud/ods-react';
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
  render: ({}) => {
    const [draggingValue, setDraggingValue] = useState<number>();
    const [value, setValue] = useState<number>();
    function onDragging(detail: RangeValueChangeDetail) {
      setDraggingValue(detail.value[0]);
    }
    function onValueChange(detail: RangeValueChangeDetail) {
      setValue(detail.value[0]);
    }
    return <>
        <p>
          <span>Final value: {value}</span>
          <br />
          <span>Dragged value: {draggingValue}</span>
        </p>

        <Range onDragging={onDragging} onValueChange={onValueChange} value={draggingValue ? [draggingValue] : undefined} />
      </>;
  }
}`,...(A=(E=u.parameters)==null?void 0:E.docs)==null?void 0:A.source}}};var D,O,M;m.parameters={...m.parameters,docs:{...(D=m.parameters)==null?void 0:D.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'column',
    rowGap: '8px'
  }}>{story()}</div>],
  globals: {
    imports: \`import { Range } from '@ovhcloud/ods-react';\`
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
      <Range />

      <Range defaultValue={[50, 75]} />
    </>
}`,...(M=(O=m.parameters)==null?void 0:O.docs)==null?void 0:M.source}}};var _,G,k;g.parameters={...g.parameters,docs:{...(_=g.parameters)==null?void 0:_.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'column',
    rowGap: '8px'
  }}>{story()}</div>],
  globals: {
    imports: \`import { Range } from '@ovhcloud/ods-react';\`
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
      <Range defaultValue={[20]} disabled />

      <Range defaultValue={[50, 75]} disabled />
    </>
}`,...(k=(G=g.parameters)==null?void 0:G.docs)==null?void 0:k.source}}};var P,X,N;p.parameters={...p.parameters,docs:{...(P=p.parameters)==null?void 0:P.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'column',
    rowGap: '8px'
  }}>{story()}</div>],
  globals: {
    imports: \`import { FormField, FormFieldLabel, Range } from '@ovhcloud/ods-react';\`
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
        Range:
      </FormFieldLabel>

      <Range />
    </FormField>
}`,...(N=(X=p.parameters)==null?void 0:X.docs)==null?void 0:N.source}}};var U,Y,B;v.parameters={...v.parameters,docs:{...(U=v.parameters)==null?void 0:U.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Range } from '@ovhcloud/ods-react';\`
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
      <p>Max 500</p>
      <Range defaultValue={[50]} max={500} />
      <Range defaultValue={[50, 75]} max={500} />

      <p>Min 25</p>
      <Range defaultValue={[50]} min={25} />
      <Range defaultValue={[50, 75]} min={25} />

      <p>Max 75 & Min 25</p>
      <Range defaultValue={[50]} max={75} min={25} />
      <Range defaultValue={[50, 75]} max={75} min={25} />
    </>
}`,...(B=(Y=v.parameters)==null?void 0:Y.docs)==null?void 0:B.source}}};var I,H,z;f.parameters={...f.parameters,docs:{...(I=f.parameters)==null?void 0:I.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    width: '160px'
  }}>{story()}</div>],
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Range defaultValue={[50]} />
}`,...(z=(H=f.parameters)==null?void 0:H.docs)==null?void 0:z.source}}};var K,q,J;x.parameters={...x.parameters,docs:{...(K=x.parameters)==null?void 0:K.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'column',
    rowGap: '8px'
  }}>{story()}</div>],
  globals: {
    imports: \`import { Range } from '@ovhcloud/ods-react';\`
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
      <Range defaultValue={[20]} step={5} />

      <Range defaultValue={[50, 75]} step={5} />
    </>
}`,...(J=(q=x.parameters)==null?void 0:q.docs)==null?void 0:J.source}}};var Q,W,Z;b.parameters={...b.parameters,docs:{...(Q=b.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'column',
    rowGap: '8px'
  }}>{story()}</div>],
  globals: {
    imports: \`import { Range } from '@ovhcloud/ods-react';\`
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
      <Range defaultValue={[20]} ticks={[10, 20, 30, 40, 50, 60, 70, 80, 90]} />

      <Range defaultValue={[50, 75]} ticks={[10, 20, 30, 40, 50, 60, 70, 80, 90]} />
    </>
}`,...(Z=(W=b.parameters)==null?void 0:W.docs)==null?void 0:Z.source}}};var $,ee,ae;y.parameters={...y.parameters,docs:{...($=y.parameters)==null?void 0:$.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'column',
    rowGap: '8px'
  }}>{story()}</div>],
  globals: {
    imports: \`import { Range } from '@ovhcloud/ods-react';\`
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
      <Range ticks={[{
      label: 'Low',
      value: 25
    }, {
      label: 'Medium',
      value: 50
    }, {
      label: 'High',
      value: 75
    }]} />

      <Range displayBounds={false} displayTooltip={false} max={5} min={1} ticks={[{
      label: 'Very Poor',
      value: 1
    }, {
      label: 'Poor',
      value: 2
    }, {
      label: 'Average',
      value: 3
    }, {
      label: 'Good',
      value: 4
    }, {
      label: 'Excellent',
      value: 5
    }]} />
    </>
}`,...(ae=(ee=y.parameters)==null?void 0:ee.docs)==null?void 0:ae.source}}};var ne,re,oe;R.parameters={...R.parameters,docs:{...(ne=R.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  globals: {
    imports: \`import { FormField, FormFieldLabel, Range } from '@ovhcloud/ods-react';\`
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
        Volume
      </FormFieldLabel>

      <Range defaultValue={[50]} />
    </FormField>
}`,...(oe=(re=R.parameters)==null?void 0:re.docs)==null?void 0:oe.source}}};var se,le,te;F.parameters={...F.parameters,docs:{...(se=F.parameters)==null?void 0:se.docs,source:{originalSource:`{
  globals: {
    imports: \`import { TEXT_PRESET, FormField, FormFieldLabel, Range, Text } from '@ovhcloud/ods-react';
import { useState } from 'react';\`
  },
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => {
    const [values, setValues] = useState([30, 70]);
    return <FormField>
        <FormFieldLabel id="range-label">
          Price range
        </FormFieldLabel>

        <Text aria-live="polite" id="range-sublabel" preset={TEXT_PRESET.caption}>
          Selected values: {values[0]} - {values[1]}€
        </Text>

        <Range aria-labelledby={['range-label', 'range-sublabel']} onDragging={({
        value
      }) => setValues(value)} value={values} />
      </FormField>;
  }
}`,...(te=(le=F.parameters)==null?void 0:le.docs)==null?void 0:te.source}}};const pe=["Demo","Controlled","Default","Disabled","InFormField","MaxMin","Overview","Step","Ticks","TicksLabels","AccessibilityFormField","AccessibilityDescriptiveSubLabel"],he=Object.freeze(Object.defineProperty({__proto__:null,AccessibilityDescriptiveSubLabel:F,AccessibilityFormField:R,Controlled:u,Default:m,Demo:i,Disabled:g,InFormField:p,MaxMin:v,Overview:f,Step:x,Ticks:b,TicksLabels:y,__namedExportsOrder:pe,default:ge},Symbol.toStringTag,{value:"Module"}));export{R as A,u as C,m as D,p as I,v as M,f as O,he as R,x as S,b as T,F as a,g as b,y as c};
