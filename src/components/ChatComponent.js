import React, { useState, useEffect } from 'react'
import axios from 'axios'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import Speech from 'speak-tts'
import { Button, Input } from 'antd'
import { AudioOutlined } from '@ant-design/icons'
const { Search } = Input
const DOMAIN = 'http://localhost:5001'
const searchContainer = { display: 'flex', justifyContent: 'center' }
const ChatComponent = props => {
	const { handleResp, isLoading, setIsLoading } = props
	const [searchValue, setSearchValue] = useState('')
	const [isChatModeOn, setIsChatModeOn] = useState(false)
	const [isRecording, setIsRecording] = useState(false)
	const [speech, setSpeech] = useState()
	const { transcript, resetTranscript } = useSpeechRecognition()
	useEffect(() => {
		const speech = new Speech()
		speech
			.init({ volume: 1, lang: 'en-US', rate: 1, pitch: 1, voice: 'Google US English', splitSentences: true })
			.then(data => {
				console.log('Speech is ready, voices are available', data)
				setSpeech(speech)
			})
			.catch(e => console.error('An error occured while initializing : ', e))
	}, [])
	const talk = what2say => {
		speech
			.speak({
				text: what2say,
				queue: false,
				listeners: {
					onstart: () => console.log('Start utterance'),
					onend: () => console.log('End utterance'),
					onresume: () => console.log('Resume utterance'),
					onboundary: event => console.log(event.name + ' boundary reached after ' + event.elapsedTime + ' milliseconds.'),
				},
			})
			.then(() => {
				console.log('Success !')
				resetEverything()
			})
			.catch(e => {
				console.error('An error occurred :', e)
			})
	}
	const resetEverything = () => resetTranscript()
	const chatModeClickHandler = () => {
		setIsChatModeOn(!isChatModeOn)
		setIsRecording(false)
		SpeechRecognition.stopListening()
	}
	const recordingClickHandler = () => {
		if (isRecording) {
			setIsRecording(false)
			SpeechRecognition.stopListening()
			onSearch(transcript)
		} else {
			setIsRecording(true)
			SpeechRecognition.startListening()
		}
	}
	const onSearch = async question => {
		setSearchValue('')
		setIsLoading(true)
		try {
			const response = await axios.get(`${DOMAIN}/chat`, { params: { question } })
			handleResp(question, response.data)
			if (isChatModeOn) talk(response.data)
		} catch (error) {
			console.error(`Error: ${error}`)
			handleResp(question, error)
		} finally {
			setIsLoading(false)
		}
	}
	const handleChange = e => setSearchValue(e.target.value)
	return (
		<div style={searchContainer}>
			{!isChatModeOn && (
				<Search
					placeholder='input search text'
					enterButton='Ask'
					size='large'
					onSearch={onSearch}
					loading={isLoading}
					value={searchValue}
					onChange={handleChange}
				/>
			)}
			<Button type='primary' size='large' danger={isChatModeOn} onClick={chatModeClickHandler} style={{ marginLeft: '5px' }}>
				Chat Mode: {isChatModeOn ? 'On' : 'Off'}
			</Button>
			{isChatModeOn && (
				<Button type='primary' icon={<AudioOutlined />} size='large' danger={isRecording} onClick={recordingClickHandler} style={{ marginLeft: '5px' }}>
					{isRecording ? 'Recording...' : 'Click to record'}
				</Button>
			)}
		</div>
	)
}
export default ChatComponent
