import { NextResponse } from "next/server";
import { enhancePromptGpu } from "@/lib/gpuBackend";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    const enhanced = await enhancePromptGpu(prompt);

    return NextResponse.json({
      success: true,
      originalPrompt: prompt,
      enhancedPrompt: enhanced,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to enhance prompt." }, { status: 500 });
  }
}
