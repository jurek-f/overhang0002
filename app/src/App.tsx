import React, { useEffect, useState } from 'react'
import { VoiceSession } from './pages/VoiceSession'
import { PasscodeGate } from './components/PasscodeGate'

type LegalPage = 'about' | 'privacy' | 'impressum' | 'datenschutz'

const legalLinkStyle: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'inherit', opacity: 0.45, fontSize: '0.7rem',
  padding: '0.1rem 0.2rem', lineHeight: 1,
  transition: 'opacity 0.15s',
}

function App() {
  const [legalPage, setLegalPage] = useState<LegalPage | null>(null)
  const passcode = __ACCESS_PASSCODE__ as string | undefined
  const [unlocked, setUnlocked] = useState(
    !passcode || sessionStorage.getItem('vvc_unlocked') === '1'
  )

  if (!unlocked) return <PasscodeGate onUnlock={() => setUnlocked(true)} />

  return (
    <div style={{
      minHeight: '100svh',
      background: '#fff',
      color: '#111',
      fontFamily: 'system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <VoiceSession />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', paddingBottom: '1rem' }}>
        <button onClick={() => setLegalPage('about')} style={legalLinkStyle}>About</button>
        <span style={{ opacity: 0.25, fontSize: '0.7rem' }}>·</span>
        <button onClick={() => setLegalPage('privacy')} style={legalLinkStyle}>Privacy Policy</button>
        <span style={{ opacity: 0.25, fontSize: '0.7rem' }}>·</span>
        <button onClick={() => setLegalPage('datenschutz')} style={legalLinkStyle}>Datenschutz</button>
        <span style={{ opacity: 0.25, fontSize: '0.7rem' }}>·</span>
        <button onClick={() => setLegalPage('impressum')} style={legalLinkStyle}>Impressum</button>
      </div>

      {legalPage && <LegalModal page={legalPage} onClose={() => setLegalPage(null)} />}
    </div>
  )
}

function LegalModal({ page, onClose }: { page: LegalPage; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(15,18,30,0.6)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '2rem 1rem', overflowY: 'auto',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', border: '1px solid #e5e7eb',
          borderRadius: '12px', padding: '2rem 2.25rem',
          width: '100%', maxWidth: '720px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          position: 'relative',
          color: '#111',
        }}
      >
        <button
          onClick={onClose}
          title="Close"
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'transparent', border: '1px solid #e5e7eb',
            borderRadius: '6px', cursor: 'pointer', color: 'inherit',
            padding: '0.2rem 0.55rem', fontSize: '1rem', lineHeight: 1,
            opacity: 0.6,
          }}
        >✕</button>

        <div style={{ fontSize: '0.92rem', lineHeight: 1.75, color: '#111' }}>
          {page === 'about'       && <About />}
          {page === 'privacy'     && <Privacy />}
          {page === 'datenschutz' && <Datenschutz />}
          {page === 'impressum'   && <Impressum />}
        </div>
      </div>
    </div>
  )
}

const H2 = ({ id, children }: { id?: string; children: React.ReactNode }) => (
  <h2 id={id} style={{ color: '#111', marginTop: '1.75rem', marginBottom: '0.5rem' }}>{children}</h2>
)

function About() {
  useEffect(() => {
    const id = 'li-badge-script'
    if (document.getElementById(id)) return
    const script = document.createElement('script')
    script.id = id
    script.src = 'https://platform.linkedin.com/badges/js/profile.js'
    script.async = true
    script.defer = true
    document.body.appendChild(script)
  }, [])

  return (
    <>
      <h1 style={{ marginTop: 0, color: '#111' }}>About Layers</h1>

      <div style={{ marginBottom: '1.5rem' }}>
        <div
          className="badge-base LI-profile-badge"
          data-locale="en_US"
          data-size="medium"
          data-theme="light"
          data-type="VERTICAL"
          data-vanity="jurek-foellmer"
          data-version="v1"
        >
          <a
            className="badge-base__link LI-simple-link"
            href="https://de.linkedin.com/in/jurek-foellmer?trk=profile-badge"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#6366f1' }}
          >
            Jurek Föllmer
          </a>
        </div>
      </div>

      <H2>Content &amp; AI disclaimer</H2>
      <p>
        App developed by Jurek Föllmer. The content on this site is generated with the assistance of AI.
      </p>
      <p>AI-generated content:</p>
      <ul>
        <li>may be incorrect, incomplete, or misleading</li>
        <li>does not constitute scholarly, legal, or religious rulings</li>
        <li>is presented for exploration and learning</li>
        <li>is reviewed and improved over time but never guaranteed to be accurate</li>
      </ul>

      <H2>Feedback</H2>
      <p>
        If you find content that is clearly wrong or misleading, please{' '}
        <a href="mailto:jurek-f@hotmail.de" style={{ color: 'var(--accent)' }}>contact us</a>.
        Human review improves the quality of the graph over time.
      </p>
    </>
  )
}

