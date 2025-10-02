import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as l}from"./index-BbLPDwHm.js";import{S as s}from"./index-DrkXhQka.js";import{M as t}from"./index-CKSIDW05.js";import"./index-Bnop-kX6.js";import"./index-PzEU9Mdi.js";import"./index-DXhrqGIV.js";import"./index-D0sJu8id.js";import"./iframe-DqxQzjvh.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function r(i){const n={code:"code",h1:"h1",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...l(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(t,{title:"Core/sso/Overview"}),`
`,e.jsx(n.h1,{id:"manager-sso",children:"Manager SSO"}),`
`,e.jsx(n.p,{children:"The Manager SSO (Single Sign-On) module provides authentication functionality for the OVHcloud Manager ecosystem. It handles user authentication flows, including login and logout processes, with support for different regions and environments."}),`
`,e.jsx(s,{label:"Overview",level:2}),`
`,e.jsx(n.p,{children:"The SSO module provides a standardized way to handle authentication in the OVHcloud Manager:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Authentication URLs"}),": Pre-configured URLs for login and logout processes"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Region Support"}),": Automatic handling of different regions (EU, Telecom)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Redirect Management"}),": Smart handling of success URLs and referrers"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"URL Building"}),": Utility functions for building authentication URLs with parameters"]}),`
`]}),`
`,e.jsx(s,{label:"Key Features",level:2}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Login Management"}),": Handle user login flows"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Logout Management"}),": Handle user logout processes"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Region Detection"}),": Automatic detection of OVH Telecom region"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"URL Parameter Handling"}),": Smart handling of URL parameters"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"TypeScript Support"}),": Full typing for better development experience"]}),`
`]}),`
`,e.jsx(s,{label:"Usage",level:2}),`
`,e.jsx(n.h3,{id:"installation",children:"Installation"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`yarn add @ovh-ux/manager-core-sso
`})}),`
`,e.jsx(n.h3,{id:"basic-setup",children:"Basic Setup"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { 
  redirectToLoginPage,
  redirectToLogoutPage 
} from '@ovh-ux/manager-core-sso';

// Redirect to login page
redirectToLoginPage('https://your-success-url.com');

// Redirect to logout page
redirectToLogoutPage('https://your-success-url.com');
`})}),`
`,e.jsx(n.h3,{id:"default-configuration",children:"Default Configuration"}),`
`,e.jsx(n.p,{children:"The module comes with default authentication URLs:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`const DEFAULT_SSO_AUTH_URL = {
  loginUrl: '/auth/',
  logoutUrl: '/auth/?action=disconnect',
  euLoginUrl: 'https://www.ovh.com/auth/',
  euLogoutUrl: 'https://www.ovh.com/auth/?action=disconnect',
};
`})}),`
`,e.jsx(s,{label:"Best Practices",level:2}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Success URL Handling"}),":"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Always provide a success URL for better user experience"}),`
`,e.jsx(n.li,{children:"Use the current page URL as fallback"}),`
`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`redirectToLoginPage(window.location.href);
`})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Region Detection"}),":"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"The module automatically detects OVH Telecom region"}),`
`,e.jsx(n.li,{children:"No additional configuration needed for region-specific URLs"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"URL Parameters"}),":"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Success URLs are automatically encoded"}),`
`,e.jsx(n.li,{children:"Referrer information is included when available"}),`
`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`// The module automatically handles:
// - onsuccess parameter
// - from parameter (when document.referrer is available)
redirectToLogoutPage();
`})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Error Handling"}),":"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Ensure proper error handling for authentication failures"}),`
`,e.jsx(n.li,{children:"Implement fallback mechanisms for failed redirects"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Security Considerations"}),":"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Always use HTTPS for authentication URLs"}),`
`,e.jsx(n.li,{children:"Validate success URLs to prevent open redirect vulnerabilities"}),`
`,e.jsx(n.li,{children:"Handle authentication state properly"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Integration with Other Modules"}),":"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Works seamlessly with the Request Tagger"}),`
`,e.jsx(n.li,{children:"Compatible with the Core API module"}),`
`,e.jsx(n.li,{children:"Can be integrated with custom authentication flows"}),`
`]}),`
`]}),`
`]})]})}function f(i={}){const{wrapper:n}={...l(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(r,{...i})}):r(i)}export{f as default};
