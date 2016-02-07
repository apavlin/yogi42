
(function($){



$('.oneA').hover(function(){
    $('.asana-img',this).css({'opacity':'0.05'});
    $('.asana-header, .asana-text',this).css({'opacity':'1'});
  }, (function(){
    $('.asana-img',this).css({'opacity':'0.25'});
    $('.asana-header, .asana-text',this).css({'opacity':'0'});
  }));



  }(jQuery));
