/*!
 * Fuse Modal
 * Version: 1.0
 * Development
 * 
 * @author: http://fuseblue.com
 *
*/
$(function($){

	manualState = true;
	clickDisabled = false;

	$(window).load(function() {
		var History = window.History,
			State = History.getState();
	});

	TweenLite.to($('.fuse-overlay'), 0, {opacity:0, force3D:true});

	$(document).on('click', '.post-photo .media > a, .post-expand, .open-post', function(e){
		e.preventDefault();
		var thisID = $(this).attr('data-id'),
			thisPostType = $('#' + thisID).attr('data-pt');

		postRequest(thisID, 1);
		nextPost(thisID, true, thisPostType);
		manualState = false;
	});

	$('.go-back').on('click', function(e){
		var History = window.History,
			State = History.getState(),
			thisID = State.data.id,
			stateData = { id:2, state: 0 },
        	title = TUMBLR_TITLE,
        	url = TUMBLR_URL;
		closeModal(thisID);
		// askPage(0);

		History.pushState(stateData, title, url);
        manualState = false;
	});

	$('.fuse-next-btn, .fuse-prev-btn').on('click', function(e){
		if (clickDisabled) return;
		var History = window.History,
			State = History.getState(),
			thisID = $(this).attr('post-id'),
			thisPostNotes = $(this).attr('data-notes'),
			thisPostType = $(this).attr('data-pt'),
			currID = State.data.id;
		$('.fuse-caption').removeClass('visible').empty();
		$('#' + currID).removeClass('modal-active');
		$('.fuse-container').removeClass('content-text');
		$('.fuse-container').removeClass('content-video');	
		postRequest(thisID, 2);
		nextPost(thisID, false, thisPostType);
		manualState = false;
		clickDisabled = true;
		setTimeout(function(){clickDisabled = false;}, 200);
	});
	$('.fuse-ask-page').on('click', function(e){
		e.preventDefault();
		if (clickDisabled) return;
		var History = window.History,
			State = History.getState(),
		    stateData = { id:'ask-page', state: 'ask-page', postType: 'ask-page' };

		$('.fuse-overlay').addClass('visible ask-page');
		$('.fuse-content').load(TUMBLR_URL + 'ask #posts');
		setTimeout(function(){
			askPage(1);
		}, 500);
		// console.log('s');
		// postRequest(thisID, 2);
		// nextPost(thisID, false, thisPostType);

		manualState = false;
		clickDisabled = true;
		setTimeout(function(){clickDisabled = false;}, 200);

		History.pushState(stateData, 'Ask', TUMBLR_URL + 'ask');
	});
	function askPage(state){
		var windowHeight = $(window).height(),
			$page = $('.page');

		setTimeout(function(){
			$('html').addClass('modal-open');		
		}, 500);

		disablePostScrolling();

			// might need to add open-modal body classes
		if ( state == 1 ) {
			TweenLite.to($page, 1, {y:windowHeight, delay:0.2, force3D:true, ease:Power3.easeInOut});
			TweenLite.to($page, 0.7, {opacity:0, delay:0.5, ease:Power3.easeInOut});
			TweenLite.to($('.fuse-overlay'), 1, {opacity:1, delay:0.8, force3D:true, ease:Power3.easeInOut});
		} 

	}
    $('body').on('click', function(e) {
			var History = window.History,
				State = History.getState(),
				thisID = State.data.id,
				stateData = { id:2, state: 0 },
	        	title = TUMBLR_TITLE,
	        	url = TUMBLR_URL;

        if (!$(e.target).closest('.fuse-container, .nav-toggle, .fuse-close-sidebar, .close-sidebar, .sidebar').length && $('html').hasClass('modal-open')){
			closeModal(thisID);
			History.pushState(stateData, title, url);
        }
	    manualState = false;
    });

	$(document).keyup(function(e) {
		if (clickDisabled) return;
		var History = window.History,
			State = History.getState(),
			thisID = State.data.id,
			prevPostType = $('.fuse-prev-btn').attr('data-pt'),
			prevID = $('.fuse-prev-btn').attr('post-id'),
			nextPostType = $('.fuse-next-btn').attr('data-pt'),
			nextID = $('.fuse-next-btn').attr('post-id'),
			stateData = { id:2, state: 0 },
        	title = TUMBLR_TITLE,
        	url = TUMBLR_URL;
        if ( $('html').hasClass('modal-open') ) {
			if (e.keyCode == 27 ) {
				// ESC
				closeModal(thisID);
				History.pushState(stateData, title, url);
			}
			if (e.keyCode == 37 || e.keyCode == 38) {
				// LEFT - UP
				$('.fuse-caption').removeClass('visible').empty();
				$('#' + thisID).removeClass('modal-active');
				$('.fuse-container').removeClass('content-text');
				$('.fuse-container').removeClass('content-video');	
				postRequest(prevID, 2);
				nextPost(prevID, false, prevPostType);
			}
			if (e.keyCode == 39 || e.keyCode == 40) {
				// RIGHT - DOWN
				$('.fuse-caption').removeClass('visible').empty();
				$('#' + thisID).removeClass('modal-active');
				$('.fuse-container').removeClass('content-text');
				$('.fuse-container').removeClass('content-video');	
				postRequest(nextID, 2);
				nextPost(nextID, false, nextPostType);
			}
	        manualState = false;
	        clickDisabled = true;
			setTimeout(function(){clickDisabled = false;}, 700);
		}
	});


	function postRequest(postID, dataState) {
		var History = window.History,
			State = History.getState();
		$.ajax({
		    type: 'GET',
		    url: "http://api.tumblr.com/v2/blog/" + TUMBLR_HOSTNAME + "/posts?api_key=" + TUMBLR_API_KEY + "&notes_info=true&reblog_info=true&id=" + postID,
		    dataType: 'jsonp'
		}).done(function(data) {
			var thisID = data.response.posts[0].id_string,
		    	postURL = TUMBLR_URL + "post/" + thisID + "/" + data.response.posts[0].slug,
        		postTitle = TUMBLR_TITLE + " - " + data.response.posts[0].summary,
        		thisPostType = data.response.posts[0].type,
		    	contentLoad = new TimelineMax(),
		    	obContainer = $('.fuse-container')
				obContent = $(".fuse-container .fuse-content"),
				obCaption = $('.fuse-caption');

			if ( thisPostType == "photo" ) {
				if ( data.response.posts[0].photoset_layout ) thisPostType = "photoset";
			}

		    var stateData = { id:thisID, state: dataState, postType: thisPostType };

			obCaption.append("<div class='caption'></div>");

			// Caption
			if ( data.response.posts[0].caption != "" && typeof data.response.posts[0].caption != "undefined" ) {
				obCaption.find('.caption').append( data.response.posts[0].caption + "</div>");
			}

			obCaption.append( "<div class='btm cl'></div>" );

        	// Post date / note count
			obCaption.find('.btm').prepend("<div class='date-notes'></div>");
	        var rawDate = data.response.posts[0].date.slice(0,10),
       			postDate = $.datepicker.formatDate('d MM yy', new Date( rawDate ));
	        var postDateHTML =  "<a href='" + data.response.posts[0].post_url + "'>" + postDate + "</a> ";
	        obCaption.find('.date-notes').append( postDateHTML );
	        var postNotesHTML =  "<a href='" + data.response.posts[0].post_url + "#notes" + "'>" + data.response.posts[0].note_count + " notes" + "</a>";
	        obCaption.find('.date-notes').append( postNotesHTML );


	   		// Share
			var shareBtns = $('#' + thisID + ' .post-footer .share').clone();
			obCaption.find('.btm').prepend(shareBtns.removeClass('right').addClass('cl'));
			obCaption.find('.btm .post-expand').remove()
	  //  		// Exif
			// if ( thisPostType == "photo" && data.response.posts[0].photos[0].exif ) {
			// 	obCaption.find('.btm').addClass('exif');
			// 	var exifHTML = "<div class='iso'><i>ISO </i>" + data.response.posts[0].photos[0].exif.ISO + "</div>";
			// 		exifHTML += "<div class='aperture'><p>" + data.response.posts[0].photos[0].exif.Aperture + "</p></div>";
			// 		exifHTML += "<div class='exposure'><p>" + data.response.posts[0].photos[0].exif.Exposure + "</p></div>";
			// 	obCaption.find('.btm').prepend(exifHTML);
			// }

			// Tags
	        var dataTags = data.response.posts[0].tags;
	        if ( dataTags.length > 0 ) {
				obCaption.append( "<ul class='tags'></ul>" );
		        $.each( dataTags , function(key, val) {
		        	var postTagHTML = "<li><a href='http://" + TUMBLR_HOSTNAME + "/tagged/" + val + "'>";
		        		postTagHTML += "#" + val;
		        		postTagHTML += "</a></li>";
				    obCaption.find('.tags').append( postTagHTML );
				});
	   		}

			/* 
			 Notes 
			*/

			$.ajax({
				type : 'POST',
				url : $("article#" + data.response.posts[0].id_string).attr('data-notes'),
				dataType : 'html',
				success : function(html){
				  $('.fuse-caption .btm').append(html);
				}
			});


				/*
			 if ( data.response.posts[0].notes ) {
			 	$('.atx-popup .atx-post .inner').append("<div id='notes'></div>");
			 	$('.atx-popup #notes').append("<ol class='notes'></ol>");
		         $.each( data.response.posts[0].notes , function(key, val) {
		         	var noteBlogName = data.response.posts[0].notes[key].blog_name,
		         		noteBlogUrl = data.response.posts[0].notes[key].blog_url,
		         		noteBlogStripUrl = noteBlogUrl.slice(7,9999),
		         		noteBlogId = data.response.posts[0].notes[key].post_id,
		         		noteBlogType = data.response.posts[0].notes[key].type;
	         		$.ajax({
	         		    type: 'GET',
			 		    url: "http:api.tumblr.com/v2/blog/" + noteBlogStripUrl + "posts?api_key=" + KEY + "&id=" + noteBlogId + "&reblog_info=true",
			 		    dataType: 'jsonp',
			 			success: function( sourceData ) {
			 	        	if ( noteBlogType === "like" ) { 
			 		        	var theNoteLike = "<li class='note like'>";
			 		        		theNoteLike += "<a rel='nofollow' class='avatar_frame' target='_blank' href='" + noteBlogUrl + "' title=''>";
			 		        		theNoteLike += "<img src='http:api.tumblr.com/v2/blog/" + noteBlogStripUrl + "avatar/16' class='avatar' alt=''>";
			 		        		theNoteLike += "</a>";
			 		        		theNoteLike += "<span class='action'>";
			 		        		theNoteLike += "<a rel='nofollow' href='" + noteBlogUrl + "' class='tumblelog' title='" + noteBlogName + "'>" + noteBlogName + "</a>";
			 		        		theNoteLike += " likes this";
			 		        		theNoteLike += "</span>";
			 		        		theNoteLike += "<div class='clear'></div>";
			 		        		theNoteLike += "</li>";
			 				   	$('.atx-popup #notes ol.notes').append( theNoteLike );
			 	        	} else if ( noteBlogType === "reblog" ) {
			 					var noteSourceBlogUrl = sourceData.response.posts[0].reblogged_from_url,
		         					noteSourceBlogName = sourceData.response.posts[0].reblogged_from_name;
			 		        	var theNoteReblog = "<li class='note reblog'>";
			 		        		theNoteReblog += "<a rel='nofollow' class='avatar_frame' target='_blank' href='" + noteBlogUrl + "' title=''>";
			 		        		theNoteReblog += "<img src='http:api.tumblr.com/v2/blog/" + noteBlogStripUrl + "avatar/16' class='avatar' alt=''>";
			 		        		theNoteReblog += "</a>";
			 		        		theNoteReblog += "<span class='action' data-post-url='" + noteBlogUrl + "post/" + noteBlogId + "'>";
			 		        		theNoteReblog += "<a rel='nofollow' href='" + noteBlogUrl + "' class='tumblelog' title='" + noteBlogName + "'>" + noteBlogName + "</a>";
			 		        		theNoteReblog += "</span>";
			 		        		theNoteReblog += " reblogged this from ";
			 		        		theNoteReblog += "<a rel='nofollow' href='" + noteSourceBlogUrl + "' class='source_tumblelog' target='_blank' title='" + noteSourceBlogName + "'>" + noteSourceBlogName + "</a>";
			 		        		theNoteReblog += "<div class='clear'></div>";
			 		        		theNoteReblog += "</li>";
			 			   		$('.atx-popup #notes ol.notes').append( theNoteReblog );
			 			   	} else {
			 		        	var theNotePosted = "<li class='reblog posted'>";
			 		        		theNotePosted += "<a rel='nofollow' class='avatar_frame' target='_blank' href='" + noteBlogUrl + "' title=''>";
			 		        		theNotePosted += "<img src='http:api.tumblr.com/v2/blog/" + noteBlogStripUrl + "avatar/16' class='avatar' alt=''>";
			 		        		theNotePosted += "</a>";
			 		        		theNotePosted += "<span class='action'>";
			 		        		theNotePosted += "<a rel='nofollow' href='" + noteBlogUrl + "' class='tumblelog' title='" + noteBlogName + "'>" + noteBlogName + "</a>";
			 		        		theNotePosted += " posted this";
			 		        		theNotePosted += "</span>";
			 		        		theNotePosted += "<div class='clear'></div>";
			 		        		theNotePosted += "</li>";
			 			   		$('.atx-popup #notes ol.notes').append( theNotePosted );
			 			   	}
			 			}			
	         		});
			 	});
			 }


			*/

			
			History.pushState(stateData, postTitle, postURL);
		});
	}

	function closeModal(thisID) {
		$('html').removeClass('modal-open');
		$('.fuse-overlay').removeClass('visible');
		setTimeout(function(){
	    	$(".fuse-container").removeClass('ask');
			$('#' + thisID).removeClass('modal-active');
			$('.fuse-caption, .fuse-content').removeClass('visible').empty();	
			$('.fuse-container').removeAttr('style');
			$('.fuse-container').removeClass('content-text');
			$('.fuse-container').removeClass('content-video');
		}, 400);


		TweenLite.to($('#right'), 0.5, {opacity:1, delay:0.8, ease:Power3.easeInOut});
		TweenLite.to($('.swipe-cover'), 0.8, {left:'100%', delay:0, ease:Power3.easeInOut});
		TweenLite.to($('.fuse-overlay'), 0.5, {opacity:0, force3D:true, ease:Power3.easeInOut});

		enablePostScrolling();
	}

	function nextPost(thisID,open,thisPostType) {
		disablePostScrolling();

		var	thisDiv = $('#' + thisID),
			thisA = $('#' + thisID + ' .media a'),
			thisImgSrc = $('#' + thisID + ' .media a img').attr('src'),
			$window = $(window),
			scrollTop = $window.scrollTop(),
			divOffset = thisDiv.offset(),
			divWidth = thisDiv.outerWidth(),
			divHeight = thisDiv.outerHeight(),
			obContainer = $(".fuse-container"),
			newDivWidth = obContainer.width(),
			newDivHeight = newDivWidth * (divHeight / divWidth),
			viewportY = ($window.height() / 2),
			viewportX = ($window.width() / 2),
			divCenterY = (newDivHeight / 2),
			divCenterX = divOffset.left + (newDivWidth / 2),
			translateY = viewportY - divCenterY,
			translateX = viewportX - divCenterX,
			nextIDS = $('article#' + thisID).nextAll().slice(0, 2),
			prevIDS = $('article#' + thisID).prevAll().slice(0, 2),
   			nextID,
        	prevID,
        	nextPostType,
        	prevPostType,
        	windowCentDiv = $('#' + thisID).offset().top, 
			obContent = $(".fuse-container .fuse-content"),
			load = new TimelineMax();

		$.each(nextIDS, function(i,v){
			if ( i === 0 && v.localName == 'article' ) {
				nextID = v.id;
				nextPostType = v.attributes["data-pt"].nodeValue;
				return (i !== 0);
			} else {
				if (i === 1) {
					nextID = v.id;
					if (v.attributes["data-pt"]) {
						nextPostType = v.attributes["data-pt"].nodeValue;
					}
				}
			}
		});
		$.each(prevIDS, function(i,v){
			if ( i === 0 && v.localName == 'article' ) {
				prevID = v.id;
				prevPostType = v.attributes["data-pt"].nodeValue;
				return (i !== 0);
			} else {
				if (i === 1) {
					prevID = v.id;
					if (v.attributes["data-pt"]) {
						prevPostType = v.attributes["data-pt"].nodeValue;
					}
				}
			}
		});	

		setTimeout(function(){
			$('html').addClass('modal-open');
		}, 500);

		$('#' + thisID).addClass('modal-active');

		$('.fuse-caption').removeClass('visible').empty();

		obContent.empty();

		// TweenLite.to( $('.fuse-caption'), .3, { height: 0, ease: Power4.easeInOut });

		// Animations 

		windowHeight = $window.height(),
		TweenLite.to($('#right'), 0.5, {opacity:0, ease:Power3.easeInOut});
		TweenLite.to($('.swipe-cover'), 0.5, {left:'0', delay:0, ease:Power3.easeInOut});

		TweenLite.to($('#backToTop'), 0.4, {opacity:0, force3D:true, ease:Power3.easeInOut});
		TweenLite.to($('.fuse-overlay'), 1, {opacity:1, delay:0.8, force3D:true, ease:Power3.easeInOut});

		$('.fuse-prev-btn').attr({
			'post-id': prevID,
			'data-pt': prevPostType
		});
        $('.fuse-next-btn').attr({
        	'post-id': nextID,
			'data-pt': nextPostType
        });
	    
		if (thisPostType == "photo") {
			if ( open == true ) {
				obContent.append("<img src='" + thisImgSrc + "'>");
		    } else {
				obContent.append("<img src='" + thisImgSrc + "'>");
		    }
		} else if (thisPostType == "photoset") {
			var photosetContent = thisDiv.children().clone();
			obContent.css({
				'background-image': 'url()',
				'background-color': 'transparent'
			});
	    	obContent.html("<div class='photoset'></div>");
			obContent.find('.photoset').html(photosetContent);
			obContent.find('.post-footer').remove();
	        $('.fuse-content .photoset').inlinePhotosets();
		} else if (thisPostType == "video") {
			var vidContent = thisDiv.find('.media').clone();
			$('.fuse-container').addClass('content-video');	
			obContent.css({
				'background-image': 'url()',
				'background-color': '#000'
			});
			vidContent.find('iframe').attr('height', newDivHeight);
			obContent.html(vidContent);
    		$(".fuse-content").fitVids();

		} else if ( thisPostType == "answer" ) {
			var quoteContent = thisDiv.find('.content').clone(),
				translateY = viewportY - (thisDiv.find('.content').outerHeight()/2);

			obContent.css({
				'background-image': 'url()',
				'background-color': 'transparent'
			});	
			obContent.html("<div class='post-" + thisPostType + "'></div>" );
			obContent.find('.post-' + thisPostType).html(quoteContent);
			$('.fuse-container').addClass('content-text');

		} else if (thisPostType == "audio") {
			var audioContent = thisDiv.find('.media').clone(),
				divWidth = "100%",
				newDivHeight = (newDivHeight - 49);

			obContent.css({
				'background-image': 'url()',
				'background-color': 'transparent'
			});
			audioContent.find('iframe').attr('height', newDivHeight);
			obContent.html(audioContent);
    		$(".fuse-content").fitVids();
    		$('.fuse-container').addClass('content-text');
		} else if (thisPostType == "chat") {
			var chatContent = thisDiv.find('.chat').clone(),
				translateY = viewportY - (thisDiv.find('.chat').outerHeight()/2);

			obContent.css({
				'background-image': 'url()',
				'background-color': 'transparent'
			});	
			obContent.html("<div class='post-" + thisPostType + "'></div>" );
			obContent.find('.post-' + thisPostType).html(chatContent);
			$('.fuse-container').addClass('content-text');
		} else {
			var quoteContent = thisDiv.find('.content').clone(),
				translateY = viewportY - (thisDiv.find('.content').outerHeight()/2);

			obContent.css({
				'background-image': 'url()',
				'background-color': 'transparent'
			});	
			obContent.html("<div class='post-" + thisPostType + "'></div>" );
			obContent.find('.post-' + thisPostType).html(quoteContent);
			$('.fuse-container').addClass('content-text');
		}



        if ( open == true ) {
			$('.fuse-overlay').addClass('visible');
	    } else {
			TweenLite.to( window, .5, {scrollTo:{y: windowCentDiv }, ease:Power2.easeOut});
	    }




	}
    History.Adapter.bind( window, 'statechange', function() {
		if (clickDisabled) return;
		var History = window.History,
			State = History.getState(),
			savedStates = History.savedStates,
			prevUrlIndex = savedStates.length - 2;
		$('#tumblr_controls_wrap, #tumblr_controls').remove();
		if ( manualState == true ) {
			if (State.data.state === 0) {
				var thisID = savedStates[prevUrlIndex].data.id;
				closeModal(thisID);
			} else  {
				var thisID = State.data.id,
					thisPostType = State.data.postType;
				postRequest(thisID, State.data.state);
				if ( $('html').hasClass('modal-open') ) {
					nextPost(thisID, false, thisPostType);
				} else {
					nextPost(thisID, true, thisPostType);
				}
			}
		}
		manualState = true;
		// setTimeout(function(){
		// 	$('.fuse-overlay .tumblr-controls').load(State.url + ' #tumblr_controls');
		// }, 1500);
    });
});

// Stop/Start Scroll

function disablePostScrolling() {

    var selScrollable = '.fuse-overlay';
    // Uses document because document will be topmost level in bubbling
    $(document).on('touchmove',function(e){
      e.preventDefault();
    });
    // Uses body because jQuery on events are called off of the element they are
    // added to, so bubbling would not work if we used document instead.
    $('body').on('touchstart', selScrollable, function(e) {
      if (e.currentTarget.scrollTop === 0) {
        e.currentTarget.scrollTop = 1;
      } else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
        e.currentTarget.scrollTop -= 1;
      }
    });
    $('body').on('touchmove', selScrollable, function(e) {
        // Only block default if internal div contents are large enough to scroll
        // Warning: scrollHeight support is not universal. (http://stackoverflow.com/a/15033226/40352)
        if($(this)[0].scrollHeight > $(this).innerHeight()) {
            e.stopPropagation();
        }
    });

}

function enablePostScrolling() {
    $(document).off('touchmove');
    $('body').off('touchmove touchstart', '.fuse-overlay')
}