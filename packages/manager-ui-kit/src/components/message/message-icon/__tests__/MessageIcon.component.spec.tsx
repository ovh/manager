import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MessageIcon } from '@/components';

describe('MessageIcon rendering', () => {
  const iconNames = ['email', 'list', 'xmark', 'filter', 'key', 'arrow-left'] as const;

  it.each(iconNames)('renders safely for icon "%s"', (iconName) => {
    const { container } = render(<MessageIcon name={iconName} />);

    expect(container.firstChild).toBeTruthy();

    const icon = container.querySelector('[data-ods="message-icon"]');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('role', 'presentation');
  });
});
