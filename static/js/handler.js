(function(){
    "use strict";
    window.initHandler = function(socket){
        socket.on('comment', function(data) {
            console.log('comment', data);
    		window.rtc.vm.comments.unshift(Comment(data));
    	});

        socket.on('vote', function(data){
            console.log('vote', data);
            var c = window.rtc.vm.comments.find(function(c){return c._id == data._id});
            console.log('c',c);
            if(c){
                c.ups = data.ups;
                c.downs = data.downs;
            }
        });

    	socket.on('initial', function(data){
    		console.log('initial', data);
            if(data){
                window.rtc.vm.comments = data.docs.map(function(c){
                    return Comment(c);
                });
                window.rtc.me = data.me;
            }
    	});

    	socket.on('err', function(e){
    		console.error(e);
    	});
    };
})();
