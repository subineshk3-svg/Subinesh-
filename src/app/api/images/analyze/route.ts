import { NextResponse } from "next/server";
import { analyzeUploadedImage } from "@/lib/imageAnalysis";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageUrl, fileName } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL or data stream is required for AI analysis." }, { status: 400 });
    }

    const analysis = await analyzeUploadedImage(imageUrl, fileName);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "AI image analysis failed." }, { status: 500 });
  }
}
