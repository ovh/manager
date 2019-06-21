export const SANITIZATION = {
  regex: /^\s*(?:(?:(?:https?|ftp|file|blob):\/\/(?:(?:(?:[^./?#]+\.)*(?:ovh|(?:ovhcloud(?=\.com))|(?:ovhtelecom(?=\.fr))|(?:ovh-hosting(?=\.fi))|soyoustart|kimsufi|runabove)\.(?:com|net|org|ovh|co\.uk|com\.tn|cz|de|es|eu|fi|fr|ie|it|lt|ma|nl|pl|pt|sn|uk|us))|localhost|127\.0\.0\.1|[\w-]+\.uxci(-ca|-us)?\.ovh)(?::\d+)?)|data:image)(?:\/|$)/i,
};

export default {
  SANITIZATION,
};
