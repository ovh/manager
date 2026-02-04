import{j as d}from"./jsx-runtime-BRNY0I4F.js";import{G as I}from"./lib-7WI39Bnb-B8YmdMzd.js";import"./index-Bnop-kX6.js";import"./iframe-COCNz2cq.js";import"./QueryClientProvider-BPX08D6Z.js";import"./index-DnqQo6oJ.js";import"./index-4pTrEEYx.js";import"./Icon-xxQ9IRzi-ORI6lMWl.js";import"./index-CWkFp9WS-BSIT86NH.js";import"./Link-TMoA1i18-DiBAU0SL.js";import"./Text-BGoUCJU7-BjFZdlzU.js";import"./ComboboxControl-EYkaEIlI-CWYTos8A.js";import"./Divider-wQyo85oE-5vlIiwia.js";const e={texts:{title:"Title of the Card",category:"Tutorial"},href:"https://ovh.com"},E=[{text:"Cloud computing"},{text:"Beta"}],j={alt:"offer",src:"https://www.ovhcloud.com/sites/default/files/styles/offer_range_card/public/2021-06/1886_AI_Notebook1_Hero_600x400.png"},D={...e.texts,description:"Here you can put the description of the card. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."},J={title:"Manager UI Kit/Components/Link Card",decorators:[c=>d.jsx("div",{className:"columns-3",children:d.jsx(c,{})})],component:I,tags:["autodocs"],argTypes:{texts:{title:{control:"text",description:"Title of the Card"},category:{description:"Category of the Card",control:"text"},Description:{description:"description of the Card",control:"text"}},href:{control:"text",description:"URL of the Card and link"},externalHref:{control:"boolean",description:"Change the icon of the link to indicate if the link is internal or external",table:{defaultValue:{summary:""}}},img:{imgSrc:{control:"text",description:"URL of the image to display in the header of the Card"},imgAlt:{control:"text",description:"Alternative label of the image"}},badges:{description:"Display examples of badges in the story (in the actual code there is a badge slot)"}},args:e},o=c=>d.jsx(I,{...c}),t=o.bind({});t.args={...e,texts:D};t.parameters={docs:{source:{code:`<LinkCard 
  href="https://ovh.com"
  texts={{
    title: 'Title of the Card',
    category: 'Tutorial',
    description: 'Card description text here...',
  }}
/>`}}};const r=o.bind({});r.args={...e,img:j};r.parameters={docs:{source:{code:`<LinkCard 
  href="https://ovh.com"
  texts={{
    title: 'Title of the Card',
    category: 'Tutorial',
  }}
  img={{
    alt: 'offer',
    src: 'https://www.ovhcloud.com/sites/default/files/styles/offer_range_card/public/2021-06/1886_AI_Notebook1_Hero_600x400.png',
  }}
/>`}}};const s=o.bind({});s.args={...e,badges:E};const a=o.bind({});a.args={...e,hrefLabel:"Custom Label"};const i=o.bind({});i.args={...e,externalHref:!0};const n=o.bind({});n.args={...e,texts:D,img:j,badges:E};var p,m,l;e.parameters={...e.parameters,docs:{...(p=e.parameters)==null?void 0:p.docs,source:{originalSource:`{
  texts: {
    title: 'Title of the Card',
    category: 'Tutorial'
  },
  href: 'https://ovh.com'
}`,...(l=(m=e.parameters)==null?void 0:m.docs)==null?void 0:l.source}}};var g,h,u;t.parameters={...t.parameters,docs:{...(g=t.parameters)==null?void 0:g.docs,source:{originalSource:"(args: LinkCardProps) => <LinkCard {...args} />",...(u=(h=t.parameters)==null?void 0:h.docs)==null?void 0:u.source}}};var f,x,C;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:"(args: LinkCardProps) => <LinkCard {...args} />",...(C=(x=r.parameters)==null?void 0:x.docs)==null?void 0:C.source}}};var k,L,b;s.parameters={...s.parameters,docs:{...(k=s.parameters)==null?void 0:k.docs,source:{originalSource:"(args: LinkCardProps) => <LinkCard {...args} />",...(b=(L=s.parameters)==null?void 0:L.docs)==null?void 0:b.source}}};var y,_,T;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:"(args: LinkCardProps) => <LinkCard {...args} />",...(T=(_=a.parameters)==null?void 0:_.docs)==null?void 0:T.source}}};var W,v,w;i.parameters={...i.parameters,docs:{...(W=i.parameters)==null?void 0:W.docs,source:{originalSource:"(args: LinkCardProps) => <LinkCard {...args} />",...(w=(v=i.parameters)==null?void 0:v.docs)==null?void 0:w.source}}};var P,S,H;n.parameters={...n.parameters,docs:{...(P=n.parameters)==null?void 0:P.docs,source:{originalSource:"(args: LinkCardProps) => <LinkCard {...args} />",...(H=(S=n.parameters)==null?void 0:S.docs)==null?void 0:H.source}}};const Q=["defaultProps","WithDescription","WithImage","WithBadges","WithCustomHrefLabel","WithExternalLink","CompleteExample"];export{n as CompleteExample,s as WithBadges,a as WithCustomHrefLabel,t as WithDescription,i as WithExternalLink,r as WithImage,Q as __namedExportsOrder,J as default,e as defaultProps};
