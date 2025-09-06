import React from 'react';

import { describe, expect, vi } from 'vitest';

import { containsDigit, containsLowercase, containsSpecial, containsUppercase } from '@/utils';
import { fireEvent, render } from '@/utils/test.provider';

import GeneratePasswordButton from './GeneratePasswordButton.component';

describe('GeneratePasswordButton component', () => {
  it('should render and call onGenerate & onClick when clicked', () => {
    const onGenerate = vi.fn();
    const onClick = vi.fn();
    const { getByTestId } = render(
      <GeneratePasswordButton
        id="generate-password-btn"
        onGenerate={onGenerate}
        onClick={onClick}
      />,
    );
    const cmp = getByTestId('generate-password-btn');
    expect(cmp).toBeInTheDocument();

    fireEvent.click(cmp);

    expect(onGenerate).toHaveBeenCalledOnce();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('should generate a password with all defaults', () => {
    const onGenerate = vi.fn();
    const { getByTestId } = render(
      <GeneratePasswordButton id="generate-password-btn" onGenerate={onGenerate} />,
    );
    const cmp = getByTestId('generate-password-btn');
    expect(cmp).toBeInTheDocument();

    fireEvent.click(cmp);

    expect(onGenerate).toHaveBeenCalledOnce();
    const password = onGenerate.mock.lastCall?.[0];
    expect(password).toHaveLength(12);
    expect(containsLowercase(password)).toBe(true);
    expect(containsUppercase(password)).toBe(true);
    expect(containsDigit(password)).toBe(true);
    expect(containsSpecial(password)).toBe(true);
  });

  it('should generate a password with 20 characters', () => {
    const onGenerate = vi.fn();
    const { getByTestId } = render(
      <GeneratePasswordButton id="generate-password-btn" onGenerate={onGenerate} length={20} />,
    );
    const cmp = getByTestId('generate-password-btn');
    expect(cmp).toBeInTheDocument();

    fireEvent.click(cmp);

    expect(onGenerate).toHaveBeenCalledOnce();
    const password = onGenerate.mock.lastCall?.[0];
    expect(password).toHaveLength(20);
  });

  it('should generate a password with only lowercased letters', () => {
    const onGenerate = vi.fn();
    const { getByTestId } = render(
      <GeneratePasswordButton
        id="generate-password-btn"
        onGenerate={onGenerate}
        withLowercase
        withUppercase={false}
        withDigit={false}
        withSpecial={false}
      />,
    );
    const cmp = getByTestId('generate-password-btn');
    expect(cmp).toBeInTheDocument();

    fireEvent.click(cmp);

    expect(onGenerate).toHaveBeenCalledOnce();
    const password = onGenerate.mock.lastCall?.[0];
    expect(containsLowercase(password)).toBe(true);
    expect(containsUppercase(password)).toBe(false);
    expect(containsDigit(password)).toBe(false);
    expect(containsSpecial(password)).toBe(false);
  });

  it('should generate a password with only uppercased letters', () => {
    const onGenerate = vi.fn();
    const { getByTestId } = render(
      <GeneratePasswordButton
        id="generate-password-btn"
        onGenerate={onGenerate}
        withUppercase
        withLowercase={false}
        withDigit={false}
        withSpecial={false}
      />,
    );
    const cmp = getByTestId('generate-password-btn');
    expect(cmp).toBeInTheDocument();

    fireEvent.click(cmp);

    expect(onGenerate).toHaveBeenCalledOnce();
    const password = onGenerate.mock.lastCall?.[0];
    expect(containsUppercase(password)).toBe(true);
    expect(containsLowercase(password)).toBe(false);
    expect(containsDigit(password)).toBe(false);
    expect(containsSpecial(password)).toBe(false);
  });

  it('should generate a password with only digits', () => {
    const onGenerate = vi.fn();
    const { getByTestId } = render(
      <GeneratePasswordButton
        id="generate-password-btn"
        onGenerate={onGenerate}
        withDigit
        withLowercase={false}
        withUppercase={false}
        withSpecial={false}
      />,
    );
    const cmp = getByTestId('generate-password-btn');
    expect(cmp).toBeInTheDocument();

    fireEvent.click(cmp);

    expect(onGenerate).toHaveBeenCalledOnce();
    const password = onGenerate.mock.lastCall?.[0];
    expect(containsDigit(password)).toBe(true);
    expect(containsLowercase(password)).toBe(false);
    expect(containsUppercase(password)).toBe(false);
    expect(containsSpecial(password)).toBe(false);
  });

  it('should generate a password with only special characters', () => {
    const onGenerate = vi.fn();
    const { getByTestId } = render(
      <GeneratePasswordButton
        id="generate-password-btn"
        onGenerate={onGenerate}
        withSpecial
        withDigit={false}
        withLowercase={false}
        withUppercase={false}
      />,
    );
    const cmp = getByTestId('generate-password-btn');
    expect(cmp).toBeInTheDocument();

    fireEvent.click(cmp);

    expect(onGenerate).toHaveBeenCalledOnce();
    const password = onGenerate.mock.lastCall?.[0];
    expect(containsSpecial(password)).toBe(true);
    expect(containsDigit(password)).toBe(false);
    expect(containsLowercase(password)).toBe(false);
    expect(containsUppercase(password)).toBe(false);
  });
});
