import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as o}from"./index-DtBi2NJp.js";import{M as s,S as t}from"./index-0Pa5_OBP.js";import"./Drawer.stories-OFVOwOjW.js";import"./index-Bnop-kX6.js";import"./iframe-CsxCAwZL.js";import"./index-D0sJu8id.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./manager-react-components-lib.es-Ngpt3Dgi.js";import"./QueryClientProvider-DbnhbVMg.js";import"./index-D1HcsAmU.js";import"./context-Cuu9iSAu.js";import"./DrawerContent.component-BOU1ug-7.js";function r(i){const n={code:"code",h2:"h2",li:"li",p:"p",strong:"strong",ul:"ul",...o(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(s,{title:"Manager React Components/components/Drawer/Documentation"}),`
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
`,e.jsxs(n.p,{children:["⚠️ The default ",e.jsx(n.code,{children:"Drawer"})," should be prefered in most cases."]}),`
`,e.jsx(n.h2,{id:"example-of-definition",children:"Example of definition"}),`
`,e.jsx(t,{code:`
    <Drawer
      heading={'Example drawer'}
      onDismiss={() => {}}
      isOpen={true}
      primaryButtonLabel={'Confirm'}
      onPrimaryButtonClick={() => {}}
      secondaryButtonLabel={'Cancel'}
      onSecondaryButtonClick={() => {}}
    >
      <div>Example content</div>
    </Drawer>`,language:"javascript"}),`
`,e.jsx(t,{code:`
    <DrawerCollapsible
      heading={'Example of a collapsible drawer'}
      onDismiss={() => {}}
      isOpen={true}
    >
      <div>Example content</div>
    </DrawerCollapsible>`,language:"javascript"}),`
`,e.jsx(n.h2,{id:"features",children:"Features"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Loading state to display a spinner while content loads"}),`
`,e.jsx(n.li,{children:"Automatic vertical scroll for long content"}),`
`,e.jsx(n.li,{children:"Keyboard accessibility (Esc key to close)"}),`
`]})]})}function y(i={}){const{wrapper:n}={...o(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(r,{...i})}):r(i)}export{y as default};
