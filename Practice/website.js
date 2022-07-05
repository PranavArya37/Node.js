const fs = require('fs');
const http = require('http');

const port = process.env.port || 3000;

const server = http.createServer((req, res) =>{
    // console.log(req);
    console.log(req.url);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    if(req.url == '/'){
        const data = fs.readFileSync('index.html');
        res.statusCode = 200;
        res.end(data.toString());
    }
    else if(req.url == '/about'){
        res.statusCode = 200;
        res.end('<h1> About Pranav Arya</h1> <p>Hey this is about Pranav Arya!</p>');
    }
    else if(req.url == '/pranav'){
        res.statusCode = 200;
        res.end('<h1>This is Pranav Arya</h1> <p>Hey this is Pranav Arya</p>');
    }
    else{
        // res.pranav();
        res.statusCode = 404;
        res.end('<h1> Not Found</h1> <p>Hey this page was not found on this server</p>');
    }
 
    
});

server.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`);
});