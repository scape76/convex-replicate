"use client";

import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueries, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { useRef, useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

type Inputs = {
  prompt: string;
};

export default function Home() {
  const saveSketchMutation = useMutation(api.sketches.saveSketch);
  const sketchesQuery = useQuery(api.sketches.getSketches);

  const sortedSketches = (sketchesQuery ?? []).sort((a, b) => {
    return b._creationTime - a._creationTime;
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  return (
    <main className="flex min-h-screen flex-col items-center pt-4 gap-4">
      <div className="container mx-auto flex items-center md:items-start flex-col gap-4 md:flex-row ">
        <form
          className="flex flex-col gap-2 w-full max-w-[300px]"
          onSubmit={handleSubmit(async (formData) => {
            if (!canvasRef.current) return;
            const image = await canvasRef.current?.exportImage("jpeg");
            await saveSketchMutation({ ...formData, image });
          })}
        >
          <Label htmlFor="prompt">Prompt</Label>
          <Input id="prompt" {...register("prompt", { required: true })} />
          {errors.prompt && <span>This field is required</span>}

          <Label className="mt-2">Canvas (Draw something below)</Label>
          <ReactSketchCanvas
            ref={canvasRef}
            style={{
              border: "0.0625rem solid #9c9c9c",
              borderRadius: "0.25rem",
            }}
            width="600"
            height="400"
            strokeWidth={4}
            strokeColor="black"
          />
          <Button
            type="button"
            variant={"ghost"}
            onClick={() => {
              canvasRef.current?.clearCanvas();
            }}
          >
            Clear
          </Button>
          <Button type="submit">Generate</Button>
        </form>
        <section>
          <h2>Recent sketches</h2>
          <div className="flex justify-center md:justify-normal gap-4 flex-wrap">
            {sortedSketches?.map((sketch) => {
              if (!sketch.result) {
                return <Skeleton key={`skeleton-${sketch._id}`} className="w-[256px] h-[128px]" />;
              }
              return (
                <img
                  key={sketch._id}
                  width="256"
                  src={sketch.result}
                />
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
