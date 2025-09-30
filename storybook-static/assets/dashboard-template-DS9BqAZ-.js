import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as t}from"./index-D_1QkM3g.js";import{M as r}from"./index-26vOBqU-.js";import"./index-Bnop-kX6.js";import"./iframe-BboHc1zZ.js";import"./index-D0sJu8id.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";const o=""+new URL("dashboard-overview-Bh16JMmx.png",import.meta.url).href;function s(a){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...t(),...a.components};return e.jsxs(e.Fragment,{children:[e.jsx(r,{title:"Guidelines/React Templates/Dashboard page"}),`
`,e.jsx(n.h1,{id:"how-to-add-dashboard-page",children:"How to add Dashboard Page"}),`
`,e.jsx(n.p,{children:"The Dashboard page is a React component that provides an overview of your service's key metrics and status."}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"💡 Good to know"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"Dashboard"})," is already implemented in the ",e.jsx(n.a,{href:"https://github.com/ovh/manager/tree/master/packages/manager/core/generator",rel:"nofollow",children:e.jsx(n.code,{children:"generator"})})," by default, you just have to add and update some part of the code"]}),`
`]}),`
`,e.jsx("img",{src:o,alt:"Sample Dashboard Page"}),`
`,e.jsx(n.h2,{id:"-as-a-developer",children:"👨‍💻 As a developer"}),`
`,e.jsxs(n.p,{children:["When you generate a project, you have to choose your ",e.jsx(n.strong,{children:"dashboard endpoint"}),", its mainly ",e.jsx(n.code,{children:"/mainEndpoint/{id}"}),"."]}),`
`,e.jsxs(n.p,{children:["Once the project generated, in the apps folder, you will find ",e.jsx(n.code,{children:"src/pages/dashboard/index.tsx"})," file."]}),`
`,e.jsx(n.p,{children:"You have a default dashboard template that display base template with default card tile."}),`
`,e.jsx(n.h2,{id:"main-components",children:"Main Components"}),`
`,e.jsx(n.h3,{id:"baselayout",children:"BaseLayout"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Uses the same ",e.jsx(n.code,{children:"baseLayout"})," component from ",e.jsx(n.code,{children:"manager-react-components"})]}),`
`,e.jsx(n.li,{children:"Displays service overview and key metrics"}),`
`,e.jsx(n.li,{children:"Supports custom widgets and charts"}),`
`]}),`
`,e.jsx(n.h3,{id:"key-features",children:"Key Features"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Service Status"}),": Display current service state"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Quick Actions"}),": Common service operations"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Resource Usage"}),": Display resource consumption"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Message"}),": Show important notifications"]}),`
`]}),`
`,e.jsx(n.h3,{id:"implementation-recommandations-example",children:"Implementation Recommandations Example"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`// Dashboard.tsx
  const tabsList = [
    {
      name: 'general_informations',
      title: 'Informations générales',
      to: useResolvedPath('').pathname,
    },
    {
      name: 'Tab 2',
      title: 'Tab 2',
      to: useResolvedPath('Tab2').pathname,
    },
  ];

  return (
    <BaseLayout
      header={{
        title: t('dashboard.title'),
        description: t('dashboard.description'),
      }}
      tabs={
        <OsdsTabs panel={panel}>
          <OsdsTabBar slot="top">
            {tabsList.map((tab: DashboardTabItemProps) => (
              <NavLink key={tab.name} to={tab.to} className="no-underline">
                <OsdsTabBarItem
                  key={\`osds-tab-bar-item-\${tab.name}\`}
                  panel={tab.name}
                >
                  {tab.title}
                </OsdsTabBarItem>
              </NavLink>
            ))}
          </OsdsTabBar>
        </OsdsTabs>
      }
    >
      <Outlet />
    </BaseLayout>
  );
};
`})}),`
`,e.jsx(n.h3,{id:"tabs-outlet",children:"TABS OUTLET"}),`
`,e.jsxs(n.p,{children:["In React Router (v6 and above), the ",e.jsx(n.code,{children:"Outlet"})," component is used to render child routes in a parent route component. It acts as a placeholder where the nested route components will appear."]}),`
`,e.jsx(n.p,{children:"Define your tab paths in the routes.tsx file"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`<Route path={urls.dashboard} Component={DashboardPage}>
  <Route
    path=""
    Component={GeneralInfosPage}
    handle={{
      tracking: {
        pageName: 'dashboard',
        pageType: PageType.dashboard,
      },
    }}
  />
  <Route
    path={urls.tab2}
    Component={Tab2Page}
    handle={{
      tracking: {
        pageName: 'tab2',
        pageType: PageType.dashboard,
      },
    }}
  />
</Route>
`})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.h3,{id:"️-note",children:"⚠️ Note"}),`
`,e.jsxs(n.p,{children:["Tabs outlet can contains ",e.jsx(n.code,{children:"datagrid"})," from ",e.jsx(n.code,{children:"manager-react-components"}),", display data with ",e.jsx(n.code,{children:"chartJS"})," components"]}),`
`]}),`
`,e.jsx(n.h3,{id:"breadcrumb",children:"BREADCRUMB"}),`
`,e.jsxs(n.p,{children:["Import the ",e.jsx(n.code,{children:"Breadcrumb"})," component from ",e.jsx(n.code,{children:"Manager React Components"})," and fill the attributes ",e.jsx(n.code,{children:"breadcrumb"})," of ",e.jsx(n.code,{children:"BaseLayout"})," component."]}),`
`,e.jsx(n.p,{children:"Here an exemple"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { Breadcrumb, BaseLayout } from '@ovh-ux/manager-react-components';

const DashboardPage = () => {
  return (
      return (
        <BaseLayout
          breadcrumb={<Breadcrumb rootLabel={appConfig.rootLabel} appName="{{appName}}" />}
        >
          <Outlet />
        </BaseLayout>
      );
  )
}
`})}),`
`,e.jsx(n.h2,{id:"-tracking-checklist",children:"📊 TRACKING Checklist"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"[ ] TrackPage display tracking on component mount"}),`
`,e.jsx(n.li,{children:"[ ] TrackClick - BaseLayout Headers components links buttons"}),`
`,e.jsx(n.li,{children:"[ ] TrackClick - BackLink Headers"}),`
`,e.jsx(n.li,{children:"[ ] TrackClick - Navigation beetween tabs"}),`
`,e.jsx(n.li,{children:"[ ] TrackClick - Tiles card links"}),`
`,e.jsx(n.li,{children:"[ ] TrackClick - Tiles card action buttons"}),`
`,e.jsx(n.li,{children:"[ ] TrackClick - Datagrid action buttons (if datagrid present in tabs)"}),`
`,e.jsx(n.li,{children:"[ ] TrackClick - Datagrid links button"}),`
`]}),`
`,e.jsx(n.h3,{id:"code-review-checklist",children:"Code Review Checklist"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["[ ] Use ",e.jsx(n.code,{children:"BaseLayout"})," Component from ",e.jsx(n.code,{children:"manager-react-components"})]}),`
`,e.jsxs(n.li,{children:["[ ] API call with ",e.jsx(n.code,{children:"apiClient from"}),"@ovh-ux/manager-core-api`"]}),`
`,e.jsxs(n.li,{children:["[ ] Notifications success/errors",e.jsx(n.code,{children:"in"}),"message` attribute of base layout component"]}),`
`]})]})}function x(a={}){const{wrapper:n}={...t(),...a.components};return n?e.jsx(n,{...a,children:e.jsx(s,{...a})}):s(a)}export{x as default};
