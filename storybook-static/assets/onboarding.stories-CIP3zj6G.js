import{j as e}from"./jsx-runtime-CKrituN3.js";import{O as r,p as F}from"./onboarding.component-BS6kvZy4.js";import{C as t}from"./card.component-nt1Q_mnc.js";import{c as z}from"./error-banner-oops-tNXFEWkx.js";import{O as U}from"./index-BoGQ30sD.js";import"./index-CBqU2yxZ.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-CqmMgYso.js";import"./ManagerButton-C8zC-Fyb.js";import"./i18next-ihUiNgJT.js";import"./useOvhIam-puHWDhg2.js";import"./QueryClientProvider-DWOoNJcY.js";import"./useTranslation-pmbu4BU3.js";import"./title.component-Bx3BQPQH.js";import"./links.component-B_FCtcjf.js";import"./index-BtM5VmRH.js";const i=()=>e.jsx(r,{title:"Welcome Onboarding",orderHref:"https://example.com/order",orderButtonLabel:"Order Now",moreInfoHref:"https://example.com/more-info",moreInfoButtonLabel:"Learn More",img:{src:F,style:{filter:"grayscale(100%)"}},description:e.jsx(U,{preset:"paragraph",className:"text-center",children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}),orderIam:{urn:"urn:v1:eu:resource:vrackServices:vrs-bby-zkm-3a9-tlk",iamActions:["vrackServices:apiovh:resource/edit"],displayTooltip:!1},children:e.jsxs(e.Fragment,{children:[e.jsx(t,{href:"",texts:{title:"Test Onboarding 1",description:"This is the description 1",category:"WEB"}}),e.jsx(t,{href:"",texts:{title:"Test Onboarding 2",description:"This is the description 2",category:"CLOUD"}}),e.jsx(t,{href:"",texts:{title:"Test Onboarding  3",description:"This is the description 3",category:"TELECOM"}})]})}),o=()=>e.jsx(r,{title:"Onboarding Default"}),n=()=>e.jsx(r,{title:"Onboarding with order Button",orderHref:"https://example.com/order",orderButtonLabel:"Order Now"}),a=()=>e.jsx(r,{title:"Onboarding with IAM action check on order Button",orderHref:"https://example.com/order",orderButtonLabel:"Order Now",orderIam:{urn:"urn:v1:eu:resource:vrackServices:vrs-bby-zkm-3a9-tlk",iamActions:["vrackServices:apiovh:resource/edit"]}}),s=()=>e.jsx(r,{title:"Onboarding with more info Button",moreInfoHref:"https://example.com/more-info",moreInfoButtonLabel:"Learn More"}),d=()=>e.jsx(r,{title:"Onboarding with custom img",img:{src:z}}),c=()=>e.jsx(r,{title:"Onboarding with Description",description:e.jsx(U,{preset:"paragraph",className:"text-center",children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."})}),m=()=>e.jsx(r,{title:"Onboarding with Children",children:e.jsxs(e.Fragment,{children:[e.jsx(t,{href:"",texts:{title:"Test Onboarding 1",description:"This is the description 1",category:"WEB"}}),e.jsx(t,{href:"",texts:{title:"Test Onboarding 2",description:"This is the description 2",category:"CLOUD"}}),e.jsx(t,{href:"",texts:{title:"Test Onboarding  3",description:"This is the description 3",category:"TELECOM"}})]})}),p=()=>e.jsx(r,{title:"onboarding without heading section",hideHeadingSection:!0,children:e.jsxs(e.Fragment,{children:[e.jsx(t,{href:"",texts:{title:"Test Onboarding 1",description:"This is the description 1",category:"WEB"}}),e.jsx(t,{href:"",texts:{title:"Test Onboarding 2",description:"This is the description 2",category:"CLOUD"}}),e.jsx(t,{href:"",texts:{title:"Test Onboarding  3",description:"This is the description 3",category:"TELECOM"}})]})}),oe={title:"Templates/Onboarding",component:r};var l,u,g;i.parameters={...i.parameters,docs:{...(l=i.parameters)==null?void 0:l.docs,source:{originalSource:`() => <OnboardingLayout title="Welcome Onboarding" orderHref="https://example.com/order" orderButtonLabel="Order Now" moreInfoHref="https://example.com/more-info" moreInfoButtonLabel="Learn More" img={{
  src: placeholderSrc,
  style: {
    filter: 'grayscale(100%)'
  }
}} description={<OdsText preset="paragraph" className="text-center">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </OdsText>} orderIam={{
  urn: 'urn:v1:eu:resource:vrackServices:vrs-bby-zkm-3a9-tlk',
  iamActions: ['vrackServices:apiovh:resource/edit'],
  displayTooltip: false
}}>
    <>
      <Card href={''} texts={{
      title: 'Test Onboarding 1',
      description: 'This is the description 1',
      category: 'WEB'
    }} />
      <Card href={''} texts={{
      title: 'Test Onboarding 2',
      description: 'This is the description 2',
      category: 'CLOUD'
    }} />
      <Card href={''} texts={{
      title: 'Test Onboarding  3',
      description: 'This is the description 3',
      category: 'TELECOM'
    }} />
    </>
  </OnboardingLayout>`,...(g=(u=i.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var h,O,b;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:'() => <OnboardingLayout title="Onboarding Default" />',...(b=(O=o.parameters)==null?void 0:O.docs)==null?void 0:b.source}}};var x,f,T;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:'() => <OnboardingLayout title="Onboarding with order Button" orderHref="https://example.com/order" orderButtonLabel="Order Now" />',...(T=(f=n.parameters)==null?void 0:f.docs)==null?void 0:T.source}}};var L,y,C;a.parameters={...a.parameters,docs:{...(L=a.parameters)==null?void 0:L.docs,source:{originalSource:`() => <OnboardingLayout title="Onboarding with IAM action check on order Button" orderHref="https://example.com/order" orderButtonLabel="Order Now" orderIam={{
  urn: 'urn:v1:eu:resource:vrackServices:vrs-bby-zkm-3a9-tlk',
  iamActions: ['vrackServices:apiovh:resource/edit']
}} />`,...(C=(y=a.parameters)==null?void 0:y.docs)==null?void 0:C.source}}};var v,j,S;s.parameters={...s.parameters,docs:{...(v=s.parameters)==null?void 0:v.docs,source:{originalSource:'() => <OnboardingLayout title="Onboarding with more info Button" moreInfoHref="https://example.com/more-info" moreInfoButtonLabel="Learn More" />',...(S=(j=s.parameters)==null?void 0:j.docs)==null?void 0:S.source}}};var B,E,I;d.parameters={...d.parameters,docs:{...(B=d.parameters)==null?void 0:B.docs,source:{originalSource:`() => <OnboardingLayout title="Onboarding with custom img" img={{
  src: customImgSrc
}} />`,...(I=(E=d.parameters)==null?void 0:E.docs)==null?void 0:I.source}}};var W,k,w;c.parameters={...c.parameters,docs:{...(W=c.parameters)==null?void 0:W.docs,source:{originalSource:`() => <OnboardingLayout title="Onboarding with Description" description={<OdsText preset="paragraph" className="text-center">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </OdsText>} />`,...(w=(k=c.parameters)==null?void 0:k.docs)==null?void 0:w.source}}};var q,D,H;m.parameters={...m.parameters,docs:{...(q=m.parameters)==null?void 0:q.docs,source:{originalSource:`() => <OnboardingLayout title="Onboarding with Children">
    <>
      <Card href={''} texts={{
      title: 'Test Onboarding 1',
      description: 'This is the description 1',
      category: 'WEB'
    }} />
      <Card href={''} texts={{
      title: 'Test Onboarding 2',
      description: 'This is the description 2',
      category: 'CLOUD'
    }} />
      <Card href={''} texts={{
      title: 'Test Onboarding  3',
      description: 'This is the description 3',
      category: 'TELECOM'
    }} />
    </>
  </OnboardingLayout>`,...(H=(D=m.parameters)==null?void 0:D.docs)==null?void 0:H.source}}};var M,A,N;p.parameters={...p.parameters,docs:{...(M=p.parameters)==null?void 0:M.docs,source:{originalSource:`() => <OnboardingLayout title="onboarding without heading section" hideHeadingSection>
    <>
      <Card href={''} texts={{
      title: 'Test Onboarding 1',
      description: 'This is the description 1',
      category: 'WEB'
    }} />
      <Card href={''} texts={{
      title: 'Test Onboarding 2',
      description: 'This is the description 2',
      category: 'CLOUD'
    }} />
      <Card href={''} texts={{
      title: 'Test Onboarding  3',
      description: 'This is the description 3',
      category: 'TELECOM'
    }} />
    </>
  </OnboardingLayout>`,...(N=(A=p.parameters)==null?void 0:A.docs)==null?void 0:N.source}}};const ne=["OnboardingFullExample","OnboardingDefault","OnboardingWithOrderCTA","OnboardingWithIamCheckOnOrderCTA","OnboardingWithMoreInfoCTA","OnboardingWithImg","OnboardingWithDescription","OnboardingWithChildren","OnboardingWithoutHeadingSection"];export{o as OnboardingDefault,i as OnboardingFullExample,m as OnboardingWithChildren,c as OnboardingWithDescription,a as OnboardingWithIamCheckOnOrderCTA,d as OnboardingWithImg,s as OnboardingWithMoreInfoCTA,n as OnboardingWithOrderCTA,p as OnboardingWithoutHeadingSection,ne as __namedExportsOrder,oe as default};
