import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{r as I}from"./index-Bnop-kX6.js";import{d as r,e as l}from"./index-CbA6Q3A_.js";import{B as a,f as M,v as u}from"./manager-react-components-lib.es-Bp8dJEii.js";import"./index-D0sJu8id.js";import"./ods-toggle2-B9ijeUZX.js";import"./iframe-Co2TkM8X.js";import"./QueryClientProvider-BkgfFh-U.js";import"./index-BA2H_d3W.js";import"./context-BVP_XnaJ.js";const j=[{id:1,href:"https://ovhcloud.com",label:"Action 1"},{id:2,onClick:()=>window.open("https://ovhcloud.com","_blank","noopener"),label:"Action 2"}],i=()=>(I.useId(),e.jsxs(a,{children:[e.jsx(a.Title,{children:"Complete example"}),e.jsx(a.Divider,{}),e.jsxs(a.Item,{children:[e.jsx(a.Item.Label,{children:"Component Example"}),e.jsx(a.Item.Description,{children:e.jsx(r,{preset:"span",children:"Test Value"})})]}),e.jsx(a.Divider,{}),e.jsxs(a.Item,{children:[e.jsx(a.Item.Label,{children:"Long Text"}),e.jsx(a.Item.Description,{children:e.jsx(r,{preset:"paragraph",children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."})})]}),e.jsx(a.Divider,{}),e.jsxs(a.Item,{children:[e.jsx(a.Item.Label,{children:"Loading"}),e.jsx(a.Item.Description,{children:e.jsx(l,{})})]}),e.jsx(a.Divider,{}),e.jsxs(a.Item,{children:[e.jsx(a.Item.Label,{children:"Clipboard"}),e.jsx(a.Item.Description,{children:e.jsx(M,{className:"w-full",value:"example value"})})]}),e.jsx(a.Divider,{}),e.jsxs(a.Item,{children:[e.jsx(a.Item.Label,{children:"Menu Example"}),e.jsx(a.Item.Description,{children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(r,{preset:"span",children:"Test Value"}),e.jsx(u,{isCompact:!0,items:j,id:"action-menu-story"})]})})]})]})),t=()=>e.jsxs(a,{children:[e.jsx(a.Title,{children:"Sample example with title"}),e.jsx(a.Divider,{}),e.jsxs(a.Item,{children:[e.jsx(a.Item.Label,{children:"Component Example"}),e.jsx(a.Item.Description,{children:"Test"})]}),e.jsx(a.Divider,{}),e.jsxs(a.Item,{children:[e.jsx(a.Item.Label,{children:"Loading"}),e.jsx(a.Item.Description,{children:e.jsx(l,{})})]})]}),n=()=>e.jsxs(a,{children:[e.jsxs(a.Item,{children:[e.jsx(a.Item.Label,{children:"Component Example"}),e.jsx(a.Item.Description,{children:"Test"})]}),e.jsx(a.Divider,{}),e.jsxs(a.Item,{children:[e.jsx(a.Item.Label,{children:"Loading"}),e.jsx(a.Item.Description,{children:e.jsx(l,{})})]})]}),q={title:"Manager React Components/Content/Manager Tile",component:a,argTypes:{},args:{}};var s,m,o;i.parameters={...i.parameters,docs:{...(s=i.parameters)==null?void 0:s.docs,source:{originalSource:`() => {
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
}`,...(o=(m=i.parameters)==null?void 0:m.docs)==null?void 0:o.source}}};var c,d,p;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`() => <ManagerTile>
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
  </ManagerTile>`,...(p=(d=t.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};var T,g,x;n.parameters={...n.parameters,docs:{...(T=n.parameters)==null?void 0:T.docs,source:{originalSource:`() => <ManagerTile>
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
  </ManagerTile>`,...(x=(g=n.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};const w=["CompleteExample","SimpleExampleWithTitle","NoTitle"];export{i as CompleteExample,n as NoTitle,t as SimpleExampleWithTitle,w as __namedExportsOrder,q as default};
