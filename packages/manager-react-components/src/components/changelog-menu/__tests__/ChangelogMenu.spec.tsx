import { vitest } from 'vitest';
import type { MockInstance } from 'vitest';
import { act, screen, fireEvent } from '@testing-library/react';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ChangelogMenu, CHANGELOG_PREFIXES } from '../ChangelogMenu.component';
import { render } from '../../../utils/test.provider';
import TradFr from '../translations/Messages_fr_FR.json';

vitest.mock('@ovh-ux/manager-react-shell-client', () => ({
  useOvhTracking: vitest.fn(),
}));

const Links = {
  roadmap:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal',
  changelog:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal',
  'feature-request':
    'https://github.com/orgs/ovh/projects/16/views/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal',
};

const chapters = ['baremetal', 'server', 'dedicated'];

// Define GO_TO function locally since it's not exported from the component
const GO_TO = (link: string) => `go-to-${link}`;

const defaultProps = {
  links: Links,
  chapters,
};

const setupSpecTest = (customProps = {}) =>
  render(<ChangelogMenu {...defaultProps} {...customProps} />);

const mockedTracking = useOvhTracking as unknown as MockInstance;

describe('ChangelogMenu', () => {
  beforeEach(() => {
    vitest.clearAllMocks();
    mockedTracking.mockReturnValue({
      trackClick: vitest.fn(),
    });
  });

  describe('Rendering', () => {
    it('renders the changelog menu button correctly', () => {
      setupSpecTest();

      const changelogActionButton = screen.getByText(
        TradFr.mrc_changelog_header,
      );
      expect(changelogActionButton).toBeInTheDocument();

      const changelogButton = screen.getByText(TradFr.mrc_changelog_changelog);
      expect(changelogButton).toBeInTheDocument();

      const roadmapButton = screen.getByText(TradFr.mrc_changelog_roadmap);
      expect(roadmapButton).toBeInTheDocument();

      const featureRequest = screen.getByText(
        TradFr['mrc_changelog_feature-request'],
      );
      expect(featureRequest).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('tracks click when changelog link is clicked', async () => {
      const mockTrackClick = vitest.fn();
      mockedTracking.mockReturnValue({
        trackClick: mockTrackClick,
      });

      setupSpecTest();

      const changelogButton = screen.getByText(TradFr.mrc_changelog_changelog);

      await act(async () => {
        fireEvent.click(changelogButton);
      });

      expect(mockTrackClick).toHaveBeenCalledWith({
        actionType: 'navigation',
        actions: [...chapters, ...CHANGELOG_PREFIXES, GO_TO('changelog')],
      });
    });

    it('tracks click when roadmap link is clicked', async () => {
      const mockTrackClick = vitest.fn();
      mockedTracking.mockReturnValue({
        trackClick: mockTrackClick,
      });

      setupSpecTest();

      const roadmapButton = screen.getByText(TradFr.mrc_changelog_roadmap);

      await act(async () => {
        fireEvent.click(roadmapButton);
      });

      expect(mockTrackClick).toHaveBeenCalledWith({
        actionType: 'navigation',
        actions: [...chapters, ...CHANGELOG_PREFIXES, GO_TO('roadmap')],
      });
    });

    it('tracks click when feature request link is clicked', async () => {
      const mockTrackClick = vitest.fn();
      mockedTracking.mockReturnValue({
        trackClick: mockTrackClick,
      });

      setupSpecTest();

      const featureRequestButton = screen.getByText(
        TradFr['mrc_changelog_feature-request'],
      );

      await act(async () => {
        fireEvent.click(featureRequestButton);
      });

      expect(mockTrackClick).toHaveBeenCalledWith({
        actionType: 'navigation',
        actions: [...chapters, ...CHANGELOG_PREFIXES, GO_TO('feature-request')],
      });
    });

    it('uses custom prefixes when provided', async () => {
      const customPrefixes = ['custom-prefix-1', 'custom-prefix-2'];
      const mockTrackClick = vitest.fn();
      mockedTracking.mockReturnValue({
        trackClick: mockTrackClick,
      });

      setupSpecTest({ prefixes: customPrefixes });

      const changelogButton = screen.getByText(TradFr.mrc_changelog_changelog);

      await act(async () => {
        fireEvent.click(changelogButton);
      });

      expect(mockTrackClick).toHaveBeenCalledWith({
        actionType: 'navigation',
        actions: [...chapters, ...customPrefixes, GO_TO('changelog')],
      });
    });
  });

  describe('Accessibility', () => {
    it('has external links with correct href attributes', () => {
      setupSpecTest();

      const changelogLink = screen
        .getByText(TradFr.mrc_changelog_changelog)
        .closest('a');
      const roadmapLink = screen
        .getByText(TradFr.mrc_changelog_roadmap)
        .closest('a');
      const featureRequestLink = screen
        .getByText(TradFr['mrc_changelog_feature-request'])
        .closest('a');

      expect(changelogLink).toHaveAttribute('href', Links.changelog);
      expect(roadmapLink).toHaveAttribute('href', Links.roadmap);
      expect(featureRequestLink).toHaveAttribute(
        'href',
        Links['feature-request'],
      );
    });
  });
});
