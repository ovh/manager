import{j as n}from"./jsx-runtime-BRNY0I4F.js";import{u as r}from"./index-BbbfVuzK.js";import{S as s,a as t}from"./index-ChS17p17.js";import{M as l}from"./index-B3OJxjuP.js";import"./index-Bnop-kX6.js";import"./index-PzEU9Mdi.js";import"./index-oX_7i0mk.js";import"./index-D0sJu8id.js";import"./iframe-C_3YMFde.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function o(i){const e={code:"code",h1:"h1",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...r(),...i.components};return n.jsxs(n.Fragment,{children:[n.jsx(l,{title:"Features/pci-common/Overview"}),`
`,n.jsx(e.h1,{id:"manager-pci-common-module",children:"Manager PCI Common Module"}),`
`,n.jsx(e.p,{children:"The Manager PCI Common module is a collection of reusable components, hooks, and utilities for OVH Public Cloud Infrastructure (PCI) applications. It provides a standardized set of UI components, data handling utilities, and common functionality that can be shared across different PCI applications."}),`
`,n.jsx(s,{label:"Overview",level:2}),`
`,n.jsx(e.p,{children:"This module serves as a foundation for building consistent and maintainable PCI applications within the OVH ecosystem. It encapsulates common patterns, UI components, and data handling logic to ensure a cohesive user experience across different PCI services."}),`
`,n.jsx(s,{label:"Key Features",level:2}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Reusable UI Components"}),": A collection of standardized UI components for PCI applications"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Data Handling Hooks"}),": Custom React hooks for common data operations"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"API Integration"}),": Utilities for interacting with PCI APIs"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Constants and Configuration"}),": Shared constants and configuration values"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Testing Utilities"}),": Tools for testing PCI applications"]}),`
`]}),`
`,n.jsx(s,{label:"Module Structure",level:2}),`
`,n.jsx(e.p,{children:"The module is organized into several key directories:"}),`
`,n.jsx(e.h3,{id:"components",children:"Components"}),`
`,n.jsx(e.p,{children:"The module includes a variety of UI components:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Accordion"}),": Collapsible content sections"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Banner"}),": Notification banners"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Region Selector"}),": Component for selecting cloud regions"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Logs"}),": Components for displaying logs"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Modal"}),": Dialog boxes and popups"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Flavor Selector"}),": Component for selecting instance flavors"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Tabs Panel"}),": Tabbed interface components"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Quantity Selector"}),": Component for selecting quantities"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Pricing"}),": Components for displaying pricing information"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Rclone Download"}),": Components for Rclone downloads"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Shape Input"}),": Components for inputting shape configurations"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Tiles Input Choice"}),": Tile-based selection components"]}),`
`]}),`
`,n.jsx(e.h3,{id:"hooks",children:"Hooks"}),`
`,n.jsx(e.p,{children:"The module provides several custom React hooks:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"useBytes"}),": Hook for handling byte conversions"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"usePciUrl"}),": Hook for generating PCI URLs"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"usePricing"}),": Hook for handling pricing calculations"]}),`
`]}),`
`,n.jsx(e.h3,{id:"api",children:"API"}),`
`,n.jsx(e.p,{children:"The module includes utilities for interacting with PCI APIs:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"API Schema"}),": Type definitions for API responses"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Availability"}),": Utilities for checking service availability"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Catalog"}),": Utilities for accessing service catalogs"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Dbaas Logs"}),": Utilities for database-as-a-service logs"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Flavors"}),": Utilities for instance flavors"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Instance"}),": Utilities for managing instances"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Operation"}),": Utilities for tracking operations"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Project"}),": Utilities for managing projects"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Regions"}),": Utilities for working with regions"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Image"}),": Utilities for managing images"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Volume"}),": Utilities for managing volumes"]}),`
`]}),`
`,n.jsx(e.h3,{id:"constants",children:"Constants"}),`
`,n.jsx(e.p,{children:"The module includes various constants:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"URLs"}),": Predefined URLs for different regions and services"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Styles"}),": Common style constants"]}),`
`]}),`
`,n.jsx(s,{label:"Usage",level:2}),`
`,n.jsx(e.h3,{id:"basic-component-usage",children:"Basic Component Usage"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { Accordion } from '@ovh-ux/manager-pci-common';

function MyComponent() {
  return (
    <Accordion>
      <Accordion.Item title="Section 1">
        <p>Content for section 1</p>
      </Accordion.Item>
      <Accordion.Item title="Section 2">
        <p>Content for section 2</p>
      </Accordion.Item>
    </Accordion>
  );
}
`})}),`
`,n.jsx(e.h3,{id:"using-hooks",children:"Using Hooks"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { usePricing, useBytes } from '@ovh-ux/manager-pci-common';

function PricingComponent() {
  const { pricing } = usePricing({
    serviceName: 'compute',
    region: 'GRA7',
    instanceName: 's1-2',
    quantity: 1,
  });

  const formattedBytes = useBytes(1024 * 1024); // 1MB

  return (
    <div>
      <p>Price: {pricing.price.text}</p>
      <p>Size: {formattedBytes.text}</p>
    </div>
  );
}
`})}),`
`,n.jsx(e.h3,{id:"api-integration",children:"API Integration"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { useQuery } from '@tanstack/react-query';
import { getRegions } from '@ovh-ux/manager-pci-common';

function RegionsComponent() {
  const { data: regions, isLoading } = useQuery({
    queryKey: ['regions'],
    queryFn: () => getRegions(),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {regions.map((region) => (
        <li key={region.name}>{region.name}</li>
      ))}
    </ul>
  );
}
`})}),`
`,n.jsx(s,{label:"Best Practices",level:2}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Use the Provided Components"}),": Leverage the standardized components for consistent UI"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Utilize Custom Hooks"}),": Use the provided hooks for common data operations"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Follow API Patterns"}),": Adhere to the established patterns for API interactions"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Maintain Consistency"}),": Ensure your application follows the same patterns as other PCI applications"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Write Tests"}),": Use the provided testing utilities to ensure your components work correctly"]}),`
`]}),`
`,n.jsx(s,{label:"Integration with OVH Shell",level:2}),`
`,n.jsx(e.p,{children:"The module integrates with the OVH Shell for navigation, authentication, and other shell services:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { useShell } from '@ovh-ux/manager-react-shell-client';
import { usePciUrl } from '@ovh-ux/manager-pci-common';

function NavigationComponent() {
  const shell = useShell();
  const { getProjectUrl } = usePciUrl();

  const handleNavigate = () => {
    const url = getProjectUrl('my-project-id');
    shell.navigation.navigateTo(url);
  };

  return <button onClick={handleNavigate}>Go to Project</button>;
}
`})}),`
`,n.jsx(s,{label:"Dos & Don'ts",level:2}),`
`,n.jsx(t,{dos:["Do implement proper error handling for API calls","Do provide clear documentation for API endpoints","Do implement rate limiting to prevent abuse","Do validate all input parameters"],donts:["Do not expose sensitive credentials in API responses","Do not bypass authentication mechanisms","Do not make unnecessary API calls"]}),`
`,n.jsx(s,{label:"Behavior",level:2}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"States"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Default"}),":",`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Provides access to VCD API endpoints"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Authentication"}),":",`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Handles API authentication and authorization"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Resource Management"}),":",`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Manages VCD resource operations"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Error Handling"}),":",`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Provides appropriate error responses"}),`
`]}),`
`]}),`
`]})]})}function v(i={}){const{wrapper:e}={...r(),...i.components};return e?n.jsx(e,{...i,children:n.jsx(o,{...i})}):o(i)}export{v as default};
