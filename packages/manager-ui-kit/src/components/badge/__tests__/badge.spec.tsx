import { describe, it, expect } from 'vitest';
import { waitFor, screen } from '@testing-library/react';
import { BADGE_COLOR, BADGE_SIZE } from '@ovhcloud/ods-react';
import { render } from '@/setupTest';
import { Badge } from '../badge.component';

describe('Badge component', () => {
  it('should render badge with correct props', async () => {
    render(
      <Badge
        color={BADGE_COLOR.information}
        size={BADGE_SIZE.md}
        data-testid="test"
      >
        Active
      </Badge>,
    );
    await waitFor(() => {
      const component = screen.getByTestId('test');
      expect(component.hasAttribute(BADGE_COLOR.information));
      expect(component.hasAttribute('active'));
    });
  });
  it('should render OdsSkeleton when isLoading is true', async () => {
    render(<Badge isLoading data-testid="skeleton" />);
    await waitFor(() => {
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toBeInTheDocument();
    });
  });
});
