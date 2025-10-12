import{w as Q,p as e,v as r}from"./manager-react-components-lib.es-BdrQa-1b.js";import"./iframe-cf8KLDhX.js";import"./QueryClientProvider-DbnhbVMg.js";import"./index-Bnop-kX6.js";import"./jsx-runtime-BRNY0I4F.js";import"./index-D1HcsAmU.js";import"./context-Cuu9iSAu.js";import"./index-D0sJu8id.js";const tr={title:"Manager React Components/Components/Price",component:Q,parameters:{docs:{description:{component:"The Price component displays formatted prices with support for different currencies, tax information, and interval units."}}},argTypes:{value:{description:"The price value to display",control:"number"},tax:{description:"The tax value to display",control:"number"},intervalUnit:{description:"The interval unit for the price (day, month, year)",control:"select",options:Object.values(e)},ovhSubsidiary:{description:"The OVH subsidiary to determine price format",control:"select",options:Object.values(r)},locale:{description:"The locale for price formatting",control:"text"},isConvertIntervalUnit:{description:"Whether to convert the price based on interval unit",control:"boolean"}}},a={args:{value:3948e6,ovhSubsidiary:r.FR,locale:"fr-FR"}},n={args:{value:3948e6,tax:7896e5,ovhSubsidiary:r.FR,locale:"fr-FR"}},o={args:{value:3948e6,intervalUnit:e.month,ovhSubsidiary:r.FR,locale:"fr-FR"}},t={args:{value:3948e6,tax:7896e5,intervalUnit:e.month,ovhSubsidiary:r.FR,locale:"fr-FR"}},s={args:{value:3948e6,ovhSubsidiary:r.US,locale:"en-US"}},i={args:{value:3948e6,ovhSubsidiary:r.ASIA,locale:"en-SG"}},l={args:{value:3948e6,intervalUnit:e.day,ovhSubsidiary:r.FR,locale:"fr-FR"}},c={args:{value:3948e6,intervalUnit:e.month,ovhSubsidiary:r.FR,locale:"fr-FR"}},u={args:{value:3948e6,intervalUnit:e.year,ovhSubsidiary:r.FR,locale:"fr-FR"}},v={args:{value:3948e6,intervalUnit:e.month,isConvertIntervalUnit:!0,ovhSubsidiary:r.FR,locale:"fr-FR"}},d={args:{value:3948e6,tax:7896e5,ovhSubsidiary:r.FR,locale:"fr-FR"}},p={args:{value:3948e6,tax:7896e5,intervalUnit:e.month,isConvertIntervalUnit:!0,ovhSubsidiary:r.FR,locale:"fr-FR"}};var m,h,y;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    value: 3948000000,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR'
  }
}`,...(y=(h=a.parameters)==null?void 0:h.docs)==null?void 0:y.source}}};var S,b,F;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    value: 3948000000,
    tax: 789600000,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR'
  }
}`,...(F=(b=n.parameters)==null?void 0:b.docs)==null?void 0:F.source}}};var g,R,U;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    value: 3948000000,
    intervalUnit: IntervalUnitType.month,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR'
  }
}`,...(U=(R=o.parameters)==null?void 0:R.docs)==null?void 0:U.source}}};var f,I,x;t.parameters={...t.parameters,docs:{...(f=t.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    value: 3948000000,
    tax: 789600000,
    intervalUnit: IntervalUnitType.month,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR'
  }
}`,...(x=(I=t.parameters)==null?void 0:I.docs)==null?void 0:x.source}}};var T,O,C;s.parameters={...s.parameters,docs:{...(T=s.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    value: 3948000000,
    ovhSubsidiary: OvhSubsidiary.US,
    locale: 'en-US'
  }
}`,...(C=(O=s.parameters)==null?void 0:O.docs)==null?void 0:C.source}}};var W,A,w;i.parameters={...i.parameters,docs:{...(W=i.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    value: 3948000000,
    ovhSubsidiary: OvhSubsidiary.ASIA,
    locale: 'en-SG'
  }
}`,...(w=(A=i.parameters)==null?void 0:A.docs)==null?void 0:w.source}}};var M,j,B;l.parameters={...l.parameters,docs:{...(M=l.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    value: 3948000000,
    intervalUnit: IntervalUnitType.day,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR'
  }
}`,...(B=(j=l.parameters)==null?void 0:j.docs)==null?void 0:B.source}}};var D,G,L;c.parameters={...c.parameters,docs:{...(D=c.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    value: 3948000000,
    intervalUnit: IntervalUnitType.month,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR'
  }
}`,...(L=(G=c.parameters)==null?void 0:G.docs)==null?void 0:L.source}}};var N,P,Y;u.parameters={...u.parameters,docs:{...(N=u.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    value: 3948000000,
    intervalUnit: IntervalUnitType.year,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR'
  }
}`,...(Y=(P=u.parameters)==null?void 0:P.docs)==null?void 0:Y.source}}};var _,E,H;v.parameters={...v.parameters,docs:{...(_=v.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    value: 3948000000,
    intervalUnit: IntervalUnitType.month,
    isConvertIntervalUnit: true,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR'
  }
}`,...(H=(E=v.parameters)==null?void 0:E.docs)==null?void 0:H.source}}};var V,k,q;d.parameters={...d.parameters,docs:{...(V=d.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    value: 3948000000,
    tax: 789600000,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR'
  }
}`,...(q=(k=d.parameters)==null?void 0:k.docs)==null?void 0:q.source}}};var z,J,K;p.parameters={...p.parameters,docs:{...(z=p.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    value: 3948000000,
    tax: 789600000,
    intervalUnit: IntervalUnitType.month,
    isConvertIntervalUnit: true,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR'
  }
}`,...(K=(J=p.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};const sr=["Basic","WithTax","WithInterval","WithTaxAndInterval","USFormat","AsiaFormat","Daily","Monthly","Yearly","WithIntervalConversion","LargeNumber","Complete"];export{i as AsiaFormat,a as Basic,p as Complete,l as Daily,d as LargeNumber,c as Monthly,s as USFormat,o as WithInterval,v as WithIntervalConversion,n as WithTax,t as WithTaxAndInterval,u as Yearly,sr as __namedExportsOrder,tr as default};
