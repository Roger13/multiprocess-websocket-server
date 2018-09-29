import { cpus } from 'os'
import cluster from 'cluster'

const workerProcesses = []
const workerPath = `${process.cwd()}/lib/worker`
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

cluster.setupMaster({exec: workerPath});

for (let index = 0; index < cpusCount; index++) 
	spawnWorkerProcess(index)

export default workerProcesses