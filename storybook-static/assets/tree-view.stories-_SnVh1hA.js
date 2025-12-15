import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{r as k}from"./index-Bnop-kX6.js";import{t as u}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l as x}from"./ods-react60-0db41gCx.js";import{x as A,s as b}from"./Button-BC-ipw2F-4e7GV2_-.js";import{a as fe}from"./ods-react236-aAAP9SXj.js";import{t as y}from"./ods-react65-wKxTpDjY.js";import{L as Ce,S as je}from"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import{P as i,D as o,w as c}from"./TreeViewNodes-BTaZHq6H-Zfg7PUSJ.js";import{e as ve,o as Ie,C as D}from"./controls-BtiQQn1l.js";import{d as he,s as p}from"./ods-docgen-map-C6vdLMLl.js";i.__docgenInfo=he.treeView;o.__docgenInfo=he.treeViewNode;const Ee={argTypes:ve(["defaultExpandedValue","defaultValue","items","onExpandedChange","onValueChange","expandedValue","value"]),component:i,subcomponents:{TreeViewNode:o},tags:["new"],title:"Manager UI Kit/Components/Tree View/Base"},g={render:t=>{const n=[{id:"src",name:"src",children:[{id:"app.tsx",name:"app.tsx"},{id:"index.ts",name:"index.ts"},{id:"components",name:"components",children:[{id:"Button.tsx",name:"Button.tsx"},{id:"Card.tsx",name:"Card.tsx"}]}]},{id:"package.json",name:"package.json"},{id:"readme.md",name:"README.md"}];return e.jsx(i,{defaultExpandedValue:t.defaultExpandedValue,disabled:t.disabled,expandedValue:t.expandedValue,items:n,multiple:t.multiple,children:e.jsx(c,{children:n.map(l=>e.jsx(o,{item:l},l.id))})})},argTypes:Ie({disabled:{table:{category:D.general},control:"boolean"},multiple:{table:{category:D.general},control:"boolean"}})},h={globals:{imports:"import { TreeView, TreeViewNode, TreeViewNodes } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...p()}}},render:({})=>{const t=[{id:"src",name:"src",children:[{id:"app.tsx",name:"app.tsx"},{id:"index.ts",name:"index.ts"},{id:"components",name:"components",children:[{id:"Button.tsx",name:"Button.tsx"},{id:"Card.tsx",name:"Card.tsx"}]}]},{id:"package.json",name:"package.json"},{id:"readme.md",name:"README.md"}];return e.jsx(i,{items:t,children:e.jsx(c,{children:t.map(n=>e.jsx(o,{item:n},n.id))})})}},T={tags:["!dev"],parameters:{docs:{source:{...p()}}},render:({})=>{const t=[{id:"src",name:"src",children:[{id:"app.tsx",name:"app.tsx"},{id:"index.ts",name:"index.ts"},{id:"components",name:"components",children:[{id:"Button.tsx",name:"Button.tsx"},{id:"Card.tsx",name:"Card.tsx"}]}]},{id:"package.json",name:"package.json"},{id:"readme.md",name:"README.md"}];return e.jsx(i,{items:t,children:e.jsx(c,{children:t.map(n=>e.jsx(o,{item:n},n.id))})})}},V={globals:{imports:"import { TreeView, TreeViewNode, TreeViewNodes } from '@ovhcloud/ods-react';"},parameters:{docs:{source:{...p()}}},tags:["!dev"],render:({})=>{const t=[{id:"src",name:"src",children:[{id:"app.tsx",name:"app.tsx"},{id:"index.ts",name:"index.ts"},{id:"components",name:"components",children:[{id:"Button.tsx",name:"Button.tsx"},{id:"Card.tsx",name:"Card.tsx"}]}]},{id:"package.json",name:"package.json"},{id:"readme.md",name:"README.md"}];return e.jsx(i,{items:t,multiple:!0,children:e.jsx(c,{children:t.map(n=>e.jsx(o,{item:n},n.id))})})}},w={globals:{imports:"import { TreeView, TreeViewNode, TreeViewNodes } from '@ovhcloud/ods-react';"},parameters:{docs:{source:{...p()}}},tags:["!dev"],render:({})=>{const t=[{id:"src",name:"src",children:[{id:"app.tsx",name:"app.tsx"},{id:"index.ts",name:"index.ts"},{id:"components",name:"components",children:[{id:"Button.tsx",name:"Button.tsx"},{id:"Card.tsx",name:"Card.tsx"}]}]},{id:"package.json",name:"package.json"},{id:"readme.md",name:"README.md"}];return e.jsx(i,{defaultExpandedValue:["src","components"],items:t,children:e.jsx(c,{children:t.map(n=>e.jsx(o,{item:n},n.id))})})}},N={globals:{imports:`import { TreeView, TreeViewNode, TreeViewNodes, type TreeViewValueChangeDetail } from '@ovhcloud/ods-react';
import { useState } from 'react';`},parameters:{docs:{source:{...p()}}},tags:["!dev"],render:({})=>{const t=[{id:"src",name:"src",children:[{id:"app.tsx",name:"app.tsx"},{id:"index.ts",name:"index.ts"},{id:"components",name:"components",children:[{id:"Button.tsx",name:"Button.tsx"},{id:"Card.tsx",name:"Card.tsx"}]}]},{id:"package.json",name:"package.json"},{id:"readme.md",name:"README.md"}],[n,l]=k.useState("package.json");return e.jsxs(e.Fragment,{children:[e.jsx(i,{items:t,onValueChange:d=>l(d.value[0]),value:n?[n]:void 0,children:e.jsx(c,{children:t.map(d=>e.jsx(o,{item:d},d.id))})}),e.jsxs("div",{style:{marginTop:8},children:["Selected: ",n??"None"]})]})}},f={globals:{imports:`import { TreeView, TreeViewNode, TreeViewNodes, type TreeViewValueChangeDetail } from '@ovhcloud/ods-react';
import { useState } from 'react';`},parameters:{docs:{source:{...p()}}},tags:["!dev"],render:({})=>{const t=[{id:"src",name:"src",children:[{id:"app.tsx",name:"app.tsx"},{id:"index.ts",name:"index.ts"},{id:"components",name:"components",children:[{id:"Button.tsx",name:"Button.tsx"},{id:"Card.tsx",name:"Card.tsx"}]}]},{id:"package.json",name:"package.json"},{id:"readme.md",name:"README.md"}],[n,l]=k.useState(["package.json","index.ts"]);return e.jsxs(e.Fragment,{children:[e.jsx(i,{items:t,multiple:!0,onValueChange:d=>l(Array.isArray(d.value)?d.value:[d.value].filter(Boolean)),value:n,children:e.jsx(c,{children:t.map(d=>e.jsx(o,{item:d},d.id))})}),e.jsxs("div",{style:{marginTop:8},children:["Selected: ",n.length?n.join(", "):"None"]})]})}},C={globals:{imports:"import { TreeView, TreeViewNode, TreeViewNodes } from '@ovhcloud/ods-react';"},parameters:{docs:{source:{...p()}}},tags:["!dev"],render:({})=>{const t=[{id:"src",name:"src",children:[{id:"app.tsx",name:"app.tsx"},{id:"index.ts",name:"index.ts"},{id:"components",name:"components",children:[{id:"Button.tsx",name:"Button.tsx"},{id:"Card.tsx",name:"Card.tsx"}]}]},{id:"package.json",name:"package.json"},{id:"readme.md",name:"README.md"}];return e.jsx(i,{disabled:!0,items:t,children:e.jsx(c,{children:t.map(n=>e.jsx(o,{item:n},n.id))})})}},j={globals:{imports:"import { TreeView, TreeViewNode, TreeViewNodes } from '@ovhcloud/ods-react';"},parameters:{docs:{source:{...p()}}},tags:["!dev"],render:({})=>{const t=[{id:"src",name:"src",children:[{id:"app.tsx",name:"app.tsx"},{id:"index.ts",name:"index.ts",disabled:!0},{id:"components",name:"components",disabled:!0,children:[{id:"Button.tsx",name:"Button.tsx"},{id:"Card.tsx",name:"Card.tsx",disabled:!0}]}]},{id:"package.json",name:"package.json",disabled:!0},{id:"readme.md",name:"README.md"}];return e.jsx(i,{items:t,children:e.jsx(c,{children:t.map(n=>e.jsx(o,{item:n},n.id))})})}},v={globals:{imports:"import { Icon, ICON_NAME, TreeView, TreeViewNode, TreeViewNodes } from '@ovhcloud/ods-react';"},parameters:{docs:{source:{...p()}}},tags:["!dev"],render:({})=>{const t=[{id:"src",name:"src",children:[{id:"app.tsx",name:"app.tsx"},{id:"index.ts",name:"index.ts"},{id:"components",name:"components",children:[{id:"Button.tsx",name:"Button.tsx"},{id:"Card.tsx",name:"Card.tsx"}]}]},{id:"package.json",name:"package.json"},{id:"readme.md",name:"README.md"}];return e.jsx(i,{items:t,children:e.jsx(c,{children:t.map(n=>e.jsx(o,{item:n,children:({item:l,isBranch:d,isExpanded:B})=>e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:6},children:[d?B?e.jsx(u,{name:x.folderMinus}):e.jsx(u,{name:x.folderPlus}):e.jsx(u,{name:x.file}),e.jsx("span",{children:l.name})]})},n.id))})})}},I={globals:{imports:"import { FormField, FormFieldLabel, TreeView, TreeViewNode, TreeViewNodes } from '@ovhcloud/ods-react';"},parameters:{docs:{source:{...p()}}},tags:["!dev"],render:({})=>{const t=[{id:"src",name:"src",children:[{id:"app.tsx",name:"app.tsx"},{id:"index.ts",name:"index.ts"},{id:"components",name:"components",children:[{id:"Button.tsx",name:"Button.tsx"},{id:"Card.tsx",name:"Card.tsx"}]}]},{id:"package.json",name:"package.json"},{id:"readme.md",name:"README.md"}];return e.jsxs(Ce,{children:[e.jsx(je,{children:"Choose a file"}),e.jsx(i,{items:t,children:e.jsx(c,{children:t.map(n=>e.jsx(o,{item:n},n.id))})})]})}},E={globals:{imports:`import { Button, BUTTON_COLOR, BUTTON_SIZE, BUTTON_VARIANT, Icon, ICON_NAME, TreeView, TreeViewNode, TreeViewNodes } from '@ovhcloud/ods-react';
import { useRef, useState } from 'react';`},parameters:{docs:{source:{...p()}}},tags:["!dev"],render:({})=>{const[t,n]=k.useState([{id:"src",name:"src",children:[{id:"app.tsx",name:"app.tsx"},{id:"index.ts",name:"index.ts"},{id:"components",name:"components",children:[]}]},{id:"package.json",name:"package.json"},{id:"readme.md",name:"README.md"}]),l=k.useRef(1);function d(m,a,r){return m.map(s=>{var R;if(s.id===a){const Ne=Array.isArray(s.children)?[...s.children,r]:[r];return{...s,children:Ne}}return(R=s.children)!=null&&R.length?{...s,children:d(s.children,a,r)}:s})}function B(m,a){return m.filter(r=>r.id!==a).map(r=>{var s;return(s=r.children)!=null&&s.length?{...r,children:B(r.children,a)}:r})}function Te(m){const a=`new-file-${l.current++}.txt`,r={id:a,name:a};n(s=>d(s,m,r))}function Ve(m){n(a=>B(a,m))}function we(){const m=`new-file-${l.current++}.txt`,a={id:m,name:m};n(r=>[...r,a])}return e.jsxs("div",{children:[e.jsx("div",{style:{marginBottom:16},children:e.jsxs(A,{"aria-label":"Add file at root level",onClick:we,size:b.xs,variant:y.outline,children:[e.jsx(u,{name:x.plus}),"Add file at root level"]})}),e.jsx(i,{items:t,multiple:!0,children:e.jsx(c,{children:t.map(m=>e.jsx(o,{item:m,children:({item:a,isBranch:r})=>e.jsxs("div",{style:{display:"flex",alignItems:"center",width:"100%",justifyContent:"space-between"},children:[e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:6},children:[r?e.jsx(u,{name:x.folder}):e.jsx(u,{name:x.file}),e.jsx("span",{children:a.name})]}),e.jsxs("div",{style:{display:"inline-flex",marginLeft:"auto",alignItems:"center",gap:8},children:[r?e.jsx(A,{"aria-label":"Add child",onClick:s=>{s.stopPropagation(),Te(a.id)},size:b.xs,onKeyDown:s=>{s.stopPropagation()},variant:y.outline,children:e.jsx(u,{name:x.plus})}):null,e.jsx(A,{"aria-label":"Delete",color:fe.critical,onClick:s=>{s.stopPropagation(),Ve(a.id)},onMouseDown:s=>{s.stopPropagation()},onKeyDown:s=>{s.stopPropagation()},size:b.xs,variant:y.outline,children:e.jsx(u,{name:x.trash})})]})]})},m.id))})})]})}};var S,M,O;g.parameters={...g.parameters,docs:{...(S=g.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: arg => {
    const items = [{
      id: 'src',
      name: 'src',
      children: [{
        id: 'app.tsx',
        name: 'app.tsx'
      }, {
        id: 'index.ts',
        name: 'index.ts'
      }, {
        id: 'components',
        name: 'components',
        children: [{
          id: 'Button.tsx',
          name: 'Button.tsx'
        }, {
          id: 'Card.tsx',
          name: 'Card.tsx'
        }]
      }]
    }, {
      id: 'package.json',
      name: 'package.json'
    }, {
      id: 'readme.md',
      name: 'README.md'
    }];
    return <TreeView defaultExpandedValue={arg.defaultExpandedValue} disabled={arg.disabled} expandedValue={arg.expandedValue} items={items} multiple={arg.multiple}>
        <TreeViewNodes>
          {items.map(item => <TreeViewNode key={item.id} item={item} />)}
        </TreeViewNodes>
      </TreeView>;
  },
  argTypes: orderControls({
    disabled: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'boolean'
    },
    multiple: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'boolean'
    }
  })
}`,...(O=(M=g.parameters)==null?void 0:M.docs)==null?void 0:O.source}}};var _,F,P;h.parameters={...h.parameters,docs:{...(_=h.parameters)==null?void 0:_.docs,source:{originalSource:`{
  globals: {
    imports: \`import { TreeView, TreeViewNode, TreeViewNodes } from '@ovhcloud/ods-react';\`
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
    const items = [{
      id: 'src',
      name: 'src',
      children: [{
        id: 'app.tsx',
        name: 'app.tsx'
      }, {
        id: 'index.ts',
        name: 'index.ts'
      }, {
        id: 'components',
        name: 'components',
        children: [{
          id: 'Button.tsx',
          name: 'Button.tsx'
        }, {
          id: 'Card.tsx',
          name: 'Card.tsx'
        }]
      }]
    }, {
      id: 'package.json',
      name: 'package.json'
    }, {
      id: 'readme.md',
      name: 'README.md'
    }];
    return <TreeView items={items}>
        <TreeViewNodes>
          {items.map(item => <TreeViewNode key={item.id} item={item} />)}
        </TreeViewNodes>
      </TreeView>;
  }
}`,...(P=(F=h.parameters)==null?void 0:F.docs)==null?void 0:P.source}}};var U,L,z;T.parameters={...T.parameters,docs:{...(U=T.parameters)==null?void 0:U.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => {
    const items = [{
      id: 'src',
      name: 'src',
      children: [{
        id: 'app.tsx',
        name: 'app.tsx'
      }, {
        id: 'index.ts',
        name: 'index.ts'
      }, {
        id: 'components',
        name: 'components',
        children: [{
          id: 'Button.tsx',
          name: 'Button.tsx'
        }, {
          id: 'Card.tsx',
          name: 'Card.tsx'
        }]
      }]
    }, {
      id: 'package.json',
      name: 'package.json'
    }, {
      id: 'readme.md',
      name: 'README.md'
    }];
    return <TreeView items={items}>
        <TreeViewNodes>
          {items.map(item => <TreeViewNode key={item.id} item={item} />)}
        </TreeViewNodes>
      </TreeView>;
  }
}`,...(z=(L=T.parameters)==null?void 0:L.docs)==null?void 0:z.source}}};var K,Z,$;V.parameters={...V.parameters,docs:{...(K=V.parameters)==null?void 0:K.docs,source:{originalSource:`{
  globals: {
    imports: \`import { TreeView, TreeViewNode, TreeViewNodes } from '@ovhcloud/ods-react';\`
  },
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  tags: ['!dev'],
  render: ({}) => {
    const items = [{
      id: 'src',
      name: 'src',
      children: [{
        id: 'app.tsx',
        name: 'app.tsx'
      }, {
        id: 'index.ts',
        name: 'index.ts'
      }, {
        id: 'components',
        name: 'components',
        children: [{
          id: 'Button.tsx',
          name: 'Button.tsx'
        }, {
          id: 'Card.tsx',
          name: 'Card.tsx'
        }]
      }]
    }, {
      id: 'package.json',
      name: 'package.json'
    }, {
      id: 'readme.md',
      name: 'README.md'
    }];
    return <TreeView items={items} multiple>
        <TreeViewNodes>
          {items.map(item => <TreeViewNode key={item.id} item={item} />)}
        </TreeViewNodes>
      </TreeView>;
  }
}`,...($=(Z=V.parameters)==null?void 0:Z.docs)==null?void 0:$.source}}};var G,Y,q;w.parameters={...w.parameters,docs:{...(G=w.parameters)==null?void 0:G.docs,source:{originalSource:`{
  globals: {
    imports: \`import { TreeView, TreeViewNode, TreeViewNodes } from '@ovhcloud/ods-react';\`
  },
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  tags: ['!dev'],
  render: ({}) => {
    const items = [{
      id: 'src',
      name: 'src',
      children: [{
        id: 'app.tsx',
        name: 'app.tsx'
      }, {
        id: 'index.ts',
        name: 'index.ts'
      }, {
        id: 'components',
        name: 'components',
        children: [{
          id: 'Button.tsx',
          name: 'Button.tsx'
        }, {
          id: 'Card.tsx',
          name: 'Card.tsx'
        }]
      }]
    }, {
      id: 'package.json',
      name: 'package.json'
    }, {
      id: 'readme.md',
      name: 'README.md'
    }];
    return <TreeView defaultExpandedValue={["src", "components"]} items={items}>
        <TreeViewNodes>
          {items.map(item => <TreeViewNode key={item.id} item={item} />)}
        </TreeViewNodes>
      </TreeView>;
  }
}`,...(q=(Y=w.parameters)==null?void 0:Y.docs)==null?void 0:q.source}}};var H,J,Q;N.parameters={...N.parameters,docs:{...(H=N.parameters)==null?void 0:H.docs,source:{originalSource:`{
  globals: {
    imports: \`import { TreeView, TreeViewNode, TreeViewNodes, type TreeViewValueChangeDetail } from '@ovhcloud/ods-react';
import { useState } from 'react';\`
  },
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  tags: ['!dev'],
  render: ({}) => {
    const items = [{
      id: 'src',
      name: 'src',
      children: [{
        id: 'app.tsx',
        name: 'app.tsx'
      }, {
        id: 'index.ts',
        name: 'index.ts'
      }, {
        id: 'components',
        name: 'components',
        children: [{
          id: 'Button.tsx',
          name: 'Button.tsx'
        }, {
          id: 'Card.tsx',
          name: 'Card.tsx'
        }]
      }]
    }, {
      id: 'package.json',
      name: 'package.json'
    }, {
      id: 'readme.md',
      name: 'README.md'
    }];
    const [selectedId, setSelectedId] = useState<string | undefined>('package.json');
    return <>
        <TreeView items={items} onValueChange={(d: TreeViewValueChangeDetail) => setSelectedId(d.value[0])} value={selectedId ? [selectedId] : undefined}>
          <TreeViewNodes>
            {items.map(item => <TreeViewNode key={item.id} item={item} />)}
          </TreeViewNodes>
        </TreeView>
        <div style={{
        marginTop: 8
      }}>Selected: {selectedId ?? 'None'}</div>
      </>;
  }
}`,...(Q=(J=N.parameters)==null?void 0:J.docs)==null?void 0:Q.source}}};var W,X,ee;f.parameters={...f.parameters,docs:{...(W=f.parameters)==null?void 0:W.docs,source:{originalSource:`{
  globals: {
    imports: \`import { TreeView, TreeViewNode, TreeViewNodes, type TreeViewValueChangeDetail } from '@ovhcloud/ods-react';
import { useState } from 'react';\`
  },
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  tags: ['!dev'],
  render: ({}) => {
    const items = [{
      id: 'src',
      name: 'src',
      children: [{
        id: 'app.tsx',
        name: 'app.tsx'
      }, {
        id: 'index.ts',
        name: 'index.ts'
      }, {
        id: 'components',
        name: 'components',
        children: [{
          id: 'Button.tsx',
          name: 'Button.tsx'
        }, {
          id: 'Card.tsx',
          name: 'Card.tsx'
        }]
      }]
    }, {
      id: 'package.json',
      name: 'package.json'
    }, {
      id: 'readme.md',
      name: 'README.md'
    }];
    const [selectedIds, setSelectedIds] = useState<string[]>(['package.json', 'index.ts']);
    return <>
        <TreeView items={items} multiple onValueChange={(d: TreeViewValueChangeDetail) => setSelectedIds(Array.isArray(d.value) ? d.value : [d.value].filter(Boolean) as string[])} value={selectedIds}>
          <TreeViewNodes>
            {items.map(item => <TreeViewNode key={item.id} item={item} />)}
          </TreeViewNodes>
        </TreeView>
        <div style={{
        marginTop: 8
      }}>Selected: {selectedIds.length ? selectedIds.join(', ') : 'None'}</div>
      </>;
  }
}`,...(ee=(X=f.parameters)==null?void 0:X.docs)==null?void 0:ee.source}}};var ne,te,se;C.parameters={...C.parameters,docs:{...(ne=C.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  globals: {
    imports: \`import { TreeView, TreeViewNode, TreeViewNodes } from '@ovhcloud/ods-react';\`
  },
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  tags: ['!dev'],
  render: ({}) => {
    const items = [{
      id: 'src',
      name: 'src',
      children: [{
        id: 'app.tsx',
        name: 'app.tsx'
      }, {
        id: 'index.ts',
        name: 'index.ts'
      }, {
        id: 'components',
        name: 'components',
        children: [{
          id: 'Button.tsx',
          name: 'Button.tsx'
        }, {
          id: 'Card.tsx',
          name: 'Card.tsx'
        }]
      }]
    }, {
      id: 'package.json',
      name: 'package.json'
    }, {
      id: 'readme.md',
      name: 'README.md'
    }];
    return <TreeView disabled items={items}>
        <TreeViewNodes>
          {items.map(item => <TreeViewNode key={item.id} item={item} />)}
        </TreeViewNodes>
      </TreeView>;
  }
}`,...(se=(te=C.parameters)==null?void 0:te.docs)==null?void 0:se.source}}};var re,de,ae;j.parameters={...j.parameters,docs:{...(re=j.parameters)==null?void 0:re.docs,source:{originalSource:`{
  globals: {
    imports: \`import { TreeView, TreeViewNode, TreeViewNodes } from '@ovhcloud/ods-react';\`
  },
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  tags: ['!dev'],
  render: ({}) => {
    const items = [{
      id: 'src',
      name: 'src',
      children: [{
        id: 'app.tsx',
        name: 'app.tsx'
      }, {
        id: 'index.ts',
        name: 'index.ts',
        disabled: true
      }, {
        id: 'components',
        name: 'components',
        disabled: true,
        children: [{
          id: 'Button.tsx',
          name: 'Button.tsx'
        }, {
          id: 'Card.tsx',
          name: 'Card.tsx',
          disabled: true
        }]
      }]
    }, {
      id: 'package.json',
      name: 'package.json',
      disabled: true
    }, {
      id: 'readme.md',
      name: 'README.md'
    }];
    return <TreeView items={items}>
        <TreeViewNodes>
          {items.map(item => <TreeViewNode key={item.id} item={item} />)}
        </TreeViewNodes>
      </TreeView>;
  }
}`,...(ae=(de=j.parameters)==null?void 0:de.docs)==null?void 0:ae.source}}};var ie,oe,me;v.parameters={...v.parameters,docs:{...(ie=v.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Icon, ICON_NAME, TreeView, TreeViewNode, TreeViewNodes } from '@ovhcloud/ods-react';\`
  },
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  tags: ['!dev'],
  render: ({}) => {
    const items = [{
      id: 'src',
      name: 'src',
      children: [{
        id: 'app.tsx',
        name: 'app.tsx'
      }, {
        id: 'index.ts',
        name: 'index.ts'
      }, {
        id: 'components',
        name: 'components',
        children: [{
          id: 'Button.tsx',
          name: 'Button.tsx'
        }, {
          id: 'Card.tsx',
          name: 'Card.tsx'
        }]
      }]
    }, {
      id: 'package.json',
      name: 'package.json'
    }, {
      id: 'readme.md',
      name: 'README.md'
    }];
    return <TreeView items={items}>
        <TreeViewNodes>
          {items.map(item => <TreeViewNode key={item.id} item={item}>
              {({
            item,
            isBranch,
            isExpanded
          }) => <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6
          }}>
                  {isBranch ? isExpanded ? <Icon name={ICON_NAME.folderMinus} /> : <Icon name={ICON_NAME.folderPlus} /> : <Icon name={ICON_NAME.file} />}
                  <span>{item.name}</span>
                </span>}
            </TreeViewNode>)}
        </TreeViewNodes>
      </TreeView>;
  }
}`,...(me=(oe=v.parameters)==null?void 0:oe.docs)==null?void 0:me.source}}};var ce,le,pe;I.parameters={...I.parameters,docs:{...(ce=I.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  globals: {
    imports: \`import { FormField, FormFieldLabel, TreeView, TreeViewNode, TreeViewNodes } from '@ovhcloud/ods-react';\`
  },
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  tags: ['!dev'],
  render: ({}) => {
    const items = [{
      id: 'src',
      name: 'src',
      children: [{
        id: 'app.tsx',
        name: 'app.tsx'
      }, {
        id: 'index.ts',
        name: 'index.ts'
      }, {
        id: 'components',
        name: 'components',
        children: [{
          id: 'Button.tsx',
          name: 'Button.tsx'
        }, {
          id: 'Card.tsx',
          name: 'Card.tsx'
        }]
      }]
    }, {
      id: 'package.json',
      name: 'package.json'
    }, {
      id: 'readme.md',
      name: 'README.md'
    }];
    return <FormField>
        <FormFieldLabel>Choose a file</FormFieldLabel>
        <TreeView items={items}>
          <TreeViewNodes>
            {items.map(item => <TreeViewNode key={item.id} item={item} />)}
          </TreeViewNodes>
        </TreeView>
      </FormField>;
  }
}`,...(pe=(le=I.parameters)==null?void 0:le.docs)==null?void 0:pe.source}}};var ue,xe,ge;E.parameters={...E.parameters,docs:{...(ue=E.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Button, BUTTON_COLOR, BUTTON_SIZE, BUTTON_VARIANT, Icon, ICON_NAME, TreeView, TreeViewNode, TreeViewNodes } from '@ovhcloud/ods-react';
import { useRef, useState } from 'react';\`
  },
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  tags: ['!dev'],
  render: ({}) => {
    type Item = {
      id: string;
      name: string;
      children?: Item[];
    };
    const [items, setItems] = useState<Item[]>([{
      id: 'src',
      name: 'src',
      children: [{
        id: 'app.tsx',
        name: 'app.tsx'
      }, {
        id: 'index.ts',
        name: 'index.ts'
      }, {
        id: 'components',
        name: 'components',
        children: []
      }]
    }, {
      id: 'package.json',
      name: 'package.json'
    }, {
      id: 'readme.md',
      name: 'README.md'
    }]);
    const counter = useRef(1);
    function addChildTo(collection: Item[], parentId: string, newNode: Item): Item[] {
      return collection.map(node => {
        if (node.id === parentId) {
          const nextChildren = Array.isArray(node.children) ? [...node.children, newNode] : [newNode];
          return {
            ...node,
            children: nextChildren
          };
        }
        if (node.children?.length) {
          return {
            ...node,
            children: addChildTo(node.children, parentId, newNode)
          };
        }
        return node;
      });
    }
    function removeNodeFrom(collection: Item[], nodeId: string): Item[] {
      return collection.filter(node => node.id !== nodeId).map(node => node.children?.length ? {
        ...node,
        children: removeNodeFrom(node.children, nodeId)
      } : node);
    }
    function handleAddChild(parentId: string): void {
      const id = \`new-file-\${counter.current++}.txt\`;
      const newNode = {
        id,
        name: id
      };
      setItems(prev => addChildTo(prev, parentId, newNode));
    }
    function handleDelete(nodeId: string): void {
      setItems(prev => removeNodeFrom(prev, nodeId));
    }
    function handleAddRootFile(): void {
      const id = \`new-file-\${counter.current++}.txt\`;
      const newNode = {
        id,
        name: id
      };
      setItems(prev => [...prev, newNode]);
    }
    return <div>
        <div style={{
        marginBottom: 16
      }}>
          <Button aria-label="Add file at root level" onClick={handleAddRootFile} size={BUTTON_SIZE.xs} variant={BUTTON_VARIANT.outline}>
            <Icon name={ICON_NAME.plus} />
            Add file at root level
          </Button>
        </div>
        <TreeView items={items} multiple>
          <TreeViewNodes>
            {items.map(item => <TreeViewNode key={item.id} item={item}>
                {({
              item,
              isBranch
            }) => <div style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between'
            }}>
                    <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}>
                      {isBranch ? <Icon name={ICON_NAME.folder} /> : <Icon name={ICON_NAME.file} />}
                      <span>{item.name}</span>
                    </span>
                    <div style={{
                display: 'inline-flex',
                marginLeft: 'auto',
                alignItems: 'center',
                gap: 8
              }}>
                      {isBranch ? <Button aria-label="Add child" onClick={e => {
                  e.stopPropagation();
                  handleAddChild(item.id);
                }} size={BUTTON_SIZE.xs} onKeyDown={e => {
                  e.stopPropagation();
                }} variant={BUTTON_VARIANT.outline}>
                          <Icon name={ICON_NAME.plus} />
                        </Button> : null}
                      <Button aria-label="Delete" color={BUTTON_COLOR.critical} onClick={e => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }} onMouseDown={e => {
                  e.stopPropagation();
                }} onKeyDown={e => {
                  e.stopPropagation();
                }} size={BUTTON_SIZE.xs} variant={BUTTON_VARIANT.outline}>
                        <Icon name={ICON_NAME.trash} />
                      </Button>
                    </div>
                  </div>}
              </TreeViewNode>)}
          </TreeViewNodes>
        </TreeView>
      </div>;
  }
}`,...(ge=(xe=E.parameters)==null?void 0:xe.docs)==null?void 0:ge.source}}};const Be=["Demo","Default","Overview","Multiple","DefaultExpandedValue","Controlled","ControlledMultiple","Disabled","DisabledItems","CustomRender","InFormField","DynamicChildren"],Pe=Object.freeze(Object.defineProperty({__proto__:null,Controlled:N,ControlledMultiple:f,CustomRender:v,Default:h,DefaultExpandedValue:w,Demo:g,Disabled:C,DisabledItems:j,DynamicChildren:E,InFormField:I,Multiple:V,Overview:T,__namedExportsOrder:Be,default:Ee},Symbol.toStringTag,{value:"Module"}));export{v as C,h as D,I,V as M,T as O,Pe as T,C as a,w as b,N as c,f as d,j as e,E as f};
