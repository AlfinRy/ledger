export function EvidenceLedgerPage() {
  return (
    <figure className="evidence evidence-ledger">
      <div className="evidence-index">
        <span>Exhibit C</span>
        <span>Partially burned ledger</span>
      </div>
      <div
        className="ledger-stock"
        role="img"
        aria-label="A partially burned ledger page showing the old telephone exchange TR-4 0119 and a smudged amount of 4,000 dollars."
      >
        <div className="ledger-heading">
          <span>Blue Orchid</span>
          <span>Private accounts</span>
        </div>
        <div className="ledger-grid">
          <span>Oct. 1</span>
          <span>Flowers, main room</span>
          <span>$42.00</span>
          <span>Oct. 2</span>
          <span>Dock delivery</span>
          <span>$185.00</span>
          <span className="ledger-focus">Oct. 3</span>
          <span className="ledger-focus handwritten">TR-4 0119</span>
          <span className="ledger-focus smudged">$4,000</span>
          <span>Oct. 4</span>
          <span>Glassware</span>
          <span>$61.20</span>
        </div>
        <p className="ledger-note">S. C. called twice. Terms refused.</p>
      </div>
      <figcaption>
        <strong>A number written before numbers were numbers.</strong>
        <span>Preserve the exchange letters when you transcribe it.</span>
      </figcaption>
    </figure>
  )
}
