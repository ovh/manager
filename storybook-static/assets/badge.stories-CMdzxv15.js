import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{t as Y}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l as $}from"./ods-react60-0db41gCx.js";import{n as r}from"./Badge-YOwwmnsf-BLrISLal.js";import{n as K,t as U,r as o,a as u}from"./ods-react63-CRCMVrAF.js";import{h as k,I as q,M as H}from"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import{o as J,C as B}from"./controls-BtiQQn1l.js";import{d as Q,s as a}from"./ods-docgen-map-C6vdLMLl.js";r.__docgenInfo=Q.badge;const V={component:r,title:"Manager UI Kit/Components/Badge/Base"},s={argTypes:J({children:{table:{category:B.slot},control:"text"},color:{table:{category:B.design,type:{summary:"BADGE_COLOR"}},control:{type:"select"},options:K},size:{table:{category:B.design,type:{summary:"BADGE_SIZE"}},control:{type:"select"},options:U}}),args:{children:"My badge"}},n={decorators:[p=>e.jsx("div",{style:{display:"flex",flexFlow:"row",gap:"8px",alignItems:"center"},children:p()})],globals:{imports:"import { BADGE_COLOR, Badge } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(r,{color:o.alpha,children:"Alpha"}),e.jsx(r,{color:o.beta,children:"Beta"}),e.jsx(r,{color:o.critical,children:"Critical"}),e.jsx(r,{color:o.information,children:"Information"}),e.jsx(r,{color:o.neutral,children:"Neutral"}),e.jsx(r,{color:o.new,children:"New"}),e.jsx(r,{color:o.primary,children:"Primary"}),e.jsx(r,{color:o.promotion,children:"Promotion"}),e.jsx(r,{color:o.success,children:"Success"}),e.jsx(r,{color:o.warning,children:"Warning"})]})},t={globals:{imports:"import { Badge } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsx(r,{children:"My badge"})},i={tags:["!dev"],parameters:{layout:"centered",docs:{source:{...a()}}},render:({})=>e.jsx(r,{children:"Badge"})},l={globals:{imports:"import { BADGE_SIZE, Badge } from '@ovhcloud/ods-react';"},decorators:[p=>e.jsx("div",{style:{display:"flex",flexFlow:"row",gap:"8px",alignItems:"center"},children:p()})],tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(r,{size:u.sm,children:"SM badge"}),e.jsx(r,{size:u.md,children:"MD badge"}),e.jsx(r,{size:u.lg,children:"LG badge"})]})},c={globals:{imports:"import { ICON_NAME, Badge, Icon } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsx(r,{children:e.jsx(Y,{"aria-label":"Promotion",name:$.tag,role:"img"})})},d={globals:{imports:"import { BADGE_COLOR, ICON_NAME, Badge, Icon, Tooltip, TooltipContent, TooltipTrigger } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsxs(k,{children:[e.jsx(q,{asChild:!0,children:e.jsx(r,{"aria-labelledby":"tooltip-a11y",color:o.promotion,children:e.jsx(Y,{name:$.tag})})}),e.jsx(H,{id:"tooltip-a11y",children:"Promotion valid from November 22 to 26"})]})},g={globals:{imports:"import { Badge } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsxs("ul",{style:{display:"flex",flexFlow:"row",gap:"8px",margin:0,padding:0,listStyle:"none"},children:[e.jsx("li",{children:e.jsx(r,{children:"Item 1"})}),e.jsx("li",{children:e.jsx(r,{children:"Item 2"})})]})},m={globals:{imports:"import { Badge } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...a()}}},render:({})=>e.jsxs("div",{role:"list",style:{display:"flex",flexFlow:"row",gap:"8px",alignItems:"center"},children:[e.jsx(r,{role:"listitem",children:"Item 1"}),e.jsx(r,{role:"listitem",children:"Item 2"})]})};var y,x,h;s.parameters={...s.parameters,docs:{...(y=s.parameters)==null?void 0:y.docs,source:{originalSource:`{
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
          summary: 'BADGE_COLOR'
        }
      },
      control: {
        type: 'select'
      },
      options: BADGE_COLORS
    },
    size: {
      table: {
        category: CONTROL_CATEGORY.design,
        type: {
          summary: 'BADGE_SIZE'
        }
      },
      control: {
        type: 'select'
      },
      options: BADGE_SIZES
    }
  }),
  args: {
    children: 'My badge'
  }
}`,...(h=(x=s.parameters)==null?void 0:x.docs)==null?void 0:h.source}}};var O,f,C;n.parameters={...n.parameters,docs:{...(O=n.parameters)==null?void 0:O.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'row',
    gap: '8px',
    alignItems: 'center'
  }}>{story()}</div>],
  globals: {
    imports: \`import { BADGE_COLOR, Badge } from '@ovhcloud/ods-react';\`
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
      <Badge color={BADGE_COLOR.alpha}>Alpha</Badge>
      <Badge color={BADGE_COLOR.beta}>Beta</Badge>
      <Badge color={BADGE_COLOR.critical}>Critical</Badge>
      <Badge color={BADGE_COLOR.information}>Information</Badge>
      <Badge color={BADGE_COLOR.neutral}>Neutral</Badge>
      <Badge color={BADGE_COLOR.new}>New</Badge>
      <Badge color={BADGE_COLOR.primary}>Primary</Badge>
      <Badge color={BADGE_COLOR.promotion}>Promotion</Badge>
      <Badge color={BADGE_COLOR.success}>Success</Badge>
      <Badge color={BADGE_COLOR.warning}>Warning</Badge>
    </>
}`,...(C=(f=n.parameters)==null?void 0:f.docs)==null?void 0:C.source}}};var b,A,v;t.parameters={...t.parameters,docs:{...(b=t.parameters)==null?void 0:b.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Badge } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Badge>
      My badge
    </Badge>
}`,...(v=(A=t.parameters)==null?void 0:A.docs)==null?void 0:v.source}}};var E,_,I;i.parameters={...i.parameters,docs:{...(E=i.parameters)==null?void 0:E.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Badge>
      Badge
    </Badge>
}`,...(I=(_=i.parameters)==null?void 0:_.docs)==null?void 0:I.source}}};var S,j,G;l.parameters={...l.parameters,docs:{...(S=l.parameters)==null?void 0:S.docs,source:{originalSource:`{
  globals: {
    imports: \`import { BADGE_SIZE, Badge } from '@ovhcloud/ods-react';\`
  },
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'row',
    gap: '8px',
    alignItems: 'center'
  }}>{story()}</div>],
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <>
      <Badge size={BADGE_SIZE.sm}>SM badge</Badge>
      <Badge size={BADGE_SIZE.md}>MD badge</Badge>
      <Badge size={BADGE_SIZE.lg}>LG badge</Badge>
    </>
}`,...(G=(j=l.parameters)==null?void 0:j.docs)==null?void 0:G.source}}};var R,D,T;c.parameters={...c.parameters,docs:{...(R=c.parameters)==null?void 0:R.docs,source:{originalSource:`{
  globals: {
    imports: \`import { ICON_NAME, Badge, Icon } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Badge>
      <Icon aria-label="Promotion" name={ICON_NAME.tag} role="img" />
    </Badge>
}`,...(T=(D=c.parameters)==null?void 0:D.docs)==null?void 0:T.source}}};var L,w,N;d.parameters={...d.parameters,docs:{...(L=d.parameters)==null?void 0:L.docs,source:{originalSource:`{
  globals: {
    imports: \`import { BADGE_COLOR, ICON_NAME, Badge, Icon, Tooltip, TooltipContent, TooltipTrigger } from '@ovhcloud/ods-react';\`
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
        <Badge aria-labelledby="tooltip-a11y" color={BADGE_COLOR.promotion}>
          <Icon name={ICON_NAME.tag} />
        </Badge>
      </TooltipTrigger>

      <TooltipContent id="tooltip-a11y">
        Promotion valid from November 22 to 26
      </TooltipContent>
    </Tooltip>
}`,...(N=(w=d.parameters)==null?void 0:w.docs)==null?void 0:N.source}}};var M,z,F;g.parameters={...g.parameters,docs:{...(M=g.parameters)==null?void 0:M.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Badge } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <ul style={{
    display: 'flex',
    flexFlow: 'row',
    gap: '8px',
    margin: 0,
    padding: 0,
    listStyle: 'none'
  }}>
      <li>
        <Badge>
          Item 1
        </Badge>
      </li>
      <li>
        <Badge>
          Item 2
        </Badge>
      </li>
    </ul>
}`,...(F=(z=g.parameters)==null?void 0:z.docs)==null?void 0:F.source}}};var P,Z,W;m.parameters={...m.parameters,docs:{...(P=m.parameters)==null?void 0:P.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Badge } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <div role="list" style={{
    display: 'flex',
    flexFlow: 'row',
    gap: '8px',
    alignItems: 'center'
  }}>
      <Badge role="listitem">
        Item 1
      </Badge>
      <Badge role="listitem">
        Item 2
      </Badge>
    </div>
}`,...(W=(Z=m.parameters)==null?void 0:Z.docs)==null?void 0:W.source}}};const X=["Demo","Color","Default","Overview","Size","AccessibilityAriaLabel","AccessibilityWithTooltip","AccessibilityGrouping","AccessibilityAlternativeGrouping"],le=Object.freeze(Object.defineProperty({__proto__:null,AccessibilityAlternativeGrouping:m,AccessibilityAriaLabel:c,AccessibilityGrouping:g,AccessibilityWithTooltip:d,Color:n,Default:t,Demo:s,Overview:i,Size:l,__namedExportsOrder:X,default:V},Symbol.toStringTag,{value:"Module"}));export{c as A,le as B,n as C,t as D,i as O,l as S,d as a,g as b,m as c};
