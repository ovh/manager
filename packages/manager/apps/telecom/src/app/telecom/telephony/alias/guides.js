import get from 'lodash/get';

const guides = {
  fr_FR: {
    ccs: {
      configure:
        'https://docs.ovh.com/fr/voip/contact-center-solution/#configurer-CCS',
      conditionAdd:
        'https://docs.ovh.com/fr/voip/contact-center-solution/#ajouter-condition',
      exceptionalDays:
        'https://docs.ovh.com/fr/voip/contact-center-solution/#jours-exceptionnels',
      timeSlot:
        'https://docs.ovh.com/fr/voip/contact-center-solution/#plages-horaires',
      callFiltering:
        'https://docs.ovh.com/fr/voip/contact-center-solution/#filtrages-appels',
      dashboard:
        'https://docs.ovh.com/fr/voip/contact-center-solution/#tableau-de-bord',
      recordings:
        'https://docs.ovh.com/fr/voip/contact-center-solution/#enregistrements',
      queueCreation:
        'https://docs.ovh.com/fr/voip/contact-center-solution/#creer-files',
      sviCreation:
        'https://docs.ovh.com/fr/voip/contact-center-solution/#creer-svi',
      soundsManagement:
        'https://docs.ovh.com/fr/voip/contact-center-solution/#gerer-sons',
      ttsManagement:
        'https://docs.ovh.com/fr/voip/contact-center-solution/#gerer-tts',
    },
  },
};

export default function AliasGuides() {
  this.getURL = (id) => {
    // @TODO use user prefered language when other guides are available
    return get(guides.fr_FR, id);
  };
}
