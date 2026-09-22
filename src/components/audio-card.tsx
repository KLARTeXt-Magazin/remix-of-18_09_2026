// =======================================================
// KOMPONENTE: AUDIOCARD
// Zweck:
// • wiederverwendbare Audiokachel
// • Player-Steuerung
// • Cover + Titel
// • Fortschrittsbalken
// • optional gesperrte Audios
//
// Wichtig:
// • Diese Datei steuert das Aussehen UND die Funktion
//   aller Audio-Kacheln.
// • Die konkreten Inhalte kommen aus `tracks` in
//   den jeweiligen Seiten.
// =======================================================

import { useEffect, useRef, useState } from "react";

import {
  Lock,
  Play,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ListeningMode } from "@/components/listening-mode";


// =======================================================
// DATENSTRUKTUR FÜR EINE AUDIO-KACHEL
// =======================================================

export type AudioTrack = {
  id: string;
  eyebrow: string;
  title: string;
  quote?: string;
  note?: string;
  cover: string;
  coverAlt: string;
  coverWord?: string;
  src: string;
  duration?: string;
  credit?: string;
  downloadUrl?: string;
  downloadLabel?: string;
  unlockAt?: string;
  unlockLabel?: string;
};


// =======================================================
// ZEITFORMAT
// =======================================================

export function formatTime(seconds: number) {
  if (
    !Number.isFinite(seconds) ||
    seconds < 0
  ) {
    return "0:00";
  }

  const minutes =
    Math.floor(seconds / 60);

  return `${minutes}:${String(
    Math.floor(seconds % 60),
  ).padStart(2, "0")}`;
}


// =======================================================
// AUDIOCARD
// =======================================================

