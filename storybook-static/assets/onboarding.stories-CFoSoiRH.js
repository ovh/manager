import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{B as t,h as r}from"./lib-CWaID5dp-BJDNWG0v.js";import{p as R,c as F}from"./placeholder-CYtCojE-.js";import{h as N}from"./Text-CcNd6qQr-FOgQIkhx.js";import"./index-Bnop-kX6.js";import"./iframe-CUYazWvm.js";import"./index-4pTrEEYx.js";import"./index-C2BvAoka.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react61-4lD3hp9p.js";const o=()=>e.jsx(t,{title:"Welcome Onboarding",orderHref:"https://example.com/order",orderButtonLabel:"Order Now",moreInfoHref:"https://example.com/more-info",moreInfoButtonLabel:"Learn More",img:{src:R,style:{filter:"grayscale(100%)"}},description:e.jsx(N,{preset:"paragraph",className:"text-center",children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}),orderIam:{urn:"urn:v1:eu:resource:vrackServices:vrs-bby-zkm-3a9-tlk",iamActions:["vrackServices:apiovh:resource/edit"],displayTooltip:!1},children:e.jsxs(e.Fragment,{children:[e.jsx(r,{href:"",texts:{title:"Test Onboarding 1",description:"This is the description 1",category:"WEB"}}),e.jsx(r,{href:"",texts:{title:"Test Onboarding 2",description:"This is the description 2",category:"CLOUD"}}),e.jsx(r,{href:"",texts:{title:"Test Onboarding  3",description:"This is the description 3",category:"TELECOM"}})]})}),i=()=>e.jsx(t,{title:"Onboarding Default"}),n=()=>e.jsx(t,{title:"Onboarding with order Button",orderHref:"https://example.com/order",orderButtonLabel:"Order Now"}),a=()=>e.jsx(t,{title:"Onboarding with IAM action check on order Button",orderHref:"https://example.com/order",orderButtonLabel:"Order Now",orderIam:{urn:"urn:v1:eu:resource:vrackServices:vrs-bby-zkm-3a9-tlk",iamActions:["vrackServices:apiovh:resource/edit"]}}),s=()=>e.jsx(t,{title:"Onboarding with more info Button",moreInfoHref:"https://example.com/more-info",moreInfoButtonLabel:"Learn More"}),c=()=>e.jsx(t,{title:"Onboarding with custom img",img:{src:F}}),d=()=>e.jsx(t,{title:"Onboarding with Description",description:e.jsx(N,{preset:"paragraph",className:"text-center",children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."})}),l=()=>e.jsx(t,{title:"Onboarding with Children",children:e.jsxs(e.Fragment,{children:[e.jsx(r,{href:"",texts:{title:"Test Onboarding 1",description:"This is the description 1",category:"WEB"}}),e.jsx(r,{href:"",texts:{title:"Test Onboarding 2",description:"This is the description 2",category:"CLOUD"}}),e.jsx(r,{href:"",texts:{title:"Test Onboarding  3",description:"This is the description 3",category:"TELECOM"}})]})}),m=()=>e.jsx(t,{title:"onboarding without heading section",hideHeadingSection:!0,children:e.jsxs(e.Fragment,{children:[e.jsx(r,{href:"",texts:{title:"Test Onboarding 1",description:"This is the description 1",category:"WEB"}}),e.jsx(r,{href:"",texts:{title:"Test Onboarding 2",description:"This is the description 2",category:"CLOUD"}}),e.jsx(r,{href:"",texts:{title:"Test Onboarding  3",description:"This is the description 3",category:"TELECOM"}})]})}),Z={title:"Manager UI Kit/Components/OnboardingLayout",component:t,tags:["autodocs"],argTypes:{title:{description:"The main title of the onboarding layout",control:"text",type:{required:!0}},description:{description:"Rich text content displayed below the title. Can be a string or React node.",control:"text"},hideHeadingSection:{description:"When true, hides the entire heading section (title, description, buttons)",control:"boolean",defaultValue:!1},orderButtonLabel:{description:"Label text for the order button",control:"text"},orderHref:{description:"URL to navigate to when order button is clicked. Opens in a new tab.",control:"text"},onOrderButtonClick:{description:"Callback function triggered when order button is clicked",action:"clicked"},isActionDisabled:{description:"Disables the order button when true",control:"boolean",defaultValue:!1},orderIam:{description:"IAM configuration for the order button",control:"object",table:{type:{summary:"{ urn: string; iamActions: string[]; displayTooltip?: boolean }"}}},moreInfoHref:{description:'URL for the "More Info" button. Opens in a new tab.',control:"text"},moreInfoButtonLabel:{description:'Label text for the "More Info" button',control:"text"},moreInfoButtonIcon:{description:'Icon to display on the "More Info" button',control:"select",options:["externalLink","info","help"],defaultValue:"externalLink"},onMoreInfoButtonClick:{description:'Callback function triggered when "More Info" button is clicked',action:"clicked"},isMoreInfoButtonDisabled:{description:'Disables the "More Info" button when true',control:"boolean",defaultValue:!1},img:{description:"Image configuration for the header. Extends standard img props.",control:"object",table:{type:{summary:'React.ComponentProps<"img">'}}},children:{description:"Child components to display below the header section",control:!1}}};var p,u,h;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`() => <OnboardingLayout title="Welcome Onboarding" orderHref="https://example.com/order" orderButtonLabel="Order Now" moreInfoHref="https://example.com/more-info" moreInfoButtonLabel="Learn More" img={{
  src: placeholderSrc,
  style: {
    filter: 'grayscale(100%)'
  }
}} description={<Text preset="paragraph" className="text-center">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </Text>} orderIam={{
  urn: 'urn:v1:eu:resource:vrackServices:vrs-bby-zkm-3a9-tlk',
  iamActions: ['vrackServices:apiovh:resource/edit'],
  displayTooltip: false
}}>
    <>
      <LinkCard href={''} texts={{
      title: 'Test Onboarding 1',
      description: 'This is the description 1',
      category: 'WEB'
    }} />
      <LinkCard href={''} texts={{
      title: 'Test Onboarding 2',
      description: 'This is the description 2',
      category: 'CLOUD'
    }} />
      <LinkCard href={''} texts={{
      title: 'Test Onboarding  3',
      description: 'This is the description 3',
      category: 'TELECOM'
    }} />
    </>
  </OnboardingLayout>`,...(h=(u=o.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};var g,b,O;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:'() => <OnboardingLayout title="Onboarding Default" />',...(O=(b=i.parameters)==null?void 0:b.docs)==null?void 0:O.source}}};var f,x,L;n.parameters={...n.parameters,docs:{...(f=n.parameters)==null?void 0:f.docs,source:{originalSource:'() => <OnboardingLayout title="Onboarding with order Button" orderHref="https://example.com/order" orderButtonLabel="Order Now" />',...(L=(x=n.parameters)==null?void 0:x.docs)==null?void 0:L.source}}};var T,y,C;a.parameters={...a.parameters,docs:{...(T=a.parameters)==null?void 0:T.docs,source:{originalSource:`() => <OnboardingLayout title="Onboarding with IAM action check on order Button" orderHref="https://example.com/order" orderButtonLabel="Order Now" orderIam={{
  urn: 'urn:v1:eu:resource:vrackServices:vrs-bby-zkm-3a9-tlk',
  iamActions: ['vrackServices:apiovh:resource/edit']
}} />`,...(C=(y=a.parameters)==null?void 0:y.docs)==null?void 0:C.source}}};var k,I,v;s.parameters={...s.parameters,docs:{...(k=s.parameters)==null?void 0:k.docs,source:{originalSource:'() => <OnboardingLayout title="Onboarding with more info Button" moreInfoHref="https://example.com/more-info" moreInfoButtonLabel="Learn More" />',...(v=(I=s.parameters)==null?void 0:I.docs)==null?void 0:v.source}}};var B,w,j;c.parameters={...c.parameters,docs:{...(B=c.parameters)==null?void 0:B.docs,source:{originalSource:`() => <OnboardingLayout title="Onboarding with custom img" img={{
  src: customImgSrc
}} />`,...(j=(w=c.parameters)==null?void 0:w.docs)==null?void 0:j.source}}};var S,E,M;d.parameters={...d.parameters,docs:{...(S=d.parameters)==null?void 0:S.docs,source:{originalSource:`() => <OnboardingLayout title="Onboarding with Description" description={<Text preset="paragraph" className="text-center">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </Text>} />`,...(M=(E=d.parameters)==null?void 0:E.docs)==null?void 0:M.source}}};var W,D,q;l.parameters={...l.parameters,docs:{...(W=l.parameters)==null?void 0:W.docs,source:{originalSource:`() => <OnboardingLayout title="Onboarding with Children">
    <>
      <LinkCard href={''} texts={{
      title: 'Test Onboarding 1',
      description: 'This is the description 1',
      category: 'WEB'
    }} />
      <LinkCard href={''} texts={{
      title: 'Test Onboarding 2',
      description: 'This is the description 2',
      category: 'CLOUD'
    }} />
      <LinkCard href={''} texts={{
      title: 'Test Onboarding  3',
      description: 'This is the description 3',
      category: 'TELECOM'
    }} />
    </>
  </OnboardingLayout>`,...(q=(D=l.parameters)==null?void 0:D.docs)==null?void 0:q.source}}};var H,A,U;m.parameters={...m.parameters,docs:{...(H=m.parameters)==null?void 0:H.docs,source:{originalSource:`() => <OnboardingLayout title="onboarding without heading section" hideHeadingSection>
    <>
      <LinkCard href={''} texts={{
      title: 'Test Onboarding 1',
      description: 'This is the description 1',
      category: 'WEB'
    }} />
      <LinkCard href={''} texts={{
      title: 'Test Onboarding 2',
      description: 'This is the description 2',
      category: 'CLOUD'
    }} />
      <LinkCard href={''} texts={{
      title: 'Test Onboarding  3',
      description: 'This is the description 3',
      category: 'TELECOM'
    }} />
    </>
  </OnboardingLayout>`,...(U=(A=m.parameters)==null?void 0:A.docs)==null?void 0:U.source}}};const $=["OnboardingFullExample","OnboardingDefault","OnboardingWithOrderCTA","OnboardingWithIamCheckOnOrderCTA","OnboardingWithMoreInfoCTA","OnboardingWithImg","OnboardingWithDescription","OnboardingWithChildren","OnboardingWithoutHeadingSection"];export{i as OnboardingDefault,o as OnboardingFullExample,l as OnboardingWithChildren,d as OnboardingWithDescription,a as OnboardingWithIamCheckOnOrderCTA,c as OnboardingWithImg,s as OnboardingWithMoreInfoCTA,n as OnboardingWithOrderCTA,m as OnboardingWithoutHeadingSection,$ as __namedExportsOrder,Z as default};
