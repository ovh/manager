import{j as e}from"./jsx-runtime-CKrituN3.js";import{p as o,l as d,m as t,j as c,k as s}from"./index-uT_2NHma.js";import"./headers.component-DReTF7AR.js";import"./price.component-BpH2oUnl.js";import{D as i}from"./dashboard-tile.component-kEz_wNLe.js";import{i as m}from"./index-CxwElQ7z.js";import{D as u}from"./dashboard.component-BiudiZdD.js";import{G as b}from"./guide.component-DyQQEvHK.js";import{D as p}from"./layout.component-DBLu0Nss.js";import"./index-CBqU2yxZ.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-BtM5VmRH.js";import"./card.component-DoDZdACX.js";import"./title.component-Bx3BQPQH.js";import"./links.component-BFEHhtFX.js";import"./i18next-ihUiNgJT.js";import"./useTranslation-CvcVFFFk.js";import"./translation-CBNwEvwd.js";const v=[{id:1,href:"https://www.ovh.com",target:"_blank",label:"ovh.com"},{id:2,href:"https://help.ovhcloud.com/csm/fr-documentation?id=kb_home",target:"_blank",label:"Guides OVH"}],a={header:{title:"Vrack Services",headerButton:e.jsx(b,{items:v})},description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",message:e.jsx(o,{className:"w-full",color:m.success,children:"Votre service a été créé avec succès"}),subtitle:"Lorem ipsum",backLinkLabel:"Retour à la XXX",onClickReturn:()=>{console.log("back link click")},subdescription:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia rutrum interdum. Nullam tempor, mi eu imperdiet scelerisque, lorem nisl blandit ligula, eget sodales erat nulla a odio. Donec efficitur posuere quam. Maecenas metus sem, venenatis id mattis eget, sollicitudin sit amet nulla. Sed ac erat fermentum, porta ligula ac,",tabs:e.jsxs(d,{children:[e.jsx(t,{id:"tab1",role:"tab",children:"Tabs 1"}),e.jsx(t,{id:"tab2",role:"tab",children:"Tabs 2"}),e.jsx(t,{id:"tab3",role:"tab",children:"Tabs 3"})]}),content:e.jsxs(p,{children:[e.jsx(i,{title:"General info",items:[{id:"1",label:"Name",value:"service anme"},{id:"2",label:"Service ID",value:"xxxx-1299075"},{id:"3",label:"Datacentre location",value:"Madrid"}]},1),e.jsx(i,{title:"Configuration",items:[{id:"1",label:"Quota 1",value:e.jsx("div",{children:"Quota 1"})}]},2),e.jsx(i,{title:"Billing",items:[{id:"1",label:"Creation date",value:"19 Agost 2028"},{id:"2",label:"Next payment",value:"1 January 2029"},{id:"3",label:"Contact",value:"Manager"}]},3)]}),breadcrumb:e.jsxs(c,{children:[e.jsx(s,{href:"/vrack-services",label:"Vrack Services"}),e.jsx(s,{href:"/vrs-abc-def-ghi",label:"vrs-abc-def-ghi"})]})},N={title:"Templates/Dashboard (deprecated)",component:u,argTypes:{},args:a};var r,l,n;a.parameters={...a.parameters,docs:{...(r=a.parameters)==null?void 0:r.docs,source:{originalSource:`{
  header: {
    title: 'Vrack Services',
    headerButton: <GuideButton items={guideItems} />
  },
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  message: <OdsMessage className="w-full" color={ODS_MESSAGE_COLOR.success}>
      Votre service a été créé avec succès
    </OdsMessage>,
  subtitle: 'Lorem ipsum',
  backLinkLabel: 'Retour à la XXX',
  onClickReturn: () => {
    console.log('back link click');
  },
  subdescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia rutrum interdum. Nullam tempor, mi eu imperdiet scelerisque, lorem nisl blandit ligula, eget sodales erat nulla a odio. Donec efficitur posuere quam. Maecenas metus sem, venenatis id mattis eget, sollicitudin sit amet nulla. Sed ac erat fermentum, porta ligula ac,',
  tabs: <OdsTabs>
      <OdsTab id="tab1" role="tab">
        Tabs 1
      </OdsTab>
      <OdsTab id="tab2" role="tab">
        Tabs 2
      </OdsTab>
      <OdsTab id="tab3" role="tab">
        Tabs 3
      </OdsTab>
    </OdsTabs>,
  content: <DashboardGridLayout>
      <DashboardTile key={1} title="General info" items={[{
      id: '1',
      label: 'Name',
      value: 'service anme'
    }, {
      id: '2',
      label: 'Service ID',
      value: 'xxxx-1299075'
    }, {
      id: '3',
      label: 'Datacentre location',
      value: 'Madrid'
    }]} />
      <DashboardTile key={2} title="Configuration" items={[{
      id: '1',
      label: 'Quota 1',
      value: <div>Quota 1</div>
    }]} />
      <DashboardTile key={3} title="Billing" items={[{
      id: '1',
      label: 'Creation date',
      value: '19 Agost 2028'
    }, {
      id: '2',
      label: 'Next payment',
      value: '1 January 2029'
    }, {
      id: '3',
      label: 'Contact',
      value: 'Manager'
    }]} />
    </DashboardGridLayout>,
  breadcrumb: <OdsBreadcrumb>
      <OdsBreadcrumbItem href="/vrack-services" label="Vrack Services" />
      <OdsBreadcrumbItem href="/vrs-abc-def-ghi" label="vrs-abc-def-ghi" />
    </OdsBreadcrumb>
}`,...(n=(l=a.parameters)==null?void 0:l.docs)==null?void 0:n.source}}};const I=["defaultProps"];export{I as __namedExportsOrder,N as default,a as defaultProps};
