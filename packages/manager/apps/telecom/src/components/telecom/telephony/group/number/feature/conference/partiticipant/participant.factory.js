import assign from 'lodash/assign';
import pick from 'lodash/pick';

/**
 *  This factory manages the conference feature of a number.
 *  This manages the conference of /telephony/{billingAccount}/number API.
 */
export default /* @ngInject */ (OvhApiTelephony) => {
  /*= ==================================
    =            CONSTRUCTOR            =
    =================================== */

  function TelephonyGroupNumberConferenceParticipant(participantOptionsParam) {
    let participantOptions = participantOptionsParam;

    // check for mandatory options
    if (!participantOptions) {
      participantOptions = {};
    }

    // check mandatory fields
    if (!participantOptions.billingAccount) {
      throw new Error(
        'billingAccount option must be specified when creating a new TelephonyGroupNumberConferenceParticipant',
      );
    }

    if (!participantOptions.serviceName) {
      throw new Error(
        'serviceName option must be specified when creating a new TelephonyGroupNumberConferenceParticipant',
      );
    }

    if (!participantOptions.id) {
      throw new Error(
        'id option must be specified when creating a new TelephonyGroupNumberConferenceParticipant',
      );
    }

    // set mandatory attributes
    this.billingAccount = participantOptions.billingAccount;
    this.serviceName = participantOptions.serviceName;
    this.id = participantOptions.id;

    // custom attributes
    this.inEdition = false;
    this.saveForEdition = null;
    this.energyEquivalence = null;

    // set feature options
    this.setInfos(participantOptions).setEnergyEquivalent();
  }

  /* -----  End of CONSTRUCTOR  ------*/

  /*= ========================================
    =            PROTOTYPE METHODS            =
    ========================================= */

  /* ----------  FEATURE OPTIONS  ----------*/

  TelephonyGroupNumberConferenceParticipant.prototype.setInfos = function setInfos(
    participantOptionsParam,
  ) {
    const self = this;
    let participantOptions = participantOptionsParam;

    if (!participantOptions) {
      participantOptions = {};
    }

    const optionsAttributes = [
      'energy',
      'talking',
      'speak',
      'callerNumber',
      'floor',
      'hear',
      'callerName',
      'arrivalDateTime',
    ];

    assign(self, pick(participantOptions, optionsAttributes));

    return self;
  };

  TelephonyGroupNumberConferenceParticipant.prototype.setEnergyEquivalent = function setEnergyEquivalent() {
    const self = this;

    switch (self.energy) {
      case 450:
        self.energyEquivalence = 1;
        break;
      case 150:
        self.energyEquivalence = 3;
        break;
      case 0:
        self.energyEquivalence = 4;
        break;
      default:
        self.energyEquivalence = 2; // because default energy is 300 (equivalence of 2)
    }

    return self;
  };

  /* ----------  API CALLS  ----------*/

  /**
   *  Mute a participant of a conference
   *
   *  @return {Promise} That return a Telephony Task
   */
  TelephonyGroupNumberConferenceParticipant.prototype.mute = function mute() {
    const self = this;

    return OvhApiTelephony.Conference()
      .Participants()
      .v6()
      .mute(
        {
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
          id: self.id,
        },
        {},
      ).$promise;
  };

  /**
   *  Unmute a participant of a conference
   *
   *  @return {Promise} That return a Telephony Task
   */
  TelephonyGroupNumberConferenceParticipant.prototype.unmute = function unmute() {
    const self = this;

    return OvhApiTelephony.Conference()
      .Participants()
      .v6()
      .unmute(
        {
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
          id: self.id,
        },
        {},
      ).$promise;
  };

  /**
   *  Kick a participant of a conference
   *
   *  @return {Promise} That return a Telephony Task
   */
  TelephonyGroupNumberConferenceParticipant.prototype.kick = function kick() {
    const self = this;

    return OvhApiTelephony.Conference()
      .Participants()
      .v6()
      .kick(
        {
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
          id: self.id,
        },
        {},
      ).$promise;
  };

  /**
   *  Deaf a participant of a conference
   *
   *  @return {Promise} That return a Telephony Task
   */
  TelephonyGroupNumberConferenceParticipant.prototype.deaf = function deaf() {
    const self = this;

    return OvhApiTelephony.Conference()
      .Participants()
      .v6()
      .deaf(
        {
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
          id: self.id,
        },
        {},
      ).$promise;
  };

  /**
   *  Undeaf a participant of a conference
   *
   *  @return {Promise} That return a Telephony Task
   */
  TelephonyGroupNumberConferenceParticipant.prototype.undeaf = function undeaf() {
    const self = this;

    return OvhApiTelephony.Conference()
      .Participants()
      .v6()
      .undeaf(
        {
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
          id: self.id,
        },
        {},
      ).$promise;
  };

  /**
   *  Change energy from a participant of a conference
   *
   *  @return {Promise} That return a Telephony Task
   */
  TelephonyGroupNumberConferenceParticipant.prototype.updateEnergy = function updateEnergy(
    value,
  ) {
    const self = this;

    return OvhApiTelephony.Conference()
      .Participants()
      .v6()
      .energy(
        {
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
          id: self.id,
        },
        {
          value,
        },
      ).$promise;
  };

  /* -----  End of PROTOTYPE METHODS  ------*/

  return TelephonyGroupNumberConferenceParticipant;
};
