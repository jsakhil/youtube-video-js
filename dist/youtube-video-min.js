/** 
* video - v0.2.1.
* https://github.com/mkay581/video.git
* Copyright 2015 Mark Kennedy. Licensed MIT.
*/
"use strict";var BaseVideo=require("./base-video"),_=require("./../libs/underscore/underscore"),ElementKit=require("./../libs/element-kit/element-kit"),Youtube=function(a){this.initialize(a)};Youtube.prototype=_.extend({},BaseVideo.prototype,{initialize:function(a){var b=a.el||document.createDocumentFragment();this.options=_.extend({el:b,autoplay:b.getAttribute("autoplay"),width:b.getAttribute("width"),height:b.getAttribute("height"),playingCssClass:"video-playing",loadingCssClass:"video-loading"},a),BaseVideo.prototype.initialize.call(this,this.options),Youtube.prototype.players=Youtube.prototype.players||{},Youtube.prototype.players[this.vpid]=this,this.el=this.options.el,this._origParent=this.el.parentNode,this._playerVars=_.extend({autoplay:this.options.autoplay?1:0},this.getPlayerVars())},getSourceUrl:function(){var a,b,c=this.el.getElementsByTagName("source"),d=c.length;if(!this.src){for(a=0;d>a;a++)if(b=c[a],"video/youtube"===b.getAttribute("type")){this.src=b.getAttribute("src");break}this.src=this.src||""}return this.src},load:function(a){this._container=document.createElement("div"),this._container.setAttribute("id","vplayer"+this.vpid+"-container"),this._origParent&&this._origParent.replaceChild(this._container,this.el),this._container.kit.classList.add(this.options.loadingCssClass),this._loadScript(function(){this._buildPlayer(function(b){this.player=b,this._container.kit.classList.remove(this.options.loadingCssClass),a&&a(b)}.bind(this))}.bind(this))},_buildPlayer:function(a){var b=function(b){a&&a(b)};this._p?b(this._p):this._p=this._createPlayer(b)},_createPlayer:function(a){var b="vplayer"+this.vpid;return this._ytEl=document.createElement("div"),this._ytEl.setAttribute("id",b),this._container.appendChild(this._ytEl),new YT.Player(b,{height:this.options.height,width:this.options.width,playerVars:this._playerVars,videoId:this.getVideoId(),events:{onReady:function(b){a(b.target)},onStateChange:this._onStateChange.bind(this)}})},getPlayerVars:function(){var a=this.getSourceUrl().split("?")[1]||"",b=a.split("&");if(""==b)return{};for(var c={},d=0;d<b.length;++d){var e=b[d].split("=",2);c[e[0]]=1==e.length?"":decodeURIComponent(e[1].replace(/\+/g," "))}return c},getVideoId:function(){if(!this._videoId){var a=/https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/gi;this._videoId=this.getSourceUrl().replace(a,"$1")}return this._videoId},_loadScript:function(a){if(Youtube.prototype._scriptLoaded)return a?a():null;if(!Youtube.prototype._script){var b=document.createElement("script");b.src="https://www.youtube.com/iframe_api",b.async=!0;var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(b,c),Youtube.prototype._script=b}window.onYouTubeIframeAPIReady=function(){a?a():null,Youtube.prototype._scriptLoaded=!0}.bind(this)},_onStateChange:function(a){var b={"-1":{name:"unstarted"},0:{name:"ended",method:this.onEnd},1:{name:"playing",method:this.onPlay},2:{name:"paused",method:this.onPause},3:{name:"buffering"},5:{name:"cued"}},c=""+a.data;b[c].method&&b[c].method.call(this)},_triggerEvent:function(a){var b=document.createEvent("CustomEvent");b.initCustomEvent(a,!1,!1,null),this.el.dispatchEvent(b)},play:function(){this.getSourceUrl()?this.player&&this.player.playVideo():console.warn("youtube video error: you cannot call play() method on a video element that has no youtube source url")},onPlay:function(){this._container.classList.add(this.options.playingCssClass),this._triggerEvent("play")},pause:function(){this.player?this.player.pauseVideo():null},onPause:function(){this._container.classList.remove(this.options.playingCssClass),this._triggerEvent("pause")},stop:function(){this.player?this.player.stopVideo():null},onEnd:function(){this._container.classList.remove(this.options.playingCssClass),this._triggerEvent("ended")},destroy:function(){var a=Youtube.prototype._script,b=Youtube.prototype.players;this._container&&this._container.kit.classList.remove(this.options.loadingCssClass),delete b[this.vpid],window.onYouTubeIframeAPIReady=function(){},a&&!_.keys(b).length&&(a.parentNode.removeChild(a),Youtube.prototype._script=null,Youtube.prototype._scriptLoaded=null),this._origParent&&this._origParent.contains(this._container)&&this._origParent.replaceChild(this.el,this._container),BaseVideo.prototype.destroy.call(this)}}),module.exports=window.Video.Youtube=Youtube;