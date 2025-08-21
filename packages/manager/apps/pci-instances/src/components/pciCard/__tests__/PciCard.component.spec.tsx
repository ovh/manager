import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PciCard } from '../PciCard.component';

describe('PciCard', () => {
  it('should render any child content', () => {
    render(
      <PciCard>
        <span>child</span>
      </PciCard>,
    );

    expect(screen.getByText('child')).toBeInTheDocument();
  });
});

describe('PciCard modes', () => {
  it('should render any content when disabled mode is on', () => {
    render(
      <PciCard disabled>
        <span>Disabled child</span>
      </PciCard>,
    );

    expect(screen.getByText('Disabled child')).toBeInTheDocument();
  });

  it('should render when selectable mode is on', () => {
    render(
      <PciCard selectable>
        <span>Selectable child</span>
      </PciCard>,
    );

    expect(screen.getByText('Selectable child')).toBeInTheDocument();
  });

  it('should render when selectable and disabled are on', () => {
    render(
      <PciCard disabled selectable>
        <span>Disabled and selectable child</span>
      </PciCard>,
    );

    expect(screen.getByText('Disabled and selectable child')).toBeInTheDocument();
  });

  it('should trigger onClick when disabled mode is off', () => {
    const handleClick = vi.fn();
    render(
      <PciCard selectable onClick={handleClick} data-testid="card">
        <span>Clickable content</span>
      </PciCard>,
    );

    fireEvent.click(screen.getByTestId('card'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should never trigger onClick when disabled mode is on', () => {
    const handleClick = vi.fn();
    render(
      <PciCard disabled onClick={handleClick} data-testid="card">
        <span>Disabled so not clickable child</span>
      </PciCard>,
    );

    fireEvent.click(screen.getByTestId('card'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});

describe('PciCard slots', () => {
  it('should display Header slot content', () => {
    render(
      <PciCard data-testid="card">
        <PciCard.Header>
          <span>Header content</span>
        </PciCard.Header>
      </PciCard>,
    );

    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('should display Content slot content', () => {
    render(
      <PciCard data-testid="card">
        <PciCard.Content>
          <span>Content body</span>
        </PciCard.Content>
      </PciCard>,
    );

    expect(screen.getByText('Content body')).toBeInTheDocument();
  });

  it('should display Footer slot content', () => {
    render(
      <PciCard data-testid="card">
        <PciCard.Footer>
          <span>Footer content</span>
        </PciCard.Footer>
      </PciCard>,
    );

    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });
});
