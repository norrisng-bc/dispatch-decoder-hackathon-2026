import './App.css'
import { readString } from 'react-papaparse'
import Dropzone from 'react-dropzone'
import { useEffect, useState } from 'react'
import { extractQuestions } from './AzureOpenAI'
import { CSVUploadDropZone } from './components/CSVUploadDropZone'


function App() {
/* 
  The following are raw entries in a user's spreadsheet from an unstructured column.
  The goal is to generate a list of questions to ask a subject matter expert (SME)
  that will give enough context to create a schema to break down the column into structured data.
*/

  const [unstructuredFieldName, setUnstructuredFieldName] = useState('')
  const [unstructuredFieldValues, setUnstructuredFieldValues] = useState([])
  const[listOfDataFromUnstructuredField, setListOfDataFromUnstructuredField] = useState([])
  const[asCSVData, setAsCSVData] = useState<any>([])
  const [extractedQuestions, setExtractedQuestions] = useState<string | null>(null)

  const handleExtractQuestions = async () => {
    const result = await extractQuestions(listOfDataFromUnstructuredField)
    console.log(result)
    setExtractedQuestions(result)
  }  

  useEffect(() => {
    console.log(unstructuredFieldName)
    if (asCSVData.data) {
      const listOfDataFromUnstructuredField = asCSVData.data.map((row: any) => row[unstructuredFieldName])
      setListOfDataFromUnstructuredField(listOfDataFromUnstructuredField)
    }
  }, [unstructuredFieldName])

  return (
    <>
      <div>
        <h1>Welcome to the Dispatch Decoder</h1>
      </div>
      <h2>1. Upload a CSV file with an unstructured column</h2>
      <CSVUploadDropZone setAsCSVData={setAsCSVData} setUnstructuredFieldValues={setUnstructuredFieldValues} />
      <h2>2. Select the unstructured field name</h2>
      <div id="input_unstructured_field_name">
        <label htmlFor="input_unstructured_field_name">Unstructured Field Name</label>
        <select value={unstructuredFieldName} id="input_unstructured_field_name"
        onChange={(e) => setUnstructuredFieldName(e.target.value)}
        >
          {unstructuredFieldValues.map((value) => (
            <option value={value}>{value}</option>
          ))}
        </select>
      </div>
      <div>
        <button onClick={handleExtractQuestions}>
          Extract Questions
        </button>
      </div>      

      {extractedQuestions && (
        <div>
          <h2>Extracted Questions:</h2>
          <pre>{extractedQuestions}</pre>
        </div>
      )}   
    </>
  )
}

export default App