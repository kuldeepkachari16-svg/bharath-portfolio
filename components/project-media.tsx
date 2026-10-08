"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PortfolioImage } from "@/lib/portfolio";
export function ImageGroup({
  images,
  title,
  offset = 0,
}: {
  images: PortfolioImage[];
  title: string;
  offset?: number;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<PortfolioImage | null>(null);
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
  function close() {
    dialog.current?.close();
    setActive(null);
  }
  return (
    <>
      <div className={`image-group ${images.length === 1 ? "single" : ""}`}>
        {images.map((image, i) => (
          <button
            className="gallery-button"
            key={`${image.src}-${i}`}
            aria-label={`Enlarge ${title}, image ${offset + i + 1}`}
            onClick={() => {
              setActive(image);
              dialog.current?.showModal();
            }}
          >
            <Image
              src={image.src}
              width={image.width}
              height={image.height}
              alt={`${title} — image ${offset + i + 1}`}
              sizes={
                images.length === 1 ? "90vw" : "(max-width: 700px) 90vw, 45vw"
              }
            />
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={`${title} enlarged image`}
        onClose={() => setActive(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <button autoFocus onClick={close}>
          Close
        </button>
        {active && (
          <Image
            src={active.src}
            width={active.width}
            height={active.height}
            alt={title}
            sizes="95vw"
          />
        )}
      </dialog>
    </>
  );
}
export function Film({
  src,
  title,
  cover,
}: {
  src: string;
  title: string;
  cover: PortfolioImage;
}) {
  const [playing, setPlaying] = useState(false);
  return (
    <div>
      <div className="film">
        {playing ? (
          <iframe
            src={src}
            title={`${title} — film`}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
          />
        ) : (
          <button onClick={() => setPlaying(true)} aria-label={`Play ${title}`}>
            <Image
              src={cover.src}
              width={cover.width}
              height={cover.height}
              alt=""
              sizes="90vw"
            />
            <span className="play-icon" aria-hidden="true">
              ▷
            </span>
            <span className="play-label">Play film</span>
          </button>
        )}
      </div>
      <a className="film-source" href={src} target="_blank" rel="noreferrer">
        Open original film
      </a>
    </div>
  );
}
