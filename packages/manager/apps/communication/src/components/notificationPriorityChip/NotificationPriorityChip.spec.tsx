import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NotificationPriorityChip, {
  PRIORITY_COLOR,
} from './NotificationPriorityChip.component';
import referenceResponse from '@/data/api/__mocks__/reference.json';
import { NotificationPriority, NotificationReference } from '@/data/types';

const { priorities } = referenceResponse as NotificationReference;

vi.mock('@ovhcloud/ods-react', async (original) => ({
  ...(await original()),
  Badge: ({ children, color }: { children: React.ReactNode; color: string }) => (
    <div role="badge" data-color={color}>
      {children}
    </div>
  ),
}));

describe('NotificationPriorityChip.component', () => {
  it.each(
    priorities.map((priority) => ({
      label: priority.name,
      color: PRIORITY_COLOR[priority.name as NotificationPriority],
    })),
  )(
    'should render with the the priority $label in the color $color',
    ({ label, color }) => {
      const { getByRole } = render(
        <NotificationPriorityChip priority={label as NotificationPriority} />,
      );
      expect(getByRole('badge')).toHaveAttribute('data-color', color);
    },
  );
});
