import { describe, expect } from 'vitest';

import { renderWithRouter } from '@/utils/Test.provider';

import { Breadcrumb } from '../Breadcrumb.component';

describe('Breadcrumb component', () => {
  it('should render', () => {
    const { container } = renderWithRouter(<Breadcrumb />);
    const cmp = container.querySelector('[data-ods="breadcrumb"]');
    expect(cmp).toBeInTheDocument();
  });
});
