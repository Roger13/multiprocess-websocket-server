import http from 'http'

export default http.createServer()
.listen(0, 'localhost', () => 
	console.log('Worker listening for connections')
)