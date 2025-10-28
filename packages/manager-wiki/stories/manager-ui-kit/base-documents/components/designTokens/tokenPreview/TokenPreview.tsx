import { Input } from '@ovhcloud/ods-react';
import React from 'react';
import { TokenType } from '../../../constants/designTokens';
import styles from './tokenPreview.module.css';

interface TokenPreviewProps {
  name?: string;
  type: TokenType;
  value: string;
}

const getOutlineStyles = (name: string | undefined, value: string): React.CSSProperties => {
  if (!name) {
    return {};
  }
  if (name.includes('color')) {
    return { outline: `3px solid ${value}`, outlineOffset: '0' };
  }
  if (name.includes('width')) {
    return { outline: `${value} solid var(--ods-color-primary-500)`, outlineOffset: '0' };
  }
  if (name.includes('style')) {
    return { outline: `3px ${value} var(--ods-color-primary-500)`, outlineOffset: '0' };
  }
  if (name.includes('offset')) {
    return { outline: '3px solid var(--ods-color-primary-500)', outlineOffset: value };
  }
  return {};
};

const TokenPreview: React.FC<TokenPreviewProps> = ({ name, type, value }) => {
  const previewClasses: Record<TokenType, string> = {
    [TokenType.BORDER_RADIUS]: styles.borderRadius,
    [TokenType.BORDER_WIDTH]: styles.borderWidth,
    [TokenType.COLOR]: styles.color,
    [TokenType.FORM_ELEMENT]: styles.formElement,
    [TokenType.FONT_FAMILY]: styles.fontFamily,
    [TokenType.OUTLINE]: styles.outline,
  };

  const outlineStyles = getOutlineStyles(name, value);

  const stylesMap: React.CSSProperties = {
    ...(type === TokenType.BORDER_RADIUS && { borderRadius: value }),
    ...(type === TokenType.BORDER_WIDTH && { borderWidth: value }),
    ...(type === TokenType.COLOR && { backgroundColor: value }),
    ...(type === TokenType.FONT_FAMILY && { fontFamily: value }),
    ...(type === TokenType.OUTLINE && outlineStyles),
  };

  return (
    <div className={previewClasses[type] || styles.root} style={stylesMap}>
      {type === TokenType.FONT_FAMILY ?
      'Aa'
      : type === TokenType.FORM_ELEMENT ?
      <Input
        defaultValue={ value }
        readOnly /> : null}
    </div>
  );
};

export {
  TokenPreview,
};
