import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{X as m,F as i,Q as l}from"./lib-CKnpYlbA-djy7yrp4.js";import"./index-Bnop-kX6.js";import"./iframe-CWlwMVn9.js";import"./index-4pTrEEYx.js";import"./index-GPs4uoxI.js";const h={title:"Manager UI Kit/Components/GridLayout",component:m,tags:["autodocs"],decorators:[t=>e.jsx("div",{children:t()})]},a=[{title:"General Informations",label:"Sample Term",description:"Sample Description"},{title:"Second child",label:"Second child",description:"Sample Description"},{title:"Third child",label:"Third child",description:"Sample Description"}],o=()=>e.jsx(m,{children:a.map(t=>e.jsxs(i.Root,{title:t.title,children:[e.jsxs(i.Item.Root,{children:[e.jsx(i.Item.Term,{label:t.label}),e.jsx(i.Item.Description,{children:e.jsx(l,{children:t.description})})]}),e.jsxs(i.Item.Root,{children:[e.jsx(i.Item.Term,{label:t.label}),e.jsx(i.Item.Description,{children:e.jsx(l,{children:t.description})})]})]}))});var r,s,n;o.parameters={...o.parameters,docs:{...(r=o.parameters)==null?void 0:r.docs,source:{originalSource:`() => <GridLayout>
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
  </GridLayout>`,...(n=(s=o.parameters)==null?void 0:s.docs)==null?void 0:n.source}}};const b=["Default"];export{o as Default,b as __namedExportsOrder,h as default};
