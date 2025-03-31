import{j as e}from"./jsx-runtime-CKrituN3.js";import{r as I}from"./index-CBqU2yxZ.js";import{O as r,a as l}from"./index-BoGQ30sD.js";import{M as i}from"./manager-tile.component-C-UOaU8u.js";import{A as M}from"./action.component-DETXVUga.js";import{C as u}from"./clipboard.component-Da3g5HMM.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-BtM5VmRH.js";import"./index-CqmMgYso.js";import"./translation-xx6Js1fi.js";import"./i18next-ihUiNgJT.js";import"./ManagerButton-C8zC-Fyb.js";import"./useOvhIam-puHWDhg2.js";import"./QueryClientProvider-DWOoNJcY.js";import"./useTranslation-pmbu4BU3.js";const j=[{id:1,href:"https://ovhcloud.com",label:"Action 1"},{id:2,onClick:()=>window.open("https://ovhcloud.com","_blank","noopener"),label:"Action 2"}],a=()=>(I.useId(),e.jsxs(i,{children:[e.jsx(i.Title,{children:"Complete example"}),e.jsx(i.Divider,{}),e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{children:"Component Example"}),e.jsx(i.Item.Description,{children:e.jsx(r,{preset:"span",children:"Test Value"})})]}),e.jsx(i.Divider,{}),e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{children:"Long Text"}),e.jsx(i.Item.Description,{children:e.jsx(r,{preset:"paragraph",children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."})})]}),e.jsx(i.Divider,{}),e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{children:"Loading"}),e.jsx(i.Item.Description,{children:e.jsx(l,{})})]}),e.jsx(i.Divider,{}),e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{children:"Clipboard"}),e.jsx(i.Item.Description,{children:e.jsx(u,{className:"w-full",value:"example value"})})]}),e.jsx(i.Divider,{}),e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{children:"Menu Example"}),e.jsx(i.Item.Description,{children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(r,{preset:"span",children:"Test Value"}),e.jsx(M,{isCompact:!0,items:j,id:"action-menu-story"})]})})]})]})),n=()=>e.jsxs(i,{children:[e.jsx(i.Title,{children:"Sample example with title"}),e.jsx(i.Divider,{}),e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{children:"Component Example"}),e.jsx(i.Item.Description,{children:"Test"})]}),e.jsx(i.Divider,{}),e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{children:"Loading"}),e.jsx(i.Item.Description,{children:e.jsx(l,{})})]})]}),t=()=>e.jsxs(i,{children:[e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{children:"Component Example"}),e.jsx(i.Item.Description,{children:"Test"})]}),e.jsx(i.Divider,{}),e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{children:"Loading"}),e.jsx(i.Item.Description,{children:e.jsx(l,{})})]})]}),A={title:"Content/Manager Tile",component:i,argTypes:{},args:{}};var s,m,o;a.parameters={...a.parameters,docs:{...(s=a.parameters)==null?void 0:s.docs,source:{originalSource:`() => {
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
}`,...(o=(m=a.parameters)==null?void 0:m.docs)==null?void 0:o.source}}};var c,p,d;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:`() => <ManagerTile>
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
  </ManagerTile>`,...(d=(p=n.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var T,g,x;t.parameters={...t.parameters,docs:{...(T=t.parameters)==null?void 0:T.docs,source:{originalSource:`() => <ManagerTile>
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
  </ManagerTile>`,...(x=(g=t.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};const V=["CompleteExample","SimpleExampleWithTitle","NoTitle"];export{a as CompleteExample,t as NoTitle,n as SimpleExampleWithTitle,V as __namedExportsOrder,A as default};
