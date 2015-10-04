$(document).ready(function(){
    $(document).keypress(function(e) {
      var g = 0;
    if(e.which == 13) {
      //reed was here
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


        /*
          */
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
function loaddata(){
    var request = $.get("/fetch", {Phonenum:$("#Main_Searchbar").val()});
        open_white_section()
        finishedload("");
      }

function open_white_section(){
  $("#loading").fadeOut("slow",function(){
      $("#loading").remove();
      var width = $(".title_sides").width()*2+$("#main_title").width()+20;
      var height = $("html").height()-$("#main_container_container").height();
      var htmlheight = $("html").height();
      var ok = $("#main_container_container").height();
      console.log(htmlheight)
      $("#main_container").append("<div id='returned_data' style='border-radius:1em;position:relative;top:"+htmlheight+";background-color:#DDD1E1;width:"+width+";height:"+height+"'></div>")
      $("#returned_data").animate({
        top:$("#main_container_container").height()
      },500);
    });
}
function finishedload(){

       var data_extracted = JSON.parse(data);
       for(var d = 0;d<data_extracted.length();d++){
          add_data("https://www.youtube.com/watch?v="+data_extracted[d],"http://img.youtube.com/vi/"+data_extracted[d]+"/0.jpg","");
       }
}

function add_data(url, imageurl, desc){
  /*
    adddata("https://upload.wikimedia.org/wikipedia/commons/7/7c/Aspect_ratio_16_9_example.jpg","https://upload.wikimedia.org/wikipedia/commons/7/7c/Aspect_ratio_16_9_example.jpg","FUCK U")
    //http://img.youtube.com/vi/watch?v=c6wuh0NRG1s/0.jpg
  */
    $("#returned_data").append("<a style='border-radius:1em;text-decoration:none' class='youtube_container' href='"+url+"'><img class='youtube_picture' src='"+imageurl+"'/><p style='background-color:#DDD1E1;color:black;'>"+desc+"</p></a>")
}
