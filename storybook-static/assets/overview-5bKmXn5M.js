import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as t}from"./index-44VTds2h.js";import{S as s}from"./index-DeEMO5vk.js";import{M as a}from"./index-CxmMwio3.js";import"./index-Bnop-kX6.js";import"./index-PzEU9Mdi.js";import"./index-DXhrqGIV.js";import"./index-D0sJu8id.js";import"./iframe-g35VEYZr.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function r(i){const n={code:"code",h1:"h1",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...t(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(a,{title:"Core/request-tagger/Overview"}),`
`,e.jsx(n.h1,{id:"manager-request-tagger",children:"Manager Request Tagger"}),`
`,e.jsx(n.p,{children:"The Request Tagger is an essential tool for tracking and debugging API requests in the OVHcloud Manager ecosystem. It automatically adds tracing headers to each HTTP request, making it easier to track API calls across different applications."}),`
`,e.jsx(s,{label:"Overview",level:2}),`
`,e.jsx(n.p,{children:"The Request Tagger automatically adds four important HTTP headers to each request:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"X-OVH-MANAGER-NAVIGATION-ID"}),": A unique navigation identifier (common for all calls in the same session)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"X-OVH-MANAGER-REQUEST-ID"}),": A request identifier (based on date + incremented session index)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"X-OVH-MANAGER-PAGE"}),": The origin page of the request"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"X-OVH-MANAGER-VERSION"}),": The application version"]}),`
`]}),`
`,e.jsx(s,{label:"Key Features",level:2}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Automatic Tracing"}),": Automatic addition of tracing headers"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Unique Identifiers"}),": Generation of unique identifiers for each session and request"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Flexibility"}),": Ability to override headers as needed"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Easy Integration"}),": Simple to integrate into any application"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"TypeScript Support"}),": Full typing for better development experience"]}),`
`]}),`
`,e.jsx(s,{label:"Usage",level:2}),`
`,e.jsx(n.h3,{id:"installation",children:"Installation"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`yarn add @ovh-ux/request-tagger
`})}),`
`,e.jsx(n.h3,{id:"basic-setup",children:"Basic Setup"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { 
  defineApplicationVersion, 
  defineApplicationPage, 
  getHeaders 
} from '@ovh-ux/request-tagger';

// Define application version
defineApplicationVersion('v1.0.0');

// Define current page
defineApplicationPage('homepage');

// Get headers for a request
const headers = getHeaders('/engine/apiv6/me');
`})}),`
`,e.jsx(n.h3,{id:"header-overrides",children:"Header Overrides"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { 
  Header, 
  defineApplicationVersion, 
  defineApplicationPage, 
  getHeaders,
  addHeadersOverride 
} from '@ovh-ux/request-tagger';

// Define application version
defineApplicationVersion('v1.0.0');

// Add header override for specific URL pattern
addHeadersOverride('^/engine/2api/notification', {
  [Header.PAGE]: 'notification-sidebar',
});

// Define current page
defineApplicationPage('homepage');

// Headers will be automatically applied with the override
const headers = getHeaders('/engine/2api/notification');
`})}),`
`,e.jsx(s,{label:"Best Practices",level:2}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Define Application Version"}),":"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Always define the application version at startup"}),`
`,e.jsx(n.li,{children:"Use a consistent version format (e.g., 'v1.0.0')"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Page Management"}),":"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Update the current page on route changes"}),`
`,e.jsx(n.li,{children:"Use descriptive page identifiers"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Header Overrides"}),":"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Use precise URL patterns for overrides"}),`
`,e.jsx(n.li,{children:"Document custom header overrides"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Axios Integration"}),":"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import axios from 'axios';
import { getHeaders } from '@ovh-ux/request-tagger';

const api = axios.create({
  baseURL: '/engine/apiv6',
});

api.interceptors.request.use((config) => {
  const headers = getHeaders(config.url);
  return {
    ...config,
    headers: {
      ...config.headers,
      ...headers,
    },
  };
});
`})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Debugging"}),":"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Use navigation IDs to track sessions"}),`
`,e.jsx(n.li,{children:"Use request IDs to trace specific calls"}),`
`,e.jsx(n.li,{children:"Check headers in browser development tools"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Security"}),":"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Don't expose sensitive information in headers"}),`
`,e.jsx(n.li,{children:"Use non-predictable identifiers"}),`
`,e.jsx(n.li,{children:"Validate URL patterns for overrides"}),`
`]}),`
`]}),`
`]})]})}function f(i={}){const{wrapper:n}={...t(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(r,{...i})}):r(i)}export{f as default};
