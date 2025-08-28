export function hasSameStringElements(
  anArray: string[] | undefined,
  otherArray: string[] | undefined,
): boolean {
  if (!anArray || !otherArray || anArray.length !== otherArray.length) {
    return false;
  }

  const sortedArray = anArray.sort();
  const sortedOtherArray = otherArray.sort();

  return sortedArray.every((item, idx) => item === sortedOtherArray[idx]);
}
