export const getBrowserName = () => {
  const ua = navigator.userAgent;

  if (/chrome|crios|crmo/i.test(ua) && !/edg/i.test(ua)) return 'Chrome';
  if (/safari/i.test(ua) && !/chrome|crios|crmo/i.test(ua)) return 'Safari';
  if (/firefox|fxios/i.test(ua)) return 'Firefox';
  if (/edg/i.test(ua)) return 'Edge';

  return 'Unknown';
};
