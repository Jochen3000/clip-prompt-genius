
import { supabase } from "@/integrations/supabase/client";

export async function analyzeVideoWithGemini(
  prompt: string,
  videoUrl: string
): Promise<string> {
  try {
    console.log("Calling Supabase Edge Function for video analysis:", { prompt, videoUrl });

    const { data, error } = await supabase.functions.invoke('analyze-video', {
      body: {
        prompt,
        videoUrl,
      },
    });

    if (error) {
      console.error("Supabase function error:", error);
      throw new Error(`Function call failed: ${error.message}`);
    }

    if (data?.error) {
      console.error("API error:", data.error);
      return `Error: ${data.error}`;
    }

    if (!data?.result) {
      throw new Error("No result received from the analysis");
    }

    console.log("Received analysis result:", data.result);
    return data.result;

  } catch (error) {
    console.error("Error calling video analysis function:", error);
    if (error instanceof Error) {
      return `Error analyzing video: ${error.message}`;
    }
    return "An unknown error occurred while analyzing the video.";
  }
}
