const express = require("express");
const todos = require("./todos.json");
const server = express();
const fs = require("fs");
const { performance } = require('perf_hooks');
const accessLogStream = fs.createWriteStream("access.log", { flags: "a" });
const loggingMiddleware = (req, res, next) => {
    const startTime = performance.now();
    const { method, url } = req;
    const timestamp = new Date().toUTCString();

    res.on('finish', () => {
        const endTime = performance.now();
        const elapsedTime = endTime - startTime;
        const logMessage = `${timestamp} - ${method} ${url} - Processed in ${elapsedTime.toFixed(2)} ms`;
        accessLogStream.write(logMessage + "\n");
    });

    next();
};
server.use(loggingMiddleware);

server.get("/product/:id", (req, res) => {
    const filterResult = todos.find((todo) => todo.id == req.params.id);
    if (!filterResult) {
        return res.json({
            success: false,
            result: `the ${req.params.id} not found`
        });
    }
    res.json({
        success: true,
        result: filterResult
    });
});
server.get("/product", (req, res) => {
    const output = {
        success: true,
        result: todos
    };
    res.json(output);
});

server.listen(5001);


// const express = require("express");

// const todos = require("./todos.json")

// const server = express();
// const fs = require("node:fs");


// const writeFile = (log)=>{
//     fs.appendFileSync("access.log" , log + "\n");
// }

// server.use((req,res,next)=>{
//     writeFile(`The Requested  URL = ${req.url} , Time = ${new Date()}`);
//     next();
// })


// server.get("/product/:id" , (req,res)=>{
//     console.log(req)
//     const filterResult = todos.find((todo)=> todo.id == req.params.id);

//     if(!filterResult){
//        return  res.json({
//             success:false,
//             result: `the ${req.params.id} not found`
//         })
//     }
//     res.json({
//         success:true,
//         result: filterResult
//     })
// })




// server.get("/product" , (req , res)=>{
//     // console.log(req)
//     const output = {
//         success:true,
//         result:
//             todos
        
//     }

//     res.json(output)
// } );




// server.listen(5001);












// const http = require("node:http");

// const myserver = (req,res)=>{
//     // console.log(req);

//     if(req.url === "/product"){

//         const output = {
//             success:true,
//             message:"product"
//         }
//         res.writeHead(200, {"Content-Type": "application/json"});
//         res.end(JSON.stringify(output));


//     }
//     else if(req.url=== "/order"){

//         const output = {
//             success:true,
//             message:"order"
//         }
//         res.writeHead(200, {"Content-Type": "application/json"});
//         res.end(JSON.stringify(output));

//     }
//     else{
//         const output = {
//             success:false,
//             message:"route not found"
//         }
//         res.writeHead(200, {"Content-Type": "application/json"});
//         res.end(JSON.stringify(output));

//     }

//     // const output = {
//     //     success:true,
//     //     message:"Response working properly"
//     // }
//     // res.writeHead(200, {"Content-Type": "application/json"});
//     // res.end(JSON.stringify(output));
// }

//  const server = http.createServer(myserver);

//  server.listen(5001);