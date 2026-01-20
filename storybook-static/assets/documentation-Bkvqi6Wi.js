import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as p}from"./index-BnJ4eeZE.js";import{t as l}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l as c}from"./ods-react60-0db41gCx.js";import{M as m,C as u}from"./index-Ck5q0c5c.js";import{P as a,O as x,A as j,a as f}from"./phone-number.stories-Cv240nsT.js";import{B as b,H as t}from"./Heading-CUt9y0bY.js";import{I as g,B as y}from"./IdentityCard-DKtxsaXB.js";import{R as r,S as s,C as d}from"./Canvas-BnlgT6BS.js";import{S as i}from"./StorybookLink-BENysf6k.js";import"./index-Bnop-kX6.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./iframe-bAznjRtu.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./Input-DcqcPYne-DrbRSC9d.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./ods-react236-aAAP9SXj.js";import"./PhoneNumberCountryList-DlTFLnzQ-X8jwHTuc.js";import"./SelectControl-C7d9WPuE-Bxj24dHo.js";import"./index-_7D5ljJ2-LyAubAEn.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-DB9CF8IY-DC0Y2KvY.js";import"./use-field-context-C3OOq-03-DvM5qnyl.js";import"./controls-BtiQQn1l.js";import"./ods-docgen-map-C6vdLMLl.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Divider-THit99OS-DE11lmva.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./ods-react235-BTQ8kVBe.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./index-DX7gpv7E.js";function h(o){const n={code:"code",em:"em",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...p(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(m,{of:a,name:"Documentation"}),`
`,e.jsx(b,{of:a}),`
`,e.jsx(n.p,{children:e.jsxs(n.em,{children:[e.jsx(n.strong,{children:"Phone Number"})," component is a combo of a selection of country phone indicator and an ",e.jsx(i,{kind:r.input,story:s.documentation,children:"Input"})," field for entering a phone number"]})}),`
`,e.jsx(u,{of:x,sourceState:"none"}),`
`,e.jsx(t,{label:"Overview",level:2}),`
`,e.jsx(g,{aliases:["Phone Number Field"],figmaLink:"https://www.figma.com/design/9jDDTcR4a9jPRFcdjawAlf/ODS---UI-Kit?node-id=48-6130",githubUrl:"@ovhcloud/ods-react",name:"Phone Number",children:e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Phone Number"}),` component is used to let users enter their phone number in the correct format for the selected
country.`]})}),`
`,e.jsx(t,{label:"Usage",level:2}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Phone Number"})," component should be used when there is a need to collect the user's phone number, in a form for instance:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"An user profile"}),`
`,e.jsx(n.li,{children:"A contact/appointment form"}),`
`,e.jsx(n.li,{children:"For telecom configuration"}),`
`]}),`
`,e.jsx(t,{label:"Dos & Don'ts",level:3}),`
`,e.jsx(y,{donts:["- Don't enforce a rigid format (e.g., requiring users to enter parentheses or dashes), prioritize forgiving input","- Don't make the field required without context. Explain clearly why the phone number is needed (e.g., for account recovery or verification)","- Don't assume all users have mobile numbers. Allow landline formats where applicable","- Don't display country codes or formats that aren't relevant to your supported markets"],dos:["- Use the country indicator Select when your application supports international phone numbers","- Display helper text or error messaging to guide users if the input format is incorrect (e.g., expected digit count or formatting rules)","- If phone numbers are only accepted in the user's locale, use the component without the country code Select"]}),`
`,e.jsx(t,{label:"Best Practices in Context",level:3}),`
`,e.jsx(n.p,{children:e.jsx(n.img,{src:"./base-assets/components/phone-number/anatomy.png",alt:"Component anatomy",title:"Component anatomy"})}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.strong,{children:"Phone Number"})}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Country selector"})," - optional"]}),`
`,e.jsx(n.li,{children:e.jsx(n.strong,{children:"Input field"})}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Clearable button"})," - optional"]}),`
`]}),`
`,e.jsx(t,{label:"Placement",level:2}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Phone Number"})," is a group of ",e.jsx(i,{kind:r.select,story:s.documentation,children:"Select"})," and ",e.jsx(i,{kind:r.input,story:s.documentation,children:"Input"}),", and should act as their specific placements."]}),`
`,e.jsx(t,{label:"Behavior",level:2}),`
`,e.jsx(n.p,{children:"When the user selects a country, it determines the format used to validate their phone number. If selected country has been modified, expected format and placeholder will be updated."}),`
`,e.jsxs(n.p,{children:["If the field content is in error state (i.e. missing or wrong characters), the whole ",e.jsx(n.strong,{children:"Phone Number"})," component becomes in error state."]}),`
`,e.jsx(n.p,{children:"The country selector allows users to navigate to the desired country option by typing letters while focused on the country selector."}),`
`,e.jsx(n.p,{children:"The search is based on the start of the word and functions one letter at a time."}),`
`,e.jsx(n.p,{children:"For example:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:'Typing "f" focus the first country that starts with "f".'}),`
`,e.jsx(n.li,{children:'Typing "r" immediately after focus the first country that starts with "r".'}),`
`]}),`
`,e.jsx(t,{label:"Locale",level:3}),`
`,e.jsxs(n.p,{children:["The locale (i.e. country list translation in ",e.jsx(i,{kind:r.select,story:s.documentation,children:"Select"}),") is first set to the value provided as a property."]}),`
`,e.jsx(n.p,{children:"If the given property is not defined or recognized, the component attempts to use the browser's locale settings."}),`
`,e.jsx(n.p,{children:"If the browser's locale is also not recognized, the component defaults to English (EN)."}),`
`,e.jsx(t,{label:"ISO code",level:3}),`
`,e.jsx(n.p,{children:"The ISO code is initially set to the value provided as a property."}),`
`,e.jsx(n.p,{children:"If the given property is not defined or recognized, the component attempts to determine the ISO code based on the browser's locale."}),`
`,e.jsx(n.p,{children:"If the browser's locale is not recognized, the component defaults to the first ISO code in the predefined country list."}),`
`,e.jsx(t,{label:"Navigation",level:2}),`
`,e.jsx(t,{label:"Focus Management",level:3}),`
`,e.jsxs(n.p,{children:["When the ",e.jsx(n.strong,{children:"Phone Number"})," component is focused, focus is first set to the country selector dropdown, if present, or directly to the Input field."]}),`
`,e.jsx(n.p,{children:"Each subcomponent (Select and Input) can be focused independently using keyboard navigation."}),`
`,e.jsx(n.p,{children:"If the country selector is disabled or not rendered, focus starts directly on the Input field."}),`
`,e.jsx(t,{label:"General Keyboard Shortcuts",level:3}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Tab"})," moves focus forward:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"First to the country selector (if present and enabled)"}),`
`,e.jsx(n.li,{children:"Then to the Phone Number Input field"}),`
`]}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Shift"})," + ",e.jsx(n.code,{children:"Tab"})," moves focus backward through these elements."]}),`
`,e.jsx(n.p,{children:"While focused on the country selector, keyboard shortcuts are similar to the Select component:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Pressing ",e.jsx(n.code,{children:"Space"})," or ",e.jsx(n.code,{children:"Arrow Down"})," opens the dropdown"]}),`
`,e.jsxs(n.li,{children:["Pressing ",e.jsx(n.code,{children:"Arrow"})," keys navigates through the list of countries"]}),`
`,e.jsxs(n.li,{children:["Pressing ",e.jsx(n.code,{children:"Home"}),"/",e.jsx(n.code,{children:"fn"}),"+ ",e.jsx(n.code,{children:"Arrow Up"})," or ",e.jsx(n.code,{children:"End"}),"/",e.jsx(n.code,{children:"fn"})," + ",e.jsx(n.code,{children:"Arrow Down"})," jumps to the first or last option"]}),`
`,e.jsx(n.li,{children:"Typing letters focuses the first country whose name starts with the typed character"}),`
`,e.jsxs(n.li,{children:["Pressing ",e.jsx(n.code,{children:"Enter"})," or ",e.jsx(n.code,{children:"Tab"})," selects the focused country and closes the dropdown"]}),`
`,e.jsxs(n.li,{children:["Pressing ",e.jsx(n.code,{children:"Escape"})," closes the dropdown without selection"]}),`
`]}),`
`,e.jsx(n.p,{children:"While focused on the Input field:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Typing numeric characters enters the phone number"}),`
`,e.jsxs(n.li,{children:["Pressing ",e.jsx(n.code,{children:"Backspace"})," deletes the last character"]}),`
`,e.jsxs(n.li,{children:["Pressing ",e.jsx(n.code,{children:"Arrow Left"})," or ",e.jsx(n.code,{children:"Arrow Right"})," moves the cursor within the input"]}),`
`]}),`
`,e.jsx(t,{label:"Accessibility",level:2}),`
`,e.jsxs(n.p,{children:["To ensure proper accessibility, the ",e.jsx(n.strong,{children:"Phone Number"})," component must be correctly labeled and provide meaningful context when interactive elements (such as icon buttons) are used."]}),`
`,e.jsx(t,{label:"Always provide an explicit label",level:3}),`
`,e.jsxs(n.p,{children:["Every ",e.jsx(n.strong,{children:"Phone Number"})," must have a clear and explicit label to ensure that users (especially screen reader users) understand its purpose, using either ",e.jsx(n.strong,{children:"FormField"})," or a native label tag."]}),`
`,e.jsx(d,{of:j,sourceState:"shown"}),`
`,e.jsxs(n.p,{children:[e.jsx(l,{name:c.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce the label, the field and its content."]}),`
`,e.jsx(t,{label:"Override action context",level:3}),`
`,e.jsx(n.p,{children:"To provide more context on the interactive elements, you can provide your own custom translations to the component."}),`
`,e.jsx(d,{of:f,sourceState:"shown"}),`
`,e.jsxs(n.p,{children:[e.jsx(l,{name:c.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce the label, the field, its content and custom label of focused action."]})]})}function ae(o={}){const{wrapper:n}={...p(),...o.components};return n?e.jsx(n,{...o,children:e.jsx(h,{...o})}):h(o)}export{ae as default};
