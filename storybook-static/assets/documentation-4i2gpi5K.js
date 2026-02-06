import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as a}from"./index-BfqaEpqY.js";import{M as r}from"./index-BxLe8RGf.js";import{S as t}from"./index-BMRY0zXK.js";import"./index-Bnop-kX6.js";import"./iframe-lMOw8NAl.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./Link-TMoA1i18-DiBAU0SL.js";import"./index-CWkFp9WS-BSIT86NH.js";function i(o){const n={code:"code",li:"li",p:"p",pre:"pre",ul:"ul",...a(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(r,{title:"Manager React Components/Hooks/useLocationByName"}),`
`,e.jsx(t,{label:"Overview",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"useLocationByName"})," hook is a data filtering utility designed to get a location coming from the API v2 endpoint ",e.jsx(n.code,{children:"/location"})," with a matching name."]}),`
`,e.jsx(t,{label:"Api",level:2}),`
`,e.jsx(t,{label:"Parameters",level:3}),`
`,e.jsxs(n.p,{children:["The hook accept a single ",e.jsx(n.code,{children:"string"})," parameter representing the name of the searched location"]}),`
`,e.jsx(t,{label:"Return Value",level:3}),`
`,e.jsxs(n.p,{children:["The hook returns a ",e.jsx(n.code,{children:"UseQueryResult"})," object with:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"data"}),": a ",e.jsx(n.code,{children:"Location"})," object matching the name given in parameter"]}),`
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
export type CardinalPoint =
  | 'CENTRAL'
  | 'EAST'
  | 'NORTH'
  | 'NORTHEAST'
  | 'NORTHWEST'
  | 'SOUTH'
  | 'SOUTHEAST'
  | 'SOUTHWEST'
  | 'WEST';
export type SpecificType = 'BACKUP' | 'LZ' | 'SNC' | 'STANDARD';
export type Type = 'LOCAL-ZONE' | 'REGION-1-AZ' | 'REGION-3-AZ';
`})}),`
`,e.jsx(t,{label:"Example Usage",level:3}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { useLocationByName } from '@ovh-ux/manager-react-components';

function MyComponent() {
  const { data: myLocation } = useLocationByName('myLocationName');
}
`})}),`
`,e.jsx(t,{label:"Notes",level:3}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"The hook uses React Query under the hood for efficient data caching and state management"}),`
`,e.jsxs(n.li,{children:["The hook use the same ",e.jsx(n.code,{children:"queryFn"})," and ",e.jsx(n.code,{children:"queryKey"})," as ",e.jsx(n.code,{children:"useAllCountries"}),", ",e.jsx(n.code,{children:"useAllLocationsByType"})," and ",e.jsx(n.code,{children:"useCityByCode"})," for efficiency"]}),`
`]})]})}function j(o={}){const{wrapper:n}={...a(),...o.components};return n?e.jsx(n,{...o,children:e.jsx(i,{...o})}):i(o)}export{j as default};
