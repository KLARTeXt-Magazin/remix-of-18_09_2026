/**
 * Kurzanleitung im Fußbereich: Seite als Web-App auf dem Homebildschirm speichern.
 */
export function HomescreenGuide() {
  return (
    <section
      id="app-installieren"
      className="homescreen-guide"
      aria-labelledby="homescreen-guide-title"
    >
      <p id="homescreen-guide-title" className="homescreen-guide__title">
        Als App speichern
      </p>

      <ol className="homescreen-guide__steps">
        <li>
          <strong>iPhone / iPad:</strong> in Safari unten auf „Teilen“ tippen, dann
          „Zum Home-Bildschirm“ wählen und bestätigen.
        </li>
        <li>
          <strong>Android:</strong> in Chrome oben rechts auf das Menü (⋮) tippen, dann
          „App installieren“ bzw. „Zum Startbildschirm hinzufügen“.
        </li>
      </ol>

      <p className="homescreen-guide__note">
        Danach öffnet sich KLARTeXt. Extras wie eine eigene App – ohne Browserleiste.
      </p>
    </section>
  );
}
