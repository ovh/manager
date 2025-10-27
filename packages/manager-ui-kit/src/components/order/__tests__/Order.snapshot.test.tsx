import React from 'react';

import type { MockInstance } from 'vitest';
import { vitest } from 'vitest';

import { render } from '@/commons/tests-utils/Render.utils';
import { Order } from '@/components';
import { useAuthorizationIam } from '@/hooks';

vitest.mock('@/hooks/iam/useOvhIam', () => ({
  useAuthorizationIam: vitest.fn().mockReturnValue({
    isAuthorized: true,
    isLoading: false,
    isFetched: true,
  }),
}));

const mockedHook = useAuthorizationIam as unknown as MockInstance;

describe('Order Snapshot Tests', () => {
  beforeEach(() => {
    mockedHook.mockReturnValue({
      isAuthorized: true,
      isLoading: false,
      isFetched: true,
    });
  });

  afterEach(() => {
    vitest.resetAllMocks();
  });

  it('should render basic Order component with children', () => {
    const { container } = render(
      <Order>
        <div>Test content</div>
      </Order>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render Order with Configuration component', () => {
    const { container } = render(
      <Order>
        <Order.Configuration isValid={true} onCancel={() => {}} onConfirm={() => {}}>
          <p>Configuration content</p>
        </Order.Configuration>
      </Order>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render Order with Summary component', () => {
    const { container } = render(
      <Order>
        <Order.Summary
          onFinish={() => {}}
          orderLink="https://example.com"
          productName="Test Product"
        />
      </Order>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render Order with both Configuration and Summary components', () => {
    const { container } = render(
      <Order>
        <Order.Configuration isValid={false} onCancel={() => {}} onConfirm={() => {}}>
          <p>Configuration steps</p>
        </Order.Configuration>
        <Order.Summary
          onFinish={() => {}}
          orderLink="https://example.com/order"
          productName="Cloud Service"
        />
      </Order>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render Order with Configuration in invalid state', () => {
    const { container } = render(
      <Order>
        <Order.Configuration isValid={false} onCancel={() => {}} onConfirm={() => {}}>
          <p>Invalid configuration</p>
        </Order.Configuration>
      </Order>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render Order with Summary without product name', () => {
    const { container } = render(
      <Order>
        <Order.Summary onFinish={() => {}} orderLink="https://example.com" />
      </Order>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render Order with complex nested content', () => {
    const { container } = render(
      <Order>
        <Order.Configuration isValid={true} onCancel={() => {}} onConfirm={() => {}}>
          <div className="complex-content">
            <h2>Order Steps</h2>
            <ul>
              <li>Step 1: Choose service</li>
              <li>Step 2: Configure options</li>
              <li>Step 3: Review and confirm</li>
            </ul>
          </div>
        </Order.Configuration>
        <Order.Summary
          onFinish={() => {}}
          orderLink="https://example.com/order"
          productName="Premium Cloud Service"
          onClickLink={() => {}}
        />
      </Order>,
    );

    expect(container).toMatchSnapshot();
  });
});
