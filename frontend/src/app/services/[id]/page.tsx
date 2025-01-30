import { getServiceDetails } from '@/components/service/ServiceDetails.server';
import ServiceDetailsClient from '@/components/service/ServiceDetails.client';
import "./style.css"
const ServicePage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const data = await getServiceDetails({ params });
  return <ServiceDetailsClient {...data} />;
};

export default ServicePage;