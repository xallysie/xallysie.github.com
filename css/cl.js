jQuery(document).ready(function($) {

    TweenLite.to($('.swipe-cover'), 0, {left:"0", ease:Power3.easeInOut});
    TweenLite.to($('.right-swipe-cover'), 0, {width:"0", ease:Power3.easeInOut});

    $(document).on("click",".share-toggle",function(){
        $(this).toggleClass("open");
    });
    $(document).on('mouseleave',"article .inner", function(){
        $('.share-toggle').removeClass('open');
    });

    $(document).on('click', '#backToTop, .backToTop', function(e){
        e.preventDefault();
        TweenLite.to( window, 1, {scrollTo:{y: 0 }, ease:Power2.easeOut});
    });

    $(window).scroll(function(){
        if ($("body").scrollTop() > 50) {
            $('.footer-icon').css({
                'visibility': 'visible',
                'opacity': '1'
            });
        } else {
            $('.footer-icon').css({
                'visibility': 'hidden',
                'opacity': '0'
            });
        }
    });

    $("article").fitVids();


    /*fix vid*/

    (function () {

        function resizeVideo(){
            var $video = $('.tumblr_video_container');

            var videoWidth = $video.width(),
                videoHeight = $video.height(),
                videoRatio = (videoHeight/videoWidth),

                newWidth = 560,
                newHeight = Math.floor(newWidth*videoRatio),

                mobileWidth = 260,
                mobileHeight = Math.floor(mobileWidth*videoRatio);

            if ($(window).width() < 640) {
                $video.css('width', '100%').css('height', mobileHeight);
                $video.find('iframe').height(mobileHeight);
            }
            else {
                $video.css('width', '100%').css('height', newHeight);
                $video.find('iframe').height(newHeight);
            }

            $(window).resize(function() {
                if ($(window).width() < 640) {
                    $video.css('width', '100%').css('height', mobileHeight);
                }
                else {
                    $video.css('width', '100%').css('height', newHeight);
                }
            });
        }
        resizeVideo();

    })();



   // Infinite Scroll/Isotope


    $(function(){
    
        var $container = $('.posts');

        // Isotope
        var isotope = $container.imagesLoaded(function(){
            $container.isotope({
                itemSelector: 'article',
                percentPosition: true,
                isFitWidth:true,

                masonry: {
                    columnWidth: '.grid-sizer',
                    gutter: '.gutter-sizer'
                }
            });
        });



        $container.infinitescroll({
            navSelector: ".pagination",
            nextSelector: ".pagination", //*to enable inf scroll, set ".pagination a.older",*//
            itemSelector: ".post",
            bufferPx: 99999, //*to enable inf scrool, set 2000*//
            behavior:'local',
            animate: false,
            loading: {
                img: '',
                finished: undefined,
                finishedMsg: '',
                msg: '',
                msgText: 'loading',
                speed: 'fast'
            }
          },function( newElements ) {
            var $newElems = $( newElements ).css({ opacity: 0 });
                $newElems.imagesLoaded(function(){
                    pageNumber++; 
                    Tumblr.LikeButton.get_status_by_page(pageNumber); 
                    $newElems.animate({ opacity: 1 }, 500);
                    $("article").fitVids();
                    $container.isotope( 'appended', $newElems, true );
                    $('.post-photoset').inlinePhotosets();
                    
                    $('.tooltip').tooltipster({
                       animation: 'fade',
                       delay: 0,
                       theme: 'fusetip',
                       touchDevices: false,
                       trigger: 'hover'
                    });

                });
          });
      });


    


    $('.post-photoset').inlinePhotosets();




    if (aboutSection == true) {

	    /** About Box **/

	    (function( window ){

	        'use strict';

	        var body = document.body,
	            toggleAbout = document.querySelector( ".about-toggle" ),
	            aboutBox = document.querySelector( ".about-box" ),
	            overlay = document.querySelector( ".action-overlay" ),
	            aboutOpen = false;
	        ;

	        toggleAbout.addEventListener( "click", function(){
	            classie.toggle( aboutBox, "open" );
	            classie.toggle( toggleAbout, "open" );
	            classie.toggle( overlay, "open" );
	            aboutOpen = true;
	        } );

            $('body').on('click', function(e) {
                if (!$(e.target).closest('.about-box, .about-bio').length && aboutOpen == true){
    		            classie.remove( overlay, "open" );
    		            classie.remove( aboutBox, "open" );
    		            classie.remove( toggleAbout, "open" );
    		            aboutOpen = false;
                }
           });

            $('.action-overlay').on('click', function() {
                if(aboutOpen == true) {
                    classie.remove( overlay, "open" );
                    classie.remove( aboutBox, "open" );
                    classie.remove( toggleAbout, "open" );
                    aboutOpen = false;
                }
            });

			$(document).keyup(function(e) {
				if (aboutOpen == true) {
				    if (e.which == 27) {
			            classie.remove( overlay, "open" );
			            classie.remove( aboutBox, "open" );
			            classie.remove( toggleAbout, "open" );
			            aboutOpen = false;
				  	}
			  	}
			});

	    })( window );
	}




if (headerNav == true) {




    /** Menu **/

    (function( window ){

        'use strict';

        var body = document.body,
            overlay = document.querySelector( ".action-overlay" ),
            toggleMenu = document.querySelector( ".navigation-burger" ),
            closeMenu = document.querySelector( ".close-nav" ),
            closePage = document.querySelector( ".close-page" ),
            headerMenu = document.querySelector( ".main-menu" ),
            menuOpen = false
            ;
        ;


        // Menu

        toggleMenu.addEventListener( "click", function(){
            if (menuOpen == false) {
	            classie.toggle( headerMenu, "open" );
	            classie.toggle( overlay, "open" );
	            classie.toggle( body, "menu-open" );
	            classie.remove( toggleMenu, "open-nav" );
	            classie.add( toggleMenu, "close-nav" );
            	menuOpen = true;

	        }
	        else if (menuOpen == true) {
		        classie.remove( headerMenu, "open" );
		        classie.remove( overlay, "open" );
		        classie.remove( body, "menu-open" );
		        classie.remove( toggleMenu, "close-nav" );
		        classie.add( toggleMenu, "open-nav" );
		        menuOpen = false;

	        }
        });

        // Close - click outside
        $('body').on('click', function(e) {
            if (!$(e.target).closest('.main-menu, .navigation-burger').length && $('body').hasClass('menu-open')){
                classie.remove( headerMenu, "open" );
                classie.remove( overlay, "open" );
                classie.remove( body, "menu-open" );
                classie.remove( toggleMenu, "close-nav" );
                classie.add( toggleMenu, "open-nav" );
                menuOpen = false;
            }
        });

    })( window );

}




    // Social Boxes

    // Social Width

    var socialWidth = $('.social-icons').outerWidth()
    $(".social-icons").css('width', socialWidth);
    $(".header-widgets").css('padding-left', socialWidth);

 	if (socialWidgets == true) {


    // Stop/Start Scroll

    function disableWidgetScrolling() {
        var selScrollable = '.header-widgets';
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

    function enableWidgetScrolling() {
        $(document).off('touchmove');
        $('body').off('touchmove touchstart', '.header-widgets');
    }


    (function( window ){

        'use strict';

        var body = document.body,
            widgetToggle = document.getElementsByClassName('widget-toggle' ),
            widgetBox = document.querySelector( ".header-widgets" ),
            closeBox = document.querySelector( ".close-box" ),
            toggleInstagram = document.querySelector( ".instagram-toggle" ),
            instagramBox = document.querySelector( ".instagram" ),
            toggleTwitter = document.querySelector( ".twitter-toggle" ),
            twitterBox = document.querySelector( ".twitter" ),
            overlay = document.querySelector( ".action-overlay" ),
            toggleAbout = document.querySelector( ".about-toggle" ),
            aboutBox = document.querySelector( ".about-box" ),
            widgetOpen = false,
            instagramOpen = false,
            twitterOpen = false,
            soundcloudOpen = false
            ;
        ;

        // Trigger Widget
        [].forEach.call(document.querySelectorAll('.widget-toggle'), function (widgettrigger) {
            widgettrigger.addEventListener('click', function (e) {
                e.stopPropagation();
                if ( $("#about-box").hasClass( "open" ) ) {
                    classie.remove( aboutBox, "open" );
                    classie.remove( toggleAbout, "open" );
                }

                if (widgetOpen == false) {
                    classie.toggle( body, "widget-open" );
                    classie.toggle( overlay, "open" );
                    classie.toggle( widgetBox, "open" );
                    disableWidgetScrolling();
                    widgetOpen = true;
                }

            });
        });

        if (instagramSection == true) {

	        // Instagram

	        toggleInstagram.addEventListener( "click", function(e){
	            e.stopPropagation();
	            if (instagramOpen == false) { 
	                if (twitterOpen == true) {
	                    classie.remove( twitterBox, "open" );
	                    classie.remove( toggleTwitter, "open" );
	                    twitterOpen = false;
	                }
	                classie.add( instagramBox, "open" );
	                classie.add( toggleInstagram, "open" );
	                instagramOpen = true;
	            }
	            else if (instagramOpen == true) {
	                classie.remove( instagramBox, "open" );
	                classie.remove( toggleInstagram, "open" );
	                classie.remove( body, "widget-open" );
	                classie.remove( overlay, "open" );
	                classie.remove( widgetBox, "open" );
	                instagramOpen = false;
                    enableWidgetScrolling();
	                widgetOpen = false;
	            }
	        } );

 		}

 		if (twitterSection == true) {

	        // Twitter

	        toggleTwitter.addEventListener( "click", function(e){
	            e.stopPropagation();
	            if (twitterOpen == false) { 
	                if (instagramOpen == true) {
	                    classie.remove( instagramBox, "open" );
	                    classie.remove( toggleInstagram, "open" );
	                    instagramOpen = false;
	                }
	                classie.add( twitterBox, "open" );
	                classie.add( toggleTwitter, "open" );
	                twitterOpen = true;
	            }
	            else if (twitterOpen == true) {
	                classie.remove( twitterBox, "open" );
	                classie.remove( toggleTwitter, "open" );
	                classie.remove( body, "widget-open" );
	                classie.remove( overlay, "open" );
	                classie.remove( widgetBox, "open" );
	                twitterOpen = false;
                    enableWidgetScrolling();
	                widgetOpen = false;
	            }
	        } );

 		}



        // Close - button
        closeBox.addEventListener( "click", function(e){
            classie.remove( body, "widget-open" );
            classie.remove( overlay, "open" );
            classie.remove( widgetBox, "open" );
            enableWidgetScrolling();
            widgetOpen = false;
            // add close instagram/twitter widget function
            if (instagramOpen == true) { 
                instagramOpen = false;
                classie.remove( instagramBox, "open" );
                classie.remove( toggleInstagram, "open" );
            }
            if (twitterOpen == true) {
                classie.remove( twitterBox, "open" );
                classie.remove( toggleTwitter, "open" );
                twitterOpen = false;
            }
        } );

        // Close - click outside
        $('body').on('click', function(e) {
            if (!$(e.target).closest('.header-widgets, .close-box').length && $('body').hasClass('widget-open')){
                if (widgetOpen == true) {
                    classie.remove( body, "widget-open" );
                    classie.remove( overlay, "open" );
                    classie.remove( widgetBox, "open" );
                    widgetOpen = false;
                    enableWidgetScrolling();
                    // add close instagram/twitter widget function
                }
                if (instagramOpen == true) { 
                    instagramOpen = false;
                    classie.remove( instagramBox, "open" );
                    classie.remove( toggleInstagram, "open" );
                }
                if (twitterOpen == true) {
                    classie.remove( twitterBox, "open" );
                    classie.remove( toggleTwitter, "open" );
                    twitterOpen = false;
                }
            }
        });

        // Close - esc button
        $(document).keyup(function(e) {
            if (e.which == 27) {
                enableWidgetScrolling();
                if (widgetOpen == true) {
                    classie.remove( body, "widget-open" );
                    classie.remove( overlay, "open" );
                    classie.remove( widgetBox, "open" );
                    widgetOpen = false;
                    // add close instagram/twitter widget function
                }
                if (instagramOpen == true) { 
                    instagramOpen = false;
                    classie.remove( instagramBox, "open" );
                    classie.remove( toggleInstagram, "open" );
                }
                if (twitterOpen == true) {
                    twitterOpen = false;
                    classie.remove( twitterBox, "open" );
                    classie.remove( toggleTwitter, "open" );
                }
            }
        });



    })( window );    

	}






	// // Widgets

 //    if (instagramWidget == true) {

 //        $('.instagram-feed').instagramLite({
 //            username: instagramUsername,
 //            clientID: 'c9791af6a23a4ca99ee0c91a7936f284',
 //            urls: true,
 //            videos: true,
 //            likes: true,
 //            limit: instagramCount,
 //            loadMore: '.il-load-more',
 //            error: function(errorCode, errorMessage) {
 //            console.log('There was an error');
 //            if(errorCode && errorMessage) {
 //                alert(errorCode +': '+ errorMessage);
 //            }
 //            },
 //        });

 //    };



});