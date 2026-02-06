import{j as n}from"./jsx-runtime-BRNY0I4F.js";import{u as s}from"./index-BfqaEpqY.js";import{b as a,S as o,d as l,a as c}from"./index-BMRY0zXK.js";import g from"./useTranslatedMicroRegions.stories-BxMYdhr1.js";import{M as d,S as i}from"./index-BxLe8RGf.js";import"./index-Bnop-kX6.js";import"./Link-TMoA1i18-DiBAU0SL.js";import"./index-CWkFp9WS-BSIT86NH.js";import"./lib-7WI39Bnb-D_SCLDHY.js";import"./iframe-lMOw8NAl.js";import"./QueryClientProvider-BRZnJt9g.js";import"./index-Do5RsF8R.js";import"./index-4pTrEEYx.js";import"./Icon-xxQ9IRzi-ORI6lMWl.js";import"./Text-BGoUCJU7-BjFZdlzU.js";import"./ComboboxControl-EYkaEIlI-CWYTos8A.js";import"./Divider-wQyo85oE-5vlIiwia.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function t(r){const e={code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...s(),...r.components};return n.jsxs(n.Fragment,{children:[n.jsx(d,{title:"Manager UI Kit/Hooks/useTranslatedMicroRegions/Documentation"}),`
`,n.jsx(a,{of:g}),`
`,n.jsx(e.h1,{id:"usetranslatedmicroregions",children:"useTranslatedMicroRegions"}),`
`,n.jsxs(e.p,{children:["The ",n.jsx(e.code,{children:"useTranslatedMicroRegions"})," hook provides utilities for translating OVHcloud region identifiers into human-readable localized strings. It handles micro-regions, macro-regions, and continent names."]}),`
`,n.jsx(e.h2,{id:"overview",children:"Overview"}),`
`,n.jsx(e.p,{children:"OVHcloud regions follow specific naming conventions:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Micro-region"}),": Full region identifier (e.g., ",n.jsx(e.code,{children:"GRA-1"}),", ",n.jsx(e.code,{children:"EU-WEST-LZ-MAD-A"}),")"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Macro-region"}),": Geographic area (e.g., ",n.jsx(e.code,{children:"GRA"}),", ",n.jsx(e.code,{children:"MAD"}),")"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Continent"}),": Continental location (e.g., ",n.jsx(e.code,{children:"Europe"}),", ",n.jsx(e.code,{children:"North America"}),")"]}),`
`]}),`
`,n.jsx(e.p,{children:"This hook automatically extracts the macro-region from a full region string and returns appropriate translations."}),`
`,n.jsx(o,{label:"Basic Usage",level:2}),`
`,n.jsx(i,{code:`import { useTranslatedMicroRegions } from '@ovh-ux/muk';

function MyComponent() {
  const { 
    translateMicroRegion, 
    translateMacroRegion, 
    translateContinentRegion 
  } = useTranslatedMicroRegions();

  const region = 'GRA-1';
  
  return (
    <div>
      <p>Micro: {translateMicroRegion(region)}</p>
      {/* → "Gravelines 1" */}
      
      <p>Macro: {translateMacroRegion(region)}</p>
      {/* → "Gravelines" */}
      
      <p>Continent: {translateContinentRegion(region)}</p>
      {/* → "Europe" */}
    </div>
  );
}`,language:"tsx"}),`
`,n.jsx(o,{label:"Return Values",level:2}),`
`,n.jsx(e.p,{children:"The hook returns an object with three translation functions:"}),`
`,n.jsx(l,{items:[{property:"translateMicroRegion",type:"(region: string) => string",description:"Translates the full region identifier including zone number"},{property:"translateMacroRegion",type:"(region: string) => string",description:"Translates the macro-region (geographic area name)"},{property:"translateContinentRegion",type:"(region: string) => string",description:"Translates the continent where the region is located"}]}),`
`,n.jsx(o,{label:"Region Format Examples",level:2}),`
`,n.jsx(i,{code:`const { translateMicroRegion, translateMacroRegion } = useTranslatedMicroRegions();

