import { AzureOpenAI } from 'openai';

/**
 * Create questions with which to ask SME
 * @param data 
 * @returns 
 */
export async function extractQuestions(data: string[]): Promise<string | null> {
  
  const prompt = `The following are raw entries in a user's spreadsheet from an unstructured column.
  The goal is to generate a list of questions to ask a subject matter expert (SME)
  that will give enough context to create a schema to break down the column into structured data.
  Order the questions in descending order with the leading ones being about the elements in question that come up most often
  Return ONLY the properly quoted and escaped csv, with question in the first column, and the category in the second column.  Include a blank column titled Answers"

  \n${data.join('\n')}`
  
  const client = new AzureOpenAI({
    apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY,
    endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT,    
    apiVersion: '2023-07-01-preview',
    deployment: 'gpt-4o', // e.g., 'gpt-4', 'gpt-35-turbo'    
    dangerouslyAllowBrowser: true     // FIXME: do not run outside a local environment!!!
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
    return response.choices[0].message.content
  } catch (error) {
    console.error('Error calling Azure OpenAI:', error);
    return null
  }
}

export async function refineSchema(data: string[], responses: string[][]): Promise<string | null> {

  const prompt = `The following are raw entries in a user's spreadsheet from an unstructured column:
  ${data}

  And here are some questions with answers that may be helpful in understanding the raw entries:    
  \`\`\`json
  ${responses}
  \`\`\`

  Create a schema to break down the column into structured data. 
  Format said schema as a properly-quoted and delimited CSV header string. 
  Do not include anything other than this in your response.`

  const client = new AzureOpenAI({
    apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY,
    endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT,    
    apiVersion: '2023-07-01-preview',
    deployment: 'gpt-4o', // e.g., 'gpt-4', 'gpt-35-turbo'    
    dangerouslyAllowBrowser: true     // FIXME: do not run outside a local environment!!!
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
    return response.choices[0].message.content    
  } catch (error) {
    console.error('Error calling Azure OpenAI:', error);
    return null
  }  

}