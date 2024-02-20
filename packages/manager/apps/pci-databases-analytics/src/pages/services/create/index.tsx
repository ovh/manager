import LegalMentions from '@/pages/_components/legalMentions';

export function breadcrumb() {
  return 'New';
}

const Service = () => {
  return (
    <>
      <p>Create a Service</p>
      <LegalMentions showRedisMessage={true} className="mt-4" />
    </>
  );
};

export default Service;
