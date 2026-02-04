import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{k as m,S as i,X as r}from"./lib-7WI39Bnb-B8YmdMzd.js";import"./index-Bnop-kX6.js";import"./iframe-COCNz2cq.js";import"./QueryClientProvider-BPX08D6Z.js";import"./index-DnqQo6oJ.js";import"./index-4pTrEEYx.js";import"./Icon-xxQ9IRzi-ORI6lMWl.js";import"./index-CWkFp9WS-BSIT86NH.js";import"./Link-TMoA1i18-DiBAU0SL.js";import"./Text-BGoUCJU7-BjFZdlzU.js";import"./ComboboxControl-EYkaEIlI-CWYTos8A.js";import"./Divider-wQyo85oE-5vlIiwia.js";const f={title:"Manager UI Kit/Components/GridLayout",component:m,tags:["autodocs"],decorators:[t=>e.jsx("div",{children:t()})]},a=[{title:"General Informations",label:"Sample Term",description:"Sample Description"},{title:"Second child",label:"Second child",description:"Sample Description"},{title:"Third child",label:"Third child",description:"Sample Description"}],o=()=>e.jsx(m,{children:a.map(t=>e.jsxs(i.Root,{title:t.title,children:[e.jsxs(i.Item.Root,{children:[e.jsx(i.Item.Term,{label:t.label}),e.jsx(i.Item.Description,{children:e.jsx(r,{children:t.description})})]}),e.jsxs(i.Item.Root,{children:[e.jsx(i.Item.Term,{label:t.label}),e.jsx(i.Item.Description,{children:e.jsx(r,{children:t.description})})]})]}))});var l,s,n;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`() => <GridLayout>
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
  </GridLayout>`,...(n=(s=o.parameters)==null?void 0:s.docs)==null?void 0:n.source}}};const G=["Default"];export{o as Default,G as __namedExportsOrder,f as default};
