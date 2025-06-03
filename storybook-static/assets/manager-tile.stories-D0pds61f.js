import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{r as I}from"./index-Bnop-kX6.js";import{O as n,a as l}from"./index-CNSIveXf.js";import{c as i,A as M}from"./ManagerButton-Pd_Pxp79.js";import{C as u}from"./clipboard.component-CmhF-xNN.js";import"./index-4pTrEEYx.js";import"./ods-toggle2-BJ1toRrr.js";import"./i18next-6HYnolD1.js";import"./QueryClientProvider-DAxw80nV.js";import"./useOvhTracking-Cqpl1sX8.js";import"./index-CwE47CCN.js";import"./index-D-q5QNgV.js";import"./Step.component-Bds2cN4H.js";import"./clsx-B-dksMZM.js";import"./v4-CQkTLCs1.js";import"./Tabs.component-C_dEyA9f.js";import"./TilesInput.component-C_qU074F.js";import"./card.component-BToc7KuX.js";import"./title.component-ucIeg-_K.js";import"./links.component-DnFRtS4w.js";import"./useTranslation-DQ7TG6Ul.js";import"./context-BG98Yt4t.js";import"./price.component-CleweYwa.js";import"./translation-DkLW9Uck.js";import"./guide.component-Bw7Cznhp.js";import"./changelog.component-bWd8ittI.js";import"./error.component-Mbm_PMBt.js";import"./error-boundary.component-CFspuVW9.js";import"./delete-modal.component-4eOUWoLS.js";import"./click-utils-ByCElPrV.js";import"./update-name-modal.component-BuaziZw6.js";import"./notifications.component-BC7nyudf.js";import"./PciMaintenanceBanner.component-CFf6hjH_.js";import"./region.component-7C7sLsDi.js";import"./Order.component-DWsKGSo7.js";import"./badge.component-WpuLrKbO.js";import"./Modal.component-BFD3_SRS.js";import"./tags-list.component-Cd9H7A1G.js";const j=[{id:1,href:"https://ovhcloud.com",label:"Action 1"},{id:2,onClick:()=>window.open("https://ovhcloud.com","_blank","noopener"),label:"Action 2"}],a=()=>(I.useId(),e.jsxs(i,{children:[e.jsx(i.Title,{children:"Complete example"}),e.jsx(i.Divider,{}),e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{children:"Component Example"}),e.jsx(i.Item.Description,{children:e.jsx(n,{preset:"span",children:"Test Value"})})]}),e.jsx(i.Divider,{}),e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{children:"Long Text"}),e.jsx(i.Item.Description,{children:e.jsx(n,{preset:"paragraph",children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."})})]}),e.jsx(i.Divider,{}),e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{children:"Loading"}),e.jsx(i.Item.Description,{children:e.jsx(l,{})})]}),e.jsx(i.Divider,{}),e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{children:"Clipboard"}),e.jsx(i.Item.Description,{children:e.jsx(u,{className:"w-full",value:"example value"})})]}),e.jsx(i.Divider,{}),e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{children:"Menu Example"}),e.jsx(i.Item.Description,{children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(n,{preset:"span",children:"Test Value"}),e.jsx(M,{isCompact:!0,items:j,id:"action-menu-story"})]})})]})]})),t=()=>e.jsxs(i,{children:[e.jsx(i.Title,{children:"Sample example with title"}),e.jsx(i.Divider,{}),e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{children:"Component Example"}),e.jsx(i.Item.Description,{children:"Test"})]}),e.jsx(i.Divider,{}),e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{children:"Loading"}),e.jsx(i.Item.Description,{children:e.jsx(l,{})})]})]}),r=()=>e.jsxs(i,{children:[e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{children:"Component Example"}),e.jsx(i.Item.Description,{children:"Test"})]}),e.jsx(i.Divider,{}),e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{children:"Loading"}),e.jsx(i.Item.Description,{children:e.jsx(l,{})})]})]}),re={title:"Content/Manager Tile",component:i,argTypes:{},args:{}};var m,s,o;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`() => {
  const id = useId();
  return <ManagerTile>
      <ManagerTile.Title>Complete example</ManagerTile.Title>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>Component Example</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <OdsText preset="span">Test Value</OdsText>
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>Long Text</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <OdsText preset="paragraph">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </OdsText>
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>Loading</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <OdsSkeleton />
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>Clipboard</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <Clipboard className="w-full" value="example value" />
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>Menu Example</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <div className="flex items-center justify-between">
            <OdsText preset="span">Test Value</OdsText>
            <ActionMenu isCompact items={actionItems} id={'action-menu-story'} />
          </div>
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
    </ManagerTile>;
}`,...(o=(s=a.parameters)==null?void 0:s.docs)==null?void 0:o.source}}};var p,c,d;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`() => <ManagerTile>
    <ManagerTile.Title>Sample example with title</ManagerTile.Title>
    <ManagerTile.Divider />
    <ManagerTile.Item>
      <ManagerTile.Item.Label>Component Example</ManagerTile.Item.Label>
      <ManagerTile.Item.Description>Test</ManagerTile.Item.Description>
    </ManagerTile.Item>
    <ManagerTile.Divider />
    <ManagerTile.Item>
      <ManagerTile.Item.Label>Loading</ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        <OdsSkeleton />
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  </ManagerTile>`,...(d=(c=t.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var T,g,x;r.parameters={...r.parameters,docs:{...(T=r.parameters)==null?void 0:T.docs,source:{originalSource:`() => <ManagerTile>
    <ManagerTile.Item>
      <ManagerTile.Item.Label>Component Example</ManagerTile.Item.Label>
      <ManagerTile.Item.Description>Test</ManagerTile.Item.Description>
    </ManagerTile.Item>
    <ManagerTile.Divider />
    <ManagerTile.Item>
      <ManagerTile.Item.Label>Loading</ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        <OdsSkeleton />
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  </ManagerTile>`,...(x=(g=r.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};const ne=["CompleteExample","SimpleExampleWithTitle","NoTitle"];export{a as CompleteExample,r as NoTitle,t as SimpleExampleWithTitle,ne as __namedExportsOrder,re as default};
