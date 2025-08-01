import { vi, describe, it, expect } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import * as reactShellClientModule from '@ovh-ux/manager-react-shell-client';
import RoadmapChangelogDatagrids from './RoadmapChangelogDatagrids';

const trackClickMock = vi.fn();

const mocks: any = vi.hoisted(() => ({
  shellContext: {
    region: 'EU',
    environment: {
      getRegion: vi.fn(() => mocks.region),
    },
  },
}));

vi.mock('@/data/hooks/roadmapChangelog/useRoadmapChangelog', () => ({
  useRoadmapChangelog: () => ({
    data: {
      cloud: [
        {
          title: 'Cloud title',
          description: 'Cloud description',
          changelog: 'Cloud changelog',
          product: 'Cloud product',
          releaseDate: '2025-01-01',
          status: 'Done',
        },
      ],
      hostingCollab: [
        {
          title: 'Hosting title',
          description:
            'This is a very long description with **bold text** and ## heading and [link](https://example.com) to test the chevron functionality properly',
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
  render(
    <ShellContext.Provider
      value={(mocks.shellContext as unknown) as ShellContextType}
    >
      <RoadmapChangelogDatagrids />
    </ShellContext.Provider>,
  );

describe('Roadmap Changelog Datagrids', () => {
  it('should render', () => {
    renderComponent();

    expect(screen.getByText('datagrid_tab_title_hosting')).toBeInTheDocument();
    expect(screen.getByText('datagrid_tab_title_cloud')).toBeInTheDocument();
    expect(screen.getByText('Hosting title')).toBeInTheDocument();
  });

  it('should change panel when clicked', () => {
    renderComponent();

    const cloudTab = screen.getByText('datagrid_tab_title_cloud');
    fireEvent.click(cloudTab);

    expect(screen.getByText('Cloud title')).toBeInTheDocument();
  });

  it('should display chevron if description exist', () => {
    renderComponent();

    const chevronIcon = screen.getAllByTestId('chevron-icon');
    expect(chevronIcon?.length).toBe(2);
    expect(chevronIcon[0]).toBeInTheDocument();
  });

  it('chevron should be clickable', () => {
    renderComponent();

    const chevronIcon = screen.getAllByTestId('chevron-icon');
    const chevronButton = screen.getAllByTestId('chevron-button');

    expect(chevronIcon?.length).toBe(2);
    expect(chevronButton?.length).toBe(2);
    expect(chevronIcon[0]).toHaveAttribute('name', 'chevron-right');
    fireEvent.click(chevronButton[0]);
    expect(chevronIcon[0]).toHaveAttribute('name', 'chevron-down');
  });

  it('markdown should be rendered when expanded', () => {
    renderComponent();

    const hostingTab = screen.getByText('datagrid_tab_title_hosting');
    fireEvent.click(hostingTab);

    const chevronButton = screen.getAllByTestId('chevron-button');
    expect(chevronButton?.length).toBe(2);

    fireEvent.click(chevronButton[1]);

    expect(screen.getByText('bold text')).toBeInTheDocument();
    expect(screen.getByText('link')).toBeInTheDocument();
  });

  it('date should be in the correct language format', () => {
    renderComponent();

    expect(screen.getByText('Jan 15, 2025')).toBeInTheDocument();
  });
});
