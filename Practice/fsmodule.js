const fs = require('fs');

// fs.readFile('file.txt', 'utf8', (err, data)=>{
//     console.log(err, data);
// })

// const a = fs.readFileSync('file.txt');

// console.log(a);
// console.log(a.toString());

// fs.writeFile('file1.txt', "This is a data", ()=>{
//     console.log("Written to the file");
// })

b = fs.writeFileSync('file1.txt', "This is a data2");

console.log("Finished Reading File");