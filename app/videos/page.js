import { Suspense } from "react";
import Image from "next/image";
import { ArrowUpRight, ListVideo } from "lucide-react";
import { PageHeader } from "@/components/common/SectionHeading";
import SectionHeading from "@/components/common/SectionHeading";
import VideoGrid, { VideoSkeletonGrid } from "@/components/videos/VideoGrid";
import { getLatestVideos, getPlaylists, getPopularVideos } from "@/lib/youtube";
import { LINKS } from "@/lib/site";

export const revalidate = 1800;

export const metadata = {
  title: "Videos",
  description: "Latest uploads, popular videos, shorts and playlists from Samay Raina's official YouTube channel.",
  alternates: { canonical: "/videos" },
};

function ChannelLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
      {children} <ArrowUpRight size={15} />
    </a>
  );
}

async function Latest() {
  const { videos, source } = await getLatestVideos();
  const longform = videos.filter((v) => v.kind !== "short");
  return (
    <>
      <VideoGrid videos={longform} />
      {source === "curated" && (
        <p className="mt-8 text-sm text-muted">
          Showing verified highlights while the live channel feed is unavailable.{" "}
          <a href={LINKS.youtube} className="text-accent underline" target="_blank" rel="noopener noreferrer">
            See every upload on YouTube
          </a>
          .
        </p>
      )}
    </>
  );
}

async function Popular() {
  const videos = await getPopularVideos();
  if (!videos.length)
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-line p-8 text-muted">
        <p>Most-viewed rankings appear here once the YouTube Data API is connected.</p>
        <ChannelLink href={`${LINKS.youtube}/videos?view=0&sort=p`}>Popular on YouTube</ChannelLink>
      </div>
    );
  return <VideoGrid videos={videos.slice(0, 6)} />;
}

async function Shorts() {
  const { videos } = await getLatestVideos();
  const shorts = videos.filter((v) => v.kind === "short").slice(0, 10);
  if (!shorts.length)
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-line p-8 text-muted">
        <p>No recent Shorts in the feed right now.</p>
        <ChannelLink href={LINKS.youtubeShorts}>Shorts on YouTube</ChannelLink>
      </div>
    );
  return <VideoGrid videos={shorts} variant="shorts" />;
}

async function Playlists() {
  const lists = await getPlaylists();
  if (!lists.length)
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-line p-8 text-muted">
        <p>Playlists load here once the YouTube Data API is connected.</p>
        <ChannelLink href={LINKS.youtubePlaylists}>Playlists on YouTube</ChannelLink>
      </div>
    );
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {lists.map((p) => (
        <a
          key={p.id}
          href={`https://www.youtube.com/playlist?list=${p.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-surface-2">
            {p.thumbnail && <Image src={p.thumbnail} alt="" fill sizes="25vw" className="object-cover transition duration-700 group-hover:scale-105" />}
            <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-xs text-white">
              <ListVideo size={13} /> {p.count ?? ""}
            </span>
          </div>
          <p className="mt-3 font-display font-semibold group-hover:text-accent">{p.title}</p>
        </a>
      ))}
    </div>
  );
}

export default function VideosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Videos"
        title={<>Press <span className="font-serif italic font-normal text-accent">play.</span></>}
        intro="Every video here is an official YouTube embed from Samay Raina's channel. Nothing is downloaded or rehosted."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={LINKS.youtube} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Subscribe on YouTube <ArrowUpRight size={15} />
          </a>
          <a href={LINKS.iglYoutube} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            India&apos;s Got Latent channel <ArrowUpRight size={15} />
          </a>
        </div>
      </PageHeader>

      <section className="container-x py-16">
        <SectionHeading eyebrow="Latest uploads" title="New on the channel" />
        <Suspense fallback={<VideoSkeletonGrid />}>
          <Latest />
        </Suspense>
      </section>

      <section className="container-x py-16">
        <SectionHeading eyebrow="Most watched" title="Popular videos" />
        <Suspense fallback={<VideoSkeletonGrid count={3} />}>
          <Popular />
        </Suspense>
      </section>

      <section className="container-x py-16">
        <SectionHeading eyebrow="Bite-sized" title="Shorts" />
        <Suspense fallback={<VideoSkeletonGrid count={5} />}>
          <Shorts />
        </Suspense>
      </section>

      <section className="container-x py-16">
        <SectionHeading eyebrow="Binge mode" title="Playlists" />
        <Suspense fallback={<VideoSkeletonGrid count={4} />}>
          <Playlists />
        </Suspense>
      </section>
    </>
  );
}
