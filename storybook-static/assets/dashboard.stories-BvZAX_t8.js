import{j as e}from"./jsx-runtime-CKrituN3.js";import{h as j,i as v,j as y,k as r,l as k,m as i,n as S}from"./index-A2RwyqN4.js";import{O as _}from"./ods-theme-typography-size-DKhhZ49-.js";import{O as p}from"./ods-html-anchor-element-target-f6UO5e9Y.js";import{O as E,i as L}from"./index-D8LG6A4J.js";import{H as a}from"./headers.component-DwztMvGb.js";import"./price.component-DVnm6G94.js";import"./card.component-BGPE0YIa.js";import{D as b}from"./description.component-BF5UeSF8.js";import{S as D}from"./title.component-CNoeulS0.js";import{a as N,L as I}from"./links.component-D8KGMaXo.js";import{P as C,D as R}from"./layout.component-C0coWwbe.js";import{G as V}from"./guide.component-CZNdlyJ5.js";import"./index-CBqU2yxZ.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-BtM5VmRH.js";import"./i18next-BjY3x9oy.js";import"./useTranslation-BaRBqxpK.js";import"./translation-KfvaIrBG.js";const l=({backLinkLabel:t,onClickReturn:o,breadcrumb:O,description:n,subtitle:d,subdescription:c,message:m,content:T,header:u,tabs:x})=>e.jsxs(C,{children:[e.jsx("div",{className:"mb-6",children:O}),u&&e.jsx(a,{...u}),t&&o&&e.jsx(N,{className:"mb-8",onClickReturn:o,label:t,type:I.back}),n&&e.jsx(b,{className:"mb-8",children:n}),m&&e.jsx("div",{className:"mb-8",children:m}),d&&e.jsx(D,{className:"block mb-6",children:d}),c&&e.jsx(b,{className:"mb-8",children:c}),e.jsx("div",{className:"mb-6",children:x}),e.jsx("div",{children:T})]});try{l.displayName="DashboardLayout",l.__docgenInfo={description:"",displayName:"DashboardLayout",props:{breadcrumb:{defaultValue:null,description:"",name:"breadcrumb",required:!1,type:{name:"ReactElement<any, string | JSXElementConstructor<any>>"}},content:{defaultValue:null,description:"",name:"content",required:!1,type:{name:"ReactElement<any, string | JSXElementConstructor<any>>"}},header:{defaultValue:null,description:"",name:"header",required:!1,type:{name:"HeadersProps"}},message:{defaultValue:null,description:"",name:"message",required:!1,type:{name:"ReactElement<any, string | JSXElementConstructor<any>>"}},description:{defaultValue:null,description:"",name:"description",required:!1,type:{name:"string"}},subtitle:{defaultValue:null,description:"",name:"subtitle",required:!1,type:{name:"string"}},subdescription:{defaultValue:null,description:"",name:"subdescription",required:!1,type:{name:"string"}},backLinkLabel:{defaultValue:null,description:"",name:"backLinkLabel",required:!1,type:{name:"string"}},tabs:{defaultValue:null,description:"",name:"tabs",required:!1,type:{name:"ReactElement<any, string | JSXElementConstructor<any>>"}},onClickReturn:{defaultValue:null,description:"",name:"onClickReturn",required:!1,type:{name:"() => void"}}}}}catch{}const q=[{id:1,href:"https://www.ovh.com",target:p._blank,label:"ovh.com"},{id:2,href:"https://help.ovhcloud.com/csm/fr-documentation?id=kb_home",target:p._blank,label:"Guides OVH"}],s={header:{title:"Vrack Services",headerButton:e.jsx(V,{items:q})},description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",message:e.jsx(j,{icon:E.SUCCESS_CIRCLE,removable:!0,className:"w-full",color:_.success,children:"Votre service a été créé avec succès"}),subtitle:"Lorem ipsum",backLinkLabel:"Retour à la XXX",onClickReturn:()=>{console.log("back link click")},subdescription:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia rutrum interdum. Nullam tempor, mi eu imperdiet scelerisque, lorem nisl blandit ligula, eget sodales erat nulla a odio. Donec efficitur posuere quam. Maecenas metus sem, venenatis id mattis eget, sollicitudin sit amet nulla. Sed ac erat fermentum, porta ligula ac,",tabs:e.jsxs(e.Fragment,{children:[e.jsx(v,{children:e.jsxs(y,{slot:"top",children:[e.jsx(r,{panel:"tab1",role:"tab",children:"Tabs 1"}),e.jsx(r,{panel:"tab2",role:"tab",children:"Tabs 2"}),e.jsx(r,{panel:"tab3",role:"tab",children:"Tabs 3"})]})}),e.jsx(k,{separator:!0,size:L.zero})]}),content:e.jsxs(R,{children:[e.jsx(i,{rounded:!0,children:e.jsx("span",{slot:"start",children:e.jsx(a,{subtitle:"Tile 1"})})}),e.jsx(i,{rounded:!0,children:e.jsx("span",{slot:"start",children:e.jsx(a,{subtitle:"Tile 2"})})}),e.jsx(i,{rounded:!0,children:e.jsx("span",{slot:"start",children:e.jsx(a,{subtitle:"Tile 3"})})})]}),breadcrumb:e.jsx(S,{className:"flex-start",items:[{label:"vRack Services",href:"/vrack-services"},{label:"vrs-abc-def-ghi",href:"/vrs-abc-def-ghi"}]})},se={title:"Templates/Dashboard (deprecated)",component:l,argTypes:{},args:s};var f,h,g;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
  header: {
    title: 'Vrack Services',
    headerButton: <GuideButton items={guideItems} />
  },
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  message: <OsdsMessage icon={ODS_ICON_NAME.SUCCESS_CIRCLE} removable className="w-full" color={ODS_THEME_COLOR_INTENT.success}>
      Votre service a été créé avec succès
    </OsdsMessage>,
  subtitle: 'Lorem ipsum',
  backLinkLabel: 'Retour à la XXX',
  onClickReturn: () => {
    console.log('back link click');
  },
  subdescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia rutrum interdum. Nullam tempor, mi eu imperdiet scelerisque, lorem nisl blandit ligula, eget sodales erat nulla a odio. Donec efficitur posuere quam. Maecenas metus sem, venenatis id mattis eget, sollicitudin sit amet nulla. Sed ac erat fermentum, porta ligula ac,',
  tabs: <>
      <OsdsTabs>
        <OsdsTabBar slot="top">
          <OsdsTabBarItem panel="tab1" role="tab">
            Tabs 1
          </OsdsTabBarItem>
          <OsdsTabBarItem panel="tab2" role="tab">
            Tabs 2
          </OsdsTabBarItem>
          <OsdsTabBarItem panel="tab3" role="tab">
            Tabs 3
          </OsdsTabBarItem>
        </OsdsTabBar>
      </OsdsTabs>
      <OsdsDivider separator size={ODS_DIVIDER_SIZE.zero} />
    </>,
  content: <DashboardGridLayout>
      <OsdsTile rounded>
        <span slot="start">
          <Headers subtitle="Tile 1" />
        </span>
      </OsdsTile>
      <OsdsTile rounded>
        <span slot="start">
          <Headers subtitle="Tile 2" />
        </span>
      </OsdsTile>
      <OsdsTile rounded>
        <span slot="start">
          <Headers subtitle="Tile 3" />
        </span>
      </OsdsTile>
    </DashboardGridLayout>,
  breadcrumb: <OsdsBreadcrumb className="flex-start" items={[{
    label: 'vRack Services',
    href: '/vrack-services'
  }, {
    label: 'vrs-abc-def-ghi',
    href: '/vrs-abc-def-ghi'
  }]} />
}`,...(g=(h=s.parameters)==null?void 0:h.docs)==null?void 0:g.source}}};const ae=["defaultProps"];export{ae as __namedExportsOrder,se as default,s as defaultProps};
//# sourceMappingURL=dashboard.stories-BvZAX_t8.js.map
