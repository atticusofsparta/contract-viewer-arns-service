import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function Docs() {
  const markdown = `
  # Docs

    welcome to the docs page. Here you can find all the information you need to use this app.

    # What is this app?

    This app is a tool to help you interact with the arweave blockchain. Specifically, 
    the smart contracts on the arweave blockchain. More specifically, the ArNS name service.
    
    `;

  return (
    <div
      className="page"
      style={{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      }}
    >
      <ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} />
    </div>
  );
}

export default Docs;
