/*
Plugin: Akkroo jQuery Focus Point
Licence: MIT Licence
Author: Andy Higgs, Akkroo Ltd
*/


(function( $ ){
	
	$.fn.focuspoint = function() {
			
		var calibrate = false;
		
		var elems = $(this);
		
		var applyOffsets = function (elem) {
		
			var background = $('.focuspoint-background',elem).css({left:0,top:0}), // Reset location first
				marker_img = $('.img-mark',elem),
				marker_frame = $('.frame-mark',elem),
				distance_from_window_top = $(elem).offset().top,
				tl = new TimelineLite;
	
			var img_marker_position = marker_img.offset(),
				frame_marker_position = marker_frame.position();
			
			// IE8 Hack when values might be null
			if (!frame_marker_position || !img_marker_position) {
				var frame_marker_position = {
					'left': 0,
					'top': 0
				};
				var img_marker_position = {
					'left': 0,
					'top': 0
				};
			}
				
			var	offset_x = frame_marker_position.left - img_marker_position.left,
				offset_y =  frame_marker_position.top - img_marker_position.top + distance_from_window_top;
			
			// Check if there is any visible space and compensate for it
			var frame_width = elem.outerWidth(),
				frame_height = elem.outerHeight(),
				img_width = background.width(),
				img_height = $('img',background).height();
				
			if (calibrate === true) {
				console.log('Frame: '+frame_width+'x'+frame_height+', Image '+img_width+'x'+img_height+', x-offset: '+offset_x+', y-offset: '+offset_y);
			}	
				
			// Top
			if (offset_y > 0){
				if (calibrate === true) console.log('top issue');
				offset_y = 0; 
			}
			// Bottom
			if (offset_y + img_height < frame_height) {
				if (calibrate === true) console.log('bottom issue');
			}
			// Left
			if (offset_x > 0) {
				if (calibrate === true) console.log('left issue');
				offset_x = 0;
			}
			// Right
			if (offset_x + img_width < frame_width) {
				console.log('right issue');
			}
		

	
			tl.append(TweenLite.to(background,.25,{opacity:0, ease: Sine.easeIn}));
			tl.addLabel('hide-everything');
			tl.insert(TweenLite.set(background,{top: offset_y, left: offset_x}),'hide-everything')
			tl.append(TweenLite.to(background,1.5,{opacity:1, ease: Sine.easeOut}));
			
			tl.play();

		}

		elems.each(function(){

			var $this = $(this);
		
			var subject_x_percent = $this.attr('data-background-subject-x-percent') ? $this.attr('data-background-subject-x-percent') : 0,
				subject_y_percent = $this.attr('data-background-subject-y-percent') ? $this.attr('data-background-subject-y-percent') : 0,
				frame_focus_x_percent = $this.attr('data-frame-focus-x-percent') ? $this.attr('data-frame-focus-x-percent') : 0,
				frame_focus_y_percent = $this.attr('data-frame-focus-y-percent') ? $this.attr('data-frame-focus-y-percent') : 0;
	
			if ($this.css('background-image') && $this.css('background-image') !== 'none') {
				var wrap = $('<div />',{'class': 'focuspoint-background'});
				var img = $('<img />',{src: $this.css('background-image').replace(/url\(/,'').replace(/\)/,'').replace(/"/g,'').replace(/'/g,'')});
				wrap.append(img);
				$this.css({backgroundImage:'none',position: 'relative'});
				img.on('load',function(){
			
					// Create markers to line up	
					var marker_frame = $('<div />',{ 'class': 'frame-mark', css:{opacity:0,width:'10px', height:'10px',background:'red',borderRadius: '50%', position:'absolute', zIndex:1000}});
					var marker_img = $('<div />',{ 'class': 'img-mark', css:{opacity:0,width:'10px', height:'10px',background:'yellow',borderRadius: '50%', position:'absolute', zIndex:1000}});
					$this.append(marker_frame);
					wrap.append(marker_img);

					// Position the markers
					marker_frame.css({top:frame_focus_y_percent+'%', left:frame_focus_x_percent+'%'});
					marker_img.css({top:subject_y_percent+'%', left:subject_x_percent+'%'});
				
					if (calibrate === true) {
						marker_img.add(marker_frame).css({opacity:1});
					};

					// Assign location
					applyOffsets($this);
				
				});
				$this.append(wrap);
			}
			
		});


		
		$(window).on('resize.focuspoint',function(){
			$.delayAction(function(){
				elems.each(function(){
					applyOffsets($(this));
				});
			},300);
		});
		

		
	};

})(jQuery);
