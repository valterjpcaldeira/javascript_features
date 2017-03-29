//http://suggestqueries.google.com/complete/search?client=chrome&q=gravidez
var form = document.querySelector('#form');
var list = document.querySelector('.list');
var engineID = "002582426417929266832:m6ideqoixca";
var apiKey = "AIzaSyBmBkdY6Jdf02Wxe-HxqQO46WFdRuIsvp0";


$( "#searchname" ).autocomplete({
      source: function( request, response ) {
      	var query = $("#searchname").val();	
        $.ajax( {
          url: "http://suggestqueries.google.com/complete/search?hl=pt&ds=yt&client=youtube&q="+query,
          dataType: "jsonp",
          success: function( data ) {
          	var listResult = [];
          	data[1].forEach(function(d) {
          		listResult.push(d[0]);
          	});
            response( listResult );
          }
        } );
      },
      minLength: 2,
      select: function( event, ui ) {
        //Do stuff
      }
    } );


form.addEventListener('submit', function(e) { 
  e.preventDefault(); 
  	list.innerHTML = "";

	startLoading();

	var query = $("#searchname").val();	

	callGoogle(query);

}); 

function callGoogle(query){
	var urlToGoogle = "https://www.googleapis.com/customsearch/v1?key="+apiKey+"&cx="+engineID+"&q="+query;
	$.ajax({ 
	   type: "GET",
	   dataType: "json",
	   url: urlToGoogle,
	   success: function(data){        
	     console.log(data);
	     if(data.spelling){
	     	$("#spelling").html(data.spelling.correctedQuery);
	     	callGoogle(data.spelling.correctedQuery);
	     }else{
	     	appendTasks(data.items);
	     }
	     stopLoading();
	   },
	   error: function(data){ 
	   		stopLoading();
	   }
	});
}

function startLoading(){
	$("#spinner").addClass("is-active");
	$("#spinner").show();
}

function stopLoading(){
	$("#spinner").removeClass("is-active");
	$("#spinner").hide();
}


function appendTasks(responses) {
	var list = document.querySelector('.list');
	var taskList = '<div class="mdl-grid portfolio-max-width">';

	responses.forEach(function(response) {
		var link = response.link;

	    var descp = response.snippet;
	    if(descp){
	      descp = descp.substring(0, 34);
	    } else{
	      descp = "No Description";
	    } 

	    var title = response.title;
	    if(title){
	      title = title.substring(0, 40);
	    } else{
	      title = "No Title";
	    }

	    var imageUrl = "";
	    if(response.pagemap){
	    	if(response.pagemap.cse_image){
	    		imageUrl = response.pagemap.cse_image[0].src;
	    	}
	    }
	    


			taskList +=  '<div class="mdl-cell mdl-card mdl-shadow--4dp portfolio-card">'+
	                    '<div class="mdl-card__media">'+
	                    	//'<img class="article-image" src="'+imageUrl+'" border="0" alt="">'+
	                     // '<span class="mdl-chip mdl-chip--contact">'+
	                        //'<span id="userNameAbrev" class="mdl-chip__contact mdl-color--teal mdl-color-text--white">'+letter+'</span>'+
	                        //'<span id="userName" class="mdl-chip__text">'+by+'</span>'+
	                   // '</span>'+
	                    '</div>'+
	                    '<div class="mdl-card__title">'+
	                        '<h2 class="mdl-card__title-text">'+title+'</h2>'+
	                    '</div>'+
	                    '<div class="mdl-card__supporting-text">'+
	                        descp+
	                    '</div>'+
	                    '<div class="mdl-card__actions mdl-card--border">'+
	                    	'<div class="mdl-grid">'+
	                    		'<div class="mdl-cell mdl-cell--10-col">'+
	                    			'<a href="'+link+'" target="_blank" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">'+
								      'Open Link'+
								    '</a>'+
	                    		'</div>'+
	                    		'<div class="mdl-cell mdl-cell--2-col">'+
	                    		'</div>'+
	                    	'</div>'+
	                    '</div>'+
	                '</div>';

	});

	list.innerHTML = taskList+'</div>';
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

