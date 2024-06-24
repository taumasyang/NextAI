import React, { useState } from 'react'
import { Layout, Typography } from 'antd'
import ChatComponent from './components/ChatComponent'
const chatComponentStyle = { position: 'fixed', bottom: '0', width: '80%', left: '10%', marginBottom: '20px' }
const App = () => {
	const [conversation, setConversation] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const { Header, Content } = Layout
	const { Title } = Typography
	const handleResp = (question, answer) => setConversation([...conversation, { question, answer }])
	return (
		<>
			<Layout style={{ height: '100vh', backgroundColor: 'white' }}>
				<Header style={{ display: 'flex', alignItems: 'center' }}>
					<Title style={{ color: 'white ' }}>Next AI</Title>
				</Header>
				<Content style={{ width: '80%', margin: 'auto' }}>
				</Content>
				<div style={chatComponentStyle}>
					<ChatComponent handleResp={handleResp} isLoading={isLoading} setIsLoading={setIsLoading} />
				</div>
			</Layout>
		</>
	)
}
export default App
