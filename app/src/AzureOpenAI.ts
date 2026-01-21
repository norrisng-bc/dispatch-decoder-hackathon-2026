import { AzureOpenAI } from 'openai';

export async function extractQuestions(data: string[]): Promise<void> {
  
  const prompt = `The following are raw entries in a user's spreadsheet from an unstructured column.
  The goal is to generate a list of questions to ask a subject matter expert (SME)
  that will give enough context to create a schema to break down the column into structured data.
  Order the questions in descending order with the leading ones being about the elements in question that come up most often.

  ${data.join('\n')}`
  
  const client = new AzureOpenAI({
    apiKey: import.meta.env.AZURE_OPENAI_API_KEY,
    endpoint: import.meta.env.AZURE_OPENAI_ENDPOINT,    
    apiVersion: '2023-07-01-preview',
    deployment: 'gpt-4o' // e.g., 'gpt-4', 'gpt-35-turbo'
  });

  console.log(prompt);
  console.log('----')

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error('Error calling Azure OpenAI:', error);
  }
}