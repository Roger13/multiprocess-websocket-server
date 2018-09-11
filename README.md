# multiprocess-websocket-server
A minimalistic multiprocess websocket server that echoes back incoming messages, so you don't have to ;)  
* Uses farmhash for distributing connections over processes based on ip address
* Uses ws module for handling websockets connections 
* Node.js native http and net modules for listening to http and tcp connections
* Node.js native cluster module for spawning processes
* Nodemon and babel as development dependencies
