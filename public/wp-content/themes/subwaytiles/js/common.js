(function($){
	


$(document).ready(function(){
	
	console.log('herro');
	
	window['ST'] = Guru;

	var jsui = new JSUI();
	//jsui.count = 2;
	jsui.wrap = 'yo';
	jsui.speed = 10;
	
	console.log(jsui);
	
	jsui.init();

});	


function JSUI(){
	//to do:  get images, and index them by size.  fit them together like a puzzle.
	var me = this;
	
	me.nav = $('nav#jsui');
	me.navUl = me.nav.children('ul#posts');
	me.count = 1;
	me.speed = 50; //for the img append timeout
	me.page = 1;
	me.getting = false;
	me.wrap = 'content';
	//me.url = ST.Url + '/api/';
	me.url = Guru.Url;
	
	me.init = function(){
		console.log('initiating');
		me.uiInit();
		
		if ( $('#'+me.wrap).length < 1 ) {
			$('<div id="'+me.wrap+'"></div>').insertBefore('#end');	
		}
		
		me.getPosts();
		
		$(document).scroll(function(e){
			
//			console.log('scroll');
//			console.log($('body').height());
//			console.log( $(document).scrollTop() );
//			console.log(e);
			console.log(me.getting);
			
			if (!me.getting){
				if ( $(document).scrollTop() > $('body').height() - 5000 ) {
					me.getPosts();	
				}
			}
			
		});
	};
	
	me.uiInit = function(){
				
		$('#menuToggle').click(function(){
			
			me.navUl.slideToggle(200);
				
		});		

		
		
			
	};
	

	
	me.getPageTitles = function(){};

	
	me.getPosts = function(){
		console.log('getPosts');
		
		me.getting = true;
		
		var request = '?json=get_recent_posts&';
			me.count > 0 ? request += 'count='+me.count+'&' : $.noop();
			request += 'page='+me.page+'&';
		
		//console.log(request);
		
		$.getJSON( me.url + request, function(json){
        
        	//console.log(json);
	        	        
	        for ( var i=0; i<json.posts.length; i++ ){
	            var post = json.posts[i];
	            
	            //console.log(post);
	            
	            $('<span>', { id: post.slug }).appendTo('#'+me.wrap);
	            
	            $('<a>', {href: '#'+post.slug})
	            	.html( post.title )
	            	.appendTo( me.navUl )
	            	.wrap('<li>')
	            	.click(function(e){
	            		
	            		//console.log('nav page link clicked');
	            		
	            	});
	            
	            var k=0;
	            
	            var timeoutFunc = function(l, wrap, post){
	            	
	            	me.getting = true;
	            	
	            	var j = l;
	            	var thisPost = post;
	            		            	
	            	if ( j < post.attachments.length ) {
		            	var attachment = post.attachments[j];
		                
		                if ( attachment.mime_type.indexOf('image') > -1 ){
		                    var full = attachment.images.full,
		                        img  = '<img src="'+full.url+'" height="'+full.height+'" width="'+full.width+'" />';
		                        
		                    //$('#'+me.wrap).append( img );
		                    $(img).appendTo('#'+wrap).lazyload({
					    	   placeholder : ST.TemplateUrl + "/images/transparent.gif",
					    	   effect      : "fadeIn"
					    	});
		                
		                }//end if
		                
		                setTimeout( function(){ timeoutFunc(j+1, wrap, thisPost); }, me.speed );	
		                
	            	} else {
       			        me.getting = false;	
	            	}
	            };
	            timeoutFunc(k, me.wrap, post);
	            
	        }//end for
	     
	        me.page += 1;
	        
		});//get
		
			
	};
	
	return me;
}	


})(jQuery);
