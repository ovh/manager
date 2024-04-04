import{j as e}from"./jsx-runtime-ffb262ed.js";import{k as h,l as T,m as l,n as O,o as v,O as f,p as i,q as x}from"./ods-theme-typography-size-a5dafb29.js";import{O as d}from"./ods-html-anchor-element-target-36ff34f6.js";import{e as g}from"./index-66fe5829.js";import{H as r}from"./headers.component-b0ccc1a0.js";import"./card.component-74ea5d17.js";import"./description.component-1517f6ea.js";import"./title.component-114dd735.js";import{a as j,L as k}from"./links.component-0e857bd4.js";import{G as y}from"./guide.component-fa707b70.js";import"./index-76fb7be0.js";import"./_commonjsHelpers-de833af9.js";import"./index-da03a860.js";import"./i18next-3c403098.js";import"./setPrototypeOf-24bea416.js";import"./useTranslation-553b9ced.js";import"./translation-e18a3ed5.js";const o=({linkProps:s,breadcrumb:u,content:p,header:t,tabs:b})=>e.jsxs("div",{className:"m-8",children:[e.jsx("div",{className:"mb-3",children:u}),t&&e.jsx(r,{title:t.title,description:t.description,headerButton:t.headerButton}),s&&e.jsx(j,{href:s.href,label:s.label,target:s.target,type:s.type}),e.jsx("div",{children:b}),e.jsx("div",{className:"mt-8",children:p})]});try{o.displayName="DashboardLayout",o.__docgenInfo={description:"",displayName:"DashboardLayout",props:{breadcrumb:{defaultValue:null,description:"",name:"breadcrumb",required:!1,type:{name:"ReactElement<any, string | JSXElementConstructor<any>>"}},content:{defaultValue:null,description:"",name:"content",required:!1,type:{name:"ReactElement<any, string | JSXElementConstructor<any>>"}},header:{defaultValue:null,description:"",name:"header",required:!1,type:{name:"HeadersProps"}},linkProps:{defaultValue:null,description:"",name:"linkProps",required:!1,type:{name:"LinksProps"}},tabs:{defaultValue:null,description:"",name:"tabs",required:!1,type:{name:"ReactElement<any, string | JSXElementConstructor<any>>"}}}}}catch{}const _=[{id:1,href:"https://www.ovh.com",target:d._blank,label:"ovh.com"},{id:2,href:"https://help.ovhcloud.com/csm/fr-documentation?id=kb_home",target:d._blank,label:"Guides OVH"}],a={header:{description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",title:"Vrack Services",headerButton:e.jsx(y,{items:_})},linkProps:{label:"Back to the list",href:"https://www.ovhcloud.com",target:d._blank,type:k.back},tabs:e.jsxs(e.Fragment,{children:[e.jsx(h,{children:e.jsxs(T,{slot:"top",children:[e.jsx(l,{panel:"tab1",role:"tab",children:"Tabs 1"}),e.jsx(l,{panel:"tab2",role:"tab",children:"Tabs 2"}),e.jsx(l,{panel:"tab3",role:"tab",children:"Tabs 3"})]})}),e.jsx(O,{separator:!0,size:g.zero})]}),content:e.jsxs("div",{className:"w-full block",children:[e.jsx("div",{children:e.jsx(v,{removable:!0,className:"mb-5 w-full",color:f.success,children:"Votre service a été créé avec succès"})}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-8",children:[e.jsx("div",{children:e.jsx(i,{rounded:!0,children:e.jsx("span",{slot:"start",children:e.jsx(r,{subtitle:"Tile 1"})})})}),e.jsx(i,{rounded:!0,children:e.jsx("span",{slot:"start",children:e.jsx(r,{subtitle:"Tile 2"})})}),e.jsx(i,{rounded:!0,children:e.jsx("span",{slot:"start",children:e.jsx(r,{subtitle:"Tile 3"})})})]})]}),breadcrumb:e.jsx(x,{className:"flex-start",items:[{label:"Network",href:"/Network"},{label:"vrackServices",href:"/vrackServices"}]})},J={title:"Templates/Dashboard",decorators:[s=>e.jsx("div",{className:"w-4/5",children:s()})],component:o,argTypes:{},args:a};var n,c,m;a.parameters={...a.parameters,docs:{...(n=a.parameters)==null?void 0:n.docs,source:{originalSource:`{
  header: {
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    title: 'Vrack Services',
    headerButton: <GuideButton items={guideItems} />
  },
  linkProps: {
    label: 'Back to the list',
    href: 'https://www.ovhcloud.com',
    target: OdsHTMLAnchorElementTarget._blank,
    type: LinkType.back
  },
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
  content: <div className="w-full block">
      <div>
        <OsdsMessage removable className="mb-5 w-full" color={ODS_THEME_COLOR_INTENT.success}>
          Votre service a été créé avec succès
        </OsdsMessage>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <OsdsTile rounded>
            <span slot="start">
              <Headers subtitle="Tile 1" />
            </span>
          </OsdsTile>
        </div>
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
      </div>
    </div>,
  breadcrumb: <OsdsBreadcrumb className="flex-start" items={[{
    label: 'Network',
    href: '/Network'
  }, {
    label: 'vrackServices',
    href: '/vrackServices'
  }]} />
}`,...(m=(c=a.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};const X=["defaultProps"];export{X as __namedExportsOrder,J as default,a as defaultProps};
//# sourceMappingURL=dashboard.stories-4d07e3f9.js.map
