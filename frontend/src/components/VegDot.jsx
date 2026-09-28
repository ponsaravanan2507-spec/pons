export default function VegDot({ veg }) { return <span className={`vd ${veg ? '' : 'nv'}`} title={veg ? 'Vegetarian' : 'Non-vegetarian'} aria-label={veg ? 'Vegetarian' : 'Non-vegetarian'} />; }
