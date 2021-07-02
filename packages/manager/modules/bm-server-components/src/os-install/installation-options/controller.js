import range from 'lodash/range';
import forEach from 'lodash/forEach';

import {
  CONSTANTS,
} from '../ovh/constants';

export default class BmServerComponentsOsInstallInstallationOptionsCtrl {
  /* @ngInject */
  constructor($http, $q, $translate, osInstallService) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.osInstallService = osInstallService;
    this.constants = CONSTANTS;
  }

  $onInit() {
    this.loader = {
      loadingSshKeys: false,
    };
    this.optionForm = null;

    this.sshList = {
      model: [],
      error: false,
    };
    if (this.installation.selectDistribution?.family !== this.constants.warningWindows ||
      this.installation.selectGabarit?.family !== this.constants.warningWindows) {
      this.load();
    }
  }

  load() {
    this.loader.loadingSshKeys = true;
    this.osInstallService.getSshKey(this.serviceName)
    .then((data) => {
      this.sshList.model = data;
    })
    .catch((error) => {
      this.sshList.error = true;
      this.handleError(
        error,
        this.$translate.instant(
          'server_configuration_installation_form_ssh_no',
        ),
      );
    })
    .finally(() => {
      this.loader.loadingSshKeys = false;
    });
  }

  postInstallationScriptLinkValidator() {
    const input = this.optionForm.postInstallationScriptLink;
    const val = this.installation.options.postInstallationScriptLink;
    const regexpCheckPort = /^(((https|http|ftp|ftps|ftpes)?:\/\/)?(([^:/]*\.?)*))(:(\d+))?(\/|$)/g;
    const regexpUrlContent = /^([a-zA-Z0-9-./_:~% ]+)$/;
    const regexpUrlProtocol = /^((https|http|ftp|ftps|ftpes)?:\/\/).*/;
    const regexpUrlExtension = /.*(\.zip|\.tar\.gz|\.sh|\.pl|\.cgi)$/;
    const infoUrl = regexpCheckPort.exec(val);
    let port;

    if (val) {
      port = infoUrl ? infoUrl[6] : null;

      input.$setValidity(
        'bad_port_script',
        !port || (port >= 0 && port <= 65535),
      );
      input.$setValidity('bad_url_script', regexpUrlContent.test(val));
      input.$setValidity(
        'bad_protocol_script',
        regexpUrlProtocol.test(val),
      );
      input.$setValidity(
        'bad_extension_script',
        regexpUrlExtension.test(val),
      );
    } else {
      input.$setValidity('bad_port_script', true);
      input.$setValidity('bad_url_script', true);
      input.$setValidity('bad_protocol_script', true);
      input.$setValidity('bad_extension_script', true);
    }
  };

  getNbDisqueList(nbdisk) {
    if (nbdisk > 1) {
      return range(1, nbdisk + 1);
    }
    return [nbdisk];
  };

  getMountPoint() {
    const list = [];
    forEach(
      this.installation.partitionSchemeModels,
      (partition) => {
        if (partition.fileSystem !== this.constants.warningSwap) {
          list.push(partition);
        }
      },
    );
    return list;
  };

  handleError(error, message = null) {
    if (isFunction(this.onError)) {
      this.onError({
        error: { message, data: error }
      });
    }
  }
}
