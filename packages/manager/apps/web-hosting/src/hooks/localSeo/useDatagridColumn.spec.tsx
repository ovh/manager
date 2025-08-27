import { ReactElement } from 'react';

import { renderHook } from '@testing-library/react';
import { describe, it } from 'vitest';

import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';

import { Badge } from '@ovh-ux/manager-react-components';

import { localSeoMocks } from '@/data/__mocks__';

import useDatagridColumn from './useDatagridColumn';

describe('useDatagridColumn', () => {
  it('should return correct columns', () => {
    const { result } = renderHook(() => useDatagridColumn());

    const columns = result.current;

    expect(columns).toHaveLength(5);
    expect(columns[0].id).toBe('name');
    expect(columns[1].id).toBe('address');
    expect(columns[2].id).toBe('email');
    expect(columns[3].id).toBe('status');
  });

  it('should render correct cells', () => {
    const { result } = renderHook(() => useDatagridColumn());

    const columns = result.current;

    type ElementWithStringChildren = ReactElement<{ children: string }>;
    const nameCell = columns[0].cell(localSeoMocks[0]) as ElementWithStringChildren;
    const addressCell = columns[1].cell(localSeoMocks[0]) as ElementWithStringChildren;
    const statusCell = columns[3].cell(localSeoMocks[0]) as ElementWithStringChildren;

    expect(nameCell.props.children).toBe(localSeoMocks[0].name);
    expect(addressCell?.props?.children).toBe(localSeoMocks[0].address);
    expect(statusCell?.props?.children).toStrictEqual(
      <Badge
        label="hosting_tab_LOCAL_SEO_state_created"
        className="my-3"
        color={ODS_BADGE_COLOR.success}
      />,
    );
  });
});
