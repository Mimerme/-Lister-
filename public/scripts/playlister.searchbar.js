$(document).ready(function(){
    $(document).keypress(function(e) {
      var g = 0;
    if(e.which == 13) {

      console.log(searchtop);


        if(g == 0){
          var searchtop = $("#Main_Searchbar").position().top;
          var holder = $("#main_container_container").position().top;
          g = 1;
        }
        $("#Main_Searchbar").css("top",searchtop).css("left",$("#Main_Searchbar").position().left).css("position","absolute").fadeOut(500);
        $("#main_container_container").css("position","absolute").css("top",holder).animate({
          top:0
        },1000,function(){
          loader();
        })
          loaddata();
    }
  });
    $("#Main_Searchbar").click(function(){
      $("#Main_Searchbar").attr("value","");
    })
});
var t = 0;
function loader(){
  var x = $("html").height();
  console.log();
  if(t==0){
    $("#main_container").append($("<img style='display:none' id='loading' src='images/load2.gif'/>").fadeIn(1000));
    $("#loading").css("left",$("html").width()/2-$("#loading").width()/2);
    $("#loading").css("top",$("html").height()/2-$("#loading").height()/2)
    t = 1;
  }
}


function open_white_section(data){
    var data_extracted = data;
    $("#float_text").fadeOut("fast");
    console.log(data_extracted);
    console.log("Open White Section")
    setTimeout(function(){$("#loading").fadeOut("slow",function(){
        console.log("Starting")
        $("#loading").remove();
        var width = $(".title_sides").width()*2+$("#main_title").width()+20;
        var height = $("html").height()-$("#main_container_container").height();
        var htmlheight = $("html").height();
        var ok = $("#main_container_container").height();
        console.log(htmlheight)
        $("#main_container").append("<div id='returned_data' style='border-radius:1em;position:relative;top:"+htmlheight+";background-color:#DDD1E1;width:"+width+";height:"+height+"'></div>")
        $("#returned_data").animate({
          top:$("#main_container_container").height()
        },1000,function(){
              setTimeout(function(){
                for(var d = 0;d<data_extracted.length;d++){
                  console.log(d);
                  $.getJSON("https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBs1MVxS8kIxL9BXrxYE0lfvDP-iF_cmeA&part=snippet&id="+data_extracted[d]+""),function(data2){
                    console.log(data_extracted);
                  };
                  //data.items[0].snippet.title
                  var xmlHttp = new XMLHttpRequest();
                  xmlHttp.open( "GET", "https://www.googleapis.com/youtube/v3/videos?id="+data_extracted[d]+"&key=AIzaSyDSYIX0-yw_DM9QMxEG_TGCgYyezMAo9OM&fields=items(snippet(title))&part=snippet", false ); // false for synchronous request
                  xmlHttp.send( null );
                  var x = xmlHttp.responseText;
                  var json_parsed = JSON.parse(x);
                  console.log(json_parsed.items[0].snippet.title);
                  add_data("https://www.youtube.com/watch?v="+data_extracted[d],"http://img.youtube.com/vi/"+data_extracted[d]+"/0.jpg",json_parsed.items[0].snippet.title);
                }
              });
            });
          });
        });
      }
function finishedload(data){
         console.log("Finished load")
         setTimeout(function(){
           open_white_section(data);
         },1000)
}
function loaddata(){
  console.log("load data");
    $.get("http://45.79.147.243:3000/fetch", {phoneNum:$("#Main_Searchbar").val()},function(data){
      console.log(data);
      finishedload(data);
    });
  }
var text_width;
function add_data(url, imageurl, desc){
  console.log("add_data")

  /*
    adddata("https://upload.wikimedia.org/wikipedia/commons/7/7c/Aspect_ratio_16_9_example.jpg","https://upload.wikimedia.org/wikipedia/commons/7/7c/Aspect_ratio_16_9_example.jpg","FUCK U")
    //http://img.youtube.com/vi/watch?v=c6wuh0NRG1s/0.jpg
  */
    text_width = $('#returned_data').width()-320;
    $("#returned_data").append("<a style='border-radius:1em;text-decoration:none; font-size: 25px;' class='youtube_container' href='"+url+"'><img class='youtube_picture' src='"+imageurl+"'/><p style='width:"+text_width+";font-family:Helvetica'>"+desc+"</p></a>")
}
