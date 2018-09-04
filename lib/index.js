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
	const distributeEndpointsToWorkers = () => {
		const endpoints = process.env.ENDPOINTS || [
			'wss://endpoint.com', 
			'wss://endpoint2.com', 
			'wss://endpoint3.com', 
		]
		
		workerProcesses.forEach((workerProcess) => {
			if(endpoints.length > 0) 
				workerProcess.send(JSON.stringify({
					type: 'endpoint',
					value: endpoints.pop()
				}))
		})
	}
	
	spawnWorkerProcesses()
	distributeEndpointsToWorkers()
}

if (cluster.isMaster) {
	runMasterProcess()
} else {
	runWorkerProcess()	
}



