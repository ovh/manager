import{j as n}from"./jsx-runtime-BRNY0I4F.js";import{u as o}from"./index-BbbfVuzK.js";import"./index-ChS17p17.js";import{M as r}from"./index-B3OJxjuP.js";import"./index-Bnop-kX6.js";import"./index-PzEU9Mdi.js";import"./index-oX_7i0mk.js";import"./index-D0sJu8id.js";import"./iframe-C_3YMFde.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function t(i){const e={code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",ul:"ul",...o(),...i.components};return n.jsxs(n.Fragment,{children:[n.jsx(r,{title:"Core/manager-react-shell-client/Documentation"}),`
`,n.jsx(e.h1,{id:"shell-client-documentation",children:"Shell Client Documentation"}),`
`,n.jsx(e.h2,{id:"tracking-implementation",children:"Tracking Implementation"}),`
`,n.jsxs(e.p,{children:["The shell client provides a built-in tracking solution through the ",n.jsx(e.code,{children:"useOvhTracking"})," hook. This hook provides two main methods for tracking user interactions: ",n.jsx(e.code,{children:"trackClick"})," for click events and ",n.jsx(e.code,{children:"trackPage"})," for page views."]}),`
`,n.jsx(e.h3,{id:"available-enums",children:"Available Enums"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`enum ButtonType {
  BUTTON = 'button',
  LINK = 'link',
  SUBMIT = 'submit',
  RESET = 'reset',
}

enum PageLocation {
  HEADER = 'header',
  SIDEBAR = 'sidebar',
  CONTENT = 'content',
  FOOTER = 'footer',
}

enum PageType {
  DASHBOARD = 'dashboard',
  LIST = 'list',
  DETAIL = 'detail',
  FORM = 'form',
  SETTINGS = 'settings',
}
`})}),`
`,n.jsx(e.h3,{id:"basic-usage",children:"Basic Usage"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ButtonType, PageLocation, PageType } from '@ovh-ux/manager-react-shell-client';

const MyComponent = () => {
  const { trackClick, trackPage } = useOvhTracking();

  const handleClick = () => {
    trackClick({
      name: 'submit',
      type: ButtonType.BUTTON,
      page: PageType.funnel,
      location: PageLocation.funnel,
    });
  };

  return <button onClick={handleClick}>Submit</button>;
};
`})}),`
`,n.jsx(e.h3,{id:"tracking-configuration",children:"Tracking Configuration"}),`
`,n.jsx(e.p,{children:"The tracking is automatically configured with the following context:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Application name"}),`
`,n.jsx(e.li,{children:"Environment"}),`
`,n.jsx(e.li,{children:"User information"}),`
`,n.jsx(e.li,{children:"Page information"}),`
`]}),`
`,n.jsx(e.p,{children:"No additional configuration is required as it's handled by the shell client."}),`
`,n.jsx(e.h3,{id:"common-use-cases",children:"Common Use Cases"}),`
`,n.jsx(e.h4,{id:"1-page-views",children:"1. Page Views"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { PageType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { useEffect } from 'react';

const Page = () => {
  const { trackPage } = useOvhTracking();

  useEffect(() => {
    trackPage({
      name: 'listing',
      type: PageType.listing,
    });
  }, []);

  return <div>Page Content</div>;
};
`})}),`
`,n.jsx(e.h4,{id:"2-user-actions",children:"2. User Actions"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ButtonType, PageLocation, PageType } from '@ovh-ux/manager-react-shell-client';

const ActionButton = ({ name, onClick }) => {
  const { trackClick } = useOvhTracking();

  const handleClick = (e) => {
    trackClick({
      name: 'submit',
      type: ButtonType.button,
      page: PageType.funnel,
      location: PageLocation.funnel,
    });
    onClick?.(e);
  };

  return <button onClick={handleClick}>{name}</button>;
};
`})}),`
`,n.jsx(e.h3,{id:"code-review-checklist",children:"Code Review Checklist"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["[ ] Page views are tracked using ",n.jsx(e.code,{children:"trackPage"})," with proper enums"]}),`
`,n.jsxs(e.li,{children:["[ ] Click events are tracked using ",n.jsx(e.code,{children:"trackClick"})," with proper enums"]}),`
`,n.jsx(e.li,{children:"[ ] Event properties use the provided enums"}),`
`]})]})}function k(i={}){const{wrapper:e}={...o(),...i.components};return e?n.jsx(e,{...i,children:n.jsx(t,{...i})}):t(i)}export{k as default};
