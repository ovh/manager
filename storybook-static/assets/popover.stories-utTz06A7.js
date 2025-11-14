import{j as o}from"./jsx-runtime-BRNY0I4F.js";import{r as $}from"./index-Bnop-kX6.js";import{t as F}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l as Y}from"./ods-react60-0db41gCx.js";import{x as s,t as u}from"./Button-BC-ipw2F-CXZv4wj7.js";import{a as q}from"./ods-react236-aAAP9SXj.js";import{L as e,A as r,B as t}from"./PopoverTrigger-4w4N6iLp-C-LGD_7X.js";import{r as H}from"./ods-react235-BTQ8kVBe.js";import{f as J}from"./Divider-THit99OS-DE11lmva.js";import{e as Q,o as X,C as p}from"./controls-BtiQQn1l.js";import{d as P,s as i}from"./ods-docgen-map-C6vdLMLl.js";e.__docgenInfo=P.popover;r.__docgenInfo=P.popoverContent;t.__docgenInfo=P.popoverTrigger;const Z={argTypes:Q(["autoFocus","onOpenChange","onPositionChange","open","triggerId"]),component:e,subcomponents:{PopoverContent:r,PopoverTrigger:t},title:"Manager UI Kit/Components/Popover/Base"},a={parameters:{layout:"centered"},render:n=>o.jsxs(e,{gutter:n.gutter,position:n.position,sameWidth:n.sameWidth,children:[o.jsx(t,{children:"Show popover"}),o.jsx(r,{withArrow:n.withArrow,children:n.content})]}),argTypes:X({content:{table:{category:p.slot},control:"text"},gutter:{table:{category:p.design,type:{summary:"number"}},control:"number"},position:{table:{category:p.general,type:{summary:"POPOVER_POSITION"}},control:{type:"select"},options:H},sameWidth:{table:{category:p.design},control:{type:"boolean"}},withArrow:{table:{category:p.design,defaultValue:{summary:!1},type:{summary:"boolean"}},control:{type:"boolean"}}}),args:{content:"My popover content"}},c={decorators:[n=>o.jsx("div",{style:{display:"flex",flexFlow:"row",gap:"8px",alignItems:"center"},children:n()})],globals:{imports:`import { ICON_NAME, Button, Icon, Popover, PopoverContent, PopoverTrigger } from '@ovhcloud/ods-react';
import { useState } from 'react';`},tags:["!dev"],parameters:{docs:{source:{...i()}}},render:({})=>{const[n,k]=$.useState(!1);function z(){k(K=>!K)}return o.jsxs(o.Fragment,{children:[o.jsx(s,{onClick:z,children:"Toggle popover"}),o.jsxs(e,{open:n,children:[o.jsx(t,{asChild:!0,children:o.jsx(F,{name:Y.cog})}),o.jsx(r,{withArrow:!0,children:"This is the popover content"})]})]})}},d={globals:{imports:"import { Button, Popover, PopoverContent, PopoverTrigger } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...i()}}},render:({})=>o.jsxs(e,{children:[o.jsx(t,{asChild:!0,children:o.jsx(s,{children:"Custom Trigger"})}),o.jsx(r,{children:"This is the popover content"})]})},l={globals:{imports:"import { Popover, PopoverContent, PopoverTrigger } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...i()}}},render:({})=>o.jsxs(e,{children:[o.jsx(t,{children:"Show popover"}),o.jsx(r,{children:"This is the popover content"})]})},g={decorators:[n=>o.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gridTemplateRows:"repeat(3, 1fr)",gap:"20px",padding:"50px 150px"},children:n()})],globals:{imports:"import { Popover, PopoverContent, PopoverTrigger } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...i()}}},render:({})=>o.jsxs(o.Fragment,{children:[o.jsxs(e,{position:"top-start",children:[o.jsx(t,{children:"Top Left"}),o.jsx(r,{withArrow:!0,children:"Top Left popover"})]}),o.jsxs(e,{position:"top",children:[o.jsx(t,{children:"Top"}),o.jsx(r,{withArrow:!0,children:"Top popover"})]}),o.jsxs(e,{position:"top-end",children:[o.jsx(t,{children:"Top Right"}),o.jsx(r,{withArrow:!0,children:"Top Right popover"})]}),o.jsxs(e,{position:"left",children:[o.jsx(t,{children:"Middle Left"}),o.jsx(r,{withArrow:!0,children:"Middle Left popover"})]}),o.jsx("div",{}),o.jsxs(e,{position:"right",children:[o.jsx(t,{children:"Middle Right"}),o.jsx(r,{withArrow:!0,children:"Middle Right popover"})]}),o.jsxs(e,{position:"bottom-start",children:[o.jsx(t,{children:"Bottom Left"}),o.jsx(r,{withArrow:!0,children:"Bottom Left popover"})]}),o.jsxs(e,{position:"bottom",children:[o.jsx(t,{children:"Bottom"}),o.jsx(r,{withArrow:!0,children:"Bottom popover"})]}),o.jsxs(e,{position:"bottom-end",children:[o.jsx(t,{children:"Bottom Right"}),o.jsx(r,{withArrow:!0,children:"Bottom Right popover"})]})]})},v={tags:["!dev"],parameters:{layout:"centered",docs:{source:{...i()}}},render:({})=>o.jsxs(e,{children:[o.jsx(t,{asChild:!0,children:o.jsx(s,{children:"Show popover"})}),o.jsx(r,{children:"This is the popover content"})]})},m={globals:{imports:"import { BUTTON_COLOR, BUTTON_VARIANT, ICON_NAME, Button, Divider, Icon, Popover, PopoverContent, PopoverTrigger } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...i()}}},render:({})=>o.jsxs(e,{children:[o.jsx(t,{"aria-haspopup":"menu",asChild:!0,children:o.jsx(s,{children:o.jsx(F,{name:Y.ellipsisVertical})})}),o.jsx(r,{"aria-label":"Profile menu",withArrow:!0,children:o.jsxs("div",{role:"menu",style:{display:"flex",flexDirection:"column"},children:[o.jsx(s,{role:"menuitem",variant:u.ghost,children:"Information"}),o.jsx(s,{role:"menuitem",variant:u.ghost,children:"Notifications"}),o.jsx(J,{style:{width:"100%"}}),o.jsx(s,{color:q.critical,role:"menuitem",variant:u.ghost,children:"Sign out"})]})})]})},h={globals:{imports:"import { Popover, PopoverContent, PopoverTrigger } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...i()}}},render:({})=>o.jsxs(e,{sameWidth:!0,children:[o.jsx(t,{children:"Show popover that will take this width as reference"}),o.jsx(r,{children:"The popover content"})]})};var T,C,x;a.parameters={...a.parameters,docs:{...(T=a.parameters)==null?void 0:T.docs,source:{originalSource:`{
  parameters: {
    layout: 'centered'
  },
  render: (arg: DemoArg) => <Popover gutter={arg.gutter} position={arg.position} sameWidth={arg.sameWidth}>
      <PopoverTrigger>
        Show popover
      </PopoverTrigger>

      <PopoverContent withArrow={arg.withArrow}>
        {arg.content}
      </PopoverContent>
    </Popover>,
  argTypes: orderControls({
    content: {
      table: {
        category: CONTROL_CATEGORY.slot
      },
      control: 'text'
    },
    gutter: {
      table: {
        category: CONTROL_CATEGORY.design,
        type: {
          summary: 'number'
        }
      },
      control: 'number'
    },
    position: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: {
          summary: 'POPOVER_POSITION'
        }
      },
      control: {
        type: 'select'
      },
      options: POPOVER_POSITIONS
    },
    sameWidth: {
      table: {
        category: CONTROL_CATEGORY.design
      },
      control: {
        type: 'boolean'
      }
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
    content: 'My popover content'
  }
}`,...(x=(C=a.parameters)==null?void 0:C.docs)==null?void 0:x.source}}};var f,w,j;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'row',
    gap: '8px',
    alignItems: 'center'
  }}>{story()}</div>],
  globals: {
    imports: \`import { ICON_NAME, Button, Icon, Popover, PopoverContent, PopoverTrigger } from '@ovhcloud/ods-react';
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
    function togglePopover() {
      setIsOpen(isOpen => !isOpen);
    }
    return <>
        <Button onClick={togglePopover}>
          Toggle popover
        </Button>

        <Popover open={isOpen}>
          <PopoverTrigger asChild>
            <Icon name={ICON_NAME.cog} />
          </PopoverTrigger>

          <PopoverContent withArrow>
            This is the popover content
          </PopoverContent>
        </Popover>
      </>;
  }
}`,...(j=(w=c.parameters)==null?void 0:w.docs)==null?void 0:j.source}}};var O,y,A;d.parameters={...d.parameters,docs:{...(O=d.parameters)==null?void 0:O.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Button, Popover, PopoverContent, PopoverTrigger } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Popover>
      <PopoverTrigger asChild>
        <Button>
          Custom Trigger
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        This is the popover content
      </PopoverContent>
    </Popover>
}`,...(A=(y=d.parameters)==null?void 0:y.docs)==null?void 0:A.source}}};var b,R,B;l.parameters={...l.parameters,docs:{...(b=l.parameters)==null?void 0:b.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Popover, PopoverContent, PopoverTrigger } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Popover>
      <PopoverTrigger>
        Show popover
      </PopoverTrigger>

      <PopoverContent>
        This is the popover content
      </PopoverContent>
    </Popover>
}`,...(B=(R=l.parameters)==null?void 0:R.docs)==null?void 0:B.source}}};var S,N,I;g.parameters={...g.parameters,docs:{...(S=g.parameters)==null?void 0:S.docs,source:{originalSource:`{
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
    imports: \`import { Popover, PopoverContent, PopoverTrigger } from '@ovhcloud/ods-react';\`
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
      <Popover position="top-start">
        <PopoverTrigger>
          Top Left
        </PopoverTrigger>
        <PopoverContent withArrow>
          Top Left popover
        </PopoverContent>
      </Popover>

      <Popover position="top">
        <PopoverTrigger>
          Top
        </PopoverTrigger>
        <PopoverContent withArrow>
          Top popover
        </PopoverContent>
      </Popover>

      <Popover position="top-end">
        <PopoverTrigger>
          Top Right
        </PopoverTrigger>
        <PopoverContent withArrow>
          Top Right popover
        </PopoverContent>
      </Popover>

      <Popover position="left">
        <PopoverTrigger>
          Middle Left
        </PopoverTrigger>
        <PopoverContent withArrow>
          Middle Left popover
        </PopoverContent>
      </Popover>

      <div />

      <Popover position="right">
        <PopoverTrigger>
          Middle Right
        </PopoverTrigger>
        <PopoverContent withArrow>
          Middle Right popover
        </PopoverContent>
      </Popover>

      <Popover position="bottom-start">
        <PopoverTrigger>
          Bottom Left
        </PopoverTrigger>
        <PopoverContent withArrow>
          Bottom Left popover
        </PopoverContent>
      </Popover>

      <Popover position="bottom">
        <PopoverTrigger>
          Bottom
        </PopoverTrigger>
        <PopoverContent withArrow>
          Bottom popover
        </PopoverContent>
      </Popover>

      <Popover position="bottom-end">
        <PopoverTrigger>
          Bottom Right
        </PopoverTrigger>
        <PopoverContent withArrow>
          Bottom Right popover
        </PopoverContent>
      </Popover>
    </>
}`,...(I=(N=g.parameters)==null?void 0:N.docs)==null?void 0:I.source}}};var _,L,M;v.parameters={...v.parameters,docs:{...(_=v.parameters)==null?void 0:_.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Popover>
      <PopoverTrigger asChild>
        <Button>
          Show popover
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        This is the popover content
      </PopoverContent>
    </Popover>
}`,...(M=(L=v.parameters)==null?void 0:L.docs)==null?void 0:M.source}}};var E,D,V;m.parameters={...m.parameters,docs:{...(E=m.parameters)==null?void 0:E.docs,source:{originalSource:`{
  globals: {
    imports: \`import { BUTTON_COLOR, BUTTON_VARIANT, ICON_NAME, Button, Divider, Icon, Popover, PopoverContent, PopoverTrigger } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Popover>
      <PopoverTrigger aria-haspopup="menu" asChild>
        <Button>
          <Icon name={ICON_NAME.ellipsisVertical} />
        </Button>
      </PopoverTrigger>

      <PopoverContent aria-label="Profile menu" withArrow>
        <div role="menu" style={{
        display: 'flex',
        flexDirection: 'column'
      }}>
          <Button role="menuitem" variant={BUTTON_VARIANT.ghost}>
            Information
          </Button>

          <Button role="menuitem" variant={BUTTON_VARIANT.ghost}>
            Notifications
          </Button>

          <Divider style={{
          width: '100%'
        }} />

          <Button color={BUTTON_COLOR.critical} role="menuitem" variant={BUTTON_VARIANT.ghost}>
            Sign out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
}`,...(V=(D=m.parameters)==null?void 0:D.docs)==null?void 0:V.source}}};var W,G,U;h.parameters={...h.parameters,docs:{...(W=h.parameters)==null?void 0:W.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Popover, PopoverContent, PopoverTrigger } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Popover sameWidth>
      <PopoverTrigger>
        Show popover that will take this width as reference
      </PopoverTrigger>

      <PopoverContent>
        The popover content
      </PopoverContent>
    </Popover>
}`,...(U=(G=h.parameters)==null?void 0:G.docs)==null?void 0:U.source}}};const oo=["Demo","Controlled","CustomTrigger","Default","Grid","Overview","AccessibilityWithMenu","SameWidth"],vo=Object.freeze(Object.defineProperty({__proto__:null,AccessibilityWithMenu:m,Controlled:c,CustomTrigger:d,Default:l,Demo:a,Grid:g,Overview:v,SameWidth:h,__namedExportsOrder:oo,default:Z},Symbol.toStringTag,{value:"Module"}));export{m as A,d as C,l as D,g as G,v as O,vo as P,h as S,c as a};
