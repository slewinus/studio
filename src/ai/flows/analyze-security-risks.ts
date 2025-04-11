// The file is a Genkit flow that analyzes a message for security risks.
// It exports the AnalyzeSecurityRisksInput and AnalyzeSecurityRisksOutput interfaces, as well as the analyzeSecurityRisks function.
'use server';

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AnalyzeSecurityRisksInputSchema = z.object({
  message: z.string().describe('The message to analyze for security risks.'),
});
export type AnalyzeSecurityRisksInput = z.infer<typeof AnalyzeSecurityRisksInputSchema>;

const AnalyzeSecurityRisksOutputSchema = z.object({
  hasPhishingRisk: z.boolean().describe('Whether the message has phishing risk.'),
  hasMaliciousLink: z.boolean().describe('Whether the message has malicious link.'),
  explanation: z.string().describe('Explanation of the security analysis.'),
});
export type AnalyzeSecurityRisksOutput = z.infer<typeof AnalyzeSecurityRisksOutputSchema>;

export async function analyzeSecurityRisks(input: AnalyzeSecurityRisksInput): Promise<AnalyzeSecurityRisksOutput> {
  return analyzeSecurityRisksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSecurityRisksPrompt',
  input: {
    schema: z.object({
      message: z.string().describe('The message to analyze for security risks.'),
    }),
  },
  output: {
    schema: z.object({
      hasPhishingRisk: z.boolean().describe('Whether the message has phishing risk.'),
      hasMaliciousLink: z.boolean().describe('Whether the message has malicious link.'),
      explanation: z.string().describe('Explanation of the security analysis.'),
    }),
  },
  prompt: `You are a security expert. Analyze the following message for security risks, such as phishing attempts or malicious links.\n\nMessage: {{{message}}}\n\nIndicate whether the message has phishing risk or malicious links, and provide a brief explanation of your analysis.`,
});

const analyzeSecurityRisksFlow = ai.defineFlow<
  typeof AnalyzeSecurityRisksInputSchema,
  typeof AnalyzeSecurityRisksOutputSchema
>({
  name: 'analyzeSecurityRisksFlow',
  inputSchema: AnalyzeSecurityRisksInputSchema,
  outputSchema: AnalyzeSecurityRisksOutputSchema,
},async input => {
  const {output} = await prompt(input);
  return output!;
});
