import{j as n}from"./jsx-runtime-BRNY0I4F.js";import{u as r}from"./index-D_1QkM3g.js";import{S as i}from"./index-D5TyvtsN.js";import{M as a}from"./index-26vOBqU-.js";import"./index-Bnop-kX6.js";import"./index-PzEU9Mdi.js";import"./index-DXhrqGIV.js";import"./index-D0sJu8id.js";import"./iframe-BboHc1zZ.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function s(t){const e={code:"code",h1:"h1",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...r(),...t.components};return n.jsxs(n.Fragment,{children:[n.jsx(a,{title:"Core/ovh-at-internet/Overview"}),`
`,n.jsx(e.h1,{id:"ovh-at-internet",children:"OVH AT Internet"}),`
`,n.jsx(e.p,{children:"The OVH AT Internet tracking component is a TypeScript library that provides integration with AT Internet analytics for OVH applications. It handles user tracking, page views, clicks, events, and impressions across OVH services."}),`
`,n.jsx(i,{label:"Overview",level:2}),`
`,n.jsx(e.p,{children:"This component provides a unified interface for tracking user interactions with OVH services. It supports multiple tracking types including page views, clicks, events, impressions, and A/B testing. The component is designed to work with AT Internet's Tag Management System (TMS) and can be configured to work with different regions and environments."}),`
`,n.jsx(i,{label:"Key Features",level:2}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Multiple Tracking Types"}),": Supports page views, clicks, events, impressions, and A/B testing"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Region Support"}),": Configurable for different OVH regions"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Consent Management"}),": Handles user consent for tracking"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Debug Mode"}),": Includes debugging capabilities for development"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Mix Commander Integration"}),": Optional integration with Mix Commander for enhanced tracking"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Piano Analytics Support"}),": Optional integration with Piano Analytics"]}),`
`]}),`
`,n.jsx(i,{label:"Component Structure",level:2}),`
`,n.jsx(e.p,{children:"The component is organized into several key files:"}),`
`,n.jsx(e.h3,{id:"core-files",children:"Core Files"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"ovh-at-internet.ts"}),": The main class that implements the tracking functionality"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"index.ts"}),": Exports the main component and related interfaces"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"track.ts"}),": Defines tracking data interfaces and types"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"config.ts"}),": Provides configuration options for the tracking component"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"constants.ts"}),": Contains constant values used throughout the component"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"utils.ts"}),": Utility functions for the component"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"manager-tms.ts"}),": Handles integration with AT Internet's Tag Management System"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"mix-commander.ts"}),": Provides integration with Mix Commander for enhanced tracking"]}),`
`]}),`
`,n.jsx(i,{label:"Usage",level:2}),`
`,n.jsx(e.h3,{id:"basic-implementation",children:"Basic Implementation"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`import OvhAtInternet from '@ovh-ux/ovh-at-internet';

// Initialize the tracking component
const atInternet = new OvhAtInternet();

// Set default tracking data
atInternet.setDefaults({
  level2: 'Manager',
  country: 'FR',
});

// Initialize tracking with user consent
atInternet.init(true);

// Track a page view
atInternet.trackPage({
  name: 'dashboard',
  level2: 'Manager',
});

// Track a click
atInternet.trackClick({
  name: 'button',
  chapter1: 'dashboard',
  chapter2: 'actions',
});
`})}),`
`,n.jsx(e.h3,{id:"tracking-types",children:"Tracking Types"}),`
`,n.jsx(e.p,{children:"The component supports several tracking types:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Page Tracking"}),": Track page views with hierarchical navigation structure"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Click Tracking"}),": Track user clicks on elements"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Event Tracking"}),": Track custom events"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Impression Tracking"}),": Track ad impressions"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"A/B Testing"}),": Track A/B test variations"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Mix Commander S3"}),": Track specific Mix Commander S3 events"]}),`
`]}),`
`,n.jsx(e.h3,{id:"configuration-options",children:"Configuration Options"}),`
`,n.jsx(e.p,{children:"The component can be configured with various options:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Region"}),": Set the OVH region for tracking"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Enabled/Disabled"}),": Enable or disable tracking"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Default Values"}),": Set default values for all tracking calls"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Debug Mode"}),": Enable debug mode for development"]}),`
`]}),`
`,n.jsx(i,{label:"Constants",level:2}),`
`,n.jsx(e.p,{children:"The component includes several predefined constants:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"AT_INTERNET_LEVEL2"}),": Mapping of level2 values for different OVH services"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"AT_INTERNET_WEBSITE"}),": Mapping of website values for different regions"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"AT_INTERNET_CUSTOM_PROPS"}),": Custom properties for tracking"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"PCI_PROJECT_MODE_VALUES"}),": Values for PCI project modes"]}),`
`]}),`
`,n.jsx(i,{label:"Integration with AT Internet TMS",level:2}),`
`,n.jsx(e.p,{children:"The component integrates with AT Internet's Tag Management System (TMS) to provide tracking functionality. It loads the TMS script in an iframe and provides methods to interact with it."}),`
`,n.jsx(i,{label:"Debugging",level:2}),`
`,n.jsxs(e.p,{children:["Debug mode can be enabled by setting the ",n.jsx(e.code,{children:"MANAGER_TRACKING_DEBUG"})," item in localStorage. When enabled, debug messages will be logged to the console."]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-javascript",children:`// Enable debug mode
localStorage.setItem('MANAGER_TRACKING_DEBUG', 'true');
`})}),`
`,n.jsx(i,{label:"Advanced Usage",level:2}),`
`,n.jsx(i,{label:"Mix Commander Integration",level:3}),`
`,n.jsx(e.p,{children:"The component can be integrated with Mix Commander for enhanced tracking capabilities. This is enabled by setting the appropriate configuration."}),`
`,n.jsx(i,{label:"Piano Analytics Integration",level:3}),`
`,n.jsx(e.p,{children:"The component can be integrated with Piano Analytics for additional tracking capabilities. This is enabled by setting the appropriate configuration."}),`
`,n.jsx(i,{label:"Custom Tracking Data",level:3}),`
`,n.jsx(e.p,{children:"Custom tracking data can be added to any tracking call:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`atInternet.trackPage({
  name: 'dashboard',
  level2: 'Manager',
  customProperty: 'value',
});
`})}),`
`,n.jsx(i,{label:"Best Practices",level:2}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsx(e.li,{children:"Always initialize the component before using it"}),`
`,n.jsx(e.li,{children:"Set appropriate default values for your application"}),`
`,n.jsx(e.li,{children:"Use consistent naming conventions for tracking data"}),`
`,n.jsx(e.li,{children:"Enable debug mode during development"}),`
`,n.jsx(e.li,{children:"Handle user consent appropriately"}),`
`]})]})}function f(t={}){const{wrapper:e}={...r(),...t.components};return e?n.jsx(e,{...t,children:n.jsx(s,{...t})}):s(t)}export{f as default};
