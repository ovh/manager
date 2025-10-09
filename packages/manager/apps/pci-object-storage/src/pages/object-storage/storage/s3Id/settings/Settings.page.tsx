import { Card, CardContent, CardHeader } from '@datatr-ux/uxlib';
import { Outlet } from 'react-router-dom';

const Settings = () => {
  return (
    <>
      <h2>Settings</h2>
      <Card>
        <CardHeader>Versionning</CardHeader>
      </Card>
      <Card>
        <CardHeader>Object Lock</CardHeader>
      </Card>
      <Card>
        <CardHeader>Static website hosting</CardHeader>
        <CardContent>
          <p>Coming soon</p>
          <a href="https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-static-website?id=kb_article_view&sysparm_article=KB0058095">
            Doc
          </a>
        </CardContent>
      </Card>
      <Outlet />
    </>
  );
};

export default Settings;
