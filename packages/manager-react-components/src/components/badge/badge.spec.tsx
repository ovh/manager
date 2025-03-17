import { describe, it, expect } from 'vitest';
import { waitFor, screen } from '@testing-library/react';
import {
  ODS_BADGE_COLOR,
  ODS_BADGE_SIZE,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import { render } from '../../utils/test.provider';
import { Badge } from './badge.component';

describe('Badge component', () => {
  it('should render badge with correct props', async () => {
    render(
      <Badge
        label="active"
        color={ODS_BADGE_COLOR.information}
        size={ODS_BADGE_SIZE.md}
        icon={ODS_ICON_NAME.circleInfo}
        data-testid="test"
      />,
    );
    await waitFor(() => {
      const component = screen.getByTestId('test');
      expect(component.hasAttribute(ODS_BADGE_COLOR.information));
      expect(component.hasAttribute('active'));
    });
  });
  it('should render OdsSkeleton when isLoading is true', async () => {
    render(<Badge isLoading label="" data-testid="skeleton" />);
    await waitFor(() => {
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toBeInTheDocument();
    });
  });
});
