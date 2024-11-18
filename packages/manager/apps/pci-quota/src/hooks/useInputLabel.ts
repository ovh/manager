import { useMemo } from 'react';
import { TIssueType } from '@/api/data/issue';
import { SUPPORT_ISSUE_TYPE_IDS } from '@/constants';

export default function useInputLabel(
  type: string,
  issueTypes: TIssueType[],
): string {
  return useMemo(() => {
    if (type === 'support' && Array.isArray(issueTypes)) {
      const targetIssueType = issueTypes.find(({ id }) =>
        SUPPORT_ISSUE_TYPE_IDS.includes(id),
      );

      if (targetIssueType) {
        return targetIssueType.fields.map(({ label }) => label).join('\n\n');
      }
    }
    return '';
  }, [issueTypes, type]);
}
