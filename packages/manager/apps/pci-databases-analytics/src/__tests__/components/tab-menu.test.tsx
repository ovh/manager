import { render, screen } from '@testing-library/react';
import TabsMenu from './../../components/tabs-menu';
import '@testing-library/jest-dom/vitest';
import * as React from 'react';
import { vi } from 'vitest';

describe('TabsMenu', () => {
  const tabs = [
    { href: '/tab1', label: 'Tab 1' },
    { href: '/tab2', label: 'Tab 2', count: 5 },
    { href: '/tab3', label: 'Tab 3', end: true },
  ];

  it('renders tabs', () => {
    render(<TabsMenu tabs={tabs} />);
    screen.debug();
    const tabElements = screen.getAllByRole('link');
    expect(tabElements).toHaveLength(tabs.length);
    tabs.forEach((tab, index) => {
      expect(tabElements[index]).toHaveTextContent(tab.label);
    });
  });

  it('renders tab counts', () => {
    render(<TabsMenu tabs={tabs} />);
    const countElements = screen.getAllByTestId('badge');
    expect(countElements).toHaveLength(1);
    expect(countElements[0]).toHaveTextContent('5');
  });

  it('renders end tab with correct styles', () => {
    render(<TabsMenu tabs={tabs} />);
    const endTab = screen.getByText('Tab 3');
    expect(endTab).toHaveClass('w-full');
  });

  it('renders active tab with appropriate styles', () => {
    render(<TabsMenu tabs={tabs} />);
    const activeTab = screen.getByText('Tab 2');
    expect(activeTab).toHaveClass('active-tab-class');
  });
});