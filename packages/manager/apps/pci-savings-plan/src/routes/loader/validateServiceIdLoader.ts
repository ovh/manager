import { LoaderFunctionArgs } from "react-router-dom";
import { getServices } from "@/data/api/services";

export const validateServiceIdLoader = async (args: LoaderFunctionArgs) => {
    const { projectId } = args.params;
  
    if (!projectId) {
      throw new Error('No project id found');
    }
  
    try {
      const services = await getServices(projectId);
      const serviceId = services?.[0] || null;
  
      if (!serviceId || typeof serviceId !== 'number') {
        throw new Error('No service id found');
      }
  
      return { serviceId };
    } catch (error) {
      throw new Error('No service id found');
    }
  };
  