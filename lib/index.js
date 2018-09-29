import { fingerprint32 } from 'farmhash'
import net from 'net'

import workerProcesses from './workerProcesses'

const listenAndRouteIncomingConnectionsToWorkers = () => {
	const port = process.env.PORT || 8080
	const getResponsibleWorkerProcessIndex = (ipAddress) => 
		fingerprint32(ipAddress) % workerProcesses.length
	
	net.createServer({ pauseOnConnect: true }, (connection) => 
		workerProcesses[getResponsibleWorkerProcessIndex(connection.remoteAddress)]
		.send('connection', connection)
	).listen(port, () => 
		console.log('Listening for TCP connections on port:', port)
	)
}

listenAndRouteIncomingConnectionsToWorkers()