// Standard region format
translateMicroRegion('GRA-1');      // → "Gravelines 1"
translateMacroRegion('GRA-1');      // → "Gravelines"

// Single segment region
translateMicroRegion('WES1');       // → "WES 1"
translateMacroRegion('WES1');       // → "WES"

// Local zone format
translateMicroRegion('EU-WEST-LZ-MAD-A');  // → "Madrid A"
translateMacroRegion('EU-WEST-LZ-MAD-A');  // → "Madrid"

// Multi-segment region
translateMicroRegion('US-EAST-VA-1'); // → "Virginia 1"
translateMacroRegion('US-EAST-VA-1'); // → "Virginia"`,language:"tsx"}),`
`,n.jsx(o,{label:"How It Works",level:2}),`
`,n.jsx(e.h3,{id:"macro-region-extraction",children:"Macro-Region Extraction"}),`
`,n.jsxs(e.p,{children:["The hook uses ",n.jsx(e.code,{children:"getMacroRegion()"})," utility to extract the geographic identifier from a full region string:"]}),`
`,n.jsx(i,{code:`// Region parsing logic
'GRA-1'              → macro: 'GRA'
'WES1'               → macro: 'WES'
'EU-WEST-LZ-MAD-A'   → macro: 'MAD'  (local zone)
'US-EAST-VA-1'       → macro: 'VA'
'Unknown'            → macro: 'Unknown_Macro_Region'`,language:"text"}),`
`,n.jsx(e.h3,{id:"translation-keys",children:"Translation Keys"}),`
`,n.jsxs(e.p,{children:["The hook checks for translation keys in the ",n.jsx(e.code,{children:"region"})," namespace:"]}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Micro-region"}),": ",n.jsx(e.code,{children:"region_${macro}_micro"})," (e.g., ",n.jsx(e.code,{children:"region_GRA_micro"}),")"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Macro-region"}),": ",n.jsx(e.code,{children:"region_${macro}"})," (e.g., ",n.jsx(e.code,{children:"region_GRA"}),")"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Continent"}),": ",n.jsx(e.code,{children:"region_continent_${macro}"})," (e.g., ",n.jsx(e.code,{children:"region_continent_GRA"}),")"]}),`
`]}),`
`,n.jsx(e.p,{children:"If a translation key doesn't exist, it returns an empty string."}),`
`,n.jsx(o,{label:"Use Cases",level:2}),`
`,n.jsx(e.h3,{id:"1-display-region-in-dropdown",children:"1. Display Region in Dropdown"}),`
`,n.jsx(i,{code:`function RegionSelector({ regions }) {
  const { translateMicroRegion } = useTranslatedMicroRegions();
  
  return (
    <select>
      {regions.map((region) => (
        <option key={region} value={region}>
          {translateMicroRegion(region)}
        </option>
      ))}
    </select>
  );
}`,language:"tsx"}),`
`,n.jsx(e.h3,{id:"2-show-region-hierarchy",children:"2. Show Region Hierarchy"}),`
`,n.jsx(i,{code:`function RegionDetails({ regionCode }) {
  const { 
    translateMicroRegion, 
    translateMacroRegion, 
    translateContinentRegion 
  } = useTranslatedMicroRegions();
  
  return (
    <div>
      <p>Continent: {translateContinentRegion(regionCode)}</p>
      <p>Region: {translateMacroRegion(regionCode)}</p>
      <p>Zone: {translateMicroRegion(regionCode)}</p>
    </div>
  );
}`,language:"tsx"}),`
`,n.jsx(e.h3,{id:"3-filter-by-continent",children:"3. Filter by Continent"}),`
`,n.jsx(i,{code:`function RegionFilter({ regions }) {
  const { translateContinentRegion } = useTranslatedMicroRegions();
  
  const continents = [...new Set(
    regions.map(r => translateContinentRegion(r))
  )].filter(Boolean);
  
  return (
    <select>
      {continents.map(continent => (
        <option key={continent}>{continent}</option>
      ))}
    </select>
  );
}`,language:"tsx"}),`
`,n.jsx(o,{label:"Local Zone Detection",level:2}),`
`,n.jsx(e.p,{children:"The hook includes utilities for detecting local zones:"}),`
`,n.jsx(i,{code:`import { isLocalZone } from '@ovh-ux/muk';

