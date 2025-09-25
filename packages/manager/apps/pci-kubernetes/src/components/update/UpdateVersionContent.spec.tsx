import { render } from '@testing-library/react';
import { describe, it } from 'vitest';

import UpdateVersionContent from '@/components/update/UpdateVersionContent';

describe('UpdateVersionContent', () => {
  it('renders force version message when forceVersion is true', () => {
    const { getByText } = render(
      <UpdateVersionContent forceVersion clusterMinorVersion="1.18" nextMinorVersion="1.19" />,
    );
    expect(getByText(/kube_service_update_message/i)).toBeInTheDocument();
  });

  it('renders minor version update messages when forceVersion is false', () => {
    const { getByText } = render(
      <UpdateVersionContent
        forceVersion={false}
        clusterMinorVersion="1.18"
        nextMinorVersion="1.19"
      />,
    );
    expect(getByText(/kube_service_minor_version_update_message_1/i)).toBeInTheDocument();
    expect(getByText(/kube_service_minor_version_update_message_2/i)).toBeInTheDocument();
    expect(getByText(/kube_service_minor_version_update_message_3/i)).toBeInTheDocument();
    expect(getByText(/kube_service_minor_version_update_message_4/i)).toBeInTheDocument();
    expect(getByText(/kube_service_minor_version_update_message_5/i)).toBeInTheDocument();
    expect(getByText('1.19')).toBeInTheDocument();
  });

  it('renders correct next minor version in message 5', () => {
    const { getByText } = render(
      <UpdateVersionContent
        forceVersion={false}
        clusterMinorVersion="1.18"
        nextMinorVersion="1.19"
      />,
    );
    expect(getByText('1.19')).toBeInTheDocument();
  });
});
