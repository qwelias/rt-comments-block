(function(){
    "use strict";
    var fields = ["_id", "body", "user", "room", "modified", "created", "parent", "downs", "ups"];
    window.Comment = function Comment(data){
        if (!(this instanceof Comment)) return new Comment(data);

        var self = this;
        fields.map(function(f){
            self[f] = data[f];
        });
        ko.track(this);
    };

    Comment.prototype.getChilds = function(){
        var self = this;
        return window.rtc.vm.comments.filter(function(c){
            return self._id === c.parent;
        });
    };
})();
