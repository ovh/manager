import { render } from '@testing-library/react';
import { describe, vi } from 'vitest';

import { wrapper } from '@/wrapperRenders';

import DetailPage from './Detail.page';

describe('Detail', () => {
  vi.mock('@/components/detail/TabsPanel.component');
  vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
    const actual: any = await importOriginal();
    return {
      ...actual,
      ChangelogButton: vi.fn().mockReturnValue(<div></div>),
      useProjectUrl: vi.fn(),
    };
  });

  // Dirty workaround to satisfy old version of i18n used in @ovh-ux/manager-react-components
  // https://github.com/ovh/manager/blob/391eaaa2d0423828a543a41918f5663ec7752c91/packages/manager-react-components/src/components/guides-header/pci/pci-guides-header.component.tsx#L19
  vi.mock('react-i18next', async (importOriginal) => {
    const actual: any = await importOriginal();
    const t = vi.fn((k) => k);
    return {
      ...actual,
      useTranslation: vi.fn((key: string) => (key === 'pci-guides-header' ? [t] : { t })),
    };
  });

  vi.mock('react-router-dom', (importOriginal) => ({
    ...importOriginal,
    useParams: () => ({}),
    useHref: () => '',
    useLocation: () => ({ pathname: '' }),
    useResolvedPath: () => '',
    Outlet: () => null,
    NavLink: () => null,
  }));
  it('should render correctly', () => {
    const { container } = render(<DetailPage />, { wrapper });

    expect(container).toMatchSnapshot();
  });
});
