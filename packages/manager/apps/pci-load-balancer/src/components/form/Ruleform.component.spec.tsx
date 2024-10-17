import { render, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RuleForm from './RuleForm.component';
import { wrapper } from '@/wrapperRenders';
import { TL7Rule } from '@/api/data/l7Rules';

describe('RuleForm Component', () => {
  const onSubmit = vi.fn();
  const onCancel = vi.fn();
  it('should render the form', () => {
    const { getByText } = render(
      <RuleForm rule={null} onSubmit={onSubmit} onCancel={onCancel} />,
      {
        wrapper,
      },
    );
    expect(
      getByText('octavia_load_balancer_create_l7_rule_type'),
    ).toBeInTheDocument();
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
    expect(handleSubmit).toHaveBeenCalled();
  });
});
