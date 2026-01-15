import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { wrapper } from '@/utils/test.provider';

import TipsAndSupport from '../tipsAndSupport.component';

describe('TipsAndSupport component', () => {
  it('should render tips and support section correctly', () => {
    const { container } = render(<TipsAndSupport />, { wrapper });

    expect(container).toBeInTheDocument();
  });

  it('should render tips and support links', () => {
    const { container } = render(<TipsAndSupport />, { wrapper });

    const links = container.querySelectorAll('a');
    expect(links.length).toBeGreaterThan(0);
  });
});
