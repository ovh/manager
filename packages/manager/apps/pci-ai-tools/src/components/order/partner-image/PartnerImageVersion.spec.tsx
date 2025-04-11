import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import ImageVersionSelector from './PartnerImageVersion.component';
import { mockedPartnerImagePerApp } from '@/__tests__/helpers/mocks/partner/partner';

describe('Parnter image version Selector component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const onChange = vi.fn();
  it('should display Version Selector', async () => {
    render(
      <ImageVersionSelector
        versions={mockedPartnerImagePerApp.versions}
        isImageSelected={true}
        onChange={onChange}
        selectedVersion=""
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('image-version-container')).toBeTruthy();
      expect(screen.getByTestId('popover-trigger-button')).toBeTruthy();
      expect(
        screen.getByTestId('popover-trigger-button').getAttribute('disabled'),
      ).not.toBeNull();
    });
  });
});
