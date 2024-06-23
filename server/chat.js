import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { RetrievalQAChain } from 'langchain/chains'
import { PromptTemplate } from 'langchain/prompts'
const chat = async (filePath = './uploads/default.pdf', query) => {
	const data = await new PDFLoader(filePath).load()
	const splitDocs = await new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 0 }).splitDocuments(data)
	const vectorStore = await MemoryVectorStore.fromDocuments(
		splitDocs,
		new OpenAIEmbeddings({ openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY })
	)
	return await RetrievalQAChain.fromLLM(
		new ChatOpenAI({ modelName: 'gpt-3.5-turbo', openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY }),
		vectorStore.asRetriever(),
		{
			prompt: PromptTemplate.fromTemplate(`Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
Use three sentences maximum and keep the answer as concise as possible.
{context}
Question: {question}
Helpful Answer:`),
		}
	).call({ query })
}
export default chat
