/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { setupAllMocks, mockCommunityLinks } from '@/data/__mocks__';
import CommunitySection from './CommunitySection.component';

setupAllMocks();

describe('CommunitySection', () => {
  it('returns null for US region', async () => {
    const { container } = render(
      <CommunitySection
        communityLinks={mockCommunityLinks}
        isUSRegion={true}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders community links', async () => {
    render(<CommunitySection communityLinks={mockCommunityLinks} />);
    const links = screen.getAllByTestId('ods-link');
    expect(links.length).toBe(mockCommunityLinks.length);
  });
});
