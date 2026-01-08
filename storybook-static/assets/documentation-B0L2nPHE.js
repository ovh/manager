import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as d}from"./index-BgWqaNhW.js";import{t as i}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l as o}from"./ods-react60-0db41gCx.js";import{M as c,C as p}from"./index-BFzAcuM3.js";import{F as r,O as h,A as u,a as m}from"./file-upload.stories-Bjd9EsyJ.js";import{B as x,H as n}from"./Heading-BJY1CP7a.js";import{I as j,B as f}from"./IdentityCard-DZBiPMNp.js";import{C as a}from"./Canvas-C0itSVU5.js";import"./index-Bnop-kX6.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./iframe-DxxJ0EuQ.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./FileUploadList-vr0-n6P2-CaW-_Mq4.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./ods-react236-aAAP9SXj.js";import"./Divider-THit99OS-DE11lmva.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./index-D_fe-3SC-C5ZKsUXO.js";import"./use-field-context-C3OOq-03-DvM5qnyl.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./ProgressBar-DyF6GCp5-C0AeSb5S.js";import"./controls-BtiQQn1l.js";import"./ods-docgen-map-C6vdLMLl.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-CvUaUdhv.js";function t(l){const s={code:"code",em:"em",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...d(),...l.components};return e.jsxs(e.Fragment,{children:[e.jsx(c,{of:r,name:"Documentation"}),`
`,e.jsx(x,{of:r}),`
`,e.jsx(s.p,{children:e.jsxs(s.em,{children:[e.jsx(s.strong,{children:"File Upload"})," allows users to select one or more files to upload to a specific location."]})}),`
`,e.jsx(p,{of:h,sourceState:"none"}),`
`,e.jsx(n,{label:"Overview",level:2}),`
`,e.jsxs(j,{aliases:["File input","File uploader","Dropzone"],figmaLink:"https://www.figma.com/design/9jDDTcR4a9jPRFcdjawAlf/ODS---UI-Kit?node-id=55-24358",githubUrl:"@ovhcloud/ods-react",name:"File Upload",children:[e.jsxs(s.p,{children:["The ",e.jsx(s.strong,{children:"File Upload"})," component is used to enable users to upload files to a server or application."]}),e.jsx(s.p,{children:`It provides a way to browse, select, and upload files, and is accompanied by progress indicators and feedback
messages to guide users through the process.`})]}),`
`,e.jsx(n,{label:"Usage",level:2}),`
`,e.jsxs(s.p,{children:["Use the ",e.jsx(s.strong,{children:"File Upload"})," component when you need users to submit files, such as documents, images, or other data."]}),`
`,e.jsx(s.p,{children:"Common use cases include form submissions, profile picture updates, and document management systems."}),`
`,e.jsx(n,{label:"Dos & Don'ts",level:3}),`
`,e.jsx(f,{donts:["- Don't place the File Upload component inside a modal unless absolutely necessary","- Don't allow file uploads without providing feedback or confirmation","- Don't assume users know upload limitations. Make restrictions explicit"],dos:["- Use a single File Upload component per context when allowing users to upload multiple files on the same page","- Clearly communicate constraints such as file type, size limits, or max number of files","- Use short and clear success message once the upload is complete","- Ensure error messages are specific and actionable (e.g., “File exceeds 5MB limit” instead of a generic “Upload failed”)"]}),`
`,e.jsx(n,{label:"Best Practices in Context",level:3}),`
`,e.jsx(s.p,{children:e.jsx(s.img,{src:"./base-assets/components/file-upload/anatomy.png",alt:"Component anatomy",title:"Component anatomy"})}),`
`,e.jsxs(s.ol,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"File Upload"})}),`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"Dropzone"})}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Description"})," - optional (file limitations)"]}),`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"Upload button"})}),`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"Uploaded files zone"})}),`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"Delete button"})}),`
`]}),`
`,e.jsx(n,{label:"Placement",level:2}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"File Upload"})," component can be part of a complex form, or displayed as a standalone."]}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"File Upload"})," has an automatic default width, based on its content."]}),`
`,e.jsx(n,{label:"Behavior",level:2}),`
`,e.jsx(n,{label:"Selecting files",level:3}),`
`,e.jsx(s.p,{children:'When selecting the "Browse" Button, the native file selection popup opens to retrieve the needed file to upload.'}),`
`,e.jsx(n,{label:"Drag & Drop",level:3}),`
`,e.jsxs(s.p,{children:["Users can drag & drop a file, the drop zone being the whole ",e.jsx(s.strong,{children:"File Upload"})," component."]}),`
`,e.jsx(n,{label:"Uploading files",level:3}),`
`,e.jsx(n,{label:"With known size",level:4}),`
`,e.jsx(s.p,{children:"When a file upload is in progress, the file name and its size are displayed."}),`
`,e.jsx(s.p,{children:"A Progress Bar with its percentage is displayed to indicate how the upload is progressing. It remains visible as long as the file uploading is not finished yet."}),`
`,e.jsx(s.p,{children:"A close icon Button is displayed as soon as a file upload is in progress. It is displayed as long as the user does not interrupt the upload or removes an already uploaded file."}),`
`,e.jsx(n,{label:"With unknown size",level:4}),`
`,e.jsx(s.p,{children:"In some situations, file size is hidden in the uploading process due to an unknown file size."}),`
`,e.jsx(n,{label:"Upload complete",level:3}),`
`,e.jsx(n,{label:"With success",level:4}),`
`,e.jsxs(s.p,{children:["A ",e.jsx(s.code,{children:"success"})," message is displayed, replacing the previously displayed Progress Bar, as soon as a file has been uploaded, meaning the upload is successful and complete."]}),`
`,e.jsx(n,{label:"With error",level:4}),`
`,e.jsxs(s.p,{children:["If the uploading of a file went wrong, a specific ",e.jsx(s.code,{children:"error"})," message is displayed below the uploaded file."]}),`
`,e.jsxs(s.p,{children:["The user is still able to upload another file but the ",e.jsx(s.code,{children:"error"})," message will persist until user removes the file in ",e.jsx(s.code,{children:"error"}),"."]}),`
`,e.jsxs(s.p,{children:["When several files are in ",e.jsx(s.code,{children:"error"}),", there will be an accumulation of ",e.jsx(s.code,{children:"error"})," messages, each below their related files."]}),`
`,e.jsxs(s.p,{children:["When a file is in ",e.jsx(s.code,{children:"error"})," and the user uploads a file without any issue, success message is triggered as expected below this file but, the ",e.jsx(s.code,{children:"error"})," message persists below the file in error."]}),`
`,e.jsx(s.p,{children:"Depending on the error, the global component can be displayed in an error state."}),`
`,e.jsx(n,{label:"Extra behavior",level:3}),`
`,e.jsx(n,{label:"Global configuration / error",level:4}),`
`,e.jsx(s.p,{children:"Number of files, maximum sizes and expected formats can be set globally inside the component."}),`
`,e.jsxs(s.p,{children:["A global ",e.jsx(s.code,{children:"error"})," message and a Divider are displayed when:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"Wrong file format has been uploaded"}),`
`,e.jsx(s.li,{children:"Maximum file size exceeded"}),`
`,e.jsx(s.li,{children:"Maximum number of files exceeded"}),`
`]}),`
`,e.jsx(s.p,{children:"The global component is displayed in an error state in this situation."}),`
`,e.jsx(n,{label:"Disabled",level:4}),`
`,e.jsxs(s.p,{children:["When ",e.jsx(s.strong,{children:"File Upload"})," is disabled, user cannot interact with the Button and drag & drop feature is not available."]}),`
`,e.jsx(n,{label:"Cancel a file upload in progress",level:4}),`
`,e.jsxs(s.p,{children:["A click or press on the ",e.jsx(s.code,{children:"close"})," icon Button interrupts the upload (or cancel an uploaded file)."]}),`
`,e.jsxs(s.p,{children:["When the upload is canceled, the file upload is removed and the ",e.jsx(s.strong,{children:"File Upload"})," component returns to its default state, except for any other files in the queue."]}),`
`,e.jsx(s.p,{children:"In case some other files have already been uploaded, and the user cancels an uploading file, the next one will take its place in the queue and so on."}),`
`,e.jsx(n,{label:"Remove an already uploaded file",level:4}),`
`,e.jsxs(s.p,{children:["An already uploaded file can be removed by clicking or pressing the ",e.jsx(s.code,{children:"close"})," icon Button anytime."]}),`
`,e.jsx(s.p,{children:"Same as cancelling a file while it is uploading, if several files have already been uploaded and the user cancels an uploading file, the next one will take its place in the queue and so on."}),`
`,e.jsx(n,{label:"Navigation",level:2}),`
`,e.jsx(n,{label:"Focus Management",level:3}),`
`,e.jsxs(s.p,{children:["When tabbing through the page, the ",e.jsx(s.strong,{children:"File Upload"})," trigger button receives focus as part of the natural tab order."]}),`
`,e.jsx(s.p,{children:"If one or more files are being uploaded or already uploaded, each close icon button becomes focusable in the tab order, in the order files were added."}),`
`,e.jsx(s.p,{children:"If the component is disabled, it cannot receive focus and no interaction is possible."}),`
`,e.jsx(s.p,{children:"The drag-and-drop area does not receive focus but accepts dropped files while the component is enabled."}),`
`,e.jsx(n,{label:"General Keyboard Shortcuts",level:3}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Tab"})," moves focus forward through the ",e.jsx(s.strong,{children:"File Upload"})," trigger button and all available close icon buttons."]}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Shift"})," + ",e.jsx(s.code,{children:"Tab"})," moves focus backward through these same elements."]}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Enter"})," or ",e.jsx(s.code,{children:"Space"})," while the trigger button is focused opens the native file selection dialog."]}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Enter"})," or ",e.jsx(s.code,{children:"Space"})," on a close icon button cancels an upload in progress or removes the corresponding uploaded file from the list."]}),`
`,e.jsx(n,{label:"Accessibility",level:2}),`
`,e.jsxs(s.p,{children:["To ensure proper accessibility, the ",e.jsx(s.strong,{children:"File Upload"})," component must be correctly labeled and provide meaningful context when interactive elements (such as icon buttons) are used."]}),`
`,e.jsx(n,{label:"Always provide an explicit label",level:3}),`
`,e.jsxs(s.p,{children:["Every ",e.jsx(s.strong,{children:"File Upload"})," must have a clear and explicit label to ensure that users (especially screen reader users) understand its purpose, using either ",e.jsx(s.strong,{children:"FormField"})," or a native label tag."]}),`
`,e.jsx(a,{of:u,sourceState:"shown"}),`
`,e.jsxs(s.p,{children:[e.jsx(i,{name:o.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce the label, the field and its content."]}),`
`,e.jsx(n,{label:"Labeling cancel/delete Button",level:3}),`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.code,{children:"Cancel"})," and ",e.jsx(s.code,{children:"Delete"})," file buttons have to be explicit by adding context about their action and the file name."]}),`
`,e.jsx(a,{of:m,sourceState:"shown"}),`
`,e.jsxs(s.p,{children:[e.jsx(i,{name:o.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce the action and the file name."]})]})}function le(l={}){const{wrapper:s}={...d(),...l.components};return s?e.jsx(s,{...l,children:e.jsx(t,{...l})}):t(l)}export{le as default};
