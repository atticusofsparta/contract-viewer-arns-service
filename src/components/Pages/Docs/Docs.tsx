import ReactMarkdown from 'react-markdown'


function Docs () {

    const markdown = `# Docs
    welcome to the docs page
    here you can find all the information you need to use this app.
    # What is this app?
    This app is a tool to help you interact with the arweave blockchain. Specifically, the smart contracts on the arweave blockchain. More specifically, the ArNS name service.`

    return (<div className="page" style={{flexDirection:"column", justifyContent:"flex-start", alignItems:"flex-start", padding:'5%'}}>
       
      <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>)
}


export default Docs