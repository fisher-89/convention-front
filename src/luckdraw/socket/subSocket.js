import Echo from "laravel-echo"

window.io = require('socket.io-client');

window.Echo = new Echo({
    broadcaster: 'socket.io',
    host: 112.74.177.132 + ':6001'
});
Echo.channel('draw')
    // .listen('DrawStart', (e) => {
    //     console.log(e);
    // })
    .listen('DrawStop', (arg) => {
      console.log(arg);
    })
    ;