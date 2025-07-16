import { vi, describe, it, expect } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RoadmapChangelogDatagrids from './RoadmapChangelogDatagrids';

const trackClickMock = vi.fn();

vi.mock('@/data/hooks/roadmapChangelog/useRoadmapChangelog', () => ({
  useRoadmapChangelog: () => ({
    data: {
      cloud: [
        {
          title: 'Cloud title',
          description: 'Cloud description',
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
          product: 'Hosting product',
          releaseDate: '2025-01-15',
          status: 'Planned',
        },
      ],
    },
    isLoading: false,
  }),
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
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
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

describe('Roadmap Changelog Datagrids', () => {
  it('should render', () => {
    render(<RoadmapChangelogDatagrids />);

    expect(screen.getByText('datagrid_tab_title_hosting')).toBeInTheDocument();
    expect(screen.getByText('datagrid_tab_title_cloud')).toBeInTheDocument();
    expect(screen.getByText('Hosting title')).toBeInTheDocument();
  });

  it('should change panel when clicked', () => {
    render(<RoadmapChangelogDatagrids />);

    const cloudTab = screen.getByText('datagrid_tab_title_cloud');
    fireEvent.click(cloudTab);

    expect(screen.getByText('Cloud title')).toBeInTheDocument();
  });

  it('should display chevron if more than 80 characters', () => {
    render(<RoadmapChangelogDatagrids />);

    const chevronIcon = screen.getByTestId('chevron-icon');
    expect(chevronIcon).toBeInTheDocument();
  });

  it('chevron should be clickable', () => {
    render(<RoadmapChangelogDatagrids />);

    const chevronIcon = screen.getByTestId('chevron-icon');
    const chevronButton = screen.getByTestId('chevron-button');

    expect(chevronIcon).toHaveAttribute('name', 'chevron-right');
    fireEvent.click(chevronButton);
    expect(chevronIcon).toHaveAttribute('name', 'chevron-down');
  });

  it('markdown should be rendered when expended', () => {
    render(<RoadmapChangelogDatagrids />);

    const hostingTab = screen.getByText('datagrid_tab_title_hosting');
    fireEvent.click(hostingTab);

    const chevronButton = screen.getByTestId('chevron-button');
    fireEvent.click(chevronButton);

    expect(screen.getByText('bold text')).toBeInTheDocument();
    expect(screen.getByText('link')).toBeInTheDocument();
  });

  it('date should be in the correct language format', () => {
    render(<RoadmapChangelogDatagrids />);

    expect(screen.getByText('Jan 15, 2025')).toBeInTheDocument();
  });
});
