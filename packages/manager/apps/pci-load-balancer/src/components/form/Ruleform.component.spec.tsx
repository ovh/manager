import { act, fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TL7Rule } from '@/api/data/l7Rules';
import { wrapper } from '@/wrapperRenders';

import RuleForm from './RuleForm.component';

describe('RuleForm Component', () => {
  const onSubmit = vi.fn();
  const onCancel = vi.fn();
  it('should render the form', () => {
    const { getByText } = render(<RuleForm rule={null} onSubmit={onSubmit} onCancel={onCancel} />, {
      wrapper,
    });
    expect(getByText('octavia_load_balancer_create_l7_rule_type')).toBeInTheDocument();
  });

  it('should call onSubmit when form is submitted', () => {
    const handleSubmit = vi.fn();
    const rule = {
      key: 'key',
      value: 'value',
      ruleType: 'ruleType',
      compareType: 'compareType',
    } as TL7Rule;

    const { getByTestId } = render(
      <RuleForm onSubmit={handleSubmit} onCancel={onCancel} rule={rule} />,
    );

    const submitButton = getByTestId('ruleForm-submit_button');

    act(() => {
      fireEvent.click(submitButton);
    });

    expect(handleSubmit).toHaveBeenCalledOnce();
  });
});
