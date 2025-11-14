import{j as o}from"./jsx-runtime-BRNY0I4F.js";import{r as Y}from"./index-Bnop-kX6.js";import{t as m}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l as h}from"./ods-react60-0db41gCx.js";import{x as F}from"./Button-BC-ipw2F-CXZv4wj7.js";import{r as k}from"./ods-react235-BTQ8kVBe.js";import{h as t,M as e,I as r}from"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import{e as V,o as K,C as l}from"./controls-BtiQQn1l.js";import{d as u,s as i}from"./ods-docgen-map-C6vdLMLl.js";t.__docgenInfo=u.tooltip;e.__docgenInfo=u.tooltipContent;r.__docgenInfo=u.tooltipTrigger;const U={argTypes:V(["onOpenChange","open"]),component:t,subcomponents:{TooltipContent:e,TooltipTrigger:r},title:"Manager UI Kit/Components/Tooltip/Base"},s={parameters:{layout:"centered"},render:n=>o.jsxs(t,{closeDelay:n.closeDelay,openDelay:n.openDelay,position:n.position,children:[o.jsx(r,{asChild:!0,children:o.jsx(m,{name:h.circleQuestion,style:{fontSize:"24px"}})}),o.jsx(e,{withArrow:n.withArrow,children:n.content})]}),argTypes:K({closeDelay:{table:{category:l.general},control:"number"},content:{table:{category:l.slot},control:"text"},openDelay:{table:{category:l.general},control:"number"},position:{table:{category:l.general,type:{summary:"TOOLTIP_POSITION"}},control:{type:"select"},options:k},withArrow:{table:{category:l.design,defaultValue:{summary:!1},type:{summary:"boolean"}},control:{type:"boolean"}}}),args:{content:"My tooltip content"}},p={decorators:[n=>o.jsx("div",{style:{display:"flex",flexFlow:"row",gap:"8px",alignItems:"center"},children:n()})],globals:{imports:`import { ICON_NAME, Button, Icon, Tooltip, TooltipContent, TooltipTrigger } from '@ovhcloud/ods-react';
import { useState } from 'react';`},tags:["!dev"],parameters:{docs:{source:{...i()}}},render:({})=>{const[n,G]=Y.useState(!1);function Q(){G(P=>!P)}return o.jsxs(o.Fragment,{children:[o.jsx(F,{onClick:Q,children:"Toggle tooltip"}),o.jsxs(t,{open:n,children:[o.jsx(r,{asChild:!0,children:o.jsx(m,{name:h.circleQuestion,style:{fontSize:"24px"}})}),o.jsx(e,{withArrow:!0,children:"This is the tooltip content"})]})]})}},a={globals:{imports:"import { ICON_NAME, Icon, Tooltip, TooltipContent, TooltipTrigger } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...i()}}},render:({})=>o.jsxs(t,{children:[o.jsx(r,{asChild:!0,children:o.jsx(m,{name:h.circleQuestion,style:{fontSize:"24px"}})}),o.jsx(e,{children:"This is the tooltip content"})]})},c={globals:{imports:"import { Tooltip, TooltipContent, TooltipTrigger } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...i()}}},render:({})=>o.jsxs(t,{children:[o.jsx(r,{children:"Show tooltip"}),o.jsx(e,{children:"This is the tooltip content"})]})},d={decorators:[n=>o.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gridTemplateRows:"repeat(3, 1fr)",gap:"20px",padding:"50px 150px"},children:n()})],globals:{imports:"import { Tooltip, TooltipContent, TooltipTrigger } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...i()}}},render:({})=>o.jsxs(o.Fragment,{children:[o.jsxs(t,{position:"top-start",children:[o.jsx(r,{children:"Top Left"}),o.jsx(e,{withArrow:!0,children:"Top Left tooltip"})]}),o.jsxs(t,{position:"top",children:[o.jsx(r,{children:"Top"}),o.jsx(e,{withArrow:!0,children:"Top tooltip"})]}),o.jsxs(t,{position:"top-end",children:[o.jsx(r,{children:"Top Right"}),o.jsx(e,{withArrow:!0,children:"Top Right tooltip"})]}),o.jsxs(t,{position:"left",children:[o.jsx(r,{children:"Middle Left"}),o.jsx(e,{withArrow:!0,children:"Middle Left tooltip"})]}),o.jsx("div",{}),o.jsxs(t,{position:"right",children:[o.jsx(r,{children:"Middle Right"}),o.jsx(e,{withArrow:!0,children:"Middle Right tooltip"})]}),o.jsxs(t,{position:"bottom-start",children:[o.jsx(r,{children:"Bottom Left"}),o.jsx(e,{withArrow:!0,children:"Bottom Left tooltip"})]}),o.jsxs(t,{position:"bottom",children:[o.jsx(r,{children:"Bottom"}),o.jsx(e,{withArrow:!0,children:"Bottom tooltip"})]}),o.jsxs(t,{position:"bottom-end",children:[o.jsx(r,{children:"Bottom Right"}),o.jsx(e,{withArrow:!0,children:"Bottom Right tooltip"})]})]})},T={tags:["!dev"],parameters:{layout:"centered",docs:{source:{...i()}}},render:({})=>o.jsxs(t,{children:[o.jsx(r,{asChild:!0,children:o.jsx(m,{name:h.circleQuestion,style:{fontSize:"24px"}})}),o.jsx(e,{children:"This is the tooltip content"})]})},g={globals:{imports:"import { ICON_NAME, Icon, Tooltip, TooltipContent, TooltipTrigger } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...i()}}},render:({})=>o.jsxs(t,{children:[o.jsx(r,{asChild:!0,children:o.jsx(m,{"aria-label":"Open tooltip",name:h.circleInfo,role:"img",style:{fontSize:"24px"}})}),o.jsx(e,{children:"Some additional context."})]})};var C,x,f;s.parameters={...s.parameters,docs:{...(C=s.parameters)==null?void 0:C.docs,source:{originalSource:`{
  parameters: {
    layout: 'centered'
  },
  render: (arg: DemoArg) => <Tooltip closeDelay={arg.closeDelay} openDelay={arg.openDelay} position={arg.position}>
      <TooltipTrigger asChild>
        <Icon name={ICON_NAME.circleQuestion} style={{
        fontSize: '24px'
      }} />
      </TooltipTrigger>

      <TooltipContent withArrow={arg.withArrow}>
        {arg.content}
      </TooltipContent>
    </Tooltip>,
  argTypes: orderControls({
    closeDelay: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'number'
    },
    content: {
      table: {
        category: CONTROL_CATEGORY.slot
      },
      control: 'text'
    },
    openDelay: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'number'
    },
    position: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: {
          summary: 'TOOLTIP_POSITION'
        }
      },
      control: {
        type: 'select'
      },
      options: TOOLTIP_POSITIONS
    },
    withArrow: {
      table: {
        category: CONTROL_CATEGORY.design,
        defaultValue: {
          summary: false
        },
        type: {
          summary: 'boolean'
        }
      },
      control: {
        type: 'boolean'
      }
    }
  }),
  args: {
    content: 'My tooltip content'
  }
}`,...(f=(x=s.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};var y,w,O;p.parameters={...p.parameters,docs:{...(y=p.parameters)==null?void 0:y.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'row',
    gap: '8px',
    alignItems: 'center'
  }}>{story()}</div>],
  globals: {
    imports: \`import { ICON_NAME, Button, Icon, Tooltip, TooltipContent, TooltipTrigger } from '@ovhcloud/ods-react';
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
    const [isOpen, setIsOpen] = useState(false);
    function toggleTooltip() {
      setIsOpen(isOpen => !isOpen);
    }
    return <>
        <Button onClick={toggleTooltip}>
          Toggle tooltip
        </Button>

        <Tooltip open={isOpen}>
          <TooltipTrigger asChild>
            <Icon name={ICON_NAME.circleQuestion} style={{
            fontSize: '24px'
          }} />
          </TooltipTrigger>

          <TooltipContent withArrow>
            This is the tooltip content
          </TooltipContent>
        </Tooltip>
      </>;
  }
}`,...(O=(w=p.parameters)==null?void 0:w.docs)==null?void 0:O.source}}};var j,A,I;a.parameters={...a.parameters,docs:{...(j=a.parameters)==null?void 0:j.docs,source:{originalSource:`{
  globals: {
    imports: \`import { ICON_NAME, Icon, Tooltip, TooltipContent, TooltipTrigger } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Tooltip>
      <TooltipTrigger asChild>
        <Icon name={ICON_NAME.circleQuestion} style={{
        fontSize: '24px'
      }} />
      </TooltipTrigger>

      <TooltipContent>
        This is the tooltip content
      </TooltipContent>
    </Tooltip>
}`,...(I=(A=a.parameters)==null?void 0:A.docs)==null?void 0:I.source}}};var b,S,v;c.parameters={...c.parameters,docs:{...(b=c.parameters)==null?void 0:b.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Tooltip, TooltipContent, TooltipTrigger } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Tooltip>
      <TooltipTrigger>
        Show tooltip
      </TooltipTrigger>

      <TooltipContent>
        This is the tooltip content
      </TooltipContent>
    </Tooltip>
}`,...(v=(S=c.parameters)==null?void 0:S.docs)==null?void 0:v.source}}};var R,_,N;d.parameters={...d.parameters,docs:{...(R=d.parameters)==null?void 0:R.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    gap: '20px',
    padding: '50px 150px'
  }}>
      {story()}
    </div>],
  globals: {
    imports: \`import { Tooltip, TooltipContent, TooltipTrigger } from '@ovhcloud/ods-react';\`
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
      <Tooltip position="top-start">
        <TooltipTrigger>
          Top Left
        </TooltipTrigger>
        <TooltipContent withArrow>
          Top Left tooltip
        </TooltipContent>
      </Tooltip>

      <Tooltip position="top">
        <TooltipTrigger>
          Top
        </TooltipTrigger>
        <TooltipContent withArrow>
          Top tooltip
        </TooltipContent>
      </Tooltip>

      <Tooltip position="top-end">
        <TooltipTrigger>
          Top Right
        </TooltipTrigger>
        <TooltipContent withArrow>
          Top Right tooltip
        </TooltipContent>
      </Tooltip>

      <Tooltip position="left">
        <TooltipTrigger>
          Middle Left
        </TooltipTrigger>
        <TooltipContent withArrow>
          Middle Left tooltip
        </TooltipContent>
      </Tooltip>

      <div />

      <Tooltip position="right">
        <TooltipTrigger>
          Middle Right
        </TooltipTrigger>
        <TooltipContent withArrow>
          Middle Right tooltip
        </TooltipContent>
      </Tooltip>

      <Tooltip position="bottom-start">
        <TooltipTrigger>
          Bottom Left
        </TooltipTrigger>
        <TooltipContent withArrow>
          Bottom Left tooltip
        </TooltipContent>
      </Tooltip>

      <Tooltip position="bottom">
        <TooltipTrigger>
          Bottom
        </TooltipTrigger>
        <TooltipContent withArrow>
          Bottom tooltip
        </TooltipContent>
      </Tooltip>

      <Tooltip position="bottom-end">
        <TooltipTrigger>
          Bottom Right
        </TooltipTrigger>
        <TooltipContent withArrow>
          Bottom Right tooltip
        </TooltipContent>
      </Tooltip>
    </>
}`,...(N=(_=d.parameters)==null?void 0:_.docs)==null?void 0:N.source}}};var M,L,E;T.parameters={...T.parameters,docs:{...(M=T.parameters)==null?void 0:M.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Tooltip>
      <TooltipTrigger asChild>
        <Icon name={ICON_NAME.circleQuestion} style={{
        fontSize: '24px'
      }} />
      </TooltipTrigger>

      <TooltipContent>
        This is the tooltip content
      </TooltipContent>
    </Tooltip>
}`,...(E=(L=T.parameters)==null?void 0:L.docs)==null?void 0:E.source}}};var D,B,z;g.parameters={...g.parameters,docs:{...(D=g.parameters)==null?void 0:D.docs,source:{originalSource:`{
  globals: {
    imports: \`import { ICON_NAME, Icon, Tooltip, TooltipContent, TooltipTrigger } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Tooltip>
      <TooltipTrigger asChild>
        <Icon aria-label="Open tooltip" name={ICON_NAME.circleInfo} role="img" style={{
        fontSize: '24px'
      }} />
      </TooltipTrigger>

      <TooltipContent>
        Some additional context.
      </TooltipContent>
    </Tooltip>
}`,...(z=(B=g.parameters)==null?void 0:B.docs)==null?void 0:z.source}}};const q=["Demo","Controlled","CustomTrigger","Default","Grid","Overview","AccessibilityTooltip"],ro=Object.freeze(Object.defineProperty({__proto__:null,AccessibilityTooltip:g,Controlled:p,CustomTrigger:a,Default:c,Demo:s,Grid:d,Overview:T,__namedExportsOrder:q,default:U},Symbol.toStringTag,{value:"Module"}));export{g as A,a as C,c as D,d as G,T as O,ro as T,p as a};
