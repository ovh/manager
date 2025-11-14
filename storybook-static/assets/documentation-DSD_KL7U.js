import{j as t}from"./jsx-runtime-BRNY0I4F.js";import{u as e}from"./index-B3uiDcXK.js";import"./index-DQYe8Zr8.js";import"./tags-tile.stories-D1NXp3tI.js";import{M as n}from"./index-nqFusPHu.js";import"./index-Bnop-kX6.js";import"./preview-DJRQmQUb.js";import"./iframe-D5tzyF_8.js";import"./DocsRenderer-CFRXHY34-CVK-f1Eo.js";import"./client-mUdLbVpc.js";import"./index-4pTrEEYx.js";import"./lib-3BNUHx3P-DQ0dZkTw.js";import"./QueryClientProvider-YWZt9LhG.js";import"./index-BvE2bIaB.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./Badge-YOwwmnsf-CJ8iv41_.js";import"./ods-react236-aAAP9SXj.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./PopoverTrigger-4w4N6iLp-C-LGD_7X.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-BAi52a_A-BVjZSJoF.js";import"./index-DB9CF8IY-DC0Y2KvY.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./Card-D5fMAkqX-3SHynhw3.js";import"./Skeleton-tM01pV-R-CR0rfR_T.js";import"./Input-DcqcPYne-DrbRSC9d.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./Divider-THit99OS-DE11lmva.js";import"./Table-DeFepqjL-yMJhEyPY.js";import"./CheckboxLabel-BNqUGOsg-n6RGKdXc.js";import"./use-field-context-C3OOq-03-DvM5qnyl.js";import"./Tag-B7nBeuPX-CPCfmWrN.js";import"./SelectControl-C7d9WPuE-Bxj24dHo.js";import"./index-_7D5ljJ2-LyAubAEn.js";import"./ClipboardTrigger-TeqCWvgk-PkhT1oq0.js";import"./ModalTrigger-tZKHx0Fx-Dgqcdxhl.js";import"./dialog-trigger-DhWI7POy-2Tl6aad4.js";import"./render-strategy-BVcZ76SI-DDawKQXU.js";import"./TabContent-fruP9qhA-B5VnEOA-.js";import"./MessageIcon-yhpEHWAg-BtZxEFo4.js";import"./BreadcrumbItem-elPaHQlb-CNpnNsvr.js";import"./DrawerTrigger-omPTo2Bn-DB5oJcOC.js";import"./DatepickerControl-4VwQb-ep-Ct4shRTG.js";import"./ComboboxControl-sJOkWHeT-CC0kWNMj.js";import"./index-D_fe-3SC-C5ZKsUXO.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function i(o){const r={br:"br",code:"code",em:"em",h1:"h1",h2:"h2",hr:"hr",p:"p",pre:"pre",strong:"strong",...e(),...o.components};return t.jsxs(t.Fragment,{children:[t.jsx(n,{title:"Manager UI Kit/Components/TagsTile/Documentation"}),`
`,t.jsx(r.h1,{id:"overview",children:"Overview"}),`
`,t.jsxs(r.p,{children:["The ",t.jsx(r.code,{children:"TagsTile"})," component displays a tile that show ",t.jsx(r.strong,{children:"tags"})," (key-value pairs) associated with an item (e.g., a customer, resource, etc.).",t.jsx(r.br,{}),`
`,"It leverages OVHcloud’s ODS React components for consistent design and behavior."]}),`
`,t.jsx(r.hr,{}),`
`,t.jsx(r.h2,{id:"-props",children:"✨ Props"}),`
`,t.jsxs(r.p,{children:[`| Prop                 | Type                                  | Description                                                                 |
| -------------------- | ------------------------------------- | --------------------------------------------------------------------------- |
| `,t.jsx(r.code,{children:"tags"}),"              | ",t.jsx(r.code,{children:"{ [key: string]: string }"}),`           | A dictionary of tags to display (key-value pairs).                          |
| `,t.jsx(r.code,{children:"displayInternalTags"})," | ",t.jsx(r.code,{children:"boolean"})," ",t.jsx(r.em,{children:"(optional)"}),"              | Whether to display internal tags. ",t.jsx(r.em,{children:"(currently not used directly inside)"}),`    |
| `,t.jsx(r.code,{children:"onEditTags"}),"        | ",t.jsx(r.code,{children:"() => void"}),"                          | Callback triggered when the user clicks the ",t.jsx(r.strong,{children:"Edit Tags"})," button.           |"]}),`
`,t.jsx(r.hr,{}),`
`,t.jsx(r.h2,{id:"-features",children:"🔍 Features"}),`
`,t.jsxs(r.p,{children:["✅ Displays a list of tags",t.jsx(r.br,{}),`
`,"✅ Includes action buttons to ",t.jsx(r.strong,{children:"edit tags"})]}),`
`,t.jsx(r.hr,{}),`
`,t.jsx(r.h2,{id:"-usage-example",children:"📦 Usage Example"}),`
`,t.jsx(r.pre,{children:t.jsx(r.code,{className:"language-tsx",children:`import { TagsTile } from '@ovh-ux/muk';

export const Example = () => {
  const tags = {
    environment: 'production',
    owner: 'dev-team',
    priority: 'high',
  };

  return (
    <div>
      <TagsTile
        tags={tags}
        onEditTags={() => {
          console.log('Edit tags clicked');
        }}
      />
    </div>
  );
};
`})})]})}function lt(o={}){const{wrapper:r}={...e(),...o.components};return r?t.jsx(r,{...o,children:t.jsx(i,{...o})}):i(o)}export{lt as default};
