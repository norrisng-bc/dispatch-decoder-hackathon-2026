import { readString } from 'react-papaparse'
import './App.css'
import Dropzone from 'react-dropzone'
import { useEffect, useState } from 'react'


function App() {

  const [unstructuredFieldName, setUnstructuredFieldName] = useState('')
  const [unstructuredFieldValues, setUnstructuredFieldValues] = useState([])
  const[listOfDataFromUnstructuredField, setListOfDataFromUnstructuredField] = useState([])
  const[asCSVData, setAsCSVData] = useState<any>([])

  useEffect(() => {
    console.log(unstructuredFieldName)
    if (asCSVData.data) {
      const listOfDataFromUnstructuredField = asCSVData.data.map((row: any) => row[unstructuredFieldName])
      setListOfDataFromUnstructuredField(listOfDataFromUnstructuredField)
    }
  }, [unstructuredFieldName])

  useEffect(() => {
    console.dir(asCSVData)
  }, [asCSVData])

  useEffect(() => {
    console.log(listOfDataFromUnstructuredField)
  }, [listOfDataFromUnstructuredField])

  return (
    <>
      <div>
        <h1>Welcome to the Dispatch Decoder</h1>
        <Dropzone onDrop={acceptedFiles => {
           acceptedFiles.forEach((file) => {
            const reader = new FileReader()
      
            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
            // Do whatever you want with the file contents
              const textResult : any = reader.result
              const asCSVData = readString(textResult, {header: true, complete: (results) => {
                console.log(results)
                setAsCSVData(results as any)
              }})
              console.dir(asCSVData)
              // put all headers into the dropdown
              const headers = (asCSVData as any).meta.fields
              setUnstructuredFieldValues(headers)
              console.log(headers)
            }
            reader.readAsText(file)
          })
        }}>
          {({getRootProps, getInputProps}) => (
            <div id="dropzone">
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag the CSV with an unstructured column here</p>
              </div>
            </div>
          )}
        </Dropzone>
      </div>
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

    </>
  )
}

export default App