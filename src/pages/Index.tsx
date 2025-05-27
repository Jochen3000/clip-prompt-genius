
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // For prompt input
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { analyzeVideoWithGemini } from '@/services/geminiService';
import { Loader2 } from 'lucide-react'; // For loading spinner
import { useToast } from "@/hooks/use-toast";

const IndexPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load API key from localStorage on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem('geminiApiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  // Save API key to localStorage when it changes
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    localStorage.setItem('geminiApiKey', newApiKey);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast({ title: "API Key Missing", description: "Please enter your Google API Key.", variant: "destructive" });
      return;
    }
    if (!videoUrl.trim()) {
      toast({ title: "Video URL Missing", description: "Please enter a video URL.", variant: "destructive" });
      return;
    }
    if (!prompt.trim()) {
      toast({ title: "Prompt Missing", description: "Please enter your prompt.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setResponse(''); // Clear previous response

    try {
      const result = await analyzeVideoWithGemini(apiKey, prompt, videoUrl);
      setResponse(result);
      if (result.toLowerCase().startsWith("error:")) {
        toast({ title: "Analysis Error", description: result, variant: "destructive" });
      } else {
        toast({ title: "Analysis Complete", description: "Video analysis finished successfully." });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setResponse(`Error: ${errorMessage}`);
      toast({ title: "API Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-50 py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Video Analyzer AI
          </h1>
          <p className="mt-2 text-lg text-slate-400">
            Leverage Google's Gemini API to understand video content.
          </p>
        </header>

        <Card className="bg-slate-800 border-slate-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-100">Configuration</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your Google API Key to begin. This will be stored in your browser's local storage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-slate-300">Google API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your Google API Key"
                value={apiKey}
                onChange={handleApiKeyChange}
                className="bg-slate-700 border-slate-600 text-slate-50 placeholder-slate-500 focus:ring-pink-500"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-100">Analyze Video</CardTitle>
            <CardDescription className="text-slate-400">
              Provide a video URL and a prompt to analyze its content.
              Note: The video URL must be publicly accessible (e.g., direct MP4 link, some YouTube links might not work directly due to restrictions).
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="videoUrl" className="text-slate-300">Video URL</Label>
                <Input
                  id="videoUrl"
                  type="url"
                  placeholder="e.g., https://example.com/video.mp4"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-slate-50 placeholder-slate-500 focus:ring-pink-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-slate-300">Your Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="e.g., Summarize this video in 3 sentences. What objects are visible?"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-slate-50 placeholder-slate-500 focus:ring-pink-500 min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Video'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {response && (
          <Card className="bg-slate-800 border-slate-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-100">API Response</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-slate-300 bg-slate-700 p-4 rounded-md overflow-x-auto">
                {response}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default IndexPage;

