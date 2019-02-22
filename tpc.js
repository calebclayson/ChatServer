const net = require('net');
const fs = require('fs');
let users = [];
let numUsers = 0;

function getDate() {
    let date = new Date();
   return ((Number(date.getMonth())+1)+'|'+date.getDate() + '|'+date.getFullYear()+'@'+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds());
}

let server = net.createServer(client => {
    numUsers++;
    client.id = users.length;
    client.name = 'Guest'+(numUsers);
    users.push(client);
    console.log(client.name + ' has joined the chat');
    fs.appendFile('./server.log', getDate() +' '+client.name + ' has joined the chat\n', () => {});
    client.setEncoding('utf8');
    client.write('[Server]: Welcome to the chat room ' + client.name + '!\n');
    for(let i = 0; i < users.length; i++) {
        users[i].write('[Server]: Welcome ' + client.name + ' to the chat.');
    }
    client.on('data', data => {
        console.log(client.name + ': ' + data);
        fs.appendFile('./server.log', getDate() +' '+client.name + ': ' + data +'.\n', () => {});
        for(let i = 0; i < users.length; i++) {
            if(users[i].name != client.name) {
                users[i].write(client.name + ': ' + data);
            }
        }
    })
    client.on('close', () => {
        console.log(client.name + ' has left the chat.');
        fs.appendFile('./server.log', getDate() +' '+ client.name + ' has left the chat.\n', () => {});
        for(let i = 0; i<users.length; i++) {
            if(client.name == users[i].name) {
                users.splice(i, 1);
            } else {
                users[i].write('[Server]: ' + client.name + ' has left the chat.');
            }
        }
    })
}).listen(5000);

console.log('Listening on port 5000');