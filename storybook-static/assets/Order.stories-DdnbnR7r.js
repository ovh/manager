import{j as n}from"./jsx-runtime-BRNY0I4F.js";import{N as o,V as t}from"./lib-sJyaz0Xv-Dlg__FL0.js";import"./index-Bnop-kX6.js";import"./iframe-BcIzvxf8.js";import"./QueryClientProvider-C1FTVqK-.js";import"./index-ChsYPcXR.js";import"./index-4pTrEEYx.js";function s(r){return n.jsxs(o,{children:[n.jsx(o.Configuration,{onCancel:r.onCancel,onConfirm:r.onConfirm,isValid:r.isValid,children:n.jsx("p",{children:n.jsx(t,{preset:"code",className:"italic",children:"...|order configuration steps| ..."})})}),n.jsx(o.Summary,{onFinish:r.onFinish,orderLink:r.orderLink,onClickLink:r.onClickLink,productName:r.productName})]})}const e={args:{isValid:!0,orderLink:"https://www.ovh.com",productName:"",onCancel:()=>{},onConfirm:()=>{},onFinish:()=>{},onClickLink:()=>{}},render:s,parameters:{docs:{source:{code:`<Order>
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
</Order>`}}}},f={title:"Manager UI Kit/Components/Order",component:o,tags:["autodocs"],subcomponents:{"Order.Summary":o.Summary,"Order.Configuration":o.Configuration}};var i,a,d;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`{
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
}`,...(d=(a=e.parameters)==null?void 0:a.docs)==null?void 0:d.source}}};const k=["DemoOrder"];export{e as DemoOrder,k as __namedExportsOrder,f as default};
