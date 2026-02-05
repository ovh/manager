import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as s}from"./index-D9W7WIyf.js";import{M as a}from"./index-CkYkztty.js";import{S as t}from"./index-Do3lsREi.js";import"./index-Bnop-kX6.js";import"./iframe-BRkcAREb.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./Link-TMoA1i18-DiBAU0SL.js";import"./index-CWkFp9WS-BSIT86NH.js";function i(o){const n={code:"code",li:"li",p:"p",pre:"pre",ul:"ul",...s(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(a,{title:"Manager React Components/Hooks/useAllLocationsByType"}),`
`,e.jsx(t,{label:"Overview",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"useAllLocationsByType"})," hook is a data filtering utility designed to get a list of locations coming from the API v2 endpoint ",e.jsx(n.code,{children:"/location"})," with a matching type (",e.jsx(n.code,{children:"REGION-1-AZ"}),", ",e.jsx(n.code,{children:"REGION-3-AZ"})," or ",e.jsx(n.code,{children:"LOCAL-ZONE"}),")."]}),`
`,e.jsx(t,{label:"Api",level:2}),`
`,e.jsx(t,{label:"Parameters",level:3}),`
`,e.jsxs(n.p,{children:["The hook accept a single ",e.jsx(n.code,{children:"LocationType"})," parameter representing the type of location to search."]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`enum LocationType {
  '1AZ' = 'REGION-1-AZ',
  '3AZ' = 'REGION-3-AZ',
  'LZ' = 'LOCAL-ZONE',
};
`})}),`
`,e.jsx(t,{label:"Return Value",level:3}),`
`,e.jsxs(n.p,{children:["The hook returns a ",e.jsx(n.code,{children:"UseQueryResult"})," object with:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"data"}),": an array of ",e.jsx(n.code,{children:"Location"})," objects matching the type given in parameter"]}),`
`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`type Location = {
  availabilityZones: string[];
  cardinalPoint: CardinalPoint;
  cityCode: string;
  cityLatitude: number;
  cityLongitude: number;
  cityName: string;
  code: string;
  countryCode: string;
  countryName: string;
  geographyCode: string;
  geographyName: string;
  location: string;
  name: string;
  openingYear: number;
  specificType: SpecificType;
  type: Type;
};

// The following types are not exposed by Manager React Components, but by @ovh-ux/shell
type CardinalPoint =
  | 'CENTRAL'
  | 'EAST'
  | 'NORTH'
  | 'NORTHEAST'
  | 'NORTHWEST'
  | 'SOUTH'
  | 'SOUTHEAST'
  | 'SOUTHWEST'
  | 'WEST';
type SpecificType = 'BACKUP' | 'LZ' | 'SNC' | 'STANDARD';
type Type = 'LOCAL-ZONE' | 'REGION-1-AZ' | 'REGION-3-AZ';
`})}),`
`,e.jsx(t,{label:"Example Usage",level:3}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { useAllLocationsByType, LocationType } from '@ovh-ux/manager-react-components';

function MyComponent() {
  const { data: lzLocations } = useAllLocationsByType(LocationType.LZ);
}
`})}),`
`,e.jsx(t,{label:"Notes",level:3}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"The hook uses React Query under the hood for efficient data caching and state management"}),`
`,e.jsxs(n.li,{children:["The hook use the same ",e.jsx(n.code,{children:"queryFn"})," and ",e.jsx(n.code,{children:"queryKey"})," as ",e.jsx(n.code,{children:"useAllCountries"}),", ",e.jsx(n.code,{children:"useCityByCode"})," and ",e.jsx(n.code,{children:"useLocationsByName"})," for efficiency"]}),`
`]})]})}function g(o={}){const{wrapper:n}={...s(),...o.components};return n?e.jsx(n,{...o,children:e.jsx(i,{...o})}):i(o)}export{g as default};
