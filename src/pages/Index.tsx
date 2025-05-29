import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { analyzeVideoWithGemini } from '@/services/geminiService';
import { Loader2, Play } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import UXPromptLibrary from '@/components/UXPromptLibrary';
const IndexPage = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();
  const handlePromptSelect = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
    toast({
      title: "Prompt Selected",
      description: "UX analysis prompt has been loaded. You can modify it if needed."
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) {
      toast({
        title: "Video URL Missing",
        description: "Please enter a video URL.",
        variant: "destructive"
      });
      return;
    }
    if (!prompt.trim()) {
      toast({
        title: "Prompt Missing",
        description: "Please enter your prompt.",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    setResponse('');
    try {
      const result = await analyzeVideoWithGemini(prompt, videoUrl);
      setResponse(result);
      if (result.toLowerCase().startsWith("error:")) {
        toast({
          title: "Analysis Error",
          description: result,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Analysis Complete",
          description: "Video analysis finished successfully."
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setResponse(`Error: ${errorMessage}`);
      toast({
        title: "API Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 py-6">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Play className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">UX Testing Analyzer</h1>
              <p className="text-sm text-gray-400">Powered by Google's Gemini AI</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Upload your UX testing videos and get comprehensive UX insights </p>
          </div>

          {/* Analysis Form */}
          <Card className="bg-gray-800 border-gray-700 shadow-xl">
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="videoUrl" className="text-sm font-medium text-gray-200">
                    Video URL
                  </Label>
                  <Input id="videoUrl" type="url" placeholder="https://example.com/video.mp4" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500" />
                </div>
                
                <div className="space-y-4">
                  <UXPromptLibrary onPromptSelect={handlePromptSelect} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt" className="text-sm font-medium text-gray-200">
                    Analysis Prompt
                  </Label>
                  <Textarea id="prompt" placeholder="Describe what you'd like to analyze in the video..." value={prompt} onChange={e => setPrompt(e.target.value)} className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500 min-h-[120px]" />
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button type="submit" disabled={isLoading} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 h-auto border-none">
                  {isLoading ? <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Video...
                    </> : <>
                      <Play className="mr-2 h-4 w-4" />
                      Analyze Video
                    </>}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Results */}
          {response && <Card className="bg-gray-800 border-gray-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <pre className="whitespace-pre-wrap text-sm text-gray-200 font-mono leading-relaxed">
                    {response}
                  </pre>
                </div>
              </CardContent>
            </Card>}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-400">
            Secure video analysis with enterprise-grade AI processing
          </p>
        </div>
      </footer>
    </div>;
};
export default IndexPage;