import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{r as I}from"./index-Bnop-kX6.js";import{O as r,e as l}from"./index-DXhrqGIV.js";import{C as i,f as M,y as u}from"./manager-react-components-lib.es-BsqdnzGX.js";import"./index-D0sJu8id.js";import"./iframe-g35VEYZr.js";import"./QueryClientProvider-DbnhbVMg.js";import"./index-D1HcsAmU.js";import"./context-Cuu9iSAu.js";const h=[{id:1,href:"https://ovhcloud.com",label:"Action 1"},{id:2,onClick:()=>window.open("https://ovhcloud.com","_blank","noopener"),label:"Action 2"}],a=()=>(I.useId(),e.jsxs(i,{children:[e.jsx(i.Title,{children:"Complete example"}),e.jsx(i.Divider,{}),e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{tooltip:"This is a tooltip for the component example",children:"Component Example"}),e.jsx(i.Item.Description,{children:e.jsx(r,{preset:"span",children:"Test Value"})})]}),e.jsx(i.Divider,{}),e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{children:"Long Text"}),e.jsx(i.Item.Description,{children:e.jsx(r,{preset:"paragraph",children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."})})]}),e.jsx(i.Divider,{}),e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{children:"Loading"}),e.jsx(i.Item.Description,{children:e.jsx(l,{})})]}),e.jsx(i.Divider,{}),e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{tooltip:"This is a tooltip for the clipboard example",children:"Clipboard"}),e.jsx(i.Item.Description,{children:e.jsx(M,{className:"w-full",value:"example value"})})]}),e.jsx(i.Divider,{}),e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{children:"Menu Example"}),e.jsx(i.Item.Description,{children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(r,{preset:"span",children:"Test Value"}),e.jsx(u,{isCompact:!0,items:h,id:"action-menu-story"})]})})]})]})),t=()=>e.jsxs(i,{children:[e.jsx(i.Title,{children:"Sample example with title"}),e.jsx(i.Divider,{}),e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{children:"Component Example"}),e.jsx(i.Item.Description,{children:"Test"})]}),e.jsx(i.Divider,{}),e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{children:"Loading"}),e.jsx(i.Item.Description,{children:e.jsx(l,{})})]})]}),n=()=>e.jsxs(i,{children:[e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{children:"Component Example"}),e.jsx(i.Item.Description,{children:"Test"})]}),e.jsx(i.Divider,{}),e.jsxs(i.Item,{children:[e.jsx(i.Item.Label,{children:"Loading"}),e.jsx(i.Item.Description,{children:e.jsx(l,{})})]})]}),S={title:"Manager React Components/Content/Manager Tile",component:i,argTypes:{},args:{}};var s,o,m;a.parameters={...a.parameters,docs:{...(s=a.parameters)==null?void 0:s.docs,source:{originalSource:`() => {
  const id = useId();
  return <ManagerTile>
      <ManagerTile.Title>Complete example</ManagerTile.Title>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label tooltip="This is a tooltip for the component example">
          Component Example
        </ManagerTile.Item.Label>
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
        <ManagerTile.Item.Label tooltip="This is a tooltip for the clipboard example">
          Clipboard
        </ManagerTile.Item.Label>
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
}`,...(m=(o=a.parameters)==null?void 0:o.docs)==null?void 0:m.source}}};var p,c,d;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`() => <ManagerTile>
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
  </ManagerTile>`,...(d=(c=t.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var T,g,x;n.parameters={...n.parameters,docs:{...(T=n.parameters)==null?void 0:T.docs,source:{originalSource:`() => <ManagerTile>
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
  </ManagerTile>`,...(x=(g=n.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};const q=["CompleteExample","SimpleExampleWithTitle","NoTitle"];export{a as CompleteExample,n as NoTitle,t as SimpleExampleWithTitle,q as __namedExportsOrder,S as default};
