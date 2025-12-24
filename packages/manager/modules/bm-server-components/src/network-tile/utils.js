const ipv4Regex = /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/;

export const filterIpv4List = (ips) =>
  ips.filter((ip = '') => ipv4Regex.test(ip.split('/')[0]));
