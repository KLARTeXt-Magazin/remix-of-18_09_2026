// =======================================================
// ROUTE: AUSGABE 01
// Zweck:
// • Startseite der KLARTeXt. Extras
// • Audio „Zeit für Dich“
// • Zusatzmaterial zur Ausgabe 01
//
// Später ändern:
// • Titel / Beschreibung → Hero
// • Audio-Datei → <audio src>
// • Bild → coverImageNeu
// • PDF → Download-Link
//
// Nicht unnötig ändern:
// • Audio-Logik
// • Scroll-/Header-Logik
// • Accessibility-Attribute
// =======================================================

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Download,
  Menu,
  Play,
} from "lucide-react";

import coverImageNeu from "@/assets/cover-zeit-collage-v3.jpg";
import { LiquidGlass } from "@/components/liquid-glass";
import { InstallAction } from "@/components/install-action";
import { ListeningMode } from "@/components/listening-mode";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";


// =======================================================
// SEITEN-METADATEN
// Zweck:
// • Browser-Titel
// • Beschreibung für Suchmaschinen
// • Vorschau beim Teilen
//
// Später ändern:
// • Titel / description / OG-Texte bei neuer Ausgabe
// =======================================================

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "KLARTeXt. Extras zu Ausgabe 01: Warum Ehrlichkeit Mut braucht",
      },
      {
        name: "description",
        content:
          "Eine Achtsamkeitsübung der ersten Ausgabe von KLARTeXt.: Zeit für Dich",
      },
      {
        property: "og:title",
        content:
          "KLARTeXt. – Warum Ehrlichkeit Mut braucht",
      },
      {
        property: "og:description",
        content:
          "Die Audio-Übung „Zeit für dich“ zur ersten KLARTeXt.-Ausgabe.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),
  component: Index,
});


// =======================================================
// AUSGABEN-NAVIGATION
// Zweck:
// • Inhalte für das seitliche Ausgaben-Menü
//
// Später ändern:
// • Neue Ausgabe hier ergänzen
// • title / subtitle / eyebrow anpassen
// • to = Route der jeweiligen Ausgabe
// =======================================================

const issues: {
  eyebrow: string;
  title: string;
  subtitle: string;
  to?: "/" | "/lichtblicke";
}[] = [
  {
    eyebrow: "Ausgabe 02 · 12/26",
    title: "Lichtblicke",
    subtitle: "Momente zum Innehalten · 4 Audios",
    to: "/lichtblicke",
  },
  {
    eyebrow: "Ausgabe 01 · 08/26",
    title: "Warum Ehrlichkeit Mut braucht",
    subtitle: "Zwischen Anpassung, Angst und Wahrheit",
    to: "/",
  },
  {
    eyebrow: "Ausgabe 03 · 2027",
    title: "Demnächst",
    subtitle: "Neue Themen in Vorbereitung",
  },
];


// =======================================================
// HAUPTKOMPONENTE
// Zweck:
// • gesamte Ausgabe-01-Seite
// =======================================================

