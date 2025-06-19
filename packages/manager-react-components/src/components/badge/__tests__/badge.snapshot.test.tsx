import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BADGE_COLOR, BADGE_SIZE } from '@ovhcloud/ods-react';
import { Badge } from '../badge.component';

describe('Badge Snapshot Tests', () => {
  it('Displays Badge', () => {
    const { container } = render(
      <Badge color={BADGE_COLOR.information} size={BADGE_SIZE.sm}>
        Active
      </Badge>,
    );
    expect(container).toMatchSnapshot();
  });

  it('Displays Loader', () => {
    const { container } = render(
      <Badge isLoading color={BADGE_COLOR.information} size={BADGE_SIZE.sm}>
        Active
      </Badge>,
    );
    expect(container).toMatchSnapshot();
  });
});
