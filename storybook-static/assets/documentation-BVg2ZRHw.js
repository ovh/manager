import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as p}from"./index-DqKhBd7Q.js";import{t as r}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l as a}from"./ods-react60-0db41gCx.js";import{M as m,C as u}from"./index-B5Jzr0Xc.js";import{C as c,O as x,A as j,a as g}from"./combobox.stories-B2LLzLT7.js";import{B as b,H as s,E as f}from"./Heading-DzSoBUTy.js";import{I as w,B as v}from"./IdentityCard-CTrphAcp.js";import{R as i,S as o,C as d}from"./Canvas-BceWxQHj.js";import{S as l}from"./StorybookLink-Bmx0ag_V.js";import"./index-Bnop-kX6.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./iframe-CveYUpa2.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./Input-DcqcPYne-DrbRSC9d.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./ods-react236-aAAP9SXj.js";import"./ComboboxControl-sJOkWHeT-CC0kWNMj.js";import"./PopoverTrigger-4w4N6iLp-C-LGD_7X.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-BAi52a_A-BVjZSJoF.js";import"./index-DB9CF8IY-DC0Y2KvY.js";import"./ods-react94-Bxf0SjVg.js";import"./Tag-B7nBeuPX-CPCfmWrN.js";import"./index-D_fe-3SC-C5ZKsUXO.js";import"./controls-BtiQQn1l.js";import"./ods-docgen-map-C6vdLMLl.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./Divider-THit99OS-DE11lmva.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./index-CS2XXzlV.js";function h(t){const n={code:"code",em:"em",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...p(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(m,{of:c,name:"Documentation"}),`
`,e.jsx(b,{of:c}),`
`,e.jsx(n.p,{children:e.jsxs(n.em,{children:[e.jsx(n.strong,{children:"Combobox"})," allows users to search, select, and add items from a dynamic or predefined list."]})}),`
`,e.jsx(u,{of:x,sourceState:"none"}),`
`,e.jsx(s,{label:"Overview",level:2}),`
`,e.jsx(w,{aliases:["Autocomplete","Dropdown Search","Autosuggest","Filterable Select"],figmaLink:"https://www.figma.com/design/9jDDTcR4a9jPRFcdjawAlf/ODS---UI-Kit?node-id=6046-9189",githubUrl:"@ovhcloud/ods-react",name:"Combobox",children:e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Combobox"})," component allows users to search for and select items from a dynamic list of suggestions or a predefined set of allowed values. It supports both single and multiple selection modes and enables users to create new entries."]})}),`
`,e.jsx(s,{label:"Anatomy",level:2}),`
`,e.jsx(n.p,{children:e.jsx(n.img,{src:"./base-assets/components/combobox/anatomy.png",alt:"Component anatomy",title:"Component anatomy"})}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(l,{kind:i.input,story:o.documentation,children:"Input"})," where the user types the search query. It displays the current input value or selected tags (multiple selection mode)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Dropdown list"})," displaying a scrollable list of suggested items. Items can be customized using a custom renderer."]}),`
`,e.jsxs(n.li,{children:[e.jsx(l,{kind:i.tag,story:o.documentation,children:"Tag"})," ",e.jsx(n.em,{children:"(multiple selection mode)"})," to display selected items as tags inside the Input field"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Clearable"})," ",e.jsx(l,{kind:i.button,story:o.documentation,children:"Button"})," ",e.jsx(n.em,{children:"(optional)"})," to allow users to clear the input content"]}),`
`,e.jsxs(n.li,{children:[e.jsx(l,{kind:i.spinner,story:o.documentation,children:"Spinner"})," ",e.jsx(n.em,{children:"(optional)"})," to indicate that data is being fetched"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Add entry option"})," ",e.jsx(n.em,{children:"(optional)"})," allows users to create new entries when no matching result is found. The label is customizable"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Empty state message"})," is a customizable message displayed when no suggestion match the query"]}),`
`]}),`
`,e.jsx(s,{label:"Usage",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Combobox"})," is best suited when users need to:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"search within a dataset and dynamically refine results"}),`
`,e.jsx(n.li,{children:"provide suggestions based on user input (e.g., domain names, tags, predictive search)"}),`
`,e.jsx(n.li,{children:"allow users to add custom values when applicable (e.g., creating tags)"}),`
`]}),`
`,e.jsx(s,{label:"Dos & Don'ts",level:3}),`
`,e.jsx(v,{donts:["- Avoid excessive grouping of items, as too many categories can overwhelm users","- Avoid using combobox when the number of items is very small (except for if the user needs to be able to add their own entries), you can use Select or Radio"],dos:["- Use Combobox for datasets where typing helps filter results","- Suitable for datasets up to a few hundred entries","- Provide meaningful empty states","- Allow users to add custom entries when appropriate"]}),`
`,e.jsx(s,{label:"Placement",level:2}),`
`,e.jsx(n.p,{children:"The dropdown is positioned below the Input field when there is enough space."}),`
`,e.jsx(n.p,{children:"The dropdown width should match the Input field width."}),`
`,e.jsx(n.p,{children:"In multiple selection mode, the Input field height grows dynamically to accommodate selected tags."}),`
`,e.jsx(s,{label:"Behavior",level:2}),`
`,e.jsx(s,{label:"Triggering the dropdown",level:3}),`
`,e.jsx(n.p,{children:"The dropdown appears when the user clicks on the input field."}),`
`,e.jsx(s,{label:"Selecting items",level:3}),`
`,e.jsx(n.p,{children:"Selecting an item triggers a custom event, allowing integrators to process the selected value(s)."}),`
`,e.jsx(s,{label:"Single selection mode",level:4}),`
`,e.jsx(n.p,{children:"Clicking on an item selects it, closes the dropdown, and updates the Input field value."}),`
`,e.jsx(n.p,{children:"If the user exits the field without selecting an item, the input reverts to the placeholder or the last selected value (if any)."}),`
`,e.jsx(s,{label:"Creating new entries",level:3}),`
`,e.jsxs(n.p,{children:["User can create new entries when no matching result exists. An ",e.jsx(n.strong,{children:'"Add entry"'})," option appears at the top of the dropdown (label is customizable)."]}),`
`,e.jsx(n.p,{children:'New entries can be added by clicking on the "Add entry" option.'}),`
`,e.jsx(s,{label:"Case sensitivity rules",level:4}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(n.p,{children:'search input is case-insensitive (e.g., searching for "a" will match "A")'}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(n.p,{children:"newly created entries are not case-sensitive"}),`
`]}),`
`]}),`
`,e.jsx(n.p,{children:"Users cannot create an entry that is already selected as a tag."}),`
`,e.jsx(n.p,{children:'If a custom entry added via "Add Entry" option is removed, it does not reappear in the dropdown, as it was not part of the original list.'}),`
`,e.jsx(s,{label:"Clearable Button",level:3}),`
`,e.jsx(n.p,{children:"If the clearable option is enabled, a dedicated Button appears inside the Input field when it contains text:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"clicking the clearable Button resets the Input field, removing any entered text or selected value(s)"}),`
`,e.jsx(n.li,{children:"in multiple selection mode, only the current Input text is cleared; selected tags remain"}),`
`]}),`
`,e.jsx(s,{label:"Loading state",level:3}),`
`,e.jsx(n.p,{children:"A Spinner can be displayed in the Input field when results are being fetched."}),`
`,e.jsx(s,{label:"Empty state",level:3}),`
`,e.jsx(n.p,{children:"When no matching results are found, a customizable message is displayed in the dropdown."}),`
`,e.jsx(n.p,{children:'This state can be combined with the "Add entry" option.'}),`
`,e.jsx(s,{label:"Grouped items",level:3}),`
`,e.jsx(n.p,{children:"Items can be categorized into groups in both single and multiple selection modes."}),`
`,e.jsx(n.p,{children:"Group titles cannot be selected, clicked and are excluded from search."}),`
`,e.jsx(s,{label:"Navigation",level:2}),`
`,e.jsx(s,{label:"Focus management",level:3}),`
`,e.jsxs(n.p,{children:["The Input field can be focused using the ",e.jsx(n.code,{children:"Tab"})," key. Pressing ",e.jsx(n.code,{children:"Tab"})," again moves focus to the next element and closes the dropdown."]}),`
`,e.jsxs(n.p,{children:["If the Input field is clearable, pressing ",e.jsx(n.code,{children:"Tab"})," first moves focus to the clear button, then to the next element."]}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Shift"})," + ",e.jsx(n.code,{children:"Tab"})," moves focus to the previous interactive element without confirming any item."]}),`
`,e.jsx(s,{label:"General keyboard shortcuts",level:3}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Arrow Up/Down"})," navigates through items in the dropdown."]}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Backspace"})," deletes the last character in the Input field (it does not clear the entire field at once)."]}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Enter"})," selects the hovered item and closes the dropdown."]}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Escape"})," closes the dropdown without selection."]}),`
`,e.jsx(s,{label:"Multiple selection mode",level:4}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Arrow Left/Right"})," navigates between selected tags."]}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Backspace"})," while focusing a tag will remove it."]}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Enter"})," while focusing a tag will remove it."]}),`
`,e.jsx(s,{label:"Accessibility",level:2}),`
`,e.jsxs(n.p,{children:["This component complies with the ",e.jsx(f,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/combobox/",children:"Combobox WAI-ARIA design pattern"}),"."]}),`
`,e.jsx(s,{label:"Always provide an explicit label",level:3}),`
`,e.jsxs(n.p,{children:["Every ",e.jsx(n.strong,{children:"Combobox"})," must have a clear and explicit label to ensure that users (especially screen reader users) understand its purpose, using either ",e.jsx(n.strong,{children:"FormField"})," or a native label tag."]}),`
`,e.jsx(d,{of:j,sourceState:"shown"}),`
`,e.jsxs(n.p,{children:[e.jsx(r,{name:a.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce the label, the field and its content."]}),`
`,e.jsx(s,{label:"Override action context",level:3}),`
`,e.jsx(n.p,{children:"To provide more context on the interactive elements, you can provide your own custom translations to the component."}),`
`,e.jsx(d,{of:g,sourceState:"shown"}),`
`,e.jsxs(n.p,{children:[e.jsx(r,{name:a.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce the label, the field, its content and custom label of focused action."]})]})}function he(t={}){const{wrapper:n}={...p(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(h,{...t})}):h(t)}export{he as default};
