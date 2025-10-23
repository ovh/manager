import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{h as S}from"./Text-CcNd6qQr-FOgQIkhx.js";import{e as C}from"./ods-react61-4lD3hp9p.js";import{L as $,S as ee}from"./FormFieldLabel-DerGjSSG-BDyW1aTt.js";import{k as l,w as a,x as o}from"./SelectControl-C7d9WPuE-BJAfBPdf.js";import{e as ae,o as oe,C as i}from"./controls-BtiQQn1l.js";import{d as x,s}from"./ods-docgen-map-C6vdLMLl.js";l.__docgenInfo=x.select;a.__docgenInfo=x.selectContent;o.__docgenInfo=x.selectControl;const te={argTypes:ae(["defaultValue","id","items","name","onValueChange","required","value"]),component:l,subcomponents:{SelectContent:a,SelectControl:o},title:"Manager UI Kit/Components/Select/Base"},d={render:t=>e.jsxs(l,{disabled:t.disabled,fitControlWidth:t.fitControlWidth,invalid:t.invalid,items:[{label:"Dog",value:"dog"},{label:"Cat",value:"cat"},{label:"Hamster",value:"hamster"},{label:"Parrot",value:"parrot"},{label:"Spider",value:"spider"},{label:"Goldfish",value:"goldfish"}],multiple:t.multiple,readOnly:t.readOnly,children:[e.jsx(o,{multipleSelectionLabel:t.multipleSelectionLabel,placeholder:t.placeholder}),e.jsx(a,{})]}),argTypes:oe({disabled:{table:{category:i.general},control:{type:"boolean"}},fitControlWidth:{table:{category:i.general},control:{type:"boolean"}},invalid:{table:{category:i.general},control:"boolean"},multiple:{table:{category:i.general},control:{type:"select"},options:[!0,!1,"merge"]},multipleSelectionLabel:{table:{category:i.general,type:{summary:"string"}},control:"text"},placeholder:{table:{category:i.general,type:{summary:"string"}},control:"text"},readOnly:{table:{category:i.general},control:"boolean"}})},c={globals:{imports:"import { FormField, FormFieldLabel, Select, SelectContent, SelectControl } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...s()}}},render:({})=>e.jsxs($,{children:[e.jsx(ee,{children:"Select a Web hosting"}),e.jsxs(l,{items:[{label:"1 vCore 2,4 GHz, 2 Go RAM",value:"hosting-1"},{label:"1 vCore 2,4 GHz, 4 Go RAM",value:"hosting-2"},{label:"2 vCores 2,4 GHz, 8 Go RAM",value:"hosting-3"}],children:[e.jsx(o,{}),e.jsx(a,{})]})]})},p={globals:{imports:"import { Select, SelectContent, SelectControl } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...s()}}},render:({})=>{const t=[{customRendererData:{flag:"https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg"},label:"EU providers",options:[{customRendererData:{description:"OVH, legally OVH Groupe SA, is a French cloud computing company which offers VPS, dedicated servers and other web services. As of 2016 OVH owned the world's largest data center in surface area. As of 2019, it was the largest hosting provider in Europe, and the third largest in the world based on physical servers.",logo:"https://ovh.github.io/manager/ovhcloud-logo.webp"},label:"OVH Cloud",value:"ovh"}]},{customRendererData:{flag:"https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg"},label:"US providers",options:[{customRendererData:{description:"Amazon Web Services, Inc. is a subsidiary of Amazon that provides on-demand cloud computing platforms and APIs to individuals, companies, and governments, on a metered, pay-as-you-go basis. Clients will often use this in combination with autoscaling.",logo:"https://cdn.icon-icons.com/icons2/2407/PNG/512/aws_icon_146074.png"},label:"Amazon Web Services",value:"aws"},{customRendererData:{description:"Microsoft Azure, often referred to as just Azure, is a cloud computing platform developed by Microsoft. It offers management, access and development of applications and services through its global infrastructure.",logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Microsoft_Azure.svg/2048px-Microsoft_Azure.svg.png"},label:"Microsoft Azure",value:"azure"},{customRendererData:{description:"Google Cloud Platform, offered by Google, is a suite of cloud computing services that provides a series of modular cloud services including computing, data storage, data analytics, and machine learning, alongside a set of management tools.",logo:"https://upload.wikimedia.org/wikipedia/commons/0/01/Google-cloud-platform.svg"},label:"Google Cloud Platform",value:"gcp"}]}];return e.jsxs(l,{items:t,multiple:!0,children:[e.jsx(o,{customItemRenderer:({selectedItems:r})=>e.jsx("span",{style:{display:"flex",flexFlow:"row",gap:"8px",flexWrap:"wrap"},children:r.map((n,le)=>{var y;return e.jsxs("span",{style:{display:"flex",flexFlow:"row",gap:"4px",alignItems:"center"},children:[e.jsx("img",{alt:n.label,height:15,src:(y=n.customRendererData)==null?void 0:y.logo,width:15}),e.jsxs("span",{children:[n.label,le<r.length-1&&", "]})]},n.value)})})}),e.jsx(a,{customGroupRenderer:({customData:r,label:n})=>e.jsxs("div",{style:{display:"flex",flexFlow:"row",columnGap:"8px",alignItems:"center"},children:[e.jsx("img",{alt:"flag",height:20,src:r==null?void 0:r.flag,width:30}),e.jsx("span",{children:n})]}),customOptionRenderer:({customData:r,label:n})=>e.jsxs("div",{style:{display:"flex",flexFlow:"row",columnGap:"8px",alignItems:"center",padding:"8px 0"},children:[e.jsx("img",{alt:n,height:50,src:r==null?void 0:r.logo,width:50}),e.jsxs("div",{style:{display:"flex",flexFlow:"column",rowGap:"8px"},children:[e.jsx("span",{style:{fontWeight:"bold"},children:n}),e.jsx("span",{children:r==null?void 0:r.description})]})]})})]})}},u={globals:{imports:"import { Select, SelectContent, SelectControl } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...s()}}},render:({})=>e.jsxs(l,{items:[{label:"Dog",value:"dog"},{label:"Cat",value:"cat"},{label:"Hamster",value:"hamster"},{label:"Parrot",value:"parrot"},{label:"Spider",value:"spider"},{label:"Goldfish",value:"goldfish"}],children:[e.jsx(o,{}),e.jsx(a,{})]})},m={decorators:[t=>e.jsx("div",{style:{display:"flex",flexFlow:"column",gap:"8px"},children:t()})],globals:{imports:"import { TEXT_PRESET, Select, SelectContent, SelectControl, Text } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...s()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsxs(l,{disabled:!0,items:[{label:"Dog",value:"dog"},{label:"Cat",value:"cat"},{label:"Hamster",value:"hamster"},{label:"Parrot",value:"parrot"},{label:"Spider",value:"spider"},{label:"Goldfish",value:"goldfish"}],children:[e.jsx(S,{htmlFor:"disabled",preset:C.label,children:"Disabled"}),e.jsx(o,{id:"disabled",placeholder:"Select one or more pets"}),e.jsx(a,{})]}),e.jsxs(l,{items:[{label:"Dog",value:"dog",disabled:!0},{label:"Cat",value:"cat"},{label:"Hamster",value:"hamster"},{label:"Parrot",value:"parrot",disabled:!0},{label:"Spider",value:"spider"},{label:"Goldfish",value:"goldfish"}],children:[e.jsx(S,{htmlFor:"disabled-options",preset:C.label,children:"Disabled options"}),e.jsx(o,{id:"disabled-options",placeholder:"Select one or more pets"}),e.jsx(a,{})]}),e.jsxs(l,{items:[{label:"Europe",options:[{label:"France",value:"fr"},{label:"Germany",value:"de",disabled:!0},{label:"Italy",value:"it"}]},{disabled:!0,label:"Asia",options:[{label:"China",value:"cn",disabled:!0},{label:"Japan",value:"jp",disabled:!0},{label:"Russia",value:"ru",disabled:!0}]},{label:"North America",options:[{label:"Canada",value:"ca"},{label:"Mexico",value:"mx"},{label:"United States of America",value:"us"}]}],children:[e.jsx(S,{htmlFor:"disabled-group",preset:C.label,children:"Disabled group or group option"}),e.jsx(o,{id:"disabled-group"}),e.jsx(a,{})]})]})},g={globals:{imports:"import { Select, SelectContent, SelectControl } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...s()}}},render:({})=>e.jsxs(l,{items:[{label:"Europe",options:[{label:"France",value:"fr"},{label:"Germany",value:"de"},{label:"Italy",value:"it"}]},{label:"Asia",options:[{label:"China",value:"cn"},{label:"Japan",value:"jp"},{label:"Russia",value:"ru"}]},{label:"North America",options:[{label:"Canada",value:"ca"},{label:"Mexico",value:"mx"},{label:"United States of America",value:"us"}]}],children:[e.jsx(o,{}),e.jsx(a,{})]})},b={globals:{imports:"import { FormField, FormFieldLabel, Select, SelectContent, SelectControl } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...s()}}},render:({})=>e.jsxs($,{children:[e.jsx(ee,{children:"Select a Web hosting"}),e.jsxs(l,{items:[{label:"1 vCore 2,4 GHz, 2 Go RAM",value:"hosting-1"},{label:"1 vCore 2,4 GHz, 4 Go RAM",value:"hosting-2"},{label:"2 vCores 2,4 GHz, 8 Go RAM",value:"hosting-3"}],children:[e.jsx(o,{}),e.jsx(a,{})]})]})},v={decorators:[t=>e.jsx("div",{style:{display:"flex",flexFlow:"column",gap:"8px"},children:t()})],globals:{imports:"import { TEXT_PRESET, Select, SelectContent, SelectControl, Text } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...s()}}},render:({})=>e.jsxs(e.Fragment,{children:[e.jsxs(l,{items:[{label:"Dog",value:"dog"},{label:"Cat",value:"cat"},{label:"Hamster",value:"hamster"},{label:"Parrot",value:"parrot"},{label:"Spider",value:"spider"},{label:"Goldfish",value:"goldfish"}],multiple:!0,children:[e.jsx(S,{htmlFor:"multiple",preset:C.label,children:"Default multiple selection"}),e.jsx(o,{id:"multiple",placeholder:"Select one or more pets"}),e.jsx(a,{})]}),e.jsxs(l,{items:[{label:"Dog",value:"dog"},{label:"Cat",value:"cat"},{label:"Hamster",value:"hamster"},{label:"Parrot",value:"parrot"},{label:"Spider",value:"spider"},{label:"Goldfish",value:"goldfish"}],multiple:"merge",children:[e.jsx(S,{htmlFor:"multiple-merged",preset:C.label,children:"Merged multiple selection"}),e.jsx(o,{id:"multiple-merged",placeholder:"Select one or more pets"}),e.jsx(a,{})]})]})},h={tags:["!dev"],parameters:{layout:"centered",docs:{source:{...s()}}},render:({})=>e.jsxs(l,{items:[{label:"Dog",value:"dog"},{label:"Cat",value:"cat"},{label:"Hamster",value:"hamster"},{label:"Parrot",value:"parrot"},{label:"Spider",value:"spider"},{label:"Goldfish",value:"goldfish"}],children:[e.jsx(o,{placeholder:"Select one or more pets"}),e.jsx(a,{})]})},f={globals:{imports:"import { Select, SelectContent, SelectControl } from '@ovhcloud/ods-react';"},tags:["!dev"],parameters:{docs:{source:{...s()}}},render:({})=>e.jsxs(l,{items:[{label:"Dog",value:"dog"},{label:"Cat",value:"cat"},{label:"Hamster",value:"hamster"},{label:"Parrot",value:"parrot"},{label:"Spider",value:"spider"},{label:"Goldfish",value:"goldfish"}],readOnly:!0,children:[e.jsx(o,{placeholder:"Select one or more pets"}),e.jsx(a,{})]})};var F,R,G;d.parameters={...d.parameters,docs:{...(F=d.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: (arg: DemoArg) => <Select disabled={arg.disabled} fitControlWidth={arg.fitControlWidth} invalid={arg.invalid} items={[{
    label: 'Dog',
    value: 'dog'
  }, {
    label: 'Cat',
    value: 'cat'
  }, {
    label: 'Hamster',
    value: 'hamster'
  }, {
    label: 'Parrot',
    value: 'parrot'
  }, {
    label: 'Spider',
    value: 'spider'
  }, {
    label: 'Goldfish',
    value: 'goldfish'
  }]} multiple={arg.multiple} readOnly={arg.readOnly}>
      <SelectControl multipleSelectionLabel={arg.multipleSelectionLabel} placeholder={arg.placeholder} />

      <SelectContent />
    </Select>,
  argTypes: orderControls({
    disabled: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: {
        type: 'boolean'
      }
    },
    fitControlWidth: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: {
        type: 'boolean'
      }
    },
    invalid: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'boolean'
    },
    multiple: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: {
        type: 'select'
      },
      options: [true, false, 'merge']
    },
    multipleSelectionLabel: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: {
          summary: 'string'
        }
      },
      control: 'text'
    },
    placeholder: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: {
          summary: 'string'
        }
      },
      control: 'text'
    },
    readOnly: {
      table: {
        category: CONTROL_CATEGORY.general
      },
      control: 'boolean'
    }
  })
}`,...(G=(R=d.parameters)==null?void 0:R.docs)==null?void 0:G.source}}};var j,w,T;c.parameters={...c.parameters,docs:{...(j=c.parameters)==null?void 0:j.docs,source:{originalSource:`{
  globals: {
    imports: \`import { FormField, FormFieldLabel, Select, SelectContent, SelectControl } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <FormField>
      <FormFieldLabel>
        Select a Web hosting
      </FormFieldLabel>

      <Select items={[{
      label: '1 vCore 2,4 GHz, 2 Go RAM',
      value: 'hosting-1'
    }, {
      label: '1 vCore 2,4 GHz, 4 Go RAM',
      value: 'hosting-2'
    }, {
      label: '2 vCores 2,4 GHz, 8 Go RAM',
      value: 'hosting-3'
    }]}>
        <SelectControl />

        <SelectContent />
      </Select>
    </FormField>
}`,...(T=(w=c.parameters)==null?void 0:w.docs)==null?void 0:T.source}}};var A,_,O;p.parameters={...p.parameters,docs:{...(A=p.parameters)==null?void 0:A.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Select, SelectContent, SelectControl } from '@ovhcloud/ods-react';\`
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
    type CustomData = {
      description?: string;
      flag?: string;
      logo?: string;
    };
    const items: SelectItem<CustomData>[] = [{
      customRendererData: {
        flag: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg'
      },
      label: 'EU providers',
      options: [{
        customRendererData: {
          description: 'OVH, legally OVH Groupe SA, is a French cloud computing company which offers VPS, dedicated servers and other web services. As of 2016 OVH owned the world\\'s largest data center in surface area. As of 2019, it was the largest hosting provider in Europe, and the third largest in the world based on physical servers.',
          logo: 'https://ovh.github.io/manager/ovhcloud-logo.webp'
        },
        label: 'OVH Cloud',
        value: 'ovh'
      }]
    }, {
      customRendererData: {
        flag: 'https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg'
      },
      label: 'US providers',
      options: [{
        customRendererData: {
          description: 'Amazon Web Services, Inc. is a subsidiary of Amazon that provides on-demand cloud computing platforms and APIs to individuals, companies, and governments, on a metered, pay-as-you-go basis. Clients will often use this in combination with autoscaling.',
          logo: 'https://cdn.icon-icons.com/icons2/2407/PNG/512/aws_icon_146074.png'
        },
        label: 'Amazon Web Services',
        value: 'aws'
      }, {
        customRendererData: {
          description: 'Microsoft Azure, often referred to as just Azure, is a cloud computing platform developed by Microsoft. It offers management, access and development of applications and services through its global infrastructure.',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Microsoft_Azure.svg/2048px-Microsoft_Azure.svg.png'
        },
        label: 'Microsoft Azure',
        value: 'azure'
      }, {
        customRendererData: {
          description: 'Google Cloud Platform, offered by Google, is a suite of cloud computing services that provides a series of modular cloud services including computing, data storage, data analytics, and machine learning, alongside a set of management tools.',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Google-cloud-platform.svg'
        },
        label: 'Google Cloud Platform',
        value: 'gcp'
      }]
    }];
    return <Select items={items} multiple>
        <SelectControl customItemRenderer={({
        selectedItems
      }) => <span style={{
        display: 'flex',
        flexFlow: 'row',
        gap: '8px',
        flexWrap: 'wrap'
      }}>
          {selectedItems.map((item, idx) => <span style={{
          display: 'flex',
          flexFlow: 'row',
          gap: '4px',
          alignItems: 'center'
        }} key={item.value}>
                <img alt={item.label} height={15} src={item.customRendererData?.logo} width={15} />

                <span>{item.label}{idx < selectedItems.length - 1 && ', '}</span>
              </span>)}
        </span>} />

        <SelectContent customGroupRenderer={({
        customData,
        label
      }) => <div style={{
        display: 'flex',
        flexFlow: 'row',
        columnGap: '8px',
        alignItems: 'center'
      }}>
              <img alt="flag" height={20} src={customData?.flag} width={30} />

              <span>{label}</span>
            </div>} customOptionRenderer={({
        customData,
        label
      }) => <div style={{
        display: 'flex',
        flexFlow: 'row',
        columnGap: '8px',
        alignItems: 'center',
        padding: '8px 0'
      }}>
              <img alt={label} height={50} src={customData?.logo} width={50} />
              <div style={{
          display: 'flex',
          flexFlow: 'column',
          rowGap: '8px'
        }}>
                <span style={{
            fontWeight: 'bold'
          }}>{label}</span>
                <span>{customData?.description}</span>
              </div>
            </div>} />
      </Select>;
  }
}`,...(O=(_=p.parameters)==null?void 0:_.docs)==null?void 0:O.source}}};var E,D,H;u.parameters={...u.parameters,docs:{...(E=u.parameters)==null?void 0:E.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Select, SelectContent, SelectControl } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Select items={[{
    label: 'Dog',
    value: 'dog'
  }, {
    label: 'Cat',
    value: 'cat'
  }, {
    label: 'Hamster',
    value: 'hamster'
  }, {
    label: 'Parrot',
    value: 'parrot'
  }, {
    label: 'Spider',
    value: 'spider'
  }, {
    label: 'Goldfish',
    value: 'goldfish'
  }]}>
      <SelectControl />

      <SelectContent />
    </Select>
}`,...(H=(D=u.parameters)==null?void 0:D.docs)==null?void 0:H.source}}};var P,M,z;m.parameters={...m.parameters,docs:{...(P=m.parameters)==null?void 0:P.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'column',
    gap: '8px'
  }}>{story()}</div>],
  globals: {
    imports: \`import { TEXT_PRESET, Select, SelectContent, SelectControl, Text } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <>
      <Select disabled items={[{
      label: 'Dog',
      value: 'dog'
    }, {
      label: 'Cat',
      value: 'cat'
    }, {
      label: 'Hamster',
      value: 'hamster'
    }, {
      label: 'Parrot',
      value: 'parrot'
    }, {
      label: 'Spider',
      value: 'spider'
    }, {
      label: 'Goldfish',
      value: 'goldfish'
    }]}>
        <Text htmlFor="disabled" preset={TEXT_PRESET.label}>
          Disabled
        </Text>

        <SelectControl id="disabled" placeholder="Select one or more pets" />

        <SelectContent />
      </Select>

      <Select items={[{
      label: 'Dog',
      value: 'dog',
      disabled: true
    }, {
      label: 'Cat',
      value: 'cat'
    }, {
      label: 'Hamster',
      value: 'hamster'
    }, {
      label: 'Parrot',
      value: 'parrot',
      disabled: true
    }, {
      label: 'Spider',
      value: 'spider'
    }, {
      label: 'Goldfish',
      value: 'goldfish'
    }]}>
        <Text htmlFor="disabled-options" preset={TEXT_PRESET.label}>
          Disabled options
        </Text>

        <SelectControl id="disabled-options" placeholder="Select one or more pets" />

        <SelectContent />
      </Select>

      <Select items={[{
      label: 'Europe',
      options: [{
        label: 'France',
        value: 'fr'
      }, {
        label: 'Germany',
        value: 'de',
        disabled: true
      }, {
        label: 'Italy',
        value: 'it'
      }]
    }, {
      disabled: true,
      label: 'Asia',
      options: [{
        label: 'China',
        value: 'cn',
        disabled: true
      }, {
        label: 'Japan',
        value: 'jp',
        disabled: true
      }, {
        label: 'Russia',
        value: 'ru',
        disabled: true
      }]
    }, {
      label: 'North America',
      options: [{
        label: 'Canada',
        value: 'ca'
      }, {
        label: 'Mexico',
        value: 'mx'
      }, {
        label: 'United States of America',
        value: 'us'
      }]
    }]}>
        <Text htmlFor="disabled-group" preset={TEXT_PRESET.label}>
          Disabled group or group option
        </Text>

        <SelectControl id="disabled-group" />

        <SelectContent />
      </Select>
    </>
}`,...(z=(M=m.parameters)==null?void 0:M.docs)==null?void 0:z.source}}};var I,L,k;g.parameters={...g.parameters,docs:{...(I=g.parameters)==null?void 0:I.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Select, SelectContent, SelectControl } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Select items={[{
    label: 'Europe',
    options: [{
      label: 'France',
      value: 'fr'
    }, {
      label: 'Germany',
      value: 'de'
    }, {
      label: 'Italy',
      value: 'it'
    }]
  }, {
    label: 'Asia',
    options: [{
      label: 'China',
      value: 'cn'
    }, {
      label: 'Japan',
      value: 'jp'
    }, {
      label: 'Russia',
      value: 'ru'
    }]
  }, {
    label: 'North America',
    options: [{
      label: 'Canada',
      value: 'ca'
    }, {
      label: 'Mexico',
      value: 'mx'
    }, {
      label: 'United States of America',
      value: 'us'
    }]
  }]}>
      <SelectControl />

      <SelectContent />
    </Select>
}`,...(k=(L=g.parameters)==null?void 0:L.docs)==null?void 0:k.source}}};var W,N,V;b.parameters={...b.parameters,docs:{...(W=b.parameters)==null?void 0:W.docs,source:{originalSource:`{
  globals: {
    imports: \`import { FormField, FormFieldLabel, Select, SelectContent, SelectControl } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <FormField>
      <FormFieldLabel>
        Select a Web hosting
      </FormFieldLabel>

      <Select items={[{
      label: '1 vCore 2,4 GHz, 2 Go RAM',
      value: 'hosting-1'
    }, {
      label: '1 vCore 2,4 GHz, 4 Go RAM',
      value: 'hosting-2'
    }, {
      label: '2 vCores 2,4 GHz, 8 Go RAM',
      value: 'hosting-3'
    }]}>
        <SelectControl />

        <SelectContent />
      </Select>
    </FormField>
}`,...(V=(N=b.parameters)==null?void 0:N.docs)==null?void 0:V.source}}};var U,X,Y;v.parameters={...v.parameters,docs:{...(U=v.parameters)==null?void 0:U.docs,source:{originalSource:`{
  decorators: [story => <div style={{
    display: 'flex',
    flexFlow: 'column',
    gap: '8px'
  }}>{story()}</div>],
  globals: {
    imports: \`import { TEXT_PRESET, Select, SelectContent, SelectControl, Text } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <>
      <Select items={[{
      label: 'Dog',
      value: 'dog'
    }, {
      label: 'Cat',
      value: 'cat'
    }, {
      label: 'Hamster',
      value: 'hamster'
    }, {
      label: 'Parrot',
      value: 'parrot'
    }, {
      label: 'Spider',
      value: 'spider'
    }, {
      label: 'Goldfish',
      value: 'goldfish'
    }]} multiple>
        <Text htmlFor="multiple" preset={TEXT_PRESET.label}>
          Default multiple selection
        </Text>

        <SelectControl id="multiple" placeholder="Select one or more pets" />

        <SelectContent />
      </Select>

      <Select items={[{
      label: 'Dog',
      value: 'dog'
    }, {
      label: 'Cat',
      value: 'cat'
    }, {
      label: 'Hamster',
      value: 'hamster'
    }, {
      label: 'Parrot',
      value: 'parrot'
    }, {
      label: 'Spider',
      value: 'spider'
    }, {
      label: 'Goldfish',
      value: 'goldfish'
    }]} multiple="merge">
        <Text htmlFor="multiple-merged" preset={TEXT_PRESET.label}>
          Merged multiple selection
        </Text>

        <SelectControl id="multiple-merged" placeholder="Select one or more pets" />

        <SelectContent />
      </Select>
    </>
}`,...(Y=(X=v.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var J,q,B;h.parameters={...h.parameters,docs:{...(J=h.parameters)==null?void 0:J.docs,source:{originalSource:`{
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Select items={[{
    label: 'Dog',
    value: 'dog'
  }, {
    label: 'Cat',
    value: 'cat'
  }, {
    label: 'Hamster',
    value: 'hamster'
  }, {
    label: 'Parrot',
    value: 'parrot'
  }, {
    label: 'Spider',
    value: 'spider'
  }, {
    label: 'Goldfish',
    value: 'goldfish'
  }]}>
      <SelectControl placeholder="Select one or more pets" />

      <SelectContent />
    </Select>
}`,...(B=(q=h.parameters)==null?void 0:q.docs)==null?void 0:B.source}}};var K,Q,Z;f.parameters={...f.parameters,docs:{...(K=f.parameters)==null?void 0:K.docs,source:{originalSource:`{
  globals: {
    imports: \`import { Select, SelectContent, SelectControl } from '@ovhcloud/ods-react';\`
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        ...staticSourceRenderConfig()
      }
    }
  },
  render: ({}) => <Select items={[{
    label: 'Dog',
    value: 'dog'
  }, {
    label: 'Cat',
    value: 'cat'
  }, {
    label: 'Hamster',
    value: 'hamster'
  }, {
    label: 'Parrot',
    value: 'parrot'
  }, {
    label: 'Spider',
    value: 'spider'
  }, {
    label: 'Goldfish',
    value: 'goldfish'
  }]} readOnly>
      <SelectControl placeholder="Select one or more pets" />

      <SelectContent />
    </Select>
}`,...(Z=(Q=f.parameters)==null?void 0:Q.docs)==null?void 0:Z.source}}};const re=["Demo","AccessibilityFormField","CustomRenderer","Default","Disabled","Group","InFormField","Multiple","Overview","Readonly"],me=Object.freeze(Object.defineProperty({__proto__:null,AccessibilityFormField:c,CustomRenderer:p,Default:u,Demo:d,Disabled:m,Group:g,InFormField:b,Multiple:v,Overview:h,Readonly:f,__namedExportsOrder:re,default:te},Symbol.toStringTag,{value:"Module"}));export{c as A,p as C,u as D,g as G,b as I,v as M,h as O,f as R,me as S,m as a};
