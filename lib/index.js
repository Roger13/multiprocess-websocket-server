import cluster from 'cluster'
import { cpus } from 'os'
import { fingerprint32 } from 'farmhash'
import net from 'net'

import workerProcess from './worker'

const port = process.env.PORT || 8080
const cpusCount = cpus().length

function masterProcess () {
	const workerProcesses = []
	const spawnWorkerProcess = (index) => {
		console.log('Spawning worker', index)
		workerProcesses[index] = cluster.fork()
		workerProcesses[index]
		.on('exit', (code, signal) => {
			console.error(`Worker ${index} ${code ? `exiting with code ${code}` : `received ${signal}`}`)
			spawnWorkerProcess(index)
		})
	}
	const getResponsibleWorkerProcessIndex = (ipAddress) => 
		fingerprint32(ipAddress) % workerProcesses.length
	
	for (let index = 0; index < cpusCount; index++) 
		spawnWorkerProcess(index)
	
	net.createServer({ pauseOnConnect: true }, (connection) => 
		workerProcesses[getResponsibleWorkerProcessIndex(connection.remoteAddress)]
		.send('connection', connection)
	).listen(port, () => 
		console.log('Listening for TCP connections on port:', port)
	)
}

if (cluster.isMaster) {
	masterProcess()
} else {
	workerProcess()	
}



