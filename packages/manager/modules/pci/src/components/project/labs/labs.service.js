import find from 'lodash/find';
import Lab from './lab.class';

export default class PciProjectLabsService {
  /* @ngInject */
  constructor(
    $q,
    OvhApiCloudProjectLab,
    OvhApiMeAgreements,
  ) {
    this.$q = $q;
    this.OvhApiCloudProjectLab = OvhApiCloudProjectLab;
    this.OvhApiMeAgreements = OvhApiMeAgreements;
  }

  getLabs(projectId) {
    return this.OvhApiCloudProjectLab
      .v6()
      .query({
        serviceName: projectId,
      })
      .$promise;
  }

  getLabByName(projectId, labName) {
    return this.getLabs(projectId)
      .then(labs => find(labs, { name: labName }))
      .then(({ id: labId }) => this.getLab(projectId, labId));
  }

  getLab(projectId, labId) {
    return this.OvhApiCloudProjectLab
      .v6()
      .get({
        serviceName: projectId,
        labId,
      })
      .$promise
      .then(lab => new Lab({ ...lab }))
      .then((lab) => {
        if (lab.isOpen()) {
          return this.getLabAgreements(projectId, lab);
        }
        return lab;
      });
  }

  getLabAgreements(projectId, lab) {
    return this.OvhApiCloudProjectLab
      .v6()
      .getAgreements({
        serviceName: projectId,
        labId: lab.id,
      })
      .$promise
      .then(({ accepted, toAccept }) => this.$q.all({
        lab: new Lab({
          ...lab,
          agreements: {
            accepted,
            toAccept,
          },
        }),
        contracts: this.$q.all([
          ...accepted.map(agreementId => this.getContract(agreementId)),
          ...toAccept.map(agreementId => this.getContract(agreementId)),
        ]),
      }))
      .then(({ lab: labWithAgreements, contracts }) => new Lab({
        ...labWithAgreements,
        contracts,
      }));
  }

  getContract(id) {
    return this.OvhApiMeAgreements
      .v6()
      .contract({
        id,
      })
      .$promise
      .then(contract => ({
        id,
        ...contract,
      }));
  }

  acceptContract(id) {
    return this.OvhApiMeAgreements
      .v6()
      .accept({
        id,
      }, {})
      .$promise;
  }

  activateLab(projectId, lab) {
    return this.$q.all(
      lab.toAcceptContracts.map(({ id }) => this.acceptContract(id)),
    )
      .then(() => this.OvhApiCloudProjectLab
        .v6()
        .activate({
          serviceName: projectId,
          labId: lab.id,
        })
        .$promise);
  }
}
