import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../../../utils/test.provider';
import { Datagrid } from '../../Datagrid.component';
import { useAuthorizationIam } from '../../../../hooks/iam';
import { IamAuthorizationResponse } from '../../../../hooks/iam/iam.interface';

vitest.mock('../../../../hooks/iam', () => ({
  useAuthorizationIam: vitest.fn().mockReturnValue({
    isAuthorized: true,
    isLoading: false,
    isFetched: true,
  }),
}));

const mockedHook =
  useAuthorizationIam as unknown as jest.Mock<IamAuthorizationResponse>;

const columns = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
  },
  {
    id: 'age',
    header: 'Age',
    accessorKey: 'age',
  },
];

const data = [
  {
    name: 'John',
    age: 25,
  },
  {
    name: 'Jane',
    age: 26,
  },
];

describe('FooterActions', () => {
  beforeEach(() => {
    mockedHook.mockReturnValue({
      isAuthorized: true,
      isLoading: true,
      isFetched: true,
    });
  });

  it('should render the footer actions', () => {
    render(
      <Datagrid
        columns={columns}
        data={data}
        hasNextPage={true}
        onFetchNextPage={vi.fn()}
        onFetchAllPages={vi.fn()}
        isLoading={false}
      />,
    );
    expect(screen.getByText('Load more')).toBeInTheDocument();
    expect(screen.getByText('Load all')).toBeInTheDocument();
  });

  it('should render only load more  actions', () => {
    render(
      <Datagrid
        columns={columns}
        data={data}
        hasNextPage={true}
        onFetchNextPage={vi.fn()}
      />,
    );
    expect(screen.getByText('Load more')).toBeInTheDocument();
    expect(screen.queryByText('Load all')).not.toBeInTheDocument();
  });

  it('should not render load more action when hasNextPage is false', () => {
    render(
      <Datagrid
        columns={columns}
        data={data}
        hasNextPage={false}
        onFetchNextPage={vi.fn()}
      />,
    );
    expect(screen.queryByText('Load more')).not.toBeInTheDocument();
  });

  it('should call onFetchNext page when click on load more', () => {
    const onFetchNextPage = vi.fn();
    render(
      <Datagrid
        columns={columns}
        data={data}
        hasNextPage={true}
        onFetchNextPage={onFetchNextPage}
        onFetchAllPages={vi.fn()}
      />,
    );
    expect(screen.getByText('Load more')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Load more'));
    expect(onFetchNextPage).toHaveBeenCalled();
  });

  it('should call onFetchAllPages when click on load all', () => {
    const onFetchAllPages = vi.fn();
    render(
      <Datagrid
        columns={columns}
        data={data}
        hasNextPage={true}
        onFetchNextPage={vi.fn()}
        onFetchAllPages={onFetchAllPages}
      />,
    );
    expect(screen.getByText('Load all')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Load all'));
    expect(onFetchAllPages).toHaveBeenCalled();
  });

  it('should button load all be disabled when isLoading is true', () => {
    const onFetchAllPages = vi.fn();
    render(
      <Datagrid
        columns={columns}
        data={data}
        hasNextPage={true}
        onFetchNextPage={vi.fn()}
        onFetchAllPages={onFetchAllPages}
        isLoading={true}
      />,
    );
    expect(screen.getByText('Load all')).toBeInTheDocument();
    expect(screen.getByText('Load all')).toBeDisabled();
  });
});
