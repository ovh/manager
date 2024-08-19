export function getVisitorId() {
  const name = 'clientSideUserId';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(
      parts
        .pop()
        .split(';')
        .shift(),
    );
  }
  return '';
}
