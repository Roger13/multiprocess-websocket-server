# multiprocess-websocket-server
A minimalistic multiprocess websocket server using 'ws' websocket library, so you don't have to ;)  
* Uses farmhash for distributing connections over processes based on ip address
* Node.js native http and net modules for listening to http and tcp connections
* Node.js native cluster module for spawning processes
* Server echoes back incoming messages
* Nodemon and babel as development dependencies
