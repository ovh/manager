import{j as r}from"./jsx-runtime-BRNY0I4F.js";import{r as z}from"./index-Bnop-kX6.js";import{x as a}from"./Button-BC-ipw2F-CXZv4wj7.js";import{f as e,b as n,g as t,D as o,o as K,e as i}from"./DrawerTrigger-omPTo2Bn-DB5oJcOC.js";import{e as U,o as q,C as m}from"./controls-BtiQQn1l.js";import{d as h,s as d}from"./ods-docgen-map-C6vdLMLl.js";e.__docgenInfo=h.drawer;n.__docgenInfo=h.drawerBody;t.__docgenInfo=h.drawerContent;o.__docgenInfo=h.drawerTrigger;const H={argTypes:U(["defaultOpen","onOpenChange","open"]),component:e,subcomponents:{DrawerBody:n,DrawerContent:t,DrawerTrigger:o},title:"Manager UI Kit/Components/Drawer/Base"},c={render:s=>r.jsxs(e,{closeOnEscape:s.closeOnEscape,closeOnInteractOutside:s.closeOnInteractOutside,children:[r.jsx(o,{asChild:!0,children:r.jsx(a,{children:"Trigger Drawer"})}),r.jsx(t,{position:s.position,children:r.jsx(n,{children:s.content})})]}),argTypes:q({closeOnEscape:{table:{category:m.general},control:{type:"boolean"}},closeOnInteractOutside:{table:{category:m.general},control:{type:"boolean"}},content:{table:{category:m.slot},control:"text"},position:{table:{category:m.general,type:{summary:"DRAWER_POSITION"}},control:{type:"select"},options:K}}),args:{content:"My drawer content"}},l={globals:{imports:`import { Button, Drawer, DrawerBody, DrawerContent } from '@ovhcloud/ods-react';
import { useState } from 'react';`},tags:["!dev"],parameters:{docs:{source:{...d()}}},render:({})=>{const[s,y]=z.useState(!1);function G({open:k}){y(k)}function Y(){y(!0)}return r.jsxs(r.Fragment,{children:[r.jsx(a,{onClick:Y,children:"Trigger Drawer"}),r.jsx(e,{onOpenChange:G,open:s,children:r.jsx(t,{children:r.jsx(n,{children:"Content"})})})]})}},w={globals:{imports:"import { Button, Drawer, DrawerBody, DrawerContent, DrawerTrigger } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...d()}}},render:({})=>r.jsxs(e,{children:[r.jsx(o,{asChild:!0,children:r.jsx(a,{children:"Trigger Drawer"})}),r.jsx(t,{children:r.jsx(n,{children:"My drawer content"})})]})},g={tags:["!dev"],parameters:{layout:"centered",docs:{source:{...d()}}},render:({})=>r.jsxs(e,{children:[r.jsx(o,{asChild:!0,children:r.jsx(a,{children:"Trigger Drawer"})}),r.jsx(t,{position:i.left,children:r.jsx(n,{children:"My drawer content"})})]})},D={decorators:[s=>r.jsx("div",{style:{display:"flex",flexFlow:"row",alignItems:"center",gap:"8px"},children:s()})],globals:{imports:"import { DRAWER_POSITION, Button, Drawer, DrawerBody, DrawerContent, DrawerTrigger } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...d()}}},render:({})=>r.jsxs(r.Fragment,{children:[r.jsxs(e,{children:[r.jsx(o,{asChild:!0,children:r.jsx(a,{children:"Top drawer"})}),r.jsx(t,{position:i.top,children:r.jsx(n,{children:"Top drawer content"})})]}),r.jsxs(e,{children:[r.jsx(o,{asChild:!0,children:r.jsx(a,{children:"Left drawer"})}),r.jsx(t,{position:i.left,children:r.jsx(n,{children:"Left drawer content"})})]}),r.jsxs(e,{children:[r.jsx(o,{asChild:!0,children:r.jsx(a,{children:"Right Drawer"})}),r.jsx(t,{position:i.right,children:r.jsx(n,{children:"Right drawer content"})})]}),r.jsxs(e,{children:[r.jsx(o,{asChild:!0,children:r.jsx(a,{children:"Bottom Drawer"})}),r.jsx(t,{position:i.bottom,children:r.jsx(n,{children:"Bottom drawer content"})})]})]})},p={globals:{imports:"import { Button, Drawer, DrawerBody, DrawerContent, DrawerTrigger } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...d()}}},render:({})=>r.jsxs(e,{children:[r.jsx(o,{asChild:!0,children:r.jsx(a,{children:"Trigger Drawer"})}),r.jsx(t,{"aria-describedby":"drawer-content","aria-labelledby":"drawer-title",children:r.jsxs(n,{children:[r.jsx("h2",{id:"drawer-title",children:"My drawer"}),r.jsx("p",{id:"drawer-content",children:"The drawer content"})]})})]})},u={globals:{imports:"import { Button, Drawer, DrawerBody, DrawerContent, DrawerTrigger } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...d()}}},render:({})=>r.jsxs(e,{children:[r.jsx(o,{asChild:!0,children:r.jsx(a,{children:"Trigger Drawer"})}),r.jsx(t,{"aria-describedby":"drawer-content","aria-label":"My drawer",children:r.jsx(n,{id:"drawer-content",children:"The drawer content"})})]})};var C,O,T;c.parameters={...c.parameters,docs:{...(C=c.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: (arg: DemoArg) => <Drawer closeOnEscape={arg.closeOnEscape} closeOnInteractOutside={arg.closeOnInteractOutside}>
      <DrawerTrigger asChild>
        <Button>
          Trigger Drawer
        </Button>
      </DrawerTrigger>

      <DrawerContent position={arg.position}>
        <DrawerBody>
          {arg.content}
        </DrawerBody>
      </DrawerContent>
    </Drawer>,
  argTypes: orderControls({
    closeOnEscape: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: {
        type: 'boolean'
      }
    },
    closeOnInteractOutside: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: {
        type: 'boolean'
      }
    },
    content: {
      table: {
        category: CONTROL_CATEGORY.slot
      },
      control: 'text'
    },
    position: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: {
          summary: 'DRAWER_POSITION'
        }
      },
      control: {
        type: 'select'
      },
      options: DRAWER_POSITIONS
    }
  }),
  args: {
    content: 'My drawer content'
  }
}`,...(T=(O=c.parameters)==null?void 0:O.docs)==null?void 0:T.source}}};var x,B,j;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Button, Drawer, DrawerBody, DrawerContent } from '@ovhcloud/ods-react';
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
    function onOpenChange({
      open
    }: DrawerOpenChangeDetail) {
      setIsOpen(open);
    }
    function openDrawer() {
      setIsOpen(true);
    }
    return <>
        <Button onClick={openDrawer}>
          Trigger Drawer
        </Button>

        <Drawer onOpenChange={onOpenChange} open={isOpen}>
          <DrawerContent>
            <DrawerBody>
              Content
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>;
  }
}`,...(j=(B=l.parameters)==null?void 0:B.docs)==null?void 0:j.source}}};var f,b,R;w.parameters={...w.parameters,docs:{...(f=w.parameters)==null?void 0:f.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Button, Drawer, DrawerBody, DrawerContent, DrawerTrigger } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Drawer>
      <DrawerTrigger asChild>
        <Button>
          Trigger Drawer
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerBody>
          My drawer content
        </DrawerBody>
      </DrawerContent>
    </Drawer>
}`,...(R=(b=w.parameters)==null?void 0:b.docs)==null?void 0:R.source}}};var I,S,v;g.parameters={...g.parameters,docs:{...(I=g.parameters)==null?void 0:I.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Drawer>
      <DrawerTrigger asChild>
        <Button>
          Trigger Drawer
        </Button>
      </DrawerTrigger>

      <DrawerContent position={DRAWER_POSITION.left}>
        <DrawerBody>
          My drawer content
        </DrawerBody>
      </DrawerContent>
    </Drawer>
}`,...(v=(S=g.parameters)==null?void 0:S.docs)==null?void 0:v.source}}};var _,A,E;D.parameters={...D.parameters,docs:{...(_=D.parameters)==null?void 0:_.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'row',
    alignItems: 'center',
    gap: '8px'
  }}>{story()}</div>],
  globals: {
    imports: \`import { DRAWER_POSITION, Button, Drawer, DrawerBody, DrawerContent, DrawerTrigger } from '@ovhcloud/ods-react';\`
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
    <Drawer>
      <DrawerTrigger asChild>
        <Button>
          Top drawer
        </Button>
      </DrawerTrigger>

      <DrawerContent position={DRAWER_POSITION.top}>
        <DrawerBody>
          Top drawer content
        </DrawerBody>
      </DrawerContent>
    </Drawer>

   <Drawer>
      <DrawerTrigger asChild>
        <Button>
          Left drawer
        </Button>
      </DrawerTrigger>

      <DrawerContent position={DRAWER_POSITION.left}>
        <DrawerBody>
          Left drawer content
        </DrawerBody>
      </DrawerContent>
    </Drawer>

   <Drawer>
      <DrawerTrigger asChild>
        <Button>
          Right Drawer
        </Button>
      </DrawerTrigger>

      <DrawerContent position={DRAWER_POSITION.right}>
        <DrawerBody>
          Right drawer content
        </DrawerBody>
      </DrawerContent>
    </Drawer>

   <Drawer>
      <DrawerTrigger asChild>
        <Button>
          Bottom Drawer
        </Button>
      </DrawerTrigger>

      <DrawerContent position={DRAWER_POSITION.bottom}>
        <DrawerBody>
          Bottom drawer content
        </DrawerBody>
      </DrawerContent>
    </Drawer>
    </>
}`,...(E=(A=D.parameters)==null?void 0:A.docs)==null?void 0:E.source}}};var N,P,L;p.parameters={...p.parameters,docs:{...(N=p.parameters)==null?void 0:N.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Button, Drawer, DrawerBody, DrawerContent, DrawerTrigger } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Drawer>
      <DrawerTrigger asChild>
        <Button>
          Trigger Drawer
        </Button>
      </DrawerTrigger>

      <DrawerContent aria-describedby="drawer-content" aria-labelledby="drawer-title">
        <DrawerBody>
          <h2 id="drawer-title">
            My drawer
          </h2>

          <p id="drawer-content">
            The drawer content
          </p>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
}`,...(L=(P=p.parameters)==null?void 0:P.docs)==null?void 0:L.source}}};var M,W,F;u.parameters={...u.parameters,docs:{...(M=u.parameters)==null?void 0:M.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Button, Drawer, DrawerBody, DrawerContent, DrawerTrigger } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Drawer>
      <DrawerTrigger asChild>
        <Button>
          Trigger Drawer
        </Button>
      </DrawerTrigger>

      <DrawerContent aria-describedby="drawer-content" aria-label="My drawer">
        <DrawerBody id="drawer-content">
          The drawer content
        </DrawerBody>
      </DrawerContent>
    </Drawer>
}`,...(F=(W=u.parameters)==null?void 0:W.docs)==null?void 0:F.source}}};const J=["Demo","Controlled","Default","Overview","Position","AccessibilityAriaLabelledBy","AccessibilityAriaLabel"],er=Object.freeze(Object.defineProperty({__proto__:null,AccessibilityAriaLabel:u,AccessibilityAriaLabelledBy:p,Controlled:l,Default:w,Demo:c,Overview:g,Position:D,__namedExportsOrder:J,default:H},Symbol.toStringTag,{value:"Module"}));export{u as A,er as D,g as O,D as P,p as a,w as b};
