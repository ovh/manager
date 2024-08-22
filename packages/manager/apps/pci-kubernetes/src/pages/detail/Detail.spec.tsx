import { describe, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { render } from '@testing-library/react';
import { wrapper } from '@/wrapperRenders';
import DetailPage from './Detail.page';

describe('Detail', () => {
  vi.mock('@/components/detail/TabsPanel.component');
  vi.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: (key: string) => key,
    }),
    initReactI18next: {
      type: '3rdParty',
      init: () => {},
    },
  }));
  vi.mock('@ovh-ux/manager-react-components', () => ({
    PciGuidesHeader: vi.fn().mockReturnValue(<div></div>),
    Headers: vi.fn().mockReturnValue(<div></div>),
    useProjectUrl: vi.fn().mockReturnValue({}),
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
    const queryClient = new QueryClient();
    const { container } = render(
      <ShellContext.Provider value={undefined}>
        <QueryClientProvider client={queryClient}>
          <DetailPage />
        </QueryClientProvider>
        ,
      </ShellContext.Provider>,
      { wrapper },
    );
    expect(container).toMatchSnapshot();
  });
});
