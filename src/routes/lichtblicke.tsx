// =======================================================
// ROUTE: AUSGABE 02 – LICHTBLICKE
// Zweck:
// • Audio-Archiv für Ausgabe 02
// • mehrere Audio-Kacheln als horizontales Carousel
// • zusätzliche Informationen unterhalb des Carousels
// • PMR-Übung als eigener Inhaltsbereich
//
// Später ändern:
// • Audio-Inhalte → tracks
// • Bilder → imports / cover
// • Veröffentlichungsdatum → issues / unlockAt
// • PMR-Text → PMR-Sektion weiter unten
//
// Nicht unnötig ändern:
// • Carousel-Logik
// • IntersectionObserver
// • Hash-Navigation
// • Active-State
// =======================================================

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Download, Menu } from "lucide-react";

import coverMoment from "../assets/cover-pmr-collage-v3.jpg";
import coverNikolausNeu from "../assets/cover-nikolaus-collage-v3.jpg";
import coverGrussNeu from "../assets/cover-heiligabend-collage-v3.jpg";
import coverMomentNeu from "../assets/cover-moment-collage-v3.jpg";

import {
  AudioCard,
  type AudioTrack,
} from "@/components/audio-card";

import { LiquidGlass } from "@/components/liquid-glass";
import { InstallAction } from "@/components/install-action";
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
// • Browser
// • Suchmaschinen
// • Social-Media-Vorschau
//
// Später ändern:
// • Titel und Beschreibung bei einer neuen Ausgabe
// =======================================================

