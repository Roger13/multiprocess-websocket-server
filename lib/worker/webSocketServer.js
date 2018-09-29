import WebSocket from 'ws'

import httpServer from './httpServer'

const webSocketServer = new WebSocket.Server({ server: httpServer });
	
webSocketServer.on('connection', (webSocket) => {
	webSocket.on('message', (message) => {
		console.log(`Received message ${message}`)
		webSocket.send(message)
	})
})

export default webSocketServer