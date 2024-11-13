import{j as e}from"./jsx-runtime-CKrituN3.js";import{c as d,O as r,d as m}from"./index-DWFHwCPM.js";import{O as n,b as h,c as i}from"./index-Q-VytQcI.js";import{T as p}from"./table.component-B3lWnOR0.js";import"./index-CBqU2yxZ.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-BtM5VmRH.js";const x=[{header:"First Name",accessoryKey:"firstName"},{header:"Last Name",accessoryKey:"lastName"},{header:"Genre",accessoryKey:"genre"},{header:"Role",accessoryKey:"role"},{header:"Date Of Birth",accessoryKey:"birth"}],y=[{firstName:"Kylian",lastName:"Mbappe",genre:"Male",role:"AG",birth:"20/12/1991"},{firstName:"Stephane",lastName:"Curry",genre:"Male",role:"MO",birth:"14/03/1988"},{firstName:"Zinedine",lastName:"Zidane",genre:"Male",role:"MO",birth:"23/06/1972"}],N=({id:t})=>e.jsxs("div",{children:[e.jsx("div",{id:`menu-button-${t}`,className:"w-full",children:e.jsx(r,{slot:"menu-title",size:n.sm,icon:h.ellipsisHorizontal,variant:i.outline,label:""})}),e.jsxs(m,{triggerId:`menu-button-${t}`,children:[e.jsx("div",{children:e.jsx(r,{"text-align":"start",label:"Manager"})}),e.jsx("div",{children:e.jsx(r,{size:n.sm,variant:i.ghost,"text-align":"start",class:"hydrated",label:"Supprimer"})})]})]}),s={fullWidth:!0,children:e.jsxs(e.Fragment,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[x.map(t=>e.jsx("th",{scope:"col",className:"text-center",children:t.header},t.accessoryKey)),e.jsx("th",{children:"Actions"})]})}),e.jsx("tbody",{children:y.map(t=>e.jsxs("tr",{children:[Object.keys(t).map(a=>e.jsx("td",{className:"text-center",children:e.jsx(d,{preset:"span",children:t[a]})},`${t[a]}-${t.firstName}`)),e.jsx("td",{className:"text-center",children:e.jsx(N,{id:t.firstName})},`${t.firstName}-actions`)]},`${t.firstName}-tr`))})]})},T={title:"Components/Table",decorators:[t=>e.jsx("div",{children:t()})],component:p,args:s};var o,l,c;s.parameters={...s.parameters,docs:{...(o=s.parameters)==null?void 0:o.docs,source:{originalSource:`{
  fullWidth: true,
  children: <>
      <thead>
        <tr>
          {mockColumns.map(header => <th scope="col" key={header.accessoryKey} className="text-center">
              {header.header}
            </th>)}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {mocksData.map(header => <tr key={\`\${header.firstName}-tr\`}>
            {Object.keys(header).map(element => <td key={\`\${header[(element as keyof typeof header)]}-\${header.firstName}\`} className="text-center">
                <OdsText preset="span">
                  {header[(element as keyof typeof header)]}
                </OdsText>
              </td>)}
            <td key={\`\${header.firstName}-actions\`} className="text-center">
              <DisplayCellMenu id={header.firstName} />
            </td>
          </tr>)}
      </tbody>
    </>
}`,...(c=(l=s.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};const M=["defaultProps"];export{M as __namedExportsOrder,T as default,s as defaultProps};
//# sourceMappingURL=table.stories-CuhgZYH4.js.map
