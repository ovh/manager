import React, { useEffect, useState } from 'react';
import {
  type Token,
  TokenCategory,
  type TokenGroup,
  TokenType,
} from '../../constants/designTokens';
import { Heading } from '../heading/Heading';
import { TokenPreview } from './tokenPreview/TokenPreview';
import { TokensTable } from './tokensTable/TokensTable';

interface TransformedToken {
  name: string;
  preview: React.ReactNode;
  type: TokenType;
  value: string;
}

interface TransformedTokenGroup {
  name: string;
  tokens: TransformedToken[];
}

const extractCssVariablesFromRoot = (): Record<string, string> => {
  const cssVariables: Record<string, string> = {};

  for (const sheet of Array.from(document.styleSheets)) {
    try {
      const rules = sheet.cssRules;
      if (!rules) {
        continue;
      }
      for (const rule of Array.from(rules) as CSSStyleRule[]) {
        if (rule.selectorText?.includes(':root')) {
          for (const propName of Array.from(rule.style)) {
            if (propName.startsWith('--ods-')) {
              cssVariables[propName] = rule.style.getPropertyValue(propName).trim();
            }
          }
        }
      }
    } catch (e) {
      console.warn('Cannot access CSS rules from stylesheet:', sheet.href, e);
    }
  }

  return cssVariables;
};

const categorizeTokens = (variables: Record<string, string>): TokenGroup[] => {
  const categorizedTokens: Record<TokenCategory, Token[]> = {
    [TokenCategory.BORDER_RADIUS]: [],
    [TokenCategory.BORDER_WIDTH]: [],
    [TokenCategory.COLORS]: [],
    [TokenCategory.FONT_FAMILY]: [],
    [TokenCategory.FORM_ELEMENT]: [],
    [TokenCategory.OUTLINE]: [],
  };

  Object.entries(variables).forEach(([name, value]) => {
    if (name.includes(TokenType.COLOR)) {
      categorizedTokens[TokenCategory.COLORS].push({ name, value, type: TokenType.COLOR });
    } else if (name.includes(TokenType.FONT_FAMILY)) {
      categorizedTokens[TokenCategory.FONT_FAMILY].push({ name, value, type: TokenType.FONT_FAMILY });
    } else if (name.includes(TokenType.BORDER_RADIUS)) {
      categorizedTokens[TokenCategory.BORDER_RADIUS].push({ name, value, type: TokenType.BORDER_RADIUS });
    } else if (name.includes(TokenType.BORDER_WIDTH)) {
      categorizedTokens[TokenCategory.BORDER_WIDTH].push({ name, value, type: TokenType.BORDER_WIDTH });
    } else if (name.includes(TokenType.OUTLINE)) {
      categorizedTokens[TokenCategory.OUTLINE].push({ name, value, type: TokenType.OUTLINE });
    } else if (name.includes(TokenType.FORM_ELEMENT)) {
      categorizedTokens[TokenCategory.FORM_ELEMENT].push({ name, value, type: TokenType.FORM_ELEMENT });
    } else {
      console.error(`token not recognized:${name} - ${value}`);
    }
  });

  return Object.entries(categorizedTokens)
    .map(([categoryName, tokens]) => ({
      name: categoryName as TokenCategory,
      tokens: tokens.sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .filter((group) => group.tokens.length > 0);
};

const DesignTokens: React.FC = () => {
  const [tokenCategories, setTokenCategories] = useState<TransformedTokenGroup[]>([]);

  useEffect(() => {
    const cssVariables = extractCssVariablesFromRoot();
    const rawTokenGroups = categorizeTokens(cssVariables);

    const transformedTokenGroups: TransformedTokenGroup[] = rawTokenGroups.map((group) => ({
      name: group.name,
      tokens: group.tokens.map((token) => ({
        name: token.name,
        preview: <TokenPreview
          name={ token.name }
          type={ token.type }
          value={ token.value } />,
        type: token.type,
        value: token.value,
      })),
    }));

    setTokenCategories(transformedTokenGroups);
  }, []);

  return (
    <div>
      {tokenCategories.map((group) => (
        <section key={ group.name }>
          <Heading
          label={ group.name }
          level={2} />
          <TokensTable
          category={ group.name }
          tokens={ group.tokens } />
        </section>
      ))}
    </div>
  );
};

export {
  DesignTokens,
};
