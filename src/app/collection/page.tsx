"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function Home() {
  const saveSketchMutation = useQuery(api.sketches.getSketches);

  const sortedSketches = (saveSketchMutation ?? []).sort((a, b) => {
    return b._creationTime - a._creationTime;
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <section>
        <h2>Recent sketches</h2>
        <div className="flex gap-4 flex-wrap ">
          {sortedSketches?.map((sketch) => (
            <img key={sketch._id} width="256" src={sketch.result} />
          ))}
        </div>
      </section>
    </main>
  );
}
