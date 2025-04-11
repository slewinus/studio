// The file is a Genkit flow that analyzes a message for security risks.
// It exports the AnalyzeMessageSecurityInput and AnalyzeMessageSecurityOutput interfaces, as well as the analyzeMessageSecurity function.
'use server';

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AnalyzeMessageSecurityInputSchema = z.object({
  message: z.string().describe('The message to analyze for security risks.'),
});
export type AnalyzeMessageSecurityInput = z.infer<typeof AnalyzeMessageSecurityInputSchema>;

const AnalyzeMessageSecurityOutputSchema = z.object({
  hasPhishingRisk: z.boolean().describe('Whether the message has phishing risk.'),
  hasMaliciousLink: z.boolean().describe('Whether the message has malicious link.'),
  explanation: z.string().describe('Explanation of the security analysis.'),
});
export type AnalyzeMessageSecurityOutput = z.infer<typeof AnalyzeMessageSecurityOutputSchema>;

export async function analyzeMessageSecurity(input: AnalyzeMessageSecurityInput): Promise<AnalyzeMessageSecurityOutput> {
  return analyzeMessageSecurityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMessageSecurityPrompt',
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

const analyzeMessageSecurityFlow = ai.defineFlow<
  typeof AnalyzeMessageSecurityInputSchema,
  typeof AnalyzeMessageSecurityOutputSchema
>({
  name: 'analyzeMessageSecurityFlow',
  inputSchema: AnalyzeMessageSecurityInputSchema,
  outputSchema: AnalyzeMessageSecurityOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
