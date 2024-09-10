import { getPciProjectMenu } from '../../../../container/legacy/server-sidebar/universe/public-cloud/pci-menu'

describe('pci menu items tests suite', () => {

    it('should display KMS menu entry when feature availability is true', () => {
        //given
        const features = { 'key-management-service': true };
        const getUrlFn = jest.fn().mockReturnValueOnce('kms_url');
        const projectId = 'id';
        const region = 'EU';

        // when
        const menu = getPciProjectMenu(projectId, region, features, getUrlFn);

        // then
        expect(menu).toEqual([{
            id: 'identity-security',
            title: 'Identity, Security & Operations',
            badge: 'new',
            subItems: [
                {
                    id: 'key-management-service',
                    title: 'Key Management Service',
                    href: 'kms_url',
                    badge: 'beta'
                },
            ],
        }]);
    })

    it('should not display KMS menu entry when feature availability is false', () => {
        //given
        const features = { 'key-management-service': false };
        const getUrlFn = jest.fn();
        const projectId = 'id';
        const region = 'EU';

        // when
        const menu = getPciProjectMenu(projectId, region, features, getUrlFn);

        // then
        expect(menu).toEqual([]);
        expect(getUrlFn).not.toHaveBeenCalled();
    })
});