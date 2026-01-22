import Papa from "papaparse"

export const CSVDownloadHelper = (props: any) => {
    // fix this so it isnt a bunch of objects in the csv or error
    const downloadCSV = () => {
        //const csv = Papa.unparse(props.data)
        console.log('props.data', props.data)
        //encode string for dlownload without 3 backticks on either end:
        //remove ```csv from beginning of string
        let data : string = props.data.replace(/```csv\n/g, '')
        //remove ``` from end of string
        data = data.replace(/```/g, '')
        //encode string for download
        const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'data.csv'
        a.click()
        props.additionalOnClick()
    }
  return (
    <div>
      <button onClick={downloadCSV}>Download CSV</button>
    </div>
  )
}