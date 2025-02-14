import { describe, it, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  createTicket,
  TCreateTicketParam,
  TCreateTicketResponse,
} from './ticket';

describe('createTicket', () => {
  it('creates a ticket successfully', async () => {
    // Arrange
    const newTicket: TCreateTicketParam = {
      issueTypeId: 1,
      subject: 'Test Subject',
      body: 'Test Body',
      serviceName: 'Test Service',
    };
    const mockResponse: TCreateTicketResponse = {
      ticketId: '12345',
    };
    vi.mocked(v6.post).mockResolvedValueOnce({ data: mockResponse });

    // Act
    const result = await createTicket(newTicket);

    // Assert
    expect(v6.post).toHaveBeenCalledWith('/support/tickets', newTicket);
    expect(result).toEqual(mockResponse);
  });

  it('handles errors when creating a ticket', async () => {
    // Arrange
    const newTicket: TCreateTicketParam = {
      issueTypeId: 1,
      subject: 'Test Subject',
      body: 'Test Body',
      serviceName: 'Test Service',
    };
    const errorMessage = 'Network Error';
    vi.mocked(v6.post).mockRejectedValueOnce(new Error(errorMessage));

    // Act & Assert
    await expect(createTicket(newTicket)).rejects.toThrow(errorMessage);
    expect(v6.post).toHaveBeenCalledWith('/support/tickets', newTicket);
  });
});
