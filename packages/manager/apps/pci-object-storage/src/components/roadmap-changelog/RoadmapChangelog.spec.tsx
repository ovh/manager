import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import RoadmapChangelog from './RoadmapChangelog.component';

describe('Roadmap Changelog component', () => {
  it('renders Roadmap changelog button component', async () => {
    render(<RoadmapChangelog />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('roadmap-button')).toBeTruthy();
    });
  });
});
