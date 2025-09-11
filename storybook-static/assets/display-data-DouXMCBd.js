import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as a}from"./index-B3brjphm.js";import{M as o}from"./index-y5n-9ldd.js";import"./index-Bnop-kX6.js";import"./iframe-8U4jGQrW.js";import"./index-D0sJu8id.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function i(t){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",ul:"ul",...a(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Guidelines/Data displaying"}),`
`,e.jsx(n.h1,{id:"displaying-data-in-react-apps",children:"Displaying data in React apps"}),`
`,e.jsx(n.p,{children:"This guide provides best practices for displaying different types of data in React applications, ensuring consistency and proper formatting across the platform."}),`
`,e.jsx(n.h2,{id:"how-to-display-price",children:"How to display price"}),`
`,e.jsx(n.h3,{id:"price-component",children:"Price Component"}),`
`,e.jsxs(n.p,{children:["Use the ",e.jsx(n.code,{children:"Price"})," component from ",e.jsx(n.code,{children:"@ovh-ux/manager-react-components"})," for displaying prices, ",e.jsx(n.a,{href:"?path=/docs/manager-react-components-components-price--technical-information",children:"here"})," the documentation."]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { Price, OvhSubsidiary, IntervalUnitType } from '@ovh-ux/manager-react-components';

// Basic usage
<Price 
  value={3948000000} 
  ovhSubsidiary={OvhSubsidiary.FR} 
  locale="fr-FR" 
/>

// With tax information
<Price 
  value={3948000000} 
  tax={789600000}
  ovhSubsidiary={OvhSubsidiary.FR} 
  locale="fr-FR" 
/>

// With interval unit
<Price 
  value={3948000000} 
  intervalUnit={IntervalUnitType.month}
  ovhSubsidiary={OvhSubsidiary.FR} 
  locale="fr-FR" 
/>

// Complete example with all props
<Price 
  value={3948000000} 
  tax={789600000}
  intervalUnit={IntervalUnitType.month}
  isConvertIntervalUnit={true}
  ovhSubsidiary={OvhSubsidiary.FR} 
  locale="fr-FR" 
/>
`})}),`
`,e.jsx(n.h2,{id:"how-to-display-date",children:"How to display date"}),`
`,e.jsx(n.h3,{id:"date-formatting-hook",children:"Date Formatting Hook"}),`
`,e.jsxs(n.p,{children:["Use the ",e.jsx(n.code,{children:"useFormatDate"})," hook from ",e.jsx(n.code,{children:"@ovh-ux/manager-react-components"}),` for displaying dates.
The hook leverages date-fns for formatting dates in a localized and customizable way,  `,e.jsx(n.a,{href:"?path=/docs/manager-react-components-hooks-useformatdate-documentation--technical-information",children:"here"})," the documentation."]}),`
`,e.jsx(n.p,{children:"Here some examples :"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { useFormatDate } from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';

// Basic usage with default format (PP)
const formatDate = useFormatDate({ date: '2024-09-14T09:21:21.943Z' });
<OdsText>{formatDate}</OdsText> // Displays "14 Sep 2024"

// With invalid date handling
const formatDate = useFormatDate({ 
  date: 'invalid-date',
  invalidDateDisplayLabel: 'Date inconnue' 
});
<OdsText>{formatDate}</OdsText> // Displays "Date inconnue"

// Example with a component
const DateDisplay = ({ date, format = 'PP' }) => {
  const formattedDate = useFormatDate({ date, format });
  return <OdsText>{formattedDate}</OdsText>;
};

// Usage
<DateDisplay date="2024-09-14T09:21:21.943Z" />
<DateDisplay date="2024-09-14T09:21:21.943Z" format="PPpp" />
`})}),`
`,e.jsx(n.h2,{id:"how-to-display-storage-capacity",children:"How to display storage capacity"}),`
`,e.jsx(n.h3,{id:"storage-component",children:"Storage Component"}),`
`,e.jsxs(n.p,{children:["Use the ",e.jsx(n.code,{children:"Storage"})," component from ",e.jsx(n.code,{children:"@ovh-ux/manager-react-components"})," for displaying storage values:"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { Storage } from '@ovh-ux/manager-react-components';

// Basic usage
<Storage value={1024} />

// With unit
<Storage 
  value={1024} 
  unit="GB" 
/>

// With precision
<Storage 
  value={1024} 
  unit="GB" 
  precision={2} 
/>
`})}),`
`,e.jsx(n.h2,{id:"common-patterns",children:"Common Patterns"}),`
`,e.jsx(n.h3,{id:"loading-states",children:"Loading States"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { Skeleton } from '@ovhcloud/ods-components/react';

// Loading state for price
<Skeleton width="100px" height="24px" />

// Loading state for date
<Skeleton width="120px" height="24px" />

// Loading state for storage
<Skeleton width="80px" height="24px" />
`})}),`
`,e.jsx(n.h2,{id:"code-review-checklist",children:"Code Review Checklist"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["[ ] Use appropriate components from ",e.jsx(n.code,{children:"@ovh-ux/manager-react-components"})]}),`
`,e.jsx(n.li,{children:"[ ] Implement proper loading states"}),`
`,e.jsx(n.li,{children:"[ ] Handle error cases"}),`
`,e.jsx(n.li,{children:"[ ] Follow formatting guidelines"}),`
`,e.jsx(n.li,{children:"[ ] Consider localization"}),`
`,e.jsx(n.li,{children:"[ ] Test with different values"}),`
`,e.jsx(n.li,{children:"[ ] Verify accessibility"}),`
`,e.jsx(n.li,{children:"[ ] Check responsive behavior"}),`
`]}),`
`,e.jsx(n.h2,{id:"reference",children:"Reference"}),`
`,e.jsx(n.h3,{id:"external-resources",children:"External Resources"}),`
`,e.jsx(n.h4,{id:"date-handling",children:"Date Handling"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://momentjs.com/docs/",rel:"nofollow",children:"Moment.js Documentation"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://date-fns.org/",rel:"nofollow",children:"Date-fns Documentation"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat",rel:"nofollow",children:"Intl.DateTimeFormat"})}),`
`]}),`
`,e.jsx(n.h4,{id:"number-formatting",children:"Number Formatting"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat",rel:"nofollow",children:"Intl.NumberFormat"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://www.currency-iso.org/en/home/tables/table-a1.html",rel:"nofollow",children:"Currency Codes"})}),`
`]}),`
`,e.jsx(n.h4,{id:"storage-units",children:"Storage Units"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://en.wikipedia.org/wiki/Binary_prefix",rel:"nofollow",children:"Binary Prefixes"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://www.bipm.org/en/measurement-units/",rel:"nofollow",children:"SI Units"})}),`
`]})]})}function x(t={}){const{wrapper:n}={...a(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(i,{...t})}):i(t)}export{x as default};
