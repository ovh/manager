import{j as e}from"./jsx-runtime-CKrituN3.js";import{R as n}from"./index-CBqU2yxZ.js";import{h as c,i}from"./index-uT_2NHma.js";import{h as p}from"./index-CxwElQ7z.js";const s=({label:l,children:a})=>e.jsxs("dl",{className:"flex flex-col gap-y-[8px] my-0",children:[e.jsx("dt",{className:"tile-block-title m-0 text-[--ods-color-heading] text-[16px] leading-[16px] font-semibold",children:l}),e.jsx("dd",{className:"tile-block-description m-0 text-[--ods-color-text] text-[16px] leading-[16px] min-h-[16px]",children:a})]});try{s.displayName="TileBlock",s.__docgenInfo={description:"",displayName:"TileBlock",props:{label:{defaultValue:null,description:"",name:"label",required:!1,type:{name:"string"}}}}}catch{}const d=({title:l,items:a,...r})=>e.jsx(c,{"data-testid":r["data-testid"],className:"w-full flex-col p-[1rem]",color:p.neutral,children:e.jsxs("div",{className:"flex flex-col w-full",children:[l&&e.jsxs(e.Fragment,{children:[e.jsx("h4",{className:"dashboard-tile-title m-0 text-[--ods-color-heading] text-[20px] leading-[28px] font-bold",children:l}),e.jsx(i,{spacing:"24"})]}),a.map((t,o)=>e.jsxs(n.Fragment,{children:[e.jsx(s,{label:t.label,children:t.value},t.id),o<a.length-1&&e.jsx(i,{spacing:"24"})]},t.id))]})});try{d.displayName="DashboardTile",d.__docgenInfo={description:"",displayName:"DashboardTile",props:{title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string"}},items:{defaultValue:null,description:"",name:"items",required:!0,type:{name:"DashboardTileBlockItem[]"}},"data-testid":{defaultValue:null,description:"",name:"data-testid",required:!1,type:{name:"string"}}}}}catch{}export{d as D};
