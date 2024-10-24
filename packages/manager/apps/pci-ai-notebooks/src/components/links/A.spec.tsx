import { render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import A from '@/components/links/A.component';

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigation: () => ({
    getURL: vi.fn((app: string, path: string) => `#mockedurl-${app}${path}`),
  }),
}));

describe('A', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('renders anchor element correctly', () => {
    const { container } = render(<A href="#">Link</A>);
    const anchor = container.querySelector('a');
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveTextContent('Link');
    expect(anchor).toHaveAttribute('href', '#');
  });
  it('renders disabled anchor element correctly', () => {
    const { container } = render(
      <A href="#" disabled>
        Link
      </A>,
    );
    const anchor = container.querySelector('a');
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveTextContent('Link');
    expect(anchor).not.toHaveAttribute('href');
  });
});
