import{j as e}from"./jsx-runtime-ffb262ed.js";import{h as f,i as g,j as l,g as v,k as O,l as i,m as x}from"./index-f4012327.js";import{O as j}from"./ods-theme-typography-size-da089dcf.js";import{O as o}from"./ods-html-anchor-element-target-69f04948.js";import{g as y}from"./index-12a93a02.js";import{H as r}from"./headers.component-e08aae53.js";import"./price.component-63eaef36.js";import"./card.component-c5745f55.js";import"./description.component-a77d1327.js";import"./title.component-c40ee629.js";import{a as _,L as k}from"./links.component-31fd1d57.js";import{G as N}from"./guide.component-a4deeee1.js";import"./index-76fb7be0.js";import"./_commonjsHelpers-de833af9.js";import"./index-da03a860.js";import"./i18next-65ce221f.js";import"./setPrototypeOf-24bea416.js";import"./useTranslation-756c8576.js";import"./translation-76cc2d7b.js";const d=({children:s})=>e.jsx("div",{className:"m-10",children:s});try{d.displayName="PageLayout",d.__docgenInfo={description:"",displayName:"PageLayout",props:{}}}catch{}const n=({linkProps:s,breadcrumb:p,content:b,onClickReturn:h,header:t,tabs:T})=>e.jsxs(d,{children:[e.jsx("div",{className:"mb-3",children:p}),t&&e.jsx(r,{title:t.title,description:t.description,headerButton:t.headerButton}),s&&e.jsx(_,{onClickReturn:h,href:s.href,label:s.label,target:s.target,type:s.type}),e.jsx("div",{children:T}),e.jsx("div",{className:"mt-8",children:b})]});try{n.displayName="DashboardLayout",n.__docgenInfo={description:"",displayName:"DashboardLayout",props:{breadcrumb:{defaultValue:null,description:"",name:"breadcrumb",required:!1,type:{name:"ReactElement<any, string | JSXElementConstructor<any>>"}},content:{defaultValue:null,description:"",name:"content",required:!1,type:{name:"ReactElement<any, string | JSXElementConstructor<any>>"}},header:{defaultValue:null,description:"",name:"header",required:!1,type:{name:"HeadersProps"}},linkProps:{defaultValue:null,description:"",name:"linkProps",required:!1,type:{name:"LinksProps"}},tabs:{defaultValue:null,description:"",name:"tabs",required:!1,type:{name:"ReactElement<any, string | JSXElementConstructor<any>>"}},onClickReturn:{defaultValue:null,description:"",name:"onClickReturn",required:!1,type:{name:"() => void"}}}}}catch{}const B=[{id:1,href:"https://www.ovh.com",target:o._blank,label:"ovh.com"},{id:2,href:"https://help.ovhcloud.com/csm/fr-documentation?id=kb_home",target:o._blank,label:"Guides OVH"}],a={header:{description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",title:"Vrack Services",headerButton:e.jsx(N,{items:B})},linkProps:{label:"Back to the list",href:"https://www.ovhcloud.com",target:o._blank,type:k.back},tabs:e.jsxs(e.Fragment,{children:[e.jsx(f,{children:e.jsxs(g,{slot:"top",children:[e.jsx(l,{panel:"tab1",role:"tab",children:"Tabs 1"}),e.jsx(l,{panel:"tab2",role:"tab",children:"Tabs 2"}),e.jsx(l,{panel:"tab3",role:"tab",children:"Tabs 3"})]})}),e.jsx(v,{separator:!0,size:y.zero})]}),content:e.jsxs("div",{className:"w-full block",children:[e.jsx("div",{children:e.jsx(O,{removable:!0,className:"mb-5 w-full",color:j.success,children:"Votre service a été créé avec succès"})}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-8",children:[e.jsx("div",{children:e.jsx(i,{rounded:!0,children:e.jsx("span",{slot:"start",children:e.jsx(r,{subtitle:"Tile 1"})})})}),e.jsx(i,{rounded:!0,children:e.jsx("span",{slot:"start",children:e.jsx(r,{subtitle:"Tile 2"})})}),e.jsx(i,{rounded:!0,children:e.jsx("span",{slot:"start",children:e.jsx(r,{subtitle:"Tile 3"})})})]})]}),breadcrumb:e.jsx(x,{className:"flex-start",items:[{label:"Network",href:"/Network"},{label:"vrackServices",href:"/vrackServices"}]})},F={title:"Templates/Dashboard",decorators:[s=>e.jsx("div",{className:"w-4/5",children:s()})],component:n,argTypes:{},args:a};var c,m,u;a.parameters={...a.parameters,docs:{...(c=a.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
}`,...(u=(m=a.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};const K=["defaultProps"];export{K as __namedExportsOrder,F as default,a as defaultProps};
//# sourceMappingURL=dashboard.stories-f938eb3c.js.map
