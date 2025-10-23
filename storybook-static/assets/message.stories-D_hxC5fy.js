import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{r as A}from"./index-Bnop-kX6.js";import{l as o,o as ae}from"./ods-react60-0db41gCx.js";import{x as S}from"./Button-BC-ipw2F-4e7GV2_-.js";import{e as oe,a as t}from"./ods-react236-aAAP9SXj.js";import{E as s,S as n,$ as a}from"./MessageIcon-yhpEHWAg-Dy-zemFL.js";import{l as re,t as f}from"./ods-react78-B8-_EgR8.js";import{e as te,o as ce,C as i}from"./controls-BtiQQn1l.js";import{d as I,s as l}from"./ods-docgen-map-C6vdLMLl.js";s.__docgenInfo=I.message;n.__docgenInfo=I.messageBody;a.__docgenInfo=I.messageIcon;const le={argTypes:te(["i18n","locale","onRemove"]),component:s,subcomponents:{MessageBody:n,MessageIcon:a},title:"Manager UI Kit/Components/Message/Base"},d={render:r=>e.jsxs(s,{color:r.color,dismissible:r.dismissible,variant:r.variant,children:[e.jsx(a,{name:r.name||o.circleInfo}),e.jsx(n,{children:r.children})]}),argTypes:ce({children:{table:{category:i.slot},control:"text"},color:{table:{category:i.design,type:{summary:"MESSAGE_COLOR"}},control:{type:"select"},options:oe},dismissible:{table:{category:i.general},control:{type:"boolean"}},name:{table:{category:i.design,type:{summary:"ICON_NAME"}},control:{type:"select"},options:ae},variant:{table:{category:i.design,type:{summary:"MESSAGE_VARIANT"}},control:{type:"select"},options:re}}),args:{children:"My message"}},g={globals:{imports:"import { ICON_NAME, MESSAGE_COLOR, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...l()}}},render:({})=>e.jsxs("ul",{style:{display:"flex",flexFlow:"column",rowGap:"8px",margin:0,padding:0,listStyle:"none"},children:[e.jsx("li",{children:e.jsxs(s,{children:[e.jsx(a,{name:o.circleCheck}),e.jsx(n,{children:"Your changes have been saved."})]})}),e.jsx("li",{children:e.jsxs(s,{color:t.warning,children:[e.jsx(a,{name:o.triangleExclamation}),e.jsx(n,{children:"Some fields need your attention."})]})})]})},m={globals:{imports:"import { ICON_NAME, MESSAGE_COLOR, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...l()}}},render:({})=>e.jsxs("div",{role:"list",style:{display:"flex",flexFlow:"column",rowGap:"8px"},children:[e.jsxs(s,{role:"listitem",children:[e.jsx(a,{name:o.circleCheck}),e.jsx(n,{children:"Your changes have been saved."})]}),e.jsxs(s,{color:t.warning,role:"listitem",children:[e.jsx(a,{name:o.triangleExclamation}),e.jsx(n,{children:"Some fields need your attention."})]})]})},M={decorators:[r=>e.jsx("div",{style:{display:"flex",flexFlow:"column",gap:"8px"},children:r()})],globals:{imports:`import { BUTTON_COLOR, ICON_NAME, MESSAGE_COLOR, Button, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';
import { useState } from 'react';`},tags:["!dev"],parameters:{docs:{source:{...l()}}},render:({})=>{const[r,ee]=A.useState([]),[se,ne]=A.useState([]);return e.jsxs(e.Fragment,{children:[e.jsxs("div",{children:[e.jsx(S,{onClick:()=>ne(c=>c.concat([new Date().toString()])),children:"Add status"}),e.jsx(S,{color:t.critical,onClick:()=>ee(c=>c.concat([new Date().toString()])),children:"Add alert"})]}),e.jsx("div",{role:"alert",children:r.map(c=>e.jsxs(s,{color:t.critical,children:[e.jsx(a,{name:o.hexagonExclamation}),e.jsxs(n,{children:["Alert: ",c]})]},c))}),e.jsx("div",{role:"status",children:se.map(c=>e.jsxs(s,{children:[e.jsx(a,{name:o.circleInfo}),e.jsxs(n,{children:["Status: ",c]})]},c))})]})}},p={decorators:[r=>e.jsx("div",{style:{display:"inline-flex",flexFlow:"column",gap:"8px"},children:r()})],globals:{imports:"import { ICON_NAME, MESSAGE_COLOR, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...l()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsxs(s,{color:t.critical,children:[e.jsx(a,{name:o.hexagonExclamation}),e.jsx(n,{children:"Critical message"})]}),e.jsxs(s,{color:t.information,children:[e.jsx(a,{name:o.circleInfo}),e.jsx(n,{children:"Information message"})]}),e.jsxs(s,{color:t.neutral,children:[e.jsx(a,{name:o.email}),e.jsx(n,{children:"Neutral message"})]}),e.jsxs(s,{color:t.primary,children:[e.jsx(a,{name:o.lightbulb}),e.jsx(n,{children:"Primary message"})]}),e.jsxs(s,{color:t.success,children:[e.jsx(a,{name:o.circleCheck}),e.jsx(n,{children:"Success message"})]}),e.jsxs(s,{color:t.warning,children:[e.jsx(a,{name:o.triangleExclamation}),e.jsx(n,{children:"Warning message"})]})]})},u={globals:{imports:"import { ICON_NAME, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...l()}}},render:({})=>e.jsxs(s,{children:[e.jsx(a,{name:o.circleInfo}),e.jsx(n,{children:"Default message"})]})},y={globals:{imports:"import { ICON_NAME, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...l()}}},render:({})=>e.jsxs(s,{children:[e.jsx(a,{name:o.circleInfo}),e.jsx(n,{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer faucibus, libero et pharetra mattis, ipsum velit semper risus, non ultrices lacus massa sed arcu. Nulla sed tellus."})]})},x={globals:{imports:"import { ICON_NAME, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...l()}}},render:({})=>e.jsxs(s,{dismissible:!1,children:[e.jsx(a,{name:o.circleInfo}),e.jsx(n,{children:"Default message"})]})},E={tags:["!dev"],parameters:{layout:"centered",docs:{source:{...l()}}},render:({})=>e.jsxs(s,{children:[e.jsx(a,{name:o.circleInfo}),e.jsx(n,{children:"Message"})]})},O={decorators:[r=>e.jsx("div",{style:{display:"inline-flex",flexFlow:"column",gap:"8px"},children:r()})],globals:{imports:"import { ICON_NAME, MESSAGE_VARIANT, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...l()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsxs(s,{variant:f.default,children:[e.jsx(a,{name:o.circleInfo}),e.jsx(n,{children:"Default variant Message"})]}),e.jsxs(s,{variant:f.light,children:[e.jsx(a,{name:o.circleInfo}),e.jsx(n,{children:"Light variant Message"})]})]})};var C,h,N;d.parameters={...d.parameters,docs:{...(C=d.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: (arg: DemoArg) => <Message color={arg.color} dismissible={arg.dismissible} variant={arg.variant}>
      <MessageIcon name={arg.name || ICON_NAME.circleInfo} />

      <MessageBody>
        {arg.children}
      </MessageBody>
    </Message>,
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
          summary: 'MESSAGE_COLOR'
        }
      },
      control: {
        type: 'select'
      },
      options: MESSAGE_COLORS
    },
    dismissible: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: {
        type: 'boolean'
      }
    },
    name: {
      table: {
        category: CONTROL_CATEGORY.design,
        type: {
          summary: 'ICON_NAME'
        }
      },
      control: {
        type: 'select'
      },
      options: ICON_NAMES
    },
    variant: {
      table: {
        category: CONTROL_CATEGORY.design,
        type: {
          summary: 'MESSAGE_VARIANT'
        }
      },
      control: {
        type: 'select'
      },
      options: MESSAGE_VARIANTS
    }
  }),
  args: {
    children: 'My message'
  }
}`,...(N=(h=d.parameters)==null?void 0:h.docs)==null?void 0:N.source}}};var v,_,j;g.parameters={...g.parameters,docs:{...(v=g.parameters)==null?void 0:v.docs,source:{originalSource:`{
  globals: {
    imports: \`import { ICON_NAME, MESSAGE_COLOR, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';\`
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
    flexFlow: 'column',
    rowGap: '8px',
    margin: 0,
    padding: 0,
    listStyle: 'none'
  }}>
      <li>
        <Message>
          <MessageIcon name={ICON_NAME.circleCheck} />

          <MessageBody>
            Your changes have been saved.
          </MessageBody>
        </Message>
      </li>

      <li>
        <Message color={MESSAGE_COLOR.warning}>
          <MessageIcon name={ICON_NAME.triangleExclamation} />

          <MessageBody>
            Some fields need your attention.
          </MessageBody>
        </Message>
      </li>
    </ul>
}`,...(j=(_=g.parameters)==null?void 0:_.docs)==null?void 0:j.source}}};var B,b,R;m.parameters={...m.parameters,docs:{...(B=m.parameters)==null?void 0:B.docs,source:{originalSource:`{
  globals: {
    imports: \`import { ICON_NAME, MESSAGE_COLOR, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';\`
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
    flexFlow: 'column',
    rowGap: '8px'
  }}>
      <Message role="listitem">
        <MessageIcon name={ICON_NAME.circleCheck} />

        <MessageBody>
          Your changes have been saved.
        </MessageBody>
      </Message>

      <Message color={MESSAGE_COLOR.warning} role="listitem">
        <MessageIcon name={ICON_NAME.triangleExclamation} />

        <MessageBody>
          Some fields need your attention.
        </MessageBody>
      </Message>
    </div>
}`,...(R=(b=m.parameters)==null?void 0:b.docs)==null?void 0:R.source}}};var G,L,T;M.parameters={...M.parameters,docs:{...(G=M.parameters)==null?void 0:G.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'column',
    gap: '8px'
  }}>{story()}</div>],
  globals: {
    imports: \`import { BUTTON_COLOR, ICON_NAME, MESSAGE_COLOR, Button, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';
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
    const [alerts, setAlerts] = useState<string[]>([]);
    const [statuses, setStatuses] = useState<string[]>([]);
    return <>
        <div>
          <Button onClick={() => setStatuses(s => s.concat([new Date().toString()]))}>
            Add status
          </Button>

          <Button color={BUTTON_COLOR.critical} onClick={() => setAlerts(a => a.concat([new Date().toString()]))}>
            Add alert
          </Button>
        </div>

        <div role="alert">
          {alerts.map(alert => <Message color={MESSAGE_COLOR.critical} key={alert}>
                <MessageIcon name={ICON_NAME.hexagonExclamation} />

                <MessageBody>
                  Alert: {alert}
                </MessageBody>
              </Message>)}
        </div>

        <div role="status">
          {statuses.map(status => <Message key={status}>
                <MessageIcon name={ICON_NAME.circleInfo} />

                <MessageBody>
                  Status: {status}
                </MessageBody>
              </Message>)}
        </div>
      </>;
  }
}`,...(T=(L=M.parameters)==null?void 0:L.docs)==null?void 0:T.source}}};var w,D,F;p.parameters={...p.parameters,docs:{...(w=p.parameters)==null?void 0:w.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'inline-flex',
    flexFlow: 'column',
    gap: '8px'
  }}>{story()}</div>],
  globals: {
    imports: \`import { ICON_NAME, MESSAGE_COLOR, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';\`
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
      <Message color={MESSAGE_COLOR.critical}>
        <MessageIcon name={ICON_NAME.hexagonExclamation} />

        <MessageBody>Critical message</MessageBody>
      </Message>

      <Message color={MESSAGE_COLOR.information}>
        <MessageIcon name={ICON_NAME.circleInfo} />

        <MessageBody>Information message</MessageBody>
      </Message>

      <Message color={MESSAGE_COLOR.neutral}>
        <MessageIcon name={ICON_NAME.email} />

        <MessageBody>Neutral message</MessageBody>
      </Message>

      <Message color={MESSAGE_COLOR.primary}>
        <MessageIcon name={ICON_NAME.lightbulb} />

        <MessageBody>Primary message</MessageBody>
      </Message>

      <Message color={MESSAGE_COLOR.success}>
        <MessageIcon name={ICON_NAME.circleCheck} />

        <MessageBody>Success message</MessageBody>
      </Message>

      <Message color={MESSAGE_COLOR.warning}>
        <MessageIcon name={ICON_NAME.triangleExclamation} />

        <MessageBody>Warning message</MessageBody>
      </Message>
    </>
}`,...(F=(D=p.parameters)==null?void 0:D.docs)==null?void 0:F.source}}};var k,V,Y;u.parameters={...u.parameters,docs:{...(k=u.parameters)==null?void 0:k.docs,source:{originalSource:`{
  globals: {
    imports: \`import { ICON_NAME, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Message>
      <MessageIcon name={ICON_NAME.circleInfo} />

      <MessageBody>
        Default message
      </MessageBody>
    </Message>
}`,...(Y=(V=u.parameters)==null?void 0:V.docs)==null?void 0:Y.source}}};var U,P,W;y.parameters={...y.parameters,docs:{...(U=y.parameters)==null?void 0:U.docs,source:{originalSource:`{
  globals: {
    imports: \`import { ICON_NAME, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Message>
      <MessageIcon name={ICON_NAME.circleInfo} />

      <MessageBody>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer faucibus, libero et pharetra mattis, ipsum velit semper risus, non ultrices lacus massa sed arcu. Nulla sed tellus.
      </MessageBody>
    </Message>
}`,...(W=(P=y.parameters)==null?void 0:P.docs)==null?void 0:W.source}}};var $,z,K;x.parameters={...x.parameters,docs:{...($=x.parameters)==null?void 0:$.docs,source:{originalSource:`{
  globals: {
    imports: \`import { ICON_NAME, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Message dismissible={false}>
      <MessageIcon name={ICON_NAME.circleInfo} />

      <MessageBody>
        Default message
      </MessageBody>
    </Message>
}`,...(K=(z=x.parameters)==null?void 0:z.docs)==null?void 0:K.source}}};var q,H,J;E.parameters={...E.parameters,docs:{...(q=E.parameters)==null?void 0:q.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Message>
      <MessageIcon name={ICON_NAME.circleInfo} />

      <MessageBody>
        Message
      </MessageBody>
    </Message>
}`,...(J=(H=E.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};var Q,X,Z;O.parameters={...O.parameters,docs:{...(Q=O.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'inline-flex',
    flexFlow: 'column',
    gap: '8px'
  }}>{story()}</div>],
  globals: {
    imports: \`import { ICON_NAME, MESSAGE_VARIANT, Message, MessageBody, MessageIcon } from '@ovhcloud/ods-react';\`
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
      <Message variant={MESSAGE_VARIANT.default}>
        <MessageIcon name={ICON_NAME.circleInfo} />

        <MessageBody>
          Default variant Message
        </MessageBody>
      </Message>

      <Message variant={MESSAGE_VARIANT.light}>
        <MessageIcon name={ICON_NAME.circleInfo} />

        <MessageBody>
          Light variant Message
        </MessageBody>
      </Message>
    </>
}`,...(Z=(X=O.parameters)==null?void 0:X.docs)==null?void 0:Z.source}}};const ie=["Demo","AccessibilityGrouping","AccessibilityAlternativeGrouping","AccessibilityRoles","Color","Default","Multiline","NonDismissible","Overview","Variant"],Oe=Object.freeze(Object.defineProperty({__proto__:null,AccessibilityAlternativeGrouping:m,AccessibilityGrouping:g,AccessibilityRoles:M,Color:p,Default:u,Demo:d,Multiline:y,NonDismissible:x,Overview:E,Variant:O,__namedExportsOrder:ie,default:le},Symbol.toStringTag,{value:"Module"}));export{g as A,p as C,u as D,Oe as M,x as N,E as O,O as V,m as a,M as b,y as c};
