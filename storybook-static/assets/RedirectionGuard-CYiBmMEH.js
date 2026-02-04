import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as n}from"./index-g6nCrg6v.js";import{M as t,S as a}from"./index-CFQnl7m9.js";import{d}from"./index-BGUR791c.js";import"./index-Bnop-kX6.js";import"./iframe-CaW5sJsF.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./Link-TMoA1i18-DiBAU0SL.js";import"./index-CWkFp9WS-BSIT86NH.js";function i(o){const r={h1:"h1",h2:"h2",li:"li",ol:"ol",p:"p",strong:"strong",...n(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(t,{title:"Manager UI Kit/Components/Redirection Guard/Documentation"}),`
`,e.jsx(r.h1,{id:"redirection-guard",children:"Redirection Guard"}),`
`,e.jsx(r.h2,{id:"-overview",children:"🔍 Overview"}),`
`,e.jsx(r.p,{children:"The RedirectionGuard component is a conditional routing guard used to either:"}),`
`,e.jsxs(r.ol,{children:[`
`,e.jsx(r.li,{children:"Redirect the user to a specified route,"}),`
`,e.jsx(r.li,{children:"Render children content,"}),`
`,e.jsx(r.li,{children:"Show an error UI, or"}),`
`,e.jsx(r.li,{children:"Display a loading spinner — based on certain conditions."}),`
`]}),`
`,e.jsx(r.h2,{id:"-props",children:"📦 Props"}),`
`,e.jsx(d,{data:{columns:["Name","Type","Required","Description"],rows:[{Name:"route",Type:"string",Required:"✅ Yes",Description:"The route to redirect to if the condition is met."},{Name:"condition",Type:"boolean",Required:"✅ Yes",Description:"If true, the user will be redirected to route."},{Name:"isLoading",Type:"boolean",Required:"✅ Yes",Description:"If true, displays a loading spinner."},{Name:"children",Type:"React.ReactNode",Required:"✅ Yes",Description:"Content to render when no redirection is needed."},{Name:"isError",Type:"boolean",Required:"❌ No",Description:"Indicates whether an error has occurred."},{Name:"errorComponent",Type:"React.ReactNode",Required:"❌ No",Description:"A custom error component/UI to display if isError is true."}]}}),`
`,e.jsx(r.h2,{id:"usage",children:"Usage"}),`
`,e.jsxs(r.p,{children:["This component is commonly used to manage the display of either a ",e.jsx(r.strong,{children:"Listing or Onboarding page."}),` When a user opens a product in the Manager, they are shown the Listing page if they already have existing services of that product type; otherwise, they are redirected to the Onboarding page.
This component is handy to handle the loading state, error handling and redirection depending on the condition.`]}),`
`,e.jsx(a,{code:`
    <RedirectionGuard
      isLoading={isLoading /* Loading Indicator */}
      condition={data.length === 0 /* Any condition to validate in case redirection to different route is required */}
      route={'/onboarding' /* Onboarding Route */}
      isError={isError /* Error Indicator */}
      errorComponent={<ErrorBanner error={error} /> /* Error page to display in case API call failure */}
    >
      <BaseLayout ... >
        ...
        <Datagrid items={data} ... />
        ...
      </BaseLayout>
    </RedirectionGuard>
    `,language:"javascript"})]})}function R(o={}){const{wrapper:r}={...n(),...o.components};return r?e.jsx(r,{...o,children:e.jsx(i,{...o})}):i(o)}export{R as default};
