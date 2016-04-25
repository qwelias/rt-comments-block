(function(){
    "use strict";
    var fields = ["_id", "body", "user", "room", "modified", "created", "parent", "downs", "ups"];
    window.Comment = function Comment(data){
        if (!(this instanceof Comment)) return new Comment(data);

        var self = this;
        fields.map(function(f){
            self[f] = data[f];
        });
        this.body = this.body.replace(/\n/g, '</br>');
        this.collapsedSelf = false;
        this.collapsedReply = true;
        this.myComment = '';
        ko.track(this);
    };

    Comment.prototype.getChilds = function(){
        var self = this;
        return window.rtc.vm.comments.filter(function(c){
            return self._id === c.parent;
        });
    };
    Comment.prototype.getPoints = function(){
        var ps = this.ups.length - this.downs.length;
        var text = ' point';
        if(ps !== 1) text = text+'s';
        return ps+text;
    };
    Comment.prototype.getCreated = function(){
        return new Date(this.created).toLocaleString('ru');
    };
    Comment.prototype.reply = function(){
        return window.rtc.submitComment.call(this) || this.toggleReply();
    };
    Comment.prototype.toggleSelf = function(){
        this.collapsedSelf = !this.collapsedSelf;
        return false;
    };
    Comment.prototype.toggleReply = function(){
        this.collapsedReply = !this.collapsedReply;
        return false;
    };
    Comment.prototype.upVote = function(){
        window.rtc.submitVote.call(this, 'up');
    };
    Comment.prototype.downVote = function(){
        window.rtc.submitVote.call(this, 'down');
    };
})();
