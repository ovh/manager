import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{t as n}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l as r}from"./ods-react60-0db41gCx.js";import{y as b}from"./Link-BWQEuWpd-BuJJSBob.js";import{h as s}from"./Text-CcNd6qQr-FOgQIkhx.js";import{n as f}from"./Badge-YOwwmnsf-BLrISLal.js";import{x as w}from"./Button-BC-ipw2F-4e7GV2_-.js";import{m as S}from"./Skeleton-tM01pV-R-CR0rfR_T.js";import{D as i,$ as L,C as g}from"./lib-CWaID5dp-BsSnuVqJ.js";import"./index-Bnop-kX6.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react94-Bxf0SjVg.js";import"./ods-react61-4lD3hp9p.js";import"./ods-react63-CRCMVrAF.js";import"./ods-react236-aAAP9SXj.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./ods-react65-wKxTpDjY.js";import"./iframe-DvogHFNi.js";import"./index-4pTrEEYx.js";import"./index-DJBc9Vat.js";const v=[{id:1,href:"https://ovhcloud.com",label:"Action 1"},{id:2,onClick:()=>window.open("https://ovhcloud.com","_blank","noopener"),label:"Action 2"}],t=()=>e.jsxs(i.Root,{title:"Sample Tile Header",children:[e.jsxs(i.Item.Root,{children:[e.jsx(i.Item.Term,{label:"Term"}),e.jsx(i.Item.Description,{label:"Description"})]}),e.jsxs(i.Item.Root,{children:[e.jsx(i.Item.Term,{label:"Last Term"}),e.jsx(i.Item.Description,{divider:!1,children:e.jsx(s,{children:"Description without Divider"})})]})]});t.parameters={docs:{source:{code:`<Tile.Root title="Sample Tile Header">
  <Tile.Item.Root>
    <Tile.Item.Term label="Term" />
    <Tile.Item.Description label="Description" />
  </Tile.Item.Root>
  <Tile.Item.Root>
    <Tile.Item.Term label="Last Term" />
    <Tile.Item.Description divider={false}>
      <Text>Description without Divider</Text>
    </Tile.Item.Description>
  </Tile.Item.Root>
</Tile.Root>`}}};const o=()=>e.jsxs(i.Root,{title:"Sample Tile Header",children:[e.jsxs(i.Item.Root,{children:[e.jsx(i.Item.Term,{label:"Term"}),e.jsx(i.Item.Description,{label:"Description"})]}),e.jsxs(i.Item.Root,{children:[e.jsx(i.Item.Term,{label:"Last Term"}),e.jsx(i.Item.Description,{divider:!1,label:"Sample Description"}),e.jsx(i.Item.Description,{children:e.jsxs(b,{href:"https://www.ovhcloud.com",children:["Link ",e.jsx(n,{name:r.externalLink})]})})]})]});o.parameters={docs:{source:{code:`<Tile.Root title="Sample Tile Header">
  <Tile.Item.Root>
    <Tile.Item.Term label="Term" />
    <Tile.Item.Description label="Description" />
  </Tile.Item.Root>
  <Tile.Item.Root>
    <Tile.Item.Term label="Last Term" />
    <Tile.Item.Description divider={false} label="Sample Description" />
    <Tile.Item.Description>
      <Link href="https://www.ovhcloud.com">
        Link <Icon name={ICON_NAME.externalLink} />
      </Link>
    </Tile.Item.Description>
  </Tile.Item.Root>
</Tile.Root>`}}};const l=()=>e.jsxs(i.Root,{title:"Sample Tile Header",children:[e.jsxs(i.Item.Root,{children:[e.jsx(i.Item.Term,{label:"Term",tooltip:"Lorem ipsum dolor sit amet.",actions:e.jsx(L,{id:"action-menu",items:v,isCompact:!0})}),e.jsx(i.Item.Description,{label:"Description"})]}),e.jsxs(i.Item.Root,{children:[e.jsx(i.Item.Term,{label:"Last Term"}),e.jsx(i.Item.Description,{divider:!1,label:"Sample Description"})]})]});l.parameters={docs:{source:{code:`const actionItems = [
  { id: 1, href: 'https://ovhcloud.com', label: 'Action 1' },
  { id: 2, onClick: () => handleAction(), label: 'Action 2' },
];

<Tile.Root title="Sample Tile Header">
  <Tile.Item.Root>
    <Tile.Item.Term
      label="Term"
      tooltip="Lorem ipsum dolor sit amet."
      actions={<ActionMenu id="action-menu" items={actionItems} isCompact />}
    />
    <Tile.Item.Description label="Description" />
  </Tile.Item.Root>
</Tile.Root>`}}};const m=()=>e.jsx("div",{className:"w-1/3",children:e.jsxs(i.Root,{title:"Tile Header",children:[e.jsxs(i.Item.Root,{children:[e.jsx(i.Item.Term,{label:"Sample Term"}),e.jsx(i.Item.Description,{label:"Sample Description"})]}),e.jsxs(i.Item.Root,{children:[e.jsx(i.Item.Term,{label:"Edit Desription",tooltip:"Lorem ipsum dolor sit amet."}),e.jsx(i.Item.Description,{children:e.jsxs("div",{className:"flex justify-between",children:[e.jsx(s,{preset:"span",children:"Sample Description"}),e.jsx(w,{variant:"ghost",size:"xs",children:e.jsx(n,{name:r.pen})})]})})]}),e.jsxs(i.Item.Root,{children:[e.jsx(i.Item.Term,{label:"Long Text"}),e.jsx(i.Item.Description,{children:e.jsx(s,{preset:"paragraph",children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."})})]}),e.jsxs(i.Item.Root,{children:[e.jsx(i.Item.Term,{label:"Item with Description & Link"}),e.jsx(i.Item.Description,{label:"Lorem ipsum dolor sit amet",divider:!1}),e.jsx(i.Item.Description,{children:e.jsxs(b,{href:"https://www.ovhcloud.com",children:["Link ",e.jsx(n,{name:r.externalLink})]})})]}),e.jsxs(i.Item.Root,{children:[e.jsx(i.Item.Term,{label:"Item with Badge"}),e.jsx(i.Item.Description,{children:e.jsx(f,{children:"Coming Soon"})})]}),e.jsxs(i.Item.Root,{children:[e.jsx(i.Item.Term,{label:"Loading"}),e.jsx(i.Item.Description,{children:e.jsx(S,{})})]}),e.jsxs(i.Item.Root,{children:[e.jsx(i.Item.Term,{label:"Clipboard"}),e.jsx(i.Item.Description,{children:e.jsx(g,{className:"w-full",value:"example value"})})]}),e.jsxs(i.Item.Root,{children:[e.jsx(i.Item.Term,{label:"Action Menu",actions:e.jsx(L,{id:"action-menu",isCompact:!0,items:v})}),e.jsx(i.Item.Description,{label:"Test Value",divider:!1})]})]})}),J={title:"Manager UI Kit/Components/Tile",component:i,tags:["autodocs"],argTypes:{},args:{}};var a,c,p;t.parameters={...t.parameters,docs:{...(a=t.parameters)==null?void 0:a.docs,source:{originalSource:`() => <Tile.Root title="Sample Tile Header">
    <Tile.Item.Root>
      <Tile.Item.Term label="Term" />
      <Tile.Item.Description label="Description" />
    </Tile.Item.Root>
    <Tile.Item.Root>
      <Tile.Item.Term label="Last Term" />
      <Tile.Item.Description divider={false}>
        <Text>Description without Divider</Text>
      </Tile.Item.Description>
    </Tile.Item.Root>
  </Tile.Root>`,...(p=(c=t.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};var T,d,I;o.parameters={...o.parameters,docs:{...(T=o.parameters)==null?void 0:T.docs,source:{originalSource:`() => <Tile.Root title="Sample Tile Header">
    <Tile.Item.Root>
      <Tile.Item.Term label="Term" />
      <Tile.Item.Description label="Description" />
    </Tile.Item.Root>
    <Tile.Item.Root>
      <Tile.Item.Term label="Last Term" />
      <Tile.Item.Description divider={false} label="Sample Description" />
      <Tile.Item.Description>
        <Link href="https://www.ovhcloud.com">
          Link <Icon name={ICON_NAME.externalLink} />
        </Link>
      </Tile.Item.Description>
    </Tile.Item.Root>
  </Tile.Root>`,...(I=(d=o.parameters)==null?void 0:d.docs)==null?void 0:I.source}}};var x,u,D;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`() => <Tile.Root title="Sample Tile Header">
    <Tile.Item.Root>
      <Tile.Item.Term label="Term" tooltip="Lorem ipsum dolor sit amet." actions={<ActionMenu id="action-menu" items={actionItems} isCompact />} />
      <Tile.Item.Description label="Description" />
    </Tile.Item.Root>
    <Tile.Item.Root>
      <Tile.Item.Term label="Last Term" />
      <Tile.Item.Description divider={false} label="Sample Description" />
    </Tile.Item.Root>
  </Tile.Root>`,...(D=(u=l.parameters)==null?void 0:u.docs)==null?void 0:D.source}}};var h,R,j;m.parameters={...m.parameters,docs:{...(h=m.parameters)==null?void 0:h.docs,source:{originalSource:`() => {
  return <div className="w-1/3">
      <Tile.Root title="Tile Header">
        <Tile.Item.Root>
          <Tile.Item.Term label="Sample Term" />
          <Tile.Item.Description label="Sample Description" />
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label="Edit Desription" tooltip="Lorem ipsum dolor sit amet." />
          <Tile.Item.Description>
            <div className="flex justify-between">
              <Text preset="span">Sample Description</Text>
              <Button variant="ghost" size="xs">
                <Icon name={ICON_NAME.pen}></Icon>
              </Button>
            </div>
          </Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label="Long Text" />
          <Tile.Item.Description>
            <Text preset="paragraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text>
          </Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label="Item with Description & Link"></Tile.Item.Term>
          <Tile.Item.Description label="Lorem ipsum dolor sit amet" divider={false}></Tile.Item.Description>
          <Tile.Item.Description>
            <Link href="https://www.ovhcloud.com">
              Link <Icon name={ICON_NAME.externalLink} />
            </Link>
          </Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label="Item with Badge"></Tile.Item.Term>
          <Tile.Item.Description>
            <Badge>Coming Soon</Badge>
          </Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label="Loading" />
          <Tile.Item.Description>
            <Skeleton />
          </Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label="Clipboard" />
          <Tile.Item.Description>
            <Clipboard className="w-full" value="example value" />
          </Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label="Action Menu" actions={<ActionMenu id="action-menu" isCompact items={actionItems} />} />
          <Tile.Item.Description label="Test Value" divider={false}></Tile.Item.Description>
        </Tile.Item.Root>
      </Tile.Root>
    </div>;
}`,...(j=(R=m.parameters)==null?void 0:R.docs)==null?void 0:j.source}}};const P=["SimpleTile","TileWithLink","TileWithActionMenuAndTooltip","CompleteExample"];export{m as CompleteExample,t as SimpleTile,l as TileWithActionMenuAndTooltip,o as TileWithLink,P as __namedExportsOrder,J as default};
