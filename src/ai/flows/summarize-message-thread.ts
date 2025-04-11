'use server';
/**
 * @fileOverview Summarizes a long message thread.
 *
 * - summarizeMessageThread - A function that summarizes a message thread.
 * - SummarizeMessageThreadInput - The input type for the summarizeMessageThread function.
 * - SummarizeMessageThreadOutput - The return type for the summarizeMessageThread function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeMessageThreadInputSchema = z.object({
  messageThread: z.string().describe('The message thread to summarize.'),
});
export type SummarizeMessageThreadInput = z.infer<typeof SummarizeMessageThreadInputSchema>;

const SummarizeMessageThreadOutputSchema = z.object({
  summary: z.string().describe('A summary of the message thread.'),
});
export type SummarizeMessageThreadOutput = z.infer<typeof SummarizeMessageThreadOutputSchema>;

export async function summarizeMessageThread(input: SummarizeMessageThreadInput): Promise<SummarizeMessageThreadOutput> {
  return summarizeMessageThreadFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMessageThreadPrompt',
  input: {
    schema: z.object({
      messageThread: z.string().describe('The message thread to summarize.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A summary of the message thread.'),
    }),
  },
  prompt: `You are an AI assistant helping to summarize a long message thread.

  Please provide a concise summary of the following message thread, highlighting the key topics, decisions, and action items. The summary should be comprehensive enough to allow someone to quickly understand the conversation without reading the entire thread.

  Message Thread: {{{messageThread}}}
  `,
});

const summarizeMessageThreadFlow = ai.defineFlow<
  typeof SummarizeMessageThreadInputSchema,
  typeof SummarizeMessageThreadOutputSchema
>({
  name: 'summarizeMessageThreadFlow',
  inputSchema: SummarizeMessageThreadInputSchema,
  outputSchema: SummarizeMessageThreadOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
