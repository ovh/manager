import{j as s}from"./jsx-runtime-CKrituN3.js";import{C as g}from"./card.component-DWJCpXBY.js";import"./index-CBqU2yxZ.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-v66SXByX.js";import"./index-BtM5VmRH.js";import"./title.component-Bx3BQPQH.js";import"./links.component-DFt-fbY5.js";import"./index-KJkR1nQ3.js";import"./i18next-6HYnolD1.js";import"./useTranslation-Cbsqft5V.js";import"./context-DPnKhrhb.js";const e={texts:{title:"Titre du produit",description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",category:"NAS"},href:"https://ovh.com",img:{alt:"offer",src:"https://www.ovhcloud.com/sites/default/files/styles/offer_range_card/public/2021-06/1886_AI_Notebook1_Hero_600x400.png"}},N={title:"Navigation/Card",decorators:[o=>s.jsx("div",{className:"columns-3",children:s.jsx(o,{})})],component:g,argTypes:{texts:{title:{control:"text",description:"Title of the Card"},category:{description:"Category of the Card",control:"text"},Description:{description:"description of the Card",control:"text"}},href:{control:"text",description:"URL of the Card and link"},isExternalHref:{control:"boolean",description:"Change the icon of the link to indicate if the link is internal or external",table:{defaultValue:{summary:!1}}},img:{imgSrc:{control:"text",description:"URL of the image to display in the header of the Card"},imgAlt:{control:"text",description:"Alternative label of the image"}},badges:{description:"Display examples of badges in the story (in the actual code there is a badge slot)"}},args:e},h=o=>s.jsx(g,{...o}),t=h.bind({});t.args={...e};const r=h.bind({});r.args={...e,badges:[{text:"Cloud computing"},{text:"Beta"}]};var a,i,n;e.parameters={...e.parameters,docs:{...(a=e.parameters)==null?void 0:a.docs,source:{originalSource:`{
  texts: {
    title: 'Titre du produit',
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    category: 'NAS'
  },
  href: 'https://ovh.com',
  img: {
    alt: 'offer',
    src: 'https://www.ovhcloud.com/sites/default/files/styles/offer_range_card/public/2021-06/1886_AI_Notebook1_Hero_600x400.png'
  }
}`,...(n=(i=e.parameters)==null?void 0:i.docs)==null?void 0:n.source}}};var d,p,c;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:"(args: CardProps) => <Card {...args} />",...(c=(p=t.parameters)==null?void 0:p.docs)==null?void 0:c.source}}};var m,l,u;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:"(args: CardProps) => <Card {...args} />",...(u=(l=r.parameters)==null?void 0:l.docs)==null?void 0:u.source}}};const P=["defaultProps","Primary","WithBadges"];export{t as Primary,r as WithBadges,P as __namedExportsOrder,N as default,e as defaultProps};
