import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Meter } from '@/components';

describe('Meter Snapshot tests', () => {
  it('renders the component with default props', () => {
    const { container } = render(
      <>
        <p>Value under low threshold:</p>
        <Meter low={40} value={35} />
        <p>Value between both thresholds:</p>
        <Meter high={80} low={40} value={60} />
        <p>Value above high threshold:</p>
        <Meter high={80} value={90} />
        <p>Low optimum and low value:</p>
        <Meter high={80} low={40} optimum={30} value={20} />
        <p>Low optimum and high value:</p>
        <Meter high={80} low={40} optimum={30} value={60} />
        <p>Low optimum and very high value:</p>
        <Meter high={80} low={40} optimum={30} value={90} />
      </>,
    );
    expect(container).toMatchSnapshot();
  });
});
