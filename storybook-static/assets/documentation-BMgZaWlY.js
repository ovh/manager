import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as o}from"./index-DdETsLzO.js";import{M as r,S as i}from"./index-BiZMyzLv.js";import"./index-Bnop-kX6.js";import"./iframe-Cw17PQb7.js";import"./index-D0sJu8id.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function t(s){const n={code:"code",h2:"h2",li:"li",ol:"ol",p:"p",...o(),...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(r,{title:"Manager React Components/Hooks/useBytes"}),`
`,e.jsx(n.h2,{id:"overview",children:"Overview"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"useBytes"})," custom React hook is designed to dynamically convert units from the API to the front-end."]}),`
`,e.jsx(n.h2,{id:"usage",children:"Usage"}),`
`,e.jsx(n.p,{children:"Why 1000 or 1024?"}),`
`,e.jsx(n.p,{children:"The useBytes hook supports two different unit systems: decimal (base 10) and binary (base 2). The choice between 1000 and 1024 depends on the context:"}),`
`,e.jsx(n.p,{children:"Decimal (1000-based): Also known as SI (International System of Units), this system uses multiples of 1000. It is commonly used in networking and storage device specifications, such as hard drive manufacturers advertising capacity."}),`
`,e.jsx(n.p,{children:"1 KB = 1000 B"}),`
`,e.jsx(n.p,{children:"1 MB = 1000 KB"}),`
`,e.jsx(n.p,{children:"1 GB = 1000 MB"}),`
`,e.jsx(n.p,{children:"Binary (1024-based): Also known as IEC (International Electrotechnical Commission) standard, this system uses multiples of 1024. It is widely used in computing, including operating systems and memory (RAM) calculations."}),`
`,e.jsx(n.p,{children:"1 KiB = 1024 B"}),`
`,e.jsx(n.p,{children:"1 MiB = 1024 KiB"}),`
`,e.jsx(n.p,{children:"1 GiB = 1024 MiB"}),`
`,e.jsx(n.h2,{id:"units-using-on-the-component",children:"Units using on the component"}),`
`,e.jsx(i,{code:`
  const UNITS = {
  1000: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
  1024: ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'],
};
  `,language:"javascript"}),`
`,e.jsx(n.h2,{id:"usage-on-your-application",children:"Usage on your application"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:["Import and use the ",e.jsx(n.code,{children:"useBytes"})," utility in your component."]}),`
`]}),`
`,e.jsx(i,{code:`
  import { useBytes } from './useBytes';

const MyComponent = () => {
const { formatBytes } = useBytes();

    const size = 123456789;

    return (
      <div>
        <p>Size: {formatBytes(size, 2, 1000)}</p>
        <p>Size: {formatBytes(size, 2, 1024)}</p>
      </div>
    );

};
`,language:"javascript"}),`
`,e.jsx(n.p,{children:"On this example, the number defined 2 is the number of decimal."}),`
`,e.jsx(n.p,{children:`The result for this 2 :
Size: 123.46 MB and Size: 117.74 MiB`})]})}function B(s={}){const{wrapper:n}={...o(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(t,{...s})}):t(s)}export{B as default};
