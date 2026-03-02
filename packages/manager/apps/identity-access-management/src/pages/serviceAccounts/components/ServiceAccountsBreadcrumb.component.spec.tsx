import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { createWrapper } from '@/test-utils/wrapperRender';

import { ServiceAccountsBreadcrumb } from './ServiceAccountsBreadcrumb.component';

const wrapper = createWrapper();

describe('ServiceAccountsBreadcrumb', () => {
  it('should render the breadcrumb with the correct items', () => {
    const { container } = render(<ServiceAccountsBreadcrumb />, { wrapper });
    const items = container.querySelectorAll('ods-breadcrumb-item');
    expect(items).toHaveLength(3);
  });
});
