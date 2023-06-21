import { internalMutation, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const saveSketch = mutation(
  async (
    { db, scheduler },
    { prompt, image }: { prompt: string; image: string }
  ) => {
    const sketchId = await db.insert("sketches", {
      prompt,
    });


    await scheduler.runAfter(0, api.generate.generate, {
      sketchId,
      prompt,
      image,
    });

    return sketchId;
  }
);

export const getSketch = query(
  async ({ db }, { sketchId }: { sketchId: Id<"sketches"> }) => {
    if (!sketchId) return null;
    return db.get(sketchId);
  }
);

export const updateSketchResult = internalMutation(
  async (
    { db },
    { sketchId, result }: { sketchId: Id<"sketches">; result: string }
  ) => {
    await db.patch(sketchId, { result });
  }
);

export const getSketches = query(async ({ db }) => {
  const sketches = await db.query("sketches").collect();
  return sketches;
});
