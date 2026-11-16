import { PageHeader } from "./SectionHeading";

export default function LegalPage({ eyebrow = "Legal", title, updated, children }) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} intro={`Last updated: ${updated}`} />
      <article className="container-x pb-16">
        <div className="prose-legal max-w-3xl">{children}</div>
      </article>
    </>
  );
}
