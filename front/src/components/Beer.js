const Beer = ({ beer, toggleProduced }) => {
  const label = beer.producedNow
    ? 'Mark as not currently produced' : 'Mark as produced now'

  return (
    <li className="beer">
      {beer.name}
      <button onClick={toggleProduced}>{label}</button>
    </li>
  )
}

export default Beer