export const Route = createFileRoute("/lichtblicke")({
  head: () => ({
    meta: [
      {
        title:
          "KLARTeXt. Extras zu Ausgabe 02: Lichtblicke",
      },
      {
        name: "description",
        content:
          "Vier Audio-Impulse der zweiten KLARTeXt.-Ausgabe: Momente zum Innehalten und eine kurze Entspannungsübung.",
      },
      {
        property: "og:title",
        content:
          "KLARTeXt. – Lichtblicke",
      },
      {
        property: "og:description",
        content:
          "Vier Audio-Momente zum Innehalten und Entspannen – dein Extra zur zweiten KLARTeXt.-Ausgabe.",
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
  component: Lichtblicke,
});


// =======================================================
// AUSGABEN-NAVIGATION
// Zweck:
// • Inhalte des Ausgaben-Menüs
//
// Bei neuer Ausgabe:
// • neuen Eintrag ergänzen
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
// FREISCHALTUNG
// Zweck:
// • momentan alle Audios direkt sichtbar
//
// Später ändern:
// • false → Datums-Freischaltung aktiv
// • true → alles sofort verfügbar
// =======================================================

const PREVIEW_UNLOCKED = true;


// =======================================================
// AUDIO-INHALTE
// Zweck:
// • zentrale Datenquelle für alle Audiokacheln
//
// Hier werden normalerweise Inhalte gepflegt.
//
// Pro Track:
// • id       = interne ID / Hash-Link
// • eyebrow  = kleine Kategorie / Datum
// • title    = Titel
// • quote    = Zitat unter dem Carousel
// • note     = Zusatztext
// • cover    = Bild
// • src      = Audio-Datei
// • downloadUrl = optionales PDF
//
// Neue Audio-Kachel:
// → einfach einen weiteren Track ergänzen.
// =======================================================

const tracks: AudioTrack[] = [
  {
    id: "nikolaus",
    eyebrow: "6. Dezember",
    title: "Einen Moment zum Nikolaus",
    quote:
      "„Vielleicht kannst du heute genau dieser Lichtblick für jemanden sein.“",
    note:
      "Ein kurzer Moment aus dem Adventskalender – zum Anhören am 6. Dezember.",
    cover: coverNikolausNeu,
    coverAlt:
      "Editoriales Stillleben aus petrolfarbenem Papier, eisblauem Transparentpapier, Silberfaden und roter Beere",
    coverWord: "LICHT BLICK.",
    src: "/audio/2026-q4_extra01.m4a",
    ...(PREVIEW_UNLOCKED
      ? {}
      : {
          unlockAt:
            "2026-12-06T00:00:00+01:00",
        }),
    unlockLabel:
      "Öffnet sich am 6. Dezember",
    credit:
      "Music by Alexandr Kazantsev from Pixabay · Content License Pixabay.",
  },

  {
    id: "heiligabend",
    eyebrow: "24. Dezember",
    title:
      "Ein Moment an Heiligabend",
    quote:
      "„Vielleicht ist genau das heute genug: kurz stehen bleiben und sehen, wer gerade neben dir ist.“",
    note:
      "Der zweite Lichtblick aus dem Adventskalender – zum Anhören an Heiligabend.",
    cover: coverGrussNeu,
    coverAlt:
      "Editoriales Stillleben aus weinrotem Samt, lavendelfarbenem Acryl und rosafarbener Kerze",
    coverWord: "HEUTE GENUG.",
    src: "/audio/2026-q4_extra02.m4a",
    ...(PREVIEW_UNLOCKED
      ? {}
      : {
          unlockAt:
            "2026-12-24T00:00:00+01:00",
        }),
    unlockLabel:
      "Öffnet sich am 24. Dezember",
    credit:
      "Music by AudioCoffee (audiocoffee.net) / Denys Kyshchuk from Pixabay · Content License Pixabay.",
  },

  {
    id: "moment",
    eyebrow: "Achtsamkeitsübung",
    title:
      "Ein kleiner Moment für dich",
    quote:
      "„Du darfst dich um andere kümmern, ohne dich selbst dabei zu vergessen.“",
    note:
      "Eine kurze Auszeit für dich, jederzeit abrufbar. Den Impuls kannst du dir auch ausdrucken.",
    cover: coverMomentNeu,
    coverAlt:
      "Abstrakte Collage aus auberginefarbenem Papier, Flieder, blauem Band und pinkfarbenem Blütenblatt",
    coverWord: "NUR FÜR DICH.",
    src: "/audio/2026-q4_extra03.m4a",
    downloadUrl:
      "/pdf/2026-q4_Auszeit01.pdf",
    downloadLabel:
      "Impuls zum Downloaden",
    credit:
      "Music by Elijah K from Pixabay · Content License Pixabay.",
  },

  {
    id: "pmr",
    eyebrow:
      "Progressive Muskelentspannung",
    title:
      "Spannung trifft Entspannung",
    note:
      "Eine kurze Übung: Muskelgruppen bewusst anspannen und wieder lösen. Die ausführliche Anleitung findest du weiter unten.",
    cover: coverMoment,
    coverAlt:
      "Materialstudie aus gerafftem mitternachtsblauem Stoff, lavendelfarbenem Band und mintfarbenem Stein",
    coverWord: "LÖSEN. LOS.",
    src:
      "/audio/2026-q4_extra03.m4a",
    credit:
      "Music by ",
  },
];


// =======================================================
// HAUPTKOMPONENTE
// Zweck:
// • komplette Lichtblicke-Seite
// =======================================================

function Lichtblicke() {

  // -----------------------------------------------------
  // CAROUSEL-REFERENZEN
  // • scroller = horizontale Audio-Leiste
  // • slideRefs = einzelne Kacheln
  // -----------------------------------------------------

  const scrollerRef =
    useRef<HTMLDivElement | null>(null);

  const slideRefs =
    useRef<(HTMLDivElement | null)[]>([]);


  // -----------------------------------------------------
  // ACTIVE STATE
  // • activeIndex = aktuell sichtbare Kachel
  // • activeId = aktuell abgespieltes Audio
  // -----------------------------------------------------

  const [activeIndex, setActiveIndex] =
    useState(0);

  const [activeId, setActiveId] =
    useState<string | null>(null);


  // -----------------------------------------------------
  // HEADER-SCROLL
  // • steuert den Glass-Effekt des Headers
  // -----------------------------------------------------

  const [hasScrolled, setHasScrolled] =
    useState(false);


  // =====================================================
  // SCROLL-ERKENNUNG
  // Zweck:
  // • erkennt Scrollen innerhalb der Seite
  // • berücksichtigt auch den horizontalen Audio-Scroller
  // =====================================================

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const updateScrollState = () => {
      setHasScrolled(
        scroller.scrollTop > 24 ||
          window.scrollY > 24,
      );
    };

    updateScrollState();
    window.addEventListener(
      "scroll",
      updateScrollState,
      { passive: true },
    );

    scroller.addEventListener(
      "scroll",
      updateScrollState,
      { passive: true },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        updateScrollState,
      );

      scroller.removeEventListener(
        "scroll",
        updateScrollState,
      );
    };
  }, []);


  // =====================================================
  // CAROUSEL-AUSWAHL
  // Zweck:
  // • erkennt nach dem Wischen, welche Audiokachel sichtbar ist
  // • aktualisiert Punkte + Begleittext
  //
  // Nicht entfernen:
  // • Grundlage für das horizontale Carousel
  // =====================================================

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller) return;

    let settleTimer: ReturnType<typeof setTimeout> | undefined;

    const selectNearestSlide = () => {
      const scrollerCenter =
        scroller.getBoundingClientRect().left +
        scroller.clientWidth / 2;

      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      slideRefs.current.forEach((slide, index) => {
        if (!slide) return;
        const rect = slide.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - scrollerCenter);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      setActiveIndex(nearestIndex);
    };

    const handleScroll = () => {
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(selectNearestSlide, 140);
    };

    scroller.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scroller.removeEventListener("scroll", handleScroll);
      if (settleTimer) clearTimeout(settleTimer);
    };
  }, []);


  // =====================================================
  // HASH-NAVIGATION
  // Zweck:
  // • Links wie /lichtblicke#nikolaus öffnen direkt
  //   die passende Audiokachel
  //
  // Wichtig:
  // • id des Tracks muss mit dem Hash übereinstimmen.
  // =====================================================

  useEffect(() => {
    const hash =
      window.location.hash.replace(
        "#",
        "",
      );

    if (!hash) return;
    
    const index =
      tracks.findIndex(
        (track) =>
          track.id === hash,
      );

    if (index < 0) return;

    setActiveIndex(index);

    const scrollToSlide = () => {
      const card =
        slideRefs.current[index];

      card?.scrollIntoView({
        behavior: "auto",
        block: "nearest",
        inline: "start",
      });
    };

    requestAnimationFrame(
      scrollToSlide,
    );
  }, []);


  // =====================================================
  // CAROUSEL-NAVIGATION
  // Zweck:
  // • springt zu einer bestimmten Audiokachel
  //
  // Wird verwendet von:
  // • Punkten
  // • Pfeiltasten
  // =====================================================

  const goTo = (index: number) => {
    setActiveIndex(index);

    const card =
      slideRefs.current[index];

    card?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };


  // -----------------------------------------------------
  // HERO-KOMPAKT
  // • Hero wird kompakter, sobald gescrollt / abgespielt wird
  // -----------------------------------------------------

  const presentationCompact =
    hasScrolled ||
    activeId !== null;


  return (
    <>
      {/* =================================================
          ACCESSIBILITY
         ================================================= */}

      <a
        className="skip-link"
        href="#inhalt"
      >
        Zum Inhalt springen
      </a>


      <main
        id="inhalt"
        className="min-h-screen bg-background font-body text-foreground"
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
          <div className="mx-auto grid h-16 w-full max-w-[430px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 sm:px-7">

            <a
              href="https://www.magazin-klartext.de/"
              target="_blank"
              rel="noreferrer"
              className="w-fit"
              aria-label="Zum KLARTeXt. Magazin"
            >
              <img
                src="/logo.png"
                alt="KLARTeXt."
                className="h-10 w-auto"
              />
            </a>


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

                      <SheetTitle className="font-display text-3xl font-medium">
                        Alle Ausgaben
                      </SheetTitle>

                      <SheetDescription className="font-body text-foreground/65">
                        Extras zu den Ausgaben
                      </SheetDescription>

                    </SheetHeader>


                    {/* Ausgaben-Liste */}
                    <nav
                      className="mt-10"
                      aria-label="Ausgaben"
                    >
                      {issues.map(
                        (
                          issue,
                          index,
                        ) => {

                          const content =
                            (
                              <>
                                <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-foreground/60">
                                  {
                                    issue.eyebrow
                                  }
                                </span>

                                <span className="mt-2 block font-display text-[2rem] font-semibold leading-[1.02] tracking-[-0.025em] text-foreground">
                                  {
                                    issue.title
                                  }
                                </span>

                                <span className="mt-2 block max-w-[17rem] text-sm leading-6 text-foreground/65">
                                  {
                                    issue.subtitle
                                  }
                                </span>
                              </>
                            );

                          return issue.to ? (
                            <SheetClose
                              asChild
                              key={
                                issue.title
                              }
                            >
                              <Link
                                to={
                                  issue.to
                                }
                                className={`issue-entry ${
                                  index ===
                                  0
                                    ? "issue-entry-current"
                                    : ""
                                }`}
                              >
                                {
                                  content
                                }
                              </Link>
                            </SheetClose>
                          ) : (
                            <div
                              key={
                                issue.title
                              }
                              className="issue-entry opacity-40"
                            >
                              {
                                content
                              }
                            </div>
                          );
                        },
                      )}
                    </nav>


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


        {/* =================================================
            HERO
            Zweck:
            • Ausgabe 02 vorstellen
            • kurze Erklärung
            • Carousel-Position anzeigen

            Später ändern:
            • Titel
            • Beschreibung
           ================================================= */}

        <section
          className={`hero-presentation mx-auto w-full max-w-[430px] px-5 pb-10 sm:px-7 ${
            presentationCompact
              ? "is-compact"
              : ""
          }`}
        >

          <div className="mt-4">

            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Ausgabe 02 · 12/26
            </p>

            <h1 className="hero-title mt-3 max-w-[340px] font-display text-[clamp(2.5rem,12vw,3.7rem)] font-semibold leading-[0.95] tracking-[-0.02em]">
              Lichtblicke.
            </h1>

            <p className="hero-sub mt-4 max-w-[19rem] text-sm leading-7 text-muted-foreground">
              Zwei Lichtblicke aus dem Adventskalender zum Anhören · Dazu eine Auszeit und eine Übung zur progressiven Muskelentspannung.
            </p>

          </div>


        </section>


        {/* =================================================
            AUDIO-CAROUSEL
            Zweck:
            • horizontales Wischen
            • zeigt AudioCard-Komponenten
            • aktive Kachel wird über activeId gesteuert
//
//          Später ändern:
//          • Layout → hier
//          • Kachel-Inhalt → tracks
//          • Karten-Design → audio-card.tsx
//
//          Wichtig:
//          Die eigentliche Audiokachel liegt NICHT hier,
//          sondern in components/audio-card.tsx.
//         ================================================= */}

<section
  className={`audio-band audio-band--ausgabe-2 audio-tone-${activeIndex + 1} py-10`}
  aria-label="Audio-Karussell"
>

          <div className="audio-carousel-shell mx-auto w-full max-w-[430px]">
          <div
            ref={scrollerRef}
            role="group"
            aria-label="Audios – seitlich wischen oder mit den Pfeiltasten wechseln"
            tabIndex={0}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-4 [scrollbar-width:none] sm:px-7 [&::-webkit-scrollbar]:hidden"
            style={{
              scrollPaddingInline:
                "1.25rem",
            }}
            onKeyDown={(event) => {

              if (
                event.key ===
                "ArrowRight"
              ) {
                event.preventDefault();

                goTo(
                  Math.min(
                    tracks.length -
                      1,
                    activeIndex + 1,
                  ),
                );
              }

              if (
                event.key ===
                "ArrowLeft"
              ) {
                event.preventDefault();

                goTo(
                  Math.max(
                    0,
                    activeIndex - 1,
                  ),
                );
              }
            }}
          >

            {tracks.map(
              (track, index) => (
                <div
                  key={track.id}
                  ref={(node) => {
                    slideRefs.current[
                      index
                    ] = node;
                  }}
                  className="w-[86%] max-w-[380px] shrink-0 snap-start"
                >

                  <AudioCard
                    track={track}
                    isActive={
                      activeId === null ||
                      activeId ===
                        track.id
                    }
                    onPlay={
                      setActiveId
                    }
                    tone={
                      (["petrol", "wine", "violet", "midnight"] as const)[index] ?? "wine"
                    }
                  />

                </div>
              ),
            )}

          </div>

          <div className="mt-2 flex items-center justify-between gap-4 px-5 sm:px-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground" aria-live="polite">
              Audio {activeIndex + 1} von {tracks.length}
            </p>
            <div className="flex" role="group" aria-label="Audios wechseln">
              {tracks.map((track, index) => (
                <Button
                  key={track.id}
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-current={index === activeIndex}
                  aria-label={`Audio ${index + 1} von ${tracks.length}: ${track.title}`}
                  onClick={() => goTo(index)}
                  className="tap-target size-11 rounded-full"
                >
                  <span
                    aria-hidden="true"
                    aria-selected={index === activeIndex}
                    className={`carousel-dot ${index === activeIndex ? "w-6" : "w-1.5"}`}
                  />
                </Button>
              ))}
            </div>
          </div>

          <p className="px-5 pt-2 text-center text-xs tracking-[0.02em] text-muted-foreground sm:px-7">
            Zum Wechseln seitlich wischen oder einen Punkt antippen
          </p>
          </div>

        </section>


        {/* =================================================
            AUDIO-BEGLEITINFOS
            Zweck:
            • zeigt Zusatzinformationen zur aktuell
              ausgewählten Audio
            • Zitat
            • Beschreibung
            • optionaler Download
            • Musik-Credit
//
//          Die Anzeige wechselt automatisch mit
//          activeIndex.
//         ================================================= */}

        <section
          className={`companion-band companion-tone-${activeIndex + 1} px-6 pb-14 pt-9 sm:px-7`}
          aria-label={`Begleitimpuls zu ${tracks[activeIndex]?.title ?? "diesem Audio"}`}
          aria-live="polite"
        >
          <div className="companion-inner mx-auto w-full max-w-[430px] border-l-4 pl-5">

            {tracks.map(
              (track, index) => {

                const isCurrent =
                  index ===
                  activeIndex;

                return (
                  <div
                    key={track.id}
                    aria-hidden={
                      !isCurrent
                    }
                    className={`transition-all duration-500 ${
                      isCurrent
                        ? "opacity-100 translate-y-0"
                        : "pointer-events-none absolute h-0 -translate-y-1 overflow-hidden opacity-0"
                    }`}
                  >

                    <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                      Begleitimpuls · {track.eyebrow}
                    </p>

                    {track.quote ? (
                      <p className="mt-4 font-display text-xl font-medium leading-8">
                        {
                          track.quote
                        }
                      </p>
                    ) : null}


                    {track.note ? (
                      <p className="mt-5 text-sm leading-7 text-muted-foreground">
                        {
                          track.note
                        }
                      </p>
                    ) : null}


                    {track.downloadUrl ? (
                      <Button
                        asChild
                        variant="outline"
                        className="mt-7 h-11 rounded-full border-border bg-surface px-5 shadow-none"
                      >
                        <a
                          href={
                            track.downloadUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Download className="size-4" />

                          {track.downloadLabel ??
                            "Impuls öffnen"}
                        </a>
                      </Button>
                    ) : null}


                    {track.credit ? (
                      <p className="mt-7 text-[10px] leading-5 text-muted-foreground">
                        {
                          track.credit
                        }
                      </p>
                    ) : null}

                  </div>
                );
              },
            )}

          </div>
        </section>


        {/* =================================================
            Additional Extras
            Zweck:
            • hier: ausführliche Erklärung der progressiven
              Muskelentspannung
            • Schritt-für-Schritt-Anleitung
            • PDF-Download
//
//          Später ändern:
//          • Überschrift
//          • Erklärung
//          • einzelne Übungen
//          • PDF-Link
//
//          Das ist bewusst ein eigener Abschnitt und
//          nicht Teil der Audiokachel.
//         ================================================= */}

        <section className="pmr-band mt-16 px-6 py-20">

          <div className="mx-auto max-w-[430px]">

            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sage-foreground">
              Progressive Muskelentspannung
            </p>

            <h2 className="mt-4 max-w-sm font-display text-[2.5rem] font-semibold leading-[1.02]">
              Spannung lösen. Ruhe finden.
            </h2>

            <p className="mt-6 max-w-sm text-sm leading-7 text-foreground/70">
              Bei dieser kurzen Übung spannst du einzelne Muskelgruppen bewusst an und lässt sie wieder los. So wird der Unterschied zwischen Spannung und Entspannung spürbar.
            </p>


            {/* Übungsschritte */}
            <ol className="mt-12 border-y border-sage/25">

              {[
                [
                  "Schultern & Nacken",
                  "Schultern für einige Sekunden zu den Ohren ziehen. Beim Ausatmen lösen und spüren, wie die Last abfällt.",
                ],
                [
                  "Hände & Arme",
                  "Hände zu Fäusten schließen und halten. Beim Ausatmen loslassen und die Arme locker werden lassen.",
                ],
                [
                  "Gesicht",
                  "Augen leicht zusammenkneifen, Nase rümpfen und Zähne sanft aufeinanderbeißen. Danach vollständig lockerlassen.",
                ],
                [
                  "Nachspüren",
                  "Die Entspannung im Körper wahrnehmen. Finger und Zehen sanft bewegen und in deinem Tempo zurückkommen.",
                ],
              ].map(
                (
                  [
                    title,
                    description,
                  ],
                  index,
                ) => (
                  <li
                    key={title}
                    className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-4 border-b border-sage/20 py-6 last:border-b-0"
                  >

                    <span className="pt-0.5 font-display text-lg font-semibold text-sage">
                      {String(
                        index + 1,
                      ).padStart(
                        2,
                        "0",
                      )}
                    </span>

                    <div>

                      <h3 className="text-sm font-semibold">
                        {title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-foreground/65">
                        {
                          description
                        }
                      </p>

                    </div>

                  </li>
                ),
              )}

            </ol>


            <p className="mt-7 text-sm leading-7 text-foreground/65">
              Du brauchst keine Hilfsmittel. Die Übung funktioniert im Sitzen, Stehen, Gehen oder Liegen und lässt sich gut in deinen Alltag integrieren.
            </p>


            {/* PMR-PDF */}
            <Button
              asChild
              variant="outline"
              className="mt-8 h-12 rounded-full border-sage/45 bg-background/45 px-5 text-sage-foreground shadow-none"
            >
              <a
                href="/pdf/2026-q4_Auszeit01.pdf"
                target="_blank"
                rel="noreferrer"
              >
                <Download className="size-4" />
                Anleitung herunterladen
              </a>
            </Button>

          </div>
        </section>


        {/* =================================================
            WEITERHÖREN
            Zweck:
            • führt zurück zu Ausgabe 01
            • bewusst einfacher CTA statt SaaS-artigem Button
           ================================================= */}

        <section className="continue-band px-6 py-14">

          <div className="mx-auto max-w-[430px]">

            <p className="text-[10px] font-semibold uppercase text-foreground/65">
              Weiterhören · Ausgabe 01
            </p>

            <Link
              to="/"
              className="continue-link mt-3 font-display text-2xl font-semibold leading-tight text-foreground"
            >
              Warum Ehrlichkeit Mut braucht

              <span className="mt-3 block text-sm font-medium text-foreground/70">
                Zur Audio-Auszeit
              </span>
            </Link>

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
