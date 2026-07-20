"use client";

import { useTransition } from "react";
import { setTestStatus, deleteTest } from "@/app/actions/admin";

export default function TestRowActions({
  testId,
  status,
}: {
  testId: number;
  status: "draft" | "published";
}) {
  const [pending, startTransition] = useTransition();
  return (
    <div className="mt-3 pt-3 border-t border-dashed border-line flex gap-2">
      <button
        disabled={pending}
        onClick={() =>
          startTransition(() =>
            setTestStatus(testId, status === "published" ? "draft" : "published")
          )
        }
        className="flex-1 rounded-full bg-surface-2 py-2 text-sm font-semibold disabled:opacity-50"
      >
        {status === "published" ? "Unpublish" : "Publish"}
      </button>
      <button
        disabled={pending}
        onClick={() => {
          if (confirm("Delete this test and its questions?"))
            startTransition(() => deleteTest(testId));
        }}
        className="flex-1 rounded-full bg-red-soft text-red py-2 text-sm font-semibold disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
