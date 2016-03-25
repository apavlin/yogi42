//= ../../bower_components/jquery/dist/jquery.js
//= ../../node_modules/photoswipe/dist/photoswipe.min.js
//= ../../node_modules/photoswipe/dist/photoswipe-ui-default.min.js



(function() {

// Появление карты при нажатии на кнопку.
    var mapPlace1 = $('#mapPlace1');
    mapPlace1.on('click', function(event) {
        var mapBlock = $('#mapBlock');
        $('#map1, #map2').remove();
        mapBlock.prepend('<div id="map1"></div>');

        DG.then(function(){
            var latLng = DG.latLng([55.34476, 86.07865]),
             map = DG.map('map1', {
                center: latLng,
                zoom: 16,
                minZoom: 13,
                animate: true
            });

            DG.popup({
                maxWidth: 320,
                sprawling: true
            })
            .setLatLng(latLng)
            .setContent('Вход со двора, клуб "Танец+", код: 12В')
            .openOn(map);
        });
    });

    var mapPlace2 = $('#mapPlace2');
    mapPlace2.on('click', function(event) {
        var mapBlock = $('#mapBlock');
        $('#map1, #map2').remove();
        mapBlock.prepend('<div id="map2"></div>');

        DG.then(function(){
            var latLng = DG.latLng([55.345156, 86.173588]),
             map = DG.map('map2', {
                center: latLng,
                zoom: 16,
                minZoom: 13,
                animate: true
            });

            DG.popup({
                maxWidth: 320,
                sprawling: true
            })
            .setLatLng(latLng)
            .setContent('C собой бахилы или сменная обувь')
            .openOn(map);
        });
    });

// Привлечение внимания при переходе в пункт "Связаться со мной"
    $('.down-link').on('click', function() {
    $('.contacts').css({
        'animation-name': 'swing',
        'animation-delay': '1s'});
    setTimeout(function() {$('.footer__container').css('background', 'orange');
                           $('.footer__curve').css('fill', 'orange')}, 2000);
    });

//Переходы по ссылкам

    $("a").click(function () {
      var elementClick = $(this).attr("href");
      var destination = $(elementClick).offset().top;
      $('html,body').animate( { scrollTop: destination }, 1000 );
      return false;
    });

    // $("a").click(function () {
    //       var elementClick = $(this).attr("href");
    //       var destination = $(elementClick).offset().top;
    //       $('html,body').scrollTop(destination);
    //       return false;
    // });


// Появление блоков с текстом и заголовком при наведении на общий блок с асаной (если только средствами CSS на тач устройствах не появлялось при нажатии)
    $('.asana').hover(function(){
        $('.asana__img',this).css({'opacity':'0.05'});
        $('.asana__wrapper',this).css({'opacity':'1'});
      }, (function(){
        $('.asana__img',this).css({'opacity':'0.20'});
        $('.asana__wrapper',this).css({'opacity':'0'});
      }));

// Уведомление об устаревшем браузере IE10
    if (Function('/*@cc_on return document.documentMode===10@*/')()) {
    alert('Некоторые элементы могут отображаться некорректно т.к. вы используете устаревший браузер. Пожалуйста обновите его: www.browsehappy.com');
    }

// PhotoSwipe
    var initPhotoSwipeFromDOM = function(gallerySelector) {

        // parse slide data (url, title, size ...) from DOM elements
        // (children of gallerySelector)
        var parseThumbnailElements = function(el) {
            var thumbElements = el.childNodes,
                numNodes = thumbElements.length,
                items = [],
                figureEl,
                linkEl,
                size,
                item;

            for(var i = 0; i < numNodes; i++) {

                figureEl = thumbElements[i]; // <figure> element

                // include only element nodes
                if(figureEl.nodeType !== 1) {
                    continue;
                }

                linkEl = figureEl.children[0]; // <a> element

                size = linkEl.getAttribute('data-size').split('x');

                // create slide object
                item = {
                    src: linkEl.getAttribute('href'),
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10)
                };



                if(figureEl.children.length > 1) {
                    // <figcaption> content
                    item.title = figureEl.children[1].innerHTML;
                }

                if(linkEl.children.length > 0) {
                    // <img> thumbnail element, retrieving thumbnail url
                    item.msrc = linkEl.children[0].getAttribute('src');
                }

                item.el = figureEl; // save link to element for getThumbBoundsFn
                items.push(item);
            }

            return items;
        };

        // find nearest parent element
        var closest = function closest(el, fn) {
            return el && ( fn(el) ? el : closest(el.parentNode, fn) );
        };

        // triggers when user clicks on thumbnail
        var onThumbnailsClick = function(e) {
            e = e || window.event;
            e.preventDefault ? e.preventDefault() : e.returnValue = false;

            var eTarget = e.target || e.srcElement;

            // find root element of slide
            var clickedListItem = closest(eTarget, function(el) {
                return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
            });

            if(!clickedListItem) {
                return;
            }

            // find index of clicked item by looping through all child nodes
            // alternatively, you may define index via data- attribute
            var clickedGallery = clickedListItem.parentNode,
                childNodes = clickedListItem.parentNode.childNodes,
                numChildNodes = childNodes.length,
                nodeIndex = 0,
                index;

            for (var i = 0; i < numChildNodes; i++) {
                if(childNodes[i].nodeType !== 1) {
                    continue;
                }

                if(childNodes[i] === clickedListItem) {
                    index = nodeIndex;
                    break;
                }
                nodeIndex++;
            }



            if(index >= 0) {
                // open PhotoSwipe if valid index found
                openPhotoSwipe( index, clickedGallery );
            }
            return false;
        };

        // parse picture index and gallery index from URL (#&pid=1&gid=2)
        var photoswipeParseHash = function() {
            var hash = window.location.hash.substring(1),
            params = {};

            if(hash.length < 5) {
                return params;
            }

            var vars = hash.split('&');
            for (var i = 0; i < vars.length; i++) {
                if(!vars[i]) {
                    continue;
                }
                var pair = vars[i].split('=');
                if(pair.length < 2) {
                    continue;
                }
                params[pair[0]] = pair[1];
            }

            if(params.gid) {
                params.gid = parseInt(params.gid, 10);
            }

            return params;
        };

        var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
            var pswpElement = document.querySelectorAll('.pswp')[0],
                gallery,
                options,
                items;

            items = parseThumbnailElements(galleryElement);

            // define options (if needed)
            options = {
                showHideOpacity: false,

                // define gallery index (for URL)
                galleryUID: galleryElement.getAttribute('data-pswp-uid'),
            fullscreenEl: false,
            shareEl: false,
            loop: false,
            tapToClose: true,
                getThumbBoundsFn: function(index) {
                    // See Options -> getThumbBoundsFn section of documentation for more info
                    var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                        pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                        rect = thumbnail.getBoundingClientRect();

                    return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
                }
            };

            // PhotoSwipe opened from URL
            if(fromURL) {
                if(options.galleryPIDs) {
                    // parse real index when custom PIDs are used
                    // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                    for(var j = 0; j < items.length; j++) {
                        if(items[j].pid == index) {
                            options.index = j;
                            break;
                        }
                    }
                } else {
                    // in URL indexes start from 1
                    options.index = parseInt(index, 10) - 1;
                }
            } else {
                options.index = parseInt(index, 10);
            }

            // exit if index not found
            if( isNaN(options.index) ) {
                return;
            }

            if(disableAnimation) {
                options.showAnimationDuration = 0;
            }

            // Pass data to PhotoSwipe and initialize it
            gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();
            gallery.options.showHideOpacity = false;
        };

        // loop through all gallery elements and bind events
        var galleryElements = document.querySelectorAll( gallerySelector );

        for(var i = 0, l = galleryElements.length; i < l; i++) {
            galleryElements[i].setAttribute('data-pswp-uid', i+1);
            galleryElements[i].onclick = onThumbnailsClick;
        };

        // Parse URL and open gallery if it contains #&pid=3&gid=1
        var hashData = photoswipeParseHash();
        if(hashData.pid && hashData.gid) {
            openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
        };
    };

    // execute above function
    initPhotoSwipeFromDOM('.gallery');

})();