isLocalZone('EU-WEST-LZ-MAD-A'); // → true
isLocalZone('GRA-1');            // → false

// Use in conditional rendering
const isLZ = isLocalZone(region);
return (
  <Badge color={isLZ ? 'info' : 'default'}>
    {isLZ ? 'Local Zone' : 'Region'}
  </Badge>
);`,language:"tsx"}),`
`,n.jsx(o,{label:"Best Practices",level:2}),`
`,n.jsx(c,{items:[{do:"Use translateMicroRegion for displaying full region details",dont:"Display raw region codes to end users"},{do:"Check if translation exists before displaying (returns empty string if not found)",dont:"Assume all region codes have translations"},{do:"Use translateMacroRegion for grouping regions",dont:"Parse region strings manually"},{do:"Cache the hook result if using multiple times in the same component",dont:"Call the hook repeatedly in loops"}]}),`
`,n.jsx(o,{label:"API Reference",level:2}),`
`,n.jsx(e.h3,{id:"hook-signature",children:"Hook Signature"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`const {
  translateMicroRegion,
  translateMacroRegion,
  translateContinentRegion,
} = useTranslatedMicroRegions();
`})}),`
`,n.jsx(e.h3,{id:"parameters",children:"Parameters"}),`
`,n.jsx(e.p,{children:"This hook takes no parameters."}),`
`,n.jsx(e.h3,{id:"return-value",children:"Return Value"}),`
`,n.jsxs(e.p,{children:[`| Method | Type | Description |
|--------|------|-------------|
| `,n.jsx(e.code,{children:"translateMicroRegion"})," | ",n.jsx(e.code,{children:"(region: string) => string"}),` | Returns localized micro-region name with zone identifier |
| `,n.jsx(e.code,{children:"translateMacroRegion"})," | ",n.jsx(e.code,{children:"(region: string) => string"}),` | Returns localized macro-region name (geographic area) |
| `,n.jsx(e.code,{children:"translateContinentRegion"})," | ",n.jsx(e.code,{children:"(region: string) => string"})," | Returns localized continent name |"]}),`
`,n.jsx(e.h3,{id:"utility-functions",children:"Utility Functions"}),`
`,n.jsxs(e.p,{children:[`| Function | Type | Description |
|----------|------|-------------|
| `,n.jsx(e.code,{children:"getMacroRegion"})," | ",n.jsx(e.code,{children:"(region: string) => string"}),` | Extracts macro-region identifier from full region string |
| `,n.jsx(e.code,{children:"isLocalZone"})," | ",n.jsx(e.code,{children:"(region: string) => boolean"})," | Checks if region is a local zone (contains 'LZ' pattern) |"]}),`
`,n.jsx(o,{label:"Notes",level:2}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["Translations are loaded from the ",n.jsx(e.code,{children:"region"})," i18n namespace"]}),`
`,n.jsx(e.li,{children:"Returns empty string if translation key doesn't exist"}),`
`,n.jsx(e.li,{children:"Automatically adapts to current application language"}),`
`,n.jsx(e.li,{children:"Supports all OVHcloud region naming conventions"}),`
`,n.jsx(e.li,{children:"Safe to use with invalid or malformed region strings"}),`
`]})]})}function L(r={}){const{wrapper:e}={...s(),...r.components};return e?n.jsx(e,{...r,children:n.jsx(t,{...r})}):t(r)}export{L as default};
