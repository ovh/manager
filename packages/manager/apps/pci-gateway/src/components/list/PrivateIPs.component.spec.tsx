import 'element-internals-polyfill';
import { describe, expect } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import PrivateIPs from './PrivateIPs.component';

describe('PrivateIPs', () => {
  it('should display interfaces', async () => {
    const interfaces = [
      {
        id: 'a',
        ip: '0.0.0.1',
        subnetId: '0.0.0.0',
        networkId: '',
      },
      {
        id: 'b',
        ip: '0.0.0.2',
        subnetId: '0.0.0.0',
        networkId: '',
      },
      {
        id: 'c',
        ip: '0.0.0.3',
        subnetId: '0.0.0.0',
        networkId: '',
      },
    ];
    const { container } = render(<PrivateIPs interfaces={interfaces} />);
    const listItems = container.querySelectorAll('li');
    expect(listItems.length).toBe(interfaces.length);
    interfaces.forEach(({ ip }, index) => {
      expect(listItems[index].textContent).toBe(ip);
    });
  });
});
