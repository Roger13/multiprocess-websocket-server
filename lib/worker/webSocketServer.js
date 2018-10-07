import WebSocket from 'ws'

import httpServer from './httpServer'

const webSocketServer = new WebSocket.Server({ server: httpServer });
	
const keepClientsAlive = () => {
    webSocketServer.clients.forEach((webSocket) => {
        if (!webSocket.isAlive) return webSocket.terminate();
 
        webSocket.isAlive = false;
        webSocket.ping();
    })
}
	
setInterval(keepClientsAlive, 30000)
	
webSocketServer.on('connection', (webSocket) => {
	webSocket.isAlive = true
	webSocket.on('pong', () => webSocket.isAlive = true)
	webSocket.on('message', (message) => {
		console.log(`Received message ${message}`)
		webSocket.send(message)
	})
})

export default webSocketServer