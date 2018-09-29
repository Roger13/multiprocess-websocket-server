import httpServer from './httpServer'
import webSocketServer from './webSocketServer'

const handleMasterMessages = () => {
	const handleIncomingConnection = (connection) => {
		console.log('Receiving connection')
		httpServer.emit('connection', connection)
		connection.resume()
	}

	process.on('message', (message, connection) => {
	    if(message === 'connection') 
	        return handleIncomingConnection(connection)
	})
}

handleMasterMessages()
