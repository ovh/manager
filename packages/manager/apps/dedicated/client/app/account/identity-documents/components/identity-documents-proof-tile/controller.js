import { USER_TYPE, PROOF_TYPE } from '../../user-identity-documents.constant';

export default class AccountUserIdentityDocumentsRequirementsController {
  /* @ngInject */
  constructor() {
    this.USER_TYPE = USER_TYPE;
    this.PROOF_TYPE = PROOF_TYPE;
  }

  $onInit() {
    this.isAadhaarCard = this.proof === this.PROOF_TYPE.aadhaar_card;
    this.boxType = this.isAadhaarCard ? 'tagged' : 'light';
    this.userTypeKey =
      this.userType === this.USER_TYPE.individual
        ? 'particular'
        : 'non_individual';
  }
}