export function AudioCard({
  track,
  isActive,
  onPlay,
  tone,
}: {
  track: AudioTrack;
  isActive: boolean;
  onPlay: (id: string | null) => void;
  tone: "wine" | "petrol" | "violet" | "midnight";
}) {

  // -----------------------------------------------------
  // AUDIO-ELEMENT
  // -----------------------------------------------------

  const audioRef =
    useRef<HTMLAudioElement | null>(
      null,
    );


  // -----------------------------------------------------
  // PLAYER-ZUSTAND
  // -----------------------------------------------------

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [listeningOpen, setListeningOpen] =
    useState(false);


  // -----------------------------------------------------
  // FREISCHALTUNG
  // -----------------------------------------------------

  const [unlocked, setUnlocked] =
    useState(!track.unlockAt);


  // =====================================================
  // FREISCHALTZEIT PRÜFEN
  // =====================================================

  useEffect(() => {
    if (!track.unlockAt) return;

    setUnlocked(
      Date.now() >=
        new Date(
          track.unlockAt,
        ).getTime(),
    );
  }, [track.unlockAt]);


  // =====================================================
  // AUDIO-EVENTS
  //
  // WICHTIG:
  // `pause` setzt nur den lokalen Wiedergabestatus zurück.
  // Es wird NICHT mehr automatisch `onPlay(null)` aufgerufen.
  //
  // Nur `ended` meldet der übergeordneten Seite,
  // dass wirklich kein Track mehr aktiv ist.
  // =====================================================

  useEffect(() => {
    const audio =
      audioRef.current;

    if (!audio) return;


    // Aktuelle Wiedergabeposition
    const updateTime = () =>
      setCurrentTime(
        audio.currentTime,
      );


    // Gesamtdauer der Audio
    const updateDuration = () =>
      setDuration(
        Number.isFinite(
          audio.duration,
        )
          ? audio.duration
          : 0,
      );


    // Audio startet tatsächlich
    const handlePlay = () => {
      setIsPlaying(true);
    };


    // Audio wird pausiert
    const handlePause = () => {
      setIsPlaying(false);
    };


    // Audio ist vollständig zu Ende
    const handleEnded = () => {
      setIsPlaying(false);
      onPlay(null);
    };


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
      "play",
      handlePlay,
    );

    audio.addEventListener(
      "pause",
      handlePause,
    );

    audio.addEventListener(
      "ended",
      handleEnded,
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
        "play",
        handlePlay,
      );

      audio.removeEventListener(
        "pause",
        handlePause,
      );

      audio.removeEventListener(
        "ended",
        handleEnded,
      );
    };
  }, [onPlay, unlocked]);


  // =====================================================
  // NUR EINE AUDIO GLEICHZEITIG
  //
  // Wenn eine andere Karte aktiv wird, wird diese Audio
  // pausiert.
  // =====================================================

  useEffect(() => {
    if (
      !isActive &&
      audioRef.current &&
      !audioRef.current.paused
    ) {
      audioRef.current.pause();
    }
  }, [isActive]);


  // =====================================================
  // PLAY / PAUSE
  // =====================================================

  const togglePlay = async () => {
    const audio =
      audioRef.current;

    if (!audio) return;


    // ---------------------------------------------------
    // PLAY
    // ---------------------------------------------------

    if (audio.paused) {

      // Diese Karte als aktive Audio melden
      onPlay(track.id);

      setListeningOpen(true);

      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
        onPlay(null);
      }


    // ---------------------------------------------------
    // PAUSE
    // ---------------------------------------------------

    } else {

      audio.pause();

      // Der pause-Event setzt isPlaying zurück.
      // Hier NICHT noch einmal onPlay(null) aufrufen.
    }
  };


  // =====================================================
  // HÖRMODUS ÖFFNEN
  // =====================================================

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
  // =====================================================

  const skip = (
    seconds: number,
  ) => {
    const audio =
      audioRef.current;

    if (!audio) return;

    audio.currentTime =
      Math.max(
        0,
        Math.min(
          audio.duration || 0,
          audio.currentTime +
            seconds,
        ),
      );
  };


  // =====================================================
  // AUSGABE DER AUDIO-KACHEL
  // =====================================================

  return (
    <>
      <article
        className="audio-player-card is-active relative overflow-hidden rounded-[1.35rem] border p-3"
        aria-label={track.title}
      >

        {/* =================================================
            AUDIO-ELEMENT
           ================================================= */}

        {unlocked ? (
          <audio
            ref={audioRef}
            src={track.src}
            preload="metadata"
          />
        ) : null}


        {/* =================================================
            COVER-BEREICH
           ================================================= */}

        <div className="audio-cover-layout relative z-10 aspect-[4/3] overflow-hidden rounded-[0.95rem]">

          <img
            src={track.cover}
            alt={track.coverAlt}
            width={1024}
            height={1024}
            loading="lazy"
            className={`audio-cover-image h-full w-full object-cover transition-all duration-700 ${
              unlocked
                ? ""
                : "scale-105 blur-lg saturate-50"
            }`}
          />

          {track.coverWord ? (
            <span className="cover-wordmark" aria-hidden="true">
              {track.coverWord}
            </span>
          ) : null}


          {/* Kategorie / Datum */}

          <span className="audio-cover-badge absolute left-4 top-4 rounded-full border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] shadow-sm backdrop-blur-md">
            {track.eyebrow}
          </span>


          {/* =================================================
              GESPERRTER ZUSTAND
             ================================================= */}

          {!unlocked ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/15 px-6 text-center backdrop-blur-[5px]">

              <span className="audio-lock flex size-12 items-center justify-center rounded-full border shadow-lg backdrop-blur-xl">
                <Lock
                  className="size-5"
                  strokeWidth={1.5}
                />
              </span>

              <p className="max-w-[15rem] text-sm font-medium leading-6 text-listening drop-shadow-md">
                {track.unlockLabel}
              </p>

            </div>
          ) : null}

        </div>


        {/* =================================================
            AUDIO-INHALT
           ================================================= */}

        <div className="relative z-10 px-3 pb-4 pt-5">

          {/* Audio-Titel */}

          <h3 className="font-display text-2xl font-medium leading-tight">
            {track.title}
          </h3>


          {unlocked ? (

            <div className="mt-6">

              <Button
                className="min-h-12 w-full justify-center gap-2 rounded-full bg-primary px-5 text-primary-foreground shadow-play hover:bg-primary/90"
                onClick={openListeningMode}
                aria-label={
                  isPlaying
                    ? `Hörmodus für „${track.title}“ öffnen`
                    : `„${track.title}“ anhören`
                }
              >

                <Play
                  className="size-4 fill-current"
                  aria-hidden="true"
                />

                {isPlaying
                  ? "Hörmodus öffnen"
                  : "Anhören"}

              </Button>


              {isPlaying ? (
                <p
                  className="mt-3 text-center text-xs font-medium text-muted-foreground"
                  aria-live="polite"
                >
                  Läuft gerade
                </p>
              ) : null}

            </div>

          ) : (

            /* =================================================
               GESPERRTER PLAYER
               ================================================= */

            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              Noch nicht verfügbar.{" "}
              {track.unlockLabel}
            </p>

          )}

        </div>

      </article>


      {/* ===================================================
          GROSSER HÖRMODUS
         =================================================== */}

      <ListeningMode
        open={listeningOpen}
        onOpenChange={setListeningOpen}
        title={track.title}
        eyebrow={track.eyebrow}
        cover={track.cover}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        {...(track.duration
          ? {
              durationLabel:
                track.duration,
            }
          : {})}
        onTogglePlay={togglePlay}
        onSkip={skip}
        onSeek={(seconds) => {
          const audio =
            audioRef.current;

          if (!audio) return;

          audio.currentTime =
            seconds;

          setCurrentTime(
            seconds,
          );
        }}
        tone={tone}
      />
    </>
  );
}
