import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/setupTest';
import { FooterActions } from './FooterActions.component';
import { mockOnFetchNextPage, mockOnFetchAllPages } from '../../../__mocks__';

describe('FooterActions', () => {
  it('should render the footer actions', () => {
    render(
      <FooterActions
        hasNextPage={true}
        onFetchNextPage={mockOnFetchNextPage}
        onFetchAllPages={mockOnFetchAllPages}
        isLoading={false}
      />,
    );
    expect(screen.getByText('Charger plus')).toBeInTheDocument();
    expect(screen.getByText('Charger tout')).toBeInTheDocument();
  });

  it('should render only Charger plus  actions', () => {
    render(
      <FooterActions
        hasNextPage={true}
        onFetchNextPage={mockOnFetchNextPage}
      />,
    );
    expect(screen.getByText('Charger plus')).toBeInTheDocument();
    expect(screen.queryByText('Charger tout')).not.toBeInTheDocument();
  });

  it('should not render Charger plus action when hasNextPage is false', () => {
    render(
      <FooterActions
        hasNextPage={false}
        onFetchNextPage={mockOnFetchNextPage}
      />,
    );
    expect(screen.queryByText('Charger plus')).not.toBeInTheDocument();
  });

  it('should call onFetchNext page when click on Charger plus', () => {
    render(
      <FooterActions
        hasNextPage={true}
        onFetchNextPage={mockOnFetchNextPage}
        onFetchAllPages={mockOnFetchAllPages}
      />,
    );
    expect(screen.getByText('Charger plus')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Charger plus'));
    expect(mockOnFetchNextPage).toHaveBeenCalled();
  });

  it('should call onFetchAllPages when click on Charger tout', () => {
    render(
      <FooterActions
        hasNextPage={true}
        onFetchNextPage={mockOnFetchNextPage}
        onFetchAllPages={mockOnFetchAllPages}
      />,
    );
    expect(screen.getByText('Charger tout')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Charger tout'));
    expect(mockOnFetchAllPages).toHaveBeenCalled();
  });

  it('should button Charger tout be disabled when isLoading is true', () => {
    render(
      <FooterActions
        hasNextPage={true}
        onFetchNextPage={mockOnFetchNextPage}
        onFetchAllPages={mockOnFetchAllPages}
        isLoading={true}
      />,
    );
    expect(screen.getByText('Charger tout')).toBeInTheDocument();
    expect(screen.getByText('Charger tout')).toBeDisabled();
  });
});
