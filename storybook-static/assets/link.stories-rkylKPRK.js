import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{t as s}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l as a}from"./ods-react60-0db41gCx.js";import{y as o}from"./Link-BWQEuWpd-B5_veLQO.js";import{d as F,e as B,o as K,C as h,s as r}from"./ods-docgen-map-Df86OYwU.js";o.__docgenInfo=F.link;const P={argTypes:B(["as"]),component:o,title:"Manager UI Kit/Components/Link/Base"},t={argTypes:K({children:{table:{category:h.slot},control:"text"},disabled:{table:{category:h.general},control:"boolean"}}),args:{children:"My link"}},n={globals:{imports:"import { Link } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...r()}}},render:({})=>e.jsx(o,{href:"https://www.ovhcloud.com",children:"Default Link"})},c={globals:{imports:"import { Link } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...r()}}},render:({})=>e.jsx(o,{disabled:!0,href:"https://www.ovhcloud.com",children:"Disabled"})},i={tags:["!dev"],parameters:{layout:"centered",docs:{source:{...r()}}},render:({})=>e.jsx(o,{href:"https://www.ovhcloud.com",target:"_blank",children:"Link"})},d={decorators:[u=>e.jsx("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr"},children:u()})],globals:{imports:"import { ICON_NAME, Icon, Link } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...r()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsxs(o,{href:"https://www.ovhcloud.com",children:[e.jsx(s,{name:a.arrowLeft}),"Icon Link"]}),e.jsxs(o,{href:"https://www.ovhcloud.com",style:{justifySelf:"right"},children:["Icon Link",e.jsx(s,{name:a.arrowRight})]})]})},l={globals:{imports:"import { ICON_NAME, Icon, Link } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...r()}}},render:({})=>e.jsx(o,{"aria-label":"Go to homepage",href:"https://www.ovhcloud.com",children:e.jsx(s,{name:a.home})})},m={globals:{imports:"import { ICON_NAME, Icon, Link } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...r()}}},render:({})=>e.jsx(o,{"aria-label":"Visit Example (opens in a new tab)",href:"https://www.ovhcloud.com",target:"_blank",children:e.jsx(s,{name:a.externalLink})})},p={decorators:[u=>e.jsx("div",{style:{display:"grid",gridTemplateColumns:"1fr"},children:u()})],globals:{imports:"import { ICON_NAME, Icon, Link } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...r()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsx(o,{"aria-label":"Download WCAG20 Guidelines (PDF, 481 KB)",href:"https://www.w3.org/TR/2024/REC-WCAG21-20241212.pdf",children:e.jsx(s,{name:a.download})}),e.jsxs(o,{href:"https://www.w3.org/TR/2024/REC-WCAG21-20241212.pdf",children:[e.jsx(s,{name:a.download}),e.jsx("span",{children:"Download WCAG20 Guidelines (PDF, 481 KB)"})]})]})};var g,w,f;t.parameters={...t.parameters,docs:{...(g=t.parameters)==null?void 0:g.docs,source:{originalSource:`{
  argTypes: orderControls({
    children: {
      table: {
        category: CONTROL_CATEGORY.slot
      },
      control: 'text'
    },
    disabled: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'boolean'
    }
  }),
  args: {
    // @ts-ignore check when time to do so
    children: 'My link'
  }
}`,...(f=(w=t.parameters)==null?void 0:w.docs)==null?void 0:f.source}}};var k,v,b;n.parameters={...n.parameters,docs:{...(k=n.parameters)==null?void 0:k.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Link } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Link href="https://www.ovhcloud.com">
      Default Link
    </Link>
}`,...(b=(v=n.parameters)==null?void 0:v.docs)==null?void 0:b.source}}};var L,C,I;c.parameters={...c.parameters,docs:{...(L=c.parameters)==null?void 0:L.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Link } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Link disabled href="https://www.ovhcloud.com">
      Disabled
    </Link>
}`,...(I=(C=c.parameters)==null?void 0:C.docs)==null?void 0:I.source}}};var y,A,N;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Link href="https://www.ovhcloud.com" target="_blank">
      Link
    </Link>
}`,...(N=(A=i.parameters)==null?void 0:A.docs)==null?void 0:N.source}}};var x,O,_;d.parameters={...d.parameters,docs:{...(x=d.parameters)==null?void 0:x.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr'
  }}>{story()}</div>],
  globals: {
    imports: \`import { ICON_NAME, Icon, Link } from '@ovhcloud/ods-react';\`
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
      <Link href="https://www.ovhcloud.com">
        <Icon name={ICON_NAME.arrowLeft} />Icon Link
      </Link>

      <Link href="https://www.ovhcloud.com" style={{
      justifySelf: 'right'
    }}>
        Icon Link<Icon name={ICON_NAME.arrowRight} />
      </Link>
    </>
}`,...(_=(O=d.parameters)==null?void 0:O.docs)==null?void 0:_.source}}};var j,E,R;l.parameters={...l.parameters,docs:{...(j=l.parameters)==null?void 0:j.docs,source:{originalSource:`{
  globals: {
    imports: \`import { ICON_NAME, Icon, Link } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Link aria-label="Go to homepage" href="https://www.ovhcloud.com">
      <Icon name={ICON_NAME.home} />
    </Link>
}`,...(R=(E=l.parameters)==null?void 0:E.docs)==null?void 0:R.source}}};var D,S,T;m.parameters={...m.parameters,docs:{...(D=m.parameters)==null?void 0:D.docs,source:{originalSource:`{
  globals: {
    imports: \`import { ICON_NAME, Icon, Link } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Link aria-label="Visit Example (opens in a new tab)" href="https://www.ovhcloud.com" target="_blank">
      <Icon name={ICON_NAME.externalLink} />
    </Link>
}`,...(T=(S=m.parameters)==null?void 0:S.docs)==null?void 0:T.source}}};var M,G,W;p.parameters={...p.parameters,docs:{...(M=p.parameters)==null?void 0:M.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'grid',
    gridTemplateColumns: '1fr'
  }}>{story()}</div>],
  globals: {
    imports: \`import { ICON_NAME, Icon, Link } from '@ovhcloud/ods-react';\`
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
      <Link aria-label="Download WCAG20 Guidelines (PDF, 481 KB)" href="https://www.w3.org/TR/2024/REC-WCAG21-20241212.pdf">
        <Icon name={ICON_NAME.download} />
      </Link>

      <Link href="https://www.w3.org/TR/2024/REC-WCAG21-20241212.pdf">
        <Icon name={ICON_NAME.download} />

        <span>Download WCAG20 Guidelines (PDF, 481 KB)</span>
      </Link>
    </>
}`,...(W=(G=p.parameters)==null?void 0:G.docs)==null?void 0:W.source}}};const Y=["Demo","Default","Disabled","Overview","WithIcon","AccessibilityIconOnlyLink","AccessibilityInANewTab","AccessibilityFileDownload"],J=Object.freeze(Object.defineProperty({__proto__:null,AccessibilityFileDownload:p,AccessibilityIconOnlyLink:l,AccessibilityInANewTab:m,Default:n,Demo:t,Disabled:c,Overview:i,WithIcon:d,__namedExportsOrder:Y,default:P},Symbol.toStringTag,{value:"Module"}));export{l as A,n as D,J as L,i as O,d as W,m as a,p as b,c};
