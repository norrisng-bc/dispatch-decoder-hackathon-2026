import Dropzone from 'react-dropzone'
import { readString } from 'react-papaparse'
export const CSVUploadDropZone = (props: any) => {

return        <Dropzone onDrop={acceptedFiles => {
           acceptedFiles.forEach((file) => {
            const reader = new FileReader()
      
            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
            // Do whatever you want with the file contents
              const textResult : any = reader.result
              const asCSVData = readString(textResult, {header: true, complete: (results) => {
                console.log(results)
                props.setAsCSVData(results as any)
              }})
              console.dir(asCSVData)
              // put all headers into the dropdown
              const headers = (asCSVData as any).meta.fields
              props.setUnstructuredFieldValues(headers)
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
}