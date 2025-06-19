import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Location } from 'react-router-dom';
import * as ReactRouterDomApi from 'react-router-dom';
import * as useReassuranceWordingApi from '@/hooks/reassuranceWording/useReassuranceWording';
import ReassuranceWording from '@/components/reassuranceWording/ReassuranceWording.component';
import userContext, { UserContext } from '@/context/user/user.context';

const renderComponent = (user: Partial<UserContext>) =>
  render(
    <userContext.Provider value={user as UserContext}>
      <ReassuranceWording />
    </userContext.Provider>,
  );
const mockLocation = (pathname: string) =>
  vi
    .spyOn(ReactRouterDomApi, 'useLocation')
    .mockReturnValue({ pathname } as Location);

describe('ReassuranceWording', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('Unit tests', () => {
    it('should display text and description', async () => {
      const title = 'title';
      const description = 'description';
      vi.spyOn(
        useReassuranceWordingApi,
        'useReassuranceWording',
      ).mockReturnValue({ title, description });
      render(<ReassuranceWording />);

      const titleElement = screen.getByTestId('reassurance_wording_title');
      const descriptionElement = screen.getByTestId(
        'reassurance_wording_description',
      );
      expect(titleElement).toBeVisible();
      expect(titleElement).toHaveTextContent(title);
      expect(descriptionElement).toBeVisible();
      expect(descriptionElement).toHaveTextContent(description);
    });
  });

  describe('Integration tests', () => {
    it('should display a generic message when on root route without customer data', async () => {
      mockLocation('/');
      renderComponent({});

      const titleElement = screen.getByTestId('reassurance_wording_title');
      const descriptionElement = screen.getByTestId(
        'reassurance_wording_description',
      );
      expect(titleElement).toHaveTextContent('generic_title');
      expect(descriptionElement).toHaveTextContent('generic_description');
    });

    it('should display a generic message when on preferences route without customer data', async () => {
      mockLocation('/preferences');
      renderComponent({});

      const titleElement = screen.getByTestId('reassurance_wording_title');
      const descriptionElement = screen.getByTestId(
        'reassurance_wording_description',
      );
      expect(titleElement).toHaveTextContent('generic_title');
      expect(descriptionElement).toHaveTextContent('generic_description');
    });

    it('should display a generic message when on type route without customer legal form', async () => {
      mockLocation('/type');
      renderComponent({});

      const titleElement = screen.getByTestId('reassurance_wording_title');
      const descriptionElement = screen.getByTestId(
        'reassurance_wording_description',
      );
      expect(titleElement).toHaveTextContent('generic_title');
      expect(descriptionElement).toHaveTextContent('generic_description');
    });

    it('should display a generic message when on type route for customer with corporation legal form', async () => {
      mockLocation('/type');
      renderComponent({ legalForm: 'corporation' });

      const titleElement = screen.getByTestId('reassurance_wording_title');
      const descriptionElement = screen.getByTestId(
        'reassurance_wording_description',
      );
      expect(titleElement).toHaveTextContent('generic_title');
      expect(descriptionElement).toHaveTextContent('generic_description');
    });

    it('should display a generic when on type route for customer with individual legal form', async () => {
      mockLocation('/type');
      renderComponent({ legalForm: 'individual' });

      const titleElement = screen.getByTestId('reassurance_wording_title');
      const descriptionElement = screen.getByTestId(
        'reassurance_wording_description',
      );
      expect(titleElement).toHaveTextContent('generic_title');
      expect(descriptionElement).toHaveTextContent('generic_description');
    });

    it('should display an info message when on details route for customer with corporation legal form', async () => {
      mockLocation('/details');
      renderComponent({ legalForm: 'corporation' });

      const titleElement = screen.getByTestId('reassurance_wording_title');
      const descriptionElement = screen.getByTestId(
        'reassurance_wording_description',
      );
      expect(titleElement).toHaveTextContent('details_title_corporation');
      expect(descriptionElement).toHaveTextContent(
        'details_description_corporation',
      );
    });

    it('should display an info message when on details route for customer with individual legal form', async () => {
      mockLocation('/details');
      renderComponent({ legalForm: 'individual' });

      const titleElement = screen.getByTestId('reassurance_wording_title');
      const descriptionElement = screen.getByTestId(
        'reassurance_wording_description',
      );
      expect(titleElement).toHaveTextContent('details_title_individual');
      expect(descriptionElement).toHaveTextContent(
        'details_description_individual',
      );
    });

    it('should display an info message when on details route for customer with association legal form', async () => {
      mockLocation('/details');
      renderComponent({ legalForm: 'association' });

      const titleElement = screen.getByTestId('reassurance_wording_title');
      const descriptionElement = screen.getByTestId(
        'reassurance_wording_description',
      );
      expect(titleElement).toHaveTextContent('details_title_association');
      expect(descriptionElement).toHaveTextContent(
        'details_description_association',
      );
    });

    it('should display an info message when on details route for customer with administration legal form', async () => {
      mockLocation('/details');
      renderComponent({ legalForm: 'administration' });

      const titleElement = screen.getByTestId('reassurance_wording_title');
      const descriptionElement = screen.getByTestId(
        'reassurance_wording_description',
      );
      expect(titleElement).toHaveTextContent('details_title_association');
      expect(descriptionElement).toHaveTextContent(
        'details_description_association',
      );
    });
  });
});
