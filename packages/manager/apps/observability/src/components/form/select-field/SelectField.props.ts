import { ReactNode } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  name: string;
  className?: string;
  options?: SelectOption[];
  children?: ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  error?: string;
  onOdsChange?: (event: { detail: { value?: string | null } }) => void;
}
