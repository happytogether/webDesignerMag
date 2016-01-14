// app namespace
var myDevDay = myDevDay || {};
    
myDevDay.scene = {
       
    initScenes: function (scenes) {
        
        var lex = this
        ,W = $(window).width()
        ,H = $(window).height()
        ,scrollY = 0
        ,allscenes = $('.scene')
        ,sceneDurationArr = [0]
        ,scenesArr = [];
  
        lex.getSceneHeight = function () {
            var sceneHeight = 0;
            for ( var i = 0; i < scenes.length; i++ ) {
                sceneHeight += scenes[i].duration;
            }
            $('#heightOnly').css('height', sceneHeight + 'px');
        };

        lex.resize = function () {
            body = $('body')
            $( window ).resize(function() {
                lex.initAnimation();
                W = $(window).width();
                H = $(window).height(); 
                body.scrollTop( scrollY + 1 ); // force elements to right pos
            });
        
        };

        lex.setScrollInterval =  function () {
            
            var didScroll = false;

            window.onscroll = doOnScroll;

            function doOnScroll() {
                didScroll = true;
            }

            setInterval(function() {
                if(didScroll) {
                    didScroll = false;
                    lex.initAnimation();
                }
            }, 100);
        
        };
        
        lex.updateYPOS = function () {

            $(document).scroll(function(){ 
                scrollY = $(document).scrollTop();
            });

        };
        
        lex.setupSecneDuration = function (duration) { 
            var yPos = 0;

            for ( var i = 0; i < sceneDurationArr.length; i++ ) {
                yPos = sceneDurationArr[i];
            }

            yPos += duration;
            sceneDurationArr.push(yPos);
        };

        lex.createSceneObjects = function () {

            for ( var i = 0; i < scenes.length; i++ ) {
            
                var duration = scenes[i].duration;
                
                this.setupSecneDuration(duration);
                s =  new scene(i);
                scenesArr.push(s);

            }

            lex.initAnimation(); 
        
        };

        lex.initAnimation = function () {
            for ( var i = 0; i < scenes.length; i++) {
                scenesArr[i].animation();
            }
        };

        lex.setScrollInterval();
        lex.updateYPOS();
        lex.resize();
        lex.createSceneObjects();
        lex.getSceneHeight();

        function scene (index) { //scene object for all scenes
            
            var lex = this;     
            lex.sceneIndex = index;
            lex.sceneSelector = scenes[index].sceneSelector;
            lex.duration = scenes[index].duration;
            lex.clockDuration = scenes[index].clockDuration;            
            
            lex.startPoint = sceneDurationArr[lex.sceneIndex];
            lex.endPoint = sceneDurationArr[lex.sceneIndex + 1];
    

            lex.showCurrentScene = function (scene) {
                allscenes.addClass('bring-to-back').removeClass('bring-to-front');
                scene.removeClass('bring-to-back').addClass('bring-to-front');
            };

            lex.animation = function () {

                if (scrollY > lex.startPoint && scrollY < lex.endPoint) {
                    
                    lex.showCurrentScene(lex.sceneSelector);
                    lex.moveableElement(lex.sceneSelector, lex.startPoint, lex.endPoint, lex.duration);
                }
            };

            lex.moveableElement = function ( element, startPoint, endPoint, sceneDuration ) {
                var elementsLen = element.find('.moveable').length;

                 for (var i = 0; i < elementsLen; i++) {
                    
                    var currentTopPos;
                    var currentLeftPos;
                    var currentBackgroundPos;
                    var currentScale;
                    var currentOpacity;
                    var elements = element.find(".moveable:eq(" + i + ")");
                    
                    var elementLeftStart = element.find(".moveable:eq(" + i + ")").attr('data-left-start');
                    var elementLeftEnd = element.find(".moveable:eq(" + i + ")").attr('data-left-end');
                    var elementTopStart = element.find(".moveable:eq(" + i + ")").attr('data-top-start');            
                    var elementTopEnd = element.find(".moveable:eq(" + i + ")").attr('data-top-end');
                    
                    var elementStartPos = element.find(".moveable:eq(" + i + ")").attr('data-startPos');  

                    var elementStartLeftPos = element.find(".moveable:eq(" + i + ")").attr('data-startLeftPos');
                    var elementStartTopPos = element.find(".moveable:eq(" + i + ")").attr('data-startTopPos');

                    var elementEndLeftPos = element.find(".moveable:eq(" + i + ")").attr('data-moveLeftPos');
                    var elementEndTopPos = element.find(".moveable:eq(" + i + ")").attr('data-moveTopPos');
                    var elementStartTime = element.find(".moveable:eq(" + i + ")").attr('start-time');
                    var elementEndTime = element.find(".moveable:eq(" + i + ")").attr('end-time');
                    var elementRotation = element.find(".moveable:eq(" + i + ")").attr('rotation');
                    var elementScale =  element.find(".moveable:eq(" + i + ")").attr('scale');
                    var elementAnimationType = element.find(".moveable:eq(" + i + ")").attr('type');

                    if ( scrollY < (startPoint + sceneDuration*elementStartTime) ) {
                    
                        currentTopPos = 0;
                        currentLeftPos = 0;
                        currentDegree = 0;
                        currentBackgroundPos = 0;
                        currentScale = 1;
                        currentOpacity = 0;
                    
                    } else if ( scrollY > (startPoint + sceneDuration*elementStartTime) && scrollY < (startPoint + sceneDuration*elementEndTime)) {
                        
                        currentTopPos = (scrollY - (startPoint + sceneDuration*elementStartTime))/(sceneDuration*( elementEndTime - elementStartTime ))*elementEndTopPos*H;
                        currentLeftPos = (scrollY - (startPoint + sceneDuration*elementStartTime))/(sceneDuration*( elementEndTime - elementStartTime ))*elementEndLeftPos*W; 
                        currentDegree = (scrollY - (startPoint + sceneDuration*elementStartTime))/(sceneDuration*( elementEndTime - elementStartTime ))*360;
                        currentScale = 1 + (scrollY - (startPoint + sceneDuration*elementStartTime))/(sceneDuration*( elementEndTime - elementStartTime ))*elementScale;
                        currentOpacity = (scrollY - (startPoint + sceneDuration*elementStartTime))/(sceneDuration*( elementEndTime - elementStartTime ));
                    
                    } else {

                        currentTopPos = H*elementEndTopPos;
                        currentLeftPos = W*elementEndLeftPos;
                        currentDegree = 0;
                        currentScale = elementScale;
                        currentOpacity = 1;
                    
                    }
 
                    switch(elementAnimationType) {
                        case 'top':
                            TweenMax.to(elements, 1, {'y':  elementStartTopPos*H + currentTopPos, ease: Expo.easeOut}); 
                            break;
                        case 'topLeft':
                            TweenMax.to(elements, 1, {'y':  elementStartTopPos*H + currentTopPos, 'x': elementStartLeftPos*W + currentLeftPos,  ease: Expo.easeOut});
                            break;
                        case 'scale':
                            TweenMax.to(elements, 1, {'scale': currentScale,  ease: Expo.easeOut});
                            break;
                        case 'opacity':
                            TweenMax.to(elements, 1, {'opacity': currentOpacity,  ease: Expo.easeOut});
                            break;    
                        case 'leftRotation':
                            TweenMax.to(elements, 1, {'x': elementStartLeftPos*W + currentLeftPos, 'rotation': currentDegree,  ease: Expo.easeOut}); 
                            break;
                        default:
                            TweenMax.to(elements, 1, {'x': elementStartLeftPos*W + currentLeftPos,  ease: Expo.easeOut});
                    }
                }                            
            }
        }
    }
}
    

