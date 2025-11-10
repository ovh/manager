import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ResourceStatus } from '@/types';

import StatusChip from './StatusChip';

describe('StatusChip', () => {
  it('should render a spinner when label is empty', () => {
    const { container } = render(<StatusChip label="" />);

    const spinner = container.querySelector('[data-ods="spinner"]');
    expect(spinner).toBeInTheDocument();
  });

  it('should return null for an invalid status', () => {
    const { container } = render(<StatusChip label="INVALID_STATUS" />);

    expect(container.firstChild).toBeNull();
  });

  it.each([
    [ResourceStatus.READY, 'success', 'READY'],
    [ResourceStatus.DISABLED, 'neutral', 'DISABLED'],
    [ResourceStatus.UPDATING, 'warning', 'UPDATING'],
    [ResourceStatus.ERROR, 'critical', 'ERROR'],
    [ResourceStatus.CREATING, 'information', 'CREATING'],
    [ResourceStatus.ENABLED, 'success', 'ENABLED'],
    [ResourceStatus.DELETING, 'critical', 'DELETING'],
  ])(
    'should render a badge with "%s" color for %s status',
    (status, expectedColor, expectedText) => {
      const { container } = render(<StatusChip label={status} />);

      const badge = container.querySelector('[data-ods="badge"]');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent(expectedText);
      expect(badge).toHaveClass(new RegExp(`badge--${expectedColor}`));
    },
  );

  it('should call translation function with the label', () => {
    const { container } = render(<StatusChip label={ResourceStatus.READY} />);

    const badge = container.querySelector('[data-ods="badge"]');
    expect(badge).toHaveTextContent('READY');
  });
});
