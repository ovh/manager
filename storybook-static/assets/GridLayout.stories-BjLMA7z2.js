import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{y as n,m as i,X as r}from"./lib-D44cvI9Y-BwqRLB_Z.js";import"./index-Bnop-kX6.js";import"./iframe-Bmn67lXx.js";import"./QueryClientProvider-BPX08D6Z.js";import"./with-selector-CbDTc_Tw.js";import"./index-4pTrEEYx.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-B5_veLQO.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./ComboboxControl-sJOkWHeT-DJbuE-Pm.js";import"./ods-react236-aAAP9SXj.js";import"./MessageIcon-yhpEHWAg-CXHPnT2G.js";import"./Divider-THit99OS-BLm7oKDW.js";const g={title:"Manager UI Kit/Components/GridLayout",component:n,tags:["autodocs"],decorators:[t=>e.jsx("div",{children:t()})]},a=[{title:"General Informations",label:"Sample Term",description:"Sample Description"},{title:"Second child",label:"Second child",description:"Sample Description"},{title:"Third child",label:"Third child",description:"Sample Description"}],o=()=>e.jsx(n,{children:a.map(t=>e.jsxs(i.Root,{title:t.title,children:[e.jsxs(i.Item.Root,{children:[e.jsx(i.Item.Term,{label:t.label}),e.jsx(i.Item.Description,{children:e.jsx(r,{children:t.description})})]}),e.jsxs(i.Item.Root,{children:[e.jsx(i.Item.Term,{label:t.label}),e.jsx(i.Item.Description,{children:e.jsx(r,{children:t.description})})]})]}))});var l,m,s;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`() => <GridLayout>
    {DashboardTiles.map(element => <Tile.Root title={element.title}>
        <Tile.Item.Root>
          <Tile.Item.Term label={element.label}></Tile.Item.Term>
          <Tile.Item.Description>
            <Text>{element.description}</Text>
          </Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label={element.label}></Tile.Item.Term>
          <Tile.Item.Description>
            <Text>{element.description}</Text>
          </Tile.Item.Description>
        </Tile.Item.Root>
      </Tile.Root>)}
  </GridLayout>`,...(s=(m=o.parameters)==null?void 0:m.docs)==null?void 0:s.source}}};const L=["Default"];export{o as Default,L as __namedExportsOrder,g as default};