function Privacy() {
  return (
    <>
      <h1 style={{ marginTop: 0, color: '#111' }}>Privacy Policy</h1>
      <p style={{ opacity: 0.6, fontSize: '0.85rem' }}>Last updated: 27 May 2026</p>

      <H2>1. Controller</H2>
      <p>
        This application ("Layers") is a static website operated by Jurek Föllmer. Contact
        details are listed in the Impressum. No user accounts, forms, or any voluntary submission
        of personal data are offered or collected by the operator.
      </p>

      <H2>2. What data is processed</H2>
      <p>
        The operator does not set cookies, does not use analytics or tracking tools, and does
        not collect personal data directly.
      </p>
      <p>
        When you visit this site, the hosting infrastructure automatically records standard
        server log data:
      </p>
      <ul>
        <li>IP address</li>
        <li>Date and time of the request</li>
        <li>URL requested</li>
        <li>HTTP referrer</li>
        <li>Browser and operating system identifiers</li>
        <li>Response size and HTTP status code</li>
      </ul>
      <p>
        This data is processed by the hosting provider (see section 3) for infrastructure and
        security purposes. The operator has no access to and retains no personal data.
      </p>

      <H2>3. Hosting — Vercel Inc.</H2>
      <p>
        This site is hosted by{' '}
        <strong>Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA</strong>.
        Vercel acts as a data processor within the meaning of Art. 28 GDPR and processes
        server log data on behalf of the operator solely to provide and secure the hosting
        service.
      </p>
      <p>Further information on Vercel's data processing practices:</p>
      <ul>
        <li>
          <a href="https://vercel.com/legal/privacy-policy" target="_blank"
             rel="noopener noreferrer" style={{ color: '#6366f1' }}>
            vercel.com/legal/privacy-policy
          </a>
        </li>
        <li>
          <a href="https://vercel.com/legal/dpa" target="_blank"
             rel="noopener noreferrer" style={{ color: '#6366f1' }}>
            vercel.com/legal/dpa
          </a>{' '}(Data Processing Agreement)
        </li>
      </ul>
      <p>
        <strong>Legal basis:</strong> Art. 6(1)(f) GDPR — legitimate interest in the secure
        and functional delivery of this website.
      </p>
      <p>
        <strong>Retention:</strong> Vercel retains log data in accordance with their own
        privacy policy. The operator retains no personal data.
      </p>

      <H2>4. International data transfers</H2>
      <p>
        Vercel Inc. is based in the United States. The transfer of server log data to the USA
        is lawful on the basis of Vercel's certification under the{' '}
        <strong>EU–US Data Privacy Framework (DPF)</strong>, for which the European Commission
        issued an adequacy decision on 10 July 2023. You can verify Vercel's certification at{' '}
        <a href="https://www.dataprivacyframework.gov" target="_blank"
           rel="noopener noreferrer" style={{ color: '#6366f1' }}>
          dataprivacyframework.gov
        </a>.
      </p>

      <H2>5. Your rights</H2>
      <p>Under the GDPR you have the following rights with respect to personal data concerning you:</p>
      <ul>
        <li><strong>Right of access</strong> (Art. 15 GDPR)</li>
        <li><strong>Right to rectification</strong> (Art. 16 GDPR)</li>
        <li><strong>Right to erasure</strong> (Art. 17 GDPR)</li>
        <li><strong>Right to restriction of processing</strong> (Art. 18 GDPR)</li>
        <li><strong>Right to data portability</strong> (Art. 20 GDPR)</li>
        <li><strong>Right to object</strong> to processing based on legitimate interests (Art. 21 GDPR)</li>
        <li>
          <strong>Right to lodge a complaint</strong> with a supervisory authority. In Germany,
          the competent authority is the{' '}
          <a href="https://www.bfdi.bund.de" target="_blank" rel="noopener noreferrer"
             style={{ color: '#6366f1' }}>
            Bundesbeauftragte für den Datenschutz und die Informationsfreiheit (BfDI)
          </a>.
        </li>
      </ul>
      <p>
        To exercise your rights, please contact:{' '}
        <a href="mailto:jurek-f@hotmail.de" style={{ color: '#6366f1' }}>jurek-f@hotmail.de</a>.
      </p>

      <H2>6. Changes</H2>
      <p>
        This policy may be updated to reflect changes in hosting arrangements or applicable law.
        The date at the top indicates the version currently in effect.
      </p>
    </>
  )
}

