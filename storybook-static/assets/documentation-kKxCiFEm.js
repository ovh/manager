import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as r}from"./index-NIBtEG5f.js";import{M as o,S as t}from"./index-BFciP_LS.js";import"./Modal.stories-DW8x2Tt5.js";import"./index-Bnop-kX6.js";import"./iframe-BQvUUDfK.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./index-CYx7_Ein.js";import"./Modal.component-Dl-hfVlX.js";import"./index-w9OafIJF.js";import"./ods-toggle2-B24SOLJO.js";function i(s){const n={code:"code",h1:"h1",h2:"h2",li:"li",p:"p",strong:"strong",ul:"ul",...r(),...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"components/Modal"}),`
`,e.jsx(n.h1,{id:"modal",children:"Modal"}),`
`,e.jsx(n.h2,{id:"overview",children:"Overview"}),`
`,e.jsxs(n.p,{children:["A ",e.jsx(n.code,{children:"Modal"})," is used to provide some information to users that needs a response or immediate attention."]}),`
`,e.jsx(n.h2,{id:"usage",children:"Usage"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Modals"})," are used in different cases:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"alerting users about something that requires their agreement"}),`
`,e.jsx(n.li,{children:"confirming a user decision"}),`
`,e.jsx(n.li,{children:"notifying the user of an important information"}),`
`]}),`
`,e.jsxs(n.p,{children:["There are five different subtypes of ",e.jsx(n.strong,{children:"Modals"})," to inform users that a problem requires immediate response from them so the process can continue, depending on the usage:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"neutral"})," : reserved for standard alerting"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"information"})," : provides information to users in context"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"success"})," : reserved to provide a static persistent success information"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"warning"})," : reserved for ",e.jsx(n.strong,{children:"Modals"})," that need the user attention and acknowledgment but might not cause errors"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"critical"})," : reserved for errors, malfunctions, as well as critical issues"]}),`
`]}),`
`,e.jsx(n.p,{children:"They can be dismissable or not."}),`
`,e.jsx(n.h2,{id:"example-of-definition",children:"Example of definition"}),`
`,e.jsx(t,{code:`
    <Modal
      heading={'Example of modal'}
      type={'warning'}
      isLoading={false}
      primaryLabel={'Confirm'}
      isPrimaryButtonLoading={false}
      isPrimaryButtonDisabled={false}
      onPrimaryButtonClick={() => {}}
      secondaryLabel={'Cancel'}
      isSecondaryButtonDisabled={false}
      isSecondaryButtonLoading={false}
      onSecondaryButtonClick={() => {}}
      onDismiss={() => {}}
      isOpen={true}
    >
      <div>Example of content</div>
    </Modal>`,language:"javascript"})]})}function M(s={}){const{wrapper:n}={...r(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(i,{...s})}):i(s)}export{M as default};
