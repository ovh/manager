import { vitest, describe, it } from 'vitest';
import {
  texts,
  href,
  description,
  img,
  renderLinkCard,
  badges,
} from './LinkCard.spec.utils';

vitest.mock('../../../hooks/iam', () => ({
  useAuthorizationIam: vi.fn(() => ({ isAuthorized: true })),
}));

describe('LinkCard Component Snapshot Tests', () => {
  it('renders the component with texts', () => {
    const { container } = renderLinkCard({
      texts: {
        ...texts,
        description,
      },
      href,
    });
    expect(container).toMatchSnapshot();
  });

  it('renders the component with image', () => {
    const { container } = renderLinkCard({
      texts: {
        ...texts,
        description,
      },
      href,
      img,
    });
    expect(container).toMatchSnapshot();
  });

  it('renders the component with badges', () => {
    const { container } = renderLinkCard({
      texts: {
        ...texts,
        description,
      },
      href,
      badges,
    });
    expect(container).toMatchSnapshot();
  });

  it('renders the complete component', () => {
    const { container } = renderLinkCard({
      texts: {
        ...texts,
        description,
      },
      href,
      badges,
      img,
    });
    expect(container).toMatchSnapshot();
  });
});
