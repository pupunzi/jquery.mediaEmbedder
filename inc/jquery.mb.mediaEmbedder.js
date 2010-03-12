/*******************************************************************************
 jquery.mb.components
 Copyright (c) 2001-2010. Matteo Bicocchi (Pupunzi); Open lab srl, Firenze - Italy
 email: info@pupunzi.com
 site: http://pupunzi.com

 Licences: MIT, GPL
 http://www.opensource.org/licenses/mit-license.php
 http://www.gnu.org/licenses/gpl.html
 ******************************************************************************/

/*
 * jQuery.mb.components: mb.mediaEmbedder
 * version: 1.0- 23-gen-2010 - 55
 * © 2001 - 2010 Matteo Bicocchi (pupunzi), Open Lab
 *
 */

(function($){

  $.mb_videoEmbedder={
    name:"jquery.mb.videoEmbedder",
    version:1.0,
    author:"Matteo Bicocchi",
    defaults:{
      width:450,
      youtube:{
        showTitle:false
      }
    },
    regEx:/\[(.*?)\]/g,
    mb_setMovie:function(context,address,string){
      function findMovieAndEmbed(node, address,string) {
        var skip = 0;
        if(address.indexOf("&AMP;")!=-1) address=address.replace(/&AMP;/g,"&");
        if (node.nodeType == 3) {
          var pos = node.data.toUpperCase().indexOf(address);
          if (pos >= 0) {

            var embed = $('<span/>').addClass("mb_video");
            var middlebit = node.splitText(pos);
            middlebit.splitText(address.length);
            embed.append(string);
            middlebit.parentNode.replaceChild(embed.get(0), middlebit);
            skip = 1;
          }
        }
        else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
          for (var i = 0; i < node.childNodes.length; ++i) {
            i += findMovieAndEmbed(node.childNodes[i], address.toUpperCase(),string);
          }
        }
        return skip;
      }
      return context.each(function() {
        findMovieAndEmbed(this, address.toUpperCase(), string);
      });
    },
    mb_embedMovies:function(opt){
      var context=$(this);
      this.options = {};
      $.extend (this.options, $.mb_videoEmbedder.defaults, opt);

      var movies= $(this).html().match($.mb_videoEmbedder.regEx);
      if(!movies) return;
      $(movies).each(function(i){
        var address=movies[i];

        var isYoutube= address.indexOf("youtube=http://")!=-1;
        var isVimeo= address.indexOf("vimeo=http://")!=-1;
        var isUstream= address.indexOf("ustream=http://")!=-1;
        var isLivestream= address.indexOf("livestream=http://")!=-1;
        var isFlickr= address.indexOf("flickr=http://")!=-1;

        var isVideo = isYoutube || isVimeo || isUstream || isLivestream || isFlickr;

        if(!isVideo) return;


        var stringToParse=address.replace(/\[/g,"").replace(/\]/g,"");
        var showTitle= !$.mb_videoEmbedder.defaults.youtube.showTitle? 0:1;

        var vidId=isYoutube?(stringToParse.match( /[\\?&]v=([^&#]*)/))[1]:
        isVimeo? (stringToParse.match(/\d+/))[0]:
        isUstream?(stringToParse.match(/\d+/))[0]:
        isFlickr?(stringToParse.match(/\d+/))[0]:
        isLivestream?(stringToParse.replace("livestream=http://www.livestream.com/","").toLowerCase()):
        null;

        var ratio=isYoutube?(showTitle==1?80.5:68):
                  isVimeo?57.5:
                  65;

        var width=$.mb_videoEmbedder.defaults.width;
        var height= Math.ceil((width*ratio)/100);

        var path= isYoutube?"http://www.youtube.com/v/":
                  isVimeo?"http://vimeo.com/moogaloop.swf?clip_id=":
                  isUstream?"http://www.ustream.tv/flash/video/":
                  isLivestream?"http://cdn.livestream.com/grid/LSPlayer.swf?channel=":
                  isFlickr?"http://www.flickr.com/apps/video/stewart.swf?photo_id=":
                  null;

        var param=isYoutube?"&fs=1&rel=0&hd=1&showsearch=0&showinfo="+showTitle :
                  isVimeo?"&amp;server=vimeo.com&amp;show_title="+showTitle+"&amp;show_byline=1&amp;show_portrait=0&amp;color=&amp;fullscreen=1":
                  isUstream?"?disabledComment=true&amp;autoplay=false":
                  isLivestream?"&amp;color=0xe8e8e8&amp;autoPlay=false&amp;mute=false":
                  "";

        var embedstring= '<object width="'+width+'" height="'+height+'">' +
                         '<param name="movie" value="'+path+vidId+param+'">' +
                         '<param name="allowFullScreen" value="true">' +
                         '<param name="wmode" value="transparent">' +
                         '<param name="allowscriptaccess" value="always">' +
                         '<param name="flashvars" value="autoplay=false">' +
                         '<embed src="'+path+vidId+param+'"' +
                         ' type="application/x-shockwave-flash" ' +
                         'wmode="transparent" allowscriptaccess="always" ' +
                         'flashvars="autoplay=false"' +
                         'allowfullscreen="true" width="'+width+'" height="'+height+'">' +
                         '</embed>' +
                         '</object>';

        if(isVideo)
          $.mb_videoEmbedder.mb_setMovie(context,address,embedstring);
      });
    }
  };

  $.mb_audioEmbedder={
    name:"jquery.mb.videoEmbedder",
    version:1.0,
    author:"Matteo Bicocchi",
    playerPath:"media/player.swf",
    defaults:{
      width:300
    },
    regEx:/\[audio=(.*?)\]/g,
    mb_setAudio:function(context,pat,string){
      function findAudioAndEmbed(node, pat,string) {
        var skip = 0;
        if(pat.indexOf("&AMP;")!=-1) pat=pat.replace(/&AMP;/g,"&");
        if (node.nodeType == 3) {
          var pos = node.data.toUpperCase().indexOf(pat);
          if (pos >= 0) {

            var embed = $('<span/>').addClass("mb_audio");
            var middlebit = node.splitText(pos);
            middlebit.splitText(pat.length);
            embed.append(string);
            middlebit.parentNode.replaceChild(embed.get(0), middlebit);
            skip = 1;
          }
        }
        else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
          for (var i = 0; i < node.childNodes.length; ++i) {
            i += findAudioAndEmbed(node.childNodes[i], pat.toUpperCase(),string);
          }
        }
        return skip;
      }
      return context.each(function() {
        findAudioAndEmbed(this, pat.toUpperCase(), string);
      });
    },
    mb_embedAudio:function(opt){
      var context=$(this);
      this.options = {};
      $.extend (this.options, $.mb_audioEmbedder.defaults, opt);

      var audiofiles= $(this).html().match($.mb_audioEmbedder.regEx);
      if(!audiofiles) return;
      $(audiofiles).each(function(i){
        var pat=audiofiles[i];
        var isAudio= pat.indexOf("audio=http://")!=-1;
        var params=pat.replace(/\[audio=/g,"").replace(/\]/g,"");
        var width=$.mb_audioEmbedder.defaults.width;
        var embedstring= '<object width="'+width+'" height="24" type="application/x-shockwave-flash"' +
                         'style="outline: medium none; visibility: visible;" ' +
                         'data="'+$.mb_audioEmbedder.playerPath+'" >' +
                         '<param name="menu" value="false">'+
                         '<param name="flashvars" value="soundFile='+params+'">'+
                         '<param name="wmode" value="transparent">' +
                         '<param name="allowscriptaccess" value="always">' +
                         '<embed src="'+$.mb_audioEmbedder.playerPath+'" type="application/x-shockwave-flash" ' +
                         'wmode="transparent" allowscriptaccess="always" ' +
                         'width="'+width+'" height="24"' +
                         'flashvars="soundFile='+params+'">' +
                         '</embed>' +
                         '</object>';

        if(isAudio)
          $.mb_audioEmbedder.mb_setAudio(context,pat,embedstring);
      });
    }
  };


  $.fn.mb_embedMovies=$.mb_videoEmbedder.mb_embedMovies;
  $.fn.mb_embedAudio=$.mb_audioEmbedder.mb_embedAudio;

})(jQuery);