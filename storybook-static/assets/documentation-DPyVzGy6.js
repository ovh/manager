import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as r}from"./index-BfqaEpqY.js";import{M as o,S as s}from"./index-BxLe8RGf.js";import"./Drawer.stories-BzxqHgoA.js";import"./index-Bnop-kX6.js";import"./iframe-lMOw8NAl.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./lib-7WI39Bnb-D_SCLDHY.js";import"./QueryClientProvider-BRZnJt9g.js";import"./index-Do5RsF8R.js";import"./Icon-xxQ9IRzi-ORI6lMWl.js";import"./index-CWkFp9WS-BSIT86NH.js";import"./Link-TMoA1i18-DiBAU0SL.js";import"./Text-BGoUCJU7-BjFZdlzU.js";import"./ComboboxControl-EYkaEIlI-CWYTos8A.js";import"./Divider-wQyo85oE-5vlIiwia.js";import"./DrawerBase.component-H8s9KGX7.js";import"./clsx-B-dksMZM.js";import"./TranslationHelper-7cH0T-pu.js";function i(n){const t={code:"code",h2:"h2",li:"li",p:"p",strong:"strong",ul:"ul",...r(),...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Manager UI Kit/components/Drawer/Documentation"}),`
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
`]})]})}function S(n={}){const{wrapper:t}={...r(),...n.components};return t?e.jsx(t,{...n,children:e.jsx(i,{...n})}):i(n)}export{S as default};
