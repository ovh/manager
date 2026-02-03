const SANITIZATION_REGEX = /^\s*(?:(?:(?:https?|ftp|file|blob):\/\/(?:(?:(?:[^./?#]+\.)*(?:ovh|(?:ovhcloud(?=\.com))|(?:ovhtelecom(?=\.fr))|(?:ovh-hosting(?=\.fi))|soyoustart|kimsufi|build-ovhcloud|build-ovh)\.(?:com|net|org|ovh|co\.uk|com\.tn|cz|de|es|eu|fi|fr|ie|it|lt|ma|nl|pl|pt|sn|uk|us))|localhost|127\.0\.0\.1)(?::\d+)?)|data:image)(?:\/|$)/i;

export const sanitizeUrl = (url: string | null) => {
  if (!url || !SANITIZATION_REGEX.test(url)) {
    return null;
  }

  return url;
};
