import{j as n}from"./jsx-runtime-BRNY0I4F.js";import{u as a}from"./index-DtBi2NJp.js";import{S as c,a as t,b as l,e as i,c as h}from"./external-links-7dIArdE7.js";import{S as s}from"./index-DeW_46E-.js";import{M as d,C as u}from"./index-0Pa5_OBP.js";import p,{actionMenuStandard as m}from"./action.stories-CmIKPUHG.js";import"./index-Bnop-kX6.js";import"./index-PzEU9Mdi.js";import"./index-DXhrqGIV.js";import"./index-D0sJu8id.js";import"./iframe-CsxCAwZL.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./manager-react-components-lib.es-Ngpt3Dgi.js";import"./QueryClientProvider-DbnhbVMg.js";import"./index-D1HcsAmU.js";import"./context-Cuu9iSAu.js";function r(o){const e={a:"a",code:"code",em:"em",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...a(),...o.components};return n.jsxs(n.Fragment,{children:[n.jsx(d,{title:"Manager React Components/Navigation/Menus/Documentation"}),`
`,n.jsx(c,{of:p}),`
`,n.jsxs(e.p,{children:["An ",n.jsx(e.strong,{children:n.jsx(e.em,{children:"Action Menu"})})," is a component that displays a list of actions"]}),`
`,n.jsx(u,{of:m,sourceState:"none"}),`
`,n.jsx(t,{label:"Overview",level:2}),`
`,n.jsx(l,{aliases:["Menu","Ellipsis Menu","Dropdown Menu"],githubUrl:i.github.action,name:"ActionMenu",relatedComponents:[{name:"ods-button",href:i.ods.button},{name:"ods-popover",href:i.ods.popover}],children:n.jsxs(e.p,{children:["The ",n.jsx(e.code,{children:"ActionMenu"}),` component is a button-based dropdown menu that allows users
to trigger various actions.`]})}),`
`,n.jsx(t,{label:"Anatomy",level:2}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"an ODS Button"}),": it will trigger the list of action which contains:"]}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsx(e.li,{children:"an ODS Icon always at left"}),`
`,n.jsx(e.li,{children:"a label"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"an ODS Popover"})," which can contain:"]}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"actions"}),": each action is an ODS Button or an ODS Link depending of the usage"]}),`
`]}),`
`]}),`
`]}),`
`,n.jsx(t,{label:"Usage",level:2}),`
`,n.jsxs(e.p,{children:["An ",n.jsx(e.strong,{children:"Action Menu"})," is typically used when users have 3 to 10 actions to choose from (like edit, copy or view settings for instance)."]}),`
`,n.jsx(e.p,{children:"It is used for navigation or command menus, where an action is initiated, based on the selection."}),`
`,n.jsx(t,{label:"Dos & Don'ts",level:2}),`
`,n.jsx(h,{dos:["Do use an Action Menu when there are 3 or more actions","Keep Action Menu list of actions content short for a better and faster understanding"],donts:["Don't use an Action Menu to display more than 10 actions or a list of actions causing users to scroll","Don't use an Action Menu when a description is necessary: use a Tooltip instead"]}),`
`,n.jsx(t,{label:"Placement",level:2}),`
`,n.jsxs(e.p,{children:["While opened, the ",n.jsx(e.strong,{children:"Action Menu"})," displays a list of actions. The list of actions can be triggered at the top, bottom, left or right of the ",n.jsx(e.strong,{children:"Action Menu"})," itself."]}),`
`,n.jsxs(e.p,{children:["An opened ",n.jsx(e.strong,{children:"Action Menu"})," will appear above other elements on a page so, make sure the position of your list of actions doesn't hide important information related to the ",n.jsx(e.strong,{children:"Action Menu"})," on the page."]}),`
`,n.jsx(t,{label:"Behavior",level:2}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"States"}),`
`,n.jsx(e.strong,{children:"Action Menu"})," does not have its own states. States come from its inner components used as trigger and actions: ODS Button."]}),`
`,n.jsx(e.p,{children:"The list of actions width will adapt to its longest content until it reaches the maximum width allowed."}),`
`,n.jsx(e.p,{children:"When an action content cannot fit on a single line, the text will be truncated."}),`
`,n.jsx(s,{data:{columns:["action","interaction"],rows:[{action:"Move cursor over the Action Menu",interaction:"Hover on the Action Menu trigger element"},{action:"Click on the Action Menu",interaction:"List of actions will be displayed"},{action:"Move cursor over actions",interaction:"Hover on the hoverable action (when not disabled)"},{action:"Click on hovered action",interaction:"Trigger the expected behavior from the selected item and close the Action Menu"},{action:"Click outside the Action Menu element",interaction:"The Action Menu will close"}]}}),`
`,n.jsx(t,{label:"Variation",level:2}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Action Menu"})," trigger inherits ODS Button variants:"]}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"default"}),`
`,n.jsx(e.li,{children:"outline"}),`
`,n.jsx(e.li,{children:"ghost"}),`
`]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Action Menu"})," can be in compact mode."]}),`
`,n.jsx(t,{label:"Accessibility",level:2}),`
`,n.jsxs(e.p,{children:[n.jsx(e.em,{children:`Ensure the component meets accessibility standards.
Describe what should keyboard interaction do to the component
WAI Patterns can help you go though keyboard interaction :`})," ",n.jsx(e.strong,{children:n.jsx(e.a,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/",rel:"nofollow",children:"https://www.w3.org/WAI/ARIA/apg/patterns/"})})]}),`
`,n.jsx(s,{data:{columns:["key","interaction"],rows:[{key:"Tab",interaction:"Focus on the Action Menu trigger element. Can move forward through the list of actions and focus on one of them"},{key:"Enter or Space while Action Menu is focused",interaction:"List of actions will be displayed"},{key:"Enter or Space while an action is focused",interaction:"Trigger the expected behavior from the selected action and close the Action Menu"},{key:"Escape",interaction:"Close the Action Menu"}]}})]})}function O(o={}){const{wrapper:e}={...a(),...o.components};return e?n.jsx(e,{...o,children:n.jsx(r,{...o})}):r(o)}export{O as default};
