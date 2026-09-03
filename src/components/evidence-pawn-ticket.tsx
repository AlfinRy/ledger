import { Scissors } from 'lucide-react'

export function EvidencePawnTicket() {
  return (
    <figure className="evidence evidence-ticket">
      <div className="evidence-index">
        <span>Exhibit B</span>
        <span>Pawn ticket stub</span>
      </div>
      <div
        className="ticket-stock"
        role="img"
        aria-label="A pawn ticket stub from Kessler and Sons numbered PT-771 for one gold cigarette case."
      >
        <div className="ticket-cut" aria-hidden="true">
          <Scissors size={15} strokeWidth={1.5} />
        </div>
        <p className="ticket-shop">Kessler &amp; Sons</p>
        <p className="ticket-kind">Pawnbrokers · Loans on valuables</p>
        <div className="ticket-rule" />
        <dl>
          <div>
            <dt>Ticket</dt>
            <dd>PT-771</dd>
          </div>
          <div>
            <dt>Article</dt>
            <dd>Gold cigarette case</dd>
          </div>
          <div>
            <dt>Received</dt>
            <dd>October 4, 1947</dd>
          </div>
        </dl>
        <p className="ticket-fineprint">
          This ticket must be presented when redeeming the article.
        </p>
      </div>
      <figcaption>
        <strong>A small number with a long trail.</strong>
        <span>Give the archive the complete ticket number.</span>
      </figcaption>
    </figure>
  )
}
