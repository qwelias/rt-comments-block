(function(){
    "use strict";
    window.initHandler = function(socket){
        socket.on('comment', function(data) {
            console.log('comment', data);
    		window.rtc.vm.comments.push(Comment(data));
    	});

        socket.on('vote', function(data){
            var c = window.rtc.vm.comments.find(function(c){return c._id == data.__id});
            if(c){
                c.ups = data.ups;
                c.downs = data.downs;
            }
        });

    	socket.on('initial', function(data){
    		console.log('initial', data);
            if(data && data.length){
                window.rtc.vm.comments = data.map(function(c){
                    return Comment(c);
                });
            }
    	});

    	socket.on('err', function(e){
    		alert(e);
    	});
    };
})();