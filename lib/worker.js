import http from 'http'
import WebSocket from 'ws'

export default () => {

	const handleMasterMessages = () => {
		const connectToWebSocket = (endpoint) => {
			const webSocket = new WebSocket(endpoint)
			webSocket.on('message', (message) => {
				console.log(`Received message ${message}`)
				webSocket.send(message)
			})
		} 
		
    	process.on('message', (message, connection) => {
    		message = JSON.parse(message)
    		
			switch (message.type) {
				case 'endpoint':
					connectToWebSocket(message.value)
					break
				default:
			}
		})
	}
	
	handleMasterMessages()
}
