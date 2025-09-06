import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import NotificationPriorityChip, {
  PRIORITY_COLOR,
} from './NotificationPriorityChip.component';
import referenceResponse from '@/data/api/__mocks__/reference.json';
import { NotificationPriority, NotificationReference } from '@/data/types';

const { priorities } = referenceResponse as NotificationReference;

describe('NotificationPriorityChip.component', () => {
  it.each([
    priorities.map((priority) => ({
      label: priority.name,
      color: PRIORITY_COLOR[priority.name as NotificationPriority],
    })),
  ])(
    'should render with the the priority $label in the color $color',
    ({ label, color }) => {
      const { container } = render(
        <NotificationPriorityChip priority={label as NotificationPriority} />,
      );
      expect(container.querySelector('ods-badge')).toHaveAttribute(
        'color',
        color,
      );
    },
  );
});
