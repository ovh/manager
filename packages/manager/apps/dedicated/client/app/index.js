import 'script-loader!jquery'; // eslint-disable-line
import 'whatwg-fetch';
import {
  attach as attachPreloader,
  displayMessage,
} from '@ovh-ux/manager-preloader';
import { bootstrapApplication } from '@ovh-ux/manager-core';
import { Environment } from '@ovh-ux/manager-config';

attachPreloader(Environment.getUserLanguage());

bootstrapApplication('dedicated').then(({ region }) => {
  if (region === 'EU') {
    const message = {
      en: {
        description:
          'Our services are currently experiencing traffic spikes. We are making every effort to restore availability to the OVHcloud Control Panel (<a href="http://travaux.ovh.net/?do=details&id=49498" target="_blank">status task</a>).',
      },
      fr: {
        description:
          'Nous faisons actuellement face à un pic exceptionnellement élevé de trafic. Nous mettons tout en oeuvre pour restaurer la disponibilité de votre Espace client (<a href="http://travaux.ovh.net/?do=details&id=49498" target="_blank">tâche Travaux ouverte</a>).',
      },
      it: {
        description:
          'A causa dell\'enorme aumento di traffico la nostra Area Clienti non è raggiungibile, stiamo facendo tutto il possibile per ripristinarla (<a href="http://travaux.ovh.net/?do=details&id=49498" target="_blank">qui puoi monitorare il task</a>).',
      },
      de: {
        description:
          'Derzeit haben wir eine Trafficspitze. Wir tun alles, damit Ihr Kundencenter wieder verfügbar wird. (<a href="http://travaux.ovh.net/?do=details&id=49498" target="_blank">Den Verlauf können Sie hier einsehen</a>).',
      },
      es: {
        description:
          'En estos momentos estamos gestionando un pico de tráfico excepcionalmente elevado. Nuestros equipos están haciendo todo lo posible para restablecer la disponibilidad de su área de cliente (<a href="http://travaux.ovh.net/?do=details&id=49498" target="_blank">tarea correspondiente</a>).',
      },
      pt: {
        description:
          'Estamos a enfrentar um pico de tráfego. As nossas equipas estão a fazer todos os possíveis para restabelecer a disponibilidade da sua Área de Cliente (<a href="http://travaux.ovh.net/?do=details&id=49498" target="_blank">tarefa correspondente</a>).',
      },
      pl: {
        description:
          'Aktualnie odnotowujemy znaczny wzrost ruchu na stronie logowania do Panelu klienta. Dokładamy wszelkich starań, aby jak najszybciej przywrócić jej standardowe działanie (<a href="http://travaux.ovh.net/?do=details&id=49498" target="_blank">status prac</a>).',
      },
    };
    displayMessage(message, Environment.getUserLanguage());
    Environment.setMessage(message);
  }

  import(`./config-${region}`)
    .catch(() => {})
    .then(() => import('./app.module'))
    .then(({ default: application }) => {
      angular.bootstrap(document.body, [application], {
        strictDi: false,
      });
    });
});
