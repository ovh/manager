import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import useCopyToClipboard from 'react-use/lib/useCopyToClipboard';

import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';

export const getRandomIndex = (length: number) => {
  // Crypto API is available
  if (window.crypto && window.crypto.getRandomValues) {
    return Math.floor(
      (window.crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)) * length,
    );
  }

  // Crypto API is not supported, provide alternative method
  return Math.floor(Math.random() * length);
};

export type GeneratePasswordOptions = {
  length?: number;
  withLowercase?: boolean;
  withUppercase?: boolean;
  withDigit?: boolean;
  withSpecial?: boolean;
};

export const generatePassword = (options: GeneratePasswordOptions = {}) => {
  const { length, withLowercase, withUppercase, withDigit, withSpecial } = {
    ...{
      // defaults
      length: 12,
      withLowercase: true,
      withUppercase: true,
      withDigit: true,
      withSpecial: true,
    },
    ...options,
  };

  if (length <= 0) {
    throw new Error("generatePassword: password length can't be less than or equal to 0");
  }

  if (![withLowercase, withUppercase, withDigit, withSpecial].some(Boolean)) {
    throw new Error('generatePassword: should have at least one character requirement');
  }

  const uppercased = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercased = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const specials = '!@#$%^&*()-=_+[]{}|;:,.<>?/';

  let input = '';
  const output = [];

  if (withLowercase) {
    output.push(lowercased.charAt(getRandomIndex(lowercased.length)));
    input += lowercased;
  }
  if (withUppercase) {
    output.push(uppercased.charAt(getRandomIndex(uppercased.length)));
    input += uppercased;
  }
  if (withDigit) {
    output.push(digits.charAt(getRandomIndex(digits.length)));
    input += digits;
  }
  if (withSpecial) {
    output.push(specials.charAt(getRandomIndex(specials.length)));
    input += specials;
  }

  const remaining = length - output.length;

  if (remaining < 0) {
    throw new Error(
      "generatePassword: password length can't be smaller than minimum requirements.",
    );
  }

  for (let i = 0; i < remaining; i += 1) {
    output.push(input.charAt(getRandomIndex(input.length)));
  }

  // shuffle result to ensure randomness
  for (let i = output.length - 1; i > 0; i -= 1) {
    const j = getRandomIndex(i + 1);
    [output[i], output[j]] = [output[j], output[i]];
  }

  return output.join('');
};

export type GeneratedPasswordButtonProps = {
  id: string;
  onGenerate: (password: string) => void;
  label?: string;
  icon?: ODS_ICON_NAME;
  onClick?: (e: React.MouseEvent<HTMLOdsButtonElement>) => void;
} & GeneratePasswordOptions;

export const GeneratePasswordButton = ({
  id,
  onGenerate,
  label = '',
  icon = ODS_ICON_NAME.key,
  onClick,
  ...options
}: GeneratedPasswordButtonProps) => {
  const { t } = useTranslation(['common']);
  const [clipboard, copyToClipboard] = useCopyToClipboard();
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    if (clipboard.value) {
      setGenerated(true);
    }
  }, [clipboard]);

  return (
    <div
      onMouseLeave={() => {
        if (generated) {
          // timeout necessary otherwise you can see the tooltip change
          // before it disappears
          setTimeout(() => {
            setGenerated(false);
          }, 100);
        }
      }}
    >
      <OdsButton
        id={id}
        data-testid={id}
        label={label}
        aria-label={label || 'Password Generator button'}
        icon={generated ? ODS_ICON_NAME.check : icon}
        size={ODS_BUTTON_SIZE.sm}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={(e) => {
          onClick?.(e);
          const pwd = generatePassword(options);
          onGenerate(pwd);
          copyToClipboard(pwd);
        }}
      />
      <OdsTooltip role="tooltip" withArrow triggerId={id}>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(generated ? 'generated_password_tooltip' : 'generate_password_tooltip')}
        </OdsText>
      </OdsTooltip>
    </div>
  );
};

export default GeneratePasswordButton;
