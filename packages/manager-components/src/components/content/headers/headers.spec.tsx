import { waitFor, screen } from '@testing-library/react';
import { render } from '../../../utils/test.provider';
import {
  header,
  subHeader,
  headerWithGuides,
  headerWithActions,
} from './headers.stories';
import '@testing-library/jest-dom';

describe('Headers component', () => {
  it('renders header correctly', async () => {
    render(header());
    waitFor(() => {
      expect(screen.getByText('Example for header')).toBeInTheDocument();
      expect(screen.getByText('description for header')).toBeInTheDocument();
    });
  });

  it('renders subHeader correctly', async () => {
    render(subHeader());
    waitFor(() => {
      expect(screen.getByText('Example for subHeader')).toBeInTheDocument();
      expect(screen.getByText('description for subheader')).toBeInTheDocument();
    });
  });

  it('renders header with guides correctly', async () => {
    render(headerWithGuides());
    waitFor(() => {
      expect(
        screen.getByText('Example for header with guides'),
      ).toBeInTheDocument();
      expect(screen.getByText('description for subheader')).toBeInTheDocument();
    });
  });

  it('renders header with actions correctly', async () => {
    render(headerWithActions());
    waitFor(() => {
      expect(
        screen.getByText('Example for header with actions'),
      ).toBeInTheDocument();
      expect(screen.getByText('description for header')).toBeInTheDocument();
    });
  });
});
