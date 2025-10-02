import { describe, it, expect, vi } from 'vitest';
import { render } from '../../../../../utils/test.provider';
import { TableFooter } from '../TableFooter.component';
import { useAuthorizationIam } from '../../../../../hooks/iam';
import { IamAuthorizationResponse } from '../../../../../hooks/iam/iam.interface';

vi.mock('../../../../../hooks/iam');

const mockedHook =
  useAuthorizationIam as unknown as jest.Mock<IamAuthorizationResponse>;

describe('TableFooter Snapshot Tests', () => {
  beforeEach(() => {
    mockedHook.mockReturnValue({
      isAuthorized: true,
      isLoading: false,
      isFetched: true,
    });
  });

  it('should match snapshot with basic props', () => {
    const { container } = render(
      <TableFooter
        hasNextPage={false}
        isLoading={false}
        itemsCount={10}
        totalCount={100}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with pagination enabled', () => {
    const { container } = render(
      <TableFooter
        hasNextPage={true}
        onFetchNextPage={vi.fn()}
        onFetchAllPages={vi.fn()}
        isLoading={false}
        itemsCount={10}
        totalCount={100}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with only load more button', () => {
    const { container } = render(
      <TableFooter
        hasNextPage={true}
        onFetchNextPage={vi.fn()}
        isLoading={false}
        itemsCount={10}
        totalCount={100}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with only load all button', () => {
    const { container } = render(
      <TableFooter
        hasNextPage={true}
        onFetchAllPages={vi.fn()}
        isLoading={false}
        itemsCount={10}
        totalCount={100}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with loading state', () => {
    const { container } = render(
      <TableFooter
        hasNextPage={true}
        onFetchNextPage={vi.fn()}
        onFetchAllPages={vi.fn()}
        isLoading={true}
        itemsCount={10}
        totalCount={100}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with only itemsCount', () => {
    const { container } = render(
      <TableFooter hasNextPage={false} isLoading={false} itemsCount={25} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with zero itemsCount', () => {
    const { container } = render(
      <TableFooter
        hasNextPage={false}
        isLoading={false}
        itemsCount={0}
        totalCount={100}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with zero totalCount', () => {
    const { container } = render(
      <TableFooter
        hasNextPage={false}
        isLoading={false}
        itemsCount={5}
        totalCount={0}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with large numbers', () => {
    const { container } = render(
      <TableFooter
        hasNextPage={true}
        onFetchNextPage={vi.fn()}
        onFetchAllPages={vi.fn()}
        isLoading={false}
        itemsCount={9999}
        totalCount={99999}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with undefined props', () => {
    const { container } = render(<TableFooter />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with no pagination and no totalCount', () => {
    const { container } = render(
      <TableFooter hasNextPage={false} isLoading={false} itemsCount={15} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with pagination but no handlers', () => {
    const { container } = render(
      <TableFooter
        hasNextPage={true}
        isLoading={false}
        itemsCount={20}
        totalCount={200}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with all props provided', () => {
    const { container } = render(
      <TableFooter
        hasNextPage={true}
        onFetchNextPage={vi.fn()}
        onFetchAllPages={vi.fn()}
        isLoading={false}
        itemsCount={50}
        totalCount={500}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
