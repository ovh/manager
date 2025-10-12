import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as t}from"./index-BenGHN5L.js";import"./index-CyP_Aymi.js";import"./tags-modal.stories-C90-UVa5.js";import{M as r}from"./index-EQhVOb-2.js";import"./index-Bnop-kX6.js";import"./preview-DA_Lt1eY.js";import"./iframe-BHu8F3gw.js";import"./DocsRenderer-CFRXHY34-CEdQlZpP.js";import"./client-CNjLE6tr.js";import"./index-D0sJu8id.js";import"./index-D1HcsAmU.js";import"./context-Cuu9iSAu.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function o(s){const n={br:"br",code:"code",em:"em",h1:"h1",h2:"h2",hr:"hr",p:"p",pre:"pre",strong:"strong",...t(),...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(r,{title:"Manager React Components/Components/TagsModal/Documentation"}),`
`,e.jsx(n.h1,{id:"overview",children:"Overview"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"TagsModal"})," component displays a modal window that shows and allows searching through ",e.jsx(n.strong,{children:"tags"})," (key-value pairs) associated with an item (e.g., a customer, resource, etc.).",e.jsx(n.br,{}),`
`,"It leverages OVHcloud’s ODS React components for consistent design and behavior."]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"-props",children:"✨ Props"}),`
`,e.jsxs(n.p,{children:[`| Prop                 | Type                                  | Description                                                                 |
| -------------------- | ------------------------------------- | --------------------------------------------------------------------------- |
| `,e.jsx(n.code,{children:"displayName"}),"        | ",e.jsx(n.code,{children:"string"}),`                              | The name or label displayed in the modal header.                            |
| `,e.jsx(n.code,{children:"isOpen"}),"            | ",e.jsx(n.code,{children:"boolean"}),"                             | If ",e.jsx(n.code,{children:"true"}),`, the modal is visible.                                            |
| `,e.jsx(n.code,{children:"tags"}),"              | ",e.jsx(n.code,{children:"{ [key: string]: string }"}),`           | A dictionary of tags to display (key-value pairs).                          |
| `,e.jsx(n.code,{children:"displayInternalTags"})," | ",e.jsx(n.code,{children:"boolean"})," ",e.jsx(n.em,{children:"(optional)"}),"              | Whether to display internal tags. ",e.jsx(n.em,{children:"(currently not used directly inside)"}),`    |
| `,e.jsx(n.code,{children:"onCancel"}),"          | ",e.jsx(n.code,{children:"() => void"}),"                          | Callback triggered when the user closes the modal (or clicks ",e.jsx(n.strong,{children:"Back"}),`).     |
| `,e.jsx(n.code,{children:"onEditTags"}),"        | ",e.jsx(n.code,{children:"() => void"}),"                          | Callback triggered when the user clicks the ",e.jsx(n.strong,{children:"Edit Tags"})," button.           |"]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"-features",children:"🔍 Features"}),`
`,e.jsxs(n.p,{children:["✅ Displays a scrollable list of tags",e.jsx(n.br,{}),`
`,"✅ Allows searching tags by key or value",e.jsx(n.br,{}),`
`,"✅ Includes action buttons to ",e.jsx(n.strong,{children:"go back"})," or ",e.jsx(n.strong,{children:"edit tags"})]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"-usage-example",children:"📦 Usage Example"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import React, { useState, useRef } from 'react';
import { TagsModal } from '@ovh-ux/manager-react-components';

export const Example = () => {
  const modalRef = useRef(null);
  const [isOpen, setIsOpen] = useState(true);

  const tags = {
    environment: 'production',
    owner: 'dev-team',
    priority: 'high',
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Tags Modal</button>
      <TagsModal
        ref={modalRef}
        isOpen={isOpen}
        displayName="My Resource"
        tags={tags}
        onCancel={() => setIsOpen(false)}
        onEditTags={() => {
          console.log('Edit tags clicked');
        }}
      />
    </div>
  );
};
`})})]})}function v(s={}){const{wrapper:n}={...t(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(o,{...s})}):o(s)}export{v as default};
