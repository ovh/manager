import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as s}from"./index-BfqaEpqY.js";import{M as o,S as t}from"./index-BxLe8RGf.js";import"./Modal.stories-wCerIoYj.js";import"./index-Bnop-kX6.js";import"./iframe-lMOw8NAl.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./lib-7WI39Bnb-D_SCLDHY.js";import"./QueryClientProvider-BRZnJt9g.js";import"./index-Do5RsF8R.js";import"./Icon-xxQ9IRzi-ORI6lMWl.js";import"./index-CWkFp9WS-BSIT86NH.js";import"./Link-TMoA1i18-DiBAU0SL.js";import"./Text-BGoUCJU7-BjFZdlzU.js";import"./ComboboxControl-EYkaEIlI-CWYTos8A.js";import"./Divider-wQyo85oE-5vlIiwia.js";function r(i){const n={code:"code",h2:"h2",h3:"h3",li:"li",p:"p",strong:"strong",ul:"ul",...s(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Manager UI Kit/Components/Modal/Documentation"}),`
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
      loading={false}
      primaryButton={{
        label: 'Confirm',
        loading: false,
        onClick: {() => {}},
        disabled: false,
      }}
      secondaryButton={{
        label: 'Cancel',
        loading: false,
        onClick: {() => {}},
        disabled: false,
      }}
      onOpenChange={() => {}}
      open={true}
    >
      <div>Example of content</div>
    </Modal>`,language:"javascript"}),`
`,e.jsx(n.h3,{id:"step-indicator-feature-to-modal",children:"Step indicator feature to Modal"}),`
`,e.jsx(n.p,{children:'Allows displaying "Step X of Y" in the modal header.'})]})}function D(i={}){const{wrapper:n}={...s(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(r,{...i})}):r(i)}export{D as default};
