import { describe } from 'vitest';
import {
  mockedValues as values,
  mockedErrors as errors,
} from '@/mocks/installationForm.mock';
import { OSConfigForm, SourceForm, SystemForm } from '@/types/form.type';
import {
  FormStepData,
  getFormData,
  getOSConfigFormData,
  getSourceFormData,
  getSystemFormData,
} from './formStepData';

describe('getFormData test suite', () => {
  it('should return selected data', () => {
    expect(
      getFormData({ values, errors, keys: ['serviceName', 'bucketId'] }),
    ).toStrictEqual({
      values: { serviceName: values.serviceName, bucketId: values.bucketId },
      errors: { serviceName: errors.serviceName, bucketId: errors.bucketId },
    });
  });
});

describe('getSystemFormData test suite', () => {
  it('should return SystemForm data', () => {
    expect(getSystemFormData({ values, errors })).toStrictEqual<
      FormStepData<SystemForm>
    >({
      values: {
        sapSid: values.sapSid,
        sapHanaSid: values.sapHanaSid,
        masterSapPassword: values.masterSapPassword,
        masterSapHanaPassword: values.masterSapHanaPassword,
        sidadmPassword: values.sidadmPassword,
        systemPassword: values.systemPassword,
      },
      errors: {
        sapSid: errors.sapSid,
        sapHanaSid: errors.sapHanaSid,
        masterSapPassword: errors.masterSapPassword,
        masterSapHanaPassword: errors.masterSapHanaPassword,
        sidadmPassword: errors.sidadmPassword,
        systemPassword: errors.systemPassword,
      },
    });
  });
});

describe('getSourceFormData test suite', () => {
  it('should return SourceForm data', () => {
    expect(getSourceFormData({ values, errors })).toStrictEqual<
      FormStepData<SourceForm>
    >({
      values: {
        bucketId: values.bucketId,
        endpoint: values.endpoint,
        accessKey: values.accessKey,
        secretKey: values.secretKey,
      },
      errors: {
        bucketId: errors.bucketId,
        endpoint: errors.endpoint,
        accessKey: errors.accessKey,
        secretKey: errors.secretKey,
      },
    });
  });
});

describe('getOSConfigFormData test suite', () => {
  it('should return OSConfigFormData data', () => {
    expect(getOSConfigFormData({ values, errors })).toStrictEqual<
      FormStepData<OSConfigForm>
    >({
      values: {
        domainName: values.domainName,
        osLicense: values.osLicense,
        osUpdate: values.osUpdate,
        firewallService: values.firewallService,
        firewallServer: values.firewallServer,
        firewallDatabase: values.firewallDatabase,
      },
      errors: {
        domainName: errors.domainName,
        osLicense: errors.osLicense,
        osUpdate: errors.osUpdate,
        firewallService: errors.firewallService,
        firewallServer: errors.firewallServer,
        firewallDatabase: errors.firewallDatabase,
      },
    });
  });
});
