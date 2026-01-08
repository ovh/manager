import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as r}from"./index-BgWqaNhW.js";import{M as a,C as l}from"./index-BFzAcuM3.js";import{T as o,O as c}from"./tabs.stories-B5DytMWs.js";import{B as d,H as n,E as h}from"./Heading-BJY1CP7a.js";import{I as p,B as x}from"./IdentityCard-DZBiPMNp.js";import"./index-Bnop-kX6.js";import"./iframe-DxxJ0EuQ.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./TabContent-fruP9qhA-B5VnEOA-.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./render-strategy-BVcZ76SI-DDawKQXU.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./ods-react236-aAAP9SXj.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./ods-react60-0db41gCx.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./controls-BtiQQn1l.js";import"./ods-docgen-map-C6vdLMLl.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Divider-THit99OS-DE11lmva.js";function i(t){const s={code:"code",em:"em",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",...r(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(a,{of:o,name:"Documentation"}),`
`,e.jsx(d,{of:o}),`
`,e.jsx(s.p,{children:e.jsxs(s.em,{children:[e.jsx(s.strong,{children:"Tabs"})," are a way of navigating between multiple panels, reducing clutter and fitting more into a smaller space"]})}),`
`,e.jsx(l,{of:c,sourceState:"none"}),`
`,e.jsx(n,{label:"Overview",level:2}),`
`,e.jsx(p,{aliases:["Tab Navigation","Tabbed interface"],figmaLink:"https://www.figma.com/design/9jDDTcR4a9jPRFcdjawAlf/ODS---UI-Kit?node-id=52-11168",githubUrl:"@ovhcloud/ods-react",name:"Tabs",children:e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Tabs"})," are used to organize content by grouping similar information on the same page."]})}),`
`,e.jsx(n,{label:"Usage",level:2}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Tabs"})," component is ideal for dashboards, settings pages, profile sections, and any interface where multiple views need to be accessible from the same page."]}),`
`,e.jsx(s.p,{children:"They can also be used to filter content via some common denominator."}),`
`,e.jsx(n,{label:"Dos & Don'ts",level:3}),`
`,e.jsx(x,{donts:["- Don't use Tabs as a progress indicator or wizard steps","- Don't nest Tabs inside other Tabs, this creates a confusing and hard-to-navigate experience","- Don't overload the interface with too many tabs. Use dropdowns if you need more than 5 tabs","- Don't use long or verbose labels","- Don't use external links or actions as tab triggers, Tabs should only control the visibility of in-page content"],dos:["- Use Tabs to group related content under the same page when it fits in a shared context","- Keep Tab labels short, clear, and scannable, use nouns or very short phrases (1–3 words max)","- Use Tabs for horizontal navigation, not hierarchical structure or progressive steps"]}),`
`,e.jsx(n,{label:"Best Practices in Context",level:3}),`
`,e.jsx(s.p,{children:e.jsx(s.img,{src:"components/tabs/anatomy.png",alt:"Component anatomy",title:"Component anatomy"})}),`
`,e.jsxs(s.ol,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"Tabs"})}),`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"Scroll Buttons (previous/next) - optional"})}),`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"Active tab"})}),`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"Unselected tab"})}),`
`]}),`
`,e.jsx(n,{label:"Placement",level:2}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Tabs"})," are often used in the top part of a web page, as it can act as a navigation focus."]}),`
`,e.jsx(n,{label:"Behavior",level:2}),`
`,e.jsxs(s.p,{children:["By default, one of the ",e.jsx(s.strong,{children:"Tab"})," is always selected."]}),`
`,e.jsxs(s.p,{children:["Each ",e.jsx(s.strong,{children:"Tab"})," can be hovered, focused and selected. A ",e.jsx(s.strong,{children:"Tab"})," can also act as a disabled ",e.jsx(s.strong,{children:"Tab"}),"."]}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Tabs"})," always stay on the same line, and can be horizontally scrolled through if they happen to not fit their container."]}),`
`,e.jsxs(s.p,{children:["Each ",e.jsx(s.strong,{children:"Tab"})," has a panel displaying content. Selecting a ",e.jsx(s.strong,{children:"Tab"})," displays the corresponding panel."]}),`
`,e.jsxs(s.p,{children:["The panel does not depend on the ",e.jsx(s.strong,{children:"Tab"})," component, it is in the developer's hands."]}),`
`,e.jsx(n,{label:"Scroll Buttons",level:3}),`
`,e.jsxs(s.p,{children:["When the number of ",e.jsx(s.strong,{children:"Tabs"})," exceeds the visible container width, left and right scroll buttons can be displayed to allow horizontal navigation."]}),`
`,e.jsxs(s.p,{children:["Clicking a button scrolls to the next or previous group of ",e.jsx(s.strong,{children:"Tabs"})," that were not visible."]}),`
`,e.jsx(s.p,{children:"When at the first tab, the left button is displayed but disabled."}),`
`,e.jsx(s.p,{children:"When at the last tab, the right button is displayed but disabled."}),`
`,e.jsxs(s.p,{children:["Scroll buttons do not affect tab selection. They only change the visible portion of the ",e.jsx(s.strong,{children:"Tabs"})," list."]}),`
`,e.jsx(n,{label:"Navigation",level:2}),`
`,e.jsx(n,{label:"Focus Management",level:3}),`
`,e.jsxs(s.p,{children:["When focus moves to the ",e.jsx(s.strong,{children:"Tabs"})," component, it is set on the active ",e.jsx(s.strong,{children:"Tab"}),"."]}),`
`,e.jsxs(s.p,{children:["Once a ",e.jsx(s.strong,{children:"Tab"})," is focused, its associated content is also activated."]}),`
`,e.jsx(n,{label:"General Keyboard Shortcuts",level:3}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Tab"})," moves focus into or out of the ",e.jsx(s.strong,{children:"Tabs"})," component while keeping the active ",e.jsx(s.strong,{children:"Tab"})," selected."]}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Arrow Right"})," moves focus to the next ",e.jsx(s.strong,{children:"Tab"})," and activates its content."]}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Arrow Left"})," moves focus to the previous ",e.jsx(s.strong,{children:"Tab"})," and activates its content."]}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Home"})," / ",e.jsx(s.code,{children:"fn"})," + ",e.jsx(s.code,{children:"Arrow Left"})," moves focus to the first ",e.jsx(s.strong,{children:"Tab"})," and activates its content."]}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"End"})," / ",e.jsx(s.code,{children:"fn"})," + ",e.jsx(s.code,{children:"Arrow Right"})," moves focus to the last ",e.jsx(s.strong,{children:"Tab"})," and activates its content."]}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Home"})," / ",e.jsx(s.code,{children:"End"})," jumps to the first or last ",e.jsx(s.strong,{children:"Tab"}),", even if these ",e.jsx(s.strong,{children:"Tabs"})," are not currently visible. In this case, the ",e.jsx(s.strong,{children:"Tabs"})," list automatically scrolls to bring the selected ",e.jsx(s.strong,{children:"Tab"})," into view."]}),`
`,e.jsxs(s.p,{children:["Arrow navigation moves focus to the next or previous ",e.jsx(s.strong,{children:"Tab"}),", even if it is not currently visible. In this case, the ",e.jsx(s.strong,{children:"Tabs"})," list automatically scrolls to bring the focused ",e.jsx(s.strong,{children:"Tab"})," into view."]}),`
`,e.jsx(n,{label:"Accessibility",level:2}),`
`,e.jsxs(s.p,{children:["This component complies with the ",e.jsx(h,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/tabs/",children:"Tabs WAI-ARIA design pattern"}),"."]})]})}function F(t={}){const{wrapper:s}={...r(),...t.components};return s?e.jsx(s,{...t,children:e.jsx(i,{...t})}):i(t)}export{F as default};
