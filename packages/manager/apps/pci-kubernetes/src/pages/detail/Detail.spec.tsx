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