function Datenschutz() {
  const lnk = (href: string, label: string) => (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1', wordBreak: 'break-all' }}>{label}</a>
  )
  const mail = (addr: string) => (
    <a href={`mailto:${addr}`} style={{ color: '#6366f1' }}>{addr}</a>
  )

  return (
    <>
      <h1 style={{ marginTop: 0, color: '#111' }}>Datenschutzerklärung</h1>
      <p style={{ opacity: 0.6, fontSize: '0.85rem' }}>Stand: 27. Mai 2026</p>

      <H2 id="ds-verantwortlicher">1. Verantwortlicher</H2>
      <p>
        Jurek Föllmer<br />
        E-Mail: {mail('jurek-f@hotmail.de')}
      </p>
      <p>
        Diese Website wird als statisches Webangebot ohne Nutzerverwaltung, Formulare oder
        eigene Tracking-Mechanismen betrieben.
      </p>

      <H2 id="ds-daten">2. Welche Daten werden verarbeitet?</H2>
      <p>
        Wir selbst erheben und speichern <strong>keine personenbezogenen Daten</strong> der
        Besucher dieser Website. Es werden insbesondere:
      </p>
      <ul>
        <li>keine Cookies durch uns gesetzt,</li>
        <li>keine Nutzerkonten angelegt,</li>
        <li>keine Tracking-Pixel oder Analysetools eingesetzt,</li>
        <li>keine Kontaktformulare oder Newsletter angeboten.</li>
      </ul>
      <p>
        Beim Abrufen der Website werden jedoch durch unseren Hosting-Dienstleister
        (Vercel Inc., s. Abschnitt 3) automatisch Server-Zugriffsprotokolle erstellt,
        die u. a. folgende Daten enthalten können:
      </p>
      <ul>
        <li>IP-Adresse des zugreifenden Geräts</li>
        <li>Datum und Uhrzeit des Zugriffs</li>
        <li>Aufgerufene URL und Referrer-URL</li>
        <li>Browsertyp und -version, Betriebssystem</li>
        <li>Übertragene Datenmenge und HTTP-Statuscode</li>
      </ul>
      <p>
        Diese Daten werden ausschließlich zur Sicherstellung des stabilen und sicheren Betriebs
        der Website verarbeitet und nicht mit anderen Datenquellen zusammengeführt.
      </p>

      <H2 id="ds-vercel">3. Hosting: Vercel Inc.</H2>
      <p>
        Diese Website wird gehostet von:<br />
        <strong>Vercel Inc.</strong><br />
        340 S Lemon Ave #4133, Walnut, CA 91789, USA
      </p>
      <p>
        Vercel verarbeitet die oben genannten Server-Zugriffsdaten als unser
        Auftragsverarbeiter im Sinne von Art. 28 DSGVO. Wir haben mit Vercel einen
        Auftragsverarbeitungsvertrag (Data Processing Agreement, DPA) geschlossen.
      </p>
      <ul>
        <li>Datenschutzerklärung Vercel: {lnk('https://vercel.com/legal/privacy-policy', 'vercel.com/legal/privacy-policy')}</li>
        <li>Auftragsverarbeitungsvertrag (DPA): {lnk('https://vercel.com/legal/dpa', 'vercel.com/legal/dpa')}</li>
      </ul>
      <p>
        <strong>Rechtsgrundlage:</strong> Die Verarbeitung erfolgt auf Grundlage unserer
        berechtigten Interessen an einer sicheren und funktionsfähigen Bereitstellung des
        Webangebots (Art. 6 Abs. 1 S. 1 lit. f DSGVO).
      </p>
      <p>
        <strong>Speicherdauer:</strong> Vercel speichert Protokolldaten gemäß seiner eigenen
        Datenschutzrichtlinie. Wir selbst speichern keine Protokolldaten.
      </p>

      <H2 id="ds-transfer">4. Internationale Datentransfers</H2>
      <p>
        Vercel Inc. hat seinen Sitz in den USA. Die Übermittlung von Daten in die USA
        ist durch die Zertifizierung von Vercel unter dem EU-US-Datenschutzrahmen
        (Data Privacy Framework, DPF) abgesichert. Der DPF wurde durch den
        Angemessenheitsbeschluss der EU-Kommission vom 10. Juli 2023 anerkannt.
      </p>
      <p>
        Weitere Informationen zum DPF und zur Zertifizierung von Vercel:
        {' '}{lnk('https://www.dataprivacyframework.gov/', 'dataprivacyframework.gov')}
      </p>

      <H2 id="ds-rechte">5. Ihre Rechte (Art. 15–21 DSGVO)</H2>
      <p>
        Soweit personenbezogene Daten Sie betreffend verarbeitet werden, stehen Ihnen
        folgende Rechte zu:
      </p>
      <ul>
        <li><strong>Auskunftsrecht</strong> (Art. 15 DSGVO)</li>
        <li><strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO)</li>
        <li><strong>Recht auf Löschung</strong> (Art. 17 DSGVO)</li>
        <li><strong>Recht auf Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)</li>
        <li><strong>Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li>
        <li>
          <strong>Widerspruchsrecht</strong> (Art. 21 DSGVO) – Sie haben das Recht,
          der auf berechtigten Interessen gestützten Verarbeitung jederzeit zu widersprechen.
        </li>
        <li>
          <strong>Beschwerderecht</strong> bei einer Aufsichtsbehörde, insbesondere der für
          Ihren Wohnort oder unseren Sitz zuständigen Behörde, z. B. dem{' '}
          {lnk('https://www.bfdi.bund.de', 'Bundesbeauftragten für den Datenschutz und die Informationsfreiheit (BfDI)')}.
        </li>
      </ul>
      <p>
        Zur Geltendmachung Ihrer Rechte wenden Sie sich bitte an: {mail('jurek-f@hotmail.de')}
      </p>

      <H2 id="ds-aenderungen">6. Änderungen dieser Datenschutzerklärung</H2>
      <p>
        Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen, insbesondere
        bei Änderungen des Hostinganbieters oder der eingesetzten Dienste. Die aktuelle
        Fassung ist stets unter diesem Link abrufbar.
      </p>
    </>
  )
}

