'use client';

import {AnalyzeMessageSecurityOutput, analyzeMessageSecurity} from '@/ai/flows/analyze-message-security';
import {summarizeMessageThread, SummarizeMessageThreadOutput} from '@/ai/flows/summarize-message-thread';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Separator} from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {Textarea} from '@/components/ui/textarea';
import {Toaster} from '@/components/ui/toaster';
import {useEffect, useRef, useState} from 'react';
import {useToast} from "@/hooks/use-toast";

function Message({message, isSent}: { message: string, isSent: boolean }) {
  return (
    <div className={`mb-2 p-3 rounded-lg ${isSent ? 'bg-primary text-primary-foreground ml-auto' : 'bg-secondary mr-auto'}`}>
      {message}
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [analysis, setAnalysis] = useState<AnalyzeMessageSecurityOutput | null>(null);
  const [summary, setSummary] = useState<SummarizeMessageThreadOutput | null>(null);
  const {toast} = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (analysis) {
      if (analysis.hasPhishingRisk || analysis.hasMaliciousLink) {
        toast({
          title: 'Security Risk Detected',
          description: analysis.explanation,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'No Security Risks Detected',
          description: analysis.explanation,
        });
      }
    }
  }, [analysis, toast]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, newMessage]);
      setNewMessage('');
      textareaRef.current && (textareaRef.current.style.height = 'auto');
      try {
        const analysisResult = await analyzeMessageSecurity({message: newMessage});
        setAnalysis(analysisResult);

        // Summarize the entire message thread
        const thread = [...messages, newMessage].join('\n'); // Joining messages with a newline
        const summaryResult = await summarizeMessageThread({messageThread: thread});
        setSummary(summaryResult);

      } catch (error: any) {
        toast({
          title: 'AI Analysis Failed',
          description: error.message || 'Failed to analyze message security.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleAnalyzeMessage = async () => {
    if (newMessage.trim() !== '') {
      try {
        const analysisResult = await analyzeMessageSecurity({message: newMessage});
        setAnalysis(analysisResult);
      } catch (error: any) {
        toast({
          title: 'AI Analysis Failed',
          description: error.message || 'Failed to analyze message security.',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Please enter a message to analyze',
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen antialiased text-foreground">
        <Sidebar className="bg-secondary border-r">
          <SidebarHeader>
            <SidebarTrigger/>
            <Input placeholder="Search..."/>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Chats</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>General</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>Random</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            <SidebarSeparator/>
            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>Profile</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>Account</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <p className="text-xs text-muted-foreground">
              Made with ❤️ by Firebase Studio
            </p>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1 p-4 space-y-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Cryptic Messenger</CardTitle>
              <CardDescription>Secure messaging with AI-powered security analysis</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto" ref={messageContainerRef}>
              {messages.map((message, index) => (
                <Message key={index} message={message} isSent={true}/>
              ))}
            </CardContent>
            {summary && (
              <div className="p-4">
                <CardDescription>
                  <strong>Thread Summary:</strong> {summary.summary}
                </CardDescription>
              </div>
            )}
            <div className="p-4 flex space-x-2">
              <Textarea
                ref={textareaRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Enter your message..."
                className="flex-1 resize-none"
              />
              <div className="flex flex-col space-y-2">
                <Button onClick={handleSendMessage}>Send</Button>
                <Button variant="secondary" onClick={handleAnalyzeMessage}>Analyze</Button>
              </div>
            </div>
          </Card>
        </div>
        <Toaster/>
      </div>
    </SidebarProvider>
  );
}
