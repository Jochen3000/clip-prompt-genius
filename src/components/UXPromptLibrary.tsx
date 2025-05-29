
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, AlertTriangle, Heart, Lightbulb } from 'lucide-react';

interface UXPrompt {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
}

const uxPrompts: UXPrompt[] = [
  {
    id: 'user-journey',
    title: 'User Journey & Task Completion',
    description: 'Analyze user paths, task success, and navigation patterns',
    icon: <Play className="h-4 w-4" />,
    prompt: `You are an expert UX researcher analyzing a usability test video. Focus specifically on USER JOURNEY & TASK COMPLETION:

- Map the key steps the user takes chronologically
- Note where they succeed easily vs. where they struggle  
- Identify if/when they deviate from expected paths
- Document the user's mental model vs. the actual interface flow
- Note any shortcuts or unexpected behaviors

Provide a clear chronological breakdown with timestamps, highlighting critical decision points and path deviations. Focus on actionable insights about navigation and task flow.`
  },
  {
    id: 'usability-issues',
    title: 'Usability Issues Analysis',
    description: 'Identify and prioritize interface problems and friction points',
    icon: <AlertTriangle className="h-4 w-4" />,
    prompt: `You are an expert UX researcher analyzing a usability test video. Focus specifically on USABILITY ISSUES (prioritized):

- Critical issues: Problems that prevented task completion
- Major issues: Caused significant delay or frustration  
- Minor issues: Caused hesitation but were overcome

For each issue, provide:
- Timestamp when it occurred
- Clear description of the problem
- Direct quotes from the user if available
- Severity level (Critical/Major/Minor)
- Potential root cause

Prioritize issues by impact on user experience and business goals. Focus on specific, actionable problems rather than general observations.`
  },
  {
    id: 'emotional-analysis',
    title: 'User Emotions & Reactions',
    description: 'Track emotional responses and user sentiment throughout the session',
    icon: <Heart className="h-4 w-4" />,
    prompt: `You are an expert UX researcher analyzing a usability test video. Focus specifically on USER EMOTIONS & REACTIONS:

- Note changes in tone, body language, or verbal expressions
- Identify moments of confusion, frustration, or satisfaction
- Connect emotional reactions to specific interface elements or interactions
- Track confidence levels throughout the session
- Note any verbal indicators of cognitive load or stress

Provide timestamps for emotional shifts and connect them to specific UI elements or tasks. Focus on how emotions correlate with usability and task success.`
  },
  {
    id: 'recommendations',
    title: 'UX Recommendations',
    description: 'Generate actionable improvement suggestions based on observations',
    icon: <Lightbulb className="h-4 w-4" />,
    prompt: `You are an expert UX researcher analyzing a usability test video. Focus specifically on UX RECOMMENDATIONS:

Based on the observed issues and user behavior, provide:
- 3-5 specific improvements ranked by potential impact
- Clear rationale for each recommendation
- Implementation difficulty estimate (Low/Medium/High)
- Expected impact on user experience
- Mockup descriptions or interaction flow suggestions where appropriate

Prioritize recommendations that address the most critical user pain points. Focus on actionable, specific changes rather than vague suggestions. Consider both quick wins and longer-term improvements.`
  }
];

interface UXPromptLibraryProps {
  onPromptSelect: (prompt: string) => void;
}

const UXPromptLibrary: React.FC<UXPromptLibraryProps> = ({ onPromptSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {uxPrompts.map((prompt) => (
        <Button
          key={prompt.id}
          variant="outline"
          className="h-auto p-4 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-left justify-start transition-colors"
          onClick={() => onPromptSelect(prompt.prompt)}
        >
          <div className="flex items-start gap-3 w-full">
            <div className="text-blue-600 mt-1 flex-shrink-0">
              {prompt.icon}
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-gray-900 mb-1 text-sm">
                {prompt.title}
              </div>
              <div className="text-xs text-gray-600 leading-relaxed">
                {prompt.description}
              </div>
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default UXPromptLibrary;
