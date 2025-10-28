enum TokenType {
  BORDER_RADIUS = 'border-radius',
  BORDER_WIDTH = 'border-width',
  COLOR = 'color',
  FONT_FAMILY = 'font-family',
  FORM_ELEMENT = 'form-element',
  OUTLINE = 'outline',
}

enum TokenCategory {
  BORDER_RADIUS = 'Border Radius',
  BORDER_WIDTH = 'Border Width',
  COLORS = 'Colors',
  FONT_FAMILY = 'Font Family',
  FORM_ELEMENT = 'Form Element',
  OUTLINE = 'Outline',
}

interface Token {
  name: string;
  type: TokenType;
  value: string;
}

interface TokenGroup {
  name: TokenCategory;
  tokens: Token[];
}

export {  
  type Token,  
  TokenCategory,  
  type TokenGroup,  
  TokenType,  
}  
