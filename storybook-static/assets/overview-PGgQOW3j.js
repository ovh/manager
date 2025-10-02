import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as i}from"./index-BbLPDwHm.js";import{S as r,a}from"./index-DrkXhQka.js";import{M as o}from"./index-CKSIDW05.js";import"./index-Bnop-kX6.js";import"./index-PzEU9Mdi.js";import"./index-DXhrqGIV.js";import"./index-D0sJu8id.js";import"./iframe-DqxQzjvh.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function t(s){const n={a:"a",code:"code",h1:"h1",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...i(),...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Features/vcd-api/Overview"}),`
`,e.jsx(n.h1,{id:"manager-vcd-api",children:"Manager VCD API"}),`
`,e.jsx(r,{label:"Overview",level:2}),`
`,e.jsx(n.p,{children:"The Manager VCD API module provides a comprehensive interface for interacting with VMware Cloud Director (VCD) services in the OVHcloud ecosystem. It offers a set of React hooks, API clients, and utilities for managing VCD resources, organizations, and datacenters."}),`
`,e.jsx(r,{label:"Key Features",level:2}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Organization Management"}),":",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Create and manage VCD organizations"}),`
`,e.jsx(n.li,{children:"Update organization details"}),`
`,e.jsx(n.li,{children:"Reset organization passwords"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Datacenter Operations"}),":",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Manage virtual datacenters"}),`
`,e.jsx(n.li,{children:"Update datacenter specifications"}),`
`,e.jsx(n.li,{children:"Monitor resource usage"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Resource Management"}),":",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Compute resource management"}),`
`,e.jsx(n.li,{children:"Storage resource management"}),`
`,e.jsx(n.li,{children:"Orderable resource tracking"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Backup Integration"}),":",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Veeam backup management"}),`
`,e.jsx(n.li,{children:"Backup catalog access"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Type Safety"}),": Full TypeScript support with comprehensive type definitions"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"React Query Integration"}),": Built-in support for efficient data fetching and caching"]}),`
`]}),`
`,e.jsx(r,{label:"Usage",level:2}),`
`,e.jsx(n.h3,{id:"organization-management",children:"Organization Management"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { useUpdateVdcDetails } from '@ovh-ux/manager-module-vcd-api';

function OrganizationComponent() {
  const { updateDetails } = useUpdateVdcDetails({
    id: 'org-id',
    vdcId: 'vdc-id',
    onSuccess: () => console.log('Update successful'),
    onError: (error) => console.error('Update failed', error),
  });

  const handleUpdate = async () => {
    await updateDetails({
      details: {
        vCPUSpeed: 2.4,
        description: 'Updated VDC',
      },
    });
  };

  return <button onClick={handleUpdate}>Update VDC</button>;
}
`})}),`
`,e.jsx(n.h3,{id:"datacenter-operations",children:"Datacenter Operations"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { getVcdDatacentres, getVcdDatacentre } from '@ovh-ux/manager-module-vcd-api';

async function fetchDatacenters(organizationId: string) {
  // Get all datacenters
  const { data: datacenters } = await getVcdDatacentres(organizationId);
  
  // Get specific datacenter details
  const { data: datacenter } = await getVcdDatacentre(organizationId, 'vdc-id');
  
  return { datacenters, datacenter };
}
`})}),`
`,e.jsx(n.h3,{id:"resource-management",children:"Resource Management"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { getVdcOrderableResource } from '@ovh-ux/manager-module-vcd-api';

async function checkOrderableResources(organizationId: string, vdcId: string) {
  const { data: resources } = await getVdcOrderableResource(organizationId, vdcId);
  return resources;
}
`})}),`
`,e.jsx(r,{label:"API Reference",level:2}),`
`,e.jsx(n.h3,{id:"core-functions",children:"Core Functions"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"getVcdDatacentre"}),": Fetch specific datacenter details"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"getVcdDatacentres"}),": List all datacenters in an organization"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"updateVdcDetails"}),": Update datacenter specifications"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"getVcdOrganization"}),": Fetch organization details"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"resetOrganizationPassword"}),": Reset organization password"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"getVeeamBackupCatalog"}),": Access backup catalog"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"getVcdCatalog"}),": Get VCD service catalog"]}),`
`]}),`
`,e.jsx(n.h3,{id:"react-hooks",children:"React Hooks"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"useUpdateVdcDetails"}),": Hook for updating datacenter details"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"useVcdOrganization"}),": Hook for managing organization data"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"useVcdDatacenters"}),": Hook for managing datacenter operations"]}),`
`]}),`
`,e.jsx(r,{label:"Best Practices",level:2}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Error Handling"}),": Always implement proper error handling for API calls"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Type Safety"}),": Utilize TypeScript types for better development experience"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Query Keys"}),": Use consistent query keys for better caching"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Resource Management"}),": Monitor resource usage and implement proper cleanup"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Authentication"}),": Ensure proper authentication before making API calls"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Rate Limiting"}),": Implement rate limiting to prevent API abuse"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Testing"}),": Write comprehensive tests for API interactions"]}),`
`]}),`
`,e.jsx(r,{label:"Integration",level:2}),`
`,e.jsx(n.p,{children:"The module integrates with several OVHcloud services:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Core API"}),": Uses the core API client for HTTP requests"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"React Query"}),": Leverages React Query for data fetching and caching"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Order Module"}),": Integrates with the order module for resource provisioning"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Shell Client"}),": Uses the shell client for navigation and authentication"]}),`
`]}),`
`,e.jsx(r,{label:"Dos & Don'ts",level:2}),`
`,e.jsx(a,{dos:["Do implement proper error handling for API calls","Do validate all input parameters before making requests","Do use the provided TypeScript types for type safety","Do implement proper loading states for async operations"],donts:["Do not expose sensitive credentials in API responses","Do not make unnecessary API calls","Do not bypass authentication mechanisms","Do not ignore error responses"]}),`
`,e.jsx(r,{label:"Support",level:2}),`
`,e.jsx(n.p,{children:"For issues, feature requests, or contributions:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Create an issue in the ",e.jsx(n.a,{href:"https://github.com/ovh/manager",rel:"nofollow",children:"GitHub repository"})]}),`
`,e.jsx(n.li,{children:"Follow the contribution guidelines in the repository"}),`
`,e.jsx(n.li,{children:"Ensure all changes are properly tested"}),`
`,e.jsx(n.li,{children:"Update documentation for any new features"}),`
`]})]})}function v(s={}){const{wrapper:n}={...i(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(t,{...s})}):t(s)}export{v as default};
