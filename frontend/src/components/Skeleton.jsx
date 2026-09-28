export const CardSkeletons = ({ n = 6 }) => <div className="grid">{Array.from({ length: n }, (_, i) => <div key={i} className="skel" aria-hidden="true" />)}</div>;
