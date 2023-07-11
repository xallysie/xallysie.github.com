if (window.innerWidth > 740) {
    $(window).scroll(function() {
        
        //After scrolling 2px from the top...
        if ( $(window).scrollTop() >= 2 ) {
            $('#left').css({'width': '0%',
                            'background-image': 'url(' + currentimage + ')',
                            'transition': 'all 1s' });
            $('#right').css({'width': '100%',
                             'transition': 'all 1s' });
    
        //Otherwise remove inline styles and thereby revert to original stying
        } else {
            $('#left').css({'width': '50%',
                            'background-image': 'url(' + currentimage + ')',
                            'transition': 'all 1s' });
            $('#right').css({'width': '50%',
                             'transition': 'all 1s' });
        }
        
        });
}


$(window).on('resize', function() {
    if ($(window).width() > 740) {
        $(window).scroll(function() {
        
            //After scrolling 2px from the top...
            if ( $(window).scrollTop() >= 2 ) {
                $('#left').css({'width': '0%',
                                'background-image': 'url(' + currentimage + ')',
                                'transition': 'all 1s' });
                $('#right').css({'width': '100%',
                                'transition': 'all 1s' });
        
            //Otherwise remove inline styles and thereby revert to original stying
            } else {
                $('#left').css({'width': '50%',
                                'background-image': 'url(' + currentimage + ')',
                                'transition': 'all 1s' });
                $('#right').css({'width': '50%',
                                 'transition': 'all 1s' });
            }
            
            });
    } 
  });
