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

  Create a schema to break down the column into structured data. Ignore any unanswered questions.
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
    const rawResponse = response.choices[0].message.content
    let data = rawResponse?.replace(/```csv\n/g, '')
    //remove ``` from end of string
    data = data?.replace(/```/g, '')
    return data ?? ''
  } catch (error) {
    console.error('Error calling Azure OpenAI:', error);
    return null
  }  

}

export async function reprocessFile(data: string[], schema: string[], responses: string[][], unstructuredFieldName: string): Promise<string | null> {
  // truncate to first 100 rows of data
  data = data.slice(0, 50)
  console.log("data length", data.length)
  alert('Only doing first 50 rows for now')

  const prompt = `You are going to help reprocess csv data into a new schema.  The original CSV had an unstructured column that you will need to reprocess into a new schema.
  For simplicity, I have provided only the that column of data here.
  For context, column in question was: ${unstructuredFieldName}

  The number of rows in the original data is: ${data.length}

  The schema to break it down into is:
  \`\`\`csv
  ${schema}
  \`\`\`

  The original data from that column is:
  \`\`\`csv
  ${data}
  \`\`\`

  And here are some questions with answers that may be helpful context in understanding the raw entries:    
  \`\`\`json
  ${responses}

  Reprocess the original data into the new schema.  
  Return ONLY the properly quoted and escaped csv!  
  Very important it can be opened correctly.   
  No additional text or comments.  
  Don't skip rows, leave blank if unknown. 
  The number of output rows needs to equal the number of rows in the original data.  
  No elipses - return everything.  
  Add a rowID column to the output.  
  If you can't find a value for a row, leave it blank.  Watch out for carriage returns within data.
  `

  const client = new AzureOpenAI({
    apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY,
    endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT,    
    apiVersion: '2023-07-01-preview',
    deployment: 'gpt-4o', // e.g., 'gpt-4', 'gpt-35-turbo'    
    dangerouslyAllowBrowser: true     // FIXME: do not run outside a local environment!!!
  });

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
    const rawResponse = response.choices[0].message.content
    let data = rawResponse?.replace(/```csv\n/g, '')
    //remove ``` from end of string
    data = data?.replace(/```/g, '')
    return data ?? ''
  } catch (error) {
    console.error('Error calling Azure OpenAI:', error);
    return null
  }
}