import{j as e}from"./jsx-runtime-ffb262ed.js";import{k as j,l as v,m as L,n as r,h as k,o as i,p as N}from"./index-5babab68.js";import{O as S}from"./ods-theme-typography-size-da089dcf.js";import{O as h}from"./ods-html-anchor-element-target-69f04948.js";import{O as E,h as D}from"./index-4ef86ab6.js";import{H as t}from"./headers.component-33087a26.js";import"./price.component-2f37b4f5.js";import"./card.component-471ca821.js";import{D as f}from"./description.component-6a2b1d94.js";import{S as I}from"./title.component-2d4a8784.js";import{a as C,L as R}from"./links.component-3350f410.js";import{G as V}from"./guide.component-f0900910.js";import"./index-76fb7be0.js";import"./_commonjsHelpers-de833af9.js";import"./index-da03a860.js";import"./i18next-65ce221f.js";import"./setPrototypeOf-24bea416.js";import"./useTranslation-756c8576.js";import"./translation-76cc2d7b.js";const l=({children:s})=>e.jsx("div",{className:"py-8 px-4 md:py-9 md:px-10 md:mt-2",children:s}),o=({children:s})=>e.jsx("div",{className:"w-full block",children:e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6",children:s})});try{l.displayName="PageLayout",l.__docgenInfo={description:"",displayName:"PageLayout",props:{}}}catch{}try{o.displayName="DashboardGridLayout",o.__docgenInfo={description:"",displayName:"DashboardGridLayout",props:{}}}catch{}const d=({backLinkLabel:s,onClickReturn:n,breadcrumb:O,description:c,subtitle:m,subdescription:u,message:p,content:T,header:b,tabs:x})=>e.jsxs(l,{children:[e.jsx("div",{className:"mb-6",children:O}),b&&e.jsx(t,{...b}),s&&n&&e.jsx(C,{className:"mb-8",onClickReturn:n,label:s,type:R.back}),c&&e.jsx(f,{className:"mb-8",children:c}),p&&e.jsx("div",{className:"mb-8",children:p}),m&&e.jsx(I,{className:"block mb-6",children:m}),u&&e.jsx(f,{className:"mb-8",children:u}),e.jsx("div",{className:"mb-6",children:x}),e.jsx("div",{children:T})]});try{d.displayName="DashboardLayout",d.__docgenInfo={description:"",displayName:"DashboardLayout",props:{breadcrumb:{defaultValue:null,description:"",name:"breadcrumb",required:!1,type:{name:"ReactElement<any, string | JSXElementConstructor<any>>"}},content:{defaultValue:null,description:"",name:"content",required:!1,type:{name:"ReactElement<any, string | JSXElementConstructor<any>>"}},header:{defaultValue:null,description:"",name:"header",required:!1,type:{name:"HeadersProps"}},message:{defaultValue:null,description:"",name:"message",required:!1,type:{name:"ReactElement<any, string | JSXElementConstructor<any>>"}},description:{defaultValue:null,description:"",name:"description",required:!1,type:{name:"string"}},subtitle:{defaultValue:null,description:"",name:"subtitle",required:!1,type:{name:"string"}},subdescription:{defaultValue:null,description:"",name:"subdescription",required:!1,type:{name:"string"}},backLinkLabel:{defaultValue:null,description:"",name:"backLinkLabel",required:!1,type:{name:"string"}},tabs:{defaultValue:null,description:"",name:"tabs",required:!1,type:{name:"ReactElement<any, string | JSXElementConstructor<any>>"}},onClickReturn:{defaultValue:null,description:"",name:"onClickReturn",required:!1,type:{name:"() => void"}}}}}catch{}const q=[{id:1,href:"https://www.ovh.com",target:h._blank,label:"ovh.com"},{id:2,href:"https://help.ovhcloud.com/csm/fr-documentation?id=kb_home",target:h._blank,label:"Guides OVH"}],a={header:{title:"Vrack Services",headerButton:e.jsx(V,{items:q})},description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",message:e.jsx(j,{icon:E.SUCCESS_CIRCLE,removable:!0,className:"w-full",color:S.success,children:"Votre service a été créé avec succès"}),subtitle:"Lorem ipsum",backLinkLabel:"Retour à la XXX",onClickReturn:()=>{console.log("back link click")},subdescription:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia rutrum interdum. Nullam tempor, mi eu imperdiet scelerisque, lorem nisl blandit ligula, eget sodales erat nulla a odio. Donec efficitur posuere quam. Maecenas metus sem, venenatis id mattis eget, sollicitudin sit amet nulla. Sed ac erat fermentum, porta ligula ac,",tabs:e.jsxs(e.Fragment,{children:[e.jsx(v,{children:e.jsxs(L,{slot:"top",children:[e.jsx(r,{panel:"tab1",role:"tab",children:"Tabs 1"}),e.jsx(r,{panel:"tab2",role:"tab",children:"Tabs 2"}),e.jsx(r,{panel:"tab3",role:"tab",children:"Tabs 3"})]})}),e.jsx(k,{separator:!0,size:D.zero})]}),content:e.jsxs(o,{children:[e.jsx(i,{rounded:!0,children:e.jsx("span",{slot:"start",children:e.jsx(t,{subtitle:"Tile 1"})})}),e.jsx(i,{rounded:!0,children:e.jsx("span",{slot:"start",children:e.jsx(t,{subtitle:"Tile 2"})})}),e.jsx(i,{rounded:!0,children:e.jsx("span",{slot:"start",children:e.jsx(t,{subtitle:"Tile 3"})})})]}),breadcrumb:e.jsx(N,{className:"flex-start",items:[{label:"vRack Services",href:"/vrack-services"},{label:"vrs-abc-def-ghi",href:"/vrs-abc-def-ghi"}]})},se={title:"Templates/Dashboard",component:d,argTypes:{},args:a};var g,y,_;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
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
}`,...(_=(y=a.parameters)==null?void 0:y.docs)==null?void 0:_.source}}};const ae=["defaultProps"];export{ae as __namedExportsOrder,se as default,a as defaultProps};
//# sourceMappingURL=dashboard.stories-587c0c7f.js.map
