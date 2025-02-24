import { describe, it, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getIssueTypes, TIssueType } from './issue';

describe('getIssueTypes', () => {
  it('fetches issue types successfully', async () => {
    // Arrange
    const mockData: TIssueType[] = [
      {
        fields: [
          {
            default: 'default',
            description: 'description',
            id: 1,
            label: 'label',
            mandatory: true,
            rank: 1,
            readOnly: false,
          },
        ],
        hasChildren: false,
        id: 1,
        label: 'label',
        rank: 1,
        readOnly: false,
        selfCareResources: [
          {
            id: 1,
            label: 'label',
            rank: 1,
            tip: 'tip',
            type: 'type',
            url: 'url',
          },
        ],
        subject: 'subject',
      },
    ];
    const language = 'en';
    const url = `/support/issueTypes?category=assistance&language=${language}&serviceType=cloud_project`;
    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockData });

    // Act
    const result = await getIssueTypes(language);

    // Assert
    expect(v6.get).toHaveBeenCalledWith(url);
    expect(result).toEqual(mockData);
  });

  it('handles errors when fetching issue types', async () => {
    // Arrange
    const language = 'en';
    const url = `/support/issueTypes?category=assistance&language=${language}&serviceType=cloud_project`;
    const errorMessage = 'Network Error';
    vi.mocked(v6.get).mockRejectedValueOnce(new Error(errorMessage));

    // Act & Assert
    await expect(getIssueTypes(language)).rejects.toThrow(errorMessage);
    expect(v6.get).toHaveBeenCalledWith(url);
  });
});
