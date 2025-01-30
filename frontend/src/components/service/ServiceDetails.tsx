import React from "react";
import ServiceDetailsClient from "./ServiceDetails.client";
import { getServiceDetails } from "./ServiceDetails.server";

const ServiceDetails = async ({ params }: { params: { id: string } }) => {
  const data = await getServiceDetails({ params });
  return <ServiceDetailsClient {...data} />;
};

export default ServiceDetails; 