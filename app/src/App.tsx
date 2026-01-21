import './App.css'
import Dropzone from 'react-dropzone'


function App() {

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
              const binaryStr = reader.result
              console.log(binaryStr)
            }
            reader.readAsArrayBuffer(file)
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
    </>
  )
}

export default App
