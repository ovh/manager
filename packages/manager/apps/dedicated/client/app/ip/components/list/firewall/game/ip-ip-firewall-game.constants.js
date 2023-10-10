export const IP_MITIGATION_RULE_PROTOCOL_PORT = {
  arkSurvivalEvolved: { from: 7777, to: 7778 },
  arma: { from: 2302 },
  gtaMultiTheftAutoSanAndreas: { from: 22003 },
  gtaSanAndreasMultiplayerMod: { from: 7777 },
  hl2Source: { from: 27015 },
  minecraftPocketEdition: { from: 19132, to: 19133 },
  minecraftQuery: { from: 25565 },
  rust: { from: 28015 },
  trackmaniaShootmania: { from: 2350, to: 2450 },
};

export const ALLOWED_LANGUAGES = {
  en: {
    isDefault: true,
  },
  fr: {
    isDefault: false,
  },
};

export const BASE_URL_SURVEY = 'https://survey.ovh.com/index.php/187648?lang=';

export default {
  IP_MITIGATION_RULE_PROTOCOL_PORT,
  ALLOWED_LANGUAGES,
  BASE_URL_SURVEY,
};
