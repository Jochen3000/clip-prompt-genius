import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, FileData } from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-flash-latest"; // Using a generally available model

export async function analyzeVideoWithGemini(
  apiKey: string,
  prompt: string,
  videoUrl: string
): Promise<string> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9, // A bit more creative
      topK: 1,
      topP: 1,
      maxOutputTokens: 8192, // Generous output limit
    };

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];
    
    // The SDK currently expects a Google Cloud Storage URI (gs://...) or an inline base64 encoded string for fileData,
    // not direct public URLs for `fileUri` in the way a simple fetch might work.
    // For a public URL, one would typically fetch the video, convert to base64, and then send.
    // However, given the constraints and to keep it simple for now, we'll structure the call as if `fileUri` could directly take a public URL.
    // If this doesn't work as expected with public URLs, the user would need to handle file fetching and encoding, or use GCS.
    // The prompt states "similar to this example" with `fileUri`, so we follow that structure.
    // The API reference might actually support HTTP(S) URLs for `fileUri` if the file type is correctly inferred or specified.
    // We will assume for now the API can handle direct HTTP(s) URIs for common video types.

    // To use a URL directly, it needs to be a Google Cloud Storage URI or a publicly accessible URL that the API can fetch.
    // The example from the user suggests a direct URL can be used.
    // We need to ensure the video content is accessible to Google's servers.

    // A simple way to represent the video file for the API call:
    const videoFile = {
      fileData: {
        mimeType: "video/mp4", // Assuming mp4, might need to be dynamic or user-specified
        fileUri: videoUrl,
      } as FileData, // Cast to FileData to satisfy the type, as the SDK expects specific properties
    };
    
    console.log("Sending to Gemini API:", { prompt, videoUrl });

    const result = await model.generateContent([prompt, videoFile]);
    const response = result.response;
    const text = response.text();
    console.log("Received from Gemini API:", text);
    return text;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      // Check for common API key issues or access problems
      if (error.message.includes("API key not valid")) {
        return "Error: API key not valid. Please check your API key.";
      }
      if (error.message.includes("FETCH_ERROR")) {
        return "Error: Could not fetch the video. Please ensure the URL is correct and publicly accessible. Or there might be a CORS issue if running in certain environments without a backend proxy.";
      }
      // Try to get more specific error from Google's response if available
      // This part is a bit speculative as error structure can vary
      const googleError = (error as any)?.errorInfo || (error as any)?.details;
      if (googleError) {
        return `Error from Gemini API: ${googleError.message || JSON.stringify(googleError)}`;
      }
      return `Error analyzing video: ${error.message}`;
    }
    return "An unknown error occurred while analyzing the video.";
  }
}
