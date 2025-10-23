import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as r}from"./index-CV0VGdxz.js";import{M as o,S as s}from"./index-CMKucGNf.js";import"./Drawer.stories-CNf00ThF.js";import"./index-Bnop-kX6.js";import"./iframe-BMOkqioy.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./lib-Bpiw0_2K-CzLxCNwi.js";import"./index-f6p-lzcj.js";import"./DrawerBase.component-Dyvmebwj.js";import"./clsx-B-dksMZM.js";function i(t){const n={code:"code",h2:"h2",li:"li",p:"p",strong:"strong",ul:"ul",...r(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Manager UI Kit/components/Drawer/Documentation"}),`
`,e.jsx(n.h2,{id:"overview",children:"Overview"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"Drawer"})," component is an expandable panel that slides in from the right side of the screen, designed to display contextual content or forms without disrupting the main interface, it is very close to a Modal, but with more space."]}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"DrawerCollapsible"})," is very similar, but it allows the user to access the content of the page without the overlay. And it can completely collapse, revealing what might be hidden behind it."]}),`
`,e.jsx(n.h2,{id:"usage",children:"Usage"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Drawers"})," are used in various scenarios::"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Displaying supplementary content while maintaining the main view"}),`
`,e.jsx(n.li,{children:"Providing forms or information panels that slide in from the edge of the screen"}),`
`,e.jsx(n.li,{children:"Creating a workflow that doesn't completely interrupt the user's current context"}),`
`]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Collapsible Drawer"})," is intended for specific use cases where we want the user to access the content of the page while interacting with the drawer."]}),`
`,e.jsxs(n.p,{children:["The default ",e.jsx(n.code,{children:"Drawer"})," should be prefered in most cases."]}),`
`,e.jsx(n.h2,{id:"example-of-definition",children:"Example of definition"}),`
`,e.jsxs(n.p,{children:["✅ Place your content in a ",e.jsx(n.code,{children:"Drawer.Content"})," component to ensure good positioning."]}),`
`,e.jsx(n.p,{children:"❌ Don't put content directly at the root of the drawer."}),`
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
`,e.jsx(n.h2,{id:"features",children:"Features"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Loading state to display a spinner while content loads"}),`
`,e.jsx(n.li,{children:"Automatic vertical scroll for long content"}),`
`,e.jsx(n.li,{children:"Keyboard accessibility (Esc key to close)"}),`
`]})]})}function D(t={}){const{wrapper:n}={...r(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(i,{...t})}):i(t)}export{D as default};
