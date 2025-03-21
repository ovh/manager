import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{H as t}from"./headers.component-BSL1e_6u.js";import{A as B}from"./action.component-CL6APHGo.js";import{G as v}from"./guide.component-BdJJ292a.js";import{C as x}from"./changelog.component-DirU89AS.js";import"./index-Bnop-kX6.js";import"./index-vm89uYmh.js";import"./index-4pTrEEYx.js";import"./card.component-C1_2bJfS.js";import"./title.component-ucIeg-_K.js";import"./links.component-DBbFpAyB.js";import"./index-C7RZ_VRQ.js";import"./i18next-DdipboBq.js";import"./useTranslation-I4D8sCWp.js";import"./translation-Bzcle6L7.js";import"./ManagerButton-BJqNRrkz.js";import"./useOvhIam-4UIu5qrD.js";import"./QueryClientProvider-Y_fKerI5.js";import"./useOvhTracking-DR3F_7di.js";import"./index-DHSIHcaZ.js";const H={title:"Example for header",description:"description for header"},j={subtitle:"Example for subHeader",description:"description for subheader"},w=[{id:1,href:"https://www.ovh.com",target:"_blank",label:"Action 1"},{id:2,href:"https://help.ovhcloud.com/csm/fr-documentation?id=kb_home",target:"_blank",label:"Action 2"}],k=[{id:1,href:"https://www.ovh.com",target:"_blank",label:"ovh.com"},{id:2,href:"https://help.ovhcloud.com/csm/fr-documentation?id=kb_home",target:"_blank",label:"Guides OVH"}],A=["baremetal","server","dedicated"],W={roadmap:"https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal",changelog:"https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal","feature-request":"https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal"},_={title:"Example for header with actions ",description:"description for header",headerButton:e.jsx(B,{id:"1",items:w})},E={title:"Example for header with header buttons",description:"description for subheader",headerButton:e.jsx(v,{items:k}),changelogButton:e.jsx(x,{links:W,chapters:A})},r=()=>e.jsx(t,{...H}),o=()=>e.jsx(t,{...j}),a=()=>e.jsx(t,{...E}),s=()=>e.jsx(t,{..._}),U={title:"Content/Headers",component:t,argTypes:{},args:H};var i,n,c;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:"() => <Headers {...Heading} />",...(c=(n=r.parameters)==null?void 0:n.docs)==null?void 0:c.source}}};var d,m,p;o.parameters={...o.parameters,docs:{...(d=o.parameters)==null?void 0:d.docs,source:{originalSource:"() => <Headers {...SubHeading} />",...(p=(m=o.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var h,u,l;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:"() => <Headers {...HeadingWithHeaderButtons} />",...(l=(u=a.parameters)==null?void 0:u.docs)==null?void 0:l.source}}};var g,f,b;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:"() => <Headers {...HeadingWithActionButton} />",...(b=(f=s.parameters)==null?void 0:f.docs)==null?void 0:b.source}}};const X=["header","subHeader","headerWithHeaderButtons","headerWithActions"];export{X as __namedExportsOrder,U as default,r as header,s as headerWithActions,a as headerWithHeaderButtons,o as subHeader};
