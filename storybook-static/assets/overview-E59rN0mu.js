import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as l}from"./index-DdETsLzO.js";import{S as r}from"./index-DBID-FYl.js";import{M as i}from"./index-BiZMyzLv.js";import"./index-Bnop-kX6.js";import"./index-PzEU9Mdi.js";import"./index-DXhrqGIV.js";import"./index-D0sJu8id.js";import"./iframe-Cw17PQb7.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function s(t){const n={code:"code",h1:"h1",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...l(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(i,{title:"Core/utils/Overview"}),`
`,e.jsx(n.h1,{id:"manager-core-utils",children:"Manager Core Utils"}),`
`,e.jsx(n.p,{children:"The Manager Core Utils module provides a collection of utility functions and helpers commonly used across OVHcloud Manager applications. It includes tools for date formatting, React component formatting, and other shared functionality."}),`
`,e.jsx(r,{label:"Overview",level:2}),`
`,e.jsx(n.p,{children:"The Core Utils module provides essential utilities for OVHcloud applications:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Date Formatting"}),": Utilities for handling date-fns locale conversions"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"React Formatting"}),": Helper for rendering React components in table cells"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"TypeScript Support"}),": Full TypeScript support with type definitions"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"React Integration"}),": Seamless integration with React applications"]}),`
`]}),`
`,e.jsx(r,{label:"Key Features",level:2}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Date-fns Locale Conversion"}),": Convert OVH locales to date-fns format"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"React Table Formatter"}),": Custom formatter for React components in tables"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Type Safety"}),": Full TypeScript support"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"React 18 Support"}),": Compatible with React 18 and React Router 6"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Modular Design"}),": Easy to import and use individual utilities"]}),`
`]}),`
`,e.jsx(r,{label:"Usage",level:2}),`
`,e.jsx(n.h3,{id:"installation",children:"Installation"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`yarn add @ovh-ux/manager-core-utils
`})}),`
`,e.jsx(n.h3,{id:"date-fns-locale-conversion",children:"Date-fns Locale Conversion"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';

// Convert OVH locale to date-fns locale
const dateFnsLocale = getDateFnsLocale('fr_FR'); // Returns 'fr'
const dateFnsLocaleGB = getDateFnsLocale('en_GB'); // Returns 'enGB'
const dateFnsLocaleCA = getDateFnsLocale('fr_CA'); // Returns 'frCA'
`})}),`
`,e.jsx(n.h3,{id:"react-table-formatter",children:"React Table Formatter"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { ReactFormatter } from '@ovh-ux/manager-core-utils';
import React from 'react';

// Create a custom formatter for a table cell
const CustomCell = ({ cellData, rowData }) => (
  <div>
    <span>{cellData}</span>
    <button onClick={() => handleClick(rowData)}>Action</button>
  </div>
);

// Use the formatter in your table configuration
const columns = [
  {
    title: 'Custom Column',
    field: 'data',
    formatter: ReactFormatter(<CustomCell />),
  },
];
`})}),`
`,e.jsx(r,{label:"Best Practices",level:2}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Date-fns Locale Usage"}),":"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Always use the locale converter for date formatting"}),`
`,e.jsx(n.li,{children:"Handle fallback cases appropriately"}),`
`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`const locale = getDateFnsLocale(userLocale) || 'enGB';
`})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"React Formatter Implementation"}),":"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Keep formatter components simple and focused"}),`
`,e.jsx(n.li,{children:"Handle cell updates properly"}),`
`,e.jsx(n.li,{children:"Use TypeScript for better type safety"}),`
`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`interface CellProps {
  cellData: any;
  rowData: any;
}

const CustomCell: React.FC<CellProps> = ({ cellData, rowData }) => {
  // Component implementation
};
`})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Performance Considerations"}),":"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Memoize formatter components when possible"}),`
`,e.jsx(n.li,{children:"Avoid unnecessary re-renders"}),`
`,e.jsx(n.li,{children:"Use proper cleanup in formatters"}),`
`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`const MemoizedCell = React.memo(CustomCell);
const formatter = ReactFormatter(<MemoizedCell />);
`})}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"TypeScript Usage"}),":"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Use proper type definitions"}),`
`,e.jsx(n.li,{children:"Leverage TypeScript features for better development experience"}),`
`,e.jsx(n.li,{children:"Export types when creating custom formatters"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Error Handling"}),":"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Implement proper error boundaries"}),`
`,e.jsx(n.li,{children:"Handle edge cases in locale conversion"}),`
`,e.jsx(n.li,{children:"Provide fallback values when needed"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Testing"}),":"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Write unit tests for utility functions"}),`
`,e.jsx(n.li,{children:"Test formatter components in isolation"}),`
`,e.jsx(n.li,{children:"Mock React DOM rendering in tests"}),`
`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`describe('getDateFnsLocale', () => {
  it('should convert fr_FR to fr', () => {
    expect(getDateFnsLocale('fr_FR')).toBe('fr');
  });
});
`})}),`
`]}),`
`]})]})}function f(t={}){const{wrapper:n}={...l(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(s,{...t})}):s(t)}export{f as default};
