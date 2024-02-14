import { useMatches } from 'react-router-dom';

/* @TODO this type should be resolved in react-router-dom
 * investigate on why we have to define this. */
interface RouterHandle {
  crumb: CallableFunction;
}

export default function BreadCrumbs() {
  const matches = useMatches();
  const crumbs = matches
    // first get rid of any matches that don't have handle and crumb
    .filter((match) => Boolean((match.handle as RouterHandle)?.crumb))
    // now map them into an array of elements, passing the loader
    // data to each one
    .map((match) => (match.handle as RouterHandle).crumb(match.data));
  return (
    <>
      <ol>
        {crumbs.map((crumb, index) => (
          <li key={index}>{crumb}</li>
        ))}
      </ol>
    </>
  );
}
