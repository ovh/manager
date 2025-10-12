import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as t}from"./index-BenGHN5L.js";import"./index-C29aiW5g.js";import{M as l}from"./index-EQhVOb-2.js";import"./index-Bnop-kX6.js";import"./index-PzEU9Mdi.js";import"./index-DXhrqGIV.js";import"./index-D0sJu8id.js";import"./iframe-BHu8F3gw.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function s(i){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...t(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"Core/shell/Overview"}),`
`,e.jsx(n.h1,{id:"ovh-shell-component",children:"OVH Shell Component"}),`
`,e.jsx(n.p,{children:"The OVH Shell component is a TypeScript library that facilitates communication and interaction between applications in the OVH ecosystem. It provides a robust messaging system, plugin architecture, and client-server communication framework for building modular, interconnected applications."}),`
`,e.jsx(n.h2,{id:"overview",children:"Overview"}),`
`,e.jsx(n.p,{children:"OVH Shell serves as the backbone for OVH's micro-frontend architecture, enabling different applications to communicate with each other seamlessly. It provides a standardized way for applications to share functionality, exchange data, and coordinate user experiences across the OVH platform."}),`
`,e.jsx(n.h2,{id:"key-features",children:"Key Features"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Message Bus System"}),": Facilitates communication between different parts of the application"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Plugin Architecture"}),": Extensible system for adding functionality to the shell"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Client-Server Communication"}),": Enables iframe-based applications to communicate with the shell"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Environment Management"}),": Handles application environment configuration"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Authentication Integration"}),": Provides authentication services to applications"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Navigation Control"}),": Manages application navigation and routing"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Internationalization (i18n)"}),": Supports multiple languages"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"User Experience Components"}),": Includes UI components like modals"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Tracking Integration"}),": Integrates with OVH AT Internet for analytics"]}),`
`]}),`
`,e.jsx(n.h2,{id:"component-structure",children:"Component Structure"}),`
`,e.jsx(n.p,{children:"The OVH Shell component is organized into several key modules:"}),`
`,e.jsx(n.h3,{id:"core-modules",children:"Core Modules"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Shell"}),": The main class that manages plugins and message handling"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Client"}),": Provides APIs for applications to interact with the shell"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Message Bus"}),": Handles communication between different parts of the application"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Plugin System"}),": Extensible architecture for adding functionality"]}),`
`]}),`
`,e.jsx(n.h3,{id:"plugins",children:"Plugins"}),`
`,e.jsx(n.p,{children:"The shell includes several built-in plugins:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Auth"}),": Handles authentication and user management"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Environment"}),": Manages application environment configuration"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"i18n"}),": Provides internationalization support"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Navigation"}),": Controls application navigation"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Routing"}),": Manages application routing"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Tracking"}),": Integrates with OVH AT Internet for analytics"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"UX"}),": Provides user experience components like modals"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Logger"}),": Handles logging functionality"]}),`
`]}),`
`,e.jsx(n.h2,{id:"usage",children:"Usage"}),`
`,e.jsx(n.h3,{id:"basic-implementation",children:"Basic Implementation"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { initShellClient, ShellClientApi } from '@ovh-ux/shell';

// Initialize the shell client
const shellClient = initShellClient();

// Use the shell client API
shellClient.environment.getEnvironment().then((environment) => {
  console.log('Current environment:', environment);
});

// Navigate to a different application
shellClient.navigation.navigateTo('public-cloud', 'pci/projects/new');
`})}),`
`,e.jsx(n.h3,{id:"plugin-usage",children:"Plugin Usage"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { plugin } from '@ovh-ux/shell';

// Register a custom plugin
plugin.register('my-plugin', {
  myMethod: (arg1, arg2) => {
    // Plugin implementation
    return Promise.resolve({ result: arg1 + arg2 });
  },
});

// Use the plugin from another application
shellClient.invokePluginMethod({
  plugin: 'my-plugin',
  method: 'myMethod',
  args: [1, 2],
}).then((result) => {
  console.log('Plugin result:', result);
});
`})}),`
`,e.jsx(n.h3,{id:"message-bus",children:"Message Bus"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { DirectClientMessageBus, IFrameMessageBus } from '@ovh-ux/shell';

// Create a direct client message bus
const messageBus = new DirectClientMessageBus();

// Send a message
messageBus.send({
  type: 'event',
  message: {
    eventId: 'my-event',
    data: { foo: 'bar' },
  },
});

// Receive messages
messageBus.onReceive((message) => {
  console.log('Received message:', message);
});
`})}),`
`,e.jsx(n.h2,{id:"architecture",children:"Architecture"}),`
`,e.jsx(n.p,{children:"The OVH Shell follows a client-server architecture:"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Shell"}),": The central component that manages plugins and handles messages"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Client"}),": Applications that communicate with the shell"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Message Bus"}),": The communication channel between the shell and clients"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Plugins"}),": Extensions that provide functionality to the shell"]}),`
`]}),`
`,e.jsx(n.h3,{id:"communication-flow",children:"Communication Flow"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsx(n.li,{children:"A client sends a message to the shell via the message bus"}),`
`,e.jsx(n.li,{children:"The shell receives the message and routes it to the appropriate plugin"}),`
`,e.jsx(n.li,{children:"The plugin processes the message and returns a result"}),`
`,e.jsx(n.li,{children:"The shell sends the result back to the client via the message bus"}),`
`]}),`
`,e.jsx(n.h2,{id:"integration-with-ovh-at-internet",children:"Integration with OVH AT Internet"}),`
`,e.jsx(n.p,{children:"The OVH Shell integrates with OVH AT Internet for analytics tracking. It provides a standardized way for applications to track user interactions, page views, and events."}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`// Track a page view
shellClient.tracking.trackPage({
  name: 'dashboard',
  level2: 'Manager',
});

// Track a click
shellClient.tracking.trackClick({
  name: 'button',
  chapter1: 'dashboard',
  chapter2: 'actions',
});
`})}),`
`,e.jsx(n.h2,{id:"best-practices",children:"Best Practices"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Use the Plugin System"}),": Extend functionality through plugins rather than modifying the core"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Handle Errors Gracefully"}),": Always handle errors in plugin methods and client calls"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Use TypeScript"}),": Leverage TypeScript for type safety and better developer experience"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Follow the Message Protocol"}),": Adhere to the defined message protocol for communication"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Keep Plugins Focused"}),": Each plugin should have a single responsibility"]}),`
`]}),`
`,e.jsx(n.h2,{id:"dependencies",children:"Dependencies"}),`
`,e.jsx(n.p,{children:"The OVH Shell component has the following key dependencies:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"@ovh-ux/manager-config"}),": Configuration management"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"@ovh-ux/ovh-at-internet"}),": Analytics tracking"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"@ovh-ux/ovh-reket"}),": HTTP client"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"@ovh-ux/request-tagger"}),": Request tagging"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"@ovh-ux/url-builder"}),": URL building"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"dompurify"}),": DOM sanitization"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"nanoid"}),": ID generation"]}),`
`]})]})}function j(i={}){const{wrapper:n}={...t(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(s,{...i})}):s(i)}export{j as default};
