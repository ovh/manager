import { vitest } from 'vitest';

import { render } from '@/commons/tests-utils/Render.utils';
import { longUrls } from '@/commons/tests-utils/StaticData.constants';
import { ChangelogMenu } from '@/components/changelog-menu/ChangelogMenu.component';

import { Links, chapters } from './ChangelogMenu.utils';

vitest.mock('@ovh-ux/manager-react-shell-client', () => ({
  useOvhTracking: vitest.fn(() => ({
    trackClick: vitest.fn(),
  })),
}));

describe('ChangelogMenu Snapshot Tests', () => {
  it('should match snapshot with default props', () => {
    const { container } = render(<ChangelogMenu links={Links} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with chapters prop', () => {
    const { container } = render(<ChangelogMenu links={Links} chapters={chapters} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with custom prefixes', () => {
    const customPrefixes = ['custom-prefix-1', 'custom-prefix-2'];
    const { container } = render(
      <ChangelogMenu links={Links} chapters={chapters} prefixes={customPrefixes} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with different link URLs', () => {
    const customLinks = {
      changelog: 'https://custom-changelog.com',
      roadmap: 'https://custom-roadmap.com',
      'feature-request': 'https://custom-feature-request.com',
    };
    const { container } = render(<ChangelogMenu links={customLinks} chapters={chapters} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with single chapter', () => {
    const { container } = render(<ChangelogMenu links={Links} chapters={['single-chapter']} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with long URLs', () => {
    const { container } = render(<ChangelogMenu links={longUrls} chapters={chapters} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
