import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as r}from"./index-CyBtB0VZ.js";import{S as o,a as i,b as a,c as l}from"./index-CGb183dP.js";import{S as c}from"./index-C8qn7uCY.js";import{M as d,C as h}from"./index-IIISP0qU.js";import p,{ExternalLink as x}from"./links.stories-C4Ik3tAh.js";import"./index-Bnop-kX6.js";import"./index-C7RZ_VRQ.js";import"./index-vm89uYmh.js";import"./index-4pTrEEYx.js";import"./iframe-Bg1V8O6K.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./links.component-DBbFpAyB.js";function s(t){const n={a:"a",em:"em",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...r(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(d,{title:"Typography/Links/documentation"}),`
`,e.jsx(o,{of:p}),`
`,e.jsx(h,{of:x,sourceState:"none"}),`
`,e.jsx(n.p,{children:"The pre-formatted Link is a customizable, purpose-driven link component that enhances the ODS Link by incorporating visual and functional elements such as icons and predefined behaviors ?"}),`
`,e.jsx(i,{label:"Overview",level:2}),`
`,e.jsx(a,{aliases:["Menu","Ellipsis Menu","Dropdown Menu"],atomicType:"",figmaLink:"https://www.figma.com/design/9jDDTcR4a9jPRFcdjawAlf/ODS---UI-Kit?node-id=1-6634",githubUrl:"https://github.com/ovh/design-system/tree/master/packages/ods/src/components/accordion",name:"ActionMenu",relatedComponents:[{name:"link"}],children:e.jsx(n.p,{children:`Its primary role is to provide clear and intuitive navigation options (e.g.,
"Back," "Next," or external redirections) while maintaining consistency with
the overall design system.`})}),`
`,e.jsx(i,{label:"Anatomy",level:2}),`
`,e.jsx(n.p,{children:"add the image here"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"An ODS Link"})," which contains:"]}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsx(n.li,{children:"An ODS Icon depending of the usage: External, Back or Next"}),`
`,e.jsx(n.li,{children:"A label: a clear text label that describes the action or destination"}),`
`]}),`
`,e.jsx(i,{label:"Usage",level:2}),`
`,e.jsxs(n.p,{children:["A ",e.jsx(n.strong,{children:"pre-formatted Link"})," is ideal for:"]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"External links"}),": clearly communicating that the user will leave the current context"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:'"Back" links'}),": providing an option to navigate to a previous page or step"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:'"Next" links'}),": guiding users to the next step in a process or section"]}),`
`]}),`
`,e.jsx(i,{label:"Dos & Don'ts",level:2}),`
`,e.jsx(l,{dos:["Use clear, concise labels for the links","Use the appropriate variant with the link type (e.g., external link for external navigation)"],donts:["Do not use for inline links where iconography adds no value","Avoid overloading a page with too many pre-formatted Links; prioritize simplicity"]}),`
`,e.jsx(i,{label:"Placement",level:2}),`
`,e.jsxs(n.p,{children:["Similar to a standard link and ODS Link, a ",e.jsx(n.strong,{children:"pre-formatted Link"})," can:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Stand alone on a page"}),`
`,e.jsx(n.li,{children:"Be embedded within a sentence or paragraph for contextual navigation"}),`
`]}),`
`,e.jsx(i,{label:"Behavior",level:2}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"States"}),`
The `,e.jsx(n.strong,{children:"pre-formatted Link"})," inherits its states from the ODS Link. These states include:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Hover"}),": Link becomes underlined, and its color changes"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Focus"}),": Visual focus indicator, outline, appears"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Click"}),": Activates the link, redirecting the user"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Visited"}),": After a user has clicked on the link, the color changes to indicate that the destination has already been visited"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Disabled"}),": Link is non-interactive; it cannot be clicked or focused"]}),`
`]}),`
`,e.jsxs(n.p,{children:["When users clicks anywhere on the ",e.jsx(n.strong,{children:"Link"}),", even its icon, they are redirected to the expected page or section."]}),`
`,e.jsx(i,{label:"Variation",level:2}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Pre-formatted Link"})," has three predefined variants based on usage:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"External"}),`
`,e.jsx(n.li,{children:"Back"}),`
`,e.jsx(n.li,{children:"Next"}),`
`]}),`
`,e.jsx(i,{label:"Accessibility",level:2}),`
`,e.jsxs(n.p,{children:[e.jsx(n.em,{children:`Ensure the component meets accessibility standards.
Describe what should keyboard interaction do to the component
WAI Patterns can help you go though keyboard interaction :`})," ",e.jsx(n.strong,{children:e.jsx(n.a,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/",rel:"nofollow",children:"https://www.w3.org/WAI/ARIA/apg/patterns/"})})]}),`
`,e.jsx(c,{data:{columns:["key","interaction"],rows:[{key:"Tab",interaction:"Navigate to the Link"},{key:"Enter while Link is focused",interaction:"Activate the Link"}]}})]})}function M(t={}){const{wrapper:n}={...r(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(s,{...t})}):s(t)}export{M as default};
