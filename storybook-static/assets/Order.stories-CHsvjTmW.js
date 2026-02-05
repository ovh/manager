import{j as n}from"./jsx-runtime-BRNY0I4F.js";import{c as o,X as d}from"./lib-7WI39Bnb-CLGqEc7s.js";import"./index-Bnop-kX6.js";import"./iframe-BRkcAREb.js";import"./QueryClientProvider-BPX08D6Z.js";import"./index-DnqQo6oJ.js";import"./index-4pTrEEYx.js";import"./Icon-xxQ9IRzi-ORI6lMWl.js";import"./index-CWkFp9WS-BSIT86NH.js";import"./Link-TMoA1i18-DiBAU0SL.js";import"./Text-BGoUCJU7-BjFZdlzU.js";import"./ComboboxControl-EYkaEIlI-CWYTos8A.js";import"./Divider-wQyo85oE-5vlIiwia.js";function m(r){return n.jsxs(o,{children:[n.jsx(o.Configuration,{onCancel:r.onCancel,onConfirm:r.onConfirm,isValid:r.isValid,children:n.jsx("p",{children:n.jsx(d,{preset:"code",className:"italic",children:"...|order configuration steps| ..."})})}),n.jsx(o.Summary,{onFinish:r.onFinish,orderLink:r.orderLink,onClickLink:r.onClickLink,productName:r.productName})]})}const e={args:{isValid:!0,orderLink:"https://www.ovh.com",productName:"",onCancel:()=>{},onConfirm:()=>{},onFinish:()=>{},onClickLink:()=>{}},render:m,parameters:{docs:{source:{code:`<Order>
  <Order.Configuration
    onCancel={handleCancel}
    onConfirm={handleConfirm}
    isValid={isValid}
  >
    <p>Your order configuration steps here</p>
  </Order.Configuration>
  <Order.Summary
    onFinish={handleFinish}
    orderLink="https://www.ovh.com"
    onClickLink={handleClickLink}
    productName="Product Name"
  />
</Order>`}}}},x={title:"Manager UI Kit/Components/Order",component:o,tags:["autodocs"],subcomponents:{"Order.Summary":o.Summary,"Order.Configuration":o.Configuration}};var i,t,a;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    isValid: true,
    orderLink: 'https://www.ovh.com',
    productName: '',
    onCancel: () => {},
    onConfirm: () => {},
    onFinish: () => {},
    onClickLink: () => {}
  },
  render: renderComponent,
  parameters: {
    docs: {
      source: {
        code: \`<Order>
  <Order.Configuration
    onCancel={handleCancel}
    onConfirm={handleConfirm}
    isValid={isValid}
  >
    <p>Your order configuration steps here</p>
  </Order.Configuration>
  <Order.Summary
    onFinish={handleFinish}
    orderLink="https://www.ovh.com"
    onClickLink={handleClickLink}
    productName="Product Name"
  />
</Order>\`
      }
    }
  }
}`,...(a=(t=e.parameters)==null?void 0:t.docs)==null?void 0:a.source}}};const N=["DemoOrder"];export{e as DemoOrder,N as __namedExportsOrder,x as default};
