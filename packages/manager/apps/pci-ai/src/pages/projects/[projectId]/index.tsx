import { redirect } from "react-router-dom";

//if we are at the route /projects/projectId, redirect to the next route
export const Loader = () => {
    return redirect('app');
}