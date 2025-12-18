import{j as i}from"./jsx-runtime-BRNY0I4F.js";import{u as t}from"./index-aQ8yocgU.js";import{M as n,S as s}from"./index-Ce2ZrbMg.js";import"./Modal.stories-5N5r5MgP.js";import"./index-Bnop-kX6.js";import"./iframe-B1U64VhE.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./ods-react236-aAAP9SXj.js";import"./lib-BnpaaP8W-DKpmKREx.js";import"./QueryClientProvider-BPX08D6Z.js";import"./index-DnqQo6oJ.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./Badge-YOwwmnsf-CJ8iv41_.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./PopoverTrigger-4w4N6iLp-C-LGD_7X.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-BAi52a_A-BVjZSJoF.js";import"./index-DB9CF8IY-DC0Y2KvY.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./Card-D5fMAkqX-3SHynhw3.js";import"./Skeleton-tM01pV-R-CR0rfR_T.js";import"./Input-DcqcPYne-DrbRSC9d.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./Divider-THit99OS-DE11lmva.js";import"./Table-DeFepqjL-ijVQdBcH.js";import"./CheckboxLabel-BNqUGOsg-n6RGKdXc.js";import"./use-field-context-C3OOq-03-DvM5qnyl.js";import"./Tag-B7nBeuPX-CPCfmWrN.js";import"./SelectControl-C7d9WPuE-Bxj24dHo.js";import"./index-_7D5ljJ2-LyAubAEn.js";import"./ClipboardTrigger-TeqCWvgk-PkhT1oq0.js";import"./ModalTrigger-tZKHx0Fx-Dgqcdxhl.js";import"./dialog-trigger-DhWI7POy-2Tl6aad4.js";import"./render-strategy-BVcZ76SI-DDawKQXU.js";import"./TabContent-fruP9qhA-B5VnEOA-.js";import"./MessageIcon-yhpEHWAg-BtZxEFo4.js";import"./BreadcrumbItem-elPaHQlb-CNpnNsvr.js";import"./DrawerTrigger-omPTo2Bn-DB5oJcOC.js";import"./DatepickerControl-4VwQb-ep-Ct4shRTG.js";import"./ComboboxControl-sJOkWHeT-CC0kWNMj.js";import"./index-D_fe-3SC-C5ZKsUXO.js";function o(r){const e={code:"code",h2:"h2",h3:"h3",li:"li",p:"p",strong:"strong",ul:"ul",...t(),...r.components};return i.jsxs(i.Fragment,{children:[i.jsx(n,{title:"Manager UI Kit/Components/Modal/Documentation"}),`
`,i.jsx(e.h2,{id:"overview",children:"Overview"}),`
`,i.jsxs(e.p,{children:["A ",i.jsx(e.code,{children:"Modal"})," is used to provide some information to users that needs a response or immediate attention."]}),`
`,i.jsx(e.h2,{id:"usage",children:"Usage"}),`
`,i.jsxs(e.p,{children:[i.jsx(e.strong,{children:"Modals"})," are used in different cases:"]}),`
`,i.jsxs(e.ul,{children:[`
`,i.jsx(e.li,{children:"alerting users about something that requires their agreement"}),`
`,i.jsx(e.li,{children:"confirming a user decision"}),`
`,i.jsx(e.li,{children:"notifying the user of an important information"}),`
`]}),`
`,i.jsxs(e.p,{children:["There are five different subtypes of ",i.jsx(e.strong,{children:"Modals"})," to inform users that a problem requires immediate response from them so the process can continue, depending on the usage:"]}),`
`,i.jsxs(e.ul,{children:[`
`,i.jsxs(e.li,{children:[i.jsx(e.strong,{children:"neutral"})," : reserved for standard alerting"]}),`
`,i.jsxs(e.li,{children:[i.jsx(e.strong,{children:"information"})," : provides information to users in context"]}),`
`,i.jsxs(e.li,{children:[i.jsx(e.strong,{children:"success"})," : reserved to provide a static persistent success information"]}),`
`,i.jsxs(e.li,{children:[i.jsx(e.strong,{children:"warning"})," : reserved for ",i.jsx(e.strong,{children:"Modals"})," that need the user attention and acknowledgment but might not cause errors"]}),`
`,i.jsxs(e.li,{children:[i.jsx(e.strong,{children:"critical"})," : reserved for errors, malfunctions, as well as critical issues"]}),`
`]}),`
`,i.jsx(e.p,{children:"They can be dismissable or not."}),`
`,i.jsx(e.h2,{id:"example-of-definition",children:"Example of definition"}),`
`,i.jsx(s,{code:`
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
`,i.jsx(e.h3,{id:"step-indicator-feature-to-modal",children:"Step indicator feature to Modal"}),`
`,i.jsx(e.p,{children:'Allows displaying "Step X of Y" in the modal header.'})]})}function li(r={}){const{wrapper:e}={...t(),...r.components};return e?i.jsx(e,{...r,children:i.jsx(o,{...r})}):o(r)}export{li as default};
