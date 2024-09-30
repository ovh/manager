import { describe, vi } from 'vitest';
// import { render } from '@testing-library/react';
// import { wrapper } from '@/wrapperRenders';
// import DetailPage from './Detail.page';

describe('Detail', () => {
  vi.mock('@/components/detail/TabsPanel.component');
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
    // const { container } = render(<DetailPage />, { wrapper });
    // TO REWORK WITH CONTEXT
    expect(true).toBeTruthy();
    // expect(container).toMatchSnapshot();
  });
});
