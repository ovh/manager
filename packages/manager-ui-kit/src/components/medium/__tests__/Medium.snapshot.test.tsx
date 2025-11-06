import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Medium } from '@/components';

describe('Medium Snapshot tests', () => {
  it('renders the component with default props', () => {
    const { container } = render(
      <>
        <Medium
          alt="OVHcloud logo"
          src="https://images.crunchbase.com/image/upload/c_pad,w_256,f_auto,q_auto:eco,dpr_1/ayzwkdawmlyzvuummuf4"
        />
        <Medium
          alt="OVHcloud logo"
          height={20}
          src="https://images.crunchbase.com/image/upload/c_pad,w_256,f_auto,q_auto:eco,dpr_1/ayzwkdawmlyzvuummuf4"
        />
        <Medium
          alt="OVHcloud logo"
          src="https://images.crunchbase.com/image/upload/c_pad,w_256,f_auto,q_auto:eco,dpr_1/ayzwkdawmlyzvuummuf4"
          width={300}
        />
      </>,
    );
    expect(container).toMatchSnapshot();
  });
});
