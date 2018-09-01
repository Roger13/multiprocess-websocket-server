import http from 'http'
import WebSocket from 'ws'

export default () => {
	const httpServer = http.createServer()
	.listen(0, 'localhost', () => 
		console.log('Worker listening for connections')
	)
	
	const handleWebSocketConnections = () => {
		const webSocketServer = new WebSocket.Server({ server: httpServer });
		
		webSocketServer.on('connection', (webSocket) => {
			webSocket.on('message', (message) => {
				console.log(`Received message ${message}`)
				webSocket.send(message)
			})
		})
	}
    	const handleMasterMessages = () => {
    		const handleIncomingConnection = (connection) => {
    			console.log('Receiving connection')
			httpServer.emit('connection', connection)
			connection.resume()
    		}

    	process.on('message', (message, connection) => {
			switch (message) {
				case 'connection':
					handleIncomingConnection(connection)
					break
				default:
			}
		})
    	}
	
	handleWebSocketConnections()
	handleMasterMessages()
}
