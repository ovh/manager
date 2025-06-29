---
description: Rules to generates basic test fast
---

# React Unit Test


## Testing in Manager µ-app

Testing front-end applications involves various types of testing to ensure their functionality, reliability, and performance. Developing on Manager involves both writing code to implement new features and ensuring their reliability through unit and integration testing.

To add the test-cases, Vitest testing framework is used along with Jest and React Testing framework libraries.

In the context of Manager, Unit/Integration testing must be done based on the mocked API response.

Refer Unit Testing in Manager and Integration testing in Manager sections to know more about how to add test-cases.

### Info

Developers should prioritize adding test cases where logically expected, rather than merely for the sake of achieving coverage.


Unit Testing

Add the unit test-cases to test the individual components,hooks or utility methods in isolation. Generally, this should target the entities in src/components, src/hooks and src/utils.
Testing Components

While unit-testing the components, verify the components rendering, state changes, and interactions.

Let's consider we have the following component which makes an API call. The component displays the skeleton till the API answers and then it display the API response as a link,

import { OsdsLink, OsdsSkeleton } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useQuery } from '@tanstack/react-query';

export default function TestComponent() {
  const { data, isPending, isLoading } = useQuery();
  return isPending || isLoading ? (
    <OsdsSkeleton data-testid="AttachedInstanceComponent_skeleton" />
  ) : (
    <OsdsLink
      color={ODS_THEME_COLOR_INTENT.primary}
      href={`test/link`}
    >
      {data.name}
    </OsdsLink>
  );
}

So, unit testing for the above component can include 2 scenrios,

    To test the display of skeleton when the the data is being loaded.
    To test the display of link after the data is loaded.

import TestComponent from '@/src/components/test.component';

describe('TestComponent', () => {
  it('renders OsdsSkeleton when data is loading', () => {});

  it('renders link when data is loaded', () => {});
});

### Testing Hooks

The generic reusable hooks must be unit-tested to ensure the hook is working as expected in isolation.

Lets consider a hook which makes an API call using useQuery and provides additional capabilties of client side sorting.

```ts
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export function useResources({
  route,
  queryKey,
  pageSize = 10,
  defaultSorting = { column: '', direction: '' }
}) {
  const { data } = useQuery({
    queryKey: [queryKey],
    queryFn: featchResults(route)
  });
  const [sorting, setSorting] = useState(defaultSorting);
  const [sortData, setSortData] = useState([]);

  useEffect(() => {
    if (data?.length > 0 && sorting.direction && sorting.column) {
      setSortData([...data]?.sort((a, b) =>
        sorting.direction === 'ASC'
          ? a[sorting.column] - b[sorting.column]
          : b[sorting.column] - a[sorting.column];
      ));
    }
  }, [data, sorting]);

  return {
    data: sortData,
    sorting,
    setSorting,
  };
}
```

Unit-testing for the hook can be done with mocked API response to verify,

    The hook correctly sets the data right after the response from API
    The hook correctly sorts the data upon sort using setSorting callback for both ascending and descending order.

```ts
import useResources from '@/src/hooks/useResources';

describe('useResources', () => {
  it('fetches data on load and returns the data same as mocked data', () => {});

  it('sorts column "A" in the ascending order', () => {});

  it('sorts column "A" in the descending order', () => {});
});
```

## Priorize use `it.each` to avoid repetition

```ts
import useResources from '@/src/hooks/useResources';

describe('useResources', () => {
  it.each[{ given: "", mocked: "", expected: "" }, { given: "", mocked: "", expected: "" }]('fetches data on load and returns the data same as mocked data', () => {});
});
```

## Testing Utility methods

When necessary, we may need to introduce utility functions to meet specific business needs or transform data. Apart from the dedicated utility methods in @/src/utils/, similar functions are added within the scope of component/hook. It's crucial that we prioritize unit-testing for these utilities to ensure their reliability and effectiveness.

Consider an utility method to check if the given IPv4 address is available.

```ts
import ipaddr from 'ipaddr.js';

export function isIpAddressAvailable(ipAddress, consumedIpAddress) {
  if(ipaddr.isValid(ipAddress)) {
    return false;
  }

  return consumedIpAddress.some((ip) => ip === ipAddress);
}
```

Unit test-cases for the utility can be done for below scenarios,

    Check the result with invalid IP address
    Check if the IP address is available or not.

```ts
import isIpAddressAvailable from '@/src/utils/ipAvailability';

describe('isIpAddressAvailable', () => {
  it('returns false for invalid IP', () => {});

  it('returns true if IP is not present in the IP input list', () => {});

  it('returns false if IP is present in the IP input list', () => {});
});
```