function Index() {
  // -----------------------------------------------------
  // AUDIO-ZUSTAND
  // • steuert den Player
  // • speichert Position und Länge
  // -----------------------------------------------------

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [listeningOpen, setListeningOpen] = useState(false);

  // -----------------------------------------------------
  // HEADER / SCROLL-ZUSTAND
  // • Header bekommt beim Scrollen den Glass-Effekt
  // • Hero wird kompakter
  // -----------------------------------------------------

  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const update = () =>
      setHasScrolled(window.scrollY > 24);

    update();

    window.addEventListener(
      "scroll",
      update,
      { passive: true },
    );

    return () =>
      window.removeEventListener(
        "scroll",
        update,
      );
  }, []);


  // =====================================================
  // AUDIO-EVENTS
  // Zweck:
  // • hält React und Audio-Element synchron
  //
  // Nicht ändern, wenn nur Inhalt / Design geändert wird.
  // =====================================================

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const updateTime = () =>
      setCurrentTime(audio.currentTime);

    const updateDuration = () =>
      setDuration(
        Number.isFinite(audio.duration)
          ? audio.duration
          : 0,
      );

    const stop = () =>
      setIsPlaying(false);

    audio.addEventListener(
      "timeupdate",
      updateTime,
    );

    audio.addEventListener(
      "loadedmetadata",
      updateDuration,
    );

    audio.addEventListener(
      "durationchange",
      updateDuration,
    );

    audio.addEventListener(
      "ended",
      stop,
    );

    return () => {
      audio.removeEventListener(
        "timeupdate",
        updateTime,
      );

      audio.removeEventListener(
        "loadedmetadata",
        updateDuration,
      );

      audio.removeEventListener(
        "durationchange",
        updateDuration,
      );

      audio.removeEventListener(
        "ended",
        stop,
      );
    };
  }, []);


  // =====================================================
  // PLAY / PAUSE
  // Zweck:
  // • startet oder pausiert das Audio
  //
  // Später ändern:
  // • normalerweise nichts
  // =====================================================

  const togglePlay = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      setListeningOpen(true);
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const openListeningMode = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      await togglePlay();
      return;
    }

    setListeningOpen(true);
  };


  // =====================================================
  // AUDIO SPRINGEN
  // Zweck:
  // • 15 Sekunden zurück / vor
  // =====================================================

  const skip = (seconds: number) => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.currentTime = Math.max(
      0,
      Math.min(
        audio.duration || 0,
        audio.currentTime + seconds,
      ),
    );
  };


  return (
    <>
      {/* =================================================
          ACCESSIBILITY
          • Direkt zum eigentlichen Seiteninhalt springen
         ================================================= */}

      <a
        className="skip-link"
        href="#inhalt"
      >
        Zum Inhalt springen
      </a>


      <main
        id="inhalt"
        className="min-h-screen overflow-hidden bg-background font-body text-foreground"
      >

        {/* =================================================
            AUDIO-DATEI
            • zentrale Audioquelle für Ausgabe 01
            • nur src ändern, wenn neue Audiodatei kommt
           ================================================= */}

        <audio
          ref={audioRef}
          src="/audio/2026-q3_extra01.m4a"
          preload="metadata"
        />


        {/* =================================================
            HERO
            Zweck:
            • Ausgabe vorstellen
            • Titel der Ausgabe
            • wird beim Scrollen kompakter

            Später ändern:
            • Ausgabe-Nummer
            • Titel
           ================================================= */}

        <section
          className={`hero-presentation mx-auto w-full max-w-[430px] px-5 pb-12 sm:px-7 ${
            hasScrolled || isPlaying
              ? "is-compact"
              : ""
          }`}
        >

          {/* =================================================
              FIXED HEADER
              • Logo
              • Ausgaben-Menü
             ================================================= */}

          <header
            className={`floating-site-header fixed inset-x-0 top-0 z-50 ${
              hasScrolled
                ? "is-scrolled"
                : ""
            }`}
          >
            <div className="site-header-inner mx-auto grid w-full max-w-[430px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 sm:px-7">

            {/* Magazin-Logo */}
            <div className="min-w-0">
              <a
                href="https://www.magazin-klartext.de/"
                target="_blank"
                rel="noreferrer"
                className="block w-fit"
                aria-label="Zum KLARTeXt. Magazin"
              >
                <img
                  src="/logo.png"
                  alt="KLARTeXt."
                  className="h-10 w-auto"
                />
              </a>
            </div>


            {/* Ausgaben-Menü */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="liquid-glass-button size-10 shrink-0 rounded-full"
                  aria-label="Ausgaben öffnen"
                >
                  <Menu
                    className="size-[18px]"
                    strokeWidth={1.5}
                  />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="issue-sheet w-full border-0 bg-transparent p-0 shadow-none sm:w-[92%] sm:max-w-sm sm:p-3"
              >
                <LiquidGlass
                  className="issue-panel h-full w-full overflow-y-auto rounded-none sm:rounded-[2rem]"
                  intensity="strong"
                >
                  <div className="px-7 py-10">

                    <SheetHeader className="mt-8 text-left">
                      <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-foreground/65">
                        KLARTeXt. Extras
                      </p>

                      <SheetTitle className="font-display text-3xl font-semibold text-foreground">
                        Alle Ausgaben
                      </SheetTitle>

                      <SheetDescription className="font-body text-foreground/65">
                        Extras zu den Ausgaben.
                      </SheetDescription>
                    </SheetHeader>


                    {/* Ausgaben-Liste */}
                    <nav
                      className="mt-10"
                      aria-label="Ausgaben"
                    >
                      {issues.map(
                        (issue, index) => {
                          const content = (
                            <>
                              <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-foreground/60">
                                {issue.eyebrow}
                              </span>

                              <span className="mt-2 block font-display text-[2rem] font-semibold leading-[1.02] tracking-[-0.025em] text-foreground">
                                {issue.title}
                              </span>

                              <span className="mt-2 block max-w-[17rem] text-sm leading-6 text-foreground/65">
                                {issue.subtitle}
                              </span>
                            </>
                          );

                          return issue.to ? (
                            <SheetClose
                              asChild
                              key={issue.title}
                            >
                              <Link
                                to={issue.to}
                                className={`issue-entry ${
                                  index === 1
                                    ? "issue-entry-current"
                                    : ""
                                }`}
                              >
                                {content}
                              </Link>
                            </SheetClose>
                          ) : (
                            <div
                              key={issue.title}
                              className="issue-entry opacity-40"
                            >
                              {content}
                            </div>
                          );
                        },
                      )}
                    </nav>


                    {/* Link zurück zum Hauptmagazin */}
                    <a
                      href="https://www.magazin-klartext.de/"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-8 inline-flex min-h-[44px] items-center text-sm font-medium text-foreground underline underline-offset-4"
                    >
                      Zum Magazin
                    </a>

                    <InstallAction />

                  </div>
                </LiquidGlass>
              </SheetContent>
            </Sheet>
            </div>

          </header>


          {/* Hero-Titel */}
          <div className="mt-4">
            <p className="text-[10px] font-medium uppercase text-muted-foreground">
              Ausgabe 01 · 08/26
            </p>

            <h1 className="hero-title mt-3 max-w-[340px] font-display text-[clamp(2.7rem,13vw,4rem)] font-semibold leading-[0.93] tracking-[-0.02em]">
              Warum Ehrlichkeit Mut braucht
            </h1>
          </div>

        </section>


        {/* =================================================
            AUDIO-BEREICH
            • mineralblauer Abschnitt
            • enthält die eigentliche Audiokachel
            • Kachel selbst bleibt neutral/gläsern

            Später ändern:
            • Audio-Bild
            • Audio-Titel
            • Zitat
            • Audio-Datei oben bei <audio>
           ================================================= */}

<section
  className="audio-band audio-band--ausgabe-1"

  aria-label="Audio"
>
          <div className="mx-auto w-full max-w-[430px]">

            <section
              className="audio-player-card is-active relative overflow-hidden rounded-[1.35rem] border p-3"
              aria-label="Audio-Player"
            >

              {/* Audio-Cover */}
              <div className="audio-cover-layout relative aspect-[4/3] overflow-hidden rounded-[0.95rem]">
                <img
                  src={coverImageNeu}
                  alt="Editoriale Collage aus weinrotem Papier, rosafarbenem Organza, feinen Blüten und blauem Glas"
                  width={1024}
                  height={1024}
                  className="audio-cover-image h-full w-full object-cover"
                />

                <span className="cover-wordmark" aria-hidden="true">
                  ZEIT FÜR DICH.
                </span>

                <span className="audio-cover-badge absolute left-4 top-4 rounded-full border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] shadow-sm backdrop-blur-md">
                  Auszeit
                </span>
              </div>


              {/* Audio-Informationen */}
              <div className="px-3 pb-3 pt-5">

                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
                  <div className="min-w-0">

                    <h2 className="truncate font-display text-2xl font-medium">
                      Zeit für Dich
                    </h2>

                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      „Du musst nicht immer stark sein."
                    </p>

                  </div>
                </div>


                <div className="mt-6">
                  <Button
                    className="min-h-12 w-full justify-center gap-2 rounded-full bg-primary px-5 text-primary-foreground shadow-play hover:bg-primary/90"
                    onClick={openListeningMode}
                    aria-label={
                      isPlaying
                        ? 'Hörmodus für „Zeit für Dich“ öffnen'
                        : '„Zeit für Dich“ anhören'
                    }
                  >
                    <Play className="size-4 fill-current" aria-hidden="true" />
                    {isPlaying ? "Hörmodus öffnen" : "Anhören"}
                  </Button>

                  {isPlaying ? (
                    <p className="mt-3 text-center text-xs font-medium text-muted-foreground" aria-live="polite">
                      Läuft gerade
                    </p>
                  ) : null}
                </div>

              </div>
            </section>


            <p className="section-cue-badge mx-auto mt-8 w-fit text-center text-[10px] font-semibold uppercase tracking-[0.12em]">
              Weiter zum Begleitimpuls
            </p>

          </div>
        </section>

        <ListeningMode
          open={listeningOpen}
          onOpenChange={setListeningOpen}
          title="Zeit für Dich"
          eyebrow="Auszeit · Ausgabe 01"
          cover={coverImageNeu}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onTogglePlay={togglePlay}
          onSkip={skip}
          onSeek={(seconds) => {
            const audio = audioRef.current;
            if (!audio) return;
            audio.currentTime = seconds;
            setCurrentTime(seconds);
          }}
          tone="wine"
        />


        {/* =================================================
            BEGLEITTEXT / IMPULS
            • erklärt den Inhalt der Audio
            • enthält das PDF

            Später ändern:
            • Zitat
            • Beschreibung
            • PDF-Datei
           ================================================= */}

        <section className="companion-band companion-band--ausgabe-1 px-6 py-24">
          <div className="companion-inner mx-auto max-w-[430px] border-l-4 pl-5">

            <p className="text-[10px] font-medium uppercase text-muted-foreground">
              Ein Moment für dich
            </p>

            <h2 className="mt-5 font-display text-4xl font-medium leading-tight">
              „Wie geht es mir eigentlich gerade wirklich, nicht, wie es sein sollte?“
            </h2>

            <p className="mt-7 max-w-sm text-sm leading-7 text-muted-foreground">
              Das Audio-Extra der ersten Ausgabe ist eine kurze Pause, wenn gerade viel im Kopf los ist. Ein paar Minuten, in denen es einmal nicht darum geht, etwas zu schaffen oder zu lösen, sondern wahrzunehmen, wie es dir gerade geht.
            </p>

            <Button
              asChild
              variant="outline"
              className="mt-9 h-12 rounded-full border-border bg-surface px-5 shadow-none"
            >
              <a
                href="/pdf/2026-q3_Auszeit01.pdf"
                target="_blank"
                rel="noreferrer"
              >
                <Download className="size-4" />
                Impuls zum Downloaden
              </a>
            </Button>

          </div>
        </section>


        {/* =================================================
            FOOTER
            • Marke
            • Impressum
            • Datenschutz
           ================================================= */}

        <footer className="bg-primary px-6 py-12 text-primary-foreground">
          <div className="mx-auto flex max-w-[430px] items-end justify-between gap-6">

            <div>
              <p className="font-display text-lg font-semibold">
                KLARTeXt.
              </p>

              <p className="mt-1 text-[11px] uppercase tracking-[0.1em] opacity-80">
                Echt. Mutig. Klar.
              </p>
            </div>

            <nav
              className="flex gap-4 text-xs"
              aria-label="Rechtliches"
            >
              <a
                className="inline-flex min-h-[44px] items-end underline underline-offset-4"
                href="https://www.magazin-klartext.de/impressum/"
                target="_blank"
                rel="noreferrer"
              >
                Impressum
              </a>

              <a
                className="inline-flex min-h-[44px] items-end underline underline-offset-4"
                href="https://www.magazin-klartext.de/datenschutzerklaerung/"
                target="_blank"
                rel="noreferrer"
              >
                Datenschutz
              </a>
            </nav>

          </div>
        </footer>

      </main>
    </>
  );
}
