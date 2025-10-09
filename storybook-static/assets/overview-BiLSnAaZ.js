import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as t}from"./index-DtBi2NJp.js";import{S as r}from"./index-OMuCphBM.js";import{M as a}from"./index-0Pa5_OBP.js";import"./index-Bnop-kX6.js";import"./index-PzEU9Mdi.js";import"./index-DXhrqGIV.js";import"./index-D0sJu8id.js";import"./iframe-CsxCAwZL.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function s(i){const n={code:"code",h1:"h1",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...t(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(a,{title:"Core/api/Overview"}),`
`,e.jsx(n.h1,{id:"manager-core-api",children:"Manager Core Api"}),`
`,e.jsx(n.p,{children:"The Manager Core API is a powerful client library that provides a unified interface for interacting with OVHcloud's various API endpoints. It offers a standardized way to make HTTP requests to different API versions (v2, v6, aapi, and ws) while handling common concerns like request tagging and error handling."}),`
`,e.jsx(r,{label:"Overview",level:2}),`
`,e.jsx(n.p,{children:"The Core API provides a centralized way to interact with OVHcloud's APIs through pre-configured Axios instances. It supports multiple API versions:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"v6"}),": Base URL ",e.jsx(n.code,{children:"/engine/apiv6"})]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"aapi"}),": Base URL ",e.jsx(n.code,{children:"/engine/2api"})]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"ws"}),": Base URL ",e.jsx(n.code,{children:"/engine/ws"})]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"v2"}),": Base URL ",e.jsx(n.code,{children:"/engine/api/v2"})]}),`
`]}),`
`,e.jsx(r,{label:"Key Features",level:2}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Multiple API Version Support"}),": Unified interface for v2, v6, aapi, and ws endpoints"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Request Tagging"}),": Automatic request tagging with navigation and request IDs"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Error Handling"}),": Built-in error handling and response type definitions"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"TypeScript Support"}),": Full TypeScript support with type definitions"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Iceberg Pagination"}),": Support for both v6 and v2 Iceberg pagination"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Request Interceptors"}),": Built-in request interceptors for common operations"]}),`
`]}),`
`,e.jsx(r,{label:"Usage",level:2}),`
`,e.jsx(n.h3,{id:"basic-setup",children:"Basic Setup"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import apiClient from '@ovh-ux/manager-core-api';

// Make a GET request to v6 API
const response = await apiClient.v6.get('/me');

// Make a POST request to v2 API
const result = await apiClient.v2.post('/some/endpoint', {
  data: { /* your data */ }
});
`})}),`
`,e.jsx(n.h3,{id:"using-request-tagging",children:"Using Request Tagging"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { defineApplicationVersion, defineApplicationPage } from '@ovh-ux/request-tagger';

// Define application version and page
defineApplicationVersion('v1.0.0');
defineApplicationPage('homepage');

// Headers will be automatically added to requests
const response = await apiClient.v6.get('/me');
`})}),`
`,e.jsx(n.h3,{id:"working-with-iceberg-pagination",children:"Working with Iceberg Pagination"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { fetchIcebergV6, fetchIcebergV2 } from '@ovh-ux/manager-core-api';

// V6 Iceberg pagination
const { data, status, totalCount } = await fetchIcebergV6({
  route: '/your/endpoint',
  pageSize: 10,
  page: 1
});

// V2 Iceberg pagination
const { data, status, totalCount } = await fetchIcebergV2({
  route: '/your/endpoint',
  pageSize: 10,
  page: 1
});
`})}),`
`,e.jsx(r,{label:"Best Practices",level:2}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Always use the appropriate API version"})," for your use case:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Use v6 for most standard operations"}),`
`,e.jsx(n.li,{children:"Use v2 for newer features and endpoints"}),`
`,e.jsx(n.li,{children:"Use aapi for application-specific endpoints on 2API and BFF"}),`
`,e.jsx(n.li,{children:"Use ws for WebSocket connections"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Handle errors appropriately"}),":"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`try {
  const response = await apiClient.v6.get('/endpoint');
} catch (error) {
  // Handle error appropriately
}
`})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Use TypeScript types"})," for better type safety:"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { ApiResponse } from '@ovh-ux/manager-core-api';

interface YourDataType {
  // Your type definition
}

const response: ApiResponse<YourDataType> = await apiClient.v6.get('/endpoint');
`})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Implement proper error handling"})," for failed requests:"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`const response = await apiClient.v6.get('/endpoint');
if (response.status > 400) {
  throw new Error('Request failed');
}
`})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Use request tagging"})," for better request tracking and debugging:"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`defineApplicationVersion('v1.0.0');
defineApplicationPage('your-page');
`})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Consider pagination"})," for large data sets:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Use Iceberg pagination for v6 and v2 endpoints"}),`
`,e.jsx(n.li,{children:"Implement proper page size and navigation controls"}),`
`,e.jsx(n.li,{children:"Handle total count for UI feedback"}),`
`]}),`
`]}),`
`]})]})}function m(i={}){const{wrapper:n}={...t(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(s,{...i})}):s(i)}export{m as default};
