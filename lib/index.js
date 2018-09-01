import cluster from 'cluster'
import { cpus } from 'os'
import { fingerprint32 } from 'farmhash'
import net from 'net'

import runWorkerProcess from './worker'

function runMasterProcess() {
	const workerProcesses = []
	
	const spawnWorkerProcesses = () => {
		const cpusCount = cpus().length
		const spawnWorkerProcess = (index) => {
			console.log('Spawning worker', index)
			workerProcesses[index] = cluster.fork()
			workerProcesses[index]
			.on('exit', (code, signal) => {
				console.error(`Worker ${index} ${code ? `exiting with code ${code}` : `received ${signal}`}`)
				spawnWorkerProcess(index)
			})
		}
		
		for (let index = 0; index < cpusCount; index++) 
			spawnWorkerProcess(index)
	}
	const routeIncomingConnectionsToWorkers = () => {
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
	
	spawnWorkerProcesses()
	routeIncomingConnectionsToWorkers()
}

if (cluster.isMaster) {
	runMasterProcess()
} else {
	runWorkerProcess()	
}



