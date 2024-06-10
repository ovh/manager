import{j as e}from"./jsx-runtime-ffb262ed.js";import{e as i,O as u,a as n,b as y,d}from"./index-9bd3787b.js";import{g as m,O as l,d as h,a as c,b as N,c as T}from"./index-bfec29a3.js";import{O as s}from"./ods-theme-typography-size-da089dcf.js";import"./index-76fb7be0.js";import"./_commonjsHelpers-de833af9.js";import"./index-da03a860.js";const f="_table_1nm7r_1",j={table:f},o=({children:t,fullWidth:a=!1,cellSpacing:O=0})=>e.jsx("table",{className:`${j.table} ${a?"w-full":""}`,cellSpacing:O,children:t});try{o.displayName="Table",o.__docgenInfo={description:"",displayName:"Table",props:{fullWidth:{defaultValue:{value:"false"},description:"",name:"fullWidth",required:!1,type:{name:"boolean"}},cellSpacing:{defaultValue:{value:"0"},description:"",name:"cellSpacing",required:!1,type:{name:"number"}}}}}catch{}const b=[{header:"First Name",accessoryKey:"firstName"},{header:"Last Name",accessoryKey:"lastName"},{header:"Genre",accessoryKey:"genre"},{header:"Role",accessoryKey:"role"},{header:"Date Of Birth",accessoryKey:"birth"}],E=[{firstName:"Kylian",lastName:"Mbappe",genre:"Male",role:"AG",birth:"20/12/1991"},{firstName:"Stephane",lastName:"Curry",genre:"Male",role:"MO",birth:"14/03/1988"},{firstName:"Zinedine",lastName:"Zidane",genre:"Male",role:"MO",birth:"23/06/1972"}],S=()=>e.jsxs(u,{className:"absolute ml-[-15px] mt-[-15px]",children:[e.jsx(n,{slot:"menu-title",inline:!0,circle:!0,color:s.info,variant:l.stroked,type:h.button,size:c.sm,children:e.jsx(y,{color:s.primary,name:N.ELLIPSIS,size:T.xs})}),e.jsx(d,{children:e.jsx(n,{color:s.primary,size:c.sm,variant:l.ghost,"text-align":"start",children:e.jsx("span",{slot:"start",children:e.jsx("span",{children:"Manager"})})})}),e.jsx(d,{children:e.jsx(n,{type:h.button,size:c.sm,color:s.error,variant:l.ghost,"text-align":"start",class:"hydrated",children:e.jsx("span",{slot:"start",children:e.jsx("span",{children:"Supprimer"})})})})]}),r={fullWidth:!0,children:e.jsxs(e.Fragment,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[b.map(t=>e.jsx("th",{className:"text-center",children:e.jsx(i,{color:s.text,size:m._500,children:t.header})},t.accessoryKey)),e.jsx("th",{children:e.jsx(i,{color:s.text,size:m._500,children:"Button"})})]})}),e.jsx("tbody",{children:E.map(t=>e.jsxs("tr",{children:[Object.keys(t).map(a=>e.jsx("td",{className:"text-center",children:t[a]},`${t[a]}-${t[a].firstName}`)),e.jsx("td",{className:"text-center",children:e.jsx(S,{})},`${t.firstName}-actions`)]},`${t.firstName}-tr`))})]})},z={title:"Components/Table",decorators:[t=>e.jsx("div",{children:t()})],component:o,args:r};var p,x,_;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`{
  fullWidth: true,
  children: <>
      <thead>
        <tr>
          {mockColumns.map(header => <th key={header.accessoryKey} className="text-center">
              <OsdsText color={ODS_THEME_COLOR_INTENT.text} size={ODS_TEXT_SIZE._500}>
                {header.header}
              </OsdsText>
            </th>)}
          <th>
            <OsdsText color={ODS_THEME_COLOR_INTENT.text} size={ODS_TEXT_SIZE._500}>
              Button
            </OsdsText>
          </th>
        </tr>
      </thead>
      <tbody>
        {mocksData.map(header => <tr key={\`\${header.firstName}-tr\`}>
            {Object.keys(header).map(element => <td key={\`\${header[element]}-\${header[element].firstName}\`} className="text-center">
                {header[element]}
              </td>)}
            <td key={\`\${header.firstName}-actions\`} className="text-center">
              <DisplayCellMenu />
            </td>
          </tr>)}
      </tbody>
    </>
}`,...(_=(x=r.parameters)==null?void 0:x.docs)==null?void 0:_.source}}};const K=["defaultProps"];export{K as __namedExportsOrder,z as default,r as defaultProps};
//# sourceMappingURL=table.stories-b0665988.js.map
