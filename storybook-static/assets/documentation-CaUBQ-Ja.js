import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as o}from"./index-CWIOTABv.js";import{M as s,S as t}from"./index-CExQY-2-.js";import"./Modal.stories-BgbIFnKg.js";import"./index-Bnop-kX6.js";import"./iframe-B25DnDzc.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./ods-react236-aAAP9SXj.js";import"./lib-D44cvI9Y-CkpjrNOq.js";import"./QueryClientProvider-BPX08D6Z.js";import"./with-selector-CbDTc_Tw.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-B5_veLQO.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./ComboboxControl-sJOkWHeT-DJbuE-Pm.js";import"./MessageIcon-yhpEHWAg-CXHPnT2G.js";import"./Divider-THit99OS-BLm7oKDW.js";function r(i){const n={code:"code",h2:"h2",h3:"h3",li:"li",p:"p",strong:"strong",ul:"ul",...o(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(s,{title:"Manager UI Kit/Components/Modal/Documentation"}),`
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
`,e.jsx(n.p,{children:'Allows displaying "Step X of Y" in the modal header.'})]})}function X(i={}){const{wrapper:n}={...o(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(r,{...i})}):r(i)}export{X as default};
