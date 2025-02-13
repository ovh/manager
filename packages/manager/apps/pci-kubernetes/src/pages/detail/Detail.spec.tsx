import { describe, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ChangelogButton } from '@ovh-ux/manager-react-components';
import { wrapper } from '@/wrapperRenders';
import DetailPage from './Detail.page';

describe('Detail', () => {
  vi.mock('@/components/detail/TabsPanel.component');
  vi.mock('@ovh-ux/manager-react-components', () => ({
    ChangelogButton: vi.fn().mockReturnValue(<div>ChangelogButton</div>),
    Headers: vi.fn().mockReturnValue(<div>Headers</div>),
    PciGuidesHeader: vi.fn().mockReturnValue(<div>PcoGuidesHeader</div>),
    useProjectUrl: vi.fn(),
  }));
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
