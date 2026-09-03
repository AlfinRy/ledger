export function EvidencePhoto() {
  return (
    <figure className="evidence evidence-photo">
      <div className="evidence-index">
        <span>Exhibit A</span>
        <span>Recovered photograph</span>
      </div>
      <div className="photo-mount">
        <svg
          className="photo-image"
          viewBox="0 0 800 520"
          role="img"
          aria-label="A torn black-and-white photograph of Vic Marlowe seated with a woman at a nightclub table. A matchbook reading The Sable Room lies near them. Oct 3 is written in pencil on the back."
        >
          <defs>
            <linearGradient id="night-wall" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#090b0d" />
              <stop offset="0.56" stopColor="#34383a" />
              <stop offset="1" stopColor="#111416" />
            </linearGradient>
            <radialGradient id="table-light" cx="50%" cy="42%" r="48%">
              <stop offset="0" stopColor="#d6d2c6" stopOpacity="0.84" />
              <stop offset="0.6" stopColor="#656564" stopOpacity="0.3" />
              <stop offset="1" stopColor="#0d0f10" stopOpacity="0" />
            </radialGradient>
            <filter id="photo-grain">
              <feTurbulence baseFrequency="0.9" numOctaves="3" seed="47" type="fractalNoise" />
              <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 .16 0" />
            </filter>
          </defs>
          <rect width="800" height="520" fill="url(#night-wall)" />
          <ellipse cx="410" cy="230" rx="360" ry="245" fill="url(#table-light)" />
          <path d="M0 80 800 12v77L0 170Z" fill="#050708" opacity=".72" />
          <path d="M625 0h175v520H704c-14-130-28-258-79-520Z" fill="#030405" opacity=".78" />
          <ellipse cx="385" cy="406" rx="260" ry="66" fill="#090b0c" />
          <path d="M155 402c14-103 44-169 105-186 58 16 91 86 99 186Z" fill="#0a0c0d" />
          <ellipse cx="267" cy="180" rx="57" ry="70" fill="#171a1b" />
          <path d="M237 115c17-33 68-41 94-5l-7 29-91 4Z" fill="#050607" />
          <path d="M455 402c11-111 45-182 105-195 68 20 92 92 90 195Z" fill="#151819" />
          <ellipse cx="558" cy="170" rx="51" ry="66" fill="#777978" />
          <path d="M508 166c2-66 28-100 72-86 35 12 48 63 24 119-11-48-47-44-96-33Z" fill="#0b0d0e" />
          <path d="m326 386 119-18 42 47-169 18Z" fill="#bdb9ad" />
          <rect x="354" y="354" width="112" height="67" rx="2" fill="#d9d4c6" transform="rotate(-7 354 354)" />
          <text x="370" y="381" fill="#17191a" fontFamily="monospace" fontSize="13" letterSpacing="2" transform="rotate(-7 354 354)">
            THE SABLE
          </text>
          <text x="381" y="399" fill="#17191a" fontFamily="monospace" fontSize="13" letterSpacing="2" transform="rotate(-7 354 354)">
            ROOM
          </text>
          <rect width="800" height="520" filter="url(#photo-grain)" opacity=".3" />
          <path d="m743 0 57 0v520h-34l-18-41 20-42-17-36 19-49-23-48 20-53-19-48 21-46-18-41 20-47Z" fill="#e5dfd0" />
        </svg>
        <span className="photo-date" aria-hidden="true">
          Oct 3
        </span>
      </div>
      <figcaption>
        <strong>A night out, cut short.</strong>
        <span>Look for a venue name and the date pencilled on the reverse.</span>
      </figcaption>
    </figure>
  )
}
