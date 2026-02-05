import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as a}from"./index-D9W7WIyf.js";import{M as l,C as c,S as m}from"./index-CkYkztty.js";import{T as p,S as x}from"./TechnicalSpecification-Brad-Fja.js";import{B as u,H as n,E as d}from"./Heading-BcnbeE2C.js";import{C as r}from"./Canvas-BkeCGmgx.js";import{L as s,O as j,D as f,c as h,W as k}from"./link.stories-CImJTA06.js";import"./index-Bnop-kX6.js";import"./iframe-BRkcAREb.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./Icon-xxQ9IRzi-ORI6lMWl.js";import"./index-CWkFp9WS-BSIT86NH.js";import"./Link-TMoA1i18-DiBAU0SL.js";import"./Text-BGoUCJU7-BjFZdlzU.js";import"./ComboboxControl-EYkaEIlI-CWYTos8A.js";import"./Divider-wQyo85oE-5vlIiwia.js";import"./ods-docgen-map-Df86OYwU.js";function i(o){const t={code:"code",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",...a(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(l,{of:s,name:"Technical information"}),`
`,e.jsx(u,{of:s}),`
`,e.jsx(n,{label:"Overview",level:2}),`
`,e.jsx(c,{of:j,sourceState:"none"}),`
`,e.jsx(n,{label:"Anatomy",level:2}),`
`,e.jsx(t.p,{children:e.jsx(t.img,{src:"./base-assets/components/link/anatomy-tech.png",alt:"Component anatomy",title:"Component anatomy"})}),`
`,e.jsxs(t.ol,{children:[`
`,e.jsx(t.li,{children:e.jsx(t.strong,{children:"Link"})}),`
`]}),`
`,e.jsx(p,{data:x,extraInfo:{Link:{extendAttribute:{name:"a",url:"https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#attributes"}}},of:s}),`
`,e.jsx(n,{label:"Examples",level:2}),`
`,e.jsx(n,{label:"Default",level:3}),`
`,e.jsx(r,{of:f,sourceState:"shown"}),`
`,e.jsx(n,{label:"Disabled",level:3}),`
`,e.jsx(r,{of:h,sourceState:"shown"}),`
`,e.jsx(n,{label:"With Icon",level:3}),`
`,e.jsx(r,{of:k,sourceState:"shown"}),`
`,e.jsx(n,{label:"React Router integration",level:3}),`
`,e.jsxs(t.p,{children:["Using the ",e.jsx(t.code,{children:"as"})," attribute, you can use the ",e.jsx(t.strong,{children:"Link"})," component with external libraries like ",e.jsx(d,{href:"https://reactrouter.com/",children:"React Router"}),"."]}),`
`,e.jsx(m,{code:`
import { Link as OdsLink } from '@ovhcloud/ods-react';
import { Link as RouterLink } from 'react-router-dom';

const Link = ({ children, route }) => {
  return (
    <OdsLink
      as={ RouterLink }
      to={ route }>
      { children }
    </OdsLink>
  );
};

export { Link };
`,dark:"true",language:"typescript"})]})}function B(o={}){const{wrapper:t}={...a(),...o.components};return t?e.jsx(t,{...o,children:e.jsx(i,{...o})}):i(o)}export{B as default};
