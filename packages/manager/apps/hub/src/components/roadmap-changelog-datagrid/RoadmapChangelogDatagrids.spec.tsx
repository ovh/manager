import { vi, describe, it, expect } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as reactShellClientModule from '@ovh-ux/manager-react-shell-client';
import RoadmapChangelogDatagrids from './RoadmapChangelogDatagrids';
import { renderWithShellContext } from '@/__mocks__/ShellContextWrapper';

const trackClickMock = vi.fn();

vi.mock('@/data/hooks/roadmapChangelog/useRoadmapChangelog', () => ({
  useRoadmapChangelog: () => ({
    data: {
      cloud: [
        {
          title: 'Cloud title',
          url: 'Cloud url',
          changelog: 'Cloud changelog',
          product: 'Cloud product',
          releaseDate: '2025-01-01',
          status: 'Done',
        },
      ],
      hostingCollab: [
        {
          title: 'Hosting title',
          url: 'Hosting url',
          changelog: 'Hosting Changelog',
          product: 'Hosting product',
          releaseDate: '2025-01-15',
          status: 'Planned',
        },
      ],
    },
    isLoading: false,
  }),
}));

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof reactShellClientModule = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({ trackClick: trackClickMock }),
    PageLocation: {
      page: 'page',
      datagrid: 'datagrid',
      funnel: 'funnel',
      popup: 'popup',
      tile: 'tile',
    },
    ButtonType: {
      externalLinl: 'external-link',
      link: 'link',
      button: 'button',
    },
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

const renderComponent = () =>
  renderWithShellContext(<RoadmapChangelogDatagrids />);

describe('Roadmap Changelog Datagrids', () => {
  it('should render', () => {
    renderComponent();

    expect(screen.getByText('datagrid_tab_title_hosting')).toBeInTheDocument();
    expect(screen.getByText('datagrid_tab_title_cloud')).toBeInTheDocument();
    expect(screen.getByText('Hosting Changelog')).toBeInTheDocument();
  });

  it('should change panel when clicked', () => {
    renderComponent();

    const cloudTab = screen.getByText('datagrid_tab_title_cloud');
    fireEvent.click(cloudTab);

    expect(screen.getByText('Cloud changelog')).toBeInTheDocument();
  });

  it('date should be in the correct language format', () => {
    renderComponent();

    expect(screen.getByText('Jan 15, 2025')).toBeInTheDocument();
  });
});
