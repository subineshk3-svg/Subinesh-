export interface PromptDirectorInput {
  analysis?: any;
  subjectMotion: string; // e.g. "Natural", "Subtle", "Dynamic"
  cameraMotion: string;  // e.g. "Dolly In", "Orbit", "Tilt", "Pan Left"
  environmentalMotion: string; // e.g. "Wind", "Clouds", "Water", "Fire"
  style: string;          // e.g. "Cinematic", "Photorealistic", "Anime"
  customPrompt?: string;
}

export interface PromptDirectorOutput {
  positivePrompt: string;
  negativePrompt: string;
  suggestedTags: string[];
}

export function generateVj17Prompt(input: PromptDirectorInput): PromptDirectorOutput {
  const {
    analysis,
    subjectMotion = "Natural",
    cameraMotion = "Slow Zoom In",
    environmentalMotion = "Wind",
    style = "Cinematic",
    customPrompt = "",
  } = input;

  const mainSubject = analysis?.mainSubject || "the primary subject of the photograph";
  const environment = analysis?.environment || "the scene background";

  let cameraDesc = "";
  switch (cameraMotion.toLowerCase()) {
    case "dolly in":
    case "slow zoom in":
      cameraDesc = "Perform a continuous smooth slow cinematic camera push-in towards the subject.";
      break;
    case "dolly out":
    case "slow zoom out":
      cameraDesc = "Execute a majestic slow backward camera pull-out revealing the surrounding environment.";
      break;
    case "pan left":
      cameraDesc = "Smooth fluid pan camera movement drifting leftward across the frame.";
      break;
    case "pan right":
      cameraDesc = "Smooth fluid pan camera movement drifting rightward across the frame.";
      break;
    case "orbit":
      cameraDesc = "Dynamic 360-degree orbital camera rotation circling around the focal subject.";
      break;
    case "tilt":
      cameraDesc = "Subtle cinematic vertical camera tilt upward, emphasizing depth and scale.";
      break;
    case "handheld":
      cameraDesc = "Organic subtle handheld camera motion with realistic micro-shake and atmospheric parallax.";
      break;
    default:
      cameraDesc = `Execute a precise ${cameraMotion} camera movement with steady focal tracking.`;
      break;
  }

  let envDesc = "";
  if (environmentalMotion && environmentalMotion.toLowerCase() !== "none") {
    envDesc = `Add realistic physics-based ${environmentalMotion.toLowerCase()} movement to the background and environmental elements of ${environment}.`;
  }

  let subjectDesc = "";
  switch (subjectMotion.toLowerCase()) {
    case "subtle":
      subjectDesc = "Apply subtle micro-movements, natural breathing cycles, and soft motion dynamics while preserving 100% facial and structural fidelity.";
      break;
    case "dynamic":
      subjectDesc = "Infuse energetic, natural body movement, hair flow, and dramatic expression shifts into the subject.";
      break;
    default:
      subjectDesc = "Preserve the exact identity, facial features, clothing, and overall composition of the subject with smooth natural movement.";
      break;
  }

  const basePrompt = customPrompt ? `${customPrompt.trim()}. ` : "";

  const positivePrompt = `${basePrompt}Preserve the exact identity, facial features, structural integrity and composition of ${mainSubject} from the original photograph. ${subjectDesc} ${cameraDesc} ${envDesc} Style: ${style}, high production cinematic lighting, 8k resolution master, photorealistic temporal consistency, fluid 60fps natural physics.`;

  const negativePrompt = "distorted face, extra fingers, extra limbs, identity drift, duplicated objects, unnatural sudden shifts, flickering, camera instability, warped background, artificial facial expression glitches, low resolution blur, watermark, text logos, over-saturation, anatomical defects";

  const suggestedTags = [
    "Temporal Consistency",
    "Photorealistic Motion",
    "Identity Lock",
    cameraMotion,
    `${style} Grade`,
  ];

  return { positivePrompt, negativePrompt, suggestedTags };
}
