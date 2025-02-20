import{j as e}from"./jsx-runtime-CKrituN3.js";import{r as D}from"./index-CBqU2yxZ.js";import{O as r,i as _,b,a as o}from"./index-D2Jq8zTl.js";import{g as u,h as L}from"./index-WQl7iQZP.js";import{A as v}from"./action.component-DGYCvoWT.js";import{C as y}from"./clipboard.component-DWGJzeGy.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-BtM5VmRH.js";import"./translation-B2O9Cdu4.js";import"./i18next-ihUiNgJT.js";import"./ManagerButton-BDe_LZgY.js";import"./useOvhIam-puHWDhg2.js";import"./QueryClientProvider-DWOoNJcY.js";import"./useTranslation-pmbu4BU3.js";const n=({children:i})=>e.jsx("dl",{className:"flex flex-col gap-1 m-0",children:i}),f=({children:i})=>e.jsx("dt",{children:e.jsx(r,{preset:u.heading6,children:i})}),C=({children:i})=>e.jsx("dd",{className:"m-0",children:i});n.Label=f;n.Description=C;try{n.displayName="ManagerTileItem",n.__docgenInfo={description:"",displayName:"ManagerTileItem",props:{}}}catch{}try{n.Label.displayName="ManagerTileItem.Label",n.Label.__docgenInfo={description:"",displayName:"ManagerTileItem.Label",props:{}}}catch{}try{n.Description.displayName="ManagerTileItem.Description",n.Description.__docgenInfo={description:"",displayName:"ManagerTileItem.Description",props:{}}}catch{}const a=({className:i,children:j,...h})=>e.jsx(_,{className:`w-full flex-col p-[1rem] ${i}`,color:L.neutral,...h,children:e.jsx("div",{className:"flex flex-col w-full",children:j})}),N=({children:i})=>e.jsx(r,{preset:u.heading4,children:i}),O=()=>e.jsx(b,{spacing:"24"});a.Title=N;a.Item=n;a.Divider=O;try{a.displayName="ManagerTile",a.__docgenInfo={description:"",displayName:"ManagerTile",props:{}}}catch{}try{a.Title.displayName="ManagerTile.Title",a.Title.__docgenInfo={description:"",displayName:"ManagerTile.Title",props:{}}}catch{}try{a.Item.displayName="ManagerTile.Item",a.Item.__docgenInfo={description:"",displayName:"ManagerTile.Item",props:{}}}catch{}const E=[{id:1,href:"https://ovhcloud.com",label:"Action 1"},{id:2,onClick:()=>window.open("https://ovhcloud.com","_blank","noopener"),label:"Action 2"}],t=()=>(D.useId(),e.jsxs(a,{children:[e.jsx(a.Title,{children:"Complete example"}),e.jsx(a.Divider,{}),e.jsxs(a.Item,{children:[e.jsx(a.Item.Label,{children:"Component Example"}),e.jsx(a.Item.Description,{children:e.jsx(r,{preset:"span",children:"Test Value"})})]}),e.jsx(a.Divider,{}),e.jsxs(a.Item,{children:[e.jsx(a.Item.Label,{children:"Long Text"}),e.jsx(a.Item.Description,{children:e.jsx(r,{preset:"paragraph",children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."})})]}),e.jsx(a.Divider,{}),e.jsxs(a.Item,{children:[e.jsx(a.Item.Label,{children:"Loading"}),e.jsx(a.Item.Description,{children:e.jsx(o,{})})]}),e.jsx(a.Divider,{}),e.jsxs(a.Item,{children:[e.jsx(a.Item.Label,{children:"Clipboard"}),e.jsx(a.Item.Description,{children:e.jsx(y,{className:"w-full",value:"example value"})})]}),e.jsx(a.Divider,{}),e.jsxs(a.Item,{children:[e.jsx(a.Item.Label,{children:"Menu Example"}),e.jsx(a.Item.Description,{children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(r,{preset:"span",children:"Test Value"}),e.jsx(v,{isCompact:!0,items:E,id:"action-menu-story"})]})})]})]})),l=()=>e.jsxs(a,{children:[e.jsx(a.Title,{children:"Sample example with title"}),e.jsx(a.Divider,{}),e.jsxs(a.Item,{children:[e.jsx(a.Item.Label,{children:"Component Example"}),e.jsx(a.Item.Description,{children:"Test"})]}),e.jsx(a.Divider,{}),e.jsxs(a.Item,{children:[e.jsx(a.Item.Label,{children:"Loading"}),e.jsx(a.Item.Description,{children:e.jsx(o,{})})]})]}),s=()=>e.jsxs(a,{children:[e.jsxs(a.Item,{children:[e.jsx(a.Item.Label,{children:"Component Example"}),e.jsx(a.Item.Description,{children:"Test"})]}),e.jsx(a.Divider,{}),e.jsxs(a.Item,{children:[e.jsx(a.Item.Label,{children:"Loading"}),e.jsx(a.Item.Description,{children:e.jsx(o,{})})]})]}),F={title:"Content/Manager Tile",component:a,argTypes:{},args:{}};var m,c,p;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`() => {
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
}`,...(p=(c=t.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};var d,T,g;l.parameters={...l.parameters,docs:{...(d=l.parameters)==null?void 0:d.docs,source:{originalSource:`() => <ManagerTile>
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
  </ManagerTile>`,...(g=(T=l.parameters)==null?void 0:T.docs)==null?void 0:g.source}}};var I,x,M;s.parameters={...s.parameters,docs:{...(I=s.parameters)==null?void 0:I.docs,source:{originalSource:`() => <ManagerTile>
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
  </ManagerTile>`,...(M=(x=s.parameters)==null?void 0:x.docs)==null?void 0:M.source}}};const G=["CompleteExample","SimpleExampleWithTitle","NoTitle"];export{t as CompleteExample,s as NoTitle,l as SimpleExampleWithTitle,G as __namedExportsOrder,F as default};
