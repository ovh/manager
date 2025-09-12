import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as t}from"./index-CdjcsXAS.js";import{M as i}from"./index-znkjjTxY.js";import"./index-Bnop-kX6.js";import"./iframe-CHNKH7Wl.js";import"./index-D0sJu8id.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";const s=""+new URL("onboarding-flow-D0mxfsrf.png",import.meta.url).href;function r(o){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",ul:"ul",...t(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(i,{title:"Guidelines/React Templates/Onboarding page"}),`
`,e.jsx(n.h1,{id:"how-to-add-onboarding-page",children:"How to add Onboarding Page"}),`
`,e.jsx(n.p,{children:"The Onboarding page is a React component that guides users through the initial setup and configuration of your service. It provides a step-by-step process to help users get started with your service quickly and efficiently."}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"💡 Good to know"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"Onboarding"})," is already implemented in the ",e.jsx(n.a,{href:"https://github.com/ovh/manager/tree/master/packages/manager/core/generator",rel:"nofollow",children:e.jsx(n.code,{children:"generator"})})," by default, you just have to add and update some part of the code"]}),`
`]}),`
`,e.jsx(n.h2,{id:"as-a-developer",children:"As a developer"}),`
`,e.jsxs(n.p,{children:["Once the project generated, in your app folder, you will find ",e.jsx(n.code,{children:"src/pages/onboarding/index.tsx"})," file."]}),`
`,e.jsx(n.p,{children:"You have a default Onboarding template with a service description, a CTA Button and some external links."}),`
`,e.jsx(n.h3,{id:"main-components",children:"Main Components"}),`
`,e.jsx("img",{src:s,alt:"Complete onboarding flow",width:"800"}),`
`,e.jsx(n.h4,{id:"onboardinglayout",children:"OnboardingLayout"}),`
`,e.jsxs(n.p,{children:["The onboarding page uses the ",e.jsx(n.code,{children:"OnboardingLayout"})," component from ",e.jsx(n.code,{children:"manager-react-components"})," as its main container. This provides consistent styling and structure across the application."]}),`
`,e.jsx(n.h3,{id:"implementation-example",children:"Implementation Example"}),`
`,e.jsx(n.p,{children:"Here's a comprehensive example showing all the features of the OnboardingLayout component:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { OnboardingLayout, Card } from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';

const OnboardingPage = () => (
  <OnboardingLayout
    // Basic props
    title="Welcome to Your Service"
    
    // Description with rich text
    description={
      <OdsText preset="paragraph" className="text-center">
        Get started with your new service. Follow these simple steps to configure
        and customize your experience.
      </OdsText>
    }
    
    // Header image
    img={{ 
      src: '/assets/onboarding-image.png',
      alt: 'Welcome illustration'
    }}
    
    // Order button with IAM check
    orderButtonLabel="Start Now"
    orderHref="https://example.com/order"
    orderIam={{
      urn: 'urn:v1:eu:resource:vrackServices:vrs-bby-zkm-3a9-tlk',
      iamActions: ['vrackServices:apiovh:resource/edit'],
      displayTooltip: false,
    }}
    
    // More info button
    moreInfoButtonLabel="Learn More"
    moreInfoHref="https://example.com/docs"
    moreInfoButtonIcon="externalLink"
  >
    {/* Content cards */}
    <>
      <Card
        href="/service1"
        texts={{
          title: 'Configure Your Service',
          description: 'Set up your basic configuration and preferences',
          category: 'SETUP',
        }}
      />
      <Card
        href="/service2"
        texts={{
          title: 'Add Resources',
          description: 'Add and manage your service resources',
          category: 'RESOURCES',
        }}
      />
      <Card
        href="/service3"
        texts={{
          title: 'Monitor & Manage',
          description: 'Monitor your service and manage settings',
          category: 'MANAGEMENT',
        }}
      />
    </>
  </OnboardingLayout>
);
`})}),`
`,e.jsx(n.h2,{id:"-tracking-checklist",children:"📊 TRACKING Checklist"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"[ ] TrackPage display tracking on component mount"}),`
`,e.jsx(n.li,{children:"[ ] TrackClick - Order buttons"}),`
`,e.jsx(n.li,{children:"[ ] TrackClick - More Infos buttons"}),`
`,e.jsx(n.li,{children:"[ ] TrackClick - Card external links"}),`
`]}),`
`,e.jsx(n.h3,{id:"code-review-checklist",children:"Code Review Checklist"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["[ ] Use ",e.jsx(n.code,{children:"OnboardingLayout"})," component from ",e.jsx(n.code,{children:"manager-react-components"})]}),`
`,e.jsxs(n.li,{children:["[ ] Use ",e.jsx(n.code,{children:"Card"})," component from ",e.jsx(n.code,{children:"manager-react-components"})]}),`
`,e.jsx(n.li,{children:"[ ] Add proper translations"}),`
`,e.jsx(n.li,{children:"[ ] Add success/error notifications"}),`
`,e.jsx(n.li,{children:"[ ] Follow accessibility guidelines"}),`
`]})]})}function g(o={}){const{wrapper:n}={...t(),...o.components};return n?e.jsx(n,{...o,children:e.jsx(r,{...o})}):r(o)}export{g as default};
