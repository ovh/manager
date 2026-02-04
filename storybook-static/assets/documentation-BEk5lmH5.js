import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as r}from"./index-JTD1cOSY.js";import{M as i,S as a}from"./index-BOVma5jo.js";import"./index-Bnop-kX6.js";import"./iframe-COCNz2cq.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function n(t){const o={code:"code",h1:"h1",h2:"h2",p:"p",...r(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(i,{title:"Manager UI Kit/Components/OnboardingLayout/Documentation"}),`
`,e.jsx(o.h1,{id:"onboarding-layout",children:"Onboarding Layout"}),`
`,e.jsx(o.h2,{id:"overview",children:"Overview"}),`
`,e.jsxs(o.p,{children:["The ",e.jsx(o.code,{children:"OnboardingLayout"})," component is a comprehensive, responsive layout designed to create engaging onboarding experiences for OVHcloud applications. It provides a structured template that combines a prominent header section with an optional grid of content cards, making it ideal for welcoming users and guiding them through new features or services."]}),`
`,e.jsx(o.h2,{id:"recommandation",children:"Recommandation"}),`
`,e.jsxs(o.p,{children:["For the the ",e.jsx(o.code,{children:"description"})," property, please be sure to wrap the component with a paragraph or Text component."]}),`
`,e.jsx(a,{code:`
    import { OnboardingLayout } from '@ovh-ux/muk';

    render(
        <OnboardingLayout
            title="Welcome Onboarding"
            orderHref="https://example.com/order"
            orderButtonLabel="Order Now"
            moreInfoHref="https://example.com/more-info"
            moreInfoButtonLabel="Learn More"
            img={{ src: placeholderSrc, style: { filter: 'grayscale(100%)' } }}
            description={
                <Text preset="paragraph" className="text-center">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                </Text>
            }
        />
    );
 `,language:"typescript"})]})}function g(t={}){const{wrapper:o}={...r(),...t.components};return o?e.jsx(o,{...t,children:e.jsx(n,{...t})}):n(t)}export{g as default};
