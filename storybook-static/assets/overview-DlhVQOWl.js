import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as l}from"./index-BenGHN5L.js";import{S as s}from"./index-C29aiW5g.js";import{M as t}from"./index-EQhVOb-2.js";import"./index-Bnop-kX6.js";import"./index-PzEU9Mdi.js";import"./index-DXhrqGIV.js";import"./index-D0sJu8id.js";import"./iframe-BHu8F3gw.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function r(i){const n={a:"a",code:"code",h1:"h1",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...l(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(t,{title:"Core/common-api/Overview"}),`
`,e.jsx(n.h1,{id:"common-api",children:"Common API"}),`
`,e.jsx(s,{label:"Overview",level:2}),`
`,e.jsx(n.p,{children:"The Common API module provides a standardized way to interact with OVHcloud's API services. It offers a set of React hooks and utilities for managing API requests, handling responses, and managing service-related operations across OVHcloud Manager applications."}),`
`,e.jsx(s,{label:"Key Features",level:2}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Service Management"}),": Comprehensive service operations including:",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Service details retrieval"}),`
`,e.jsx(n.li,{children:"Service name updates"}),`
`,e.jsx(n.li,{children:"Service termination"}),`
`,e.jsx(n.li,{children:"Resource service ID management"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Task Management"}),": Built-in support for handling asynchronous tasks with:",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Task status tracking"}),`
`,e.jsx(n.li,{children:"Progress monitoring"}),`
`,e.jsx(n.li,{children:"Error handling"}),`
`,e.jsx(n.li,{children:"Success/failure callbacks"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Feature Availability"}),": Tools to check feature availability across different regions and services"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"React Query Integration"}),": Built on top of TanStack Query for efficient data fetching and caching"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"TypeScript Support"}),": Full type definitions for all API operations and responses"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Error Handling"}),": Comprehensive error handling and type-safe error responses"]}),`
`]}),`
`,e.jsx(s,{label:"Usage",level:2}),`
`,e.jsx(n.h3,{id:"service-operations",children:"Service Operations"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { useServiceDetails, useDeleteService } from '@ovh-ux/manager-module-common-api';

function MyComponent() {
  // Get service details
  const { data: serviceDetails } = useServiceDetails({
    resourceName: 'my-service'
  });

  // Delete service
  const { terminateService } = useDeleteService();
  
  const handleDelete = () => {
    terminateService({ resourceName: 'my-service' });
  };

  return (
    <div>
      <h1>{serviceDetails?.displayName}</h1>
      <button onClick={handleDelete}>Delete Service</button>
    </div>
  );
}
`})}),`
`,e.jsx(n.h3,{id:"task-management",children:"Task Management"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { useTask } from '@ovh-ux/manager-module-common-api';

function TaskComponent() {
  const { isPending, isSuccess, isError } = useTask({
    resourceUrl: '/my-resource',
    taskId: '123',
    onSuccess: () => console.log('Task completed'),
    onError: () => console.log('Task failed'),
    onFinish: () => console.log('Task finished')
  });

  return (
    <div>
      {isPending && <p>Task in progress...</p>}
      {isSuccess && <p>Task completed successfully!</p>}
      {isError && <p>Task failed!</p>}
    </div>
  );
}
`})}),`
`,e.jsx(n.h3,{id:"feature-availability",children:"Feature Availability"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';

function FeatureComponent() {
  const { data: features } = useFeatureAvailability(['feature1', 'feature2']);

  return (
    <div>
      {features?.feature1 && <p>Feature 1 is available</p>}
      {features?.feature2 && <p>Feature 2 is available</p>}
    </div>
  );
}
`})}),`
`,e.jsx(s,{label:"API Reference",level:2}),`
`,e.jsx(n.h3,{id:"hooks",children:"Hooks"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"useServiceDetails"}),": Fetch and manage service details"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"useDeleteService"}),": Handle service termination"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"useTask"}),": Manage asynchronous tasks"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"useFeatureAvailability"}),": Check feature availability"]}),`
`]}),`
`,e.jsx(n.h3,{id:"types",children:"Types"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"ServiceDetails"}),": Service information structure"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"ApiError"}),": Standardized error response"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"ApiResponse"}),": Generic API response wrapper"]}),`
`]}),`
`,e.jsx(s,{label:"Best Practices",level:2}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Error Handling"}),": Always implement proper error handling using the provided error types"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Type Safety"}),": Utilize TypeScript types for better development experience"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Query Keys"}),": Use consistent query keys for better caching"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Loading States"}),": Implement proper loading states using the provided status flags"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Task Management"}),": Use the task management system for long-running operations"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Feature Checks"}),": Always check feature availability before using new features"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Service Operations"}),": Follow the service lifecycle management patterns"]}),`
`]}),`
`,e.jsx(s,{label:"Testing",level:2}),`
`,e.jsx(n.p,{children:"The module includes built-in testing utilities:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { getServicesMocks } from '@ovh-ux/manager-module-common-api';

// Setup test mocks
const mocks = getServicesMocks({
  getServicesKo: false,
  getDetailsServicesKo: false,
  serviceResponse: {
    // Your mock service response
  }
});
`})}),`
`,e.jsx(s,{label:"Support",level:2}),`
`,e.jsx(n.p,{children:"For issues, feature requests, or contributions:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Create an issue in the ",e.jsx(n.a,{href:"https://github.com/ovh/manager",rel:"nofollow",children:"GitHub repository"})]}),`
`,e.jsx(n.li,{children:"Follow the contribution guidelines in the repository"}),`
`,e.jsx(n.li,{children:"Ensure all changes are properly tested"}),`
`,e.jsx(n.li,{children:"Update documentation for any new features"}),`
`]})]})}function v(i={}){const{wrapper:n}={...l(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(r,{...i})}):r(i)}export{v as default};
