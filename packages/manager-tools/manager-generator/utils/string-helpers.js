/**
 * @returns true if the type is an array type
 */
export const isArrayType = (typeStr) => typeStr.endsWith('[]');

/**
 * @returns string type minus the brackets
 */
export const removeTypeBrackets = (typeStr) =>
  isArrayType(typeStr) ? typeStr.substring(0, typeStr.length - 2) : typeStr;

/**
 * Makes sur the passed type starts with an upper case letter
 * And remove some weird things that can by contrained in types
 * @returns Cleaned up type string
 */
export const cleanUpType = (originalType) => {
  const typeStr = originalType
    .replace(/:[a-zA-Z]+/g, '')
    .replace(/<[a-zA-Z]+>/g, '');
  return typeStr[0].toUpperCase() + typeStr.substring(1);
};

/**
 * Convert a parsed type into a valid Typescript type
 * @returns Valid typescript type in string
 */
export const transformTypeToTypescript = (originalType) => {
  const typeWithoutBracket = removeTypeBrackets(originalType);

  if (['string', 'boolean', 'number', 'unknown'].includes(typeWithoutBracket)) {
    return originalType;
  }
  if (['long', 'double'].includes(typeWithoutBracket)) {
    return `number${isArrayType(originalType) ? '[]' : ''}`;
  }
  if (typeWithoutBracket === 'void') {
    return `undefined${isArrayType(originalType) ? '[]' : ''}`;
  }
  return cleanUpType(originalType);
};

/**
 * @example getTypeFromString('a.b.c.d.e.f.Type') -> 'Type'
 * @returns the last part of a Java type
 */
export const getTypeFromString = (typeStr) =>
  typeStr
    ? transformTypeToTypescript(typeStr.split('.').slice(-1)[0])
    : 'unknown';

/**
 * @returns true if the string is not a valid Typescript type
 */
export const isUnknownTypescriptType = (typeStr) =>
  ['string', 'number', 'boolean', 'undefined', 'null', 'unknown'].every(
    (type) => !typeStr.includes(type),
  );

/**
 * @returns a valid string clean
 */
export const cleanTypeSyntax = (typeStr) => typeStr.replaceAll('>', '');
