"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Play, X } from "lucide-react";
import { formatDate, compactNumber } from "@/lib/format";

function VideoModal({ video, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const isShort = video.kind === "short";
  return (
    <motion.div
      className="fixed inset-0 z-[80] grid place-items-center bg-black/85 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
    >
      <motion.div
        className={`relative w-full ${isShort ? "max-w-sm" : "max-w-5xl"}`}
        initial={{ scale: 0.94, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-4 text-white">
          <p className="line-clamp-1 font-display font-semibold">{video.title}</p>
          <div className="flex shrink-0 gap-2">
            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"
              aria-label="Open on YouTube"
            >
              <ExternalLink size={16} />
            </a>
            <button
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"
              aria-label="Close video"
              autoFocus
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className={`overflow-hidden rounded-2xl bg-black ${isShort ? "aspect-[9/16]" : "aspect-video"}`}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function VideoCard({ video, onPlay, large = false, index = 0 }) {
  const isShort = video.kind === "short";
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: Math.min(index, 6) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <button
        onClick={() => onPlay(video)}
        className="block w-full text-left"
        aria-label={`Play ${video.title}`}
      >
        <div
          className={`relative overflow-hidden rounded-2xl bg-surface-2 ${
            isShort ? "aspect-[9/16]" : "aspect-video"
          }`}
        >
          <Image
            src={video.thumbnail}
            alt=""
            fill
            sizes={large ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className={`transition duration-700 group-hover:scale-105 ${isShort ? "object-cover" : "object-cover"}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-80 transition-opacity group-hover:opacity-100" />
          <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 scale-90 place-items-center rounded-full bg-accent text-white opacity-0 shadow-[0_0_40px_var(--accent)] transition duration-500 group-hover:scale-100 group-hover:opacity-100">
            <Play size={20} fill="currentColor" />
          </span>
          {isShort && (
            <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Short
            </span>
          )}
        </div>
        <div className="mt-4">
          <h3 className={`font-display font-semibold leading-snug group-hover:text-accent transition-colors ${large ? "text-2xl md:text-3xl" : "text-base line-clamp-2"}`}>
            {video.title}
          </h3>
          <p className="mt-1.5 text-xs text-muted flex flex-wrap gap-x-3">
            {video.publishedAt && <time dateTime={video.publishedAt}>{formatDate(video.publishedAt)}</time>}
            {typeof video.views === "number" && <span>{compactNumber(video.views)} views</span>}
          </p>
          {large && video.description && (
            <p className="mt-3 text-muted line-clamp-3 max-w-2xl">{video.description}</p>
          )}
        </div>
      </button>
    </motion.article>
  );
}

export default function VideoGrid({ videos, variant = "grid", emptyText = "No videos to show yet." }) {
  const [active, setActive] = useState(null);

  if (!videos?.length) {
    return <p className="rounded-2xl border border-dashed border-line p-10 text-center text-muted">{emptyText}</p>;
  }

  const [lead, ...rest] = videos;
  return (
    <>
      {variant === "feature" ? (
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <VideoCard video={lead} onPlay={setActive} large />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {rest.slice(0, 3).map((v, i) => (
              <VideoCard key={v.id} video={v} onPlay={setActive} index={i + 1} />
            ))}
          </div>
        </div>
      ) : variant === "shorts" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {videos.map((v, i) => (
            <VideoCard key={v.id} video={v} onPlay={setActive} index={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v, i) => (
            <VideoCard key={v.id} video={v} onPlay={setActive} index={i} />
          ))}
        </div>
      )}
      <AnimatePresence>{active && <VideoModal video={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </>
  );
}

export function VideoSkeletonGrid({ count = 6 }) {
  return (
    <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading videos">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="skeleton aspect-video rounded-2xl" />
          <div className="skeleton mt-4 h-4 w-4/5 rounded" />
          <div className="skeleton mt-2 h-3 w-1/3 rounded" />
        </div>
      ))}
    </div>
  );
}
