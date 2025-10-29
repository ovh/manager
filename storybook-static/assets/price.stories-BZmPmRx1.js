import{k as Q,N as e,b as r}from"./lib-Dk32xhqR-BnP8dUtW.js";import"./iframe-IyM3Vz8H.js";import"./index-Bnop-kX6.js";import"./index-4pTrEEYx.js";import"./index-GPs4uoxI.js";import"./jsx-runtime-BRNY0I4F.js";const nr={title:"Manager UI Kit/Components/Price",component:Q,tags:["autodocs"],parameters:{docs:{description:{component:"The Price component displays formatted prices with support for different currencies, tax information, and interval units."}}},argTypes:{value:{description:"The price value to display",control:"number"},tax:{description:"The tax value to display",control:"number"},intervalUnit:{description:"The interval unit for the price (day, month, year)",control:"select",options:Object.values(e)},ovhSubsidiary:{description:"The OVH subsidiary to determine price format",control:"select",options:Object.values(r)},locale:{description:"The locale for price formatting",control:"text"},isConvertIntervalUnit:{description:"Whether to convert the price based on interval unit",control:"boolean"}}},a={args:{value:3948e6,ovhSubsidiary:r.FR,locale:"fr-FR"},parameters:{docs:{source:{code:`<Price
  value={3948000000}
  ovhSubsidiary={OvhSubsidiary.FR}
  locale="fr-FR"
/>`}}}},n={args:{value:3948e6,tax:7896e5,ovhSubsidiary:r.FR,locale:"fr-FR"},parameters:{docs:{source:{code:`<Price
  value={3948000000}
  tax={789600000}
  ovhSubsidiary={OvhSubsidiary.FR}
  locale="fr-FR"
/>`}}}},o={args:{value:3948e6,intervalUnit:e.month,ovhSubsidiary:r.FR,locale:"fr-FR"},parameters:{docs:{source:{code:`<Price
  value={3948000000}
  intervalUnit={IntervalUnitType.month}
  ovhSubsidiary={OvhSubsidiary.FR}
  locale="fr-FR"
/>`}}}},s={args:{value:3948e6,tax:7896e5,intervalUnit:e.month,ovhSubsidiary:r.FR,locale:"fr-FR"},parameters:{docs:{source:{code:`<Price
  value={3948000000}
  tax={789600000}
  intervalUnit={IntervalUnitType.month}
  ovhSubsidiary={OvhSubsidiary.FR}
  locale="fr-FR"
/>`}}}},t={args:{value:3948e6,ovhSubsidiary:r.US,locale:"en-US"}},i={args:{value:3948e6,ovhSubsidiary:r.ASIA,locale:"en-SG"}},c={args:{value:3948e6,intervalUnit:e.day,ovhSubsidiary:r.FR,locale:"fr-FR"}},l={args:{value:3948e6,intervalUnit:e.month,ovhSubsidiary:r.FR,locale:"fr-FR"}},u={args:{value:3948e6,intervalUnit:e.year,ovhSubsidiary:r.FR,locale:"fr-FR"}},v={args:{value:3948e6,intervalUnit:e.month,isConvertIntervalUnit:!0,ovhSubsidiary:r.FR,locale:"fr-FR"}},d={args:{value:3948e6,tax:7896e5,ovhSubsidiary:r.FR,locale:"fr-FR"}},p={args:{value:3948e6,tax:7896e5,intervalUnit:e.month,isConvertIntervalUnit:!0,ovhSubsidiary:r.FR,locale:"fr-FR"}};var m,h,y;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    value: 3948000000,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR'
  },
  parameters: {
    docs: {
      source: {
        code: \`<Price
  value={3948000000}
  ovhSubsidiary={OvhSubsidiary.FR}
  locale="fr-FR"
/>\`
      }
    }
  }
}`,...(y=(h=a.parameters)==null?void 0:h.docs)==null?void 0:y.source}}};var S,b,F;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    value: 3948000000,
    tax: 789600000,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR'
  },
  parameters: {
    docs: {
      source: {
        code: \`<Price
  value={3948000000}
  tax={789600000}
  ovhSubsidiary={OvhSubsidiary.FR}
  locale="fr-FR"
/>\`
      }
    }
  }
}`,...(F=(b=n.parameters)==null?void 0:b.docs)==null?void 0:F.source}}};var R,g,U;o.parameters={...o.parameters,docs:{...(R=o.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    value: 3948000000,
    intervalUnit: IntervalUnitType.month,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR'
  },
  parameters: {
    docs: {
      source: {
        code: \`<Price
  value={3948000000}
  intervalUnit={IntervalUnitType.month}
  ovhSubsidiary={OvhSubsidiary.FR}
  locale="fr-FR"
/>\`
      }
    }
  }
}`,...(U=(g=o.parameters)==null?void 0:g.docs)==null?void 0:U.source}}};var f,I,O;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    value: 3948000000,
    tax: 789600000,
    intervalUnit: IntervalUnitType.month,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR'
  },
  parameters: {
    docs: {
      source: {
        code: \`<Price
  value={3948000000}
  tax={789600000}
  intervalUnit={IntervalUnitType.month}
  ovhSubsidiary={OvhSubsidiary.FR}
  locale="fr-FR"
/>\`
      }
    }
  }
}`,...(O=(I=s.parameters)==null?void 0:I.docs)==null?void 0:O.source}}};var x,T,C;t.parameters={...t.parameters,docs:{...(x=t.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    value: 3948000000,
    ovhSubsidiary: OvhSubsidiary.US,
    locale: 'en-US'
  }
}`,...(C=(T=t.parameters)==null?void 0:T.docs)==null?void 0:C.source}}};var P,W,A;i.parameters={...i.parameters,docs:{...(P=i.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    value: 3948000000,
    ovhSubsidiary: OvhSubsidiary.ASIA,
    locale: 'en-SG'
  }
}`,...(A=(W=i.parameters)==null?void 0:W.docs)==null?void 0:A.source}}};var N,M,j;c.parameters={...c.parameters,docs:{...(N=c.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    value: 3948000000,
    intervalUnit: IntervalUnitType.day,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR'
  }
}`,...(j=(M=c.parameters)==null?void 0:M.docs)==null?void 0:j.source}}};var k,B,D;l.parameters={...l.parameters,docs:{...(k=l.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    value: 3948000000,
    intervalUnit: IntervalUnitType.month,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR'
  }
}`,...(D=(B=l.parameters)==null?void 0:B.docs)==null?void 0:D.source}}};var G,L,Y;u.parameters={...u.parameters,docs:{...(G=u.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    value: 3948000000,
    intervalUnit: IntervalUnitType.year,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR'
  }
}`,...(Y=(L=u.parameters)==null?void 0:L.docs)==null?void 0:Y.source}}};var _,w,E;v.parameters={...v.parameters,docs:{...(_=v.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    value: 3948000000,
    intervalUnit: IntervalUnitType.month,
    isConvertIntervalUnit: true,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR'
  }
}`,...(E=(w=v.parameters)==null?void 0:w.docs)==null?void 0:E.source}}};var H,K,V;d.parameters={...d.parameters,docs:{...(H=d.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    value: 3948000000,
    tax: 789600000,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR'
  }
}`,...(V=(K=d.parameters)==null?void 0:K.docs)==null?void 0:V.source}}};var q,z,J;p.parameters={...p.parameters,docs:{...(q=p.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    value: 3948000000,
    tax: 789600000,
    intervalUnit: IntervalUnitType.month,
    isConvertIntervalUnit: true,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR'
  }
}`,...(J=(z=p.parameters)==null?void 0:z.docs)==null?void 0:J.source}}};const or=["Basic","WithTax","WithInterval","WithTaxAndInterval","USFormat","AsiaFormat","Daily","Monthly","Yearly","WithIntervalConversion","LargeNumber","Complete"];export{i as AsiaFormat,a as Basic,p as Complete,c as Daily,d as LargeNumber,l as Monthly,t as USFormat,o as WithInterval,v as WithIntervalConversion,n as WithTax,s as WithTaxAndInterval,u as Yearly,or as __namedExportsOrder,nr as default};
