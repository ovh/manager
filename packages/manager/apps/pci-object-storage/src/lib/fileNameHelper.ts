export function splitObjectKey(
  objectKey: string,
): { path: string; file: string } {
  const lastSlash = objectKey.lastIndexOf('/');
  if (lastSlash === -1) {
    return { path: '', file: objectKey };
  }
  return {
    path: objectKey.slice(0, lastSlash + 1), // <-- garde le slash final
    file: objectKey.slice(lastSlash + 1),
  };
}
