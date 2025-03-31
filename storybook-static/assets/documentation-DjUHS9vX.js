import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as r}from"./index-B0iv7OQY.js";import{S as a,a as t,b as c,c as l}from"./index-J_04tqid.js";import{S as i}from"./index-C8qn7uCY.js";import{M as d,C as h}from"./index-de-PYMsM.js";import u,{actionMenuStandard as p}from"./action.stories-BnLQEeMC.js";import"./index-Bnop-kX6.js";import"./index-CpQqcCyD.js";import"./index-fg_2TIFA.js";import"./index-4pTrEEYx.js";import"./iframe-DW9hTzZQ.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./action.component-D_kD0_0W.js";import"./translation-Bzcle6L7.js";import"./i18next-DdipboBq.js";import"./ManagerButton-6adS761D.js";import"./useOvhIam-Rjw-h1Oe.js";import"./QueryClientProvider-Y_fKerI5.js";import"./useTranslation-I4D8sCWp.js";function s(o){const n={a:"a",code:"code",em:"em",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...r(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(d,{title:"Navigation/Menus/Documentation"}),`
`,e.jsx(a,{of:u}),`
`,e.jsxs(n.p,{children:["An ",e.jsx(n.strong,{children:e.jsx(n.em,{children:"Action Menu"})})," is a component that displays a list of actions"]}),`
`,e.jsx(h,{of:p,sourceState:"none"}),`
`,e.jsx(t,{label:"Overview",level:2}),`
`,e.jsx(c,{aliases:["Menu","Ellipsis Menu","Dropdown Menu"],atomicType:"",figmaLink:"https://www.figma.com/design/9jDDTcR4a9jPRFcdjawAlf/ODS---UI-Kit?node-id=1-6634",githubUrl:"https://github.com/ovh/design-system/tree/master/packages/ods/src/components/accordion",name:"ActionMenu",relatedComponents:[{name:"link"}],children:e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"ActionMenu"}),` component is a button-based dropdown menu that allows users
to trigger various actions.`]})}),`
`,e.jsx(t,{label:"Anatomy",level:2}),`
`,e.jsx(n.p,{children:"add the image here"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"an ODS Button"}),": it will trigger the list of action which contains:"]}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsx(n.li,{children:"an ODS Icon (can be set to left or right? or always at the left of the label)?"}),`
`,e.jsx(n.li,{children:"a label"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"an ODS Popover"})," which can contain:"]}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"a group"})," title: it is used to group related actions?"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"actions"}),": each action is an ODS Button or an ODS Link depending of the usage"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"a divider"}),": it can be used to separate some actions?"]}),`
`]}),`
`]}),`
`]}),`
`,e.jsx(t,{label:"Usage",level:2}),`
`,e.jsxs(n.p,{children:["An ",e.jsx(n.strong,{children:"Action Menu"})," is typically used when users have 3 to 10 actions to choose from (like edit, copy or view settings for instance)."]}),`
`,e.jsx(n.p,{children:"It is used for navigation or command menus, where an action is initiated, based on the selection."}),`
`,e.jsx(t,{label:"Dos & Don'ts",level:2}),`
`,e.jsx(l,{dos:["Do use an Action Menu when there are 3 or more actions","Keep Action Menu list of actions content short for abetter and faster understanding"],donts:["Don't use an Action Menu to display more than 10 actions or a list of actions causing users to scroll","Don't use an Action Menu when a description is necessary: use a Tooltip instead"]}),`
`,e.jsx(t,{label:"Placement",level:2}),`
`,e.jsxs(n.p,{children:["While opened, the ",e.jsx(n.strong,{children:"Action Menu"})," displays a list of actions. The list of actions can be triggered at the top, bottom, left or right of the ",e.jsx(n.strong,{children:"Action Menu"})," itself."]}),`
`,e.jsxs(n.p,{children:["An opened ",e.jsx(n.strong,{children:"Action Menu"})," will appear above other elements on a page so, make sure the position of your list of actions doesn't hide important information related to the ",e.jsx(n.strong,{children:"Action Menu"})," on the page."]}),`
`,e.jsx(t,{label:"Behavior",level:2}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"States"}),`
`,e.jsx(n.strong,{children:"Action Menu"})," does not have its own states. States come from its inner components used as trigger and actions: ODS Button."]}),`
`,e.jsx(n.p,{children:"The list of actions width will adapt to its longest content until it reaches the maximum width allowed."}),`
`,e.jsx(n.p,{children:"When an action content cannot fit on a single line, the text will be truncated."}),`
`,e.jsx(i,{data:{columns:["action","interaction"],rows:[{action:"Move cursor over the Action Menu",interaction:"Hover on the Action Menu trigger element"},{action:"Click on the Action Menu",interaction:"List of actions will be displayed"},{action:"Move cursor over actions",interaction:"Hover on the hoverable action (when not disabled)"},{action:"Click on hovered action",interaction:"Trigger the expected behavior from the selected item and close the Action Menu"},{action:"Click outside the Action Menu element",interaction:"The Action Menu will close"}]}}),`
`,e.jsx(t,{label:"Variation",level:2}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Action Menu"})," trigger inherits ODS Button variants:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"default"}),`
`,e.jsx(n.li,{children:"outline"}),`
`,e.jsx(n.li,{children:"ghost"}),`
`]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Action Menu"})," can be in compact mode."]}),`
`,e.jsx(t,{label:"Accessibility",level:2}),`
`,e.jsxs(n.p,{children:[e.jsx(n.em,{children:`Ensure the component meets accessibility standards.
Describe what should keyboard interaction do to the component
WAI Patterns can help you go though keyboard interaction :`})," ",e.jsx(n.strong,{children:e.jsx(n.a,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/",rel:"nofollow",children:"https://www.w3.org/WAI/ARIA/apg/patterns/"})})]}),`
`,e.jsx(i,{data:{columns:["key","interaction"],rows:[{key:"Tab",interaction:"Focus on the Action Menu trigger element. Can move forward through the list of actions and focus on one of them"},{key:"Enter or Space while Action Menu is focused",interaction:"List of actions will be displayed"},{key:"Enter or Space while an action is focused",interaction:"Trigger the expected behavior from the selected action and close the Action Menu"},{key:"Escape",interaction:"Close the Action Menu"}]}})]})}function L(o={}){const{wrapper:n}={...r(),...o.components};return n?e.jsx(n,{...o,children:e.jsx(s,{...o})}):s(o)}export{L as default};
