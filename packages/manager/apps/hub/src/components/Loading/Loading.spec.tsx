import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Loading from './Loading';

describe('Loading Component', () => {
  it('should have a valid html', () => {
    const { container } = render(<Loading />);
    const html = container.innerHTML;

    void expect(html).toBeValidHtml();
  });
});
