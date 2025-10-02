import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../../../utils/test.provider';
import { Datagrid } from '../../Datagrid.component';
import { useAuthorizationIam } from '../../../../hooks/iam';
import { IamAuthorizationResponse } from '../../../../hooks/iam/iam.interface';
import {
  mockIamResponse,
  mockBasicColumns,
  mockData,
  mockOnFetchNextPage,
  mockOnFetchAllPages,
} from '../../__tests__/mocks';

vitest.mock('../../../../hooks/iam', () => ({
  useAuthorizationIam: vitest.fn().mockReturnValue(mockIamResponse),
}));

const mockedHook =
  useAuthorizationIam as unknown as jest.Mock<IamAuthorizationResponse>;

describe('FooterActions', () => {
  beforeEach(() => {
    mockedHook.mockReturnValue(mockIamResponse);
  });

  it('should render the footer actions', () => {
    render(
      <Datagrid
        columns={mockBasicColumns}
        data={mockData}
        hasNextPage={true}
        onFetchNextPage={mockOnFetchNextPage}
        onFetchAllPages={mockOnFetchAllPages}
        isLoading={false}
      />,
    );
    expect(screen.getByText('Load more')).toBeInTheDocument();
    expect(screen.getByText('Load all')).toBeInTheDocument();
  });

  it('should render only load more  actions', () => {
    render(
      <Datagrid
        columns={mockBasicColumns}
        data={mockData}
        hasNextPage={true}
        onFetchNextPage={mockOnFetchNextPage}
      />,
    );
    expect(screen.getByText('Load more')).toBeInTheDocument();
    expect(screen.queryByText('Load all')).not.toBeInTheDocument();
  });

  it('should not render load more action when hasNextPage is false', () => {
    render(
      <Datagrid
        columns={mockBasicColumns}
        data={mockData}
        hasNextPage={false}
        onFetchNextPage={mockOnFetchNextPage}
      />,
    );
    expect(screen.queryByText('Load more')).not.toBeInTheDocument();
  });

  it('should call onFetchNext page when click on load more', () => {
    render(
      <Datagrid
        columns={mockBasicColumns}
        data={mockData}
        hasNextPage={true}
        onFetchNextPage={mockOnFetchNextPage}
        onFetchAllPages={mockOnFetchAllPages}
      />,
    );
    expect(screen.getByText('Load more')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Load more'));
    expect(mockOnFetchNextPage).toHaveBeenCalled();
  });

  it('should call onFetchAllPages when click on load all', () => {
    render(
      <Datagrid
        columns={mockBasicColumns}
        data={mockData}
        hasNextPage={true}
        onFetchNextPage={mockOnFetchNextPage}
        onFetchAllPages={mockOnFetchAllPages}
      />,
    );
    expect(screen.getByText('Load all')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Load all'));
    expect(mockOnFetchAllPages).toHaveBeenCalled();
  });

  it('should button load all be disabled when isLoading is true', () => {
    render(
      <Datagrid
        columns={mockBasicColumns}
        data={mockData}
        hasNextPage={true}
        onFetchNextPage={mockOnFetchNextPage}
        onFetchAllPages={mockOnFetchAllPages}
        isLoading={true}
      />,
    );
    expect(screen.getByText('Load all')).toBeInTheDocument();
    expect(screen.getByText('Load all')).toBeDisabled();
  });
});
