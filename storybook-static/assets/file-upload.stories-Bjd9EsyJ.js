import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{L as pe,S as me}from"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import{z as n,O as c,R as a,n as I}from"./FileUploadList-vr0-n6P2-CaW-_Mq4.js";import{r as i}from"./index-Bnop-kX6.js";import{e as fe,o as ue,C as F}from"./controls-BtiQQn1l.js";import{d as y,s as m}from"./ods-docgen-map-C6vdLMLl.js";n.__docgenInfo=y.fileUpload;c.__docgenInfo=y.fileUploadItem;a.__docgenInfo=y.fileUploadList;const ge={argTypes:fe(["accept","locale","name","onFileAccept","onFileReject","required"]),component:n,subcomponents:{FileUploadItem:c,FileUploadList:a},title:"Manager UI Kit/Components/File Upload/Base"},u={render:s=>{const[l,o]=i.useState(""),[r,d]=i.useState([]);function f({files:p}){d(p),o("")}function t({files:p}){o(p.length?"File(s) rejected":"")}return e.jsx(n,{...s,error:s.error||l,onFileAccept:f,onFileReject:t,children:e.jsx(a,{children:r.map((p,Fe)=>e.jsx(c,{file:p},Fe))})})},argTypes:ue({acceptedFileLabel:{table:{category:F.general},control:"text"},disabled:{table:{category:F.general},control:"boolean"},dropzoneLabel:{table:{category:F.general},control:"text"},error:{table:{category:F.general},control:"text"},invalid:{table:{category:F.general},control:"boolean"},maxFile:{table:{category:F.general},control:"number"},maxFileLabel:{table:{category:F.general},control:"text"},maxSize:{table:{category:F.general},control:"number"},maxSizeLabel:{table:{category:F.general},control:"text"},triggerLabel:{table:{category:F.general},control:"text"}})},g={globals:{imports:`import { FileUpload, FileUploadItem, FileUploadList } from '@ovhcloud/ods-react';
import { useState } from 'react';`},tags:["!dev"],parameters:{docs:{source:{...m()}}},render:({})=>{const[s,l]=i.useState(""),[o,r]=i.useState([]);function d({files:t}){r(t),l("")}function f({files:t}){l(t.length?"File(s) not of the expected format":"")}return e.jsx(n,{accept:"image/png",acceptedFileLabel:"Png files only",error:s,onFileAccept:d,onFileReject:f,children:e.jsx(a,{children:o.map((t,p)=>e.jsx(c,{file:t},p))})})}},U={globals:{imports:`import { FILE_UPLOAD_I18N, FileUpload, FileUploadItem, FileUploadList } from '@ovhcloud/ods-react';
import { useState } from 'react';`},tags:["!dev"],parameters:{docs:{source:{...m()}}},render:({})=>{const[s,l]=i.useState([]);return e.jsx(n,{onFileAccept:({files:o})=>l(o),children:e.jsx(a,{children:s.map((o,r)=>e.jsx(c,{file:o,i18n:{[I.cancelButton]:`Cancel uploading ${o.name}`,[I.deleteButton]:`Remove ${o.name}`,[I.progressBar]:`Uploading ${o.name}`}},r))})})}},x={globals:{imports:`import { FileUpload, FileUploadItem, FileUploadList } from '@ovhcloud/ods-react';
import { useState } from 'react';`},tags:["!dev"],parameters:{docs:{source:{...m()}}},render:({})=>{const[s,l]=i.useState([]);return e.jsx(n,{acceptedFileLabel:"Formats acceptés : images",dropzoneLabel:"Glisser-déposer des fichiers",maxFile:3,maxFileLabel:"Nombre maximal de fichiers :",maxSize:524288e3,maxSizeLabel:"Taille de fichier max :",onFileAccept:({files:o})=>l(o),triggerLabel:"Parcourir les fichiers",children:e.jsx(a,{children:s.map((o,r)=>e.jsx(c,{file:o,progress:100,uploadSuccessLabel:"Fichier uploadé"},r))})})}},L={globals:{imports:`import { FileUpload, FileUploadItem, FileUploadList } from '@ovhcloud/ods-react';
import { useState } from 'react';`},tags:["!dev"],parameters:{docs:{source:{...m()}}},render:({})=>{const[s,l]=i.useState([]);return e.jsx(n,{onFileAccept:({files:o})=>l(o),children:e.jsx(a,{children:s.map((o,r)=>e.jsx(c,{file:o},r))})})}},b={globals:{imports:"import { FileUpload, FileUploadList } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...m()}}},render:({})=>e.jsx(n,{disabled:!0,children:e.jsx(a,{})})},S={globals:{imports:`import { FileUpload, FileUploadItem, FileUploadList } from '@ovhcloud/ods-react';
import { useState } from 'react';`},tags:["!dev"],parameters:{docs:{source:{...m()}}},render:({})=>{const[s,l]=i.useState(""),[o,r]=i.useState([]);function d({files:t}){r(t),l("")}function f({files:t}){l(t.length?"Too many files":"")}return e.jsx(n,{error:s,maxFile:3,maxFileLabel:"Maximum file allowed:",onFileAccept:d,onFileReject:f,children:e.jsx(a,{children:o.map((t,p)=>e.jsx(c,{file:t},p))})})}},h={globals:{imports:`import { FileUpload, FileUploadItem, FileUploadList } from '@ovhcloud/ods-react';
import { useState } from 'react';`},tags:["!dev"],parameters:{docs:{source:{...m()}}},render:({})=>{const[s,l]=i.useState(""),[o,r]=i.useState([]);function d({files:t}){r(t),l("")}function f({files:t}){l(t.length?"File(s) too large":"")}return e.jsx(n,{error:s,maxSize:1e6,maxSizeLabel:"No file larger than:",onFileAccept:d,onFileReject:f,children:e.jsx(a,{children:o.map((t,p)=>e.jsx(c,{file:t},p))})})}},j={tags:["!dev"],parameters:{layout:"centered",docs:{source:{...m()}}},render:({})=>{const[s,l]=i.useState([]);return e.jsx(n,{onFileAccept:({files:o})=>l(o),children:e.jsx(a,{children:s.map((o,r)=>e.jsx(c,{file:o},r))})})}},v={globals:{imports:`import { FileUpload, FileUploadItem, FileUploadList } from '@ovhcloud/ods-react';
import { useEffect, useState } from 'react';`},tags:["!dev"],parameters:{docs:{source:{...m()}}},render:({})=>{const[s,l]=i.useState([]);i.useEffect(()=>{s.forEach(r=>{r.progress||o(r)})},[s]);function o(r){const d=setInterval(()=>{l(f=>f.map(t=>(t.name===r.name&&(t.progress=(t.progress||0)+Math.floor(Math.random()*10+1),t.progress>=100&&clearInterval(d)),t)))},100)}return e.jsx(n,{onFileAccept:({files:r})=>l(r),children:e.jsx(a,{children:s.map((r,d)=>e.jsx(c,{error:r.error,file:r,progress:r.progress},d))})})}},R={globals:{imports:`import { FileUpload, FileUploadItem, FileUploadList, FormField, FormFieldLabel } from '@ovhcloud/ods-react';
import { useState } from 'react';`},tags:["!dev"],parameters:{docs:{source:{...m()}}},render:({})=>{const[s,l]=i.useState([]);return e.jsxs(pe,{children:[e.jsx(me,{children:"Files:"}),e.jsx(n,{onFileAccept:({files:o})=>l(o),children:e.jsx(a,{children:s.map((o,r)=>e.jsx(c,{file:o},r))})})]})}},A={globals:{imports:`import { FileUpload, FileUploadItem, FileUploadList, FormField, FormFieldLabel } from '@ovhcloud/ods-react';
import { useState } from 'react';`},tags:["!dev"],parameters:{docs:{source:{...m()}}},render:({})=>{const[s,l]=i.useState([]);return e.jsxs(pe,{children:[e.jsx(me,{children:"Files:"}),e.jsx(n,{onFileAccept:({files:o})=>l(o),children:e.jsx(a,{children:s.map((o,r)=>e.jsx(c,{file:o},r))})})]})}};var O,C,E;u.parameters={...u.parameters,docs:{...(O=u.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: arg => {
    const [error, setError] = useState<string>('');
    const [files, setFiles] = useState<File[]>([]);
    function onAccept({
      files
    }: FileUploadAcceptDetail): void {
      setFiles(files);
      setError('');
    }
    function onReject({
      files
    }: FileUploadRejectDetail): void {
      setError(files.length ? 'File(s) rejected' : '');
    }
    return <FileUpload {...arg} error={arg.error || error} onFileAccept={onAccept} onFileReject={onReject}>
        <FileUploadList>
          {files.map((file: File, idx) => <FileUploadItem file={file} key={idx} />)}
        </FileUploadList>
      </FileUpload>;
  },
  argTypes: orderControls({
    acceptedFileLabel: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'text'
    },
    disabled: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'boolean'
    },
    dropzoneLabel: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'text'
    },
    error: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'text'
    },
    invalid: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'boolean'
    },
    maxFile: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'number'
    },
    maxFileLabel: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'text'
    },
    maxSize: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'number'
    },
    maxSizeLabel: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'text'
    },
    triggerLabel: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'text'
    }
  })
}`,...(E=(C=u.parameters)==null?void 0:C.docs)==null?void 0:E.source}}};var _,T,z;g.parameters={...g.parameters,docs:{...(_=g.parameters)==null?void 0:_.docs,source:{originalSource:`{
  globals: {
    imports: \`import { FileUpload, FileUploadItem, FileUploadList } from '@ovhcloud/ods-react';
import { useState } from 'react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => {
    const [error, setError] = useState<string>('');
    const [files, setFiles] = useState<File[]>([]);
    function onAccept({
      files
    }: FileUploadAcceptDetail): void {
      setFiles(files);
      setError('');
    }
    function onReject({
      files
    }: FileUploadRejectDetail): void {
      setError(files.length ? 'File(s) not of the expected format' : '');
    }
    return <FileUpload accept="image/png" acceptedFileLabel="Png files only" error={error} onFileAccept={onAccept} onFileReject={onReject}>
        <FileUploadList>
          {files.map((file: File, idx) => <FileUploadItem file={file} key={idx} />)}
        </FileUploadList>
      </FileUpload>;
  }
}`,...(z=(T=g.parameters)==null?void 0:T.docs)==null?void 0:z.source}}};var D,N,M;U.parameters={...U.parameters,docs:{...(D=U.parameters)==null?void 0:D.docs,source:{originalSource:`{
  globals: {
    imports: \`import { FILE_UPLOAD_I18N, FileUpload, FileUploadItem, FileUploadList } from '@ovhcloud/ods-react';
import { useState } from 'react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => {
    const [files, setFiles] = useState<File[]>([]);
    return <FileUpload onFileAccept={({
      files
    }) => setFiles(files)}>
        <FileUploadList>
          {files.map((file: File, idx) => <FileUploadItem file={file} i18n={{
          [FILE_UPLOAD_I18N.cancelButton]: \`Cancel uploading \${file.name}\`,
          [FILE_UPLOAD_I18N.deleteButton]: \`Remove \${file.name}\`,
          [FILE_UPLOAD_I18N.progressBar]: \`Uploading \${file.name}\`
        }} key={idx} />)}
        </FileUploadList>
      </FileUpload>;
  }
}`,...(M=(N=U.parameters)==null?void 0:N.docs)==null?void 0:M.source}}};var G,k,Y;x.parameters={...x.parameters,docs:{...(G=x.parameters)==null?void 0:G.docs,source:{originalSource:`{
  globals: {
    imports: \`import { FileUpload, FileUploadItem, FileUploadList } from '@ovhcloud/ods-react';
import { useState } from 'react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => {
    const [files, setFiles] = useState<File[]>([]);
    return <FileUpload acceptedFileLabel="Formats acceptés : images" dropzoneLabel="Glisser-déposer des fichiers" maxFile={3} maxFileLabel="Nombre maximal de fichiers :" maxSize={524288000} maxSizeLabel="Taille de fichier max :" onFileAccept={({
      files
    }) => setFiles(files)} triggerLabel="Parcourir les fichiers">
        <FileUploadList>
          {files.map((file: File, idx) => <FileUploadItem file={file} key={idx} progress={100} uploadSuccessLabel="Fichier uploadé" />)}
        </FileUploadList>
      </FileUpload>;
  }
}`,...(Y=(k=x.parameters)==null?void 0:k.docs)==null?void 0:Y.source}}};var P,B,$;L.parameters={...L.parameters,docs:{...(P=L.parameters)==null?void 0:P.docs,source:{originalSource:`{
  globals: {
    imports: \`import { FileUpload, FileUploadItem, FileUploadList } from '@ovhcloud/ods-react';
import { useState } from 'react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => {
    const [files, setFiles] = useState<File[]>([]);
    return <FileUpload onFileAccept={({
      files
    }) => setFiles(files)}>
        <FileUploadList>
          {files.map((file: File, idx) => <FileUploadItem file={file} key={idx} />)}
        </FileUploadList>
      </FileUpload>;
  }
}`,...($=(B=L.parameters)==null?void 0:B.docs)==null?void 0:$.source}}};var w,q,K;b.parameters={...b.parameters,docs:{...(w=b.parameters)==null?void 0:w.docs,source:{originalSource:`{
  globals: {
    imports: \`import { FileUpload, FileUploadList } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <FileUpload disabled>
      <FileUploadList />
    </FileUpload>
}`,...(K=(q=b.parameters)==null?void 0:q.docs)==null?void 0:K.source}}};var H,J,Q;S.parameters={...S.parameters,docs:{...(H=S.parameters)==null?void 0:H.docs,source:{originalSource:`{
  globals: {
    imports: \`import { FileUpload, FileUploadItem, FileUploadList } from '@ovhcloud/ods-react';
import { useState } from 'react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => {
    const [error, setError] = useState<string>('');
    const [files, setFiles] = useState<File[]>([]);
    function onAccept({
      files
    }: FileUploadAcceptDetail): void {
      setFiles(files);
      setError('');
    }
    function onReject({
      files
    }: FileUploadRejectDetail): void {
      setError(files.length ? 'Too many files' : '');
    }
    return <FileUpload error={error} maxFile={3} maxFileLabel="Maximum file allowed:" onFileAccept={onAccept} onFileReject={onReject}>
        <FileUploadList>
          {files.map((file: File, idx) => <FileUploadItem file={file} key={idx} />)}
        </FileUploadList>
      </FileUpload>;
  }
}`,...(Q=(J=S.parameters)==null?void 0:J.docs)==null?void 0:Q.source}}};var V,W,X;h.parameters={...h.parameters,docs:{...(V=h.parameters)==null?void 0:V.docs,source:{originalSource:`{
  globals: {
    imports: \`import { FileUpload, FileUploadItem, FileUploadList } from '@ovhcloud/ods-react';
import { useState } from 'react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => {
    const [error, setError] = useState<string>('');
    const [files, setFiles] = useState<File[]>([]);
    function onAccept({
      files
    }: FileUploadAcceptDetail): void {
      setFiles(files);
      setError('');
    }
    function onReject({
      files
    }: FileUploadRejectDetail): void {
      setError(files.length ? 'File(s) too large' : '');
    }
    return <FileUpload error={error} maxSize={1000000} maxSizeLabel="No file larger than:" onFileAccept={onAccept} onFileReject={onReject}>
        <FileUploadList>
          {files.map((file: File, idx) => <FileUploadItem file={file} key={idx} />)}
        </FileUploadList>
      </FileUpload>;
  }
}`,...(X=(W=h.parameters)==null?void 0:W.docs)==null?void 0:X.source}}};var Z,ee,oe;j.parameters={...j.parameters,docs:{...(Z=j.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => {
    const [files, setFiles] = useState<File[]>([]);
    return <FileUpload onFileAccept={({
      files
    }) => setFiles(files)}>
        <FileUploadList>
          {files.map((file: File, idx) => <FileUploadItem file={file} key={idx} />)}
        </FileUploadList>
      </FileUpload>;
  }
}`,...(oe=(ee=j.parameters)==null?void 0:ee.docs)==null?void 0:oe.source}}};var re,le,te;v.parameters={...v.parameters,docs:{...(re=v.parameters)==null?void 0:re.docs,source:{originalSource:`{
  globals: {
    imports: \`import { FileUpload, FileUploadItem, FileUploadList } from '@ovhcloud/ods-react';
import { useEffect, useState } from 'react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => {
    type MyFile = File & {
      error?: string;
      progress?: number;
    };
    const [files, setFiles] = useState<MyFile[]>([]);
    useEffect(() => {
      files.forEach(file => {
        if (!file.progress) {
          uploadFile(file);
        }
      });
    }, [files]);
    function uploadFile(file: MyFile): void {
      const intervalId = setInterval(() => {
        setFiles(files => files.map(f => {
          if (f.name === file.name) {
            f.progress = (f.progress || 0) + Math.floor(Math.random() * 10 + 1);
            if (f.progress >= 100) {
              clearInterval(intervalId);
            }
          }
          return f;
        }));
      }, 100);
    }
    return <FileUpload onFileAccept={({
      files
    }) => setFiles(files)}>
        <FileUploadList>
          {files.map((file, idx) => <FileUploadItem error={file.error} file={file} key={idx} progress={file.progress} />)}
        </FileUploadList>
      </FileUpload>;
  }
}`,...(te=(le=v.parameters)==null?void 0:le.docs)==null?void 0:te.source}}};var se,ie,ne;R.parameters={...R.parameters,docs:{...(se=R.parameters)==null?void 0:se.docs,source:{originalSource:`{
  globals: {
    imports: \`import { FileUpload, FileUploadItem, FileUploadList, FormField, FormFieldLabel } from '@ovhcloud/ods-react';
import { useState } from 'react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => {
    const [files, setFiles] = useState<File[]>([]);
    return <FormField>
          <FormFieldLabel>
            Files:
          </FormFieldLabel>

          <FileUpload onFileAccept={({
        files
      }) => setFiles(files)}>
            <FileUploadList>
              {files.map((file: File, idx) => <FileUploadItem file={file} key={idx} />)}
            </FileUploadList>
          </FileUpload>
        </FormField>;
  }
}`,...(ne=(ie=R.parameters)==null?void 0:ie.docs)==null?void 0:ne.source}}};var ae,ce,de;A.parameters={...A.parameters,docs:{...(ae=A.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  globals: {
    imports: \`import { FileUpload, FileUploadItem, FileUploadList, FormField, FormFieldLabel } from '@ovhcloud/ods-react';
import { useState } from 'react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => {
    const [files, setFiles] = useState<File[]>([]);
    return <FormField>
        <FormFieldLabel>
          Files:
        </FormFieldLabel>

        <FileUpload onFileAccept={({
        files
      }) => setFiles(files)}>
          <FileUploadList>
            {files.map((file: File, idx) => <FileUploadItem file={file} key={idx} />)}
          </FileUploadList>
        </FileUpload>
      </FormField>;
  }
}`,...(de=(ce=A.parameters)==null?void 0:ce.docs)==null?void 0:de.source}}};const Ue=["Demo","Accept","AccessibilityFileButton","CustomLabels","Default","Disabled","MaxFile","MaxSize","Overview","Upload","InFormField","AccessibilityFormField"],ve=Object.freeze(Object.defineProperty({__proto__:null,Accept:g,AccessibilityFileButton:U,AccessibilityFormField:A,CustomLabels:x,Default:L,Demo:u,Disabled:b,InFormField:R,MaxFile:S,MaxSize:h,Overview:j,Upload:v,__namedExportsOrder:Ue,default:ge},Symbol.toStringTag,{value:"Module"}));export{A,x as C,L as D,ve as F,R as I,S as M,j as O,v as U,U as a,b,g as c,h as d};
