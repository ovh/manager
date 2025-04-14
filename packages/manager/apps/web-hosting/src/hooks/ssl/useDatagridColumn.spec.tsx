import { describe, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import useDatagridColumn from '@/hooks/ssl/useDatagridColumn';
import { DomainDetails } from '@/types/ssl';

const domainData: DomainDetails[] = [
  {
    domain: '',
    additional: ['', ''],
    type: '',
    state: '',
    creationDate: '',
    expirationDate: '',
  },
];

describe('useDatagridColumn', () => {
  it('should return correct columns', () => {
    const { result } = renderHook(() => useDatagridColumn());

    const columns = result.current;

    expect(columns).toHaveLength(7);
    expect(columns[0].id).toBe('mainDomain');
    expect(columns[1].id).toBe('additionalDomain');
    expect(columns[2].id).toBe('type');
    expect(columns[3].id).toBe('state');
    expect(columns[4].id).toBe('creationDate');
    expect(columns[5].id).toBe('expirationDate');
    expect(columns[6].id).toBe('actions');
  });

  it('should render correct cells', () => {
    const { result } = renderHook(() => useDatagridColumn());

    const columns = result.current;

    const mainDomainCell = columns[0].cell(domainData[0]);
    const additionalDomainCell = columns[1].cell(domainData[0]);
    const typeCell = columns[2].cell(domainData[0]);
    const stateCell = columns[3].cell(domainData[0]);
    const creationDateCell = columns[4].cell(domainData[0]);
    const expirationDateCell = columns[5].cell(domainData[0]);
    const actionsCell = columns[6].cell(domainData[0]);

    expect(mainDomainCell.props.children).toBe(domainData[0].domain);
    expect(additionalDomainCell.props.children).toBe(domainData[0].additional);
    expect(typeCell.props.children).toBe(domainData[0].type);
    expect(stateCell.props.children).toBe(domainData[0].state);
    expect(creationDateCell.props.size).toBe(domainData[0].creationDate);
    expect(expirationDateCell.props.statusGroup).toBe(
      domainData[0].expirationDate,
    );
    expect(actionsCell.props.volume).toBe(domainData[0]);
  });
});
