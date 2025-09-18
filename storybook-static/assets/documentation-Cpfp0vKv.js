import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as r}from"./index-BbbfVuzK.js";import"./index-C9Wt_f2B.js";import"./tags-tile.stories-26UxLtpB.js";import{M as o}from"./index-B3OJxjuP.js";import"./index-Bnop-kX6.js";import"./preview-CL2CABZT.js";import"./iframe-C_3YMFde.js";import"./DocsRenderer-CFRXHY34-hoPQnzfO.js";import"./client-CNjLE6tr.js";import"./index-D0sJu8id.js";import"./manager-react-components-lib.es-CQ9xw0iS.js";import"./QueryClientProvider-DbnhbVMg.js";import"./index-D1HcsAmU.js";import"./context-Cuu9iSAu.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function s(t){const n={br:"br",code:"code",em:"em",h1:"h1",h2:"h2",hr:"hr",p:"p",pre:"pre",strong:"strong",...r(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Manager React Components/Components/TagsTile/Documentation"}),`
`,e.jsx(n.h1,{id:"overview",children:"Overview"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"TagsTile"})," component displays a tile that show ",e.jsx(n.strong,{children:"tags"})," (key-value pairs) associated with an item (e.g., a customer, resource, etc.).",e.jsx(n.br,{}),`
`,"It leverages OVHcloud’s ODS React components for consistent design and behavior."]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"-props",children:"✨ Props"}),`
`,e.jsxs(n.p,{children:[`| Prop                 | Type                                  | Description                                                                 |
| -------------------- | ------------------------------------- | --------------------------------------------------------------------------- |
| `,e.jsx(n.code,{children:"tags"}),"              | ",e.jsx(n.code,{children:"{ [key: string]: string }"}),`           | A dictionary of tags to display (key-value pairs).                          |
| `,e.jsx(n.code,{children:"displayInternalTags"})," | ",e.jsx(n.code,{children:"boolean"})," ",e.jsx(n.em,{children:"(optional)"}),"              | Whether to display internal tags. ",e.jsx(n.em,{children:"(currently not used directly inside)"}),`    |
| `,e.jsx(n.code,{children:"onEditTags"}),"        | ",e.jsx(n.code,{children:"() => void"}),"                          | Callback triggered when the user clicks the ",e.jsx(n.strong,{children:"Edit Tags"})," button.           |"]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"-features",children:"🔍 Features"}),`
`,e.jsxs(n.p,{children:["✅ Displays a list of tags",e.jsx(n.br,{}),`
`,"✅ Includes action buttons to ",e.jsx(n.strong,{children:"edit tags"})]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"-usage-example",children:"📦 Usage Example"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { TagsTile } from '@ovh-ux/manager-react-components';

export const Example = () => {
  const tags = {
    environment: 'production',
    owner: 'dev-team',
    priority: 'high',
  };

  return (
    <div>
      <TagsTile
        tags={tags}
        onEditTags={() => {
          console.log('Edit tags clicked');
        }}
      />
    </div>
  );
};
`})})]})}function w(t={}){const{wrapper:n}={...r(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(s,{...t})}):s(t)}export{w as default};
