// Minimal platform glyphs (lucide v1 no longer ships brand icons).
const paths = {
  youtube: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor" />
      <path d="M10 9.2v5.6l4.8-2.8z" fill="var(--bg)" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.4" cy="6.6" r="1.3" fill="currentColor" />
    </>
  ),
  x: <path d="M4 4h4.6l4 5.6L17.4 4H20l-6.2 7.3L20.6 20H16l-4.3-6-5.2 6H4l6.6-7.6z" fill="currentColor" />,
  discord: (
    <path
      d="M19 6.2A15 15 0 0 0 15.3 5l-.5 1a13.6 13.6 0 0 0-5.6 0l-.5-1A15 15 0 0 0 5 6.2C2.7 9.7 2.1 13 2.4 16.3A15 15 0 0 0 7 18.6l1-1.6a9.7 9.7 0 0 1-1.5-.7l.4-.3a10.6 10.6 0 0 0 10.2 0l.4.3a9.7 9.7 0 0 1-1.5.7l1 1.6a15 15 0 0 0 4.6-2.3c.4-3.8-.6-7.1-2.6-10.1ZM9.2 14.3c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Zm5.6 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Z"
      fill="currentColor"
    />
  ),
};

export default function SocialIcon({ name, size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className}>
      {paths[name]}
    </svg>
  );
}
