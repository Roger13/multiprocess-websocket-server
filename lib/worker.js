import http from 'http'
import WebSocket from 'ws'

export default () => {
	const httpServer = http.createServer()
	.listen(0, 'localhost', () => 
		console.log('WebSocket listening for connections')
	)
	
    const webSocketServer = new WebSocket.Server({ server: httpServer });
	
	process.on('message', (message, connection) => {
		switch (message) {
			case 'connection':
				console.log('Receiving connection')
				httpServer.emit('connection', connection)
				connection.resume()
				break
			default:
				return
		}
	})
	
	webSocketServer.on('connection', (webSocket) => {
		webSocket.on('message', (message) => {
			console.log(`Received message ${message}`)
			webSocket.send(message)
		})
	})
}