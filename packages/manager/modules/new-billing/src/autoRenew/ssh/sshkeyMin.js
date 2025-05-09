export default /* @ngInject */ function sshkeyMinFilter() {
  const toLength = 50;
  const dots = '...';

  return function sshkeyMin(keyParam) {
    const [sshType, encodedKey, comment = ''] = keyParam.trim().split(' ');

    const initialFormat = `${sshType} ${dots} ${comment}`;
    if (initialFormat.length > toLength) {
      return initialFormat.substring(0, toLength - dots.length) + dots;
    }
    const remainingLength = toLength - initialFormat.length;
    const halfLength = Math.floor(remainingLength / 2);
    const truncatedKey = `${encodedKey.substring(
      0,
      halfLength,
    )}${dots}${encodedKey.substring(encodedKey.length - halfLength)}`;
    return `${sshType} ${truncatedKey} ${comment}`.trim();
  };
}
