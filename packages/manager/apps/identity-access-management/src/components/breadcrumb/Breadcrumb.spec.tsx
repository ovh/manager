import { describe, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import * as ReactRouterDom from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { BreadcrumbProps, Breadcrumb } from './Breadcrumb.component';
import appConfig, { SubApp } from '@/identity-access-management.config';
import { getOdsBreadcrumbItemByLabel } from '@/test-utils/uiTestHelpers';

const useLocationMock = vi.hoisted(() => vi.fn());
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useLocation: useLocationMock,
}));

const renderComponent = async ({
  hideRootLabel,
  appName = appConfig.appName,
  rootLabel = appConfig.rootLabel,
}: Partial<BreadcrumbProps>) => {
  return render(
    <Breadcrumb
      rootLabel={rootLabel}
      appName={appName}
      hideRootLabel={hideRootLabel}
    />,
  );
};

describe('breadcrumb component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    mockNavigate.mockReset();
    vi.spyOn(ReactRouterDom, 'useNavigate').mockImplementation(
      () => mockNavigate,
    );
  });

  it('should render value 3 breadcrumb items', async () => {
    vi.spyOn(ReactRouterDom, 'useLocation').mockImplementation(() => ({
      key: 'test',
      hash: 'test',
      state: {
        tags: ['environment:production', 'test:test1'],
      },
      pathname: '/tag-manager/test:test/assign-tags',
      search: '',
    }));

    const { container } = await renderComponent({
      hideRootLabel: false,
    });

    const items = container.querySelectorAll('ods-breadcrumb-item');
    expect(items.length).toBe(4);

    const breadCrumbButton = await getOdsBreadcrumbItemByLabel({
      container,
      label: 'test:test',
    });

    act(() => fireEvent.click(breadCrumbButton));

    expect(mockNavigate).toHaveBeenCalledWith('/tag-manager/test:test');
  });

  it('should hide root label', async () => {
    vi.spyOn(ReactRouterDom, 'useLocation').mockImplementation(() => ({
      key: 'test',
      hash: 'test',
      state: {
        tags: ['environment:production', 'test:test1'],
      },
      pathname: '/tag-manager/test:test/assign-tags',
      search: '',
    }));

    const { container } = await renderComponent({
      hideRootLabel: true,
    });
    const items = container.querySelectorAll('ods-breadcrumb-item');
    expect(items.length).toBe(3);
  });
});