function Impressum() {
  return (
    <>
      <h1 style={{ marginTop: 0, color: '#111' }}>Impressum</h1>
      <p>Angaben gemäß § 5 DDG</p>

      <p>
        <strong>Vertreten durch:</strong><br />
        Jurek Föllmer
      </p>

      <p>
        <strong>Kontakt:</strong><br />
        Telefon: 0177-3959119<br />
        E-Mail: <a href="mailto:jurek-f@hotmail.de" style={{ color: '#6366f1' }}>jurek-f@hotmail.de</a>
      </p>

      <p>
        <strong>Verbraucherstreitbeilegung / Universalschlichtungsstelle</strong><br />
        Wir nehmen nicht an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
        teil und sind dazu auch nicht verpflichtet.
      </p>

      <p><strong>Haftungsausschluss</strong></p>

      <p>
        <strong>Haftung für Inhalte</strong><br />
        Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
        Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
        Als Diensteanbieter sind wir gemäß § 7 Abs.1 DDG für eigene Inhalte auf diesen Seiten
        nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als
        Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
        Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
        Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
        Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine
        diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten
        Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen
        werden wir diese Inhalte umgehend entfernen.
      </p>

      <p>
        <strong>Haftung für Links</strong><br />
        Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen
        Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr
        übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
        Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
        Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum
        Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der
        verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
        zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend
        entfernen.
      </p>
    </>
  )
}

export default App
