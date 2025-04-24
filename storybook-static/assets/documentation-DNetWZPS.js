import{j as e}from"./jsx-runtime-CKrituN3.js";import{M as o,b as t}from"./index-DHRn6AGu.js";import"./Modal.stories-CRaP84cs.js";import{useMDXComponents as r}from"./index-C-_6Vi3R.js";import"./index-CBqU2yxZ.js";import"./_commonjsHelpers-BosuxZz1.js";import"./iframe-BlIAnhRS.js";import"../sb-preview/runtime.js";import"./index-BtM5VmRH.js";import"./index-D_r38UMq.js";import"./index-Cmc67Rxs.js";import"./index-DrFu-skq.js";import"./index-CqmMgYso.js";import"./index-BoGQ30sD.js";function i(s){const n=Object.assign({h1:"h1",h2:"h2",p:"p",code:"code",strong:"strong",ul:"ul",li:"li"},r(),s.components);return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"components/Modal"}),`
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
    </Modal>`,language:"javascript"})]})}function M(s={}){const{wrapper:n}=Object.assign({},r(),s.components);return n?e.jsx(n,Object.assign({},s,{children:e.jsx(i,s)})):i(s)}export{M as default};
