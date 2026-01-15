import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as o}from"./index-XxUZGkLd.js";import{M as n,S as s}from"./index-a-pfv-Xa.js";import"./Drawer.stories-DPArEEiD.js";import"./index-Bnop-kX6.js";import"./iframe-DVaWS9ZP.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./lib-D44cvI9Y-BEmnv0Ot.js";import"./QueryClientProvider-BPX08D6Z.js";import"./index-DnqQo6oJ.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./Badge-YOwwmnsf-CJ8iv41_.js";import"./ods-react236-aAAP9SXj.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./PopoverTrigger-4w4N6iLp-C-LGD_7X.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-BAi52a_A-BVjZSJoF.js";import"./index-DB9CF8IY-DC0Y2KvY.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./Card-D5fMAkqX-3SHynhw3.js";import"./Skeleton-tM01pV-R-CR0rfR_T.js";import"./Input-DcqcPYne-DrbRSC9d.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./Divider-THit99OS-DE11lmva.js";import"./Table-DeFepqjL-ijVQdBcH.js";import"./CheckboxLabel-BNqUGOsg-n6RGKdXc.js";import"./use-field-context-C3OOq-03-DvM5qnyl.js";import"./Tag-B7nBeuPX-CPCfmWrN.js";import"./SelectControl-C7d9WPuE-Bxj24dHo.js";import"./index-_7D5ljJ2-LyAubAEn.js";import"./ClipboardTrigger-TeqCWvgk-PkhT1oq0.js";import"./ModalTrigger-tZKHx0Fx-Dgqcdxhl.js";import"./dialog-trigger-DhWI7POy-2Tl6aad4.js";import"./render-strategy-BVcZ76SI-DDawKQXU.js";import"./TabContent-fruP9qhA-B5VnEOA-.js";import"./MessageIcon-yhpEHWAg-BtZxEFo4.js";import"./BreadcrumbItem-elPaHQlb-CNpnNsvr.js";import"./DrawerTrigger-omPTo2Bn-DB5oJcOC.js";import"./DatepickerControl-4VwQb-ep-Ct4shRTG.js";import"./ComboboxControl-sJOkWHeT-CC0kWNMj.js";import"./index-D_fe-3SC-C5ZKsUXO.js";import"./DrawerBase.component-BRgQI0oZ.js";import"./clsx-B-dksMZM.js";import"./TranslationHelper-CuIWJbDW.js";function r(i){const t={code:"code",h2:"h2",li:"li",p:"p",strong:"strong",ul:"ul",...o(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(n,{title:"Manager UI Kit/components/Drawer/Documentation"}),`
`,e.jsx(t.h2,{id:"overview",children:"Overview"}),`
`,e.jsxs(t.p,{children:["The ",e.jsx(t.code,{children:"Drawer"})," component is an expandable panel that slides in from the right side of the screen, designed to display contextual content or forms without disrupting the main interface, it is very close to a Modal, but with more space."]}),`
`,e.jsxs(t.p,{children:["The ",e.jsx(t.code,{children:"DrawerCollapsible"})," is very similar, but it allows the user to access the content of the page without the overlay. And it can completely collapse, revealing what might be hidden behind it."]}),`
`,e.jsx(t.h2,{id:"usage",children:"Usage"}),`
`,e.jsxs(t.p,{children:[e.jsx(t.strong,{children:"Drawers"})," are used in various scenarios::"]}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsx(t.li,{children:"Displaying supplementary content while maintaining the main view"}),`
`,e.jsx(t.li,{children:"Providing forms or information panels that slide in from the edge of the screen"}),`
`,e.jsx(t.li,{children:"Creating a workflow that doesn't completely interrupt the user's current context"}),`
`]}),`
`,e.jsxs(t.p,{children:[e.jsx(t.strong,{children:"Collapsible Drawer"})," is intended for specific use cases where we want the user to access the content of the page while interacting with the drawer."]}),`
`,e.jsxs(t.p,{children:["The default ",e.jsx(t.code,{children:"Drawer"})," should be prefered in most cases."]}),`
`,e.jsx(t.h2,{id:"example-of-definition",children:"Example of definition"}),`
`,e.jsxs(t.p,{children:["✅ Place your content in a ",e.jsx(t.code,{children:"Drawer.Content"})," component to ensure good positioning."]}),`
`,e.jsx(t.p,{children:"❌ Don't put content directly at the root of the drawer."}),`
`,e.jsx(s,{code:`
<Drawer.Root
  isOpen={isOpen}
  onDismiss={handleDismiss}
  isLoading={isLoading}
  >
  <Drawer.Header
    title="This is the drawer title"
  />
  <Drawer.Content>
    <div>
      The is the custom content of the drawer<
    /div>
  </Drawer.Content>
  <Drawer.Footer
    primaryButtonLabel="Submit"
    isPrimaryButtonDisabled={isDisabled}
    isPrimaryButtonLoading={isSubmiting}
    onPrimaryButtonClick={handleSubmit}
    secondaryButtonLabel="Close"
    onSecondaryButtonClick={handleDismiss}
  />
</Drawer.Root>
    `,language:"tsx"}),`
`,e.jsx(t.h2,{id:"features",children:"Features"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsx(t.li,{children:"Loading state to display a spinner while content loads"}),`
`,e.jsx(t.li,{children:"Automatic vertical scroll for long content"}),`
`,e.jsx(t.li,{children:"Keyboard accessibility (Esc key to close)"}),`
`]})]})}function de(i={}){const{wrapper:t}={...o(),...i.components};return t?e.jsx(t,{...i,children:e.jsx(r,{...i})}):r(i)}export{de as default};
