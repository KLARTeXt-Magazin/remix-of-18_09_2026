import { useId, type CSSProperties } from "react";
import { Pause, Play, RotateCcw, RotateCw, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type ListeningModeProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  eyebrow: string;
  cover: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  durationLabel?: string;
  onTogglePlay: () => void;
  onSkip: (seconds: number) => void;
  onSeek: (seconds: number) => void;
  tone: "wine" | "petrol" | "violet" | "midnight";
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

export function ListeningMode({
  open,
  onOpenChange,
  title,
  eyebrow,
  cover,
  isPlaying,
  currentTime,
  duration,
  durationLabel,
  onTogglePlay,
  onSkip,
  onSeek,
  tone,
}: ListeningModeProps) {
  const progressId = useId();
  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`listening-mode listening-tone-${tone} fixed inset-0 left-0 top-0 z-[70] h-[100dvh] max-h-none w-full max-w-none translate-x-0 translate-y-0 gap-0 overflow-hidden border-0 p-0 shadow-none sm:rounded-none [&>button]:hidden`}
        style={{ "--listening-image": `url(${cover})` } as CSSProperties}
      >
        <div className="listening-mode__image" aria-hidden="true" />
        <div className="listening-mode__wash" aria-hidden="true" />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-[430px] flex-col px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="listening-control size-11 rounded-full"
              onClick={() => onOpenChange(false)}
              aria-label="Höransicht schließen"
            >
              <X className="size-5" aria-hidden="true" />
            </Button>
          </div>

          <div className="mt-auto">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-listening-muted">
              {eyebrow}
            </p>

            <DialogTitle className="mt-3 max-w-sm font-display text-[2.6rem] font-semibold leading-[0.98] text-listening">
              {title}
            </DialogTitle>

            <DialogDescription className="sr-only">
              Großflächige Höransicht für „{title}“
            </DialogDescription>

            <div className="mt-10">
              <label className="sr-only" htmlFor={progressId}>
                Wiedergabeposition in „{title}“
              </label>

              <input
                id={progressId}
                type="range"
                min={0}
                max={duration || 1}
                step={0.1}
                value={currentTime}
                onChange={(event) => onSeek(Number(event.target.value))}
                aria-valuetext={`${formatTime(currentTime)} von ${
                  duration
                    ? formatTime(duration)
                    : durationLabel ?? "unbekannt"
                } Minuten`}
                className="player-range listening-range w-full"
                style={
                  {
                    "--player-progress": `${progress}%`,
                  } as CSSProperties
                }
              />

              <div className="mt-2 flex justify-between text-sm font-semibold tabular-nums text-listening-muted">
                <span>{formatTime(currentTime)}</span>
                <span>
                  {duration ? formatTime(duration) : durationLabel ?? "—"}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-8">
              <Button
                variant="ghost"
                size="icon"
                className="listening-control size-12 rounded-full"
                onClick={() => onSkip(-15)}
                aria-label={`15 Sekunden zurückspringen in „${title}“`}
              >
                <RotateCcw className="size-5" aria-hidden="true" />
              </Button>

              <Button
                className="listening-play size-20 rounded-full"
                onClick={onTogglePlay}
                aria-pressed={isPlaying}
                aria-label={
                  isPlaying
                    ? `„${title}“ pausieren`
                    : `„${title}“ abspielen`
                }
              >
                {isPlaying ? (
                  <Pause
                    className="size-8 fill-current"
                    aria-hidden="true"
                  />
                ) : (
                  <Play
                    className="ml-1 size-8 fill-current"
                    aria-hidden="true"
                  />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="listening-control size-12 rounded-full"
                onClick={() => onSkip(15)}
                aria-label={`15 Sekunden vorspringen in „${title}“`}
              >
                <RotateCw className="size-5" aria-hidden="true" />
              </Button>
            </div>

            <p
              className="mt-5 text-center text-xs font-medium text-listening-muted"
              aria-live="polite"
            >
              {isPlaying ? "Läuft gerade" : "Pausiert"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
