import './App.css'
import { readString } from 'react-papaparse'
import Dropzone from 'react-dropzone'
import ReactMarkdown from 'react-markdown'
import { useEffect, useState } from 'react'
import { extractQuestions } from './AzureOpenAI'
import { CSVUploadDropZone } from './components/CSVUploadDropZone'
import { CSVDownloadHelper } from './components/CSVDownloadHelper'


function App() {

  // For cursor loading spinner / 90s vibe
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    if(isLoading) {
      //load custom cursor
      document.body.classList.add('waiting');
      document.body.classList.remove('pointer');
    } else {
      document.body.classList.add('pointer');
      document.body.classList.remove('waiting');
    }
  } )

  // Poor man's wizard: Make the step title green and hide the content, and show the next step content
  const updateStepAsDone = (step: number) => {
    document.getElementById(`step${step}_title`)?.classList.add('h2-done')
    document.getElementById(`step${step}_content`)?.classList.add('div-done')
    document.getElementById(`step${step + 1}_content`)?.classList.remove('step-content_not_started')
    setIsLoading(false)
  }

  // The Initial Upload CSV data in Step 1
  const[asCSVData, setAsCSVData] = useState<any>([])

  // Name of the chosen unstructured field in the CSV in Step 2
  const [unstructuredFieldName, setUnstructuredFieldName] = useState('')
  // List of column names for the unstructured field selecor dropdown
  const [unstructuredFieldValues, setUnstructuredFieldValues] = useState([])
  // List of data from the unstructured field
  const[listOfDataFromUnstructuredField, setListOfDataFromUnstructuredField] = useState([])


  // The extracted questions from LLM in Step 3
  const [extractedQuestions, setExtractedQuestions] = useState<string | null>(null)

  // Handle the Extract Questions button click in Step 3
  const handleExtractQuestions = async () => {
    setIsLoading(true)
    const result = await extractQuestions(listOfDataFromUnstructuredField)
    console.log(result)
    setExtractedQuestions(result)
    updateStepAsDone(3)
  }  

  // Step 1: On change of the CSV file, update the step as done
  useEffect(()=>  {
    if(asCSVData.data) {
      updateStepAsDone(1)
    }
  },[asCSVData])


  var changeCount = 0;
  // Step 2: On change of the unstructured field name, update the list of data from the unstructured field
  useEffect(() => {
    changeCount++;
    console.log(unstructuredFieldName)
    if (asCSVData.data) {
      const listOfDataFromUnstructuredField = asCSVData.data.map((row: any) => row[unstructuredFieldName])
      if(listOfDataFromUnstructuredField.length > 5000) {
        window.alert('Too many rows for this part of it, going to truncate to 5000 rows')
        setListOfDataFromUnstructuredField(listOfDataFromUnstructuredField.slice(0, 5000))
        updateStepAsDone(2)
      } else {
        setListOfDataFromUnstructuredField(listOfDataFromUnstructuredField)
        updateStepAsDone(2)
      }
    }
  }, [unstructuredFieldName])


  return (
    <>
      <div>
        <h1>Welcome to Clippy's Clutch Converter</h1>
        <img src="/10 - dds hackathon clippy.png" alt="Dispatch Decoder" width="200" height="200" />
      </div>

      <h2 id="step1_title">1. Upload a CSV file with an unstructured column</h2>
      <div id="step1_content">
        <CSVUploadDropZone setAsCSVData={setAsCSVData} setUnstructuredFieldValues={setUnstructuredFieldValues} />
      </div>

      <h2 id="step2_title">2. Select the unstructured field name</h2>
      <div id="step2_content" className="step-content_not_started">
        <div id="input_unstructured_field_name">
          <label htmlFor="input_unstructured_field_name">Unstructured Field Name</label>
          <select value={unstructuredFieldName} id="input_unstructured_field_name"
          onChange={(e) => { 
            setUnstructuredFieldName(e.target.value)
          }}>
            {unstructuredFieldValues.map((value) => (
              <option value={value}>{value}</option>
            ))}
          </select>
        </div>
      </div>

      <h2 id="step3_title">3. LLM: Extract questions for SME clarification</h2>
      <div id="step3_content" className="step-content_not_started">
          <button onClick={handleExtractQuestions}>
            Extract Questions
          </button>

        {extractedQuestions && (
          <div className="llm-output">
            <h2>Extracted Questions:</h2>
            <ReactMarkdown>{extractedQuestions}</ReactMarkdown>
          </div>
          )}   
      </div>      


      <h2 id="step4_title">4. Review the extracted questions and ask the SME for clarification</h2>
      <div id="step4_content" className="step-content_not_started"> <CSVDownloadHelper additionalOnClick={() => { updateStepAsDone(4) }} data={extractedQuestions} /></div>

      <h2 id="step5_title">5. Upload the SME's responses to the questions in a CSV file</h2>
      <div id="step5_content" className="step-content_not_started"> </div>

      <h2 id="step6_title">6. LLM generates schema suggestions based on the SME's responses</h2>
      <div id="step6_content" className="step-content_not_started"> </div>

      <h2 id="step7_title">7. Reprocess original file with the new schema</h2>
      <div id="step7_content" className="step-content_not_started"> </div>  
    </>
  )
}

export default App