import{j as a}from"./jsx-runtime-BRNY0I4F.js";import{r as H}from"./index-Bnop-kX6.js";import{O as e}from"./Pagination-Uop4YMV_-CIoyR9_Y.js";import{e as J,o as Q,C as t}from"./controls-BtiQQn1l.js";import{d as V,s as o}from"./ods-docgen-map-C6vdLMLl.js";e.__docgenInfo=V.pagination;const X={argTypes:J(["defaultPage","onPageChange","onPageSizeChange","page","pageSize","renderTotalItemsLabel"]),component:e,title:"Manager UI Kit/Components/Pagination/Base"},r={argTypes:Q({disabled:{table:{category:t.general}},labelTooltipNext:{table:{category:t.general}},labelTooltipPrev:{table:{category:t.general}},pageSize:{table:{category:t.general}},page:{table:{category:t.general}},siblingCount:{table:{category:t.general}},totalItems:{table:{category:t.general}},withPageSizeSelector:{table:{category:t.general}}}),args:{totalItems:5e3}},n={globals:{imports:"import { Pagination } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>a.jsx(e,{"aria-label":"Pagination",totalItems:5e3})},s={globals:{imports:`import { Pagination } from '@ovhcloud/ods-react';
import { useState } from 'react';`},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>{const[u,U]=H.useState(1);function k({page:q}){U(q)}return a.jsx(e,{onPageChange:k,page:u,totalItems:500})}},i={globals:{imports:"import { Pagination } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>a.jsx(e,{totalItems:5e3})},c={globals:{imports:"import { Pagination } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>a.jsx(e,{disabled:!0,totalItems:500})},l={globals:{imports:"import { Pagination } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>a.jsx(e,{pageSize:25,totalItems:500})},g={tags:["!dev"],parameters:{layout:"centered",docs:{source:{...o()}}},render:({})=>a.jsx(e,{totalItems:100,withPageSizeSelector:!0})},m={globals:{imports:"import { Pagination } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>a.jsx(e,{defaultPage:5,siblingCount:2,totalItems:500})},d={globals:{imports:"import { Pagination } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>a.jsx(e,{labelTooltipPrev:"Go to previous page",labelTooltipNext:"Go to next page",totalItems:500})},p={globals:{imports:"import { Pagination } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...o()}}},render:({})=>a.jsx(e,{renderTotalItemsLabel:({totalItems:u})=>`of ${u} results`,totalItems:500,withPageSizeSelector:!0})};var b,P,C;r.parameters={...r.parameters,docs:{...(b=r.parameters)==null?void 0:b.docs,source:{originalSource:`{
  argTypes: orderControls({
    disabled: {
      table: {
        category: CONTROL_CATEGORY.general
      }
    },
    labelTooltipNext: {
      table: {
        category: CONTROL_CATEGORY.general
      }
    },
    labelTooltipPrev: {
      table: {
        category: CONTROL_CATEGORY.general
      }
    },
    pageSize: {
      table: {
        category: CONTROL_CATEGORY.general
      }
    },
    page: {
      table: {
        category: CONTROL_CATEGORY.general
      }
    },
    siblingCount: {
      table: {
        category: CONTROL_CATEGORY.general
      }
    },
    totalItems: {
      table: {
        category: CONTROL_CATEGORY.general
      }
    },
    withPageSizeSelector: {
      table: {
        category: CONTROL_CATEGORY.general
      }
    }
  }),
  args: {
    totalItems: 5000
  }
}`,...(C=(P=r.parameters)==null?void 0:P.docs)==null?void 0:C.source}}};var S,f,v;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Pagination } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Pagination aria-label="Pagination" totalItems={5000} />
}`,...(v=(f=n.parameters)==null?void 0:f.docs)==null?void 0:v.source}}};var T,h,O;s.parameters={...s.parameters,docs:{...(T=s.parameters)==null?void 0:T.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Pagination } from '@ovhcloud/ods-react';
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
    const [page, setPage] = useState(1);
    function handlePageChange({
      page
    }: PaginationPageChangeDetail) {
      setPage(page);
    }
    return <Pagination onPageChange={handlePageChange} page={page} totalItems={500} />;
  }
}`,...(O=(h=s.parameters)==null?void 0:h.docs)==null?void 0:O.source}}};var I,R,y;i.parameters={...i.parameters,docs:{...(I=i.parameters)==null?void 0:I.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Pagination } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Pagination totalItems={5000} />
}`,...(y=(R=i.parameters)==null?void 0:R.docs)==null?void 0:y.source}}};var x,_,L;c.parameters={...c.parameters,docs:{...(x=c.parameters)==null?void 0:x.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Pagination } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Pagination disabled totalItems={500} />
}`,...(L=(_=c.parameters)==null?void 0:_.docs)==null?void 0:L.source}}};var j,z,G;l.parameters={...l.parameters,docs:{...(j=l.parameters)==null?void 0:j.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Pagination } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Pagination pageSize={25} totalItems={500} />
}`,...(G=(z=l.parameters)==null?void 0:z.docs)==null?void 0:G.source}}};var N,A,E;g.parameters={...g.parameters,docs:{...(N=g.parameters)==null?void 0:N.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Pagination totalItems={100} withPageSizeSelector />
}`,...(E=(A=g.parameters)==null?void 0:A.docs)==null?void 0:E.source}}};var D,Y,w;m.parameters={...m.parameters,docs:{...(D=m.parameters)==null?void 0:D.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Pagination } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Pagination defaultPage={5} siblingCount={2} totalItems={500} />
}`,...(w=(Y=m.parameters)==null?void 0:Y.docs)==null?void 0:w.source}}};var M,W,$;d.parameters={...d.parameters,docs:{...(M=d.parameters)==null?void 0:M.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Pagination } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Pagination labelTooltipPrev={'Go to previous page'} labelTooltipNext={'Go to next page'} totalItems={500} />
}`,...($=(W=d.parameters)==null?void 0:W.docs)==null?void 0:$.source}}};var B,F,K;p.parameters={...p.parameters,docs:{...(B=p.parameters)==null?void 0:B.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Pagination } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Pagination renderTotalItemsLabel={({
    totalItems
  }) => \`of \${totalItems} results\`} totalItems={500} withPageSizeSelector />
}`,...(K=(F=p.parameters)==null?void 0:F.docs)==null?void 0:K.source}}};const Z=["Demo","AccessibilityLabel","Controlled","Default","Disabled","ItemsPerPage","Overview","SiblingCount","WithLabels","TotalItems"],ne=Object.freeze(Object.defineProperty({__proto__:null,AccessibilityLabel:n,Controlled:s,Default:i,Demo:r,Disabled:c,ItemsPerPage:l,Overview:g,SiblingCount:m,TotalItems:p,WithLabels:d,__namedExportsOrder:Z,default:X},Symbol.toStringTag,{value:"Module"}));export{n as A,s as C,i as D,l as I,g as O,ne as P,m as S,p as T,d as W,c as a};
