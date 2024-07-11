import{e as t}from"./index-3dddd4ad.js";import{j as e}from"./jsx-runtime-ffb262ed.js";import{g as q,O as u}from"./index-e82d4dd7.js";import{b as p,a as A,O as d,c as C}from"./ods-theme-typography-size-699c556d.js";import"./card.component-a80bb22b.js";import"./description.component-dcfd9035.js";import"./title.component-55acf6ac.js";import{a as D,L as B}from"./links.component-f83c3767.js";import"./index-76fb7be0.js";import"./_commonjsHelpers-de833af9.js";import"./index-da03a860.js";import"./ods-html-anchor-element-target-69f04948.js";import"./i18next-65ce221f.js";import"./setPrototypeOf-24bea416.js";import"./useTranslation-756c8576.js";function n({title:o,description:c,cta:l,type:m=t.info,onClick:T,isRemovable:k,size:P="max-w-4xl",className:h}){return e.jsx(q,{type:m,color:m,className:`mt-3 flex flex-row items-center ${P} ${h}`,"data-testid":"actionBanner-message_container",removable:k,children:e.jsxs("div",{className:"grid",children:[o&&e.jsx(u,{size:p._200,level:A.heading,color:d.text,hue:C._900,className:"block mb-3",children:o}),c&&e.jsx("div",{children:e.jsx(u,{size:p._400,color:d.text,children:c})}),l&&e.jsx(D,{label:l,type:B.next,onClickReturn:T,className:"mt-3"})]})})}try{n.displayName="ActionBanner",n.__docgenInfo={description:"",displayName:"ActionBanner",props:{title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string"}},description:{defaultValue:null,description:"",name:"description",required:!1,type:{name:"string"}},cta:{defaultValue:null,description:"",name:"cta",required:!0,type:{name:"string"}},type:{defaultValue:{value:"ODS_MESSAGE_TYPE.info"},description:"",name:"type",required:!1,type:{name:"enum",value:[{value:'"error"'},{value:'"info"'},{value:'"success"'},{value:'"warning"'}]}},onClick:{defaultValue:null,description:"",name:"onClick",required:!0,type:{name:"() => void"}},isRemovable:{defaultValue:null,description:"",name:"isRemovable",required:!1,type:{name:"boolean"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},size:{defaultValue:{value:"BannerSize.classic"},description:"",name:"size",required:!1,type:{name:"enum",value:[{value:'"max-w-4xl"'},{value:'"max-w-full"'}]}}}}}catch{}const s={args:{title:"Lorem ipsum dolor sit amet consectetur. Commodo non egestas libero dictumst orci ",description:"Lorem ipsum dolor sit amet consectetur. Mattis mattis purus in at in sed scelerisque eget.",cta:"I am a link always under the text",onClick:()=>console.log("clicked"),type:t.info,isRemovable:!0}},a={args:{description:"Lorem ipsum dolor sit amet consectetur. Mattis mattis purus in at in sed scelerisque eget.",type:t.info}},r={args:{title:"Lorem ipsum dolor sit amet consectetur. Commodo non egestas libero dictumst orci ",description:"Lorem ipsum dolor sit amet consectetur. Mattis mattis purus in at in sed scelerisque eget.",type:t.info}},i={args:{description:"Programme bêta pour Public Cloud : testez nos solutions s’appuyant sur OpenStack (Load Balancer, instance de routage, Floating IP et Bare Metal as a Service).",cta:"Activer le projet",type:t.warning}},J={title:"Components/Action Banner",component:n};var g,_,f;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    title: 'Lorem ipsum dolor sit amet consectetur. Commodo non egestas libero dictumst orci ',
    description: 'Lorem ipsum dolor sit amet consectetur. Mattis mattis purus in at in sed scelerisque eget.',
    cta: 'I am a link always under the text',
    onClick: () => console.log('clicked'),
    type: ODS_MESSAGE_TYPE.info,
    isRemovable: true
  }
}`,...(f=(_=s.parameters)==null?void 0:_.docs)==null?void 0:f.source}}};var E,S,y;a.parameters={...a.parameters,docs:{...(E=a.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    description: 'Lorem ipsum dolor sit amet consectetur. Mattis mattis purus in at in sed scelerisque eget.',
    type: ODS_MESSAGE_TYPE.info
  }
}`,...(y=(S=a.parameters)==null?void 0:S.docs)==null?void 0:y.source}}};var v,x,O;r.parameters={...r.parameters,docs:{...(v=r.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    title: 'Lorem ipsum dolor sit amet consectetur. Commodo non egestas libero dictumst orci ',
    description: 'Lorem ipsum dolor sit amet consectetur. Mattis mattis purus in at in sed scelerisque eget.',
    type: ODS_MESSAGE_TYPE.info
  }
}`,...(O=(x=r.parameters)==null?void 0:x.docs)==null?void 0:O.source}}};var L,M,b;i.parameters={...i.parameters,docs:{...(L=i.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    description: 'Programme bêta pour Public Cloud : testez nos solutions s’appuyant sur OpenStack (Load Balancer, instance de routage, Floating IP et Bare Metal as a Service).',
    cta: 'Activer le projet',
    type: ODS_MESSAGE_TYPE.warning
  }
}`,...(b=(M=i.parameters)==null?void 0:M.docs)==null?void 0:b.source}}};const K=["Default","WithoutTitle","WithoutLink","Warning"];export{s as Default,i as Warning,r as WithoutLink,a as WithoutTitle,K as __namedExportsOrder,J as default};
//# sourceMappingURL=action-banner.stories-b45aa5dd.js.map
