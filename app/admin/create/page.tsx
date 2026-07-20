import { getAllChapters, getPapers } from "@/lib/queries";
import CreateTestClient from "./CreateTestClient";

export default async function CreateTestPage(props: PageProps<"/admin/create">) {
  const search = await props.searchParams;
  const preselect =
    typeof search.chapters === "string"
      ? search.chapters
          .split(",")
          .map((n) => Number(n))
          .filter(Number.isFinite)
      : [];
  const [chapters, papers] = await Promise.all([getAllChapters(), getPapers()]);

  return (
    <CreateTestClient
      chapters={chapters.map((c) => ({
        id: c.id,
        name: c.name,
        paperId: c.paperId,
        paperName: c.paperName,
        partLabel: c.partLabel,
      }))}
      papers={papers.map((p) => ({ id: p.id, name: p.name }))}
      preselect={preselect}
    />
  );
}
