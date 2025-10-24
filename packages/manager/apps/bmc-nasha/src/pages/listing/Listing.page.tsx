import {
  BaseLayout,
  Button,
  Message,
  MessageBody,
  MESSAGE_COLOR,
} from '@ovh-ux/muk';

export default function ListingPage() {
  return (
    <BaseLayout header={{ title: 'Nasha Services' }}>
      <div className="space-y-6">
        <Message color={MESSAGE_COLOR.information}>
          <MessageBody>
            Welcome to Nasha Services. This application is ready for
            development.
          </MessageBody>
        </Message>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Nasha Services
            </h2>
            <p className="text-gray-600 mb-6">
              This is the main listing page for Nasha services. Ready to add
              features.
            </p>
            <Button variant="default">Get Started</Button>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
