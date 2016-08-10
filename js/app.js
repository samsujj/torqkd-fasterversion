'use strict';

/* App Module */
var homeControllers1 = angular.module('torqdTest', ['ui.router','angularHighlightTextarea','angularValidator','ngDialog','ngCookies','ngFileUpload','ngAnimate', 'ngTouch','uiGmapgoogle-maps','ngSanitize','com.2fdevs.videogular','youtube-embed','highcharts-ng','shoppinpal.mobile-menu','ui.bootstrap','colorpicker.module', 'wysiwyg.module','readMore','ngFacebook','ImageCropper','widget.scrollbar','textAngular','angularLazyImg','ngTagsInput','ngEmoticons','angular.filter','myApp.services']);

homeControllers1.config(['$facebookProvider', function($facebookProvider) {
   // $facebookProvider.setAppId('821649631217712').setPermissions(['email','user_friends']);
    $facebookProvider.setAppId('434078603403320').setPermissions(['public_profile','user_friends','email','manage_pages','publish_pages','publish_actions']);
}]);

/*homeControllers1.run(['$rootScope', '$window','$state', function($rootScope, $window,$state) {
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    $rootScope.$on('fb.load', function() {
        if($state.current.name != 'home'){
            $window.dispatchEvent(new Event('fb.load'));
        }
    });
}]);*/

homeControllers1.run(['$window','$state', function($window,$state) {
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    /*$rootScope.$on('fb.load', function() {
        if($state.current.name != 'home'){
            $window.dispatchEvent(new Event('fb.load'));
        }
    });*/
}]);

homeControllers1.run(['$rootScope', '$state','$cookieStore','$q','$http','$window','$timeout',function($rootScope, $state,$cookieStore,$q,$http,$window,$timeout){

    $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {

        if( navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
        ) {
            window.location.href = 'http://m.torkq.com/';
        }

        if(to.name == 'groupdetail' && from.name == 'groupdetail1'){
            ev.preventDefault();
            $window.history.back();
        }

        if(to.name == 'profile' && from.name == 'profile1'){
            if(toParams.userId == fromParams.userId){
                ev.preventDefault();
                $window.history.back();
            }
        }

        if(to.name == 'eventdetails' && from.name == 'eventdetails1'){
            ev.preventDefault();
            $window.history.back();
        }


        $rootScope.stateIsLoading = true;
    });

    $rootScope.$on('$stateChangeSuccess',function(ev, to, toParams, from, fromParams){
        $rootScope.stateIsLoading = false;

        if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
            $rootScope.dfgdf = $cookieStore.get('rootuserdet');
            angular.element( document.querySelector( '#c_current_user' ) ).val($rootScope.dfgdf.id);

            $http({
                method: 'POST',
                async:   false,
                url: 'http://torqkd.com/user/ajs1/useractive',
                data    : $.param({'userid':$rootScope.dfgdf.id}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
            });


        }else{
            angular.element( document.querySelector( '#c_current_user' ) ).val(0);
        }

    });


}]);




homeControllers1.service('MetaService', function() {
    var metaKeywords = 'torqkd';
    return {
        set: function( newKeywords) {
            metaKeywords = newKeywords;
        },
        metaKeywords: function() { return metaKeywords; }
    }
});


homeControllers1.directive('scroll', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            scope.$watchCollection(attr.scroll, function(newVal) {
                $timeout(function() {
                    element[0].scrollTop = element[0].scrollHeight;
                });
            });
        }
    }
});

homeControllers1.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter, {'event': event});
                });

                event.preventDefault();
            }
        });
    };
});

homeControllers1.directive('checkImage', function ($q) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            attrs.$observe('ngSrc', function (ngSrc) {
                var deferred = $q.defer();
                var image = new Image();
                image.onerror = function () {
                    deferred.resolve(false);
                    element.attr('src', 'images/demobg.png'); // set default image
                };
                image.onload = function () {
                    deferred.resolve(true);
                };
                image.src = ngSrc;
                return deferred.promise;
            });
        }
    };
});

homeControllers1.directive('imgCropped', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: { src:'@', selected:'&' },
        link: function(scope,element, attr) {
            var myImg;
            var clear = function() {
                if (myImg) {
                    myImg.next().remove();
                    myImg.remove();
                    myImg = undefined;
                }
            };
            scope.$watch('src', function(nv) {
                clear();
                if (nv) {
                    element.after('<img />');
                    myImg = element.next();
                    myImg.attr('src',nv);

                    $(myImg).Jcrop({
                        //trackDocument: true,
                        onSelect: function(x) {
                            /*if (!scope.$$phase) {
                             scope.$apply(function() {
                             scope.selected({cords: x});
                             });
                             }*/
                            scope.selected({cords: x});
                        },
                        minSize:   [ 142, 159 ],
                        aspectRatio: 142 / 159
                    });

                }
            });

            scope.$on('$destroy', clear);
        }
    };
})

homeControllers1.directive('imgCropped1', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: { src:'@', selected1:'&' },
        link: function(scope,element, attr) {
            var myImg;
            var clear = function() {
                if (myImg) {
                    myImg.next().remove();
                    myImg.remove();
                    myImg = undefined;
                }
            };
            scope.$watch('src', function(nv) {
                clear();
                if (nv) {
                    element.after('<img />');
                    myImg = element.next();
                    myImg.attr('src',nv);

                    $(myImg).Jcrop({
                        //trackDocument: true,
                        onSelect: function(x) {
                            /*if (!scope.$$phase) {
                             scope.$apply(function() {
                             scope.selected({cords: x});
                             });
                             }*/
                            scope.selected1({cords: x});
                        },
                        minSize:   [ 1175, 536 ],
                        aspectRatio: 1175 / 536
                    });

                }
            });

            scope.$on('$destroy', clear);
        }
    };
})

homeControllers1.directive( 'elemReady', function( $parse ) {
        return {
            restrict: 'A',
            link: function( $scope, elem, attrs ) {
                elem.ready(function(){
                    $scope.$apply(function(){
                        var func = $parse(attrs.elemReady);
                        func($scope);
                    })
                })
            }
        }
    });

homeControllers1.directive('simpleSlider', ['SimpleSliderService', '$timeout', function (SimpleSliderService, $timeout) {

    'use strict';

    return {

        restrict: 'AE',
        scope: {
            onChange: '&',
            current: '=?currentSlide',
            slider: '=?sliderInstance'
        },

        link: function postLink(scope, element, attrs) {
            var options = attrs, disposeWatcher;

            if (attrs.onChange) {
                options.onChange = scope.onChange;
            } else {
                options.onChange = function (prev, next) {
                    if (parseInt(scope.current) !== next) {
                        $timeout(function () {
                            scope.$apply(function () {
                                scope.current = next;
                            });
                        });
                    }
                };
            }

            if (element[0].children.length === 0) {
                disposeWatcher = scope.$watch(function () {
                    return element[0].children.length > 0;
                }, function (hasChildren) {
                    if (hasChildren) {
                        scope.slider = new SimpleSliderService(element[0], options);
                        disposeWatcher();
                    }
                });
            } else {
                scope.slider = new SimpleSliderService(element[0], options);
            }

            scope.$watch('current', function(next, prev) {
                if (next && next !== prev) {
                    scope.slider.change(parseInt(next));
                }
            });

        }
    };
}]);


homeControllers1.factory('SimpleSliderService', function () {

    'use strict';

    return typeof module != 'undefined' && module.exports ? // jshint ignore:line
        module.exports :
        context.SimpleSlider;
});

homeControllers1.filter('newlines', function () {
    return function(text) {
        return text.replace(/\n/g, '<br/>');
    }
});




homeControllers1.config(function($stateProvider, $urlRouterProvider,$locationProvider) {
    $urlRouterProvider
        .otherwise("/index");


    $stateProvider
        .state('index',{
            url:"/index",
            views: {

                'footer': {
                    controller: 'index'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },

            }
        }
    )

        .state('home',{
            url:"/home",
            views: {
                'content': {
                    templateUrl: 'partials/home.html' ,
                    controller: 'home'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },

            }
        }
    )

        .state('login',{
            url:"/login",
            views: {
                'content': {
                    templateUrl: 'partials/login.html' ,
                    controller: 'login'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },

            }
        }
    )

        .state('logout',{
            url:"/logout",
            views: {
                'content': {
                    controller: 'logout'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },

            }
        }
    )

        .state('signup',{
            url:"/register",
            views: {
                'content': {
                    templateUrl: 'partials/signup.html' ,
                    controller: 'signup'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },

            }
        }
    )

        .state('activities',{
            url:"/activities",
            views: {
                'content': {
                    templateUrl: 'partials/activities.html' ,
                    controller: 'activities'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },

            }
        }
    )

        .state('connect',{
            url:"/connect",
            views: {
                'content': {
                    templateUrl: 'partials/connect.html' ,
                    controller: 'connect'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },

            }
        }
    )

        .state('next',{
            url:"/next",
            views: {
                'content': {
                    templateUrl: 'partials/next.html' ,
                    controller: 'next'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },

            }
        }
    )

        .state('addimage',{
            url:"/addimage",
            views: {
                'content': {
                    templateUrl: 'partials/addimage.html' ,
                    controller: 'addimage'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },

            }
        }
    )
        .state('completesignup',{
            url:"/completesignup",
            views: {
                'content': {
                    templateUrl: 'partials/completesignup.html' ,
                    controller: 'completesignup'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },

            }
        }
    )
        .state('forgotpassword',{
            url:"/forgot-password",
            views: {
                'content': {
                    templateUrl: 'partials/forgot_password.html' ,
                    controller: 'forgotpassword'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },

            }
        }
    )
        .state('forgotpassword2',{
            url:"/forgot-password-second-step",
            views: {
                'content': {
                    templateUrl: 'partials/forgot_password2.html' ,
                    controller: 'forgotpassword2'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },

            }
        }
    )
        .state('changepassword',{
            url:"/change-password",
            views: {
                'content': {
                    templateUrl: 'partials/forgot_password3.html' ,
                    controller: 'changepassword'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },

            }
        }
    )


        .state('experience',{
            url:"/experience",
            views: {
                'content': {
                    templateUrl: 'partials/experience.html' ,
                    controller: 'experience'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'bannercommon': {
                    controller: 'bannerCommon'
                },
                'chatcommon': {
                    controller: 'chatcommon'
                },
                'tabcommon': {
                    controller: 'tabcommon'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },

            }
        }
    )

        .state('profile',{
            url:"/profile1/:userId",
            views: {
                'content': {
                    templateUrl: 'partials/blank_profile.html' ,
                    controller: 'profile1'
                },
//                'footer': {
//                    templateUrl: 'partials/footer.html' ,
//                    controller: 'footer'
//                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },
//                'footer': {
//                    templateUrl: 'partials/footer.html' ,
//                    controller: 'footer'
//                },
//                'bannercommon': {
//                    controller: 'bannerCommon'
//                },
//                'chatcommon': {
//                    controller: 'chatcommon'
//                },
//                'mapcommon': {
//                    controller: 'mapcommon'
//                },
//                'tabcommon': {
//                    controller: 'tabcommon'
//                },

            }
        }
    )

        .state('profile1',{
            url:"/profile/:userId/:userStr",
            views: {
                'content': {
                    templateUrl: 'partials/profile.html' ,
                    controller: 'profile'
                },
                'footer': {
                    templateUrl: 'partials/footer3.html' ,
                    controller: 'footer'
                },
               // 'bannercommon': {
               //     controller: 'bannerCommon'
               // },
                'chatcommon': {
                    controller: 'chatcommon'
                },
               // 'mapcommon': {
               //     controller: 'mapcommon'
              //  },
                'tabcommon': {
                    controller: 'tabcommon'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },

            }
        }
    )


        .state('friendlist',{
            url:"/friend-list/:userId",
            views: {
                'content': {
                    templateUrl: 'partials/friendList.html' ,
                    controller: 'friendlist'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },

            }
        }
    )

        .state('connection',{
            url:"/connection/:userId",
            views: {
                'content': {
                    templateUrl: 'partials/friendList.html' ,
                    controller: 'friendlist'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },

            }
        }
    )

        .state('album',{
            url:"/album/:userId",
            views: {
                'content': {
                    templateUrl: 'partials/album.html' ,
                    controller: 'album'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'tabcommon': {
                    controller: 'photocommon'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },
            }
        }
    )

        .state('groupalbum',{
            url:"/group-album/:groupId",
            views: {
                'content': {
                    templateUrl: 'partials/groupalbum.html' ,
                    controller: 'groupalbum'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'tabcommon': {
                    controller: 'photocommon'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },
            }
        }
    )

        .state('photo',{
            url:"/photo",
            views: {
                'content': {
                    templateUrl: 'partials/photoall.html' ,
                    controller: 'photo'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'tabcommon': {
                    controller: 'photocommon'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },
            }
        }
    )

        .state('video',{
            url:"/video",
            views: {
                'content': {
                    templateUrl: 'partials/videoall.html' ,
                    controller: 'video'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'tabcommon': {
                    controller: 'photocommon'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },
            }
        }
    )

        .state('editprofile',{
            url:"/editprofile",
            views: {
                'content': {
                    templateUrl: 'partials/editprofile.html' ,
                    controller: 'editprofile'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },
            }
        }
    )

        .state('settings',{
            url:"/settings",
            views: {
                'content': {
                    templateUrl: 'partials/settings.html' ,
                    controller: 'settings'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },
            }
        }
    )

        .state('eventdetails',{
            url:"/event-details1/:eventId",
            views: {
                'content': {
                    //templateUrl: 'partials/event_det.html' ,
                    controller: 'eventdetails1'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },
            }
        }
    )

        .state('eventdetails1',{
            url:"/event-details/:eventId/:eventStr",
            views: {
                'content': {
                    templateUrl: 'partials/event_det.html' ,
                    controller: 'eventdetails'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },
            }
        }
    )

        .state('editevent',{
            url:"/edit-event/:eventId",
            views: {
                'content': {
                    templateUrl: 'partials/event_add.html' ,
                    controller: 'editevent'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },
            }
        }
    )

        .state('addevent',{
            url:"/add-event",
            views: {
                'content': {
                    templateUrl: 'partials/event_add.html' ,
                    controller: 'addevent'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },
            }
        }
    )

        .state('routes',{
            url:"/routes/:userId",
            views: {
                'content': {
                    templateUrl: 'partials/routes.html' ,
                    controller: 'routes'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'tabcommon': {
                    controller: 'routecommon'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },
            }
        }
    )

        .state('grouproutes',{
            url:"/grouproutes/:groupId",
            views: {
                'content': {
                    templateUrl: 'partials/grouproutes.html' ,
                    controller: 'grouproutes'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'tabcommon': {
                    controller: 'routecommon'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },
            }
        }
    )

        .state('allroutes',{
            url:"/all-routes",
            views: {
                'content': {
                    templateUrl: 'partials/allroutes.html' ,
                    controller: 'allroutes'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'tabcommon': {
                    controller: 'routecommon'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },
            }
        }
    )

        .state('addroute',{
            url:"/add-route",
            views: {
                'content': {
                    templateUrl: 'partials/addroute.html' ,
                    controller: 'addroute'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'tabcommon': {
                    controller: 'routecommon'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },
            }
        }
    )

        .state('forumlist',{
            url:"/forum-list",
            views: {
                'content': {
                    templateUrl: 'partials/forumlist.html' ,
                    controller: 'forumlist'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'tabcommon': {
                    controller: 'forumcommon'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },
            }
        }
    )

        .state('spforumlist',{
            url:"/forum-list-by-sports/:spId",
            views: {
                'content': {
                    templateUrl: 'partials/forumlist.html' ,
                    controller: 'forumlist'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'tabcommon': {
                    controller: 'forumcommon'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },
            }
        }
    )

        .state('forumdetails',{
            url:"/forum-details/:forumId",
            views: {
                'content': {
                    templateUrl: 'partials/forumdetails.html' ,
                    controller: 'forumdetails'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'tabcommon': {
                    controller: 'forumcommon'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },
            }
        }
    )

        .state('topicdetails',{
            url:"/topic-details/:topicId",
            views: {
                'content': {
                    templateUrl: 'partials/topicdetails.html' ,
                    controller: 'topicdetails'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'tabcommon': {
                    controller: 'forumcommon'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },
            }
        }
    )

        .state('newtopic',{
            url:"/new-topic/:forumId",
            views: {
                'content': {
                    templateUrl: 'partials/newtopic.html' ,
                    controller: 'newtopic'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'tabcommon': {
                    controller: 'forumcommon'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },
            }
        }
    )

        .state('edittopic',{
            url:"/edit-topic/:topicId",
            views: {
                'content': {
                    templateUrl: 'partials/newtopic.html' ,
                    controller: 'edittopic'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'tabcommon': {
                    controller: 'forumcommon'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },
            }
        }
    )

        .state('groupdetail',{
            url:"/group-detail1/:groupId",
            views: {
                'content': {
                    templateUrl: 'partials/blank_profile.html' ,
                    controller: 'groupdetail1'
                },
                'footer': {
                   // templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },
            }
        }
    )

        .state('groupdetail1',{
            url:"/group/:groupId/:groupStr",
            views: {
                'content': {
                    templateUrl: 'partials/groupdetail.html' ,
                    controller: 'groupdetail'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
            //    'bannercommon': {
            //        controller: 'bannerCommon'
            //    },
                'chatcommon': {
                    controller: 'chatcommon'
                },
            //    'mapcommon': {
            //        controller: 'mapcommon'
            //    },
                'tabcommon': {
                    controller: 'tabcommon1'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },
            }
        }
    )

        .state('groupmember',{
            url:"/groupmember/:groupId",
            views: {
                'content': {
                    templateUrl: 'partials/groupuser.html' ,
                    controller: 'groupuser'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },

            }
        }
    )

        .state('groupnonmember',{
            url:"/groupnonmember/:groupId",
            views: {
                'content': {
                    templateUrl: 'partials/groupuser.html' ,
                    controller: 'groupuser'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },

            }
        }
    )

        .state('sportdetail',{
            url:"/sport-detail/:sportId",
            views: {
                'content': {
                    templateUrl: 'partials/sportdetail.html' ,
                    controller: 'sportdetail'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
               // 'bannercommon': {
               //     controller: 'bannerCommon'
               // },
              //  'mapcommon': {
               //     controller: 'mapcommon'
               // },
                'tabcommon': {
                    controller: 'tabcommon2'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },


            }
        }
    )

        .state('addgroup',{
            url:"/add-group",
            views: {
                'content': {
                    templateUrl: 'partials/addgroup.html' ,
                    controller: 'addgroup'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },
            }
        }
    )

        .state('mobpopup',{
            url:"/mobile-popup",
            views: {
                'content': {
                    templateUrl: 'partials/mobpopup.html' ,
                     controller: 'mobpopup'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },

            }
        }
    )

        .state('hastag',{
            url:"/hastag/:hastag",
            views: {
                'content': {
                    templateUrl: 'partials/hastagres.html' ,
                    controller: 'hastag'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'chatcommon': {
                    controller: 'chatcommon'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },


            }
        }
    )

        .state('allmessages',{
            url:"/all-messages",
            views: {
                'content': {
                    templateUrl: 'partials/allmessages.html' ,
                    controller: 'allmessages'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'chatcommon': {
                    controller: 'chatcommon'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },


            }
        }
    )

        .state('allnotification',{
            url:"/all-notifications",
            views: {
                'content': {
                    templateUrl: 'partials/allnotification.html' ,
                    controller: 'allnotification'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'chatcommon': {
                    controller: 'chatcommon'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },


            }
        }
    )


        .state('singlepost',{
            url:"/post/:id",
            views: {
                'content': {
                    templateUrl: 'partials/singlepost.html' ,
                    controller: 'singlepost'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'chatcommon': {
                    controller: 'chatcommon'
                },
                'tabcommon': {
                    controller: 'tabcommon'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },


            }
        }
    )


        .state('mysports',{
            url:"/mysports/:id",
            views: {
                'content': {
                    templateUrl: 'partials/mysports.html' ,
                    controller: 'mysports'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
                },
                'chatcommon': {
                    controller: 'chatcommon'
                },
                'tabcommon': {
                    controller: 'tabcommon'
                },
                'chatManager': {
                    templateUrl: 'partials/chatManager.html' ,
                    controller: 'chatManager'
                },

            }
        }
    )



    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false,
        hashPrefix:'!'
    });
});

homeControllers1.directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.imgageLoadf = 0;
            element.bind('load', function() {
                scope.imgageLoadf = 1;
                console.log('Image load');
            });
        }
    };
});

homeControllers1.directive("showOnceBackgroundLoaded", function () {
    return {
        restrict: "A",
       // scope: true,
        link: function (scope, element, attributes) {
            element.parent().parent().parent().parent().parent().addClass("ng-hide");
            element.parent().addClass("ng-hide");
            var image = new Image();
            image.onload = function () {
                // the image must have been cached by the browser, so it should load quickly
                scope.$apply(function () {
                    element.css({ backgroundImage: 'url("' + attributes.showOnceBackgroundLoaded + '")' });
                    element.parent().parent().parent().parent().parent().removeClass("ng-hide");
                    element.parent().removeClass("ng-hide");
                });
            };
            image.src = attributes.showOnceBackgroundLoaded;
        }
    };
});

homeControllers1.directive('loadedImg', function(){
    return {
        restrict: 'E',
        scope: {
            isrc: '=',
            onloadimg: '&'
        },
        replace: true,
        template: '<img ng-src="{{isrc}}" class="none"/>',
        link: function(scope, ele, attr){
            ele.on('load', function(){
                console.log(scope.isrc, 'loaded');
                ele.removeClass('none');
                scope.onloadimg();
            });
        }
    };
});

homeControllers1.config(["$provide", function ($provide) {

    $provide.decorator('$http', ["$delegate", "$q", function ($delegate, $q) {
        var getFn = $delegate.get;
        var cancelerMap = {};

        function getCancelerKey(method, url) {
            var formattedMethod = method.toLowerCase();
            var formattedUrl = encodeURI(url).toLowerCase().split("?")[0];
            return formattedMethod + "~" + formattedUrl;
        }

        $delegate.get = function () {
            var cancelerKey, canceler, method;
            var args = [].slice.call(arguments);
            var url = args[0];
            var config = args[1] || {};
            if (config.timeout == null) {
                method = "GET";
                cancelerKey = getCancelerKey(method, url);
                canceler = $q.defer();
                cancelerMap[cancelerKey] = canceler;
                config.timeout = canceler.promise;
                args[1] = config;
            }
            return getFn.apply(null, args);
        };

        $delegate.abort = function (request) {
            //console.log("aborting");
            var cancelerKey, canceler;
            cancelerKey = getCancelerKey(request.method, request.url);
            canceler = cancelerMap[cancelerKey];

            if (canceler != null) {
                //console.log("aborting", cancelerKey);

                if (request.timeout != null && typeof request.timeout !== "number") {

                    canceler.resolve();
                    delete cancelerMap[cancelerKey];
                }
            }
        };

        return $delegate;
    }]);
}]);


homeControllers1.controller('index', function($scope,$state,$cookieStore,$rootScope) {

    if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
    ) {
        window.location.href = 'http://m.torkq.com';
    }


    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $state.go('profile',{userId:$scope.userDet.id});
        return;
    }else{
        $state.go('home');
        return
    }
});

homeControllers1.controller('chatManager', function($scope,$state,$sce,$cookieStore,$rootScope,$q,$http,$timeout,$stateParams,uiGmapGoogleMapApi,ngDialog,$facebook,$modal,$interval) {

    $rootScope.lastCallTime=0;
    $rootScope.lastCallTime1=0;

    $scope.isBarShown = true;

    $rootScope.rootsessUser123 = 0;
    $rootScope.currentChatUser = [];


    $scope.last_login= 0;

    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $rootScope.rootsessUser123 = $scope.userDet.id;
        $scope.last_login = $scope.userDet.last_login;
    }

    if(typeof ($cookieStore.get('user_is_admin')) != 'undefined'){
        $rootScope.user_is_admin = $cookieStore.get('user_is_admin');
    }

    if($rootScope.rootsessUser123 == 0){
        $rootScope.activeChatUsers = [];
    }

    $rootScope.showCMsg = 0;
    $rootScope.showCMsgfun = function(){
        $rootScope.showCMsg = !$scope.showCMsg;
    }

    $rootScope.showNMsg = 0;
    $rootScope.showNMsgfun = function(){
        $rootScope.showNMsg = !$scope.showNMsg;
    }

    if(typeof($cookieStore.get('activeChat')) != 'undefined' && $rootScope.rootsessUser123 > 0){
            var arr3 = $cookieStore.get('activeChat');
            if(arr3.length > 0){
                $http({
                    method: 'POST',
                    async:   false,
                    url: $scope.baseUrl+'/user/ajs1/open_chatbox',
                    data    : $.param({'cid':$rootScope.rootsessUser123,'uids':$cookieStore.get('activeChat')}),
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function (result) {
                    $rootScope.activeChatUsers = result;
                    angular.forEach(result,function(value,key){
                        $rootScope.currentChatUser.push(value.id);
                    });
                });
            }
        }

    $timeout(function(){
        $scope.openchatbox1();
        $scope.getchatnotcommonrec();
    },10000);

    $rootScope.openChatbox = function(uid){
        if(typeof($cookieStore.get('activeChat')) != 'undefined'){
            var arr3 = $cookieStore.get('activeChat');
            arr3.push(uid);
            $cookieStore.put('activeChat',arr3);
        }else{
            var arr3 = [];
            arr3.push(uid);
            $cookieStore.put('activeChat',arr3);
        }

        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/open_chatbox',
            data    : $.param({'cid':$rootScope.rootsessUser123,'uids':$cookieStore.get('activeChat')}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.activeChatUsers = result;

            angular.forEach(result,function(value,key){
                if($rootScope.currentChatUser.indexOf(value.id) == -1){
                    $rootScope.currentChatUser.push(value.id)
                }
            });

        }).error(function (result) {
            $scope.openChatbox();
        });

    }




    $scope.openchatbox1 = function(){

        var d = new Date();
        var n = d.getTime();

        if($rootScope.lastCallTime == 0 || (n-$rootScope.lastCallTime) > 9000) {
            $rootScope.lastCallTime = n;


            if ($rootScope.rootsessUser123 > 0) {
                $http({
                    method: 'POST',
                    async: false,
                    url: $scope.baseUrl + '/user/ajs1/open_chatbox1',
                    data: $.param({'cid': $rootScope.rootsessUser123, 'last_login': $scope.last_login}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(function (result) {
                    if (result.u_arr.length > 0) {

                        var u_arr = result.u_arr;

                        var m;

                        if (typeof($cookieStore.get('activeChat')) != 'undefined') {
                            var arr3 = $cookieStore.get('activeChat');
                            for (m in u_arr) {
                                if (arr3.indexOf(u_arr[m]) == -1) {
                                    arr3.push(u_arr[m]);
                                }
                            }
                            $cookieStore.put('activeChat', arr3);

                        } else {
                            var arr3 = [];
                            for (m in u_arr) {
                                arr3.push(u_arr[m]);
                            }
                            $cookieStore.put('activeChat', arr3);
                        }

                        $http({
                            method: 'POST',
                            async: false,
                            url: $scope.baseUrl + '/user/ajs1/open_chatbox',
                            data: $.param({'cid': $rootScope.rootsessUser123, 'uids': $cookieStore.get('activeChat')}),
                            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                        }).success(function (result) {
                            //$rootScope.activeChatUsers = result;

                            //console.log($rootScope.currentChatUser);
                            if (typeof($rootScope.activeChatUsers) != 'undefined' && $rootScope.activeChatUsers.length > 0) {
                                angular.forEach(result, function (value, key) {
                                    if ($rootScope.currentChatUser.indexOf(value.id) == -1) {
                                        $rootScope.activeChatUsers.push(value);
                                        $rootScope.currentChatUser.push(value.id)
                                    } else {
                                        //console.log(value.msgarr);
                                        angular.forEach($rootScope.activeChatUsers, function (value1, key1) {
                                            if (value1.id == value.id) {
                                                //console.log(1);
                                                value1.msgarr = value.msgarr;
                                            }
                                        });
                                    }
                                });
                            } else {
                                $rootScope.activeChatUsers = result;
                                angular.forEach(result, function (value, key) {
                                    if ($rootScope.currentChatUser.indexOf(value.id) == -1) {
                                        $rootScope.currentChatUser.push(value.id)
                                    }
                                });
                            }

                            if ($rootScope.rootsessUser123 == 0) {
                                $rootScope.activeChatUsers = [];
                            }

                            $timeout(function () {
                                $scope.openchatbox1();
                            }, 10000);

                        }).error(function (result) {

                            $timeout(function () {
                                $scope.openchatbox1();
                            }, 5000);

                        });

                    } else {

                        $timeout(function () {
                            $scope.openchatbox1();
                        }, 5000);

                    }
                }).error(function (result) {

                    $timeout(function () {
                        $scope.openchatbox1();
                    }, 5000);

                });
            }
        }else{
            $timeout(function () {
                $scope.openchatbox1();
            }, 5000);
        }
    }

    $scope.getMsgListRec = function(){
        angular.forEach($http.pendingRequests, function(request) {
            if(request.url == $scope.baseUrl+'/user/ajs1/getMessageList'){
                $http.abort(request);
            }
        });
        if($rootScope.rootsessUser123 > 0){
            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/getMessageList',
                data    : $.param({'cid':$rootScope.rootsessUser123}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $rootScope.CmessageList = result;
                var unReadMsgT = 0;
                angular.forEach(result,function(value,key){
                    if(value.is_read == 0){
                        unReadMsgT++;
                    }
                });
                $rootScope.unReadMsg = unReadMsgT;

                $timeout(function(){
                    $scope.getMsgListRec();
                },5000);

            }).error(function (result) {

                $timeout(function(){
                    $scope.getMsgListRec();
                },3000);

            });
        }
    }




    $rootScope.closeChatBox = function(item){
        var arr3 = $cookieStore.get('activeChat');
        var tempArr = [];

        var n;


        for(n in arr3){
            if(arr3[n] != item.id){
                tempArr.push(arr3[n]);
            }
        }
        $cookieStore.put('activeChat',tempArr);

        var idx = $rootScope.activeChatUsers.indexOf(item);
        $rootScope.activeChatUsers.splice(idx,1);

        var idx = $rootScope.currentChatUser.indexOf(item.id);
        $rootScope.currentChatUser.splice(idx,1);
    }

    $rootScope.turnOff = function(item){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/turn_on_off',
            data    : $.param({'cid':$rootScope.rootsessUser123,'uid':item.id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            item.thtml = result;
        }).error(function (result) {
            $rootScope.turnOff(item);
        });
    }

    $rootScope.sendMsg = function(event,item){
        if(event.which === 13 && !event.shiftKey) {
            event.preventDefault();
            var commentval = item.postmsg;

            if (commentval != '' && commentval != '<br>' && typeof(commentval) != 'undefined') {
                $http({
                    method: 'POST',
                    async:   false,
                    url: $scope.baseUrl+'/user/ajs1/send_msg',
                    data    : $.param({'cid':$rootScope.rootsessUser123,'uid':item.id,msg:commentval}),
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function (result) {
                    item.postmsg = '';
                    item.msgarr.push(result);

                    $('#chatdiv000'+item.id).html('');
                    $('#chatEmodiv'+item.id).hide();
                }).error(function (result) {
                    $rootScope.sendMsg(event,item);
                });
            }
        }
    }

    $rootScope.textArfocus = function(item){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/get_focus',
            data    : $.param({'cid':$rootScope.rootsessUser123,'uid':item.id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {

        }).error(function (result) {
            $rootScope.textArfocus(item);
        });
    }

    $rootScope.markasroad = function(item){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/msgasread',
            data    : $.param({'cid':$rootScope.rootsessUser123,'user_id':item.user_id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            item.is_read = result;
            $rootScope.unReadMsg = $rootScope.unReadMsg - 1;
        }).error(function (result) {
            $rootScope.markasroad(item);
        });
    }


    /************************Notifications****************************/

    $scope.getNotListRec = function(){
        angular.forEach($http.pendingRequests, function(request) {
            if(request.url == $scope.baseUrl+'/user/ajs1/getNotificationList'){
                $http.abort(request);
            }
        });
        if($rootScope.rootsessUser123 > 0){
            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/getNotificationList',
                data    : $.param({'cid':$rootScope.rootsessUser123}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {


                var unReadNot1 = 0;

                if(typeof($rootScope.notificationList) != 'undefined'){

                    var notificationList123 = $rootScope.notificationList;

                    angular.forEach(result,function(value,key){
                        if(value.is_read2 == 0){
                            unReadNot1++;
                        }

                        console.log(notificationList123.indexOf(value));

                        /*if ($rootScope.notificationList.indexOf(value) == -1) {
                            $rootScope.notificationList.push(value);
                        }*/

                    });
                }else{
                    $rootScope.notificationList = result;


                    angular.forEach(result,function(value,key){
                        if(value.is_read2 == 0){
                            unReadNot1++;
                        }
                    });
                }



                $rootScope.unReadNot = unReadNot1;

                $timeout(function(){
                    $scope.getNotListRec();
                },30000);


            }).error(function (result) {

                $timeout(function(){
                    $scope.getNotListRec();
                },3000);

            });
        }
    }

    $rootScope.opennotlistttt =function(){
        $rootScope.unReadNot = 0;

        if($rootScope.notificationList.length){
            var notArr = [];

            angular.forEach($rootScope.notificationList,function(value,key){
                if(value.is_read2 == 0){
                    notArr.push(value.id);
                }
            });

            if(notArr.length){
                $http({
                    method: 'POST',
                    async:   false,
                    url: $scope.baseUrl+'/user/ajs1/markasreadnot2',
                    data    : $.param({'item_arr':notArr,'cid':$rootScope.rootsessUser123}),
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function (result) {
                });
            }
        }
    }

    $rootScope.markasreadnot = function(item){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/markasreadnot1',
            data    : $.param({'id':item.id,'cid':$rootScope.rootsessUser123}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            item.is_read1 = result;
            if($rootScope.unReadNot > 0)
                $rootScope.unReadNot = $rootScope.unReadNot - 1;
        }).error(function (result) {
            $rootScope.markasreadnot(item);
        });
    }

    $rootScope.openNotPost = function(item){
        $state.go('singlepost',{id:item.post_id});
        return;
    }

    $rootScope.chatemojisArr = ["bowtie","smile","laughing","blush","smiley","relaxed","smirk","heart_eyes","kissing_heart","kissing_closed_eyes","flushed","relieved","satisfied","grin","wink","stuck_out_tongue_winking_eye","stuck_out_tongue_closed_eyes","grinning","kissing","kissing_smiling_eyes","stuck_out_tongue","sleeping","worried","frowning","anguished","open_mouth","grimacing","confused","hushed","expressionless","unamused","sweat_smile","sweat","disappointed_relieved","weary","pensive","disappointed","confounded","fearful","cold_sweat","persevere","cry","sob","joy","astonished","scream","neckbeard","tired_face","angry","rage","triumph","sleepy","yum","mask","sunglasses","dizzy_face","imp","neutral_face","no_mouth","innocent","alien","yellow_heart","blue_heart","purple_heart","heart","green_heart","broken_heart","heartbeat","heartpulse","two_hearts","revolving_hearts","cupid","sparkling_heart","sparkles","star","star2","dizzy","boom","anger","exclamation","question","grey_exclamation","grey_question","zzz","dash","sweat_drops","notes","musical_note","fire","hankey","thumbsup","thumbsdown","ok_hand","punch","fist","v","wave","hand","open_hands","point_up","point_down","point_left","point_right","raised_hands","pray","point_up_2","clap","muscle","metal","fu","runner","couple","family","two_men_holding_hands","two_women_holding_hands","dancer","dancers","ok_woman","no_good","information_desk_person","raising_hand","bride_with_veil","person_with_pouting_face","person_frowning","bow","couplekiss","couple_with_heart","massage","haircut","nail_care","boy","girl","woman","man","baby","older_woman","older_man","person_with_blond_hair","man_with_gua_pi_mao","man_with_turban","construction_worker","cop","angel","princess","smiley_cat","smile_cat","heart_eyes_cat","kissing_cat","smirk_cat","scream_cat","crying_cat_face","joy_cat","pouting_cat","japanese_ogre","japanese_goblin","see_no_evil","hear_no_evil","speak_no_evil","guardsman","skull","feet","lips","kiss","droplet","ear","eyes","nose","tongue","love_letter","bust_in_silhouette","busts_in_silhouette","speech_balloon","thought_balloon","feelsgood","finnadie","goberserk","godmode","hurtrealbad","rage1","rage2","rage3","rage4","suspect","trollface"];


    $rootScope.showchatshowemojisdiv = function(){
        $rootScope.chatshowemojisdiv = !$rootScope.chatshowemojisdiv;
    }

    $rootScope.chatemoinsert = function(item,emoitem){

        var emoval = '<input title="'+emoitem+'" style="border:none; margin-left: 3px; margin-right: 3px;" class="emoticon emoticon-'+emoitem+'" />';

        var prevval = $('#chatdiv000'+item.id).html();

        if(prevval.substr(prevval.length - 4) == '<br>')
            prevval = prevval.substring(0, prevval.length - 4);

        $('#chatdiv000'+item.id).html(prevval+emoval);
        item.postmsg = prevval+emoval;

    }

    $rootScope.setchatval = function(event,item) {

        var target = event.target || event.srcElement || event.originalTarget;

        item.postmsg = target.innerHTML;
    }


    $rootScope.hsuifhskjd = function(id){
        if ($('#chatEmodiv'+id).is(':hidden')) {
            $('#chatEmodiv'+id).show();
        }else{
            $('#chatEmodiv'+id).hide();
        }
    }




/***********************************************/

    $scope.getchatnotcommonrec = function(){

        var d = new Date();
        var n = d.getTime();

        if($rootScope.lastCallTime1 == 0 || (n-$rootScope.lastCallTime1) > 9000) {
            $rootScope.lastCallTime1 = n;

            if ($rootScope.rootsessUser123 > 0) {
                $http({
                    method: 'POST',
                    async: false,
                    url: $scope.baseUrl + '/user/ajs1/chatmsgnotificationcommon',
                    data: $.param({'cid': $rootScope.rootsessUser123, 'last_login': $scope.last_login}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(function (result) {


                    var unReadNot1 = 0;

                    if (typeof($rootScope.notificationList) != 'undefined') {

                        var notificationList123 = $rootScope.notificationList;

                        angular.forEach(result['notification'], function (value, key) {
                            if (value.is_read2 == 0) {
                                unReadNot1++;
                            }

                        });
                    } else {
                        $rootScope.notificationList = result['notification'];


                        angular.forEach(result['notification'], function (value, key) {
                            if (value.is_read2 == 0) {
                                unReadNot1++;
                            }
                        });
                    }


                    $rootScope.unReadNot = unReadNot1;


                    $rootScope.CmessageList = result['cmessage'];
                    var unReadMsgT = 0;
                    angular.forEach(result['cmessage'], function (value, key) {
                        if (value.is_read == 0) {
                            unReadMsgT++;
                        }
                    });
                    $rootScope.unReadMsg = unReadMsgT;


                    $timeout(function () {
                        $scope.getchatnotcommonrec();
                    }, 10000);


                }).error(function (result) {

                    $timeout(function () {
                        $scope.getchatnotcommonrec();
                    }, 5000);

                });
            }
        }else{
            $timeout(function () {
                $scope.getchatnotcommonrec();
            }, 5000);
        }

    }





})

homeControllers1.controller('tabcommon', function($scope,$state,$sce,$cookieStore,$rootScope,$http,$timeout,$stateParams,uiGmapGoogleMapApi,ngDialog,$facebook,$modal,$compile) {

    var api;
    uiGmapGoogleMapApi.then(function (googleMaps) {
        api = googleMaps;
    });

    $rootScope.isExp = false;
    $rootScope.isProfile = false;
    $rootScope.widowWidth = $(window).width();

    $rootScope.trustAsHtml = $sce.trustAsHtml;
    if($state.current.name == 'profile1'){
        $rootScope.isProfile = true;
        $scope.currentUser = $stateParams.userId;
    }
    if($state.current.name == 'experience'){
        $rootScope.isExp = true;
        $scope.currentUser = 0;
    }

    $rootScope.tagpeopleText11 = function(item){
        var fsgs =item.tagpeopleText;
        return  fsgs;
    }

    $rootScope.openTagPeopleList22 = function(item){
        var tagstr = '';
        angular.forEach(item.tagpeople, function(val, key) {
            tagstr += '<div class="tagplelist"><a class="tagplelistImg" href="javascript:void(0)" ng-click="gotouserprofile('+val.id+',\''+val.name+'\')"><img src="'+val.image+'"  alt="" style=" max-width:50px; max-height:50px;" /></a><a class="tagplelistName" href="javascript:void(0)" ng-click="gotouserprofile('+val.id+',\''+val.name+'\')">'+val.name+'</a> <div class="clear"></div></div>';
        });


        $scope.userppp = ngDialog.open({
            template: '<div class="fbcommentpopup">'+tagstr+'</div>',
            plain:true,
            closeByDocument: false,
            closeByEscape: false,
            scope: $scope
        });
    }

    $scope.gotoProfile555 = function(user_id){
        $scope.userppp.close();
        $state.go('profile',{userId:user_id});
        return;
    }

    $rootScope.viewMoreLoad = 0;
    $rootScope.viewMore = 0;
    $rootScope.offset = 0;

    $rootScope.tabs = [{
        title: 'social',
        url: 'social.tpl.html'
    }, {
        title: 'events',
        url: 'events.tpl.html'
    }, {
        title: 'groups',
        url: 'groups.tpl.html'
    }, {
        title: 'stats',
        url: 'stats.tpl.html'
    }];

    $rootScope.currentTab = 'social.tpl.html';

    $rootScope.tabs = [{
        title: 'social',
        url: 'social.tpl.html'
    }, {
        title: 'events',
        url: 'events.tpl.html'
    }, {
        title: 'groups',
        url: 'groups.tpl.html'
    }, {
        title: 'stats',
        url: 'stats.tpl.html'
    }];

    $rootScope.currentTab = 'social.tpl.html';

    $rootScope.onClickTab = function (tab) {
        $rootScope.viewMoreLoad = 0;
        $rootScope.viewMore = 0;
        $rootScope.offset = 0;
        $rootScope.tabBodyLoad = true;
        $rootScope.currentTab = tab.url;
        if(tab.url == 'social.tpl.html'){
            $scope.getStatus();
        }
        if(tab.url == 'events.tpl.html'){
            $scope.getEvent();
        }
        if(tab.url == 'groups.tpl.html'){
            $scope.getGroup();
        }
        if(tab.url == 'stats.tpl.html'){
            $rootScope.highchartsNG = [];
            $rootScope.chartdata = [];

            if($scope.currentUser == 0){
                $scope.getStat();
            }else{
                $scope.getUserStat();
            }


        }
    }

    $rootScope.tabBodyLoad = true;
    $timeout(function(){
        $scope.getStatus();
    },10000);



    $rootScope.isActiveTab = function(tabUrl) {
        return tabUrl == $rootScope.currentTab;
    }

    $scope.getStatus = function(){
        $http({
            method: 'POST',
            async:   false, 
            url: $scope.baseUrl+'/user/ajs1/getStatus',
            data    : $.param({'userid':$scope.currentUser,'sess_user_id':$rootScope.rootsessUser,'offset':$rootScope.offset}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.statusList = result.status;

            angular.forEach($rootScope.statusList, function(item, key) {
                var itemcomlist = item.comment;
                itemcomlist = itemcomlist.slice(-5);
                item.commentSliceList = itemcomlist;


                if(typeof(item.routes.id) !='undefined'){
                    item.routes.map.refresh =  function () {
                        item.routes.map.control.refresh(item.routes.map.center);
                    };
                    $timeout(function(){
                        item.routes.map.refresh();
                    },500);
                }



            });

            if(result.totalCount > $rootScope.statusList.length){
                $rootScope.viewMore = 1;
                $rootScope.offset = 5;
            }
            $rootScope.tabBodyLoad = false;







            setTimeout(function(){
                $('.extracted_url2').css('cursor','pointer');
                $('.extracted_url2').on('click',function(){
                    var targeturl = $(this).find('a').attr('href');
                    window.open(targeturl);
                });


            },2000);

        }).error(function (result) {
            $scope.getStatus();
        });
    }

    $scope.getEvent = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getEvents',
            data    : $.param({'userid':$scope.currentUser,'sess_user_id':$rootScope.rootsessUser,'offset':$rootScope.offset}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.eventList = result.event;
            if(result.totalCount > $rootScope.eventList.length){
                $rootScope.viewMore = 1;
                $rootScope.offset = 5;
            }
            $rootScope.tabBodyLoad = false;
        }).error(function (result) {
            $scope.getEvent();
        });
    }

    $scope.getGroup = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getGroups',
            data    : $.param({'userid':$scope.currentUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.groupList = result;
            $rootScope.tabBodyLoad = false;

            if(result.length == 0){
                $rootScope.sugGroup();
            }
        }).error(function (result) {
            $scope.getGroup();
        });

    }

    $scope.getStat = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getStat',
            //data    : $.param({'userid':$stateParams.userId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.stats = result;

            angular.forEach($scope.stats, function(val, key) {
                var highchartsNG = {
                    options: {
                        chart: {
                            type: 'line'
                        }
                    },
                    series: [{
                        data: val.data,
                        name : '<div style="color:#555555;">Month</div>',
                        color : '#F79213',

                    }],
                    title: {
                        text: '<div style="color:#555555;">Last 6 Months</div>'
                    },
                    loading: false,

                    xAxis: {
                        categories: val.mon,
                        labels: {
                            style: {
                                color: '#555555',
                                font: '12px "veneerregular"',
                            }
                        }
                    },

                    yAxis : {
                        title: {
                            text :  '<div style="color:#555555; font-size: 12px; font-weight: bold;">Activity</div>',
                        },
                        labels: {
                            style: {
                                color: '#555555',
                                font: '12px "veneerregular"',
                            }
                        }
                    },

                    tooltip : {
                        valueSuffix : ''
                    },
                    exporting :{
                        enabled : true
                    }
                }

                var chartdata = {
                    sports_id : val.sports_id,
                    sport_name : val.sport_name,
                    imag_name : val.imag_name,
                    activity_no : val.activity_no,
                    total_dis : val.total_dis,
                    total_time : val.total_time,
                    statDet : val.statDet,
                }



                $rootScope.highchartsNG.push(highchartsNG);
                $rootScope.chartdata.push(chartdata);







            });
            $rootScope.tabBodyLoad = false;

        }).error(function (result) {
            $scope.getStat();
        });
    }

    $scope.getUserStat = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getUserStat',
            data    : $.param({'userid':$stateParams.userId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.stats = result;

            angular.forEach($scope.stats, function(val, key) {
                var highchartsNG = {
                    options: {
                        chart: {
                            type: 'line'
                        },

                    },
                    plotOptions: {
                        series: {
                            marker: {
                                radius: 10,
                                symbol: 'circle',enabled:true
                            }
                        }
                    },
                    series: [{
                        data: val.data,
                        name : '<div style="color:#555555;">Month</div>',
                        color : '#F79213',
                    }],
                    title: {
                        text: '<div style="color:#555555; font-size: 12px; font-weight: bold;">Last 6 Months</div>'
                    },
                    loading: false,

                    xAxis: {
                        categories: val.mon,
                        labels: {
                            style: {
                                color: '#555555',
                                font: '12px "veneerregular"',
                            }
                        },

                    },

                    yAxis : {
                        title: {
                            text :  '<div style="color:#555555; font-size: 12px; font-weight: bold;">Activity</div>',
                        },
                        labels: {
                            style: {
                                color: '#555555',
                                font: '12px "veneerregular"',
                            }
                        }
                    },

                    tooltip : {
                        valueSuffix : ''
                    },


                }

                var chartdata = {
                    sports_id : val.sports_id,
                    sport_name : val.sport_name,
                    imag_name : val.imag_name,
                    activity_no : val.activity_no,
                    total_dis : val.total_dis,
                    total_time : val.total_time,
                    statDet : val.statDet,
                }



                $rootScope.highchartsNG.push(highchartsNG);
                $rootScope.chartdata.push(chartdata);
            });

            $rootScope.tabBodyLoad = false;

        }).error(function (result) {
            $scope.getUserStat();
        });

    }

    $rootScope.viewMoreStatus = function(){
        $rootScope.viewMoreLoad = 1;
        $rootScope.viewMore = 0;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getStatus',
            data    : $.param({'userid':$scope.currentUser,'sess_user_id':$rootScope.rootsessUser,'offset':$rootScope.offset}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.viewMoreLoad = 0;
            $rootScope.statusList=$rootScope.statusList.concat(result.status);

            angular.forEach($rootScope.statusList, function(item, key) {
                var itemcomlist = item.comment;
                itemcomlist = itemcomlist.slice(-5);
                item.commentSliceList = itemcomlist;


                if(typeof(item.routes.id) !='undefined'){
                    item.routes.map.refresh =  function () {
                        item.routes.map.control.refresh(item.routes.map.center);
                    };
                    $timeout(function(){
                        item.routes.map.refresh();
                    },500);
                }
            });

            if(result.totalCount > $rootScope.statusList.length){
                $rootScope.viewMore = 1;
                $rootScope.offset = $rootScope.offset+5;
            }

            setTimeout(function(){
                $('.extracted_url2').css('cursor','pointer');
                $('.extracted_url2').on('click',function(){
                    var targeturl = $(this).find('a').attr('href');
                    window.open(targeturl);
                })
            },2000);

        }).error(function (result) {
            $rootScope.viewMoreStatus();
        });
    }

    $rootScope.viewMoreEvent = function(){
        $rootScope.viewMoreLoad = 1;
        $rootScope.viewMore = 0;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getEvents',
            data    : $.param({'userid':$scope.currentUser,'sess_user_id':$rootScope.rootsessUser,'offset':$rootScope.offset}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.viewMoreLoad = 0;
            $rootScope.eventList = $rootScope.eventList.concat(result.event);
            if(result.totalCount > $rootScope.eventList.length){
                $rootScope.viewMore = 1;
                $rootScope.offset = $rootScope.offset+5;
            }
        }).error(function (result) {
            $rootScope.viewMoreEvent();
        });
    }


    $rootScope.sugGroup = function(){
        $rootScope.tabBodyLoad = true;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getSugGroups',
            data    : $.param({'userid':$rootScope.rootsessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.groupList = result;
            $rootScope.tabBodyLoad = false;
        }).error(function (result) {
            $rootScope.sugGroup();
        });
    }

    $rootScope.locGroup = function(){
        $rootScope.tabBodyLoad = true;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getLocGroups',
            data    : $.param({'userid':$rootScope.rootsessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.groupList = result;
            $rootScope.tabBodyLoad = false;
        }).error(function (result) {
            $rootScope.locGroup();
        });
    }

    $rootScope.viewStatDet = function(index){
        $rootScope.statDet1 = $rootScope.chartdata[index].statDet;
        ngDialog.open({
            template: 'statdet12',
            showClose:true,
            closeByDocument: true,
            closeByEscape: true,
            scope:$rootScope
        });
    }

    $rootScope.showYoutubevdo = function(id,value){
        angular.element( document.querySelector( '#youtubeBody'+id ) ).html('<iframe width="100%" height="100%" src="https://www.youtube.com/embed/'+value+'?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>');
    }

    $rootScope.showmp4video = function(id,value){

        $scope.maintvfile = $sce.trustAsResourceUrl($scope.baseUrl+'/uploads/video/converted/'+value);


        setTimeout(function(){
            angular.element( document.querySelector( '#youtubeBody'+id ) ).html('<video width="100%" height="100%" autoplay loop controls>\
            <source src="'+$scope.maintvfile+'" type="video/mp4">\
            </video>');
        },2000);
    }

    $rootScope.statusLike = function (item) {
        if(item.is_like){
            item.like_no = item.like_no-1;
        }else{
            item.like_no = item.like_no+1;
        }
        item.is_like = !item.is_like;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/likestatus',
            data    : $.param({'status_id':item.id,'user_id':item.c_user}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {

        });

    };

    $rootScope.changeShareWith = function(item,valu){
        item.share_with = valu;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/changeShareWith',
            data    : $.param({'status_id':item.id,'valu':valu}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {

        });
    }

    $rootScope.postComment = function(event,item){
        if(event.which === 13 && !event.shiftKey) {

            event.preventDefault();
            var commentval = item.commpostval;

            if(commentval !='' && typeof(commentval)!= 'undefined'){
                $http({
                    method: 'POST',
                    async:   false,
                    url: $scope.baseUrl+'/user/ajs1/addcomment',
                    data    : $.param({'status_id':item.id,'cmnt_body':commentval,'user_id':$rootScope.rootsessUser}),
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function (result) {
                    if(item.comment_no){
                        item.comment.push(result);
                        item.commentSliceList.push(result);
                    }else{
                        item.comment = [result];
                        item.commentSliceList = [result];
                    }
                    item.comment_no = item.comment_no +1;
                    item.commpostval = '';



                    $('#commentdiv000'+item.id).html('');
                    $('#emojisdiv'+item.id).hide();

                }).error(function (result) {
                    $rootScope.postComment(event,item);
                });
            }
        }
    }

    $rootScope.postComment1222 = function(event,item){

        if(event.which === 13 && !event.shiftKey) {

            event.preventDefault();
            var commentval = item.commpostval;

            if(commentval !='' && typeof(commentval)!= 'undefined'){
                $http({
                    method: 'POST',
                    async:   false,
                    url: $scope.baseUrl+'/user/ajs1/addcomment',
                    data    : $.param({'status_id':item.id,'cmnt_body':commentval,'user_id':$rootScope.rootsessUser}),
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function (result) {
                    if(item.commentList.length){
                        item.commentList.push(result);
                        item.commentSliceList.push(result);
                    }else{
                        item.commentList = [result];
                        item.commentSliceList = [result];
                    }
                    item.comment_no = item.comment_no +1;
                    item.commpostval = '';



                    $('#commentdiv111').html('');
                    $('#showemojisdiv445').hide();
                }).error(function (result) {
                    $rootScope.postComment1222(event,item);
                });
            }
        }
    }

    $rootScope.delStatus = function(index){
        $scope.confirmDialog = ngDialog.open({
            template: '<div style="text-align:center; font-family: \'veneerregular\'; font-size: 19px;">Are you sure you want to delete this post?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm('+index+')" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
            plain:true,
            showClose:false,
            closeByDocument: false,
            closeByEscape: false,
            className : 'confirmPopup',
            scope:$scope
        });


    }

    $scope.delConfirm = function(index){
        $scope.confirmDialog.close();
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/delstatus',
            data    : $.param({'status_id':$rootScope.statusList[index].id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.statusList.splice(index,1);
            $rootScope.offset = $rootScope.offset-1;

        }).error(function (result) {
            $scope.delConfirm(index);
        });
    }

    $rootScope.delComment = function(index,index1){
        $scope.confirmDialog = ngDialog.open({
            template: '<div style="text-align:center; font-family: \'veneerregular\'; font-size: 19px;">Are you sure you want to delete this comment?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm1('+index+','+index1+')" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
            plain:true,
            showClose:false,
            closeByDocument: false,
            closeByEscape: false,
            className : 'confirmPopup',
            scope:$scope
        });


    }

    $scope.delConfirm1 = function(index,index1){
        $scope.confirmDialog.close();
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/delcomment',
            data    : $.param({'comment_id':$rootScope.statusList[index].comment[index1].id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.statusList[index].comment.splice(index1,1);
            $rootScope.statusList[index].comment_no = $scope.statusList[index].comment_no -1;
        }).error(function (result) {
            $scope.delConfirm1(index,index1);
        });
    }

    $scope.delCancel = function(){
        $scope.confirmDialog.close();
    }

    $rootScope.prShare = function(item){
        if(item.type == 'route'){
            var mapcontent = '<div class="rowtwo " style="float: none; width: 170px; margin:0; padding:0;  ">\
                    <h2 style="  word-wrap: break-word; width: 170px; margin-bottom: 2px; padding-bottom: 2px;color:#000!important">'+item.routes.route_name+'</h2>\
                <div class="date-contain" style="padding-top: 0px; margin-top: -3px;color:#000!important">\
                    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important" >\
                    <span style="color:#616564!important">DATE</span><br />'+item.routes.date+'</h5>\
            <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
            <span style="color:#616564!important">TIME</span><br />'+item.routes.duration+' </h5>\
    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
    <span style="color:#616564!important">DISTANCE</span><br />'+item.routes.distance+' miles</h5>\
</div></div>\
<img src="'+item.routes.sport_image+'" style="width:40px; display: block; margin: 0;"  alt="" />';
            $rootScope.stateIsLoading = true;
            $('#mapconmain').show();
            html2canvas($('#map'+item.id), {
                useCORS: true,
                onrendered: function(canvas) {
                    var url = canvas.toDataURL();

                    $http({
                        method: 'POST',
                        async:   false,
                        url: $scope.baseUrl+'/user/ajs1/canvastoimg',
                        data    : $.param({'data': url}),
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                    }).success(function (result) {
                        var mapImage = result;

                        $('#mapconmain').html(mapcontent);


                        html2canvas($('#mapconmain'), {
                            useCORS: true,
                            onrendered: function(canvas) {
                                var url = canvas.toDataURL();

                                $http({
                                    method: 'POST',
                                    async:   false,
                                    url: $scope.baseUrl+'/user/ajs1/canvastoimg1',
                                    data    : $.param({'data': url}),
                                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                }).success(function (result) {
                                    var divImage = result;

                                    $('#mapconmain').html('');

                                    $http({
                                        method: 'POST',
                                        async:   false,
                                        url: $scope.baseUrl+'/user/ajs1/imageMerge',
                                        data    : $.param({'image1':mapImage,'image2':divImage}),
                                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                    }).success(function (res) {

                                        $rootScope.stateIsLoading = false;

                                        var shareImage = 'http://torqkd.com/fbshare/img/'+res;
                                        $('#mapconmain').hide();
                                        window.open("http://pinterest.com/pin/create/button/?url=http://torqkd.com/&media="+shareImage+"&description=","_blank");


                                    });


                                });

                            }

                        });

                    });

                }

            });
        }else{
            window.open('http://pinterest.com/pin/create/button/?url=http://torqkd.com/&media='+item.s_img+'&description=','_blank');
        }
    }

    $rootScope.twShare = function(item){
        if(item.type == 'route'){
            var mapcontent = '<div class="rowtwo " style="float: none; width: 170px; margin:0; padding:0;  ">\
                    <h2 style="  word-wrap: break-word; width: 170px; margin-bottom: 2px; padding-bottom: 2px;color:#000!important">'+item.routes.route_name+'</h2>\
                <div class="date-contain" style="padding-top: 0px; margin-top: -3px;color:#000!important">\
                    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important" >\
                    <span style="color:#616564!important">DATE</span><br />'+item.routes.date+'</h5>\
            <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
            <span style="color:#616564!important">TIME</span><br />'+item.routes.duration+' </h5>\
    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
    <span style="color:#616564!important">DISTANCE</span><br />'+item.routes.distance+' miles</h5>\
</div></div>\
<img src="'+item.routes.sport_image+'" style="width:40px; display: block; margin: 0;"  alt="" />';
            $rootScope.stateIsLoading = true;
            $('#mapconmain').show();
            html2canvas($('#map'+item.id), {
                useCORS: true,
                onrendered: function(canvas) {
                    var url = canvas.toDataURL();

                    $http({
                        method: 'POST',
                        async:   false,
                        url: $scope.baseUrl+'/user/ajs1/canvastoimg',
                        data    : $.param({'data': url}),
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                    }).success(function (result) {
                        var mapImage = result;

                        $('#mapconmain').html(mapcontent);


                        html2canvas($('#mapconmain'), {
                            useCORS: true,
                            onrendered: function(canvas) {
                                var url = canvas.toDataURL();

                                $http({
                                    method: 'POST',
                                    async:   false,
                                    url: $scope.baseUrl+'/user/ajs1/canvastoimg1',
                                    data    : $.param({'data': url}),
                                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                }).success(function (result) {
                                    var divImage = result;

                                    $('#mapconmain').html('');

                                    $http({
                                        method: 'POST',
                                        async:   false,
                                        url: $scope.baseUrl+'/user/ajs1/imageMerge',
                                        data    : $.param({'image1':mapImage,'image2':divImage}),
                                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                    }).success(function (res) {

                                        $rootScope.stateIsLoading = false;

                                        var shareImage = 'http://torqkd.com/fbshare/img/'+res;
                                        $('#mapconmain').hide();

                                        var sss = 'Tweet Compose';

                                        $scope.dialog2 = ngDialog.open({
                                            template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="twText" id="fbtext"> <a href="javascript:void(0)" ng-click="postTw(\''+shareImage+'\')" id="comment_btn">POST</a></div>',
                                            plain:true,
                                            closeByDocument: false,
                                            closeByEscape: false,
                                            scope: $scope
                                        });

                                    });


                                });

                            }

                        });

                    });

                }

            });
        }else{
            var sss = 'Say Something About This Post';

            if(item.type == 'image'){
                var sss = 'Say Something About This Picture';
            }
            if(item.type == 'mp4' || item.type == 'youtube'){
                var sss = 'Say Something About This Video';
            }

            $scope.dialog2 = ngDialog.open({
                template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="twText" id="fbtext"> <a href="javascript:void(0)" ng-click="postTw(\''+item.value+'\',\''+item.type+'\')" id="comment_btn">POST</a></div>',
                plain:true,
                closeByDocument: false,
                closeByEscape: false,
                scope: $scope
            });
        }
    };

    $scope.postTw = function(value,type){
        $scope.dialog2.close();
        var twText = $('#fbtext').val();

        var sType = 'text';
        if(type == 'image'){
            sType = 'statImg';
        }

        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getTwOauth',
            data    : $.param({'user_id':$rootScope.rootsessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            if(result.oauth_token == '' || result.oauth_token_secret == ''){
                    window.location.href = ($scope.baseUrl+'/user/profile/twittershare1?image='+value+'&page=profile&com='+twText+'&userid='+$scope.sessUser+'&type='+sType);
            }else{
                $http({
                    method: 'POST',
                    async:   false,
                    url: $scope.baseUrl+'/twitter31.php',
                    data    : $.param({'type':sType,'oauth_token':result.oauth_token,'oauth_token_secret':result.oauth_token_secret,'com':twText,'image':value}),
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function (result) {
                    $scope.showTwSucMsg();
                });
            }
        });


    }

    $scope.showTwSucMsg = function(){
        $scope.showTwSucMsg1 = ngDialog.open({
            template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Posted Successfully On Twitter</div>',
            plain:true,
            showClose:false,
            closeByDocument: true,
            closeByEscape: true
        });

        setTimeout(function(){
            $scope.showTwSucMsg1.close();
        },3000);
    }

    $rootScope.fbShare = function(item){
        if(item.type == 'route'){
            var mapcontent = '<div class="rowtwo " style="float: none; width: 170px; margin:0; padding:0;  ">\
                    <h2 style="  word-wrap: break-word; width: 170px; margin-bottom: 2px; padding-bottom: 2px;color:#000!important">'+item.routes.route_name+'</h2>\
                <div class="date-contain" style="padding-top: 0px; margin-top: -3px;color:#000!important">\
                    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important" >\
                    <span style="color:#616564!important">DATE</span><br />'+item.routes.date+'</h5>\
            <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
            <span style="color:#616564!important">TIME</span><br />'+item.routes.duration+' </h5>\
    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
    <span style="color:#616564!important">DISTANCE</span><br />'+item.routes.distance+' miles</h5>\
</div></div>\
<img src="'+item.routes.sport_image+'" style="width:40px; display: block; margin: 0;"  alt="" />';
            $rootScope.stateIsLoading = true;
            $('#mapconmain').show();
            html2canvas($('#map'+item.id), {
                useCORS: true,
                onrendered: function(canvas) {
                    var url = canvas.toDataURL();

                    $http({
                        method: 'POST',
                        async:   false,
                        url: $scope.baseUrl+'/user/ajs1/canvastoimg',
                        data    : $.param({'data': url}),
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                    }).success(function (result) {
                        var mapImage = result;

                        $('#mapconmain').html(mapcontent);


                        html2canvas($('#mapconmain'), {
                            useCORS: true,
                            onrendered: function(canvas) {
                                var url = canvas.toDataURL();

                                $http({
                                    method: 'POST',
                                    async:   false,
                                    url: $scope.baseUrl+'/user/ajs1/canvastoimg1',
                                    data    : $.param({'data': url}),
                                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                }).success(function (result) {
                                    var divImage = result;

                                    $('#mapconmain').html('');

                                    $http({
                                        method: 'POST',
                                        async:   false,
                                        url: $scope.baseUrl+'/user/ajs1/imageMerge',
                                        data    : $.param({'image1':mapImage,'image2':divImage}),
                                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                    }).success(function (res) {

                                        $rootScope.stateIsLoading = false;

                                        var shareImage = 'http://torqkd.com/fbshare/img/'+res;
                                        $('#mapconmain').hide();

                                        if($scope.fbStatus) {
                                            $scope.getAuthResponse = $facebook.getAuthResponse();
                                            $scope.fb_share_route(shareImage,$scope.getAuthResponse.accessToken);
                                        } else {
                                            $facebook.login().then(function(){
                                                $scope.getAuthResponse = $facebook.getAuthResponse();
                                                $scope.fb_share_route(shareImage,$scope.getAuthResponse.accessToken);
                                            });
                                        }


                                    });


                                });

                            }

                        });

                    });

                }

            });
        }else{

                    var sss = 'Say Something About This Post';

                    if(item.type == 'image'){
                        var sss = 'Say Something About This Picture';
                    }
                    if(item.type == 'mp4' || item.type == 'youtube'){
                        var sss = 'Say Something About This Video';
                    }

                    $scope.dialog2 = ngDialog.open({
                        template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="fbText" id="fbtext"> <a href="javascript:void(0);" ng-click="postfb('+item.id+',\''+item.type+'\',\''+item.value+'\')" id="comment_btn">POST</a></div>',
                        plain:true,
                        closeByDocument: false,
                        closeByEscape: false,
                        scope: $scope
                    });

        }
    }

    $scope.postfb = function(id,type,value){
        if($scope.fbStatus) {
            $scope.getAuthResponse = $facebook.getAuthResponse();
            $scope.fb_share(id,type,value,$scope.getAuthResponse.accessToken);
        } else {
            $facebook.login().then(function(){
                $scope.getAuthResponse = $facebook.getAuthResponse();
                $scope.fb_share(id,type,value,$scope.getAuthResponse.accessToken);
            });
        }

    }

    $scope.$on('fb.auth.authResponseChange', function() {
        $scope.fbStatus = $facebook.isConnected();
    });

    $scope.fb_share_route = function(image,accessToken){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/updateAccessToken',
            data    : $.param({'accesstoken':accessToken,'id':$rootScope.rootsessUser}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
        });
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/postfbRoutes',
            data    : $.param({'image':image,'accessToken':accessToken}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
                $scope.showFbSucMsg();
        });
    }

    $scope.fb_share = function(id,type,value,accessToken){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/updateAccessToken',
            data    : $.param({'accesstoken':accessToken,'id':$rootScope.rootsessUser}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
        });

        var fbtext = $('#fbtext').val();

        if(type == 'image'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/postfbimage',
                data    : $.param({'id':id,'image':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                    $scope.dialog2.close();
                    $scope.showFbSucMsg();
            });
        }else if(type == 'mp4'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/postfbvideo',
                data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                    $scope.dialog2.close();
                    $scope.showFbSucMsg();
            });
        }else if(type == 'youtube'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/postfbYtvideo',
                data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                    $scope.dialog2.close();
                    $scope.showFbSucMsg();
            });
        }else{

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/postfbText',
                data    : $.param({'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                    $scope.dialog2.close();
                    $scope.showFbSucMsg();
            });
        }



    }

    $scope.showFbSucMsg = function(){
        $scope.showFbSucMsg1 = ngDialog.open({
            template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Posted Successfully On Facebook</div>',
            plain:true,
            showClose:false,
            closeByDocument: true,
            closeByEscape: true
        });

        setTimeout(function(){
            $scope.showFbSucMsg1.close();
        },3000);
    }


    var modalInstance;
    $rootScope.showPhoto = function(item,index){

        $rootScope.photoDet = {
            id : item.id,
            itemId : item.id,
            imgSrc : item.s_img,
            s_img : item.s_img,
            userImage : item.user_image,
            user_id : item.user_id,
            value : item.value,
            type: 'image',
            userName : item.user_name,
            timeSpan : item.timespan,
            msg : item.msg,
            like_no : item.like_no,
            is_like : item.is_like,
            c_user:item.c_user,
            cUserImage : item.c_user_image,
            pstval : '',
            commentList:item.comment,
            commentSliceList:item.commentSliceList,
            comment_no1:item.comment_no1,
            sIndex:index
        };

        $scope.animationsEnabled = true;
        modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'photoComment',
            windowClass: 'photoPopup',
            size: 'lg',
            scope : $scope
        });

    }

    $scope.modalClose = function(){
        modalInstance.dismiss('cancel');
    }

     $rootScope.postComment1 = function(item){
        if(item.pstval && typeof(item.pstval)!= 'undefined'){
            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/addcomment',
                data    : $.param({'status_id':item.itemId,'cmnt_body':item.pstval,'user_id':$rootScope.rootsessUser}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                item.commentList.push(result);
                item.pstval = '';
            }).error(function (result) {
                $rootScope.postComment1(item);
            });
        }
    };

    $rootScope.emojis = ' :bowtie:  :smile:  :laughing:  :blush:  :smiley:  :relaxed:  :smirk:  :heart_eyes:  :kissing_heart:  :kissing_closed_eyes:  :flushed:  :relieved:  :satisfied:  :grin:  :wink:  :stuck_out_tongue_winking_eye:  :stuck_out_tongue_closed_eyes:  :grinning:  :kissing:  :kissing_smiling_eyes:  :stuck_out_tongue:  :sleeping:  :worried:  :frowning:  :anguished:  :open_mouth:  :grimacing:  :confused:  :hushed:  :expressionless:  :unamused:  :sweat_smile:  :sweat:  :disappointed_relieved:  :weary:  :pensive:  :disappointed:  :confounded:  :fearful:  :cold_sweat:  :persevere:  :cry:  :sob:  :joy:  :astonished:  :scream:  :neckbeard:  :tired_face:  :angry:  :rage:  :triumph:  :sleepy:  :yum:  :mask:  :sunglasses:  :dizzy_face:  :imp:  :neutral_face:  :no_mouth:  :innocent:  :alien:  :yellow_heart:  :blue_heart:  :purple_heart:  :heart:  :green_heart:  :broken_heart:  :heartbeat:  :heartpulse:  :two_hearts:  :revolving_hearts:  :cupid:  :sparkling_heart:  :sparkles:  :star:  :star2:  :dizzy:  :boom:  :anger:  :exclamation:  :question:  :grey_exclamation:  :grey_question:  :zzz:  :dash:  :sweat_drops:  :notes:  :musical_note:  :fire:  :hankey:  :+1:  :thumbsup:  :-1:  :thumbsdown:  :ok_hand:  :punch: :fist:  :v:  :wave:  :hand:  :raised_hand:  :open_hands:  :point_up:  :point_down:  :point_left:  :point_right:  :raised_hands:  :pray:  :point_up_2:  :clap:  :muscle:  :metal:  :fu:  :runner:  :couple:  :family:  :two_men_holding_hands:  :two_women_holding_hands:  :dancer:  :dancers:  :ok_woman:  :no_good:  :information_desk_person:  :raising_hand:  :bride_with_veil:  :person_with_pouting_face:  :person_frowning:  :bow:  :couplekiss:  :couple_with_heart:  :massage:  :haircut:  :nail_care:  :boy:  :girl:  :woman:  :man:  :baby:  :older_woman:  :older_man:  :person_with_blond_hair:  :man_with_gua_pi_mao:  :man_with_turban:  :construction_worker:  :cop:  :angel:  :princess:  :smiley_cat:  :smile_cat:  :heart_eyes_cat:  :kissing_cat:  :smirk_cat:  :scream_cat:  :crying_cat_face:  :joy_cat:  :pouting_cat:  :japanese_ogre:  :japanese_goblin:  :see_no_evil:  :hear_no_evil:  :speak_no_evil:  :guardsman:  :skull:  :feet:  :lips:  :kiss:  :droplet:  :ear:  :eyes:  :nose:  :tongue:  :love_letter:  :bust_in_silhouette:  :busts_in_silhouette:  :speech_balloon:  :thought_balloon:  :feelsgood:  :finnadie:  :goberserk:  :godmode:  :hurtrealbad:  :rage1:  :rage2:  :rage3:  :rage4:  :suspect:  :trollface: ';

    $rootScope.emojisArr = ["bowtie","smile","laughing","blush","smiley","relaxed","smirk","heart_eyes","kissing_heart","kissing_closed_eyes","flushed","relieved","satisfied","grin","wink","stuck_out_tongue_winking_eye","stuck_out_tongue_closed_eyes","grinning","kissing","winky_face","kissing_smiling_eyes","stuck_out_tongue","sleeping","worried","frowning","anguished","open_mouth","grimacing","confused","hushed","expressionless","unamused","sweat_smile","sweat","wow","disappointed_relieved","weary","pensive","disappointed","confounded","fearful","cold_sweat","persevere","cry","sob","joy","astonished","scream","neckbeard","tired_face","angry","rage","triumph","sleepy","yum","mask","sunglasses","dizzy_face","imp","neutral_face","no_mouth","innocent","alien","yellow_heart","blue_heart","purple_heart","heart","green_heart","broken_heart","heartbeat","heartpulse","two_hearts","revolving_hearts","cupid","sparkling_heart","sparkles","star","star2","dizzy","boom","anger","exclamation","question","grey_exclamation","grey_question","zzz","dash","sweat_drops","notes","musical_note","fire","hankey","thumbsup","thumbsdown","ok_hand","punch","fist","v","wave","hand","open_hands","point_up","point_down","point_left","point_right","raised_hands","pray","point_up_2","clap","muscle","metal","fu","walking","runner","couple","family","two_men_holding_hands","two_women_holding_hands","dancer","dancers","ok_woman","no_good","information_desk_person","raising_hand","bride_with_veil","person_with_pouting_face","person_frowning","bow","couplekiss","couple_with_heart","massage","haircut","nail_care","boy","girl","woman","man","baby","older_woman","older_man","person_with_blond_hair","man_with_gua_pi_mao","man_with_turban","construction_worker","cop","angel","princess","smiley_cat","smile_cat","heart_eyes_cat","kissing_cat","smirk_cat","scream_cat","crying_cat_face","joy_cat","pouting_cat","japanese_ogre","japanese_goblin","see_no_evil","hear_no_evil","speak_no_evil","guardsman","skull","feet","lips","kiss","droplet","ear","eyes","nose","tongue","love_letter","bust_in_silhouette","busts_in_silhouette","speech_balloon","thought_balloon","feelsgood","finnadie","goberserk","godmode","hurtrealbad","rage1","rage2","rage3","rage4","suspect","trollface","sunny","umbrella","cloud","snowflake","snowman","zap","cyclone","foggy","ocean","cat","dog","mouse","hamster","rabbit","wolf","frog","tiger","koala","bear","pig","pig_nose","cow","boar","monkey_face","monkey","horse","racehorse","camel","sheep","elephant","panda_face","snake","bird","baby_chick","hatched_chick","hatching_chick","chicken","penguin","turtle","bug","honeybee","ant","beetle","snail","octopus","tropical_fish","fish","whale","whale2","dolphin","cow2","ram","rat","water_buffalo","tiger2","rabbit2","dragon","goat","rooster","dog2","pig2","mouse2","ox","dragon_face","blowfish","crocodile","dromedary_camel","leopard","cat2","poodle","paw_prints","bouquet","cherry_blossom","tulip","four_leaf_clover","rose","sunflower","hibiscus","maple_leaf","leaves","fallen_leaf","herb","mushroom","cactus","palm_tree","evergreen_tree","deciduous_tree","chestnut","seedling","blossom","ear_of_rice","shell","globe_with_meridians","sun_with_face","full_moon_with_face","new_moon_with_face","new_moon","waxing_crescent_moon","first_quarter_moon","waxing_gibbous_moon","full_moon","waning_gibbous_moon","last_quarter_moon","waning_crescent_moon","last_quarter_moon_with_face","first_quarter_moon_with_face","moon","earth_africa","earth_americas","earth_asia","volcano","milky_way","partly_sunny","octocat","squirrel","bamboo","gift_heart","dolls","school_satchel","mortar_board","flags","fireworks","sparkler","wind_chime","rice_scene","jack_o_lantern","ghost","santa","christmas_tree","gift","bell","no_bell","tanabata_tree","tada","confetti_ball","balloon","crystal_ball","cd","dvd","floppy_disk","camera","video_camera","movie_camera","computer","tv","iphone","phone","telephone_receiver","pager","fax","minidisc","vhs","sound","mute","loudspeaker","mega","hourglass","hourglass_flowing_sand","alarm_clock","watch","radio","satellite","loop","mag","mag_right","unlock","lock","lock_with_ink_pen","closed_lock_with_key","key","bulb","flashlight","high_brightness","low_brightness","electric_plug","battery","calling","email","mailbox","postbox","bath","bathtub","shower","toilet","wrench","nut_and_bolt","hammer","seat","moneybag","yen","dollar","pound","euro","credit_card","money_with_wings","e-mail","inbox_tray","outbox_tray","envelope","incoming_envelope","postal_horn","mailbox_closed","mailbox_with_mail","mailbox_with_no_mail","door","smoking","bomb","gun","hocho","pill","syringe","page_facing_up","page_with_curl","bookmark_tabs","bar_chart","chart_with_upwards_trend","chart_with_downwards_trend","scroll","clipboard","calendar","date","card_index","file_folder","open_file_folder","scissors","pushpin","paperclip","black_nib","pencil2","straight_ruler","triangular_ruler","closed_book","green_book","blue_book","orange_book","notebook","notebook_with_decorative_cover","ledger","books","bookmark","name_badge","microscope","telescope","newspaper","football","basketball","soccer","baseball","tennis","8ball","rugby_football","bowling","golf","mountain_bicyclist","bicyclist","horse_racing","snowboarder","swimmer","surfer","ski","spades","hearts","clubs","diamonds","gem","ring","trophy","musical_score","musical_keyboard","violin","space_invader","video_game","black_joker","flower_playing_cards","game_die","dart","mahjong","clapper","memo","pencil","book","art","microphone","headphones","trumpet","saxophone","guitar","shoe","sandal","high_heel","lipstick","boot","shirt","necktie","womans_clothes","dress","running_shirt_with_sash","jeans","kimono","bikini","ribbon","tophat","crown","womans_hat","mans_shoe","closed_umbrella","briefcase","handbag","pouch","purse","eyeglasses","fishing_pole_and_fish","coffee","tea","sake","baby_bottle","beer","beers","cocktail","tropical_drink","wine_glass","fork_and_knife","pizza","hamburger","fries","poultry_leg","meat_on_bone","spaghetti","curry","fried_shrimp","bento","sushi","fish_cake","rice_ball","rice_cracker","rice","ramen","stew","oden","dango","egg","bread","doughnut","custard","icecream","ice_cream","shaved_ice","birthday","cake","cookie","chocolate_bar","candy","lollipop","honey_pot","apple","green_apple","tangerine","lemon","cherries","grapes","watermelon","strawberry","peach","melon","banana","pear","pineapple","sweet_potato","eggplant","tomato","corn","house","house_with_garden","school","office","post_office","hospital","bank","convenience_store","love_hotel","hotel","wedding","church","department_store","european_post_office","city_sunrise","city_sunset","japanese_castle","european_castle","tent","factory","tokyo_tower","japan","mount_fuji","sunrise_over_mountains","sunrise","stars","statue_of_liberty","bridge_at_night","carousel_horse","rainbow","ferris_wheel","fountain","roller_coaster","ship","speedboat","boat","rowboat","anchor","rocket","airplane","helicopter","steam_locomotive","tram","mountain_railway","bike","aerial_tramway","suspension_railway","mountain_cableway","tractor","blue_car","oncoming_automobile","car","red_car","taxi","oncoming_taxi","articulated_lorry","bus","oncoming_bus","rotating_light","police_car","oncoming_police_car","fire_engine","ambulance","minibus","truck","train","station","train2","bullettrain_side","light_rail","monorail","railway_car","trolleybus","ticket","fuelpump","vertical_traffic_light","traffic_light","warning","construction","beginner","atm","slot_machine","busstop","barber","hotsprings","checkered_flag","crossed_flags","izakaya_lantern","moyai","circus_tent","performing_arts","round_pushpin","triangular_flag_on_post","jp","kr","cn","us","fr","es","it","ru","uk","de","one","two","three","four","five","six","seven","eight","nine","keycap_ten","1234","zero","hash","symbols","arrow_backward","arrow_down","arrow_forward","arrow_left","capital_abcd","abcd","abc","arrow_lower_left","arrow_lower_right","arrow_right","arrow_up","arrow_upper_left","arrow_upper_right","arrow_double_down","arrow_double_up","arrow_down_small","arrow_heading_down","arrow_heading_up","leftwards_arrow_with_hook","arrow_right_hook","left_right_arrow","arrow_up_down","arrow_up_small","arrows_clockwise","arrows_counterclockwise","rewind","fast_forward","information_source","ok","twisted_rightwards_arrows","repeat","repeat_one","new","top","up","cool","free","ng","cinema","koko","signal_strength","u5272","u5408","u55b6","u6307","u6708","u6709","u6e80","u7121","u7533","u7a7a","u7981","sa","restroom","mens","womens","baby_symbol","no_smoking","parking","wheelchair","metro","baggage_claim","accept","wc","potable_water","put_litter_in_its_place","secret","congratulations","m","passport_control","left_luggage","customs","ideograph_advantage","cl","sos","id","no_entry_sign","underage","no_mobile_phones","do_not_litter","non-potable_water","no_bicycles","no_pedestrians","children_crossing","no_entry","eight_spoked_asterisk","eight_pointed_black_star","heart_decoration","vs","vibration_mode","mobile_phone_off","chart","currency_exchange","aries","taurus","gemini","cancer","leo","virgo","libra","scorpius","sagittarius","capricorn","aquarius","pisces","ophiuchus","six_pointed_star","negative_squared_cross_mark","a","b","ab","o2","diamond_shape_with_a_dot_inside","recycle","end","on","soon","clock1","clock130","clock10","clock1030","clock11","clock1130","clock12","clock1230","clock2","clock230","clock3","clock330","clock4","clock430","clock5","clock530","clock6","clock630","clock7","clock730","clock8","clock830","clock9","clock930","heavy_dollar_sign","copyright","registered","tm","x","heavy_exclamation_mark","bangbang","interrobang","o","heavy_multiplication_x","heavy_plus_sign","heavy_minus_sign","heavy_division_sign","white_flower","100","heavy_check_mark","ballot_box_with_check","radio_button","link","curly_loop","wavy_dash","part_alternation_mark","trident","black_square","white_square","white_check_mark","black_square_button","white_square_button","black_circle","white_circle","red_circle","large_blue_circle","large_blue_diamond","large_orange_diamond","small_blue_diamond","small_orange_diamond","small_red_triangle","small_red_triangle_down","shipit"];

    $rootScope.setcommentval = function(event,item) {
        var target = event.target || event.srcElement || event.originalTarget;

        item.commpostval = target.innerHTML;
    }

    $rootScope.emoinsert = function(item,emoitem){
        var emoval2 = ' :'+emoitem+': ';
        var emoval = '<input title="'+emoitem+'" style="border:none; margin-left: 3px; margin-right: 3px;" class="emoticon emoticon-'+emoitem+'" />';

        var prevval = $('#commentdiv000'+item.id).html();

        if(prevval.substr(prevval.length - 4) == '<br>')
            prevval = prevval.substring(0, prevval.length - 4);

        $('#commentdiv000'+item.id).html(prevval+emoval);
        item.commpostval = prevval+emoval;
    }

    $rootScope.emoinsert555 = function(item,emoitem){
        var emoval2 = ' :'+emoitem+': ';
        var emoval = '<input title="'+emoitem+'" style="border:none; margin-left: 3px; margin-right: 3px;" class="emoticon emoticon-'+emoitem+'" />';

        var prevval = $('#commentdiv111').html();

        if(prevval.substr(prevval.length - 4) == '<br>')
            prevval = prevval.substring(0, prevval.length - 4);

        $('#commentdiv111').html(prevval+emoval);
        item.commpostval = prevval+emoval;
    }

    $rootScope.commentEmo = function(event,item){
    }

    $rootScope.resizeTextarea555 = function(event){
        var target = event.target || event.srcElement || event.originalTarget;

        target.style.setProperty ("height", '35px', "important");
        if(target.scrollHeight>51)target.style.setProperty ("height", 'auto', "important");
        target.style.setProperty ("height", target.scrollHeight+'px', "important");
    }

    $rootScope.resizeTextarea = function(event){
        var target = event.target || event.srcElement || event.originalTarget;
        target.style.setProperty ("height", '35px', "important");
        if(target.scrollHeight>51)target.style.setProperty ("height", 'auto', "important");
        target.style.setProperty ("height", target.scrollHeight+'px', "important");
    }

    $rootScope.viewAllComments = function(item){
        item.comment_no1 = 0;
        item.commentSliceList = item.comment;
    }

    $rootScope.viewAllComments1 = function(item){
        item.comment_no1 = 0;
        item.commentSliceList = item.commentList;
    }

    $rootScope.showemojisdiv123 = function(id,item){

        var emoidx = $rootScope.statusList.indexOf(item);

        var emohtml = '<div class="emojisdiv">';

        angular.forEach($rootScope.emojisArr,function(value){
            emohtml += '<a href="javascript:void(0)" ng-click="emoinsert5('+emoidx+',\''+value+'\')" class="emoticon emoticon-'+value+'" title="::'+value+'::" ></a>';
        })

        emohtml += '</div>';

        var $el = angular.element( document.querySelector( '#emojisdiv'+id ) ).html(emohtml);

        $compile($el)($scope);

        if ($('#emojisdiv'+id).is(':hidden')) {
            $('#emojisdiv'+id).show();
        }else{
            $('#emojisdiv'+id).hide();
        }


    }

    $scope.emoinsert5 = function(emoidx,emoitem){
        var item = $rootScope.statusList[emoidx];
        var emoval2 = ' :'+emoitem+': ';
        var emoval = '<input title="'+emoitem+'" style="border:none; margin-left: 3px; margin-right: 3px;" class="emoticon emoticon-'+emoitem+'" />';

        var prevval = $('#commentdiv000'+item.id).html();

        if(prevval.substr(prevval.length - 4) == '<br>')
            prevval = prevval.substring(0, prevval.length - 4);

        $('#commentdiv000'+item.id).html(prevval+emoval);
        item.commpostval = prevval+emoval;
    }

    $rootScope.showemojisdivsada112 = function(id){
        if ($('#showemojisdiv445').is(':hidden')) {
            $('#showemojisdiv445').show();
        }else{
            $('#showemojisdiv445').hide();
        }
    }

    $rootScope.gotouserprofile = function(uid,uname){
        var user_str1 = uname;
        user_str1 = user_str1.replace(/\s+/g, '-');

        user_str1 = user_str1.toLowerCase();

      //  window.location.href = $scope.subUrl+'/profile/'+uid+'/'+user_str1;
       // window.location.href = $scope.subUrl+'/profile1/'+uid;

        $state.go('profile',{'userId':uid});
        return
    }

});


homeControllers1.controller('tabcommon2', function($scope,$state,$sce,$cookieStore,$rootScope,$http,$timeout,$stateParams,uiGmapGoogleMapApi,ngDialog,$facebook,$modal) {
    $rootScope.trustAsHtml = $sce.trustAsHtml;
    $scope.currentUser = $rootScope.rootsessUser;
    $rootScope.widowWidth = $(window).width();

    $rootScope.tagpeopleText11 = function(item){
        var fsgs =item.tagpeopleText;
        return  fsgs;
    }

    $rootScope.viewMoreLoad = 0;
    $rootScope.viewMore = 0;
    $rootScope.offset = 0;

    $rootScope.tabs = [{
        title: 'social',
        url: 'social.tpl.html'
    }, {
        title: 'events',
        url: 'events.tpl.html'
    }, {
        title: 'groups',
        url: 'groups.tpl.html'
    }, {
        title: 'stats',
        url: 'stats.tpl.html'
    }];

    $rootScope.currentTab = 'social.tpl.html';

    $rootScope.tabs = [{
        title: 'social',
        url: 'social.tpl.html'
    }, {
        title: 'events',
        url: 'events.tpl.html'
    }, {
        title: 'groups',
        url: 'groups.tpl.html'
    }, {
        title: 'stats',
        url: 'stats.tpl.html'
    }];

    $rootScope.currentTab = 'social.tpl.html';

    $rootScope.onClickTab = function (tab) {
        $rootScope.viewMoreLoad = 0;
        $rootScope.viewMore = 0;
        $rootScope.offset = 0;
        $rootScope.tabBodyLoad = true;
        $rootScope.currentTab = tab.url;
        if(tab.url == 'social.tpl.html'){
            $scope.getStatus();
        }
        if(tab.url == 'events.tpl.html'){
            $scope.getEvent();
        }
        if(tab.url == 'groups.tpl.html'){
            $scope.getGroup();
        }
        if(tab.url == 'stats.tpl.html'){
            $rootScope.highchartsNG = [];
            $rootScope.chartdata = [];

            $scope.getStat();
        }
    }

    $rootScope.tabBodyLoad = true;

    $rootScope.isActiveTab = function(tabUrl) {
        return tabUrl == $rootScope.currentTab;
    }

    $timeout(function(){
        $scope.getStatus();
    },500);

    $scope.getStatus = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getSpStatus',
            data    : $.param({sp_id:$rootScope.rootsportId,'sess_user_id':$rootScope.rootsessUser,'offset':$rootScope.offset}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.statusList = result.status;

            angular.forEach($rootScope.statusList, function(item, key) {
                var itemcomlist = item.comment;
                itemcomlist = itemcomlist.slice(-5);
                item.commentSliceList = itemcomlist;

                if(typeof(item.routes.id) !='undefined'){
                    item.routes.map.refresh =  function () {
                        item.routes.map.control.refresh(item.routes.map.center);
                    };
                    $timeout(function(){
                        item.routes.map.refresh();
                    },500);
                }
            });

            if(result.totalCount > $rootScope.statusList.length){
                $rootScope.viewMore = 1;
                $rootScope.offset = 5;
            }
            $rootScope.tabBodyLoad = false;
        }).error(function (result) {
            $scope.getStatus();
        });
    }

    $scope.getEvent = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getSpEvents',
            data    : $.param({sp_id:$rootScope.rootsportId,'offset':$rootScope.offset}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.eventList = result.event;
            if(result.totalCount > $rootScope.eventList.length){
                $rootScope.viewMore = 1;
                $rootScope.offset = 5;
            }
            $rootScope.tabBodyLoad = false;
        }).error(function (result) {
            $scope.getEvent();
        });
    }

    $scope.getGroup = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getSpGroups',
            data    : $.param({'userid':$scope.currentUser,sp_id:$rootScope.rootsportId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.groupList = result;
            $rootScope.tabBodyLoad = false;
        }).error(function (result) {
            $scope.getGroup();
        });

    }

    $scope.getStat = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getSpStat',
            data    : $.param({'spId':$rootScope.rootsportId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.stats = result;

            angular.forEach($scope.stats, function(val, key) {
                var highchartsNG = {
                    options: {
                        chart: {
                            type: 'line'
                        }
                    },
                    series: [{
                        data: val.data,
                        name : '<div style="color:#555555;">Month</div>',
                        color : '#F79213'
                    }],
                    title: {
                        text: '<div style="color:#555555;">Last 6 Months</div>'
                    },
                    loading: false,

                    xAxis: {
                        categories: val.mon
                    },

                    yAxis : {
                        title: {
                            text :  '<div style="color:#555555;">Activity</div>',
                        }
                    },

                    tooltip : {
                        valueSuffix : ''
                    },
                }

                var chartdata = {
                    sports_id : val.sports_id,
                    sport_name : val.sport_name,
                    imag_name : val.imag_name,
                    activity_no : val.activity_no,
                    total_dis : val.total_dis,
                    total_time : val.total_time,
                    statDet : val.statDet,
                }

                $rootScope.highchartsNG.push(highchartsNG);
                $rootScope.chartdata.push(chartdata);
            });
            $rootScope.tabBodyLoad = false;

        }).error(function (result) {
            $scope.getStat();
        });

    }

    $rootScope.viewMoreStatus = function(){
        $rootScope.viewMoreLoad = 1;
        $rootScope.viewMore = 0;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getSpStatus',
            data    : $.param({sp_id:$rootScope.rootsportId,'sess_user_id':$rootScope.rootsessUser,'offset':$rootScope.offset}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.viewMoreLoad = 0;
            $rootScope.statusList=$rootScope.statusList.concat(result.status);

            angular.forEach($rootScope.statusList, function(item, key) {
                var itemcomlist = item.comment;
                itemcomlist = itemcomlist.slice(-5);
                item.commentSliceList = itemcomlist;

                if(typeof(item.routes.id) !='undefined'){
                    item.routes.map.refresh =  function () {
                        item.routes.map.control.refresh(item.routes.map.center);
                    };
                    $timeout(function(){
                        item.routes.map.refresh();
                    },500);
                }
            });

            if(result.totalCount > $rootScope.statusList.length){
                $rootScope.viewMore = 1;
                $rootScope.offset = $rootScope.offset+5;
            }
        }).error(function (result) {
            $rootScope.viewMoreStatus();
        });
    }

    $rootScope.viewMoreEvent = function(){
        $rootScope.viewMoreLoad = 1;
        $rootScope.viewMore = 0;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getSpEvents',
            data    : $.param({sp_id:$rootScope.rootsportId,'offset':$rootScope.offset}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.viewMoreLoad = 0;
            $rootScope.eventList = $rootScope.eventList.concat(result.event);
            if(result.totalCount > $rootScope.eventList.length){
                $rootScope.viewMore = 1;
                $rootScope.offset = $rootScope.offset+5;
            }
        }).error(function (result) {
            $rootScope.viewMoreEvent();
        });
    }


    $rootScope.sugGroup = function(){
        $rootScope.tabBodyLoad = true;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getSugGroups',
            data    : $.param({'userid':$rootScope.rootsessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.groupList = result;
            $rootScope.tabBodyLoad = false;
        }).error(function (result) {
            $rootScope.sugGroup();
        });
    }

    $rootScope.locGroup = function(){
        $rootScope.tabBodyLoad = true;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getLocGroups',
            data    : $.param({'userid':$rootScope.rootsessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.groupList = result;
            $rootScope.tabBodyLoad = false;
        }).error(function (result) {
            $rootScope.locGroup();
        });
    }

    $rootScope.viewStatDet = function(index){
        $rootScope.statDet1 = $rootScope.chartdata[index].statDet;
        ngDialog.open({
            template: 'statdet12',
            showClose:true,
            closeByDocument: true,
            closeByEscape: true,
            scope:$rootScope
        });
    }

    $rootScope.showYoutubevdo = function(id,value){
        angular.element( document.querySelector( '#youtubeBody'+id ) ).html('<iframe width="100%" height="100%" src="https://www.youtube.com/embed/'+value+'?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>');
    }

    $rootScope.statusLike = function (item) {
        if(item.is_like){
            item.like_no = item.like_no-1;
        }else{
            item.like_no = item.like_no+1;
        }
        item.is_like = !item.is_like;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/likestatus',
            data    : $.param({'status_id':item.id,'user_id':item.c_user}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {

        });
    };

    $rootScope.changeShareWith = function(item,valu){
        item.share_with = valu;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/changeShareWith',
            data    : $.param({'status_id':item.id,'valu':valu}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {

        });
    }

    $rootScope.postComment = function(event,item){

        if(event.which === 13 && !event.shiftKey) {
            event.preventDefault();
            var commentval = item.commpostval;
            if(commentval !='' && typeof(commentval)!= 'undefined'){
                $http({
                    method: 'POST',
                    async:   false,
                    url: $scope.baseUrl+'/user/ajs1/addcomment',
                    data    : $.param({'status_id':item.id,'cmnt_body':commentval,'user_id':$rootScope.rootsessUser}),
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function (result) {
                    if(item.comment_no){
                        item.comment.push(result);
                        item.commentSliceList.push(result);
                    }else{
                        item.comment = [result];
                        item.commentSliceList = [result];
                    }
                    item.comment_no = item.comment_no +1;
                    item.commpostval = '';
                    $('#commentdiv000'+item.id).html('');
                    $('#emojisdiv'+item.id).hide();
                }).error(function (result) {
                    $rootScope.postComment(event,item);
                });
            }
        }
    }

    $rootScope.delStatus = function(index){
        $scope.confirmDialog = ngDialog.open({
            template: '<div style="text-align:center; font-family: \'veneerregular\'; font-size: 19px;">Are you sure you want to delete this post?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm('+index+')" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
            plain:true,
            showClose:false,
            closeByDocument: false,
            closeByEscape: false,
            className : 'confirmPopup',
            scope:$scope
        });


    }

    $scope.delConfirm = function(index){
        $scope.confirmDialog.close();
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/delstatus',
            data    : $.param({'status_id':$rootScope.statusList[index].id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.statusList.splice(index,1);
            $rootScope.offset = $rootScope.offset-1;
        }).error(function (result) {
            $scope.delConfirm(index);
        });
    }

    $rootScope.delComment = function(index,index1){
        $scope.confirmDialog = ngDialog.open({
            template: '<div style="text-align:center; font-family: \'veneerregular\'; font-size: 19px;">Are you sure you want to delete this comment?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm1('+index+','+index1+')" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
            plain:true,
            showClose:false,
            closeByDocument: false,
            closeByEscape: false,
            className : 'confirmPopup',
            scope:$scope
        });


    }

    $scope.delConfirm1 = function(index,index1){
        $scope.confirmDialog.close();
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/delcomment',
            data    : $.param({'comment_id':$rootScope.statusList[index].comment[index1].id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.statusList[index].comment.splice(index1,1);
            $rootScope.statusList[index].comment_no = $scope.statusList[index].comment_no -1;
        }).error(function (result) {
            $scope.delConfirm1(index,index1);
        });
    }

    $scope.delCancel = function(){
        $scope.confirmDialog.close();
    }

    $rootScope.prShare = function(item){
        if(item.type == 'route'){
            var mapcontent = '<div class="rowtwo " style="float: none; width: 170px; margin:0; padding:0;  ">\
                    <h2 style="  word-wrap: break-word; width: 170px; margin-bottom: 2px; padding-bottom: 2px;color:#000!important">'+item.routes.route_name+'</h2>\
                <div class="date-contain" style="padding-top: 0px; margin-top: -3px;color:#000!important">\
                    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important" >\
                    <span style="color:#616564!important">DATE</span><br />'+item.routes.date+'</h5>\
            <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
            <span style="color:#616564!important">TIME</span><br />'+item.routes.duration+' </h5>\
    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
    <span style="color:#616564!important">DISTANCE</span><br />'+item.routes.distance+' miles</h5>\
</div></div>\
<img src="'+item.routes.sport_image+'" style="width:40px; display: block; margin: 0;"  alt="" />';
            $rootScope.stateIsLoading = true;
            $('#mapconmain').show();
            html2canvas($('#map'+item.id), {
                useCORS: true,
                onrendered: function(canvas) {
                    var url = canvas.toDataURL();

                    $http({
                        method: 'POST',
                        async:   false,
                        url: $scope.baseUrl+'/user/ajs1/canvastoimg',
                        data    : $.param({'data': url}),
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                    }).success(function (result) {
                        var mapImage = result;

                        $('#mapconmain').html(mapcontent);


                        html2canvas($('#mapconmain'), {
                            useCORS: true,
                            onrendered: function(canvas) {
                                var url = canvas.toDataURL();

                                $http({
                                    method: 'POST',
                                    async:   false,
                                    url: $scope.baseUrl+'/user/ajs1/canvastoimg1',
                                    data    : $.param({'data': url}),
                                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                }).success(function (result) {
                                    var divImage = result;

                                    $('#mapconmain').html('');

                                    $http({
                                        method: 'POST',
                                        async:   false,
                                        url: $scope.baseUrl+'/user/ajs1/imageMerge',
                                        data    : $.param({'image1':mapImage,'image2':divImage}),
                                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                    }).success(function (res) {

                                        $rootScope.stateIsLoading = false;

                                        var shareImage = 'http://torqkd.com/fbshare/img/'+res;
                                        $('#mapconmain').hide();
                                        window.open("http://pinterest.com/pin/create/button/?url=http://torqkd.com/&media="+shareImage+"&description=","_blank");


                                    });


                                });

                            }

                        });

                    });

                }

            });
        }else{
            window.open('http://pinterest.com/pin/create/button/?url=http://torqkd.com/&media='+item.s_img+'&description=','_blank');
        }
    }

    $rootScope.twShare = function(item){
        if(item.type == 'route'){
            var mapcontent = '<div class="rowtwo " style="float: none; width: 170px; margin:0; padding:0;  ">\
                    <h2 style="  word-wrap: break-word; width: 170px; margin-bottom: 2px; padding-bottom: 2px;color:#000!important">'+item.routes.route_name+'</h2>\
                <div class="date-contain" style="padding-top: 0px; margin-top: -3px;color:#000!important">\
                    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important" >\
                    <span style="color:#616564!important">DATE</span><br />'+item.routes.date+'</h5>\
            <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
            <span style="color:#616564!important">TIME</span><br />'+item.routes.duration+' </h5>\
    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
    <span style="color:#616564!important">DISTANCE</span><br />'+item.routes.distance+' miles</h5>\
</div></div>\
<img src="'+item.routes.sport_image+'" style="width:40px; display: block; margin: 0;"  alt="" />';
            $rootScope.stateIsLoading = true;
            $('#mapconmain').show();
            html2canvas($('#map'+item.id), {
                useCORS: true,
                onrendered: function(canvas) {
                    var url = canvas.toDataURL();

                    $http({
                        method: 'POST',
                        async:   false,
                        url: $scope.baseUrl+'/user/ajs1/canvastoimg',
                        data    : $.param({'data': url}),
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                    }).success(function (result) {
                        var mapImage = result;

                        $('#mapconmain').html(mapcontent);


                        html2canvas($('#mapconmain'), {
                            useCORS: true,
                            onrendered: function(canvas) {
                                var url = canvas.toDataURL();

                                $http({
                                    method: 'POST',
                                    async:   false,
                                    url: $scope.baseUrl+'/user/ajs1/canvastoimg1',
                                    data    : $.param({'data': url}),
                                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                }).success(function (result) {
                                    var divImage = result;

                                    $('#mapconmain').html('');

                                    $http({
                                        method: 'POST',
                                        async:   false,
                                        url: $scope.baseUrl+'/user/ajs1/imageMerge',
                                        data    : $.param({'image1':mapImage,'image2':divImage}),
                                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                    }).success(function (res) {

                                        $rootScope.stateIsLoading = false;

                                        var shareImage = 'http://torqkd.com/fbshare/img/'+res;
                                        $('#mapconmain').hide();

                                        var sss = 'Tweet Compose';

                                        $scope.dialog2 = ngDialog.open({
                                            template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="twText" id="fbtext"> <a href="javascript:void(0)" ng-click="postTw(\''+shareImage+'\')" id="comment_btn">POST</a></div>',
                                            plain:true,
                                            closeByDocument: false,
                                            closeByEscape: false,
                                            scope: $scope
                                        });

                                    });


                                });

                            }

                        });

                    });

                }

            });
        }else{
            var sss = 'Say Something About This Post';

            if(item.type == 'image'){
                var sss = 'Say Something About This Picture';
            }
            if(item.type == 'mp4' || item.type == 'youtube'){
                var sss = 'Say Something About This Video';
            }

            $scope.dialog2 = ngDialog.open({
                template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="twText" id="fbtext"> <a href="javascript:void(0)" ng-click="postTw(\''+item.value+'\',\''+item.type+'\')" id="comment_btn">POST</a></div>',
                plain:true,
                closeByDocument: false,
                closeByEscape: false,
                scope: $scope
            });
        }
    };

    $scope.postTw = function(value,type){
        $scope.dialog2.close();
        var twText = $('#fbtext').val();

        var sType = 'text';
        if(type == 'image'){
            sType = 'statImg';
        }

        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getTwOauth',
            data    : $.param({'user_id':$rootScope.rootsessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            if(result.oauth_token == '' || result.oauth_token_secret == ''){
                window.location.href = ($scope.baseUrl+'/user/profile/twittershare1?image='+value+'&page=profile&com='+twText+'&userid='+$scope.sessUser+'&type='+sType);
            }else{
                $http({
                    method: 'POST',
                    async:   false,
                    url: $scope.baseUrl+'/twitter31.php',
                    data    : $.param({'type':sType,'oauth_token':result.oauth_token,'oauth_token_secret':result.oauth_token_secret,'com':twText,'image':value}),
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function (result) {
                    $scope.showTwSucMsg();
                });
            }
        });


    }

    $scope.showTwSucMsg = function(){
        $scope.showTwSucMsg1 = ngDialog.open({
            template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Posted Successfully On Twitter</div>',
            plain:true,
            showClose:false,
            closeByDocument: true,
            closeByEscape: true
        });

        setTimeout(function(){
            $scope.showTwSucMsg1.close();
        },3000);
    }

    $rootScope.fbShare = function(item){
        if(item.type == 'route'){
            var mapcontent = '<div class="rowtwo " style="float: none; width: 170px; margin:0; padding:0;  ">\
                    <h2 style="  word-wrap: break-word; width: 170px; margin-bottom: 2px; padding-bottom: 2px;color:#000!important">'+item.routes.route_name+'</h2>\
                <div class="date-contain" style="padding-top: 0px; margin-top: -3px;color:#000!important">\
                    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important" >\
                    <span style="color:#616564!important">DATE</span><br />'+item.routes.date+'</h5>\
            <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
            <span style="color:#616564!important">TIME</span><br />'+item.routes.duration+' </h5>\
    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
    <span style="color:#616564!important">DISTANCE</span><br />'+item.routes.distance+' miles</h5>\
</div></div>\
<img src="'+item.routes.sport_image+'" style="width:40px; display: block; margin: 0;"  alt="" />';
            $rootScope.stateIsLoading = true;
            $('#mapconmain').show();
            html2canvas($('#map'+item.id), {
                useCORS: true,
                onrendered: function(canvas) {
                    var url = canvas.toDataURL();

                    $http({
                        method: 'POST',
                        async:   false,
                        url: $scope.baseUrl+'/user/ajs1/canvastoimg',
                        data    : $.param({'data': url}),
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                    }).success(function (result) {
                        var mapImage = result;

                        $('#mapconmain').html(mapcontent);


                        html2canvas($('#mapconmain'), {
                            useCORS: true,
                            onrendered: function(canvas) {
                                var url = canvas.toDataURL();

                                $http({
                                    method: 'POST',
                                    async:   false,
                                    url: $scope.baseUrl+'/user/ajs1/canvastoimg1',
                                    data    : $.param({'data': url}),
                                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                }).success(function (result) {
                                    var divImage = result;

                                    $('#mapconmain').html('');

                                    $http({
                                        method: 'POST',
                                        async:   false,
                                        url: $scope.baseUrl+'/user/ajs1/imageMerge',
                                        data    : $.param({'image1':mapImage,'image2':divImage}),
                                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                    }).success(function (res) {

                                        $rootScope.stateIsLoading = false;

                                        var shareImage = 'http://torqkd.com/fbshare/img/'+res;
                                        $('#mapconmain').hide();

                                        if($scope.fbStatus) {
                                            $scope.getAuthResponse = $facebook.getAuthResponse();
                                            $scope.fb_share_route(shareImage,$scope.getAuthResponse.accessToken);
                                        } else {
                                            $facebook.login().then(function(){
                                                $scope.getAuthResponse = $facebook.getAuthResponse();
                                                $scope.fb_share_route(shareImage,$scope.getAuthResponse.accessToken);
                                            });
                                        }


                                    });


                                });

                            }

                        });

                    });

                }

            });
        }else{

            var sss = 'Say Something About This Post';

            if(item.type == 'image'){
                var sss = 'Say Something About This Picture';
            }
            if(item.type == 'mp4' || item.type == 'youtube'){
                var sss = 'Say Something About This Video';
            }

            $scope.dialog2 = ngDialog.open({
                template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="fbText" id="fbtext"> <a href="javascript:void(0);" ng-click="postfb('+item.id+',\''+item.type+'\',\''+item.value+'\')" id="comment_btn">POST</a></div>',
                plain:true,
                closeByDocument: false,
                closeByEscape: false,
                scope: $scope
            });

        }
    }

    $scope.postfb = function(id,type,value){
        if($scope.fbStatus) {
            $scope.getAuthResponse = $facebook.getAuthResponse();
            $scope.fb_share(id,type,value,$scope.getAuthResponse.accessToken);
        } else {
            $facebook.login().then(function(){
                $scope.getAuthResponse = $facebook.getAuthResponse();
                $scope.fb_share(id,type,value,$scope.getAuthResponse.accessToken);
            });
        }

    }

    $scope.$on('fb.auth.authResponseChange', function() {
        $scope.fbStatus = $facebook.isConnected();
    });

    $scope.fb_share_route = function(image,accessToken){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/updateAccessToken',
            data    : $.param({'accesstoken':accessToken,'id':$rootScope.rootsessUser}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
        });
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/postfbRoutes',
            data    : $.param({'image':image,'accessToken':accessToken}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.showFbSucMsg();
        });
    }

    $scope.fb_share = function(id,type,value,accessToken){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/updateAccessToken',
            data    : $.param({'accesstoken':accessToken,'id':$rootScope.rootsessUser}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
        });

        var fbtext = $('#fbtext').val();

        if(type == 'image'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/postfbimage',
                data    : $.param({'id':id,'image':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.dialog2.close();
                $scope.showFbSucMsg();
            });
        }else if(type == 'mp4'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/postfbvideo',
                data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.dialog2.close();
                $scope.showFbSucMsg();
            });
        }else if(type == 'youtube'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/postfbYtvideo',
                data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.dialog2.close();
                $scope.showFbSucMsg();
            });
        }else{

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/postfbText',
                data    : $.param({'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.dialog2.close();
                $scope.showFbSucMsg();
            });
        }



    }

    $scope.showFbSucMsg = function(){
        $scope.showFbSucMsg1 = ngDialog.open({
            template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Posted Successfully On Facebook</div>',
            plain:true,
            showClose:false,
            closeByDocument: true,
            closeByEscape: true
        });

        setTimeout(function(){
            $scope.showFbSucMsg1.close();
        },3000);
    }


    var modalInstance;
    $rootScope.showPhoto = function(item,index){

        $rootScope.photoDet = {
            id : item.id,
            itemId : item.id,
            imgSrc : item.s_img,
            s_img : item.s_img,
            userImage : item.user_image,
            user_id : item.user_id,
            value : item.value,
            type: 'image',
            userName : item.user_name,
            timeSpan : item.timespan,
            msg : item.msg,
            like_no : item.like_no,
            is_like : item.is_like,
            c_user:item.c_user,
            cUserImage : item.c_user_image,
            pstval : '',
            commentList:item.comment,
            commentSliceList:item.commentSliceList,
            comment_no1:item.comment_no1,
            sIndex:index
        };

        $scope.animationsEnabled = true;
        modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'photoComment',
            windowClass: 'photoPopup',
            size: 'lg',
            scope : $scope
        });

    }

    $scope.modalClose = function(){
        modalInstance.dismiss('cancel');
    }

    $rootScope.postComment1 = function(item){
        if(item.pstval && typeof(item.pstval)!= 'undefined'){
            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/addcomment',
                data    : $.param({'status_id':item.itemId,'cmnt_body':item.pstval,'user_id':$rootScope.rootsessUser}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                item.commentList.push(result);
                item.pstval = '';
            });
        }
    };

    $rootScope.resizeTextarea = function(event){
        var target = event.target || event.srcElement || event.originalTarget;
        target.style.setProperty ("height", '35px', "important");
        if(target.scrollHeight>51)target.style.setProperty ("height", 'auto', "important");
        target.style.setProperty ("height", target.scrollHeight+'px', "important");

    }

    $rootScope.viewAllComments = function(item){
        item.comment_no1 = 0;
        item.commentSliceList = item.comment;
    }

    $rootScope.viewAllComments1 = function(item){
        item.comment_no1 = 0;
        item.commentSliceList = item.commentList;
    }

    $rootScope.emojisArr = ["bowtie","smile","laughing","blush","smiley","relaxed","smirk","heart_eyes","kissing_heart","kissing_closed_eyes","flushed","relieved","satisfied","grin","wink","stuck_out_tongue_winking_eye","stuck_out_tongue_closed_eyes","grinning","kissing","winky_face","kissing_smiling_eyes","stuck_out_tongue","sleeping","worried","frowning","anguished","open_mouth","grimacing","confused","hushed","expressionless","unamused","sweat_smile","sweat","wow","disappointed_relieved","weary","pensive","disappointed","confounded","fearful","cold_sweat","persevere","cry","sob","joy","astonished","scream","neckbeard","tired_face","angry","rage","triumph","sleepy","yum","mask","sunglasses","dizzy_face","imp","neutral_face","no_mouth","innocent","alien","yellow_heart","blue_heart","purple_heart","heart","green_heart","broken_heart","heartbeat","heartpulse","two_hearts","revolving_hearts","cupid","sparkling_heart","sparkles","star","star2","dizzy","boom","anger","exclamation","question","grey_exclamation","grey_question","zzz","dash","sweat_drops","notes","musical_note","fire","hankey","thumbsup","thumbsdown","ok_hand","punch","fist","v","wave","hand","open_hands","point_up","point_down","point_left","point_right","raised_hands","pray","point_up_2","clap","muscle","metal","fu","walking","runner","couple","family","two_men_holding_hands","two_women_holding_hands","dancer","dancers","ok_woman","no_good","information_desk_person","raising_hand","bride_with_veil","person_with_pouting_face","person_frowning","bow","couplekiss","couple_with_heart","massage","haircut","nail_care","boy","girl","woman","man","baby","older_woman","older_man","person_with_blond_hair","man_with_gua_pi_mao","man_with_turban","construction_worker","cop","angel","princess","smiley_cat","smile_cat","heart_eyes_cat","kissing_cat","smirk_cat","scream_cat","crying_cat_face","joy_cat","pouting_cat","japanese_ogre","japanese_goblin","see_no_evil","hear_no_evil","speak_no_evil","guardsman","skull","feet","lips","kiss","droplet","ear","eyes","nose","tongue","love_letter","bust_in_silhouette","busts_in_silhouette","speech_balloon","thought_balloon","feelsgood","finnadie","goberserk","godmode","hurtrealbad","rage1","rage2","rage3","rage4","suspect","trollface","sunny","umbrella","cloud","snowflake","snowman","zap","cyclone","foggy","ocean","cat","dog","mouse","hamster","rabbit","wolf","frog","tiger","koala","bear","pig","pig_nose","cow","boar","monkey_face","monkey","horse","racehorse","camel","sheep","elephant","panda_face","snake","bird","baby_chick","hatched_chick","hatching_chick","chicken","penguin","turtle","bug","honeybee","ant","beetle","snail","octopus","tropical_fish","fish","whale","whale2","dolphin","cow2","ram","rat","water_buffalo","tiger2","rabbit2","dragon","goat","rooster","dog2","pig2","mouse2","ox","dragon_face","blowfish","crocodile","dromedary_camel","leopard","cat2","poodle","paw_prints","bouquet","cherry_blossom","tulip","four_leaf_clover","rose","sunflower","hibiscus","maple_leaf","leaves","fallen_leaf","herb","mushroom","cactus","palm_tree","evergreen_tree","deciduous_tree","chestnut","seedling","blossom","ear_of_rice","shell","globe_with_meridians","sun_with_face","full_moon_with_face","new_moon_with_face","new_moon","waxing_crescent_moon","first_quarter_moon","waxing_gibbous_moon","full_moon","waning_gibbous_moon","last_quarter_moon","waning_crescent_moon","last_quarter_moon_with_face","first_quarter_moon_with_face","moon","earth_africa","earth_americas","earth_asia","volcano","milky_way","partly_sunny","octocat","squirrel","bamboo","gift_heart","dolls","school_satchel","mortar_board","flags","fireworks","sparkler","wind_chime","rice_scene","jack_o_lantern","ghost","santa","christmas_tree","gift","bell","no_bell","tanabata_tree","tada","confetti_ball","balloon","crystal_ball","cd","dvd","floppy_disk","camera","video_camera","movie_camera","computer","tv","iphone","phone","telephone_receiver","pager","fax","minidisc","vhs","sound","mute","loudspeaker","mega","hourglass","hourglass_flowing_sand","alarm_clock","watch","radio","satellite","loop","mag","mag_right","unlock","lock","lock_with_ink_pen","closed_lock_with_key","key","bulb","flashlight","high_brightness","low_brightness","electric_plug","battery","calling","email","mailbox","postbox","bath","bathtub","shower","toilet","wrench","nut_and_bolt","hammer","seat","moneybag","yen","dollar","pound","euro","credit_card","money_with_wings","e-mail","inbox_tray","outbox_tray","envelope","incoming_envelope","postal_horn","mailbox_closed","mailbox_with_mail","mailbox_with_no_mail","door","smoking","bomb","gun","hocho","pill","syringe","page_facing_up","page_with_curl","bookmark_tabs","bar_chart","chart_with_upwards_trend","chart_with_downwards_trend","scroll","clipboard","calendar","date","card_index","file_folder","open_file_folder","scissors","pushpin","paperclip","black_nib","pencil2","straight_ruler","triangular_ruler","closed_book","green_book","blue_book","orange_book","notebook","notebook_with_decorative_cover","ledger","books","bookmark","name_badge","microscope","telescope","newspaper","football","basketball","soccer","baseball","tennis","8ball","rugby_football","bowling","golf","mountain_bicyclist","bicyclist","horse_racing","snowboarder","swimmer","surfer","ski","spades","hearts","clubs","diamonds","gem","ring","trophy","musical_score","musical_keyboard","violin","space_invader","video_game","black_joker","flower_playing_cards","game_die","dart","mahjong","clapper","memo","pencil","book","art","microphone","headphones","trumpet","saxophone","guitar","shoe","sandal","high_heel","lipstick","boot","shirt","necktie","womans_clothes","dress","running_shirt_with_sash","jeans","kimono","bikini","ribbon","tophat","crown","womans_hat","mans_shoe","closed_umbrella","briefcase","handbag","pouch","purse","eyeglasses","fishing_pole_and_fish","coffee","tea","sake","baby_bottle","beer","beers","cocktail","tropical_drink","wine_glass","fork_and_knife","pizza","hamburger","fries","poultry_leg","meat_on_bone","spaghetti","curry","fried_shrimp","bento","sushi","fish_cake","rice_ball","rice_cracker","rice","ramen","stew","oden","dango","egg","bread","doughnut","custard","icecream","ice_cream","shaved_ice","birthday","cake","cookie","chocolate_bar","candy","lollipop","honey_pot","apple","green_apple","tangerine","lemon","cherries","grapes","watermelon","strawberry","peach","melon","banana","pear","pineapple","sweet_potato","eggplant","tomato","corn","house","house_with_garden","school","office","post_office","hospital","bank","convenience_store","love_hotel","hotel","wedding","church","department_store","european_post_office","city_sunrise","city_sunset","japanese_castle","european_castle","tent","factory","tokyo_tower","japan","mount_fuji","sunrise_over_mountains","sunrise","stars","statue_of_liberty","bridge_at_night","carousel_horse","rainbow","ferris_wheel","fountain","roller_coaster","ship","speedboat","boat","rowboat","anchor","rocket","airplane","helicopter","steam_locomotive","tram","mountain_railway","bike","aerial_tramway","suspension_railway","mountain_cableway","tractor","blue_car","oncoming_automobile","car","red_car","taxi","oncoming_taxi","articulated_lorry","bus","oncoming_bus","rotating_light","police_car","oncoming_police_car","fire_engine","ambulance","minibus","truck","train","station","train2","bullettrain_side","light_rail","monorail","railway_car","trolleybus","ticket","fuelpump","vertical_traffic_light","traffic_light","warning","construction","beginner","atm","slot_machine","busstop","barber","hotsprings","checkered_flag","crossed_flags","izakaya_lantern","moyai","circus_tent","performing_arts","round_pushpin","triangular_flag_on_post","jp","kr","cn","us","fr","es","it","ru","uk","de","one","two","three","four","five","six","seven","eight","nine","keycap_ten","1234","zero","hash","symbols","arrow_backward","arrow_down","arrow_forward","arrow_left","capital_abcd","abcd","abc","arrow_lower_left","arrow_lower_right","arrow_right","arrow_up","arrow_upper_left","arrow_upper_right","arrow_double_down","arrow_double_up","arrow_down_small","arrow_heading_down","arrow_heading_up","leftwards_arrow_with_hook","arrow_right_hook","left_right_arrow","arrow_up_down","arrow_up_small","arrows_clockwise","arrows_counterclockwise","rewind","fast_forward","information_source","ok","twisted_rightwards_arrows","repeat","repeat_one","new","top","up","cool","free","ng","cinema","koko","signal_strength","u5272","u5408","u55b6","u6307","u6708","u6709","u6e80","u7121","u7533","u7a7a","u7981","sa","restroom","mens","womens","baby_symbol","no_smoking","parking","wheelchair","metro","baggage_claim","accept","wc","potable_water","put_litter_in_its_place","secret","congratulations","m","passport_control","left_luggage","customs","ideograph_advantage","cl","sos","id","no_entry_sign","underage","no_mobile_phones","do_not_litter","non-potable_water","no_bicycles","no_pedestrians","children_crossing","no_entry","eight_spoked_asterisk","eight_pointed_black_star","heart_decoration","vs","vibration_mode","mobile_phone_off","chart","currency_exchange","aries","taurus","gemini","cancer","leo","virgo","libra","scorpius","sagittarius","capricorn","aquarius","pisces","ophiuchus","six_pointed_star","negative_squared_cross_mark","a","b","ab","o2","diamond_shape_with_a_dot_inside","recycle","end","on","soon","clock1","clock130","clock10","clock1030","clock11","clock1130","clock12","clock1230","clock2","clock230","clock3","clock330","clock4","clock430","clock5","clock530","clock6","clock630","clock7","clock730","clock8","clock830","clock9","clock930","heavy_dollar_sign","copyright","registered","tm","x","heavy_exclamation_mark","bangbang","interrobang","o","heavy_multiplication_x","heavy_plus_sign","heavy_minus_sign","heavy_division_sign","white_flower","100","heavy_check_mark","ballot_box_with_check","radio_button","link","curly_loop","wavy_dash","part_alternation_mark","trident","black_square","white_square","white_check_mark","black_square_button","white_square_button","black_circle","white_circle","red_circle","large_blue_circle","large_blue_diamond","large_orange_diamond","small_blue_diamond","small_orange_diamond","small_red_triangle","small_red_triangle_down","shipit"];


    $rootScope.setcommentval = function(event,item) {
        var target = event.target || event.srcElement || event.originalTarget;

        item.commpostval = target.innerHTML;
    }

    $rootScope.emoinsert = function(item,emoitem){

        var emoval2 = ' :'+emoitem+': ';
        var emoval = '<input title="'+emoitem+'" style="border:none; margin-left: 3px; margin-right: 3px;" class="emoticon emoticon-'+emoitem+'" />';

        var prevval = $('#commentdiv000'+item.id).html();

        if(prevval.substr(prevval.length - 4) == '<br>')
            prevval = prevval.substring(0, prevval.length - 4);

        $('#commentdiv000'+item.id).html(prevval+emoval);
        item.commpostval = prevval+emoval;
    }

    $rootScope.showemojisdiv123 = function(id){
        if ($('#emojisdiv'+id).is(':hidden')) {
            $('#emojisdiv'+id).show();
        }else{
            $('#emojisdiv'+id).hide();
        }
    }

});


homeControllers1.controller('tabcommon1', function($scope,$sce,$state,$cookieStore,$rootScope,$http,$timeout,$stateParams,uiGmapGoogleMapApi,ngDialog,$facebook,$modal) {
    $rootScope.trustAsHtml = $sce.trustAsHtml;
    $rootScope.viewMoreLoad = 0;
    $rootScope.viewMore = 0;
    $rootScope.offset = 0;
    $rootScope.widowWidth = $(window).width();

    $rootScope.tagpeopleText11 = function(item){
        var fsgs =item.tagpeopleText;
        return  fsgs;
    }

    $rootScope.tabs = [{
        title: 'social',
        url: 'social.tpl.html'
    }, {
        title: 'members',
        url: 'members.tpl.html'
    }, {
        title: 'stats',
        url: 'stats.tpl.html'
    }];


    $rootScope.currentTab = 'social.tpl.html';

    $rootScope.onClickTab = function (tab) {
        $rootScope.viewMoreLoad = 0;
        $rootScope.viewMore = 0;
        $rootScope.offset = 0;
        $rootScope.tabBodyLoad = true;
        $rootScope.currentTab = tab.url;

        if(tab.url == 'social.tpl.html'){
            $scope.getStatus();
        }
        if(tab.url == 'members.tpl.html'){
            $scope.getGroupMember();
        }

        if(tab.url == 'settings.tpl.html'){
            $rootScope.tabBodyLoad = false;
        }

        if(tab.url == 'stats.tpl.html'){
            $rootScope.highchartsNG = [];
            $rootScope.chartdata = [];

            $scope.getStat();
        }
    }

    $rootScope.tabBodyLoad = true;

    $rootScope.isActiveTab = function(tabUrl) {
        return tabUrl == $rootScope.currentTab;
    }

    $timeout(function(){
        $scope.getStatus();
    },500);

    $scope.getStatus = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getgroupStatus',
            data    : $.param({'groupId':$rootScope.rootgroupId,'sess_user':$rootScope.rootsessUser,'offset':$rootScope.offset}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.statusList = result.status;

            angular.forEach($rootScope.statusList, function(item, key) {
                var itemcomlist = item.comment;
                itemcomlist = itemcomlist.slice(-5);
                item.commentSliceList = itemcomlist;


                if(typeof(item.routes.id) !='undefined'){
                    item.routes.map.refresh =  function () {
                        item.routes.map.control.refresh(item.routes.map.center);
                    };
                    $timeout(function(){
                        item.routes.map.refresh();
                    },500);
                }




            });

            if(result.totalCount > $rootScope.statusList.length){
                $rootScope.viewMore = 1;
                $rootScope.offset = 5;
            }
            $rootScope.tabBodyLoad = false;
        }).error(function (result) {
            $scope.getStatus();
        });
    }

    $scope.getGroupMember = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getgroupMember',
            data    : $.param({'groupId':$rootScope.rootgroupId,'offset':$rootScope.offset,sess_id:$rootScope.rootsessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.groupMmber = result;
            $rootScope.tabBodyLoad = false;
        }).error(function (result) {
            $scope.getGroupMember();
        });

    }

    $scope.getStat = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getGroupStat',
            data    : $.param({'groupId':$rootScope.rootgroupId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.stats = result;

            angular.forEach($scope.stats, function(val, key) {
                var highchartsNG = {
                    options: {
                        chart: {
                            type: 'line'
                        }
                    },
                    series: [{
                        data: val.data,
                        name : '<div style="color:#555555;">Month</div>',
                        color : '#F79213'
                    }],
                    title: {
                        text: '<div style="color:#555555;">Last 6 Months</div>'
                    },
                    loading: false,

                    xAxis: {
                        categories: val.mon
                    },

                    yAxis : {
                        title: {
                            text :  '<div style="color:#555555;">Activity</div>',
                        }
                    },

                    tooltip : {
                        valueSuffix : ''
                    },
                }

                var chartdata = {
                    sports_id : val.sports_id,
                    sport_name : val.sport_name,
                    imag_name : val.imag_name,
                    activity_no : val.activity_no,
                    total_dis : val.total_dis,
                    total_time : val.total_time,
                    statDet : val.statDet,
                }

                $rootScope.highchartsNG.push(highchartsNG);
                $rootScope.chartdata.push(chartdata);
            });
            $rootScope.tabBodyLoad = false;

        }).error(function (result) {
            $scope.getStat();
        });

    }

    $rootScope.viewMoreStatus = function(){
        $rootScope.viewMoreLoad = 1;
        $rootScope.viewMore = 0;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getgroupStatus',
            data    : $.param({'groupId':$rootScope.rootgroupId,'sess_user':$rootScope.rootsessUser,'offset':$rootScope.offset}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.viewMoreLoad = 0;
            $rootScope.statusList=$rootScope.statusList.concat(result.status);

            angular.forEach($rootScope.statusList, function(item, key) {
                var itemcomlist = item.comment;
                itemcomlist = itemcomlist.slice(-5);
                item.commentSliceList = itemcomlist;

                if(typeof(item.routes.id) !='undefined'){
                    item.routes.map.refresh =  function () {
                        item.routes.map.control.refresh(item.routes.map.center);
                    };
                    $timeout(function(){
                        item.routes.map.refresh();
                    },500);
                }

            });

            if(result.totalCount > $rootScope.statusList.length){
                $rootScope.viewMore = 1;
                $rootScope.offset = $rootScope.offset+5;
            }
        }).error(function (result) {
            $rootScope.viewMoreStatus();
        });
    }

    $rootScope.viewStatDet = function(index){
        $rootScope.statDet1 = $rootScope.chartdata[index].statDet;
        ngDialog.open({
            template: 'statdet12',
            showClose:true,
            closeByDocument: true,
            closeByEscape: true,
            scope:$rootScope
        });
    }

    $rootScope.showYoutubevdo = function(id,value){
        angular.element( document.querySelector( '#youtubeBody'+id ) ).html('<iframe width="100%" height="100%" src="https://www.youtube.com/embed/'+value+'?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>');
    }

    $rootScope.statusLike = function (item) {
        if(item.is_like){
            item.like_no = item.like_no-1;
        }else{
            item.like_no = item.like_no+1;
        }
        item.is_like = !item.is_like;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/likestatus',
            data    : $.param({'status_id':item.id,'user_id':item.c_user}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {

        });

    };

    $rootScope.changeShareWith = function(item,valu){
        item.share_with = valu;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/changeShareWith',
            data    : $.param({'status_id':item.id,'valu':valu}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {

        });
    }

    $rootScope.postComment = function(event,item){
        if(event.which === 13 && !event.shiftKey) {
            event.preventDefault();
            var commentval = item.commpostval;
            //var commentval = event.currentTarget.value;
            if(commentval !='' && typeof(commentval)!= 'undefined'){
                $http({
                    method: 'POST',
                    async:   false,
                    url: $scope.baseUrl+'/user/ajs1/addcomment',
                    data    : $.param({'status_id':item.id,'cmnt_body':commentval,'user_id':$rootScope.rootsessUser}),
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function (result) {
                    if(item.comment_no){
                        item.comment.push(result);
                        item.commentSliceList.push(result);
                    }else{
                        item.comment = [result];
                        item.commentSliceList = [result];
                    }
                    item.comment_no = item.comment_no +1;
                    item.commpostval = '';
                    $('#commentdiv000'+item.id).html('');
                    $('#emojisdiv'+item.id).hide();
                });
            }
        }
    }

    $rootScope.delStatus = function(index){
        $scope.confirmDialog = ngDialog.open({
            template: '<div style="text-align:center; font-family: \'veneerregular\'; font-size: 19px;">Are you sure you want to delete this post?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm('+index+')" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
            plain:true,
            showClose:false,
            closeByDocument: false,
            closeByEscape: false,
            className : 'confirmPopup',
            scope:$scope
        });


    }

    $scope.delConfirm = function(index){
        $scope.confirmDialog.close();
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/delstatus',
            data    : $.param({'status_id':$rootScope.statusList[index].id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.statusList.splice(index,1);
            $rootScope.offset = $rootScope.offset-1;
        }).error(function (result) {
            $scope.delConfirm(index);
        });
    }

    $rootScope.delComment = function(index,index1){
        $scope.confirmDialog = ngDialog.open({
            template: '<div style="text-align:center; font-family: \'veneerregular\'; font-size: 19px;">Are you sure you want to delete this comment?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm1('+index+','+index1+')" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
            plain:true,
            showClose:false,
            closeByDocument: false,
            closeByEscape: false,
            className : 'confirmPopup',
            scope:$scope
        });


    }

    $scope.delConfirm1 = function(index,index1){
        $scope.confirmDialog.close();
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/delcomment',
            data    : $.param({'comment_id':$rootScope.statusList[index].comment[index1].id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.statusList[index].comment.splice(index1,1);
            $rootScope.statusList[index].comment_no = $scope.statusList[index].comment_no -1;
        }).error(function (result) {
            $scope.delConfirm1(index,index1);
        });
    }

    $scope.delCancel = function(){
        $scope.confirmDialog.close();
    }

    $rootScope.prShare = function(item){
        if(item.type == 'route'){
            var mapcontent = '<div class="rowtwo " style="float: none; width: 170px; margin:0; padding:0;  ">\
                    <h2 style="  word-wrap: break-word; width: 170px; margin-bottom: 2px; padding-bottom: 2px;color:#000!important">'+item.routes.route_name+'</h2>\
                <div class="date-contain" style="padding-top: 0px; margin-top: -3px;color:#000!important">\
                    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important" >\
                    <span style="color:#616564!important">DATE</span><br />'+item.routes.date+'</h5>\
            <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
            <span style="color:#616564!important">TIME</span><br />'+item.routes.duration+' </h5>\
    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
    <span style="color:#616564!important">DISTANCE</span><br />'+item.routes.distance+' miles</h5>\
</div></div>\
<img src="'+item.routes.sport_image+'" style="width:40px; display: block; margin: 0;"  alt="" />';
            $rootScope.stateIsLoading = true;
            $('#mapconmain').show();
            html2canvas($('#map'+item.id), {
                useCORS: true,
                onrendered: function(canvas) {
                    var url = canvas.toDataURL();

                    $http({
                        method: 'POST',
                        async:   false,
                        url: $scope.baseUrl+'/user/ajs1/canvastoimg',
                        data    : $.param({'data': url}),
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                    }).success(function (result) {
                        var mapImage = result;

                        $('#mapconmain').html(mapcontent);


                        html2canvas($('#mapconmain'), {
                            useCORS: true,
                            onrendered: function(canvas) {
                                var url = canvas.toDataURL();

                                $http({
                                    method: 'POST',
                                    async:   false,
                                    url: $scope.baseUrl+'/user/ajs1/canvastoimg1',
                                    data    : $.param({'data': url}),
                                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                }).success(function (result) {
                                    var divImage = result;

                                    $('#mapconmain').html('');

                                    $http({
                                        method: 'POST',
                                        async:   false,
                                        url: $scope.baseUrl+'/user/ajs1/imageMerge',
                                        data    : $.param({'image1':mapImage,'image2':divImage}),
                                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                    }).success(function (res) {

                                        $rootScope.stateIsLoading = false;

                                        var shareImage = 'http://torqkd.com/fbshare/img/'+res;
                                        $('#mapconmain').hide();
                                        window.open("http://pinterest.com/pin/create/button/?url=http://torqkd.com/&media="+shareImage+"&description=","_blank");


                                    });


                                });

                            }

                        });

                    });

                }

            });
        }else{
            window.open('http://pinterest.com/pin/create/button/?url=http://torqkd.com/&media='+item.s_img+'&description=','_blank');
        }
    }

    $rootScope.twShare = function(item){
        if(item.type == 'route'){
            var mapcontent = '<div class="rowtwo " style="float: none; width: 170px; margin:0; padding:0;  ">\
                    <h2 style="  word-wrap: break-word; width: 170px; margin-bottom: 2px; padding-bottom: 2px;color:#000!important">'+item.routes.route_name+'</h2>\
                <div class="date-contain" style="padding-top: 0px; margin-top: -3px;color:#000!important">\
                    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important" >\
                    <span style="color:#616564!important">DATE</span><br />'+item.routes.date+'</h5>\
            <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
            <span style="color:#616564!important">TIME</span><br />'+item.routes.duration+' </h5>\
    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
    <span style="color:#616564!important">DISTANCE</span><br />'+item.routes.distance+' miles</h5>\
</div></div>\
<img src="'+item.routes.sport_image+'" style="width:40px; display: block; margin: 0;"  alt="" />';
            $rootScope.stateIsLoading = true;
            $('#mapconmain').show();
            html2canvas($('#map'+item.id), {
                useCORS: true,
                onrendered: function(canvas) {
                    var url = canvas.toDataURL();

                    $http({
                        method: 'POST',
                        async:   false,
                        url: $scope.baseUrl+'/user/ajs1/canvastoimg',
                        data    : $.param({'data': url}),
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                    }).success(function (result) {
                        var mapImage = result;

                        $('#mapconmain').html(mapcontent);


                        html2canvas($('#mapconmain'), {
                            useCORS: true,
                            onrendered: function(canvas) {
                                var url = canvas.toDataURL();

                                $http({
                                    method: 'POST',
                                    async:   false,
                                    url: $scope.baseUrl+'/user/ajs1/canvastoimg1',
                                    data    : $.param({'data': url}),
                                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                }).success(function (result) {
                                    var divImage = result;

                                    $('#mapconmain').html('');

                                    $http({
                                        method: 'POST',
                                        async:   false,
                                        url: $scope.baseUrl+'/user/ajs1/imageMerge',
                                        data    : $.param({'image1':mapImage,'image2':divImage}),
                                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                    }).success(function (res) {

                                        $rootScope.stateIsLoading = false;

                                        var shareImage = 'http://torqkd.com/fbshare/img/'+res;
                                        $('#mapconmain').hide();

                                        var sss = 'Tweet Compose';

                                        $scope.dialog2 = ngDialog.open({
                                            template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="twText" id="fbtext"> <a href="javascript:void(0)" ng-click="postTw(\''+shareImage+'\')" id="comment_btn">POST</a></div>',
                                            plain:true,
                                            closeByDocument: false,
                                            closeByEscape: false,
                                            scope: $scope
                                        });

                                    });


                                });

                            }

                        });

                    });

                }

            });
        }else{
            var sss = 'Say Something About This Post';

            if(item.type == 'image'){
                var sss = 'Say Something About This Picture';
            }
            if(item.type == 'mp4' || item.type == 'youtube'){
                var sss = 'Say Something About This Video';
            }

            $scope.dialog2 = ngDialog.open({
                template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="twText" id="fbtext"> <a href="javascript:void(0)" ng-click="postTw(\''+item.value+'\',\''+item.type+'\')" id="comment_btn">POST</a></div>',
                plain:true,
                closeByDocument: false,
                closeByEscape: false,
                scope: $scope
            });
        }
    };

    $scope.postTw = function(value,type){
        $scope.dialog2.close();
        var twText = $('#fbtext').val();

        var sType = 'text';
        if(type == 'image'){
            sType = 'statImg';
        }

        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getTwOauth',
            data    : $.param({'user_id':$rootScope.rootsessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            if(result.oauth_token == '' || result.oauth_token_secret == ''){
                window.location.href = ($scope.baseUrl+'/user/profile/twittershare1?image='+value+'&page=profile&com='+twText+'&userid='+$scope.sessUser+'&type='+sType);
            }else{
                $http({
                    method: 'POST',
                    async:   false,
                    url: $scope.baseUrl+'/twitter31.php',
                    data    : $.param({'type':sType,'oauth_token':result.oauth_token,'oauth_token_secret':result.oauth_token_secret,'com':twText,'image':value}),
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function (result) {
                    $scope.showTwSucMsg();
                });
            }
        });


    }

    $scope.showTwSucMsg = function(){
        $scope.showTwSucMsg1 = ngDialog.open({
            template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Posted Successfully On Twitter</div>',
            plain:true,
            showClose:false,
            closeByDocument: true,
            closeByEscape: true
        });

        setTimeout(function(){
            $scope.showTwSucMsg1.close();
        },3000);
    }

    $rootScope.fbShare = function(item){
        if(item.type == 'route'){
            var mapcontent = '<div class="rowtwo " style="float: none; width: 170px; margin:0; padding:0;  ">\
                    <h2 style="  word-wrap: break-word; width: 170px; margin-bottom: 2px; padding-bottom: 2px;color:#000!important">'+item.routes.route_name+'</h2>\
                <div class="date-contain" style="padding-top: 0px; margin-top: -3px;color:#000!important">\
                    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important" >\
                    <span style="color:#616564!important">DATE</span><br />'+item.routes.date+'</h5>\
            <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
            <span style="color:#616564!important">TIME</span><br />'+item.routes.duration+' </h5>\
    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
    <span style="color:#616564!important">DISTANCE</span><br />'+item.routes.distance+' miles</h5>\
</div></div>\
<img src="'+item.routes.sport_image+'" style="width:40px; display: block; margin: 0;"  alt="" />';
            $rootScope.stateIsLoading = true;
            $('#mapconmain').show();
            html2canvas($('#map'+item.id), {
                useCORS: true,
                onrendered: function(canvas) {
                    var url = canvas.toDataURL();

                    $http({
                        method: 'POST',
                        async:   false,
                        url: $scope.baseUrl+'/user/ajs1/canvastoimg',
                        data    : $.param({'data': url}),
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                    }).success(function (result) {
                        var mapImage = result;

                        $('#mapconmain').html(mapcontent);


                        html2canvas($('#mapconmain'), {
                            useCORS: true,
                            onrendered: function(canvas) {
                                var url = canvas.toDataURL();

                                $http({
                                    method: 'POST',
                                    async:   false,
                                    url: $scope.baseUrl+'/user/ajs1/canvastoimg1',
                                    data    : $.param({'data': url}),
                                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                }).success(function (result) {
                                    var divImage = result;

                                    $('#mapconmain').html('');

                                    $http({
                                        method: 'POST',
                                        async:   false,
                                        url: $scope.baseUrl+'/user/ajs1/imageMerge',
                                        data    : $.param({'image1':mapImage,'image2':divImage}),
                                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                    }).success(function (res) {

                                        $rootScope.stateIsLoading = false;

                                        var shareImage = 'http://torqkd.com/fbshare/img/'+res;
                                        $('#mapconmain').hide();

                                        if($scope.fbStatus) {
                                            $scope.getAuthResponse = $facebook.getAuthResponse();
                                            $scope.fb_share_route(shareImage,$scope.getAuthResponse.accessToken);
                                        } else {
                                            $facebook.login().then(function(){
                                                $scope.getAuthResponse = $facebook.getAuthResponse();
                                                $scope.fb_share_route(shareImage,$scope.getAuthResponse.accessToken);
                                            });
                                        }


                                    });


                                });

                            }

                        });

                    });

                }

            });
        }else{

            var sss = 'Say Something About This Post';

            if(item.type == 'image'){
                var sss = 'Say Something About This Picture';
            }
            if(item.type == 'mp4' || item.type == 'youtube'){
                var sss = 'Say Something About This Video';
            }

            $scope.dialog2 = ngDialog.open({
                template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="fbText" id="fbtext"> <a href="javascript:void(0);" ng-click="postfb('+item.id+',\''+item.type+'\',\''+item.value+'\')" id="comment_btn">POST</a></div>',
                plain:true,
                closeByDocument: false,
                closeByEscape: false,
                scope: $scope
            });

        }
    }

    $scope.postfb = function(id,type,value){
        if($scope.fbStatus) {
            $scope.getAuthResponse = $facebook.getAuthResponse();
            $scope.fb_share(id,type,value,$scope.getAuthResponse.accessToken);
        } else {
            $facebook.login().then(function(){
                $scope.getAuthResponse = $facebook.getAuthResponse();
                $scope.fb_share(id,type,value,$scope.getAuthResponse.accessToken);
            });
        }

    }

    $scope.$on('fb.auth.authResponseChange', function() {
        $scope.fbStatus = $facebook.isConnected();
    });

    $scope.fb_share_route = function(image,accessToken){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/updateAccessToken',
            data    : $.param({'accesstoken':accessToken,'id':$rootScope.rootsessUser}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
        });
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/postfbRoutes',
            data    : $.param({'image':image,'accessToken':accessToken}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.showFbSucMsg();
        });
    }

    $scope.fb_share = function(id,type,value,accessToken){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/updateAccessToken',
            data    : $.param({'accesstoken':accessToken,'id':$rootScope.rootsessUser}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
        });

        var fbtext = $('#fbtext').val();

        if(type == 'image'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/postfbimage',
                data    : $.param({'id':id,'image':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.dialog2.close();
                $scope.showFbSucMsg();
            });
        }else if(type == 'mp4'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/postfbvideo',
                data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.dialog2.close();
                $scope.showFbSucMsg();
            });
        }else if(type == 'youtube'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/postfbYtvideo',
                data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.dialog2.close();
                $scope.showFbSucMsg();
            });
        }else{

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/postfbText',
                data    : $.param({'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.dialog2.close();
                $scope.showFbSucMsg();
            });
        }



    }

    $scope.showFbSucMsg = function(){
        $scope.showFbSucMsg1 = ngDialog.open({
            template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Posted Successfully On Facebook</div>',
            plain:true,
            showClose:false,
            closeByDocument: true,
            closeByEscape: true
        });

        setTimeout(function(){
            $scope.showFbSucMsg1.close();
        },3000);
    }


    var modalInstance;
    $rootScope.showPhoto = function(item,index){

        $rootScope.photoDet = {
            id : item.id,
            itemId : item.id,
            imgSrc : item.s_img,
            s_img : item.s_img,
            userImage : item.user_image,
            user_id : item.user_id,
            value : item.value,
            type: 'image',
            userName : item.user_name,
            timeSpan : item.timespan,
            msg : item.msg,
            like_no : item.like_no,
            is_like : item.is_like,
            c_user:item.c_user,
            cUserImage : item.c_user_image,
            pstval : '',
            commentList:item.comment,
            commentSliceList:item.commentSliceList,
            comment_no1:item.comment_no1,
            sIndex:index
        };

        $scope.animationsEnabled = true;
        modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'photoComment',
            windowClass: 'photoPopup',
            size: 'lg',
            scope : $scope
        });

    }

    $scope.modalClose = function(){
        modalInstance.dismiss('cancel');
    }

    $rootScope.postComment1 = function(item){
        if(item.pstval && typeof(item.pstval)!= 'undefined'){
            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/addcomment',
                data    : $.param({'status_id':item.itemId,'cmnt_body':item.pstval,'user_id':$rootScope.rootsessUser}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                item.commentList.push(result);
                item.pstval = '';
            });
        }
    };

    $rootScope.resizeTextarea = function(event){
        var target = event.target || event.srcElement || event.originalTarget;
        target.style.setProperty ("height", '35px', "important");
        if(target.scrollHeight>51)target.style.setProperty ("height", 'auto', "important");
        target.style.setProperty ("height", target.scrollHeight+'px', "important");
    }

    $rootScope.viewAllComments = function(item){
        item.comment_no1 = 0;
        item.commentSliceList = item.comment;
    }

    $rootScope.viewAllComments1 = function(item){
        item.comment_no1 = 0;
        item.commentSliceList = item.commentList;
    }


    $rootScope.emojisArr = ["bowtie","smile","laughing","blush","smiley","relaxed","smirk","heart_eyes","kissing_heart","kissing_closed_eyes","flushed","relieved","satisfied","grin","wink","stuck_out_tongue_winking_eye","stuck_out_tongue_closed_eyes","grinning","kissing","winky_face","kissing_smiling_eyes","stuck_out_tongue","sleeping","worried","frowning","anguished","open_mouth","grimacing","confused","hushed","expressionless","unamused","sweat_smile","sweat","wow","disappointed_relieved","weary","pensive","disappointed","confounded","fearful","cold_sweat","persevere","cry","sob","joy","astonished","scream","neckbeard","tired_face","angry","rage","triumph","sleepy","yum","mask","sunglasses","dizzy_face","imp","neutral_face","no_mouth","innocent","alien","yellow_heart","blue_heart","purple_heart","heart","green_heart","broken_heart","heartbeat","heartpulse","two_hearts","revolving_hearts","cupid","sparkling_heart","sparkles","star","star2","dizzy","boom","anger","exclamation","question","grey_exclamation","grey_question","zzz","dash","sweat_drops","notes","musical_note","fire","hankey","thumbsup","thumbsdown","ok_hand","punch","fist","v","wave","hand","open_hands","point_up","point_down","point_left","point_right","raised_hands","pray","point_up_2","clap","muscle","metal","fu","walking","runner","couple","family","two_men_holding_hands","two_women_holding_hands","dancer","dancers","ok_woman","no_good","information_desk_person","raising_hand","bride_with_veil","person_with_pouting_face","person_frowning","bow","couplekiss","couple_with_heart","massage","haircut","nail_care","boy","girl","woman","man","baby","older_woman","older_man","person_with_blond_hair","man_with_gua_pi_mao","man_with_turban","construction_worker","cop","angel","princess","smiley_cat","smile_cat","heart_eyes_cat","kissing_cat","smirk_cat","scream_cat","crying_cat_face","joy_cat","pouting_cat","japanese_ogre","japanese_goblin","see_no_evil","hear_no_evil","speak_no_evil","guardsman","skull","feet","lips","kiss","droplet","ear","eyes","nose","tongue","love_letter","bust_in_silhouette","busts_in_silhouette","speech_balloon","thought_balloon","feelsgood","finnadie","goberserk","godmode","hurtrealbad","rage1","rage2","rage3","rage4","suspect","trollface","sunny","umbrella","cloud","snowflake","snowman","zap","cyclone","foggy","ocean","cat","dog","mouse","hamster","rabbit","wolf","frog","tiger","koala","bear","pig","pig_nose","cow","boar","monkey_face","monkey","horse","racehorse","camel","sheep","elephant","panda_face","snake","bird","baby_chick","hatched_chick","hatching_chick","chicken","penguin","turtle","bug","honeybee","ant","beetle","snail","octopus","tropical_fish","fish","whale","whale2","dolphin","cow2","ram","rat","water_buffalo","tiger2","rabbit2","dragon","goat","rooster","dog2","pig2","mouse2","ox","dragon_face","blowfish","crocodile","dromedary_camel","leopard","cat2","poodle","paw_prints","bouquet","cherry_blossom","tulip","four_leaf_clover","rose","sunflower","hibiscus","maple_leaf","leaves","fallen_leaf","herb","mushroom","cactus","palm_tree","evergreen_tree","deciduous_tree","chestnut","seedling","blossom","ear_of_rice","shell","globe_with_meridians","sun_with_face","full_moon_with_face","new_moon_with_face","new_moon","waxing_crescent_moon","first_quarter_moon","waxing_gibbous_moon","full_moon","waning_gibbous_moon","last_quarter_moon","waning_crescent_moon","last_quarter_moon_with_face","first_quarter_moon_with_face","moon","earth_africa","earth_americas","earth_asia","volcano","milky_way","partly_sunny","octocat","squirrel","bamboo","gift_heart","dolls","school_satchel","mortar_board","flags","fireworks","sparkler","wind_chime","rice_scene","jack_o_lantern","ghost","santa","christmas_tree","gift","bell","no_bell","tanabata_tree","tada","confetti_ball","balloon","crystal_ball","cd","dvd","floppy_disk","camera","video_camera","movie_camera","computer","tv","iphone","phone","telephone_receiver","pager","fax","minidisc","vhs","sound","mute","loudspeaker","mega","hourglass","hourglass_flowing_sand","alarm_clock","watch","radio","satellite","loop","mag","mag_right","unlock","lock","lock_with_ink_pen","closed_lock_with_key","key","bulb","flashlight","high_brightness","low_brightness","electric_plug","battery","calling","email","mailbox","postbox","bath","bathtub","shower","toilet","wrench","nut_and_bolt","hammer","seat","moneybag","yen","dollar","pound","euro","credit_card","money_with_wings","e-mail","inbox_tray","outbox_tray","envelope","incoming_envelope","postal_horn","mailbox_closed","mailbox_with_mail","mailbox_with_no_mail","door","smoking","bomb","gun","hocho","pill","syringe","page_facing_up","page_with_curl","bookmark_tabs","bar_chart","chart_with_upwards_trend","chart_with_downwards_trend","scroll","clipboard","calendar","date","card_index","file_folder","open_file_folder","scissors","pushpin","paperclip","black_nib","pencil2","straight_ruler","triangular_ruler","closed_book","green_book","blue_book","orange_book","notebook","notebook_with_decorative_cover","ledger","books","bookmark","name_badge","microscope","telescope","newspaper","football","basketball","soccer","baseball","tennis","8ball","rugby_football","bowling","golf","mountain_bicyclist","bicyclist","horse_racing","snowboarder","swimmer","surfer","ski","spades","hearts","clubs","diamonds","gem","ring","trophy","musical_score","musical_keyboard","violin","space_invader","video_game","black_joker","flower_playing_cards","game_die","dart","mahjong","clapper","memo","pencil","book","art","microphone","headphones","trumpet","saxophone","guitar","shoe","sandal","high_heel","lipstick","boot","shirt","necktie","womans_clothes","dress","running_shirt_with_sash","jeans","kimono","bikini","ribbon","tophat","crown","womans_hat","mans_shoe","closed_umbrella","briefcase","handbag","pouch","purse","eyeglasses","fishing_pole_and_fish","coffee","tea","sake","baby_bottle","beer","beers","cocktail","tropical_drink","wine_glass","fork_and_knife","pizza","hamburger","fries","poultry_leg","meat_on_bone","spaghetti","curry","fried_shrimp","bento","sushi","fish_cake","rice_ball","rice_cracker","rice","ramen","stew","oden","dango","egg","bread","doughnut","custard","icecream","ice_cream","shaved_ice","birthday","cake","cookie","chocolate_bar","candy","lollipop","honey_pot","apple","green_apple","tangerine","lemon","cherries","grapes","watermelon","strawberry","peach","melon","banana","pear","pineapple","sweet_potato","eggplant","tomato","corn","house","house_with_garden","school","office","post_office","hospital","bank","convenience_store","love_hotel","hotel","wedding","church","department_store","european_post_office","city_sunrise","city_sunset","japanese_castle","european_castle","tent","factory","tokyo_tower","japan","mount_fuji","sunrise_over_mountains","sunrise","stars","statue_of_liberty","bridge_at_night","carousel_horse","rainbow","ferris_wheel","fountain","roller_coaster","ship","speedboat","boat","rowboat","anchor","rocket","airplane","helicopter","steam_locomotive","tram","mountain_railway","bike","aerial_tramway","suspension_railway","mountain_cableway","tractor","blue_car","oncoming_automobile","car","red_car","taxi","oncoming_taxi","articulated_lorry","bus","oncoming_bus","rotating_light","police_car","oncoming_police_car","fire_engine","ambulance","minibus","truck","train","station","train2","bullettrain_side","light_rail","monorail","railway_car","trolleybus","ticket","fuelpump","vertical_traffic_light","traffic_light","warning","construction","beginner","atm","slot_machine","busstop","barber","hotsprings","checkered_flag","crossed_flags","izakaya_lantern","moyai","circus_tent","performing_arts","round_pushpin","triangular_flag_on_post","jp","kr","cn","us","fr","es","it","ru","uk","de","one","two","three","four","five","six","seven","eight","nine","keycap_ten","1234","zero","hash","symbols","arrow_backward","arrow_down","arrow_forward","arrow_left","capital_abcd","abcd","abc","arrow_lower_left","arrow_lower_right","arrow_right","arrow_up","arrow_upper_left","arrow_upper_right","arrow_double_down","arrow_double_up","arrow_down_small","arrow_heading_down","arrow_heading_up","leftwards_arrow_with_hook","arrow_right_hook","left_right_arrow","arrow_up_down","arrow_up_small","arrows_clockwise","arrows_counterclockwise","rewind","fast_forward","information_source","ok","twisted_rightwards_arrows","repeat","repeat_one","new","top","up","cool","free","ng","cinema","koko","signal_strength","u5272","u5408","u55b6","u6307","u6708","u6709","u6e80","u7121","u7533","u7a7a","u7981","sa","restroom","mens","womens","baby_symbol","no_smoking","parking","wheelchair","metro","baggage_claim","accept","wc","potable_water","put_litter_in_its_place","secret","congratulations","m","passport_control","left_luggage","customs","ideograph_advantage","cl","sos","id","no_entry_sign","underage","no_mobile_phones","do_not_litter","non-potable_water","no_bicycles","no_pedestrians","children_crossing","no_entry","eight_spoked_asterisk","eight_pointed_black_star","heart_decoration","vs","vibration_mode","mobile_phone_off","chart","currency_exchange","aries","taurus","gemini","cancer","leo","virgo","libra","scorpius","sagittarius","capricorn","aquarius","pisces","ophiuchus","six_pointed_star","negative_squared_cross_mark","a","b","ab","o2","diamond_shape_with_a_dot_inside","recycle","end","on","soon","clock1","clock130","clock10","clock1030","clock11","clock1130","clock12","clock1230","clock2","clock230","clock3","clock330","clock4","clock430","clock5","clock530","clock6","clock630","clock7","clock730","clock8","clock830","clock9","clock930","heavy_dollar_sign","copyright","registered","tm","x","heavy_exclamation_mark","bangbang","interrobang","o","heavy_multiplication_x","heavy_plus_sign","heavy_minus_sign","heavy_division_sign","white_flower","100","heavy_check_mark","ballot_box_with_check","radio_button","link","curly_loop","wavy_dash","part_alternation_mark","trident","black_square","white_square","white_check_mark","black_square_button","white_square_button","black_circle","white_circle","red_circle","large_blue_circle","large_blue_diamond","large_orange_diamond","small_blue_diamond","small_orange_diamond","small_red_triangle","small_red_triangle_down","shipit"];

    $rootScope.setcommentval = function(event,item) {
        var target = event.target || event.srcElement || event.originalTarget;

        item.commpostval = target.innerHTML;
    }
    $rootScope.emoinsert = function(item,emoitem){
        var emoval2 = ' :'+emoitem+': ';
        var emoval = '<input title="'+emoitem+'" style="border:none; margin-left: 3px; margin-right: 3px;" class="emoticon emoticon-'+emoitem+'" />';

        var prevval = $('#commentdiv000'+item.id).html();

        if(prevval.substr(prevval.length - 4) == '<br>')
            prevval = prevval.substring(0, prevval.length - 4);

        $('#commentdiv000'+item.id).html(prevval+emoval);
        item.commpostval = prevval+emoval;
    }

    $rootScope.showemojisdiv123 = function(id){
        if ($('#emojisdiv'+id).is(':hidden')) {
            $('#emojisdiv'+id).show();
        }else{
            $('#emojisdiv'+id).hide();
        }
    }


});

homeControllers1.controller('photocommon', function($scope,$state,$sce,$cookieStore,$rootScope,$http,$timeout,$stateParams,uiGmapGoogleMapApi,ngDialog,$facebook,$modal) {
    $rootScope.trustAsHtml = $sce.trustAsHtml;

    $rootScope.delPhoto = function(index){
        $scope.confirmDialog = ngDialog.open({
            template: '<div style="text-align:center; font-family: \'veneerregular\'; font-size: 19px;" class="delconfmsg">Are you sure you want to delete this photo?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm('+index+')" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
            plain:true,
            showClose:false,
            closeByDocument: false,
            closeByEscape: false,
            className : 'confirmPopup',
            scope:$scope
        });
    }

    $rootScope.delVideo = function(index){
        $scope.confirmDialog = ngDialog.open({
            template: '<div style="text-align:center; font-family: \'veneerregular\'; font-size: 19px;" class="delconfmsg">Are you sure you want to delete this video?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm14646('+index+')" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
            plain:true,
            showClose:false,
            closeByDocument: false,
            closeByEscape: false,
            className : 'confirmPopup',
            scope:$scope
        });
    }

    $scope.delConfirm = function(index){
        $scope.confirmDialog.close();
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/delstatus',
            data    : $.param({'status_id':$rootScope.photoList[index].id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.photoList.splice(index,1);
        }).error(function (result) {
            $scope.delConfirm(index);
        });
    }

    $scope.delConfirm14646 = function(index){
        $scope.confirmDialog.close();
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/delstatus',
            data    : $.param({'status_id':$rootScope.videoList[index].id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.videoList.splice(index,1);
        }).error(function (result) {
            $scope.delConfirm14646(index);
        });
    }

    $rootScope.delComment = function(index,index1){
        $scope.confirmDialog = ngDialog.open({
            template: '<div style="text-align:center; font-family: \'veneerregular\'; font-size: 19px;">Are you sure you want to delete this comment?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm1('+index+','+index1+')" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
            plain:true,
            showClose:false,
            closeByDocument: false,
            closeByEscape: false,
            className : 'confirmPopup',
            scope:$scope
        });
    }

    $scope.delConfirm1 = function(index,index1){
        $scope.confirmDialog.close();
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/delcomment',
            data    : $.param({'comment_id':$rootScope.statusList[index].comment[index1].id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.statusList[index].comment.splice(index1,1);
            $rootScope.statusList[index].comment_no = $scope.statusList[index].comment_no -1;
        }).error(function (result) {
            $scope.delConfirm1(index,index1);
        });
    }

    $scope.delCancel = function(){
        $scope.confirmDialog.close();
    }


    $rootScope.photoDet = {
        index : 0,
        itemId : 0,
        pstval : '',
        imgSrc : '',
        value : '',
        is_status : '',
        userId : 0,
        userImage : $scope.baseUrl+"/uploads/user_image/thumb/default.jpg",
        userName : '',
        timeSpan : '',
        msg : '',
        commentNo : 0,
        likeNo : 0,
        likeStatus : 0,
        cUserId : 0,
        cUserImage : $scope.baseUrl+"/uploads/user_image/thumb/default.jpg",
        commentList : [],
        type: 'photo'
    };

    var modalInstance;
    $rootScope.showPhoto = function(item,index){
        $rootScope.photoDet.index = index;
        $rootScope.photoDet.itemId = item.id;
        $rootScope.photoDet.value = item.value;
        $rootScope.photoDet.is_status = item.is_status;
        $rootScope.photoDet.userId = item.user_id;
        $rootScope.photoDet.userImage = item.user_image;
        $rootScope.photoDet.userName = item.user_name;
        $rootScope.photoDet.msg = item.msg;
        $rootScope.photoDet.timeSpan = item.timeSpan;
        $rootScope.photoDet.commentNo = item.commentNo;
        $rootScope.photoDet.likeNo = item.likeNo;
        $rootScope.photoDet.likeStatus = item.likeStatus;
        $rootScope.photoDet.cUserImage = item.cUserImage;
        $rootScope.photoDet.cUserId = item.cUserId;

        $rootScope.stateIsLoading = true;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getStatusComment',
            data    : $.param({'id':item.id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.stateIsLoading = false;
            $rootScope.photoDet.commentList = result;

            var itemcomlist = $rootScope.photoDet.commentList;
            itemcomlist = itemcomlist.slice(-5);
            $rootScope.photoDet.commentSliceList = itemcomlist;
            $rootScope.photoDet.comment_no1 = $rootScope.photoDet.commentList.length;


            $scope.animationsEnabled = true;
            modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'photoComment',
                windowClass: 'photoPopup',
                size: 'lg',
                scope : $scope

            });

            $rootScope.photoDet.imgSrc = item.img_src;

        });
    }

    $scope.modalClose = function(){
        modalInstance.dismiss('cancel');
    }

    $rootScope.videoDet = {
        index : 0,
        itemId : 0,
        pstval : '',
        imgSrc : '',
        userId : 0,
        userImage : $scope.baseUrl+"/uploads/user_image/thumb/default.jpg",
        userName : '',
        timeSpan : '',
        msg : '',
        commentNo : 0,
        likeNo : 0,
        likeStatus : 0,
        cUserId : 0,
        cUserImage : $scope.baseUrl+"/uploads/user_image/thumb/default.jpg",
        commentList : [],
        value : '',
        type : 'video',
        basepath : '',
        videoType : ''
    };

    $rootScope.showVideo = function(item,index){
        $rootScope.videoDet.index = index;
        $rootScope.videoDet.itemId = item.id;
        $rootScope.videoDet.imgSrc = item.img_src;
        $rootScope.videoDet.userId = item.user_id;
        $rootScope.videoDet.userImage = item.user_image;
        $rootScope.videoDet.userName = item.user_name;
        $rootScope.videoDet.msg = item.msg;
        $rootScope.videoDet.timeSpan = item.timeSpan;
        $rootScope.videoDet.commentNo = item.commentNo;
        $rootScope.videoDet.likeNo = item.likeNo;
        $rootScope.videoDet.likeStatus = item.likeStatus;
        $rootScope.videoDet.cUserImage = item.cUserImage;
        $rootScope.videoDet.videoType = item.type;
        $rootScope.videoDet.cUserId = item.cUserId;
        $rootScope.videoDet.basepath = item.basepath;

        $rootScope.stateIsLoading = true;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getStatusComment',
            data    : $.param({'id':item.id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.stateIsLoading = false;
            $rootScope.videoDet.commentList = result;


            var itemcomlist = $rootScope.videoDet.commentList;
            itemcomlist = itemcomlist.slice(-5);
            $rootScope.videoDet.commentSliceList = itemcomlist;
            $rootScope.videoDet.comment_no1 = $rootScope.videoDet.commentList.length;


            $rootScope.videoDet.value = item.value;


            $scope.animationsEnabled = true;
            modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'videoComment',
                windowClass: 'photoPopup',
                scope : $scope

            });

        });
    }

    $rootScope.postComment = function(event,type){
        var status_id = 0;
        var commentval = '';
        if(type == 'photo'){
            status_id = $rootScope.photoDet.itemId;
            var commentval = $rootScope.photoDet.pstval;
        }
        if(type == 'video'){
            status_id = $rootScope.videoDet.itemId;
            var commentval = $rootScope.videoDet.pstval;
        }

        if(event.which === 13 && !event.shiftKey) {
            event.preventDefault();

            if(commentval !='' && typeof(commentval)!= 'undefined'){
                $http({
                    method: 'POST',
                    async:   false,
                    url: $scope.baseUrl+'/user/ajs1/addcomment',
                    data    : $.param({'status_id':status_id,'cmnt_body':commentval,'user_id':$rootScope.rootsessUser}),
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function (result) {
                    if(type == 'photo'){
                        if($rootScope.photoDet.commentList.length){
                            $rootScope.photoDet.commentList.push(result);
                            $rootScope.photoDet.commentSliceList.push(result);
                        }else{
                            $rootScope.photoDet.commentList = [result];
                            $rootScope.photoDet.commentSliceList = [result];
                        }
                        $rootScope.photoDet.pstval = '';
                        $('#pcommentdiv000').html('');
                    }
                    if(type == 'video'){
                        if($rootScope.videoDet.commentList.length){
                            $rootScope.videoDet.commentList.push(result);
                            $rootScope.videoDet.commentSliceList.push(result);
                        }else{
                            $rootScope.videoDet.commentList = [result];
                            $rootScope.videoDet.commentSliceList = [result];
                        }
                        $rootScope.videoDet.pstval = '';
                        $('#pcommentdiv000').html('');
                    }

                });
            }
        }
    }

    $rootScope.fbImageShare = function(item){
        var sss = 'Say Something About This Picture'
        if(item.is_status == 0){
            var type = 'image1';
        }else{
            var type = 'image';
        }

        $scope.dialog2 = ngDialog.open({
            template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="fbText" id="fbtext"> <a href="javascript:void(0);" ng-click="postfb('+item.id+',\''+type+'\',\''+item.value+'\')" id="comment_btn">POST</a></div>',
            plain:true,
            closeByDocument: false,
            closeByEscape: false,
            scope: $scope
        });
    }

    $rootScope.fbVideoShare = function(item){
        var sss = 'Say Something About This Video'

        $scope.dialog2 = ngDialog.open({
            template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="fbText" id="fbtext"> <a href="javascript:void(0);" ng-click="postfb('+item.id+',\''+item.type+'\',\''+item.value+'\')" id="comment_btn">POST</a></div>',
            plain:true,
            closeByDocument: false,
            closeByEscape: false,
            scope: $scope
        });
    }

    $rootScope.fbVideoShare1 = function(item){
        var sss = 'Say Something About This Video'

        $scope.dialog2 = ngDialog.open({
            template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="fbText" id="fbtext"> <a href="javascript:void(0);" ng-click="postfb('+item.id+',\''+item.videoType+'\',\''+item.value+'\')" id="comment_btn">POST</a></div>',
            plain:true,
            closeByDocument: false,
            closeByEscape: false,
            scope: $scope
        });
    }

    $scope.postfb = function(id,type,value){
        if($scope.fbStatus) {
            $scope.getAuthResponse = $facebook.getAuthResponse();
            $scope.fb_share(id,type,value,$scope.getAuthResponse.accessToken);
        } else {
            $facebook.login().then(function(){
                $scope.getAuthResponse = $facebook.getAuthResponse();
                $scope.fb_share(id,type,value,$scope.getAuthResponse.accessToken);
            });
        }

    }

    $scope.$on('fb.auth.authResponseChange', function() {
        $scope.fbStatus = $facebook.isConnected();
    });

    $scope.fb_share = function(id,type,value,accessToken){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/updateAccessToken',
            data    : $.param({'accesstoken':accessToken,'id':$rootScope.rootsessUser}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
        });

        var fbtext = $('#fbtext').val();

        if(type == 'image'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/postfbimage',
                data    : $.param({'id':id,'image':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.dialog2.close();
                $scope.showFbSucMsg();
            });
        }else if(type == 'image1'){
            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/postfbimage1',
                data    : $.param({'id':id,'image':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.dialog2.close();
                $scope.showFbSucMsg();
            });
        }else if(type == 'mp4'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/postfbvideo',
                data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.dialog2.close();
                $scope.showFbSucMsg();
            });
        }else if(type == 'youtube'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/postfbYtvideo',
                data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.dialog2.close();
                $scope.showFbSucMsg();
            });
        }else{

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/postfbText',
                data    : $.param({'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.dialog2.close();
                $scope.showFbSucMsg();
            });
        }



    }

    $scope.showFbSucMsg = function(){
        $scope.showFbSucMsg1 = ngDialog.open({
            template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Posted Successfully On Facebook</div>',
            plain:true,
            showClose:false,
            closeByDocument: true,
            closeByEscape: true
        });

        setTimeout(function(){
            $scope.showFbSucMsg1.close();
        },3000);
    }


    $rootScope.twImageShare = function(item){
        var sss = 'Say Something About This Picture';

        if(item.is_status == 0){
            var sType = 'image1';
        }else{
            var sType = 'image';
        }

        $scope.dialog2 = ngDialog.open({
            template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="twText" id="fbtext"> <a href="javascript:void(0)" ng-click="postTw(\''+item.value+'\',\''+sType+'\')" id="comment_btn">POST</a></div>',
            plain:true,
            closeByDocument: false,
            closeByEscape: false,
            scope: $scope
        });

    };

    $rootScope.twVidShare = function(item){
        var sss = 'Say Something About This Picture';

        var sType = 'text;'

        $scope.dialog2 = ngDialog.open({
            template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="twText" id="fbtext"> <a href="javascript:void(0)" ng-click="postTw(\''+item.value+'\',\''+sType+'\')" id="comment_btn">POST</a></div>',
            plain:true,
            closeByDocument: false,
            closeByEscape: false,
            scope: $scope
        });

    };

    $scope.postTw = function(value,type){
        $scope.dialog2.close();
        var twText = $('#fbtext').val();

        var sType = 'text';
        if(type == 'image'){
            sType = 'statImg';
        }
        if(type == 'image1'){
            sType = 'commImg';
        }

        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getTwOauth',
            data    : $.param({'user_id':$rootScope.rootsessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            if(result.oauth_token == '' || result.oauth_token_secret == ''){
                window.location.href = ($scope.baseUrl+'/user/profile/twittershare1?image='+value+'&page=profile&com='+twText+'&userid='+$scope.sessUser+'&type='+sType);
            }else{
                $http({
                    method: 'POST',
                    async:   false,
                    url: $scope.baseUrl+'/twitter31.php',
                    data    : $.param({'type':sType,'oauth_token':result.oauth_token,'oauth_token_secret':result.oauth_token_secret,'com':twText,'image':value}),
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function (result) {
                    $scope.showTwSucMsg();
                });
            }
        });


    }

    $scope.showTwSucMsg = function(){
        $scope.showTwSucMsg1 = ngDialog.open({
            template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Posted Successfully On Twitter</div>',
            plain:true,
            showClose:false,
            closeByDocument: true,
            closeByEscape: true
        });

        setTimeout(function(){
            $scope.showTwSucMsg1.close();
        },3000);
    }

    $rootScope.prShare = function(item){
        window.open('http://pinterest.com/pin/create/button/?url=http://torqkd.com/&media='+item.img_src+'&description=','_blank');
    }

    $rootScope.resizeTextarea = function(event){
        var target = event.target || event.srcElement || event.originalTarget;
        target.style.setProperty ("height", '35px', "important");
        if(target.scrollHeight>51)target.style.setProperty ("height", 'auto', "important");
        target.style.setProperty ("height", target.scrollHeight+'px', "important");
    }

    $rootScope.viewAllComments1 = function(item){
        item.comment_no1 = 0;
        item.commentSliceList = item.commentList;
    }

    $rootScope.statusLike = function (item,type) {
        if(item.likeStatus){
            item.likeNo = item.likeNo-1;
        }else{
            item.likeNo = item.likeNo+1;
        }
        item.likeStatus = !item.likeStatus;

        if(type == 'photo'){
            $rootScope.photoList[item.index].likeNo = item.likeNo;
            $rootScope.photoList[item.index].likeStatus = item.likeStatus;
        }

        if(type == 'video'){
            $rootScope.videoList[item.index].likeNo = item.likeNo;
            $rootScope.videoList[item.index].likeStatus = item.likeStatus;
        }

        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/likestatus',
            data    : $.param({'status_id':item.itemId,'user_id':item.cUserId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {

        });

    };


    $rootScope.emojisArr = ["bowtie","smile","laughing","blush","smiley","relaxed","smirk","heart_eyes","kissing_heart","kissing_closed_eyes","flushed","relieved","satisfied","grin","wink","stuck_out_tongue_winking_eye","stuck_out_tongue_closed_eyes","grinning","kissing","winky_face","kissing_smiling_eyes","stuck_out_tongue","sleeping","worried","frowning","anguished","open_mouth","grimacing","confused","hushed","expressionless","unamused","sweat_smile","sweat","wow","disappointed_relieved","weary","pensive","disappointed","confounded","fearful","cold_sweat","persevere","cry","sob","joy","astonished","scream","neckbeard","tired_face","angry","rage","triumph","sleepy","yum","mask","sunglasses","dizzy_face","imp","neutral_face","no_mouth","innocent","alien","yellow_heart","blue_heart","purple_heart","heart","green_heart","broken_heart","heartbeat","heartpulse","two_hearts","revolving_hearts","cupid","sparkling_heart","sparkles","star","star2","dizzy","boom","anger","exclamation","question","grey_exclamation","grey_question","zzz","dash","sweat_drops","notes","musical_note","fire","hankey","thumbsup","thumbsdown","ok_hand","punch","fist","v","wave","hand","open_hands","point_up","point_down","point_left","point_right","raised_hands","pray","point_up_2","clap","muscle","metal","fu","walking","runner","couple","family","two_men_holding_hands","two_women_holding_hands","dancer","dancers","ok_woman","no_good","information_desk_person","raising_hand","bride_with_veil","person_with_pouting_face","person_frowning","bow","couplekiss","couple_with_heart","massage","haircut","nail_care","boy","girl","woman","man","baby","older_woman","older_man","person_with_blond_hair","man_with_gua_pi_mao","man_with_turban","construction_worker","cop","angel","princess","smiley_cat","smile_cat","heart_eyes_cat","kissing_cat","smirk_cat","scream_cat","crying_cat_face","joy_cat","pouting_cat","japanese_ogre","japanese_goblin","see_no_evil","hear_no_evil","speak_no_evil","guardsman","skull","feet","lips","kiss","droplet","ear","eyes","nose","tongue","love_letter","bust_in_silhouette","busts_in_silhouette","speech_balloon","thought_balloon","feelsgood","finnadie","goberserk","godmode","hurtrealbad","rage1","rage2","rage3","rage4","suspect","trollface","sunny","umbrella","cloud","snowflake","snowman","zap","cyclone","foggy","ocean","cat","dog","mouse","hamster","rabbit","wolf","frog","tiger","koala","bear","pig","pig_nose","cow","boar","monkey_face","monkey","horse","racehorse","camel","sheep","elephant","panda_face","snake","bird","baby_chick","hatched_chick","hatching_chick","chicken","penguin","turtle","bug","honeybee","ant","beetle","snail","octopus","tropical_fish","fish","whale","whale2","dolphin","cow2","ram","rat","water_buffalo","tiger2","rabbit2","dragon","goat","rooster","dog2","pig2","mouse2","ox","dragon_face","blowfish","crocodile","dromedary_camel","leopard","cat2","poodle","paw_prints","bouquet","cherry_blossom","tulip","four_leaf_clover","rose","sunflower","hibiscus","maple_leaf","leaves","fallen_leaf","herb","mushroom","cactus","palm_tree","evergreen_tree","deciduous_tree","chestnut","seedling","blossom","ear_of_rice","shell","globe_with_meridians","sun_with_face","full_moon_with_face","new_moon_with_face","new_moon","waxing_crescent_moon","first_quarter_moon","waxing_gibbous_moon","full_moon","waning_gibbous_moon","last_quarter_moon","waning_crescent_moon","last_quarter_moon_with_face","first_quarter_moon_with_face","moon","earth_africa","earth_americas","earth_asia","volcano","milky_way","partly_sunny","octocat","squirrel","bamboo","gift_heart","dolls","school_satchel","mortar_board","flags","fireworks","sparkler","wind_chime","rice_scene","jack_o_lantern","ghost","santa","christmas_tree","gift","bell","no_bell","tanabata_tree","tada","confetti_ball","balloon","crystal_ball","cd","dvd","floppy_disk","camera","video_camera","movie_camera","computer","tv","iphone","phone","telephone_receiver","pager","fax","minidisc","vhs","sound","mute","loudspeaker","mega","hourglass","hourglass_flowing_sand","alarm_clock","watch","radio","satellite","loop","mag","mag_right","unlock","lock","lock_with_ink_pen","closed_lock_with_key","key","bulb","flashlight","high_brightness","low_brightness","electric_plug","battery","calling","email","mailbox","postbox","bath","bathtub","shower","toilet","wrench","nut_and_bolt","hammer","seat","moneybag","yen","dollar","pound","euro","credit_card","money_with_wings","e-mail","inbox_tray","outbox_tray","envelope","incoming_envelope","postal_horn","mailbox_closed","mailbox_with_mail","mailbox_with_no_mail","door","smoking","bomb","gun","hocho","pill","syringe","page_facing_up","page_with_curl","bookmark_tabs","bar_chart","chart_with_upwards_trend","chart_with_downwards_trend","scroll","clipboard","calendar","date","card_index","file_folder","open_file_folder","scissors","pushpin","paperclip","black_nib","pencil2","straight_ruler","triangular_ruler","closed_book","green_book","blue_book","orange_book","notebook","notebook_with_decorative_cover","ledger","books","bookmark","name_badge","microscope","telescope","newspaper","football","basketball","soccer","baseball","tennis","8ball","rugby_football","bowling","golf","mountain_bicyclist","bicyclist","horse_racing","snowboarder","swimmer","surfer","ski","spades","hearts","clubs","diamonds","gem","ring","trophy","musical_score","musical_keyboard","violin","space_invader","video_game","black_joker","flower_playing_cards","game_die","dart","mahjong","clapper","memo","pencil","book","art","microphone","headphones","trumpet","saxophone","guitar","shoe","sandal","high_heel","lipstick","boot","shirt","necktie","womans_clothes","dress","running_shirt_with_sash","jeans","kimono","bikini","ribbon","tophat","crown","womans_hat","mans_shoe","closed_umbrella","briefcase","handbag","pouch","purse","eyeglasses","fishing_pole_and_fish","coffee","tea","sake","baby_bottle","beer","beers","cocktail","tropical_drink","wine_glass","fork_and_knife","pizza","hamburger","fries","poultry_leg","meat_on_bone","spaghetti","curry","fried_shrimp","bento","sushi","fish_cake","rice_ball","rice_cracker","rice","ramen","stew","oden","dango","egg","bread","doughnut","custard","icecream","ice_cream","shaved_ice","birthday","cake","cookie","chocolate_bar","candy","lollipop","honey_pot","apple","green_apple","tangerine","lemon","cherries","grapes","watermelon","strawberry","peach","melon","banana","pear","pineapple","sweet_potato","eggplant","tomato","corn","house","house_with_garden","school","office","post_office","hospital","bank","convenience_store","love_hotel","hotel","wedding","church","department_store","european_post_office","city_sunrise","city_sunset","japanese_castle","european_castle","tent","factory","tokyo_tower","japan","mount_fuji","sunrise_over_mountains","sunrise","stars","statue_of_liberty","bridge_at_night","carousel_horse","rainbow","ferris_wheel","fountain","roller_coaster","ship","speedboat","boat","rowboat","anchor","rocket","airplane","helicopter","steam_locomotive","tram","mountain_railway","bike","aerial_tramway","suspension_railway","mountain_cableway","tractor","blue_car","oncoming_automobile","car","red_car","taxi","oncoming_taxi","articulated_lorry","bus","oncoming_bus","rotating_light","police_car","oncoming_police_car","fire_engine","ambulance","minibus","truck","train","station","train2","bullettrain_side","light_rail","monorail","railway_car","trolleybus","ticket","fuelpump","vertical_traffic_light","traffic_light","warning","construction","beginner","atm","slot_machine","busstop","barber","hotsprings","checkered_flag","crossed_flags","izakaya_lantern","moyai","circus_tent","performing_arts","round_pushpin","triangular_flag_on_post","jp","kr","cn","us","fr","es","it","ru","uk","de","one","two","three","four","five","six","seven","eight","nine","keycap_ten","1234","zero","hash","symbols","arrow_backward","arrow_down","arrow_forward","arrow_left","capital_abcd","abcd","abc","arrow_lower_left","arrow_lower_right","arrow_right","arrow_up","arrow_upper_left","arrow_upper_right","arrow_double_down","arrow_double_up","arrow_down_small","arrow_heading_down","arrow_heading_up","leftwards_arrow_with_hook","arrow_right_hook","left_right_arrow","arrow_up_down","arrow_up_small","arrows_clockwise","arrows_counterclockwise","rewind","fast_forward","information_source","ok","twisted_rightwards_arrows","repeat","repeat_one","new","top","up","cool","free","ng","cinema","koko","signal_strength","u5272","u5408","u55b6","u6307","u6708","u6709","u6e80","u7121","u7533","u7a7a","u7981","sa","restroom","mens","womens","baby_symbol","no_smoking","parking","wheelchair","metro","baggage_claim","accept","wc","potable_water","put_litter_in_its_place","secret","congratulations","m","passport_control","left_luggage","customs","ideograph_advantage","cl","sos","id","no_entry_sign","underage","no_mobile_phones","do_not_litter","non-potable_water","no_bicycles","no_pedestrians","children_crossing","no_entry","eight_spoked_asterisk","eight_pointed_black_star","heart_decoration","vs","vibration_mode","mobile_phone_off","chart","currency_exchange","aries","taurus","gemini","cancer","leo","virgo","libra","scorpius","sagittarius","capricorn","aquarius","pisces","ophiuchus","six_pointed_star","negative_squared_cross_mark","a","b","ab","o2","diamond_shape_with_a_dot_inside","recycle","end","on","soon","clock1","clock130","clock10","clock1030","clock11","clock1130","clock12","clock1230","clock2","clock230","clock3","clock330","clock4","clock430","clock5","clock530","clock6","clock630","clock7","clock730","clock8","clock830","clock9","clock930","heavy_dollar_sign","copyright","registered","tm","x","heavy_exclamation_mark","bangbang","interrobang","o","heavy_multiplication_x","heavy_plus_sign","heavy_minus_sign","heavy_division_sign","white_flower","100","heavy_check_mark","ballot_box_with_check","radio_button","link","curly_loop","wavy_dash","part_alternation_mark","trident","black_square","white_square","white_check_mark","black_square_button","white_square_button","black_circle","white_circle","red_circle","large_blue_circle","large_blue_diamond","large_orange_diamond","small_blue_diamond","small_orange_diamond","small_red_triangle","small_red_triangle_down","shipit"];

    $rootScope.showemojisdivsada = function(){
        $rootScope.showemojisdiv = !$rootScope.showemojisdiv;
    }

    $rootScope.setcommentval = function(event,item) {
        var target = event.target || event.srcElement || event.originalTarget;
        item.pstval = target.innerHTML;
    }


    $rootScope.emoinsert = function(item,emoitem){
        var emoval2 = ' :'+emoitem+': ';
        var emoval = '<input title="'+emoitem+'" style="border:none; margin-left: 3px; margin-right: 3px;" class="emoticon emoticon-'+emoitem+'" />';

        var prevval = $('#pcommentdiv000').html();

        if(prevval.substr(prevval.length - 4) == '<br>')
            prevval = prevval.substring(0, prevval.length - 4);

        $('#pcommentdiv000').html(prevval+emoval);
        item.pstval = prevval+emoval;


    }
    $rootScope.emoinsert1 = function(type,emoitem){
        var emoval = ':'+emoitem+':';

        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/addvideocomment',
            data    : $.param({'status_id':$rootScope.videoDet.itemId,'cmnt_body':emoval,'user_id':$rootScope.rootsessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            if($rootScope.videoDet.commentList.length){
                $rootScope.videoDet.commentList.push(result);
                $rootScope.videoDet.commentSliceList.push(result);
            }else{
                $rootScope.videoDet.commentList = [result];
                $rootScope.videoDet.commentSliceList = [result];
            }
        });

    }

});
homeControllers1.controller('forumcommon', function($scope,$state,$cookieStore,$rootScope,$http,$timeout,$stateParams,uiGmapGoogleMapApi,ngDialog,$facebook,$modal,$compile) {
    $rootScope.sessUser = 0;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $rootScope.sessUserDet = $cookieStore.get('rootuserdet');
        $rootScope.sessUser = $rootScope.sessUserDet.id;


        $timeout(function(){
            $scope.getPImage();
        },100);
    }

    $scope.getPImage = function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/getPImage',
            data    : $.param({'userid':$rootScope.sessUserDet.id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data) {
            $rootScope.profileImage = $scope.baseUrl+'/uploads/user_image/thumb/'+data.profileImgName;
        }).error(function (result) {
            $scope.getPImage();
        });
    }

    $rootScope.headingArr = [{
        id:0,
        value:'Forum',
        link:'/forum-list'
    }];

    $rootScope.resizeTextarea = function(event){
        var target = event.target || event.srcElement || event.originalTarget;
        target.style.setProperty ("height", target.scrollHeight+'px', "important");
    }


    $rootScope.emojisArr = ["bowtie","smile","laughing","blush","smiley","relaxed","smirk","heart_eyes","kissing_heart","kissing_closed_eyes","flushed","relieved","satisfied","grin","wink","stuck_out_tongue_winking_eye","stuck_out_tongue_closed_eyes","grinning","kissing","winky_face","kissing_smiling_eyes","stuck_out_tongue","sleeping","worried","frowning","anguished","open_mouth","grimacing","confused","hushed","expressionless","unamused","sweat_smile","sweat","wow","disappointed_relieved","weary","pensive","disappointed","confounded","fearful","cold_sweat","persevere","cry","sob","joy","astonished","scream","neckbeard","tired_face","angry","rage","triumph","sleepy","yum","mask","sunglasses","dizzy_face","imp","neutral_face","no_mouth","innocent","alien","yellow_heart","blue_heart","purple_heart","heart","green_heart","broken_heart","heartbeat","heartpulse","two_hearts","revolving_hearts","cupid","sparkling_heart","sparkles","star","star2","dizzy","boom","anger","exclamation","question","grey_exclamation","grey_question","zzz","dash","sweat_drops","notes","musical_note","fire","hankey","thumbsup","thumbsdown","ok_hand","punch","fist","v","wave","hand","open_hands","point_up","point_down","point_left","point_right","raised_hands","pray","point_up_2","clap","muscle","metal","fu","walking","runner","couple","family","two_men_holding_hands","two_women_holding_hands","dancer","dancers","ok_woman","no_good","information_desk_person","raising_hand","bride_with_veil","person_with_pouting_face","person_frowning","bow","couplekiss","couple_with_heart","massage","haircut","nail_care","boy","girl","woman","man","baby","older_woman","older_man","person_with_blond_hair","man_with_gua_pi_mao","man_with_turban","construction_worker","cop","angel","princess","smiley_cat","smile_cat","heart_eyes_cat","kissing_cat","smirk_cat","scream_cat","crying_cat_face","joy_cat","pouting_cat","japanese_ogre","japanese_goblin","see_no_evil","hear_no_evil","speak_no_evil","guardsman","skull","feet","lips","kiss","droplet","ear","eyes","nose","tongue","love_letter","bust_in_silhouette","busts_in_silhouette","speech_balloon","thought_balloon","feelsgood","finnadie","goberserk","godmode","hurtrealbad","rage1","rage2","rage3","rage4","suspect","trollface","sunny","umbrella","cloud","snowflake","snowman","zap","cyclone","foggy","ocean","cat","dog","mouse","hamster","rabbit","wolf","frog","tiger","koala","bear","pig","pig_nose","cow","boar","monkey_face","monkey","horse","racehorse","camel","sheep","elephant","panda_face","snake","bird","baby_chick","hatched_chick","hatching_chick","chicken","penguin","turtle","bug","honeybee","ant","beetle","snail","octopus","tropical_fish","fish","whale","whale2","dolphin","cow2","ram","rat","water_buffalo","tiger2","rabbit2","dragon","goat","rooster","dog2","pig2","mouse2","ox","dragon_face","blowfish","crocodile","dromedary_camel","leopard","cat2","poodle","paw_prints","bouquet","cherry_blossom","tulip","four_leaf_clover","rose","sunflower","hibiscus","maple_leaf","leaves","fallen_leaf","herb","mushroom","cactus","palm_tree","evergreen_tree","deciduous_tree","chestnut","seedling","blossom","ear_of_rice","shell","globe_with_meridians","sun_with_face","full_moon_with_face","new_moon_with_face","new_moon","waxing_crescent_moon","first_quarter_moon","waxing_gibbous_moon","full_moon","waning_gibbous_moon","last_quarter_moon","waning_crescent_moon","last_quarter_moon_with_face","first_quarter_moon_with_face","moon","earth_africa","earth_americas","earth_asia","volcano","milky_way","partly_sunny","octocat","squirrel","bamboo","gift_heart","dolls","school_satchel","mortar_board","flags","fireworks","sparkler","wind_chime","rice_scene","jack_o_lantern","ghost","santa","christmas_tree","gift","bell","no_bell","tanabata_tree","tada","confetti_ball","balloon","crystal_ball","cd","dvd","floppy_disk","camera","video_camera","movie_camera","computer","tv","iphone","phone","telephone_receiver","pager","fax","minidisc","vhs","sound","mute","loudspeaker","mega","hourglass","hourglass_flowing_sand","alarm_clock","watch","radio","satellite","loop","mag","mag_right","unlock","lock","lock_with_ink_pen","closed_lock_with_key","key","bulb","flashlight","high_brightness","low_brightness","electric_plug","battery","calling","email","mailbox","postbox","bath","bathtub","shower","toilet","wrench","nut_and_bolt","hammer","seat","moneybag","yen","dollar","pound","euro","credit_card","money_with_wings","e-mail","inbox_tray","outbox_tray","envelope","incoming_envelope","postal_horn","mailbox_closed","mailbox_with_mail","mailbox_with_no_mail","door","smoking","bomb","gun","hocho","pill","syringe","page_facing_up","page_with_curl","bookmark_tabs","bar_chart","chart_with_upwards_trend","chart_with_downwards_trend","scroll","clipboard","calendar","date","card_index","file_folder","open_file_folder","scissors","pushpin","paperclip","black_nib","pencil2","straight_ruler","triangular_ruler","closed_book","green_book","blue_book","orange_book","notebook","notebook_with_decorative_cover","ledger","books","bookmark","name_badge","microscope","telescope","newspaper","football","basketball","soccer","baseball","tennis","8ball","rugby_football","bowling","golf","mountain_bicyclist","bicyclist","horse_racing","snowboarder","swimmer","surfer","ski","spades","hearts","clubs","diamonds","gem","ring","trophy","musical_score","musical_keyboard","violin","space_invader","video_game","black_joker","flower_playing_cards","game_die","dart","mahjong","clapper","memo","pencil","book","art","microphone","headphones","trumpet","saxophone","guitar","shoe","sandal","high_heel","lipstick","boot","shirt","necktie","womans_clothes","dress","running_shirt_with_sash","jeans","kimono","bikini","ribbon","tophat","crown","womans_hat","mans_shoe","closed_umbrella","briefcase","handbag","pouch","purse","eyeglasses","fishing_pole_and_fish","coffee","tea","sake","baby_bottle","beer","beers","cocktail","tropical_drink","wine_glass","fork_and_knife","pizza","hamburger","fries","poultry_leg","meat_on_bone","spaghetti","curry","fried_shrimp","bento","sushi","fish_cake","rice_ball","rice_cracker","rice","ramen","stew","oden","dango","egg","bread","doughnut","custard","icecream","ice_cream","shaved_ice","birthday","cake","cookie","chocolate_bar","candy","lollipop","honey_pot","apple","green_apple","tangerine","lemon","cherries","grapes","watermelon","strawberry","peach","melon","banana","pear","pineapple","sweet_potato","eggplant","tomato","corn","house","house_with_garden","school","office","post_office","hospital","bank","convenience_store","love_hotel","hotel","wedding","church","department_store","european_post_office","city_sunrise","city_sunset","japanese_castle","european_castle","tent","factory","tokyo_tower","japan","mount_fuji","sunrise_over_mountains","sunrise","stars","statue_of_liberty","bridge_at_night","carousel_horse","rainbow","ferris_wheel","fountain","roller_coaster","ship","speedboat","boat","rowboat","anchor","rocket","airplane","helicopter","steam_locomotive","tram","mountain_railway","bike","aerial_tramway","suspension_railway","mountain_cableway","tractor","blue_car","oncoming_automobile","car","red_car","taxi","oncoming_taxi","articulated_lorry","bus","oncoming_bus","rotating_light","police_car","oncoming_police_car","fire_engine","ambulance","minibus","truck","train","station","train2","bullettrain_side","light_rail","monorail","railway_car","trolleybus","ticket","fuelpump","vertical_traffic_light","traffic_light","warning","construction","beginner","atm","slot_machine","busstop","barber","hotsprings","checkered_flag","crossed_flags","izakaya_lantern","moyai","circus_tent","performing_arts","round_pushpin","triangular_flag_on_post","jp","kr","cn","us","fr","es","it","ru","uk","de","one","two","three","four","five","six","seven","eight","nine","keycap_ten","1234","zero","hash","symbols","arrow_backward","arrow_down","arrow_forward","arrow_left","capital_abcd","abcd","abc","arrow_lower_left","arrow_lower_right","arrow_right","arrow_up","arrow_upper_left","arrow_upper_right","arrow_double_down","arrow_double_up","arrow_down_small","arrow_heading_down","arrow_heading_up","leftwards_arrow_with_hook","arrow_right_hook","left_right_arrow","arrow_up_down","arrow_up_small","arrows_clockwise","arrows_counterclockwise","rewind","fast_forward","information_source","ok","twisted_rightwards_arrows","repeat","repeat_one","new","top","up","cool","free","ng","cinema","koko","signal_strength","u5272","u5408","u55b6","u6307","u6708","u6709","u6e80","u7121","u7533","u7a7a","u7981","sa","restroom","mens","womens","baby_symbol","no_smoking","parking","wheelchair","metro","baggage_claim","accept","wc","potable_water","put_litter_in_its_place","secret","congratulations","m","passport_control","left_luggage","customs","ideograph_advantage","cl","sos","id","no_entry_sign","underage","no_mobile_phones","do_not_litter","non-potable_water","no_bicycles","no_pedestrians","children_crossing","no_entry","eight_spoked_asterisk","eight_pointed_black_star","heart_decoration","vs","vibration_mode","mobile_phone_off","chart","currency_exchange","aries","taurus","gemini","cancer","leo","virgo","libra","scorpius","sagittarius","capricorn","aquarius","pisces","ophiuchus","six_pointed_star","negative_squared_cross_mark","a","b","ab","o2","diamond_shape_with_a_dot_inside","recycle","end","on","soon","clock1","clock130","clock10","clock1030","clock11","clock1130","clock12","clock1230","clock2","clock230","clock3","clock330","clock4","clock430","clock5","clock530","clock6","clock630","clock7","clock730","clock8","clock830","clock9","clock930","heavy_dollar_sign","copyright","registered","tm","x","heavy_exclamation_mark","bangbang","interrobang","o","heavy_multiplication_x","heavy_plus_sign","heavy_minus_sign","heavy_division_sign","white_flower","100","heavy_check_mark","ballot_box_with_check","radio_button","link","curly_loop","wavy_dash","part_alternation_mark","trident","black_square","white_square","white_check_mark","black_square_button","white_square_button","black_circle","white_circle","red_circle","large_blue_circle","large_blue_diamond","large_orange_diamond","small_blue_diamond","small_orange_diamond","small_red_triangle","small_red_triangle_down","shipit"];

    $rootScope.showemojisdivsfs = function(){
        var emohtml = '<div class="emojisdiv">';

        angular.forEach($rootScope.emojisArr,function(value){
            emohtml += '<a href="javascript:void(0)" ng-click="emoinsert2(\''+value+'\')" class="emoticon emoticon-'+value+'" title="::'+value+'::" ></a>';
        })

        emohtml += '</div>';

        var $el = angular.element( document.querySelector( '#emojisdiv787' ) ).html(emohtml);

        $compile($el)($rootScope);

        if ($('#emojisdiv787').is(':hidden')) {
            $('#emojisdiv787').show();
        }else{
            $('#emojisdiv787').hide();
        }

    }

    $rootScope.showemojisdivsfs5252 = function(){
        var emohtml = '<div class="emojisdiv">';

        angular.forEach($rootScope.emojisArr,function(value){
            emohtml += '<a href="javascript:void(0)" ng-click="emoinsert5(\''+value+'\')" class="emoticon emoticon-'+value+'" title="::'+value+'::" ></a>';
        })

        emohtml += '</div>';

        var $el = angular.element( document.querySelector( '#emojisdiv787555' ) ).html(emohtml);

        $compile($el)($rootScope);


        if ($('#emojisdiv787555').is(':hidden')) {
            $('#emojisdiv787555').show();
        }else{
            $('#emojisdiv787555').hide();
        }
    }

    $rootScope.showemojisdivsfs51465 = function(id){
        if ($('#emojisdiv787'+id).is(':hidden')) {
            $('#emojisdiv787'+id).show();
        }else{
            $('#emojisdiv787'+id).hide();
        }

    }


});

homeControllers1.controller('routecommon', function($scope,$state,$cookieStore,$rootScope,$http,$timeout,$stateParams,uiGmapGoogleMapApi,ngDialog,$facebook,$modal) {

    $scope.canvasImage = '';
    $rootScope.delRoute = function(id,index){
        $scope.confirmDialog = ngDialog.open({
            template: '<div style="text-align:center; font-family: \'veneerregular\'; font-size: 19px;">Are you sure you want to delete this route?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm('+id+','+index+')" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
            plain:true,
            showClose:false,
            closeByDocument: false,
            closeByEscape: false,
            className : 'confirmPopup',
            scope:$scope
        });
    }

    $scope.delConfirm = function(id,index){
        $scope.confirmDialog.close();
        $rootScope.stateIsLoading = true;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/delroute',
            data    : $.param({'route_id': id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.stateIsLoading = false;
            $rootScope.routeList.splice(index,1);
        }).error(function (result) {
            $scope.delConfirm(id,index);
        });
    }

    $scope.delCancel = function(){
        $scope.confirmDialog.close();
    }


    $rootScope.createImage = function(id,type){
        $rootScope.stateIsLoading = true;
        html2canvas($('#map'+id), {
            useCORS: true,
            onrendered: function(canvas) {
                var url = canvas.toDataURL();

                $http({
                    method: 'POST',
                    async:   false,
                    url: $scope.baseUrl+'/user/ajs1/canvastoimg',
                    data    : $.param({'data': url}),
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function (result) {
                    var mapImage = result;

                    $('#mapconmain').html($('#mapcon'+id).html());


                    html2canvas($('#mapconmain'), {
                        useCORS: true,
                        onrendered: function(canvas) {
                            var url = canvas.toDataURL();

                            $http({
                                method: 'POST',
                                async:   false,
                                url: $scope.baseUrl+'/user/ajs1/canvastoimg1',
                                data    : $.param({'data': url}),
                                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                            }).success(function (result) {
                                var divImage = result;
                                $rootScope.stateIsLoading = false;

                                $('#mapconmain').html('');

                                $http({
                                    method: 'POST',
                                    async:   false,
                                    url: $scope.baseUrl+'/user/ajs1/imageMerge',
                                    data    : $.param({'image1':mapImage,'image2':divImage}),
                                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                }).success(function (res) {

                                    var shareImage = 'http://torqkd.com/fbshare/img/'+res;
                                    var shareImage1 = res;

                                    if(type == 'pr'){
                                        window.open("http://pinterest.com/pin/create/button/?url=http://torqkd.com/&media="+shareImage+"&description=","_blank");
                                    }
                                    if(type == 'fb'){
                                        if($scope.fbStatus) {
                                            $scope.getAuthResponse = $facebook.getAuthResponse();
                                            $scope.fb_share_route(shareImage,$scope.getAuthResponse.accessToken);
                                        } else {
                                            $facebook.login().then(function(){
                                                $scope.getAuthResponse = $facebook.getAuthResponse();
                                                $scope.fb_share_route(shareImage,$scope.getAuthResponse.accessToken);
                                            });
                                        }
                                    }
                                    if(type == 'tw'){
                                        var twText = '';

                                        var sType = 'routesImg';

                                        $http({
                                            method: 'POST',
                                            async:   false,
                                            url: $scope.baseUrl+'/user/ajs1/getTwOauth',
                                            data    : $.param({'user_id':$rootScope.rootsessUser}),
                                            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                        }).success(function (result) {
                                            if(result.oauth_token == '' || result.oauth_token_secret == ''){
                                                window.location.href = ($scope.baseUrl+'/user/profile/twittershare1?image='+shareImage1+'&page=profile&com='+twText+'&userid='+$scope.sessUser+'&type='+sType);
                                            }else{
                                                $http({
                                                    method: 'POST',
                                                    async:   false,
                                                    url: $scope.baseUrl+'/twitter31.php',
                                                    data    : $.param({'type':sType,'oauth_token':result.oauth_token,'oauth_token_secret':result.oauth_token_secret,'com':twText,'image':shareImage1}),
                                                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                                }).success(function (result) {
                                                    $scope.showTwSucMsg();
                                                });
                                            }
                                        });
                                    }

                                });


                            });

                        }

                    });

                });

            }

        });
    }


    $scope.$on('fb.auth.authResponseChange', function() {
        $scope.fbStatus = $facebook.isConnected();
    });

    $scope.fb_share_route = function(image,accessToken){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/postfbRoutes1',
            data    : $.param({'image':image,'accessToken':accessToken}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.showFbSucMsg();
        });
    }

    $scope.showFbSucMsg = function(){
        $scope.showFbSucMsg1 = ngDialog.open({
            template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Posted Successfully On Facebook</div>',
            plain:true,
            showClose:false,
            closeByDocument: true,
            closeByEscape: true
        });

        setTimeout(function(){
            $scope.showFbSucMsg1.close();
        },3000);
    }

    $scope.showTwSucMsg = function(){
        $scope.showTwSucMsg1 = ngDialog.open({
            template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Posted Successfully On Twitter</div>',
            plain:true,
            showClose:false,
            closeByDocument: true,
            closeByEscape: true
        });

        setTimeout(function(){
            $scope.showTwSucMsg1.close();
        },3000);
    }


});

homeControllers1.controller('mapcommon', function($scope,$state,$cookieStore,$rootScope,$http,$timeout,$interval,$stateParams,uiGmapGoogleMapApi) {
    $scope.zoomlevel = 9;

    $timeout(function(){
        $scope.getCurLocation();
    })

    $scope.getCurLocation = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getCurLocation',
            data    : $.param({'userid':$rootScope.rootsessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {

            $rootScope.rootmap = {
                dragZoom: {options: {}},
                control:{},
                center: {
                    latitude: result.latitude,
                    longitude: result.longitude
                },
                options : {
                    scrollwheel : false,
                },
                pan: true,
                zoom: $scope.zoomlevel,
                refresh: false,
                events: {

                    idle: function (rootmap) {

                        $timeout(function() {


                            $interval(function(){

                                var visibleMarkers = [];

                                if(typeof($scope.rootmap.bounds.southwest) != 'undefined' && typeof($scope.rootmap.bounds.northeast) != 'undefined'){
                                    angular.forEach(result.marker, function(marker, key) {
                                        if ($scope.rootmap.bounds.southwest.latitude < marker.latitude
                                            && marker.latitude < $scope.rootmap.bounds.northeast.latitude
                                            && $scope.rootmap.bounds.southwest.longitude < marker.longitude
                                            && marker.longitude < $scope.rootmap.bounds.northeast.longitude) {

                                            visibleMarkers.push(marker);
                                        }
                                    });

                                    $scope.visibleMarkers = visibleMarkers;

                                    if($scope.visibleMarkers.length < 5){
                                        $scope.zoomlevel = parseInt($scope.zoomlevel)-1;


                                        $rootScope.rootmap.zoom = parseFloat(parseInt($scope.zoomlevel)-1);
                                        // console.log($rootScope.map.zoom);
                                    }
                                }


                            },3000);





                        }, 0);

                    }


                },
                bounds:{},
                markers: result.marker,
                openedCanadaWindows:{},
                onWindowCloseClick: function(gMarker, eventName, model){
                    if(model.dowShow !== null && model.dowShow !== undefined)
                        return model.doShow = false;

                },
                markerEvents: {
                    click:function(gMarker, eventName, model){
                        angular.element( document.querySelector( '#infoWin' ) ).html(model.infoHtml);
                        model.doShow = true;
                        $scope.rootmap.openedCanadaWindows = model;
                    }
                }


            };


            $rootScope.rootmap.markers.forEach(function(model){
                model.closeClick = function(){
                    model.doShow = false;
                };
            });


        }).error(function (result) {
            $scope.getCurLocation();
        });

    }

});

homeControllers1.controller('chatcommon', function($scope,$state,$cookieStore,$rootScope,$http,$timeout) {
    $timeout(function(){
        if($rootScope.rootsessUser > 0){
            $scope.chatUserList1();
            $scope.chatUserList2();
        }
    },500);

    $scope.chatUserList1 = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/chatUserList1',
            data    : $.param({'userid':$rootScope.rootsessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.chatUser1 = result;


            $timeout(function(){
                if($rootScope.rootsessUser > 0){
                    $scope.chatUserList1();
                }
            },10000);

        }).error(function (result) {
            $scope.chatUserList1();
        });
    }

    $scope.chatUserList2 = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/chatUserList2',
            data    : $.param({'userid':$rootScope.rootsessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.chatUser2 = result;
            $timeout(function(){
                if($rootScope.rootsessUser > 0){
                    $scope.chatUserList2();
                }
            },10000);
        }).error(function (result) {
            $scope.chatUserList2();
        });
    }




});

homeControllers1.controller('bannerCommon', function($scope,$state,$cookieStore,$rootScope,$http,$interval,$timeout) {

    $scope.pageId = 0;
    $scope.spId = 0;
    if($state.current.name == 'groupdetail1'){
        $scope.pageId = 4;
    }
    if($state.current.name == 'profile1'){
        $scope.pageId = 3;
    }
    if($state.current.name == 'experience'){
        $scope.pageId = 1;
    }
    if($state.current.name == 'sportdetail'){
        $scope.pageId = 2;
        $scope.spId = $rootScope.rootsportId;
    }

    $rootScope.openBanner = function(url){
            window.open(url);
    }

    $rootScope.bannelimit1 = 2;
    $rootScope.bannelimit2 = 2;
    $rootScope.bannelimit3 = 2;
    $rootScope.bannerslides1 = [];
    $rootScope.bannerslides2 = [];
    $rootScope.bannerslides3 = [];

    $timeout(function(){
        $scope.getBanner1();
        $scope.getBanner2();
        $scope.getBanner3();
    },500);


    $scope.getBanner1 = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getBanner',
            data    : $.param({'pageid':$scope.pageId,'areaid':1,'sp_id':$scope.spId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.allbannerslides1 = result;
            $rootScope.bannerslides1.push(result[0]);
            $rootScope.bannerslides1.push(result[1]);
        }).error(function (result) {
            $scope.getBanner1();
        });
    }

    $scope.getBanner2 = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getBanner',
            data    : $.param({'pageid':$scope.pageId,'areaid':2,'sp_id':$scope.spId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.bannerslides2 = result;
        }).error(function (result) {
            $scope.getBanner2();
        });
    }

    $scope.getBanner3 = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getBanner',
            data    : $.param({'pageid':$scope.pageId,'areaid':3,'sp_id':$scope.spId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.bannerslides3 = result;
        }).error(function (result) {
            $scope.getBanner3();
        });
    }

});

homeControllers1.controller('footer', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$timeout) {

    $scope.openTerms = function () {
        ngDialog.open({
            template: 'termsDialogId',
        });
    };
    $scope.openPrivacy = function () {
        ngDialog.open({
            template: 'policyDialogId',
        });
    };

    $scope.showtermsploicy = function(id){

        $rootScope.stateIsLoading = true;

        var header = '';
        if(id=='policy')
            header = 'Privacy Policy';
        if(id=='terms')
            header = 'Terms And Condition';

        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/cms/admin/conditionmanager1/bringcondition',
            data    : $.param({'id':id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            ngDialog.open({
                template: '<div><strong style="font-size: 16px; color:#C97413; font-weight: normal; text-align:center; display:block; font-weight:bold; text-transform:uppercase; font-size:22px;">'+header+'</strong></div>'+data,
                plain:true,
                showClose:true,
                closeByDocument: true,
                closeByEscape: true
            });
        }).error(function (result) {
            $scope.showtermsploicy(id);
        });
    }

    $rootScope.sportsMenu = [];

    $timeout(function(){
        $scope.GetParentSports();
    },500);


    $scope.GetParentSports = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/GetParentSports',
        }).success(function (result) {
            $rootScope.sportsMenu = result;
        }).error(function (result) {
            $scope.GetParentSports();
        });
    }

});

homeControllers1.controller('home', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog) {
    $scope.openDefault = function () {
        ngDialog.open({
            template: 'firstDialogId',
           // className : 'firstDialogId',
        });
    };
});

homeControllers1.controller('login', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog) {

    $scope.submitloginForm = function() {

        if (typeof ($scope.form.remember) != 'undefined' && $scope.form.remember == true) {
            $cookieStore.put('login_email',$scope.form.email);
            $cookieStore.put('login_password',$scope.form.password);
        }else{
            $cookieStore.remove('login_email');
            $cookieStore.remove('login_password');
        }
        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/login',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;

            if(typeof (data.id) != 'undefined'){
                $cookieStore.put('login_email1',$scope.form.email);
                $cookieStore.put('login_password1',$scope.form.password);

                //$rootScope.rootUserImage = data.user_image;
                //$rootScope.rootUserCoverImage = data.user_cover_image;
                $scope.alldata = data;

                //$scope.alldata.user_image = '';
                // $scope.alldata.user_cover_image = '';

                $cookieStore.put('rootuserdet',$scope.alldata);

                var user_str1 = $scope.alldata.fname+'-'+$scope.alldata.lname;
                user_str1 = user_str1.replace(/\s+/g, '-');

                user_str1 = user_str1.toLowerCase();

                $state.go('profile1',{userId:data.id,userStr:user_str1});
                return;

//                $state.go('profile',{userId:data.id});
//                return;

            }else{
                $scope.msgFlag = true;
            }
        }).error(function (result) {
            $scope.submitloginForm();
        });
    };

});

homeControllers1.controller('logout', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog) {
    $scope.userId = 0;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.userId = $scope.userDet.id;
    }

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs1/logout',
        data    : $.param({'cuser':$scope.userId}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
    });



    $cookieStore.remove('rootuserdet');
    $cookieStore.remove('user_is_admin');
    $cookieStore.remove('activeChat')
    $rootScope.rootsessUser = 0;
    $rootScope.userdetnew = "";
    $state.go('index');
    return;
});

homeControllers1.controller('signup', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$timeout) {

    $scope.showtermsploicy = function(id){

        var header = '';
        if(id=='policy')
            header = 'Privacy Policy';
        if(id=='terms')
            header = 'Terms And Condition';

        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/cms/admin/conditionmanager1/bringcondition',
            data    : $.param({'id':id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            ngDialog.open({
                template: '<div><strong style="font-size: 16px; color:#C97413; font-weight: normal; text-align:center; display:block; font-weight:bold; text-transform:uppercase; font-size:22px;">'+header+'</strong></div>'+data,
                plain:true,
                showClose:true,
                closeByDocument: true,
                closeByEscape: true
            });
        }).error(function (result) {
            $scope.showtermsploicy(id);
        });
    }

    $scope.countrylist = [];
    $scope.statelist = [];
    $scope.form = {
        gender : 0
    }

    $timeout(function(){
        $scope.getCountryList();
    },500);

    $scope.getCountryList = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getCountryList',
        }).success(function (result) {
            $scope.countrylist = result;
        }).error(function (result) {
            $scope.getCountryList();
        });
    }

    $scope.getStateList = function(countryval){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getStateList',
            data    : $.param({'id':countryval}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (result) {
            $scope.statelist = result;
        }).error(function (result) {
            $scope.getStateList(countryval);
        });
    }



    $scope.changeCountry = function(countryval){
        if(typeof (countryval) != 'undefined'){
            $scope.statelist = [];

            $scope.getStateList(countryval.id);

        }else{
            $scope.statelist = [];
        }

    }

    $scope.submitsignUpForm = function(){

        $cookieStore.put('login_email',$scope.form.email);
        $cookieStore.put('login_password',$scope.form.password);

        $('.email_div').find('label.validationMessage').remove();

        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/signup',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            if(data == 'error'){
                $('.email_div').append('<label class="control-label has-error validationMessage">This email already exists.</label>');
            }else{
                $cookieStore.put('user_insert_id',data);

                $state.go('activities');
                return;
            }

        }).error(function (result) {
            $scope.submitsignUpForm();
        });
    }

});

homeControllers1.controller('activities', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$timeout) {
    $scope.showtermsploicy = function(id){

        var header = '';
        if(id=='policy')
            header = 'Privacy Policy';
        if(id=='terms')
            header = 'Terms And Condition';

        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/cms/admin/conditionmanager1/bringcondition',
            data    : $.param({'id':id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            ngDialog.open({
                template: '<div><strong style="font-size: 16px; color:#C97413; font-weight: normal; text-align:center; display:block; font-weight:bold; text-transform:uppercase; font-size:22px;">'+header+'</strong></div>'+data,
                plain:true,
                showClose:true,
                closeByDocument: true,
                closeByEscape: true
            });
        }).error(function (result) {
            $scope.showtermsploicy(id);
        });
    }

    $scope.sportsList = [];
    $scope.sportsList1 = [];
    $scope.selSports = [];

    $scope.current_cat = '';
    $scope.last_cat = '';
    $scope.count = 0;

    $scope.predicate = 'priority';
    $scope.reverse = false;

    $timeout(function(){
        $scope.allsports();
    },500);


    $scope.allsports = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/allsports',
        }).success(function (result) {
            $scope.sportsList = result;
        }).error(function (result) {
            $scope.allsports();
        });
    }

    $scope.selectSp = function(id) {
        var idx = $scope.selSports.indexOf(id);
        if (idx === -1) {
            $scope.selSports.push(id);
        }else{
            $scope.selSports.splice(idx,1);
        }
    };

    $scope.next_a = function() {
        if($scope.selSports.length){
            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs1/addSport',
                data    : $.param({'id':$cookieStore.get('user_insert_id'),selSports:$scope.selSports}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }  // set the headers so angular passing info as form data (not request payload)
            }) .success(function(data) {
                //alert(data);
            });
        }

        $state.go('connect');
        return;
    }

});

homeControllers1.controller('connect', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$filter,$timeout) {
    $scope.showtermsploicy = function(id){

        var header = '';
        if(id=='policy')
            header = 'Privacy Policy';
        if(id=='terms')
            header = 'Terms And Condition';

        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/cms/admin/conditionmanager1/bringcondition',
            data    : $.param({'id':id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            ngDialog.open({
                template: '<div><strong style="font-size: 16px; color:#C97413; font-weight: normal; text-align:center; display:block; font-weight:bold; text-transform:uppercase; font-size:22px;">'+header+'</strong></div>'+data,
                plain:true,
                showClose:true,
                closeByDocument: true,
                closeByEscape: true
            });
        }).error(function (result) {
            $scope.showtermsploicy(id);
        });
    }

    $scope.showadvsearch = 0;
    $scope.showadvsearchfun = function(){
        $scope.showadvsearch = !$scope.showadvsearch;
    }

    $scope.limit = 20;

    $scope.loadmore = function(){
        $scope.limit = $scope.limit+20;
    }

    $scope.defCountry = '';
    $scope.defState = '';

    $scope.userList = [];

    $scope.userList = [];
    $scope.selUsers = [];
    $scope.count = 0;
    $scope.tabBodyLoad = true;

    $scope.sportsList = [];

    $timeout(function(){
        $scope.getuserList();
        $scope.getCountryList();
    },500);

    $scope.getuserList = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/userList',
            data    : $.param({'sess_id':$cookieStore.get('user_insert_id')}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.tabBodyLoad = false;
            $scope.userList = result;
            $scope.userList1 = result;

            $scope.getallsports();

        }).error(function (result) {
            $scope.getuserList();
        });
    }

    $scope.getallsports = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/allsports',
        }).success(function (result5) {
            $scope.sportsList = result5;

            $scope.getUserDetails();

        }).error(function (result) {
            $scope.getallsports();
        });
    }

    $scope.getUserDetails = function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/getUserDetails',
            data    : $.param({'userid':$cookieStore.get('user_insert_id'),sessUser:0}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(result1) {
            $scope.userDet = result1;
            angular.forEach(result1.user_sports,function(value,key){

                $('#sportscheck'+value.id).prop('checked', true);
                $scope.sp_tag_add(value.id);
            });

        }).error(function (result) {
            $scope.getUserDetails();
        });
    }

    $scope.selectUser = function(id) {
        var idx = $scope.selUsers.indexOf(id);
        if (idx === -1) {
            $scope.selUsers.push(id);
            $scope.count = $scope.count+1;
        }else{
            $scope.selUsers.splice(idx,1);
            $scope.count = $scope.count-1;
        }
    };



    $scope.getCountryList = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getCountryList',
        }).success(function (result) {
            $scope.countrylist = result;
            if($scope.defCountry != ''){
                $scope.getStateList($scope.defCountry);
            }
        }).error(function (result) {
            $scope.getCountryList();
        });
    }

    $scope.getStateList = function(countryval){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getStateList',
            data    : $.param({'id':countryval}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (result) {
            $scope.statelist = result;
        }).error(function (result) {
            $scope.getStateList(countryval);
        });
    }

    $scope.statelist = [];

    $scope.changeCountry = function(event){

        $scope.defCountry = '';
        $scope.defState = '';

        $scope.search_user_state = '';

        $scope.statelist = [];

        if(typeof (event) != 'undefined'){
            $scope.statelist = [];
            $scope.getStateList(event)
        }
    }

    $scope.search_user_name = '';
    $scope.search_user_country = '';
    $scope.search_user_state = '';
    $scope.search_user_sports = [];

    $scope.resetsearch = function(){
        $scope.defCountry = '';
        $scope.defState = '';

        $scope.search_user_name = '';
        $scope.search_user_country = '';
        $scope.search_user_state = '';
        $scope.statelist = [];
        $scope.search_user_sports = [];
        $scope.userList = $scope.userList1;
        $(".sportscheck").prop('checked', false);


    }

    $scope.search = function(item){

        if($scope.search_user_country != '' && $scope.search_user_state != ''){
            if ( ($filter('lowercase')(item.user_name).indexOf($filter('lowercase')($scope.search_user_name)) != -1) && (item.user_country == $scope.search_user_country ) && (item.user_state == $scope.search_user_state ) ){
                return true;
            }
        }else if($scope.search_user_country != ''){
            if ( ($filter('lowercase')(item.user_name).indexOf($filter('lowercase')($scope.search_user_name)) != -1) && (item.user_country == $scope.search_user_country ) ){
                return true;
            }
        }else{

              if ( ($filter('lowercase')(item.user_name).indexOf($filter('lowercase')($scope.search_user_name)) != -1) ){
                    return true;
              }
        }

        return false;
    }



    $scope.sp_tag_add = function(id){

        var idx = $scope.search_user_sports.indexOf(id);
        if (idx === -1) {
            $scope.search_user_sports.push(id);
        }else{
            $scope.search_user_sports.splice(idx,1);
        }

        var tor_user = $scope.userList1;
        var sel_user = [];



        if($scope.search_user_sports.length > 0){
            angular.forEach(tor_user,function(value,key){
                angular.forEach($scope.search_user_sports,function(value1,key1){
                    if ( (value.spList.indexOf(value1) != -1 && sel_user.indexOf(value) == -1) ){
                        sel_user.push(value);
                        return false;
                    }
                });
            });
            $scope.userList = sel_user;
        }else{
            $scope.userList = $scope.userList1;
        }


    }


    $scope.loadSports = function($query) {
        var sports = $scope.sportList;
        return sports.filter(function(sport) {
            return sport.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
        });
    };

    $scope.tooltipVal = function(item){
        var fsgs ='<h2>'+item.user_name+'</h2><p>'+item.user_address+'</p>';
        return  fsgs;
    }

    $scope.skip = function(){
        $state.go('next');
        return;
    }

    $scope.next_c = function() {
        if($scope.selUsers.length){
            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs1/addFreind',
                data    : $.param({'id':$cookieStore.get('user_insert_id'),selUsers:$scope.selUsers}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }  // set the headers so angular passing info as form data (not request payload)
            }) .success(function(data) {
                //alert(data);
            });
        }

        $state.go('next');
        return;
    };

});

homeControllers1.controller('next', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$facebook,$timeout,googleService,$modal) {
    $scope.showtermsploicy = function(id){

        var header = '';
        if(id=='policy')
            header = 'Privacy Policy';
        if(id=='terms')
            header = 'Terms And Condition';

        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/cms/admin/conditionmanager1/bringcondition',
            data    : $.param({'id':id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            ngDialog.open({
                template: '<div><strong style="font-size: 16px; color:#C97413; font-weight: normal; text-align:center; display:block; font-weight:bold; text-transform:uppercase; font-size:22px;">'+header+'</strong></div>'+data,
                plain:true,
                showClose:true,
                closeByDocument: true,
                closeByEscape: true
            });
        }).error(function (result) {
            $scope.showtermsploicy(id);
        });
    }

    $scope.$on('fb.auth.authResponseChange', function() {
        $scope.fbStatus = $facebook.isConnected();
    });

    $scope.isSendMail = 0;
    $scope.isSocialShare = 0;

    $scope.form = {
        mailBody: "I just joined Torkq.com. Check it out.\n\n Torkq brings the consciousness of outdoor sports to a new, progressive social media realm.  Torkq is a collective of runners, jumpers, climbers, riders, hikers, surfers and all who dare to smack the terrain from land, sky, powder and H2O. Now go get it!! Time to connect, track and explore. I use Torkq to connect, track and explore my favorite sports."
    };

    $scope.next_n = function() {
        $state.go('addimage');
        return;
    };

    $scope.sendEmail = function() {
        var dialog1 = ngDialog.open({
            template: '<div style="text-align:center;" class="sentMailmsg">Sending <img src="images/ajax_loading.gif"></div>',
            plain:true,
            showClose:false,
            closeByDocument: false,
            closeByEscape: false
        });
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/sendMail',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }  // set the headers so angular passing info as form data (not request payload)
        }) .success(function(data) {
            dialog1.close();
            var dial = ngDialog.open({
                template: '<div style="text-align:center;" class="sentMailmsg">Mail sent successfully.</div>',
                plain:true,
                showClose:false,
                closeByDocument: false,
                closeByEscape: false
            });
            setTimeout(function () {
                dial.close();

                $scope.isSendMail = 1;
                if($scope.isSocialShare == 1){
                    $state.go('addimage');
                    return;
                }

            }, 2000);
        });
    };

    $scope.social_share = function() {
        if($scope.social_select == 'fb'){
                if($scope.fbStatus) {
                    $scope.getAuthResponse = $facebook.getAuthResponse();
                    $scope.fb_share($scope.getAuthResponse.accessToken);
                } else {
                    $facebook.login().then(function(){
                        $scope.getAuthResponse = $facebook.getAuthResponse();
                        $scope.fb_share($scope.getAuthResponse.accessToken);
                    });
                }
        }
        if($scope.social_select == 'tw'){
            window.location.href = ($scope.baseUrl+'/user/ajs1/twittershare1');
        }

    };

    $scope.fb_share = function(accesstoken){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/updateAccessToken',
            data    : $.param({'accesstoken':accesstoken,'id':$cookieStore.get('user_insert_id')}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
        });



        $facebook.ui({
                method: 'feed',
                link: 'http://torkq.com',
            },
            function(response) {

            }).then(function(response) {

                $scope.isSocialShare = 1;
                 if($scope.isSendMail == 1){
                 $state.go('addimage');
                 return;
                 }
            });

    }

    $scope.get_email_contacts = function(){
        if($scope.email_select == 'gmail'){
            $scope.glogin();
        }
        if($scope.email_select == 'yahoo'){
            $scope.ylogin();
        }
    }

    var modalInstance;
    $scope.modalClose = function(){
        modalInstance.dismiss('cancel');
    }
    $scope.contactList = [];
    $scope.glogin = function () {
        googleService.login().then(function (data) {
            // do something with returned data
            $rootScope.stateIsLoading = true;
            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/googlecontacts.php',
                data    : $.param({'access_token':data.access_token}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }) .success(function(data1) {
                $rootScope.stateIsLoading = false;

                if(data1.status == 'success')
                    $scope.contactList = data1.list;

                $scope.animationsEnabled = true;
                modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'gmailcontactlist',
                    windowClass: 'gmailcontactlistCls',
                    size: 'lg',
                    scope : $scope
                });

            });




        }, function (err) {
            console.log('Failed: ' + err);
        });
    };

    $scope.sendmailg = function(){
        $scope.showerror = 0;


        $scope.selectedmail = [];
        angular.forEach($scope.contactList, function(item){
            if (item.selected) $scope.selectedmail.push(item.name);
        });

        if($scope.selectedmail.length == 0){
            $scope.showerror = 1;
        }else{
            modalInstance.dismiss('cancel');
            var dialog1 = ngDialog.open({
                template: '<div style="text-align:center;" class="sentMailmsg">Sending <img src="images/ajax_loading.gif"></div>',
                plain:true,
                showClose:false,
                closeByDocument: false,
                closeByEscape: false
            });

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs1/sendMail1',
                data    : $.param({'senderList':$scope.selectedmail}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }  // set the headers so angular passing info as form data (not request payload)
            }) .success(function(data) {
                dialog1.close();
                var dial = ngDialog.open({
                    template: '<div style="text-align:center;" class="sentMailmsg">Mail sent successfully.</div>',
                    plain:true,
                    showClose:false,
                    closeByDocument: false,
                    closeByEscape: false
                });
                setTimeout(function () {
                    dial.close();
                }, 2000);
            });
        }


    }

    $scope.ylogin = function(){
        window.open($scope.baseUrl+'/yahoocontacts.php');
    }


});

homeControllers1.controller('addimage', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,Upload,$modal,$sce,$timeout) {
    $scope.showtermsploicy = function(id){

        var header = '';
        if(id=='policy')
            header = 'Privacy Policy';
        if(id=='terms')
            header = 'Terms And Condition';

        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/cms/admin/conditionmanager1/bringcondition',
            data    : $.param({'id':id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            ngDialog.open({
                template: '<div><strong style="font-size: 16px; color:#C97413; font-weight: normal; text-align:center; display:block; font-weight:bold; text-transform:uppercase; font-size:22px;">'+header+'</strong></div>'+data,
                plain:true,
                showClose:true,
                closeByDocument: true,
                closeByEscape: true
            });
        }).error(function (result) {
            $scope.showtermsploicy(id);
        });
    };

    $scope.profileImage = "";
    $scope.profileBackImage = "";
    $scope.profileImageName = "";
    $scope.profileBackImageName = "";
    $scope.origprofileImageName = "";
    $scope.origprofileBackImageName = "";

    $timeout(function(){
        $scope.getPImage();
    },500);

    $scope.getPImage = function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/getPImage',
            data    : $.param({'userid':$cookieStore.get('user_insert_id')}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data) {
            $scope.profileImage = $scope.baseUrl+'/uploads/user_image/thumb/'+data.profileImgName;
            $scope.profileImageName = data.profileImgName;
            $scope.origprofileImageName = data.profileOrigImgName;
            $scope.profileBackImage = $scope.baseUrl+'/uploads/user_image/background/thumb/'+data.backImg;
            $scope.profileBackImageName = data.backImg;
            $scope.origprofileBackImageName = data.OrigbackImgName;
        }).error(function (result) {
            $scope.getPImage();
        });
    }



    $scope.profileImgDel = function(type){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/profileImgDel',
            data    : $.param({'userid':$cookieStore.get('user_insert_id'),'type':type}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(result) {
            if(type == 1){
                $scope.profileImage = "";
                $scope.profileImageName = "default.jpg";
                $scope.origprofileImageName = "";
            }

            if(type==2){
                $scope.profileBackImage = "";
                $scope.profileBackImageName = "default.jpg";
                $scope.origprofileBackImageName = "";
            }
        });
    }

    $scope.$watch('files', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload(file);
                })(files[i]);
            }
        }
    });

    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
        '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    function upload(file) {
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {
        file.upload = Upload.upload({
            url: $scope.baseUrl+'/user/ajs1/profileImgUp' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {'user_id':$cookieStore.get('user_insert_id')},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            if(response.data.error == 0){

                file.result = response.data.msg;

                var ctime = (new Date).getTime();

                $http({
                    method  : 'POST',
                    async:   false,
                    url     : $scope.baseUrl+'/user/ajs1/profileimgresize',
                    data    : $.param({'filename':response.data.msg,'height':156,'width':142,'foldername':'thumb'}),  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function(data) {
                    $('.progress').addClass('ng-hide');
                    $scope.profileImage = $scope.baseUrl+'/uploads/user_image/thumb/'+response.data.msg+'?version='+ctime;
                    $scope.profileImageName = response.data.msg;
                    $scope.origprofileImageName = response.data.msg+'?version='+ctime;


                    $scope.cropProfileImg();
                });
            }else{
                $('.progress').addClass('ng-hide');
                var modalInstance1;
                modalInstance1 = $modal.open({
                    animation: true,
                    template: '<div class="errorModal">'+response.data.msg+'</div>',
                    size: 'lg',
                    scope : $scope
                });

                $timeout(function(){
                    modalInstance1.dismiss('cancel');
                },5000);

            }

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));

            if(file.progress <100){
                file.progresstext = file.progress + '%';
            }else{
                file.progresstext = '99%';
            }
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }

    $scope.$watch('files1', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload1(file);
                })(files[i]);
            }
        }
    });

    function upload1(file) {
        $scope.errorMsg = null;
        uploadUsingUpload1(file);
    }

    function uploadUsingUpload1(file) {
        file.upload = Upload.upload({
            url: $scope.baseUrl+'/user/ajs1/profileBackImgUp' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {'user_id':$cookieStore.get('user_insert_id')},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            if(response.data.error == 0){
                file.result = response.data.msg;

                var ctime = (new Date).getTime();

                $http({
                    method  : 'POST',
                    async:   false,
                    url     : $scope.baseUrl+'/user/ajs1/profileBackimgresize',
                    data    : $.param({'filename':response.data.msg,'height':536,'width':1175,'foldername':'thumb'}),  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function(data) {
                    $('.progress').addClass('ng-hide');
                    $scope.profileBackImage = $scope.baseUrl+'/uploads/user_image/background/thumb/'+response.data.msg+'?version='+ctime;
                    $scope.profileBackImageName = response.data.msg;
                    $scope.origprofileBackImageName = response.data.msg+'?version='+ctime;

                    $scope.cropProfileBackImg();
                });
            }else{
                $('.progress').addClass('ng-hide');
                var modalInstance1;
                modalInstance1 = $modal.open({
                    animation: true,
                    template: '<div class="errorModal">'+response.data.msg+'</div>',
                    size: 'lg',
                    scope : $scope
                });

                $timeout(function(){
                    modalInstance1.dismiss('cancel');
                },5000);

            }

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));

            if(file.progress <100){
                file.progresstext = file.progress + '%';
            }else{
                file.progresstext = '99%';
            }

        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }

    var modalInstance;
    $scope.modalClose = function(){
        modalInstance.dismiss('cancel');
    }

    $scope.cropProfileImg = function(){
        $scope.pLoad = true;
        $scope.image = $sce.trustAsResourceUrl($scope.baseUrl+'/uploads/user_image/'+$scope.profileImageName);

        $scope.animationsEnabled = true;
        modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'mymodal',
            windowClass: 'mymodalimg',
            size: 'lg',
            scope : $scope
        });

        $timeout(function(){

            $('.image-editor').cropit({
                exportZoom:.5,
                imageBackground: true,
                imageBackgroundBorderWidth: 50,
                imageState: {
                    src: $scope.subUrl+'/uploads/user_image/'+$scope.origprofileImageName,
                },
            });
            $scope.pLoad = false;
        },5000);
    }

    $scope.changepreview = function(){
        $scope.imagedata1 = $('.image-editor').cropit('export');
    }



    $scope.crop123 = function(){

        var imagedata = $('.image-editor').cropit('export');


        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/ImageSave',
            data    : $.param({'user_id':$cookieStore.get('user_insert_id'),'imagedata':imagedata}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function(data) {
            $scope.profileImage = data;
            modalInstance.dismiss('cancel');
        });
    }

    $scope.cropProfileBackImg = function(){
        $scope.pLoad = true;

        $scope.animationsEnabled = true;
        modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'mymodal1',
            windowClass: 'mymodalimg',
            size: 'lg',
            scope : $scope
        });

        $timeout(function(){

            $('.image-editor1').cropit({
                exportZoom:.5,
                imageBackground: true,
                imageBackgroundBorderWidth: 30,
                imageState: {
                    src: $scope.subUrl+'/uploads/user_image/background/'+$scope.origprofileBackImageName,
                },
            });
            $scope.pLoad = false;
        },5000);
    }

    $scope.changepreview1 = function(){
        $scope.imagedata2 = $('.image-editor1').cropit('export');
    }

    $scope.crop1 = function(){

        var imagedata = $('.image-editor1').cropit('export');


        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/ImageSave1',
            data    : $.param({'user_id':$cookieStore.get('user_insert_id'),'imagedata':imagedata}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function(data) {
            $scope.profileBackImage = data;
            modalInstance.dismiss('cancel');
        });
    }

    $scope.signUpfinish = function(){


        $scope.email = $cookieStore.get('login_email');
        $scope.password = $cookieStore.get('login_password');
        if (typeof ($scope.email) != 'undefined' && typeof ($scope.password) != 'undefined') {
            $rootScope.stateIsLoading = true;
            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs1/sendWelcomeMail',
                data    : $.param({'email':$scope.email}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }) .success(function(data) {
                
            });

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs1/login',
                data    : $.param({'email':$scope.email,'password':$scope.password}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }) .success(function(data) {
                $rootScope.stateIsLoading = false;

                if(typeof (data.id) != 'undefined'){
                    $cookieStore.put('login_email1',$scope.email);
                    $cookieStore.put('login_password1',$scope.password);

                    //$rootScope.rootUserImage = data.user_image;
                    //$rootScope.rootUserCoverImage = data.user_cover_image;
                    $scope.alldata = data;

                    //$scope.alldata.user_image = '';
                    // $scope.alldata.user_cover_image = '';

                    $cookieStore.put('rootuserdet',$scope.alldata);

                    $cookieStore.remove('login_email');
                    $cookieStore.remove('login_password');
                    $cookieStore.remove('user_insert_id');


                    var user_str1 = $scope.alldata.fname+'-'+$scope.alldata.lname;
                    user_str1 = user_str1.replace(/\s+/g, '-');

                    user_str1 = user_str1.toLowerCase();

                    $state.go('profile1',{userId:data.id,userStr:user_str1});
                    return;
//                    $state.go('profile',{userId:data.id});
//                    return;

                }else{
                    $state.go('index');
                    return
                }
            });
        }else{
            $state.go('index');
            return
        }
    }


})

homeControllers1.controller('completesignup', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog) {
    $scope.showtermsploicy = function(id){

        var header = '';
        if(id=='policy')
            header = 'Privacy Policy';
        if(id=='terms')
            header = 'Terms And Condition';

        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/cms/admin/conditionmanager1/bringcondition',
            data    : $.param({'id':id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            ngDialog.open({
                template: '<div><strong style="font-size: 16px; color:#C97413; font-weight: normal; text-align:center; display:block; font-weight:bold; text-transform:uppercase; font-size:22px;">'+header+'</strong></div>'+data,
                plain:true,
                showClose:true,
                closeByDocument: true,
                closeByEscape: true
            });
        });
    }




});
homeControllers1.controller('forgotpassword', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog) {

    $scope.submitloginForm = function(){
        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/forgot_password',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            if(data == 1){
                $cookieStore.put('sess_f_email',$scope.form.email);
                $state.go('forgotpassword2');
                return;
            }else{
                $scope.msgFlag = true;
            }
        }).error(function (result) {
            $scope.submitloginForm();
        });

    }

});

homeControllers1.controller('forgotpassword2', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog) {

    $scope.form = {
        user_email : $cookieStore.get('sess_f_email')
    }
    $scope.submitloginForm = function(){
        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/forgot_password2',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            if(data > 0){
                $cookieStore.put('sess_f_id',data);
                $state.go('changepassword');
                return;
            }else{
                $scope.msgFlag = true;
            }
        }).error(function (result) {
            $scope.submitloginForm();
        });

    }

});
homeControllers1.controller('changepassword', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog) {
    $scope.form = {
        sess_f_id : $cookieStore.get('sess_f_id'),
        sess_f_email : $cookieStore.get('sess_f_email')
    }
    $scope.passwordValidator = function(password) {

        if (!password) {
            return "Password can not be blank";
        }
        else if (password.length < 6) {
            return "Password must be at least " + 6 + " characters long";
        }
        else if (!password.match(/[0-9]/)) {
            return "Password must have at least one number";
        }

        return true;
    };

    $scope.submitloginForm = function(){
        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/Change_password',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $cookieStore.put('login_email',data.email);
            $cookieStore.put('login_password',data.password);

            $state.go('login');
            return;
        }).error(function (result) {
            $scope.submitloginForm();
        });

    }

});

homeControllers1.controller('experience', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$sce,$window,$timeout) {
    $scope.sessUser = 0;

    $scope.howitHeight = 210;
    $scope.ban2Height = 200;

    $scope.widowWidth12 = $(window).width();
    $scope.expWrapWidth = (($scope.widowWidth12*90)/100);
    $scope.RconWidth = (($scope.expWrapWidth*39)/100);
    $scope.RconWidth = (parseInt($scope.RconWidth)-16);

    $scope.howitHeight = (($scope.RconWidth*143)/334);
    $scope.howitHeight = parseInt($scope.howitHeight);

    $scope.ban2Height = ($scope.RconWidth/3);
    $scope.ban2Height = parseInt($scope.ban2Height);

    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.sessUser = $scope.userDet.id;
        $rootScope.rootsessUser = $scope.userDet.id;
    }

    $scope.openDefault = function () {
        ngDialog.open({
            template: 'firstDialogId',
        });
    };

    $scope.maintvfile = '';

    $scope.isMute = true;

    $scope.slides = [];
    $scope.groupedSlides = [];

    var i, j, first = [],
        second, third;
    var many = 3;


    /**************************Common*****************************/

    $scope.openBanner = function(url){
        window.open(url);
    }

    $( window ).resize(function() {
        $timeout(function(){
            $scope.setbannerdim221();
        },1000);
    });

    $timeout(function(){
        $scope.setbannerdim221();
    },100);

    $scope.setbannerdim221 = function(){

        var ban2no = $('.banner2').find('simple-slider').find('a').length;
        var ban3no = $('.banner3').find('simple-slider').find('a').length;

        if(ban2no > 0 && ban3no >0){

            $rootScope.widowWidth = $(window).width();
            $scope.widowWidthPage = $(window).width();
            $scope.bannerwidth = (($scope.widowWidthPage *90)/100);
            $scope.bannerwidth = (($scope.bannerwidth *39)/100);
            $scope.bannerwidth = parseInt($scope.bannerwidth);

            $scope.bannerheight1 = (($scope.bannerwidth*142)/501);
            $scope.bannerheight1 = parseInt($scope.bannerheight1);

            $scope.bannerheight2 = (($scope.bannerwidth*282)/501);
            $scope.bannerheight2 = parseInt($scope.bannerheight2);

            console.log('$scope.bannerwidth : '+$scope.bannerwidth);
            console.log('$scope.bannerheight1 : '+$scope.bannerheight1);
            console.log('$scope.bannerheight2 : '+$scope.bannerheight2);

            $('.banner2').find('.adspace').css("cssText", "height: "+$scope.bannerheight1+"px !important;");
            $('.banner2').find('.adspace').find('.bannerdiv225').css('height',$scope.bannerheight1+'px');

            $('.banner3').find('.adspace').css("cssText", "height: "+$scope.bannerheight2+"px !important;");
            $('.banner3').find('.adspace').find('.bannerdiv225').css('height',$scope.bannerheight2+'px');
        }else{
            $timeout(function(){
                $scope.setbannerdim221();
            },100);
        }

    }


    /**************************Common*****************************/

    $timeout(function(){
        $scope.getUserListExe();
        $scope.getMainTv();
        $scope.getlast3post();
        $scope.getMainBanner();
        $scope.GetParentSports();
    },500);

    $scope.getUserListExe =function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getUserListExe',
            data    : $.param({'userid':$scope.sessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.peoplelist_no = result.nooflist;
            $rootScope.peoplelist = result.frnddet;
        }).error(function (result) {
            $scope.getUserListExe();
        });
    }

    $scope.getMainTv = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getMainTv',
        }).success(function (result) {
            $rootScope.maintv = result;
            $rootScope.maintvfile = $sce.trustAsResourceUrl($scope.baseUrl+'/uploads/video/converted/'+$rootScope.maintv.file);
            $rootScope.vidsources = [{src: $sce.trustAsResourceUrl($scope.baseUrl+'/uploads/video/converted/'+$rootScope.maintv.file), type: "video/mp4"}];


            setTimeout(function(){
                angular.element( document.querySelector( '#maintvDiv' ) ).html('<video id="maintvVideo" volume="0" width="100%" autoplay loop muted controls>\
            <source src="'+$rootScope.maintvfile+'" type="video/mp4">\
            </video>');
            },2000);
        }).error(function (result) {
            $scope.getMainTv();
        });
    }

    $scope.getlast3post = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getlast3post',
        }).success(function (result) {
            $rootScope.forumList = result;
        }).error(function (result) {

            $scope.getlast3post();
        });
    }

    $scope.mainbanner = 'default.png';

    $scope.getMainBanner = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getMainBanner',
        }).success(function (result) {
            $rootScope.mainbanner = result;
        }).error(function (result) {
            $scope.getMainBanner();
        });
    }

    $scope.GetParentSports = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/GetParentSports',
        }).success(function (result) {
            $scope.slides = [];
            $scope.slides1 = result;



            if(result.length%3 > 0){

                angular.forEach(result, function(value, key){
                    $scope.slides.push(value);
                });

                angular.forEach(result, function(value, key){
                    $scope.slides.push(value);
                });

                angular.forEach(result, function(value, key){
                    $scope.slides.push(value);
                });
            }else{
                $scope.slides = result;
            }

            for (i = 0; i < $scope.slides.length; i += many) {
                second = {
                    image1: $scope.slides[i]
                };
                if (many == 1) {}
                if ($scope.slides[i + 1] && (many == 2 || many == 3)) {
                    second.image2 = $scope.slides[i + 1];

                }
                if ($scope.slides[i + (many - 1)] && many == 3) {
                    second.image3 = $scope.slides[i + 2];
                }
                first.push(second);
            }

            $scope.groupedSlides = first;
        }).error(function (result) {
            $scope.GetParentSports();
        });
    }

});

homeControllers1.controller('profile5', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$filter,$q) {


    $scope.isProfilePage = 1;
    $scope.sessUser = $rootScope.rootsessUser = 0;
    $scope.userId = $stateParams.userId;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.sessUser = $scope.userDet.id;
        $rootScope.rootsessUser = $scope.userDet.id;
    }

    $timeout(function(){
        $scope.getUserDetails();
    },500);


    var deferred;
    var dArr = [];
    var imgpaths = [];
    $scope.hideall = true;

    $scope.user_str1 = '';

    $rootScope.ctime222 = new Date().getTime();

    $scope.getUserDetails = function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/getUserDetails',
            data    : $.param({'userid':$scope.userId,sessUser:$scope.sessUser}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(result) {
            $scope.userDet = result;
            /*console.log($scope.baseUrl+'/user/ajs1/createimage?image='+$scope.userDet.profileImg+'&version='+$rootScope.ctime222);

             deferred = $q.defer();
             imgpaths.push({
             path: $scope.baseUrl+'/user/ajs1/createimage?image='+$scope.userDet.profileImg+'&version='+$rootScope.ctime222,
             callback: deferred.resolve
             });
             dArr.push(deferred.promise);
             deferred = $q.defer();
             imgpaths.push({
             path: $scope.baseUrl+'/user/ajs1/createimage?image='+$scope.userDet.backImg+'&version='+$rootScope.ctime222,
             callback: deferred.resolve
             });
             dArr.push(deferred.promise);

             $scope.imgpaths = imgpaths;*/


            var sportsName1 = '';
            var sportsName2 = '';
            var sportsName3 = '';
            if (typeof $scope.userDet.user_sports[0] != 'undefined') {
                sportsName1 = $scope.userDet.user_sports[0].sport_name;
            }
            if (typeof $scope.userDet.user_sports[1] != 'undefined') {
                sportsName2 = $scope.userDet.user_sports[1].sport_name;
            }
            if (typeof $scope.userDet.user_sports[2] != 'undefined') {
                sportsName3 = $scope.userDet.user_sports[2].sport_name;
            }
            var user_str = $scope.userDet.fname+'-'+$scope.userDet.lname+'-'+sportsName1+'-'+$scope.userDet.city+'-'+$scope.userDet.state_name+'-'+sportsName2+'-'+sportsName3+'-track your route share with friends';
            user_str = user_str.replace(/\s+/g, '-');

            var user_str1 = $scope.userDet.fname+'-'+$scope.userDet.lname;
            user_str1 = user_str1.replace(/\s+/g, '-');

            user_str1 = user_str1.toLowerCase();

            $scope.user_str1 = user_str1;


            $state.go('profile1',{userId:$scope.userId,userStr:user_str1});
            return;
        }).error(function (result) {
            $scope.getUserDetails();
        });
    }


    $q.all(dArr).then(function() {
        $scope.hideall = false;
        console.log('all loaded');
        $timeout(function(){
            $scope.statego();
        },1000);
    });

    $scope.statego = function(){
        if($scope.user_str1 != ''){
            $state.go('profile1',{userId:$scope.userId,userStr:$scope.user_str1});
            return;
            //  window.location.href='/profile/'+$scope.userId+'/'+$scope.user_str1;
        }else{
            console.log('user_str1');
            $timeout(function(){
                $scope.statego();
            },2000);
        }
    }



});

homeControllers1.controller('profile1', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$filter,$q) {


    $scope.isProfilePage = 1;
    $scope.sessUser = $rootScope.rootsessUser = 0;
    $scope.userId = $stateParams.userId;
/*
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined') {
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.sessUser = $scope.userDet.id;
        $rootScope.rootsessUser = $scope.userDet.id;

        if($scope.sessUser != $scope.userId){
            $timeout(function(){
                $scope.getUserDetails();
            },10);
        }else{

            var user_str1 = $scope.userDet.fname+'-'+$scope.userDet.lname;
            user_str1 = user_str1.replace(/\s+/g, '-');

            user_str1 = user_str1.toLowerCase();

            $scope.user_str1 = user_str1;

            $state.go('profile1',{userId:$scope.userId,userStr:user_str1});
            return;
        }
    }else{
        $timeout(function(){
            $scope.getUserDetails();
        },10);
    }


*/

    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined') {
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.sessUser = $scope.userDet.id;


    }

    $timeout(function(){
        $scope.getUserDetails();
    },10);

    $scope.getUserDetails1 = function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/getuserdetailsnew',
            data    : $.param({'user_id':$scope.userId}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(result) {
            $scope.userDet = result;

            $cookieStore.put('rootuserdet',result);
        }).error(function (result) {
            $scope.getUserDetails1();
        });
    }

    $scope.getUserDetails = function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/getuserdetailsnew',
            data    : $.param({'user_id':$scope.userId}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(result) {
            $scope.userDet = result;

            $cookieStore.put('rootcurrentuserdet',result);

            var user_str1 = $scope.userDet.fname+'-'+$scope.userDet.lname;
            user_str1 = user_str1.replace(/\s+/g, '-');

            user_str1 = user_str1.toLowerCase();

            $scope.user_str1 = user_str1;


            $state.go('profile1',{userId:$scope.userId,userStr:user_str1});
            return;
        }).error(function (result) {
            $scope.getUserDetails();
        });
    }

});
homeControllers1.controller('profile', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,MetaService,$interval,$compile,$q) {


    $scope.isProfilePage = 1;
    $scope.sessUser = $rootScope.rootsessUser = 0;
    $scope.userId = $stateParams.userId;

    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet1 = $cookieStore.get('rootuserdet');
        $scope.sessUser = $scope.userDet1.id;
        $rootScope.rootsessUser = $scope.userDet1.id;
    }
    
    
    if(typeof ($cookieStore.get('rootcurrentuserdet')) != 'undefined') {
        $scope.userDet2 = $cookieStore.get('rootcurrentuserdet');
        if($scope.userDet2.id == $scope.userId){
            $scope.userDet = $scope.userDet2;
        }else{
            $timeout(function(){
                $scope.getUserDetailsnew();
            },10);
        }
    }else if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet1 = $cookieStore.get('rootuserdet');
        $scope.sessUser = $scope.userDet1.id;
        $rootScope.rootsessUser = $scope.userDet1.id;

        $scope.userDet = $scope.userDet1;

    }else{
        $timeout(function(){
            $scope.getUserDetailsnew();
        },10);
    }

    $scope.getUserDetailsnew = function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/getuserdetailsnew',
            data    : $.param({'user_id':$scope.userId}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(result) {
            $scope.userDet = result;
            $timeout(function(){
                $scope.setbannerheight55();
            },10);
        }).error(function (result) {
            $scope.getUserDetailsnew();
        });
    }




    $scope.mapcontrol = {
            refresh : {
                latitude: 32.779680,
                longitude: -79.935493
            }
        };


    $scope.showtermsploicy = function(id){

        $rootScope.stateIsLoading = true;

        var header = '';
        if(id=='policy')
            header = 'Privacy Policy';
        if(id=='terms')
            header = 'Terms And Condition';

        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/cms/admin/conditionmanager1/bringcondition',
            data    : $.param({'id':id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            ngDialog.open({
                template: '<div><strong style="font-size: 16px; color:#C97413; font-weight: normal; text-align:center; display:block; font-weight:bold; text-transform:uppercase; font-size:22px;">'+header+'</strong></div>'+data,
                plain:true,
                showClose:true,
                closeByDocument: true,
                closeByEscape: true
            });
        }).error(function (result) {
            $scope.showtermsploicy(id);
        });
    }

    $scope.ban2Height = 200;

    $scope.widowWidth12 = $(window).width();
    $scope.expWrapWidth = (($scope.widowWidth12*90)/100);
    $scope.RconWidth = (($scope.expWrapWidth*39)/100);
    $scope.RconWidth = (parseInt($scope.RconWidth)-16);

    $scope.ban2Height = ($scope.RconWidth/3);
    $scope.ban2Height = parseInt($scope.ban2Height);

    $scope.ctime222 = new Date().getTime();

    $scope.openBanner = function(url){
        window.open(url);
    }

    $scope.bannerslides11 = [];




    $scope.elemload = 0;
    $scope.elemloadtime = 0;

    $scope.someMethod = function(){

        var d = new Date();
        var t = d.getTime();


        $scope.elemload = $scope.elemload +1;

        console.log('element load : '+$scope.elemload +' time interval : '+(t- $scope.elemloadtime));
        $scope.elemloadtime = t;

        if($scope.elemload == 10){
             $scope.mapcommonfunc();
             $scope.bannerload();
        }

    }



    /*****************************************************************************/

    var canvasheight;
    var bannerheight;

    $(window).ready(function(){
        $timeout(function(){
            $scope.setbannerheight55();

        },100);
    });
    $( window ).resize(function() {
        $timeout(function(){
            $scope.setbannerheight55();
            $scope.setbannerdim221();
        },10);
    });

    $timeout(function(){
        $scope.setbannerheight55();
        $scope.setbannerdim221();

    },5000);

    $timeout(function(){
        $scope.setbannerheight55();
    },10000);

    function setbannerheight(){

        if($('.banner-image').length && $('.banner1').length){
            $('.banner-image').find('img').one("load", function() {
                canvasheight=$(this).height();
                $('.banner1').find('img').one("load", function() {
                    bannerheight=$(this).height();
                    if(canvasheight > bannerheight){
                        $(this).height(canvasheight);
                        $(this).width(parseInt(canvasheight *.74));
                    }
                }).each(function() {
                    if(this.complete){
                        $(this).load();
                        if(canvasheight > bannerheight){
                            $(this).height(canvasheight);
                            $(this).width(parseInt(canvasheight *.74));
                        }

                        $('.banner1').find('img').one("load", function() {

                        }).each(function() {
                            if(this.complete){
                                $(this).load();
                                if(canvasheight > bannerheight){
                                    $(this).height((canvasheight));
                                    $(this).width(parseInt(canvasheight *.74));
                                }
                            }
                        });
                    }
                });
            }).each(function() {
                if(this.complete){
                    $(this).load();
                }
            });
        }else{
            setTimeout(function(){
                setbannerheight();
            },5000);
        }


    }


    function setbannerheight1(){

        if($('.banner-image').length && $('.banner1').length){
            $('.banner-image').find('img').one("load", function() {
                canvasheight=$(this).height();
                $('.banner1').find('img').one("load", function() {
                    bannerheight=$(this).height();
                    $('.banner-image').find('img').height(bannerheight);
                }).each(function() {
                    if(this.complete){
                        $(this).load();
                        $('.banner-image').find('img').height(bannerheight);

                        $('.banner1').find('img').one("load", function() {

                        }).each(function() {
                            if(this.complete){
                                $(this).load();
                                $('.banner-image').find('img').height(bannerheight);
                            }
                        });
                    }
                });
            }).each(function() {
                if(this.complete){
                    $(this).load();
                }
            });
        }else{
            setTimeout(function(){
                setbannerheight();
            },5000);
        }


    }


    $scope.setbannerheight55 = function(){
//            var ffheight = $('.top-banner-contain').height();
            var ffheight1 = $('.banner-image').height();
            var ffheight = $('.banner-image img').height();

        if(ffheight > ffheight1){
            ffheight = ffheight1;
        }



        console.log('banner height: '+ffheight);

            if(ffheight > 0){
                $('.bannerdiv22511').height(ffheight);
              //  $('.bannerdiv22511').width($('.banner-add').width());
                $('.bannerdiv22511').width(parseInt(ffheight) *.74);
            }else{
                $timeout(function(){
                    $scope.setbannerheight55();
                },5000);
            }
    }

    function setimgdim(){
        $('img').one("load", function() {
            var imgh = $(this).height();
            var imgw = $(this).width();

            $(this).attr('width',imgw);
            $(this).attr('height',imgh);
        });
    }

    $scope.setbannerdim221 = function(){
        $rootScope.widowWidth = $(window).width();
        $scope.widowWidthPage = $(window).width();
        $scope.bannerwidth = (($scope.widowWidthPage *90)/100);
        $scope.bannerwidth = (($scope.bannerwidth *39)/100);
        $scope.bannerwidth = parseInt($scope.bannerwidth);

        $scope.bannerheight1 = (($scope.bannerwidth*142)/501);
        $scope.bannerheight1 = parseInt($scope.bannerheight1);

        $scope.bannerheight2 = (($scope.bannerwidth*282)/501);
        $scope.bannerheight2 = parseInt($scope.bannerheight2);

        console.log('$scope.bannerwidth : '+$scope.bannerwidth);
        console.log('$scope.bannerheight1 : '+$scope.bannerheight1);
        console.log('$scope.bannerheight2 : '+$scope.bannerheight2);

        $('.banner2').find('.adspace').css("cssText", "height: "+$scope.bannerheight1+"px !important;");
        $('.banner2').find('.adspace').find('.bannerdiv225').css('height',$scope.bannerheight1+'px');

        $('.banner3').find('.adspace').css("cssText", "height: "+$scope.bannerheight2+"px !important;");
        $('.banner3').find('.adspace').find('.bannerdiv225').css('height',$scope.bannerheight2+'px');

    }


    /*****************************************************************************/

    $timeout(function(){
        $scope.getBanner1();
      //  $scope.getUserDetailsnew1();
        $scope.getUserDetailsnew1();
        $scope.getFriendDet1();
        $scope.getunFriendDet1();
        $scope.getstatdetails();
        $scope.getMainTv();
        $scope.getlast3post();
        $scope.getMainBanner();
        $scope.alluserList55555();

    },10)

    $scope.getBanner1 = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getBanner',
            data    : $.param({'pageid':3,'areaid':1,'sp_id':0}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.tempbannerslides = result[0];

            $timeout(function(){
                $scope.setbannerheight55();
            },2000);
        }).error(function (result) {
            $scope.getBanner1();
        });
    }

   /* $scope.userDet = {
        profileImg : $scope.baseUrl+'/uploads/user_image/default_latest_user.jpg',
        backImg : $scope.baseUrl+'/uploads/user_image/default_latest_back.jpg'
    }*/

    $scope.resizeTextarea1 = function(event){

        var target = event.target || event.srcElement || event.originalTarget;

        target.parentElement.parentElement.style.setProperty ("height", target.scrollHeight+'px', "important");
        target.parentElement.style.setProperty ("height", target.scrollHeight+'px', "important");
        target.parentElement.children[0].style.setProperty ("height", target.scrollHeight+'px', "important");
        target.parentElement.children[0].children[0].style.setProperty ("height", target.scrollHeight+'px', "important");
        target.style.setProperty ("height", 'auto', "important");
        target.style.setProperty ("height", target.scrollHeight+'px', "important");
    }

    setTimeout(function(){
        $('#statusText').bind('paste', function(e){
            var thisdiv = this;
            setTimeout(function(){
                var sheight = document.getElementById("statusText").scrollHeight;
                document.getElementById("text-box").style.setProperty ("height", sheight+'px', "important");
                document.getElementById("statusText").style.setProperty ("height", sheight+'px', "important");


                var strss = document.getElementById("statusText").value;
                var match_url = /\b(https?):\/\/([\-A-Z0-9.]+)(\/[\-A-Z0-9+&@#\/%=~_|!:,.;]*)?(\?[A-Z0-9+&@#\/%=~_|!:,.;]*)?/i;

                $scope.thumbImage = [];

                if (match_url.test(strss) && $scope.getExactRunning == 0) {

                    $scope.getExactRunning = 1;

                    var extracted_url = strss.match(match_url)[0];

                    $http({
                        method  : 'POST',
                        async:   false,
                        url     : $scope.baseUrl+'/extract-process.php',
                        data    : $.param({'url': extracted_url}),  // pass in data as strings
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
                    }) .success(function(data) {
                        $scope.getExactRunning = 0;

                        var total_images = parseInt(data.images.length-1);
                        var img_arr_pos = 0;




                        if(data.title != '' && data.title != null){

                            var content = '';
                            var content1 = '';


                            content += '<div class="extracted_url">';
                            content1 += '<div class="extracted_url extracted_url2">';

                            if(data.images.length > 0){
                                content += '<div class="extracted_thumb" id="extracted_thumb">';
                                content += '<a href="javascript:void(0)"  id="extracted_close1" class="extracted_close1"><img src="images/close-img.png" /></a>';
                                content += '<img src="'+data.images[img_arr_pos]+'"></div>';
                                content1 += '<div class="extracted_thumb"><img src="'+data.images[img_arr_pos]+'"></div>';
                                if(data.images.length > 1) {
                                    content += '<div class="thumb_sel"><span class="prev_thumb" id="thumb_prev">prev</span><span class="next_thumb" id="thumb_next">next</span> </div>';
                                }
                            }
                            content += '<div class="extracted_content">';
                            content += '<a href="javascript:void(0)"  id="extracted_close2" class="extracted_close2"><img src="images/close-img.png" /></a>';
                            content += '<h4><a href="'+extracted_url+'" target="_blank">'+data.title+'</a></h4>';
                            content1 += '<div class="extracted_content"><h4><a href="'+extracted_url+'" target="_blank">'+data.title+'</a></h4>';
                            content += '<p>'+data.description+'</p>';
                            content1 += '<p>'+data.description+'</p>';
                            content += '<div class="clear"></div></div>';
                            content1 += '<div class="clear"></div></div>';
                            content += '<div class="clear"></div></div>';
                            content1 += '<div class="clear"></div></div>';



                            angular.element( document.querySelector( '#extracted_url' )).html(content);

                            $scope.statusText1 = content1;



                        }




                        $("#thumb_prev").click( function(e){
                            if(img_arr_pos>0)
                            {
                                img_arr_pos--;
                                $("#extracted_thumb").html('<a href="javascript:void(0)"  id="extracted_close1" class="extracted_close1"><img src="images/close-img.png" /></a><img src="'+data.images[img_arr_pos]+'">');
                            }

                            $scope.statusText1 = '<div class="extracted_url"><div class="extracted_thumb"><img src="'+data.images[img_arr_pos]+'"></div><div class="extracted_content"><h4><a href="'+extracted_url+'" target="_blank">'+data.title+'</a></h4><p>'+data.description+'</p><div class="clear"></div></div><div class="clear"></div></div>';
                        });
                        $("#thumb_next").click( function(e){
                            if(img_arr_pos<total_images)
                            {
                                img_arr_pos++; //thmubnail array position increment
                                $("#extracted_thumb").html('<a href="javascript:void(0)"  id="extracted_close1" class="extracted_close1"><img src="images/close-img.png" /></a><img src="'+data.images[img_arr_pos]+'">');
                            }

                            $scope.statusText1 = '<div class="extracted_url"><div class="extracted_thumb"><img src="'+data.images[img_arr_pos]+'"></div><div class="extracted_content"><h4><a href="'+extracted_url+'" target="_blank">'+data.title+'</a></h4><p>'+data.description+'</p><div class="clear"></div></div><div class="clear"></div></div>';
                        });

                        $('#extracted_close1').click(function(){
                            angular.element( document.querySelector( '#extracted_thumb' )).remove();
                            angular.element( document.querySelector( '.thumb_sel' )).remove();
                            $scope.statusText1 = '<div class="extracted_url"><div class="extracted_content"><h4><a href="'+extracted_url+'" target="_blank">'+data.title+'</a></h4><p>'+data.description+'</p><div class="clear"></div></div><div class="clear"></div></div>';
                        });

                        $('#extracted_close2').click(function(){
                            angular.element( document.querySelector( '#extracted_url' )).html('');
                            $scope.statusText1 = '';
                        })

                    });
                }





            },100);

        });

        $('.commentArea12').bind('paste', function(e){
            var thisdiv = this;
            setTimeout(function(){
                var sheight = thisdiv.scrollHeight;
                thisdiv.style.setProperty ("height", '35px', "important");
                if(sheight>51)thisdiv.style.setProperty ("height", 'auto', "important");
                thisdiv.style.setProperty ("height", sheight+'px', "important");
            },100);
        });



    },5000);

    $scope.highlightWords = [];

    $scope.option = {
        words: $scope.highlightWords,
        color: '#f7931d'
    };


    var matches=[];
    setTimeout(function(){

    $('#statusText').highlightTextarea({
        words:$scope.highlightWords
    });
},3000);

    $scope.getExactRunning = 0;

$scope.matches = [];


    $scope.statusText1 = '';

    $scope.tetshigh = function(event){
        //var textvalu = event.currentTarget.value;


       // if(event.keyCode == 32){
            var strss = event.currentTarget.value;


            var re = /(?:^|\W)#(\w+)(?!\w)/g, match, matches ;
            while (match = re.exec(strss)) {
                //$scope.matches.push('#'+match[1]);
                var hastag = '#'+match[1];

                $('#text-box').find('.highlightTextarea-highlighter').html($('#text-box').find('.highlightTextarea-highlighter').html().replace(hastag,'<span style="color:#fff;background-color:#F7931D; z-index: 9; position: relative;">'+hastag+'</span>'));
            }

            //console.log(matches[matches.length-1]);
           // console.log($('.highlightTextarea-highlighter').html());
           // $('.highlightTextarea-highlighter').html($('.highlightTextarea-highlighter').html().replace($scope.matches[$scope.matches.length-1],"<mark style=background-color:ffff00;>"+$scope.matches[$scope.matches.length-1]+"</mark>"));
            //console.log($('.highlightTextarea-highlighter').html());

        //}


        var match_url = /\b(https?):\/\/([\-A-Z0-9.]+)(\/[\-A-Z0-9+&@#\/%=~_|!:,.;]*)?(\?[A-Z0-9+&@#\/%=~_|!:,.;]*)?/i;

        $scope.thumbImage = [];

        if (match_url.test(strss) && $scope.getExactRunning == 0) {

            $scope.getExactRunning = 1;

            var extracted_url = strss.match(match_url)[0];

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/extract-process.php',
                data    : $.param({'url': extracted_url}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }) .success(function(data) {
                $scope.getExactRunning = 0;

                var total_images = parseInt(data.images.length-1);
                var img_arr_pos = 0;




                if(data.title != '' && data.title != null){


                    var content = '';
                    var content1 = '';

                    content += '<div class="extracted_url">';
                    content1 += '<div class="extracted_url extracted_url2">';

                    if(data.images.length > 0){
                        content += '<div class="extracted_thumb" id="extracted_thumb">';
                        content += '<a href="javascript:void(0)"  id="extracted_close1" class="extracted_close1"><img src="images/close-img.png" /></a>';
                        content += '<img src="'+data.images[img_arr_pos]+'"></div>';
                        content1 += '<div class="extracted_thumb"><img src="'+data.images[img_arr_pos]+'"></div>';
                        if(data.images.length > 1) {
                            content += '<div class="thumb_sel"><span class="prev_thumb" id="thumb_prev">prev</span><span class="next_thumb" id="thumb_next">next</span> </div>';
                        }
                    }
                    content += '<div class="extracted_content">';
                    content += '<a href="javascript:void(0)"  id="extracted_close2" class="extracted_close2"><img src="images/close-img.png" /></a>';
                    content += '<h4><a href="'+extracted_url+'" target="_blank">'+data.title+'</a></h4>';
                    content1 += '<div class="extracted_content"><h4><a href="'+extracted_url+'" target="_blank">'+data.title+'</a></h4>';
                    content += '<p>'+data.description+'</p>';
                    content1 += '<p>'+data.description+'</p>';
                    content += '<div class="clear"></div></div>';
                    content1 += '<div class="clear"></div></div>';
                    content += '<div class="clear"></div></div>';
                    content1 += '<div class="clear"></div></div>';


                    angular.element( document.querySelector( '#extracted_url' )).html(content);

                    $scope.statusText1 = content1;
                }





                $("#thumb_prev").click( function(e){
                    if(img_arr_pos>0)
                    {
                        img_arr_pos--;
                        $("#extracted_thumb").html('<a href="javascript:void(0)"  id="extracted_close1" class="extracted_close1"><img src="images/close-img.png" /></a><img src="'+data.images[img_arr_pos]+'">');
                    }

                    $scope.statusText1 = '<div class="extracted_url"><div class="extracted_thumb"><img src="'+data.images[img_arr_pos]+'"></div><div class="extracted_content"><h4><a href="'+extracted_url+'" target="_blank">'+data.title+'</a></h4><p>'+data.description+'</p><div class="clear"></div></div><div class="clear"></div></div>';
                });
                $("#thumb_next").click( function(e){
                    if(img_arr_pos<total_images)
                    {
                        img_arr_pos++; //thmubnail array position increment
                        $("#extracted_thumb").html('<a href="javascript:void(0)"  id="extracted_close1" class="extracted_close1"><img src="images/close-img.png" /></a><img src="'+data.images[img_arr_pos]+'">');
                    }

                    $scope.statusText1 = '<div class="extracted_url"><div class="extracted_thumb"><img src="'+data.images[img_arr_pos]+'"></div><div class="extracted_content"><h4><a href="'+extracted_url+'" target="_blank">'+data.title+'</a></h4><p>'+data.description+'</p><div class="clear"></div></div><div class="clear"></div></div>';
                });

                $('#extracted_close1').click(function(){
                    angular.element( document.querySelector( '#extracted_thumb' )).remove();
                    angular.element( document.querySelector( '.thumb_sel' )).remove();
                    $scope.statusText1 = '<div class="extracted_url"><div class="extracted_content"><h4><a href="'+extracted_url+'" target="_blank">'+data.title+'</a></h4><p>'+data.description+'</p><div class="clear"></div></div><div class="clear"></div></div>';
                });

                $('#extracted_close2').click(function(){
                    angular.element( document.querySelector( '#extracted_url' )).html('');
                    $scope.statusText1 = '';
                })

            });
        }



    }

    $scope.extracted_close = function(){
       // console.log(1);
    }


    $scope.maintvfile = '';
    $scope.isMute = true;
    $scope.mainbanner = 'default.png';

    $scope.mapfullnotload = true;
    $scope.mapcommonfunc = function(){
        $scope.zoomlevel = 9;

        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getCurLocation',
            data    : $.param({'userid':$scope.userId,'sessuser':$scope.sessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {


            $scope.markerIndex = 0;
            $scope.allmarker = result.marker;
            $scope.slicemarker = $scope.allmarker.slice($scope.markerIndex, 10);

            //$scope.refreshMap = true;


            console.log($scope.slicemarker.length);

            $timeout(function(){
                $scope.markerpush();
            },10000);

            $scope.profilemap = {
                dragZoom: {options: {}},
                control:{},
                center: {
                    latitude: result.latitude,
                    longitude: result.longitude
                },
                options : {
                    scrollwheel : false,
                },
                pan: true,
                zoom: $scope.zoomlevel,
                refresh: true,
                events: {

                    idle: function (profilemap) {

                        $timeout(function() {


                            $interval(function(){

                                var visibleMarkers = [];

                                if(typeof($scope.profilemap.bounds.southwest) != 'undefined' && typeof($scope.profilemap.bounds.northeast) != 'undefined'){
                                    angular.forEach(result.marker, function(marker, key) {
                                        if ($scope.profilemap.bounds.southwest.latitude < marker.latitude
                                            && marker.latitude < $scope.profilemap.bounds.northeast.latitude
                                            && $scope.profilemap.bounds.southwest.longitude < marker.longitude
                                            && marker.longitude < $scope.profilemap.bounds.northeast.longitude) {

                                            visibleMarkers.push(marker);
                                        }
                                    });

                                    $scope.visibleMarkers = visibleMarkers;

                                    if($scope.visibleMarkers.length < 5){
                                        $scope.zoomlevel = parseInt($scope.zoomlevel)-1;


                                        $scope.profilemap.zoom = parseFloat(parseInt($scope.zoomlevel)-1);
                                        // console.log($rootScope.map.zoom);
                                    }
                                }


                            },3000);





                        }, 0);

                    }


                },
                bounds:{},
                markers: $scope.slicemarker,
                openedCanadaWindows:{},
                onWindowCloseClick: function(gMarker, eventName, model){
                    if(model.dowShow !== null && model.dowShow !== undefined)
                        return model.doShow = false;

                },
                markerEvents: {
                    click:function(gMarker, eventName, model){
                        angular.element( document.querySelector( '#infoWin' ) ).html(model.infoHtml);
                        model.doShow = true;
                        $scope.profilemap.openedCanadaWindows = model;
                    }
                }


            };


            $scope.profilemap.markers.forEach(function(model){
                model.closeClick = function(){
                    model.doShow = false;
                };
            });

            $scope.mapfullnotload = false;



        }).error(function (result) {
            $scope.mapcommonfunc();
        });

    }
    var promise;
    $scope.markerpush = function(){


            var i;
            for(i=$scope.markerIndex; i<($scope.markerIndex+10);i++){
                if(typeof ($scope.allmarker[i]) != 'undefined')
                    $scope.slicemarker.push($scope.allmarker[i]);
            }

            $scope.markerIndex += 10;
            console.log($scope.slicemarker.length);
            if($scope.slicemarker.length < $scope.allmarker.length){
                promise = $timeout(function(){
                    $scope.markerpush();
                },5000);
            }else{
                console.log('marker load complete');
            }

    }

    $scope.$on('$locationChangeStart', function(){
        $timeout.cancel(promise);
    });

$scope.bannerload = function(){

    $scope.getban111();
    $scope.getban222();
    $scope.getban333();

}


    $scope.getban111 = function(){
        $scope.pageId = 0;
        $scope.spId = 0;
        $scope.pageId = 3;
        $scope.bannerslides1 = [];

        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getBanner',
            data    : $.param({'pageid':$scope.pageId,'areaid':1,'sp_id':$scope.spId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.bannerslides11 = result;

            $timeout(function(){
                $scope.setbannerheight55();

            },2000);
        }).error(function (result) {
            $scope.getban111();
        });

    }

    $scope.getban222 = function(){
        $scope.pageId = 0;
        $scope.spId = 0;
        $scope.pageId = 3;
        $scope.bannerslides2 = [];
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getBanner',
            data    : $.param({'pageid':$scope.pageId,'areaid':2,'sp_id':$scope.spId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.bannerslides2 = result;

            $timeout(function(){
                $scope.setbannerheight55();
                $scope.setbannerdim221();
            },2000);

        }).error(function (result) {
            $scope.getban222();
        });

    }

    $scope.getban333 = function(){
        $scope.pageId = 0;
        $scope.spId = 0;
        $scope.pageId = 3;
        $scope.bannerslides3 = [];

        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getBanner',
            data    : $.param({'pageid':$scope.pageId,'areaid':3,'sp_id':$scope.spId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.bannerslides3 = result;

            $timeout(function(){
                $scope.setbannerheight55();
                $scope.setbannerdim221();
            },2000);

        }).error(function (result) {
            $scope.getban333();
        });

    }

    var deferred;
    var dArr = [];
    var imgpaths = [];
    $scope.hideall = true;

    $scope.getUserDetailsnew1 =function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/getUserDetailsnew1',
            data    : $.param({'userid':$scope.userId,sessUser:$scope.sessUser}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(result) {
            $scope.userDet5 = result;
            console.log($scope.userDet5);

            if($scope.sessUser > 0){
                $cookieStore.put('user_is_admin',result.is_admin);
                $rootScope.user_is_admin = result.is_admin;
            }

        }).error(function (result) {
            $scope.getUserDetailsnew1();
        });
    }

    $scope.getUserDetails =function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/getUserDetails',
            data    : $.param({'userid':$scope.userId,sessUser:$scope.sessUser}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(result) {
            $scope.userDet = result;
            console.log($scope.userDet);


            deferred = $q.defer();
            imgpaths.push({
                path: $scope.baseUrl+'/user/ajs1/createimage?image='+$scope.userDet.profileImg+'&version='+$scope.ctime222,
                callback: deferred.resolve
            });
            dArr.push(deferred.promise);
            deferred = $q.defer();
            imgpaths.push({
                //  path: $scope.baseUrl+'/user/ajs1/createimage?image='+$scope.userDet.backImg+'&version='+$scope.ctime222,
                path: $scope.userDet.backImg+'?version='+$scope.ctime222,
                callback: deferred.resolve
            });
            dArr.push(deferred.promise);

            $scope.userDetImage = imgpaths;

            if($scope.sessUser > 0){
                $cookieStore.put('user_is_admin',result.is_admin);
                $rootScope.user_is_admin = result.is_admin;
            }


            var sportsName1 = '';
            var sportsName2 = '';
            var sportsName3 = '';
            if (typeof $scope.userDet.user_sports[0] != 'undefined') {
                sportsName1 = $scope.userDet.user_sports[0].sport_name;
            }
            if (typeof $scope.userDet.user_sports[1] != 'undefined') {
                sportsName2 = $scope.userDet.user_sports[1].sport_name;
            }
            if (typeof $scope.userDet.user_sports[2] != 'undefined') {
                sportsName3 = $scope.userDet.user_sports[2].sport_name;
            }
            var user_str = $scope.userDet.fname+', '+$scope.userDet.lname+', '+sportsName1+', '+$scope.userDet.city+', '+$scope.userDet.state_name+', '+sportsName2+', '+sportsName3;


            $rootScope.metaservice = MetaService;
            $rootScope.metaservice.set(user_str);

            //  $scope.mapcommonfunc();
            $timeout(function(){
                $scope.setbannerheight55();
            },5000);

        }).error(function (result) {
            $scope.getUserDetails();
        });
    }

    $q.all(dArr).then(function() {
        $scope.hideall = false;
        console.log('all loaded');
    });

    $scope.getFriendDet1 = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getFriendDet1',
            data    : $.param({'userid':$scope.userId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.frnddet = result.frnddet;
        }).error(function (result) {
            $scope.getFriendDet1();
        });
    }

    $scope.getunFriendDet1 = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getunFriendDet1',
            data    : $.param({'userid':$scope.userId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.unfrnddet = result;
        }).error(function (result) {
            $scope.getunFriendDet1();
        });
    }

    $scope.getstatdetails = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getstatdetails',
            data    : $.param({'userid':$scope.userId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.statDet = result;
        }).error(function (result) {
            $scope.getstatdetails();
        });
    }

    $scope.blockpeople = function(){
        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/blockpeople',
            data    : $.param({uid : $scope.userId,cuser:$scope.sessUser}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(result) {
            $rootScope.stateIsLoading = false;

            $state.go('profile',{userId:$scope.sessUser});
            return;

        }).error(function (result) {
            $scope.blockpeople();
        });
    }

    $scope.removeFriend = function(id){
        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/cancelreq',
            data    : $.param({id : id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(result) {
            $rootScope.stateIsLoading = false;

            $scope.userDet.friendship_id = 0;
            $scope.userDet.friendship_type = 0;

        }).error(function (result) {
            $scope.removeFriend(id);
        });
    }

    $scope.acceptreq55 = function(id){
        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/acceptreq',
            data    : $.param({id : id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(result) {
            $rootScope.stateIsLoading = false;
            $scope.userDet.friendship_type = 4;

        }).error(function (result) {
            $scope.acceptreq55(id);
        });
    }

    $scope.addFriend55 = function(){
        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/addconn',
            data    : $.param({'frnd_id':$scope.userId,userid:$scope.sessUser}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(result) {
            $rootScope.stateIsLoading = false;

            $scope.userDet.friendship_id = result;
            $scope.userDet.friendship_type = 1;

        }).error(function (result) {
            $scope.addFriend55();
        });
    }

    $scope.getMainTv = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getMainTv',
        }).success(function (result) {
            $rootScope.maintv = result;
            $rootScope.maintvfile = $sce.trustAsResourceUrl($scope.baseUrl+'/uploads/video/converted/'+$rootScope.maintv.file);
            $rootScope.vidsources = [{src: $sce.trustAsResourceUrl($scope.baseUrl+'/uploads/video/converted/'+$rootScope.maintv.file), type: "video/mp4"}];

            setTimeout(function(){
                angular.element( document.querySelector( '#maintvDiv' ) ).html('<video id="maintvVideo" volume="0" width="100%" autoplay loop muted controls>\
            <source src="'+$rootScope.maintvfile+'" type="video/mp4">\
            </video>');
            },2000);

        }).error(function (result) {
            $scope.getMainTv();
        });
    }

    $scope.getlast3post = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getlast3post',
        }).success(function (result) {
            $rootScope.forumList = result;
        }).error(function (result) {
            $scope.getlast3post();
        });
    }

    $scope.getMainBanner = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getMainBanner',
        }).success(function (result) {
            $rootScope.mainbanner = result;
        }).error(function (result) {
            $scope.getMainBanner();
        });
    }


    $scope.addFriend = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.unfrnddet.indexOf(item);
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/addconn',
            data    : $.param({'frnd_id':$scope.unfrnddet[idx].id,userid:$scope.sessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.stateIsLoading = false;
            $scope.unfrnddet[idx].frndship_type=1;
            $scope.unfrnddet[idx].frndship_id=result;
        });
    }
    $scope.cancel_request = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.unfrnddet.indexOf(item);
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/cancelreq',
            data    : $.param({'id':$scope.unfrnddet[idx].frndship_id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.stateIsLoading = false;
            $scope.unfrnddet[idx].frndship_id = 0;
            $scope.unfrnddet[idx].frndship_type = 0;
        });
    }


    $scope.isStatusInput = 0;
    $scope.isRotateBtn = 0;
    $scope.photoval = '';
    $scope.videoval1 = '';
    $scope.videoval2 = '';
    $scope.isPhoto = 0;
    $scope.isVideo = 0;
    $scope.statusType = '';
    $scope.statusValue = '';
    $scope.statusText = '';
    $scope.shareVal = 1;
    $scope.group = 0;
    $scope.share_with = 1;
    $scope.tagpeople = [];

    $scope.openStatusInput = function(){
        $scope.isStatusInput = 1;
    }

    $scope.chnagestatusval = function(event){
        $scope.statusText = event.currentTarget.value;
    }

    $scope.addPhoto = function(){
        $scope.videoval1 = '';
        $scope.photoval = '';
        $scope.videoval2 = '';
        $scope.isVideo = 0;
        $scope.isPhoto = 1;
        $scope.isStatusInput = 0;
        $scope.tagpeople = [];
    }

    $scope.addVideo = function(){
        $scope.videoval1 = '';
        $scope.photoval = '';
        $scope.videoval2 = '';
        $scope.isPhoto = 0;
        $scope.isVideo = 1;
        $scope.isStatusInput = 0;
        $scope.tagpeople = [];
    }

    $scope.cancelStatus = function(){
        $scope.isStatusInput = 0;
        $scope.isRotateBtn = 0;
        $scope.photoval = '';
        $scope.videoval1 = '';
        $scope.videoval2 = '';
        $scope.isPhoto = 0;
        $scope.isVideo = 0;
        $scope.statusType = '';
        $scope.statusValue = '';
        $scope.statusText = '';
        $scope.shareVal = 1;
        $scope.group = 0;
        $scope.tagpeople = [];

        angular.element( document.querySelector( '#extracted_url' )).html('');

        angular.element( document.querySelector( '#statusText' ) ).val('');
        angular.element( document.querySelector( '.highlightTextarea-highlighter' ) ).html('');
        angular.element( document.querySelector( '#extracted_url' )).html('');
        angular.element( document.querySelector( '#statusText' )).css('height','52px');
        angular.element( document.querySelector( '#text-box' )).css('height','52px');

        $scope.statusText1 = '';


    }

    $scope.postStatus = function(){

        if($scope.statusText || $scope.statusValue){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/statusUpdate',
                data    : $.param({'msg':$scope.statusText,'msg1':$scope.statusText1,'share_with':$scope.share_with,'group_id':$scope.group,'type':$scope.statusType,'value':$scope.statusValue,'is_status':1,'status_id':$scope.status_id,'user_id':$scope.sessUser,tagpeople:$scope.tagpeople}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.isStatusInput = 0;
                $scope.isRotateBtn = 0;
                $scope.photoval = '';
                $scope.videoval1 = '';
                $scope.videoval2 = '';
                $scope.isPhoto = 0;
                $scope.isVideo = 0;
                $scope.statusType = '';
                $scope.statusValue = '';
                $scope.statusText = '';
                $scope.shareVal = 1;
                $scope.group = 0;
                $scope.status_id = 0;

                $scope.localfilepath = '';
                $scope.videoTempval = '';
                $scope.videoval3 = 0;
                $scope.tagpeople = [];


                $scope.statusList.splice(0, 0, result);
                $scope.offset = $scope.offset+1;

                angular.element( document.querySelector( '#statusText' ) ).val('');
                angular.element( document.querySelector( '.highlightTextarea-highlighter' ) ).html('');
                angular.element( document.querySelector( '#extracted_url' )).html('');
                angular.element( document.querySelector( '#statusText' )).css('height','52px');
                angular.element( document.querySelector( '#text-box' )).css('height','52px');

                $scope.statusText1 = '';

                setTimeout(function(){
                    $('.extracted_url2').css('cursor','pointer');
                    $('.extracted_url2').on('click',function(){
                        var targeturl = $(this).find('a').attr('href');
                        window.open(targeturl);
                    })
                },2000);


                $timeout(function(){
                    $('html, body').animate({ scrollTop:  $('#tabs').offset().top  }, 1000);
                },1000);

            });
        /*}else{

            $scope.Commentmsg = ngDialog.open({
                template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Please Enter Comment.</div>',
                plain:true,
                showClose:false,
                closeByDocument: true,
                closeByEscape: true
            });

            $timeout(function(){
                $scope.Commentmsg.close();
            },3000);*/
        }
    }

    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
        '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    $scope.$watch('statusImage', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload(file);
                })(files[i]);
            }
        }
    });

    function upload(file) {
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {
        file.upload = Upload.upload({
            url: $scope.baseUrl+'/user/ajs1/statusImgUp' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {username: $scope.username},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            $('.progress').addClass('ng-hide');
            file.result = response.data;

            var ctime = (new Date).getTime();


            $scope.isStatusInput = 0;
            $scope.isRotateBtn = 0;
            $scope.photoval = '';
            $scope.videoval1 = '';
            $scope.videoval2 = '';
            $scope.isPhoto = 0;
            $scope.isVideo = 0;
            $scope.statusType = '';
            $scope.statusValue = '';
            $scope.shareVal = 1;




            $scope.isPhoto = 0;
            $scope.photoval = 'images/fileloader.gif';
            $scope.statusType = 'image';

            $scope.isStatusInput = 1;
            $scope.isRotateBtn = 1;


            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs1/statusimgresize',
                data    : $.param({'filename':response.data}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function(data) {
                $scope.photoval = response.data;
                $scope.statusValue = response.data;
            });

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            if(file.progress <100){
                file.progresstext = file.progress + '%';
            }else{
                file.progresstext = '99%';
            }

        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }

    $scope.$watch('statusVideo', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload1(file);
                })(files[i]);
            }
        }
    });

    function upload1(file) {
        $scope.errorMsg = null;
        uploadUsingUpload1(file);
    }

    function uploadUsingUpload1(file) {
        file.upload = Upload.upload({
            url: $scope.baseUrl+'/user/ajs1/statusVidUp' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {username: $scope.username},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            file.result = response.data;
            $('.progress').addClass('ng-hide');

            var ctime = (new Date).getTime();

            $scope.isStatusInput = 0;
            $scope.isRotateBtn = 0;
            $scope.photoval = '';
            $scope.videoval1 = '';
            $scope.videoval2 = '';
            $scope.isPhoto = 0;
            $scope.isVideo = 0;
            $scope.statusType = '';
            $scope.statusValue = '';
            $scope.shareVal = 1;


            $scope.videoval1 = '';
            $scope.photoval = '';
            $scope.videoval2 = 'images/fileloader.gif';
            $scope.isPhoto = 0;
            $scope.isVideo = 0;

            $scope.isPhoto = 0;
            $scope.statusType = 'video';
            $scope.statusValue = '';
            $scope.isStatusInput = 1;


            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs1/videoprocess',
                data    : $.param({'file_name':response.data}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function(res2) {
                $scope.videoval2 = res2;
                $scope.statusValue = res2;

            });


        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            if(file.progress <100){
                file.progresstext = file.progress + '%';
            }else{
                file.progresstext = '99%';
            }
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }

    $scope.youtubeSearch = function(){
        if($scope.youtubeTxt == ''){

            $scope.Commentmsg = ngDialog.open({
                template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Please enter search key.</div>',
                plain:true,
                showClose:false,
                closeByDocument: true,
                closeByEscape: true
            });

            $timeout(function(){
                $scope.Commentmsg.close();
            },3000);

        }else{
            var dataurl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q='+$scope.youtubeTxt+'&maxResults=10&key=AIzaSyANefU-R8cD3udZvBqbDPqst7jMKvB_Hvo';
            $scope.youtubeTxt = '';

            $http.get(dataurl).success(function(data){
                $scope.vids = [];

                angular.forEach(data.items, function(value, key){
                    if(typeof (value.id.videoId) != 'undefined'){
                        $scope.vids.push(value);
                    }
                });

                $scope.ytdialog = ngDialog.open({
                    template: 'youtubeVideo',
                    showClose:false,
                    closeByDocument: true,
                    closeByEscape: true,
                    className : 'youtubePopup',
                    scope: $scope
                });
            });

        }
    }

    $scope.addYtVideo = function(item){


        $scope.isStatusInput = 0;
        $scope.isRotateBtn = 0;
        $scope.photoval = '';
        $scope.videoval1 = '';
        $scope.videoval2 = '';
        $scope.isPhoto = 0;
        $scope.isVideo = 0;
        $scope.statusType = '';
        $scope.statusValue = '';
        $scope.shareVal = 1;


        $scope.videoval1 = item.id.videoId;
        $scope.photoval = '';
        $scope.videoval2 = '';
        $scope.isPhoto = 0;
        $scope.isVideo = 0;

        $scope.isPhoto = 0;
        $scope.statusType = 'video';
        $scope.statusValue = item.id.videoId;
        $scope.isStatusInput = 1;

        $scope.ytdialog.close();
    }

    $scope.imgRotate = function(type){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/rotateleft',
            data    : $.param({'imgname':$scope.statusValue,'arg':type}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.photoval = result;
        });
    }

    $scope.gotoProfile = function(user_id){
        $state.go('profile',{userId:user_id});
        return;
    }

    $scope.gotofrndList = function(){
        $state.go('friendlist',{userId:$scope.userId});
        return;
    }

    $scope.gotoconnList = function(){
        $state.go('connection',{userId:$scope.userId});
        return;
    }

    $scope.alluserList55555 = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/alluserList55555',
            data    : $.param({sess_id: $scope.sessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.taguserList = result;
        }).error(function (result) {
            $scope.alluserList55555();
        });
    }

    $scope.loadUsers = function($query) {
        var sports = $scope.taguserList;
        return sports.filter(function(sport) {
            return sport.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
        });

    };

});

homeControllers1.controller('friendlist', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout) {
    $scope.isConnection = 1;
    if($state.current.name == 'friendlist')
        $scope.isConnection = 0;
    $scope.sessUser = 0;
    $scope.userId = $stateParams.userId;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.sessUser = $scope.userDet.id;
    }

    $scope.tabBodyLoad = true;

    $scope.user_image = $scope.baseUrl+"/uploads/user_image/thumb/default.jpg";
    $scope.frnddet = [];

    $scope.sportsList = [];

    $timeout(function(){
        $scope.getAllSports();
        $scope.getCountryList();
    },500);

    $scope.getAllSports = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/allsports',
        }).success(function (result5) {
            $scope.sportsList = result5;
        }).error(function (result) {
            $scope.getAllSports();
        });
    }

    $scope.getCountryList = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getCountryList',
        }).success(function (result) {
            $scope.countrylist = result;
        }).error(function (result) {
            $scope.getCountryList();
        });
    }

    $scope.getStateList = function(event){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getStateList',
            data    : $.param({'id':event}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (result) {
            $scope.statelist = result;
        }).error(function (result) {
            $scope.getStateList(event);
        });
    }

    $scope.statelist = [];

    $scope.changeCountry = function(event){

        $scope.statelist = [];
        $scope.searchText.user_state = '';

        if(typeof (event) != 'undefined'){
            $scope.statelist = [];
            $scope.getStateList(event);
        }

    }

    $scope.getFriendDet11 = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getFriendDet11',
            data    : $.param({'userid':$stateParams.userId,sessId:$scope.sessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.tabBodyLoad = false;
            $scope.user_image = result.user_image;
            $scope.frnddet = result.frnddet;
            $scope.frnddet1 = result.frnddet;
        }).error(function (result) {
            $scope.getFriendDet11();
        });
    }

    $scope.getFriendDet21 = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getFriendDet21',
            data    : $.param({'userid':$stateParams.userId,sessId:$scope.sessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.tabBodyLoad = false;
            $scope.user_image = result.user_image;
            $scope.frnddet = result.frnddet;
            $scope.frnddet1 = result.frnddet;
        }).error(function (result) {
            $scope.getFriendDet21();
        });
    }

    if($state.current.name == 'friendlist'){
        $scope.getFriendDet11();
    }else{
        $scope.getFriendDet21();
    }

    $scope.tooltipVal = function(item){
        var fsgs ='<h2>'+item.user_name+'</h2><p>'+item.user_address+'</p>';
        return  fsgs;
    }

    $scope.cancel_request = function(id,index){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/cancelreq',
            data    : $.param({'id':id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.frnddet.splice(index,1);
        });
    }

    $scope.cancel_request1 = function(id,index){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/cancelreq',
            data    : $.param({'id':id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.frnddet[index].frnd_type=0;
        });
    }

    $scope.add_friend = function(id,index){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/addconn',
            data    : $.param({'frnd_id':id,userid:$scope.sessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.frnddet[index].frnd_type=1;
        });
    }

    $scope.accept_request = function(id,index){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/acceptreq',
            data    : $.param({'id':id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.frnddet[index].frnd_type=4;
        });
    }



    $scope.loadSports = function($query) {
        var sports = $scope.sportList;
        return sports.filter(function(sport) {
            return sport.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
        });
    };

    $scope.search_user_sports = [];

    $scope.sp_tag_add = function(id){

        var idx = $scope.search_user_sports.indexOf(id);
        if (idx === -1) {
            $scope.search_user_sports.push(id);
        }else{
            $scope.search_user_sports.splice(idx,1);
        }


        var tor_user = $scope.frnddet1;
        var sel_user = [];

        console.log($scope.search_user_sports);

        if($scope.search_user_sports.length > 0){
            angular.forEach(tor_user,function(value,key){
                angular.forEach($scope.search_user_sports,function(value1,key1){
                    if ( (value.spList.indexOf(value1) != -1 && sel_user.indexOf(value) == -1) ){
                        sel_user.push(value);
                        return false;
                    }
                });
            });
            $scope.frnddet = sel_user;
        }else{
            $scope.frnddet = $scope.frnddet1;
        }


    }

    $scope.resetsearch = function(){
        $scope.statelist = [];
        $scope.search_user_sports = [];

        $scope.searchText = {
            user_name: '',
            user_country: '',
            user_state: ''
        }

        $(".sportscheck").prop('checked', false);

        $scope.frnddet = $scope.frnddet1;
    }

});

homeControllers1.controller('album', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout) {
    $scope.sessUser = 0;
    $scope.userId = $stateParams.userId;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.sessUser = $scope.userDet.id;
        $rootScope.rootsessUser = $scope.userDet.id;
    }

    $scope.photoWindowWidth = $(window).width();

    $timeout(function(){
        $scope.getUserDet();
        $scope.getImage();
        $scope.getVideo();
    },500);

    $scope.getUserDet = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getUserDet',
            data    : $.param({'userid':$scope.userId }),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.user_image = result.userdet.user_image;
        }).error(function (result) {
            $scope.getUserDet();
        });
    }


    $scope.photoTabs = [{
        title: 'photo',
        url: 'photo.tpl.html'
    }, {
        title: 'video',
        url: 'video.tpl.html'
    }];

    $scope.currentphotoTab = 'photo.tpl.html';

    $scope.onClickphotoTab = function (tab) {
        $scope.currentphotoTab = tab.url;
    }

    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentphotoTab;
    }

    $rootScope.photoList = [];
    $rootScope.videoList = [];

    $scope.photoLimit = 0;
    $scope.videoLimit = 0;

    $scope.getImage = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getImage',
            data    : $.param({'userid':$scope.userId,sess_id:$scope.sessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.photoList = result;

            $scope.photoLimit = 10;
            $scope.photoloading = true;
            $timeout(function(){
                $scope.photoloading = false;
                $scope.photolimitinc();
            },10000);

        }).error(function (result) {
            $scope.getImage();
        });
    }



    $scope.photolimitinc = function(){
        $scope.photoloading = true;
        if($rootScope.photoList.length > $scope.photoLimit){
            $scope.photoLimit = $scope.photoLimit+10;

            $timeout(function(){
                $scope.photoloading = false;
                $scope.photolimitinc();
            },10000);
        }else{
            $scope.photoloading = false;
        }
    }

    $scope.getVideo = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getVideo',
            data    : $.param({'userid':$scope.userId,sess_id:$scope.sessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.videoList = result;

            $scope.videoLimit = 10;
            $scope.videoloading = true;
            $timeout(function(){
                $scope.videoloading = false;
                $scope.videolimitinc();
            },10000);
        }).error(function (result) {
            $scope.getVideo();
        });
    }



    $scope.videolimitinc = function(){
        $scope.videoloading = true;
        if($rootScope.videoList.length > $scope.videoLimit){
            $scope.videoLimit = $scope.videoLimit+10;

            $timeout(function(){
                $scope.videoloading = false;
                $scope.videolimitinc();
            },10000);
        }else{
            $scope.videoloading = false;
        }
    }

   $scope.tetshigh = function(event){
        var strss = event.currentTarget.value;
        var re = /(?:^|\W)#(\w+)(?!\w)/g, match, matches ;
        while (match = re.exec(strss)) {
            var hastag = '#'+match[1];
            $('.highlightTextarea-highlighter').html($('.highlightTextarea-highlighter').html().replace(hastag,'<span style="color:#fff;background-color:#F7931D; z-index: 9; position: relative;">'+hastag+'</span>'));
        }
    }


    $scope.photoval="";
    $scope.videoval1="";
    $scope.videoval2="";
    $scope.type="";
    $scope.statusValue = "";
    $scope.isStatusInput=0;
    $scope.isRotateBtn=0;
    $scope.share_with = 1;



    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
        '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    $scope.$watch('image', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload(file);
                })(files[i]);
            }
        }
    });

    function upload(file) {
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {

        file.upload = Upload.upload({
            url: $scope.baseUrl+'/user/ajs1/Uploadify_process_com' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {username: $scope.username},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            file.result = response.data;
            var ctime = (new Date).getTime();

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs1/Resizeimage_com',
                data    : $.param({'filename':response.data}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function() {
                $('.progress').addClass('ng-hide');
                $scope.photoval=response.data;
                $scope.statusValue = response.data;
                $scope.isStatusInput=1;
                $scope.isRotateBtn=1;
                $scope.type="image";

                setTimeout(function(){
                    $('textarea').highlightTextarea({
                        words:[]
                    });
                },3000);
            });

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            if(file.progress <100){
                file.progresstext = file.progress + '%';
            }else{
                file.progresstext = '99%';
            }

        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }

    $scope.$watch('statusVideo', function (files) {

        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload1(file);
                })(files[i]);
            }
        }
    });

    function upload1(file) {
        $scope.errorMsg = null;
        uploadUsingUpload1(file);
    }

    function uploadUsingUpload1(file) {
        file.upload = Upload.upload({
            url: $scope.baseUrl+'/user/ajs1/statusVidUp' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {username: $scope.username},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            file.result = response.data;
            $('.progress').addClass('ng-hide');

            var ctime = (new Date).getTime();

            $scope.isStatusInput=1;
            $scope.type="video";
            $scope.videoval2 = 'images/fileloader.gif';
            setTimeout(function(){
                $('textarea').highlightTextarea({
                    words:[]
                });
            },3000);

            $scope.upVidDiv1.close();

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs1/videoprocess',
                data    : $.param({'file_name':response.data}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function(res2) {
                $scope.videoval2 = res2;
                $scope.statusValue = res2;
            });


        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            if(file.progress <100){
                file.progresstext = file.progress + '%';
            }else{
                file.progresstext = '99%';
            }
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }

    $scope.imgRotate = function(type){
        $scope.photovaloading = true;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/rotateleft1',
            data    : $.param({'imgname':$scope.statusValue,'arg':type}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.photovaloading = false;
            $scope.photoval = result;
        });
    }

    $scope.cancelStatus = function(){
        $scope.photoval="";
        $scope.videoval1="";
        $scope.videoval2="";
        $scope.type="";
        $scope.statusValue = "";
        $scope.isStatusInput=0;
        $scope.isRotateBtn=0;
        $scope.share_with = 1;
    }

    $scope.postStatus = function(){
        if(typeof($scope.statusText) == 'undefined'){
            $scope.statusText = '';
        }

        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/addAlbum',
            data    : $.param({'type':$scope.type,'value':$scope.statusValue,'msg':$scope.statusText,user_id:$scope.sessUser,share_with:$scope.share_with}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (data) {

            if($scope.type == 'image'){
                if($rootScope.photoList.length){
                    $rootScope.photoList.splice(0, 0, data);
                }else{
                    $rootScope.photoList = [data];
                }
            }

            if($scope.type == 'video'){
                if($rootScope.videoList.length){
                    $rootScope.videoList.splice(0, 0, data);
                }else{
                    $rootScope.videoList = [data];
                }
            }


            $scope.statusText = '';

            $scope.photoval="";
            $scope.videoval1="";
            $scope.videoval2="";
            $scope.type="";
            $scope.statusValue = "";
            $scope.isStatusInput=0;
            $scope.isRotateBtn=0;
            $scope.share_with = 1;


        });
    }

    $scope.videoUploadDivOpen = function(){
        $scope.upVidDiv1 = ngDialog.open({
            template: 'upVidDiv',
            showClose:false,
            closeByDocument: true,
            closeByEscape: true,
            scope: $scope,
            controller: ['$scope', function($scope) {
                $scope.$watch('video123', function (files) {
                    $scope.formUpload = false;
                    if (files != null) {
                        for (var i = 0; i < files.length; i++) {
                            $scope.errorMsg = null;
                            (function (file) {
                                upload1(file);
                            })(files[i]);
                        }
                    }
                });
            }]
        });
    }

    $scope.youtubeSearch = function(){
        if($('#youtubeTxt').val() == ''){

            $scope.Commentmsg = ngDialog.open({
                template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Please enter search key.</div>',
                plain:true,
                showClose:false,
                closeByDocument: true,
                closeByEscape: true
            });

            $timeout(function(){
                $scope.Commentmsg.close();
            },3000);

        }else{
            var dataurl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q='+$('#youtubeTxt').val()+'&maxResults=10&key=AIzaSyANefU-R8cD3udZvBqbDPqst7jMKvB_Hvo';
            $('#youtubeTxt').val('');

            $http.get(dataurl).success(function(data){
                $scope.vids = [];

                angular.forEach(data.items, function(value, key){
                    if(typeof (value.id.videoId) != 'undefined'){
                        $scope.vids.push(value);
                    }
                });

                $scope.ytdialog = ngDialog.open({
                    template: 'youtubeVideo',
                    showClose:false,
                    closeByDocument: true,
                    closeByEscape: true,
                    className : 'youtubePopup',
                    scope: $scope
                });

                $scope.upVidDiv1.close();

            });

        }
    }

    $scope.addYtVideo = function(item){

        $scope.videoval1=item.id.videoId;
        $scope.statusValue = item.id.videoId;
        $scope.isStatusInput=1;
        $scope.type="video";
        setTimeout(function(){
            $('textarea').highlightTextarea({
                words:[]
            });
        },3000);


        $scope.ytdialog.close();
    }

});

homeControllers1.controller('photo', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout) {
    $scope.sessUser = 0;
    $scope.userId = $stateParams.userId;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.sessUser = $scope.userDet.id;
        $rootScope.rootsessUser = $scope.userDet.id;
    }

    $scope.photoWindowWidth = $(window).width();

    $scope.photoLimit = 0;

    $timeout(function(){
        $scope.getAllImage();
    },500);

    $scope.getAllImage = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getAllImage',
            data    : $.param({'sessUser':$scope.sessUser}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (result) {
            $rootScope.photoList = result;

            $scope.photoLimit = 10;

            $scope.photoloading = true;
            $timeout(function(){
                $scope.photoloading = false;
                $scope.photolimitinc();
            },10000);

        }).error(function (result) {
            $scope.getAllImage();
        });
    }



    $scope.photolimitinc = function(){
        $scope.photoloading = true;
        if($rootScope.photoList.length > $scope.photoLimit){
            $scope.photoLimit = $scope.photoLimit+10;

            console.log('photoLimit :'+$scope.photoLimit);

            $timeout(function(){
                $scope.photoloading = false;
                $scope.photolimitinc();
            },10000);
        }else{
            $scope.photoloading = false;
        }
    }


});


homeControllers1.controller('video', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal) {
    $scope.sessUser = 0;
    $scope.userId = $stateParams.userId;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.sessUser = $scope.userDet.id;
        $rootScope.rootsessUser = $scope.userDet.id;
    }

    $scope.videoLimit = 0;

    $timeout(function(){
        $scope.getAllVideo();
    },500)

    $scope.getAllVideo = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getAllVideo',
            data    : $.param({'sess_id':$scope.sessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.videoList = result;

            $scope.videoLimit = 10;

            $scope.videoloading = true;
            $timeout(function(){
                $scope.videoloading = false;
                $scope.videolimitinc();
            },10000);


        }).error(function (result) {
            $scope.getAllVideo();
        });
    }



    $scope.videolimitinc = function(){
        $scope.videoloading = true;
        if($rootScope.videoList.length > $scope.videoLimit){
            $scope.videoLimit = $scope.videoLimit+10;

            console.log('videoLimit :'+$scope.videoLimit);

            $timeout(function(){
                $scope.videoloading = false;
                $scope.videolimitinc();
            },10000);
        }else{
            $scope.videoloading = false;
        }
    }


    $rootScope.videoDet = {
        index : 0,
        itemId : 0,
        pstval : '',
        imgSrc : '',
        userId : 0,
        userImage : $scope.baseUrl+"/uploads/user_image/thumb/default.jpg",
        userName : '',
        timeSpan : '',
        msg : '',
        commentNo : 0,
        likeNo : 0,
        likeStatus : 0,
        cUserId : 0,
        cUserImage : $scope.baseUrl+"/uploads/user_image/thumb/default.jpg",
        commentList : [],
        value : '',
        type : 'video',
        basepath : '',
        videoType : ''
    };

    var modalInstance;
    $scope.modalClose1 = function(){
        modalInstance.dismiss('cancel');
    }

    $rootScope.showVideo1 = function(item,index){
        $rootScope.videoDet.index = index;
        $rootScope.videoDet.itemId = item.id;
        $rootScope.videoDet.imgSrc = item.img_src;
        $rootScope.videoDet.userId = item.user_id;
        $rootScope.videoDet.userImage = item.user_image;
        $rootScope.videoDet.userName = item.user_name;
        $rootScope.videoDet.msg = item.msg;
        $rootScope.videoDet.timeSpan = item.timeSpan;
        $rootScope.videoDet.commentNo = item.commentNo;
        $rootScope.videoDet.likeNo = item.likeNo;
        $rootScope.videoDet.likeStatus = item.likeStatus;
        $rootScope.videoDet.cUserImage = item.cUserImage;
        $rootScope.videoDet.videoType = item.type;
        $rootScope.videoDet.cUserId = item.cUserId;
        $rootScope.videoDet.basepath = '';

        $rootScope.stateIsLoading = true;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getVideoComment',
            data    : $.param({'id':item.id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.stateIsLoading = false;
            $rootScope.videoDet.commentList = result;

            $rootScope.videoDet.value = item.value;


            $scope.animationsEnabled = true;
            modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'videoComment1',
                windowClass: 'photoPopup',
                scope : $scope

            });

        });
    }


    $scope.postComment1 = function(event,type){
        if(event.which === 13 && !event.shiftKey) {
            event.preventDefault();
            var commentval = event.currentTarget.value;
            if(commentval !='' && typeof(commentval)!= 'undefined'){
                $http({
                    method: 'POST',
                    async:   false,
                    url: $scope.baseUrl+'/user/ajs1/addvideocomment',
                    data    : $.param({'status_id':$rootScope.videoDet.itemId,'cmnt_body':commentval,'user_id':$rootScope.rootsessUser}),
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function (result) {
                        if($rootScope.videoDet.commentList.length){
                            $rootScope.videoDet.commentList.push(result);
                            $rootScope.videoDet.commentSliceList.push(result);
                        }else{
                            $rootScope.videoDet.commentList = [result];
                            $rootScope.videoDet.commentSliceList = [result];
                        }
                    $rootScope.videoDet.pstval = '';
                });
            /*}else{

                $scope.Commentmsg = ngDialog.open({
                    template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Please Enter Comment.</div>',
                    plain:true,
                    showClose:false,
                    closeByDocument: true,
                    closeByEscape: true
                });

                $timeout(function(){
                    $scope.Commentmsg.close();
                },3000);*/
            }
        }
    }


});

homeControllers1.controller('editprofile', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal) {

    $scope.userId = 0;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.userId = $scope.userDet.id;
    }else{
        $state.go('index');
        return
    }

    var ctime = new Date().getTime();

    $scope.dsfsdsdfsd =ctime;

    $scope.countrylist = [];
    $scope.statelist = [];

    $timeout(function(){
        $scope.getCountryList();
        $scope.getUserDetails();
        $scope.getallsports();
    },500);

    $scope.getCountryList = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getCountryList',
        }).success(function (result) {
            $scope.countrylist = result;
        }).error(function (result) {
            $scope.getCountryList();
        });
    }

    $scope.getStateList = function(country){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getStateList',
            data    : $.param({'id':country}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (result5) {
            $scope.statelist = result5;
        }).error(function (result) {
            $scope.getStateList(country);
        });
    }

    $scope.getUserDetails = function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/getUserDetails',
            data    : $.param({'userid':$scope.userId,sessUser:0}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(result) {

            $scope.form = {
                id:result.id,
                fname:result.fname,
                lname:result.lname,
                email:result.email,
                location:result.location,
                city:result.city,
                country:{id:result.country},
                state:{id:result.state},
                gender:result.gender,
            }

            $scope.privacy = result.privacy;

            $scope.userSports = result.user_sports;
            $scope.userSports1 = result.user_sports1;
            $scope.origprofileImg = result.profileOrigImgName;
            $scope.origcoverImg = result.OrigbackImgName+'?version='+ctime;
            $scope.profileImg = result.profileImg+'?version='+ctime;
            $scope.coverImg = result.backImg+'?version='+ctime;
            $scope.profileImgName = result.profileImgName;
            $scope.coverImgName = result.backImgName;

            $scope.getStateList(result.country);

        }).error(function (result) {
            $scope.getUserDetails();
        });

    }

    $scope.passwordValidator = function(password) {

        if(!password){return true;}

        if (password.length < 6) {
            return "Password must be at least " + 6 + " characters long";
        }

        return true;
    };

    $scope.changeCountry = function(countryval){
        if(typeof (countryval) != 'undefined'){
            $scope.statelist = [];

            $scope.getStateList(countryval.id);

        }else{
            $scope.statelist = [];
        }

    }

    $scope.getallsports = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/allsports',
        }).success(function (result) {
            $scope.sportsList = result;
        }).error(function (result) {
            $scope.getallsports();
        });
    }

    $scope.editProfile = function(){
        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/updateProfile',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $state.go('profile',{userId:$scope.userId});
            return;
        });
    }

    $scope.selsports = function(id,obj){

        var idx = $scope.userSports1.indexOf(id);
        if($scope.userSports1.indexOf(id) < 0){
            if($scope.userSports1.length){
                $scope.userSports1.push(id);
            }else{
                $scope.userSports1 = [id];
            }
        }else{
            $scope.userSports1.splice(idx,1);
        }

        $(obj).blur();

        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/addDelsports',
            data    : $.param({'userid':$scope.userId,'sportid':id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(result) {

        });
    }

    $scope.profileImgDel = function(type){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/profileImgDel',
            data    : $.param({'userid':$scope.userId,'type':type}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(result) {
            if(type == 1){
                $scope.profileImg = result.imgSrc;
                $scope.profileImgName = result.imgName;
            }

            if(type==2){
                $scope.coverImg = result.imgSrc;
                $scope.coverImgName = result.imgName;
            }
        });
    }

    $scope.showtermsploicy = function(id){

        var header = '';
        if(id=='policy')
            header = 'Privacy Policy';
        if(id=='terms')
            header = 'Terms And Condition';

        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/cms/admin/conditionmanager1/bringcondition',
            data    : $.param({'id':id}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            ngDialog.open({
                template: '<div><strong style="font-size: 16px; color:#C97413; font-weight: normal; text-align:center; display:block; font-weight:bold; text-transform:uppercase; font-size:22px;">'+header+'</strong></div>'+data,
                plain:true,
                showClose:true,
                closeByDocument: true,
                closeByEscape: true
            });
        });
    }

    $scope.$watch('files', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload(file);
                })(files[i]);
            }
        }
    });

    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
        '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    function upload(file) {
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {
        file.upload = Upload.upload({
            url: $scope.baseUrl+'/user/ajs1/profileImgUp' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {'user_id':$scope.userId},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            if(response.data.error == 0){

                file.result = response.data.msg;

                $scope.profileImgName = response.data.msg;

                var ctime = (new Date).getTime();

                $http({
                    method  : 'POST',
                    async:   false,
                    url     : $scope.baseUrl+'/user/ajs1/profileimgresize',
                    data    : $.param({'filename':response.data.msg,'height':156,'width':142,'foldername':'thumb','userid':$scope.userId}),  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function(data) {
                    $('.progress').addClass('ng-hide');
                    $scope.profileImg = $scope.baseUrl+'/uploads/user_image/thumb/'+response.data.msg+'?version='+ctime;
                    $scope.origprofileImg = response.data.msg+'?version='+ctime;

                    $scope.cropProfileImg();
                });
            }else{
                $('.progress').addClass('ng-hide');
                var modalInstance1;
                modalInstance1 = $modal.open({
                    animation: true,
                    template: '<div class="errorModal">'+response.data.msg+'</div>',
                    size: 'lg',
                    scope : $scope
                });

                $timeout(function(){
                    modalInstance1.dismiss('cancel');
                },5000);
            }

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));

            if(file.progress <100){
                file.progresstext = file.progress + '%';
            }else{
                file.progresstext = '99%';
            }
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }

    $scope.$watch('files1', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload1(file);
                })(files[i]);
            }
        }
    });

    function upload1(file) {
        $scope.errorMsg = null;
        uploadUsingUpload1(file);
    }

    function uploadUsingUpload1(file) {
        file.upload = Upload.upload({
            url: $scope.baseUrl+'/user/ajs1/profileBackImgUp' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {'user_id':$scope.userId},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            if(response.data.error == 0){
                file.result = response.data.msg;

                $scope.coverImgName = response.data.msg;

                var ctime = (new Date).getTime();

                $http({
                    method  : 'POST',
                    async:   false,
                    url     : $scope.baseUrl+'/user/ajs1/profileBackimgresize',
                    data    : $.param({'filename':response.data.msg,'height':536,'width':1175,'foldername':'thumb','userid':$scope.userId}),  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function(data) {
                    $('.progress').addClass('ng-hide');
                    $scope.coverImg = $scope.baseUrl+'/uploads/user_image/background/thumb/'+response.data.msg+'?version='+ctime;
                    $scope.origcoverImg = response.data.msg+'?version='+ctime;

                    $scope.cropProfileBackImg();
                });
            }else{
                $('.progress').addClass('ng-hide');
                var modalInstance1;
                modalInstance1 = $modal.open({
                    animation: true,
                    template: '<div class="errorModal">'+response.data.msg+'</div>',
                    size: 'lg',
                    scope : $scope
                });

                $timeout(function(){
                    modalInstance1.dismiss('cancel');
                },5000);
            }

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));

            if(file.progress <100){
                file.progresstext = file.progress + '%';
            }else{
                file.progresstext = '99%';
            }
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }

    var modalInstance;
    $scope.modalClose = function(){
        modalInstance.dismiss('cancel');
    }

    $scope.cropProfileImg = function(){
        $scope.pLoad = true;

        $scope.animationsEnabled = true;
        modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'mymodal',
            windowClass: 'mymodalimg',
            size: 'lg',
            scope : $scope
        });

        $timeout(function(){

            $('.image-editor').cropit({
                exportZoom:.5,
                imageBackground: true,
                imageBackgroundBorderWidth: 50,
                imageState: {
                    src: $scope.subUrl+'/uploads/user_image/'+$scope.origprofileImg,
                },
            });
            $scope.pLoad = false;
        },1000);
    }

    $scope.changepreview = function(){
        $scope.imagedata1 = $('.image-editor').cropit('export');
    }

    $scope.crop123 = function(){

        var imagedata = $('.image-editor').cropit('export');
        $scope.cropsaving = true;

        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/ImageSave',
            data    : $.param({'user_id':$scope.userId,'imagedata':imagedata}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function(data) {
            $scope.cropsaving = false;
            $scope.profileImg = data;
            modalInstance.dismiss('cancel');
        });
    }

    $scope.cropProfileBackImg = function(){
        $scope.pLoad = true;

        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/getimgsize',
            data    : $.param({'image':'/uploads/user_image/background/'+$scope.origcoverImg}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function(data22) {
            if(data22 == 0){

                var modalInstance1;
                modalInstance1 = $modal.open({
                    animation: true,
                    template: '<div class="errorModal">This Image Is Too Small To Crop! Please Upload Bigger Image 1175X536.</div>',
                    size: 'lg',
                    scope : $scope
                });

                $timeout(function(){
                    modalInstance1.dismiss('cancel');
                },5000);


            }else{
                $scope.animationsEnabled = true;
                modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'mymodal1',
                    windowClass: 'mymodalimg',
                    size: 'lg',
                    scope : $scope
                });

                $timeout(function(){

                    $('.image-editor1').cropit({
                        exportZoom:1.5,
                        imageBackground: true,
                        imageBackgroundBorderWidth: 30,
                        imageState: {
                            src: $scope.subUrl+'/uploads/user_image/background/'+$scope.origcoverImg,
                        },
                    });
                    $scope.pLoad = false;
                },5000);

            }
        });


    }

    $scope.changepreview1 = function(){
        $scope.imagedata2 = $('.image-editor1').cropit('export');
    }

    $scope.crop1 = function(){

        var imagedata = $('.image-editor1').cropit('export');
        $scope.cropsaving = true;

        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/ImageSave1',
            data    : $.param({'user_id':$scope.userId,'imagedata':imagedata}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function(data) {
            $scope.cropsaving = false;
            $scope.coverImg = data;
            modalInstance.dismiss('cancel');
        });
    }

    $scope.showprivacypopup = function(){
        $scope.animationsEnabled = true;
        modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'privacymodal',
            windowClass: 'privacymodalcls',
            size: 'lg',
            scope : $scope
        });
    }

    $scope.changeuserprivacy = function(pval){
        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/updateuserprivacy',
            data    : $.param({'user_id':$scope.userId,'privacy':pval}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function(data) {
            $rootScope.stateIsLoading = false;
            $scope.privacy = pval;
        });
    }


});

homeControllers1.controller('eventdetails1', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal,$filter) {
    $scope.evetId = $stateParams.eventId;
    $scope.evetDet = [];
    $scope.userId = 0;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.userId = $scope.userDet.id;
    }

    $timeout(function(){
        $scope.getEventDet();
    },500);

    $scope.getEventDet = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getEventDet',
            data    : $.param({'id':$stateParams.eventId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {

            var user_str = result.name+'-Torkq-'+result.sports_name+'-events-in-'+result.city+'-'+result.state+'-'+result.from_date1+'-find-incredible-'+result.sports_name+'-events-on-our-community-website!';
            //user_str = $filter('lowercase')(user_str);
            //user_str = encodeURI(user_str);
            user_str = user_str.replace(/\s+/g, '-');

            $state.go('eventdetails1',{eventId:$stateParams.eventId,eventStr:user_str});
            return;
        }).error(function (result) {
            $scope.getEventDet();
        });
    }

});

homeControllers1.controller('eventdetails', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal,MetaService) {
    $scope.evetId = $stateParams.eventId;
    $scope.evetDet = [];
    $scope.userId = 0;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.userId = $scope.userDet.id;
    }

    $timeout(function(){
        $scope.getEventDet();
    },500);

    $scope.getEventDet = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getEventDet',
            data    : $.param({'id':$stateParams.eventId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.evetDet = result;

            console.log($scope.evetDet);

            angular.element( document.querySelector( '#eImage' ) ).html($scope.evetDet.imageTag);

            $scope.map = {
                dragZoom: {options: {}},
                control:{},
                center: {
                    latitude: result.latitude,
                    longitude: result.longitude
                },
                pan: true,
                zoom: 12,
                refresh: false,
                events: {},
                bounds: {},
                markers: result.marker,
                openedCanadaWindows:{},
                onWindowCloseClick: function(gMarker, eventName, model){
                    if(model.dowShow !== null && model.dowShow !== undefined)
                        return model.doShow = false;

                },
                markerEvents: {
                    click:function(gMarker, eventName, model){
                        model.doShow = true;
                        $scope.map.openedCanadaWindows = model;
                    }
                }
            };

            console.log($scope.map);

            $scope.map.markers.forEach(function(model){
                model.closeClick = function(){
                    model.doShow = false;
                };
            });

            var user_str = result.name+','+result.sports_name+','+result.city+','+result.state+','+result.from_date1+','+result.sports_name;

            $rootScope.metaservice = MetaService;
            $rootScope.metaservice.set(user_str);

        }).error(function (result) {
            $scope.getEventDet();
        });
    }




});

homeControllers1.controller('addevent', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal) {
    $scope.userId = 0;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.userId = $scope.userDet.id;
    }

    $scope.heading = "Create Event";

    $scope.groupList = [];

    $timeout(function(){
        $scope.getgroupList();
        $scope.getCountryList();
        $scope.getallsports();
    },500);

    $scope.getgroupList = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getgroupList',
        }).success(function (result) {
            $scope.groupList = result;
        }).error(function (result) {
            $scope.getgroupList();
        });
    }

    $scope.countrylist = [];
    $scope.statelist = [];

    $scope.getCountryList = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getCountryList',
        }).success(function (result) {
            $scope.countrylist = result;
        }).error(function (result) {
            $scope.getCountryList();
        });
    }

    $scope.getStateList = function(countryval){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getStateList',
            data    : $.param({'id':countryval}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (result) {
            $scope.statelist = result;
        }).error(function (result) {
            $scope.getStateList(countryval);
        });
    }

    $scope.changeCountry = function(countryval){
        if(typeof (countryval) != 'undefined'){
            $scope.statelist = [];

            $scope.getStateList(countryval.id);

        }else{
            $scope.statelist = [];
        }

    }

    $scope.sportsList = [];

    $scope.getallsports = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/allsports',
        }).success(function (result) {
            $scope.sportsList = result;
        }).error(function (result) {
            $scope.getallsports();
        });
    }



    $scope.minDate = new Date();
    $scope.minDate1 = new Date();


    $scope.format = 'MM/dd/yyyy';

    $scope.setDate1 = function(){
        if(typeof($scope.form.to_date) != 'undefined'){
            $scope.maxDate = new Date($scope.form.to_date);
        }
    }

    $scope.setDate = function(){
        if(typeof($scope.form.from_date) != 'undefined'){
            $scope.minDate1 = new Date($scope.form.from_date);
        }
    }

    $scope.open11 = function() {
        $scope.opened1 = true;
    };

    $scope.open1 = function() {
        $scope.opened = true;
    };

    $scope.hstep = 1;
    $scope.mstep = 15;

    var d = new Date();
    d.setMinutes( 0 );

    $scope.form = {
        start_time: d,
        end_time: d,
        sports_id: 0,
        image: '',
        all_day:0,
        user_id :$scope.userId
    };

    $scope.$watch('files', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload(file);
                })(files[i]);
            }
        }
    });

    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
        '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    function upload(file) {
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {
        file.upload = Upload.upload({
            url: $scope.baseUrl+'/user/ajs1/eventUploadify_process' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {username: $scope.username},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            $scope.form.image = response.data;

            var ctime = (new Date).getTime();

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs1/eventesizeimage',
                data    : $.param({'filename':response.data}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function(data) {
                $('.progress').addClass('ng-hide');
                $scope.eventImage = $scope.baseUrl+'/uploads/event_image/thumb/'+response.data+'?version='+ctime;

                $scope.origeventImage = response.data+'?version='+ctime;

                $scope.imageBaseName = response.data.split('/').reverse()[0];

                $scope.cropEventImage();
            });

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            if(file.progress <100){
                file.progresstext = file.progress + '%';
            }else{
                file.progresstext = '99%';
            }
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }

    $scope.selsp = function(sid){
        //$('.activeimg').removeClass('activeimg');
    }

    var modalInstance;

    $scope.submiteventForm = function(){
        if($scope.form.sports_id == 0){
            ngDialog.open({
                template: '<div style="text-align:center;">Please Select A Sport</div>',
                plain:true,
                showClose:true,
                closeByDocument: false,
                closeByEscape: false
            });



        }else{
            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs1/addevent',
                data    : $.param($scope.form),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }) .success(function(data) {
                $scope.dialog = ngDialog.open({
                    template: '<div style="text-align:center;">Event Added Successfully</div>',
                    plain:true,
                    showClose:false,
                    closeByDocument: true,
                    closeByEscape: true
                });

                $timeout(function(){
                    $scope.dialog.close();

                    $state.go('profile',{userId:$scope.userId});
                    return

                },3000);
            });

        }
    }

    var modalInstance;
    $scope.modalClose = function(){
        modalInstance.dismiss('cancel');
    }

    $scope.cropEventImage = function(){
        $scope.pLoad = true;

        $scope.animationsEnabled = true;
        modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'mymodal',
            windowClass: 'mymodalimg',
            size: 'lg',
            scope : $scope
        });

        $timeout(function(){

            $('.image-editor').cropit({
                exportZoom:1,
                imageBackground: true,
                imageBackgroundBorderWidth: 50,
                imageState: {
                    src: $scope.subUrl+'/uploads/event_image/'+$scope.origeventImage,
                },
            });
            $scope.pLoad = false;
        },5000);
    }

    $scope.changepreview = function(){
        $scope.imagedata1 = $('.image-editor').cropit('export');
    }

    $scope.crop123 = function(){

        var imagedata = $('.image-editor').cropit('export');

        $scope.form.image = $scope.imageBaseName+'.png';
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/ImageSave3',
            data    : $.param({'filename':$scope.imageBaseName,'imagedata':imagedata}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function(data) {
            $scope.eventImage = data;
            modalInstance.dismiss('cancel');
        });
    }

});

homeControllers1.controller('editevent', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal) {
    $scope.evetId = $stateParams.eventId;
    $scope.evetDet = [];
    $scope.userId = 0;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.userId = $scope.userDet.id;
    }

    $scope.heading = "Edit Event";
    $scope.groupList = [];

    $timeout(function(){
        $scope.getgroupList();
        $scope.getallsports();
        $scope.getCountryList();
        $scope.getEventDet();
    },500);

    $scope.getgroupList = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getgroupList',
        }).success(function (result) {
            $scope.groupList = result;
        }).error(function (result) {
            $scope.getgroupList();
        });
    }

    $scope.sportsList = [];

    $scope.getallsports = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/allsports',
        }).success(function (result) {
            $scope.sportsList = result;
        }).error(function (result) {
            $scope.getallsports();
        });
    }

    $scope.countrylist = [];
    $scope.statelist = [];

    $scope.getCountryList = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getCountryList',
        }).success(function (result) {
            $scope.countrylist = result;
        }).error(function (result) {
            $scope.getCountryList();
        });
    }

    $scope.getStateList = function(countryval){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getStateList',
            data    : $.param({'id':countryval}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (result) {
            $scope.statelist = result;
        }).error(function (result) {
            $scope.getStateList(countryval);
        });
    }

    $scope.changeCountry = function(countryval){
        if(typeof (countryval) != 'undefined'){
            $scope.statelist = [];

            $scope.getStateList(countryval.id);

        }else{
            $scope.statelist = [];
        }

    }

    $scope.getEventDet = function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/getEventDet',
            data    : $.param({'id':$scope.evetId}),  // pass in data as strings  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            if(data.id){

                $scope.minDate1 = new Date(data.from_date);
                $scope.maxDate = new Date(data.to_date);

                var d = new Date();
                d.setMinutes( 0 );

                if(data.all_day == 1){
                    $scope.start_time5 = d;
                    $scope.end_time5 = d;
                }else{
                    $scope.start_time5 = new Date(data.start_time1);
                    $scope.end_time5 = new Date(data.end_time1);
                }


                $scope.form = {
                    id: data.id,
                    sports_id: data.sports_id,
                    image: data.image,
                    name: data.name,
                    description: data.description,
                    location: data.location,
                    address: data.address,
                    city: data.city,
                    zip: data.zip,
                    user_id :$scope.userId,
                    from_date: new Date(data.from_date),
                    to_date: new Date(data.to_date),
                    start_time: $scope.start_time5,
                    end_time: $scope.end_time5,
                    group_id:{
                        id: data.group_id
                    },
                    all_day: data.all_day,
                    checked: data.all_day_chk,
                    register_url: data.register_url,
                    country:{
                        id: data.country
                    },
                    state:{
                        id: $scope.stateid
                    },

                };
                if(data.image)
                    $scope.eventImage = $scope.baseUrl+'/uploads/event_image/thumb/'+data.image;

                $http({
                    method: 'POST',
                    async:   false,
                    url: $scope.baseUrl+'/user/ajs1/getStateList',
                    data    : $.param({'id':data.country}),  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function (result5) {
                    $scope.statelist = result5;
                    angular.forEach($scope.statelist, function(val, key) {
                        if(val['s_st_iso'].trim() == data.state || val['name'].trim() == data.state){
                            angular.extend($scope.form, {'state':{
                                id: val['id'],
                                name: val['name'],
                                s_st_iso: val['s_st_iso'],
                            }});
                        }
                    });
                });

            }else{
                $state.go('profile',{userId:$scope.userId});
                return
            }

        }).error(function (result) {
            $scope.getEventDet();
        });
    }

    $scope.minDate = new Date();

    $scope.format = 'MM/dd/yyyy';

    $scope.setDate1 = function(){
        if(typeof($scope.form.to_date) != 'undefined'){
            $scope.maxDate = new Date($scope.form.to_date);
        }
    }

    $scope.setDate = function(){
        if(typeof($scope.form.from_date) != 'undefined'){
            $scope.minDate1 = new Date($scope.form.from_date);
        }
    }

    $scope.open11 = function() {
        $scope.opened1 = true;
    };

    $scope.open1 = function() {
        $scope.opened = true;
    };

    $scope.hstep = 1;
    $scope.mstep = 15;

    $scope.submiteventForm = function() {
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/editevent',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $scope.dialog = ngDialog.open({
                template: '<div style="text-align:center;">Event Updated Successfully</div>',
                plain:true,
                showClose:false,
                closeByDocument: true,
                closeByEscape: true
            });

            $timeout(function(){
                $scope.dialog.close();

                $state.go('profile',{userId:$scope.userId});
                return

            },3000);
        });

    };

    $scope.$watch('files', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload(file);
                })(files[i]);
            }
        }
    });

    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
        '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    function upload(file) {
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {
        file.upload = Upload.upload({
            url: $scope.baseUrl+'/user/ajs1/eventUploadify_process' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {username: $scope.username},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            $scope.form.image = response.data;

            var ctime = (new Date).getTime();

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs1/eventesizeimage',
                data    : $.param({'filename':response.data}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function(data) {
                $('.progress').addClass('ng-hide');
                $scope.eventImage = $scope.baseUrl+'/uploads/event_image/thumb/'+response.data+'?version='+ctime;

                $scope.origeventImage = response.data+'?version='+ctime;

                $scope.imageBaseName = response.data.split('/').reverse()[0];

                $scope.cropEventImage();



            });

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            if(file.progress <100){
                file.progresstext = file.progress + '%';
            }else{
                file.progresstext = '99%';
            }
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }

    var modalInstance;
    $scope.modalClose = function(){
        modalInstance.dismiss('cancel');
    }

    $scope.cropEventImage = function(){
        $scope.pLoad = true;

        $scope.animationsEnabled = true;
        modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'mymodal',
            windowClass: 'mymodalimg',
            size: 'lg',
            scope : $scope
        });

        $timeout(function(){

            $('.image-editor').cropit({
                exportZoom:1,
                imageBackground: true,
                imageBackgroundBorderWidth: 50,
                imageState: {
                    src: $scope.subUrl+'/uploads/event_image/'+$scope.origeventImage,
                },
            });
            $scope.pLoad = false;
        },5000);
    }

    $scope.changepreview = function(){
        $scope.imagedata1 = $('.image-editor').cropit('export');
    }

    $scope.crop123 = function(){

        var imagedata = $('.image-editor').cropit('export');

        $scope.form.image = $scope.imageBaseName+'.png';
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/ImageSave3',
            data    : $.param({'filename':$scope.imageBaseName,'imagedata':imagedata}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function(data) {
            $scope.eventImage = data;
            modalInstance.dismiss('cancel');
        });
    }

});

homeControllers1.controller('routes', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal) {
    $scope.sessUser = 0;
    $scope.userId = $stateParams.userId;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.sessUser = $scope.userDet.id;
        $rootScope.rootsessUser = $scope.userDet.id;
    }

    $scope.viewMore = 0;
    $scope.viewMoreLoad = 0;
    $scope.offset = 0;

    $scope.map = {
        zoom: 13,
        lineStyle: {
            color: '#F7931E',
            weight: 4,
            opacity: 1
        }
    };

    $scope.user_image = $scope.baseUrl+"/uploads/user_image/thumb/default.jpg";

    $timeout(function(){
        $scope.getUserDet();
        $scope.getRoutes();
    },500);

    $scope.getUserDet =function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getUserDet',
            data    : $.param({'userid':$scope.userId }),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.user_image = result.userdet.user_image;
        }).error(function (result) {
            $scope.getUserDet();
        });
    }

    $rootScope.routeList = [];

    $scope.getRoutes = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getRoutes',
            data    : $.param({'userid':$scope.userId,'offset':0}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.routeList = result.routes;
            $scope.routeListCount = $scope.routeList.length;
            if(result.totalCount > $scope.routeList.length){
                $scope.viewMore = 1;
                $scope.offset = 5;
            }
        }).error(function (result) {
            $scope.getRoutes();
        });
    }

    $scope.viewMoreRoues = function(){
        $scope.viewMoreLoad = 1;
        $scope.viewMore = 0;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getRoutes',
            data    : $.param({'userid':$scope.userId,'offset':$scope.offset}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.viewMoreLoad = 0;
            $rootScope.routeList=$rootScope.routeList.concat(result.routes);
            $scope.routeListCount = $scope.routeList.length;
            if(result.totalCount > $scope.routeList.length){
                $scope.viewMore = 1;
                $scope.offset = $scope.offset+5;
            }
        }).error(function (result) {
            $scope.viewMoreRoues();
        });
    }

});

homeControllers1.controller('grouproutes', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal) {
    $scope.sessUser = 0;
    $scope.groupId = $stateParams.groupId;
    $scope.userId = $rootScope.rootsessUser = 0;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.sessUser = $scope.userDet.id;
        $rootScope.rootsessUser = $scope.userDet.id;
    }

    $scope.viewMore = 0;
    $scope.viewMoreLoad = 0;
    $scope.offset = 0;

    $scope.map = {
        zoom: 13,
        lineStyle: {
            color: '#F7931E',
            weight: 4,
            opacity: 1
        }
    };

    $rootScope.routeList = [];

    $timeout(function(){
        $scope.getGrRoutes();
    },500);

    $scope.getGrRoutes = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getGrRoutes',
            data    : $.param({'groupId':$scope.groupId,'offset':0}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.routeList = result.routes;
            $scope.routeListCount = $scope.routeList.length;
            if(result.totalCount > $scope.routeList.length){
                $scope.viewMore = 1;
                $scope.offset = 5;
            }
        }).error(function (result) {
            $scope.getGrRoutes();
        });
    }

    $scope.viewMoreRoues = function(){
        $scope.viewMoreLoad = 1;
        $scope.viewMore = 0;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getGrRoutes',
            data    : $.param({'groupId':$scope.groupId,'offset':$scope.offset}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.viewMoreLoad = 0;
            $rootScope.routeList=$rootScope.routeList.concat(result.routes);
            $scope.routeListCount = $scope.routeList.length;
            if(result.totalCount > $scope.routeList.length){
                $scope.viewMore = 1;
                $scope.offset = $scope.offset+5;
            }
        }).error(function (result) {
            $scope.viewMoreRoues();
        });
    }

});

homeControllers1.controller('allroutes', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal) {
    $scope.sessUser = 0;
    $scope.userId = $stateParams.userId;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.sessUser = $scope.userDet.id;
        $rootScope.rootsessUser = $scope.userDet.id;
    }

    $rootScope.routeList = [];

    $timeout(function(){
        $scope.getRoutes();
    },500);

    $scope.getRoutes = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getRoutes',
            data    : $.param({'userid':0,'offset':0}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.routeList = result.routes;
            $scope.routeListCount = $scope.routeList.length;
            if(result.totalCount > $scope.routeList.length){
                $scope.viewMore = 1;
                $scope.offset = 5;
            }
        }).error(function (result) {
            $scope.getRoutes();
        });
    }

    $scope.viewMoreRoues = function(){
        $scope.viewMoreLoad = 1;
        $scope.viewMore = 0;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getRoutes',
            data    : $.param({'userid':0,'offset':$scope.offset}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.viewMoreLoad = 0;
            $rootScope.routeList=$rootScope.routeList.concat(result.routes);
            $scope.routeListCount = $scope.routeList.length;
            if(result.totalCount > $scope.routeList.length){
                $scope.viewMore = 1;
                $scope.offset = $scope.offset+5;
            }
        }).error(function (result) {
            $scope.viewMoreRoues();
        });
    }
});

homeControllers1.controller('addroute', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal) {
    $scope.userId = 0;
    $scope.distance = 0;
    $scope.distancearr = [];

    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.userId = $scope.userDet.id;
    }else{
        $state.go('index');
        return
    }

    $scope.isFPoint = 0;
    $scope.isSinglePoint = 1;
    $scope.lastPoint = '';
    $scope.firstPoint = '';
    $scope.location = [];
    $scope.location123 = [];
    $scope.location1 = [];

    $scope.markerc = {
        id: 0
    };

    $scope.form = {
        sports_id : '',
        address : '',
        distance:0,
        user_id: $scope.userId,
        end_point:[]
    }

    $scope.polyline = {
        path: [],
        stroke: {
            color: '#F7931E',
            weight: 3
        },
    };

    $scope.minDate = new Date();
    $scope.minDate1 = new Date();


    $scope.format = 'MM/dd/yyyy';

    $scope.open1 = function() {
        $scope.opened = true;
    };



    $scope.getsports1 = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getsports1',
        }).success(function (result) {
            angular.element( document.querySelector( '#sportsList' ) ).append(result);
        }).error(function (result) {
            $scope.getsports1();
        });
    }

    $scope.checkpoint12 = function(sports_id){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/checkPoint',
            data    : $.param({'sp_id': sports_id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            if(result.point == 2){
                $scope.isSinglePoint = 0;
            }
        }).error(function (result) {
            $scope.checkpoint12(sports_id);
        });
    }

    $scope.sportsChange = function(){
        $scope.isFPoint = 0;
        $scope.lastPoint = '';
        $scope.firstPoint = '';
        $scope.isSinglePoint = 1;
        $scope.location = [];
        $scope.location123 = [];
        $scope.location1 = [];
        $scope.distancearr = [];


        $scope.markerc = {
            id: 0,
        };
        $scope.form.end_point  = [];

        $timeout(function(){
            $scope.mapnewload();
        },500);


        if($scope.form.sports_id != ''){
            $scope.checkpoint12($scope.form.sports_id);
        }
    }


    $timeout(function(){
        $scope.mapnewload();
        $scope.getsports1();
    },500);


    $scope.mapnewload = function(){

        $scope.distance = 0;

        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getCurLocation1',
            data    : $.param({'userid': $scope.userId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {

            $scope.center = {
                latitude: result.latitude,
                longitude: result.longitude
            };

            $scope.map = {
                dragZoom: {options: {}},
                control:{},
                center: $scope.center,
                pan: true,
                zoom: 9,
                refresh: false,
                clickedMarker: {
                    id: 0,
                },
                events: {
                    click: function (mapModel, eventName, originalEventArgs) {
                        // 'this' is the directive's scope

                        var e = originalEventArgs[0];
                        var lat = e.latLng.lat(),
                            lon = e.latLng.lng();

                        var service = new google.maps.DirectionsService();
                        var geocoder = new google.maps.Geocoder();

                        if($scope.form.sports_id == ''){
                            $scope.reqPop = ngDialog.open({
                                template: '<div style="text-align:center;">Please select a sport before adding a route</div>',
                                plain:true,
                                showClose:false,
                                closeByDocument: true,
                                //className : 'maproutePopup',
                                closeByEscape: true
                            });

                            $timeout(function(){
                                $scope.reqPop.close();
                            },10000)
                        }else{
                            var pos = new google.maps.LatLng(lat,lon);



                            if($scope.isFPoint == 0){
                                geocoder.geocode({'latLng': pos}, function(results, status) {
                                    if (status == google.maps.GeocoderStatus.OK) {
                                        $scope.form.address = (results[1].formatted_address);
                                    }
                                });


                                $scope.firstPoint = pos;
                                $scope.location.push(pos);
                                $scope.location123.push({'latitude' :lat,'longitude' :lon});
                                $scope.location1.push($scope.location.length);
                                $scope.distancearr.push(0);
                                $scope.form.end_point.push(pos);
                                $scope.polyline.path.push({latitude:lat,longitude:lon});
                                $scope.map.clickedMarker = {
                                    id: 1,
                                    latitude: lat,
                                    longitude: lon
                                };
                                $scope.markerc = {
                                    id: 1,
                                    latitude: lat,
                                    longitude: lon
                                };
                                $scope.isFPoint = 1;
                                $scope.lastPoint = pos;
                            }else{
                                if( $scope.isSinglePoint == 1){
                                    $scope.reqPop1 = ngDialog.open({
                                        template: '<div style="text-align:center;">Only one point is used on GPS for this sport.</div>',
                                        plain:true,
                                        showClose:false,
                                        closeByDocument: true,
                                        //className : 'maproutePopup',
                                        closeByEscape: true
                                    });

                                    $timeout(function(){
                                        $scope.reqPop1.close();
                                    },10000);
                                }else{
                                    $scope.currentPoint = pos;

                                    var distance1 = google.maps.geometry.spherical.computeDistanceBetween($scope.lastPoint, $scope.currentPoint);

                                    var diskm=(distance1/1000);
                                    var dismile=parseFloat(diskm*0.62137);
                                    dismile = (parseFloat(dismile)).toFixed(3);

                                    $scope.distance = parseFloat($scope.distance)+parseFloat(dismile);

                                    $scope.distance = $scope.distance.toFixed(3);

                                    service.route({ origin: $scope.lastPoint, destination: $scope.currentPoint, travelMode: google.maps.DirectionsTravelMode.DRIVING }, function(result, status) {
                                        if (status == google.maps.DirectionsStatus.OK) {
                                            for(var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                                                $scope.location.push(result.routes[0].overview_path[i]);
                                                var pos1 = result.routes[0].overview_path[i];
                                                $scope.location123.push({'latitude' :pos1.lat(),'longitude' :pos1.lng()});
                                                $scope.form.end_point.push(result.routes[0].overview_path[i]);
                                            }

                                            $scope.location1.push($scope.location.length);
                                            $scope.distancearr.push($scope.distance);
                                        }
                                    });



                                    $scope.lastPoint = pos;
                                }

                            }


                        }

                        //scope apply required because this event handler is outside of the angular domain
                        $scope.$apply();
                    },
                },
                bounds:{},
            };
        }).error(function (result) {
            $scope.mapnewload();
        });

    }

    $scope.cancel=function(){

        $scope.isFPoint = 0;
        $scope.lastPoint = '';
        $scope.firstPoint = '';
        $scope.location = [];
        $scope.location123 = [];
        $scope.location1 = [];
        $scope.distancearr = [];

        $scope.markerc = {
            id: 0,
        };
        $scope.form.end_point  = [];

        $timeout(function(){
            $scope.mapnewload();
        },500);
    }

    $scope.undo = function(){

        if($scope.location1.length > 1){

            var maxPvalue = $scope.location1[$scope.location1.length-1];
            $scope.location1 = $scope.location1.slice(0,$scope.location1.length-1);
            $scope.distancearr = $scope.distancearr.slice(0,$scope.distancearr.length-1);
            var maxvalue = $scope.location1[$scope.location1.length-1];

            var difval = parseInt(maxPvalue)-parseInt(maxvalue);


            $scope.distance = $scope.distancearr[$scope.distancearr.length-1]

           $scope.location.splice(maxvalue,(difval+1));
           $scope.location123.splice(maxvalue,(difval+1));

            $scope.lastPoint = $scope.location[$scope.location.length-1]





        }


    }

    $scope.outback = function(){
        if($scope.location1.length > 1){
            var maxv = $scope.location.length;
            var maxv123 = $scope.location123.length;
            var j;
            for(j=(maxv-2);j>=0;j-- ){
                $scope.location.push($scope.location[j]);
                $scope.location123.push($scope.location123[j]);
            }

            $scope.distance = $scope.distance *2;

            $scope.distance = $scope.distance.toFixed(3);
        }
    }

    /*$scope.addRoutes = function(){
        $('#user_id').val($scope.userId);
        $('#distance').val($scope.distance);
        angular.forEach($scope.location, function(val2, key) {
            if(key == 0){
                $('#st_point').val(val2);
            }

            $('#end_p').append('<input type="hidden" name="end_point[]" value="'+val2+'">');
        });

        $('#addRouteMap').attr('action',$scope.baseUrl+'/user/ajs1/addroute');
        $('#addRouteMap').submit();

    }*/



    $scope.addRoutes = function(){


        $scope.form.end_point = $scope.location123;
        $scope.form.distance = $scope.distance;

        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/addroute123',
            data    : $.param($scope.form),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $state.go('routes',{userId:$scope.userId});
            return;
        }).error(function (result) {
            $scope.addRoutes();
        });

    }


    $scope.getloc = function(adrr){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getlocbyaddr',
            data    : $.param({'address': adrr}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            if(result.error == 0){
                $scope.map.center = {
                    latitude: result.lat,
                    longitude: result.long
                }
                $scope.map.zoom= 14;
            }
        })
    }

});

homeControllers1.controller('forumlist', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal) {
    $scope.spId = $stateParams.spId;

    if(typeof ($scope.spId) == 'undefined'){
        $scope.spId = 0;
    }

    $scope.forumList = [];

    $timeout(function(){
        $scope.getForumList();
    },500);

    $scope.getForumList = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getForumList',
            data    : $.param({'id':$scope.spId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.forumList = result;
            if($scope.spId > 0){
                $rootScope.headingArr.push({ id:result[0].id,value:result[0].sport_name,link:'/forum-list-by-sports/'+result[0].id})
            }
        }).error(function (result) {
            $scope.getForumList();
        });
    }

    $scope.submitloginForm = function() {
        $rootScope.stateIsLoading = true;
        $scope.msgFlag = false;

        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/login',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;

            if(typeof (data.id) != 'undefined'){
                $cookieStore.put('login_email1',$scope.form.email);
                $cookieStore.put('login_password1',$scope.form.password);

                //$rootScope.rootUserImage = data.user_image;
                //$rootScope.rootUserCoverImage = data.user_cover_image;
                $scope.alldata = data;

                //$scope.alldata.user_image = '';
               // $scope.alldata.user_cover_image = '';

                $cookieStore.put('rootuserdet',$scope.alldata);

                $rootScope.sessUserDet = $cookieStore.get('rootuserdet');
                $rootScope.sessUser = $rootScope.sessUserDet.id;


                $http({
                    method  : 'POST',
                    async:   false,
                    url     : $scope.baseUrl+'/user/ajs1/getPImage',
                    data    : $.param({'userid':$rootScope.sessUserDet.id}),  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function(data) {
                    $rootScope.profileImage = $scope.baseUrl+'/uploads/user_image/thumb/'+data.profileImgName;
                });

            }else{
                $scope.msgFlag = true;
            }


        });
    };

});

homeControllers1.controller('forumdetails', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal) {
    $scope.forumId = $stateParams.forumId;

    $timeout(function(){
        $scope.getForumTopicList();
    },500);

    $scope.getForumTopicList = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getForumTopicList',
            data    : $.param({'id':$scope.forumId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.forumDet = result;
            $scope.headingArr.push({ id:result.parent_id,value:result.parent_name,link:'/forum-list-by-sports/'+result.parent_id},{id:result.id,value:result.name,link:'/forum-details/'+result.id});

        }).error(function (result) {
            $scope.getForumTopicList();
        });
    }

    $scope.submitloginForm = function() {
        $rootScope.stateIsLoading = true;
        $scope.msgFlag = false;

        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/login',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;

            if(typeof (data.id) != 'undefined'){
                $cookieStore.put('login_email1',$scope.form.email);
                $cookieStore.put('login_password1',$scope.form.password);

                //$rootScope.rootUserImage = data.user_image;
                //$rootScope.rootUserCoverImage = data.user_cover_image;
                $scope.alldata = data;

                //$scope.alldata.user_image = '';
                // $scope.alldata.user_cover_image = '';

                $cookieStore.put('rootuserdet',$scope.alldata);

                $rootScope.sessUserDet = $cookieStore.get('rootuserdet');
                $rootScope.sessUser = $rootScope.sessUserDet.id;


                $http({
                    method  : 'POST',
                    async:   false,
                    url     : $scope.baseUrl+'/user/ajs1/getPImage',
                    data    : $.param({'userid':$rootScope.sessUserDet.id}),  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function(data) {
                    $rootScope.profileImage = $scope.baseUrl+'/uploads/user_image/thumb/'+data.profileImgName;
                });

            }else{
                $scope.msgFlag = true;
            }


        });
    };

});

homeControllers1.controller('topicdetails', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal,$templateCache,$compile) {
    $scope.topicId = $stateParams.topicId;
    $scope.loadingtreply = false;

    $scope.seesuser1 = 0;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.sessUserDet1 = $cookieStore.get('rootuserdet');
        $scope.seesuser1 = $scope.sessUserDet1.id;
    }

    $timeout(function(){
        $scope.getTopicHArr();
        $scope.postaddView();
        $scope.getTopicDetails();
    },500);

    $scope.getTopicHArr = function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/getTopicHArr',
            data    : $.param({'id':$scope.topicId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }) .success(function(result) {
            $scope.topicTitle = result.topic_title;
            $scope.headingArr.push({ id:result.forum_category_id,value:result.forum_category_name,link:'/forum-list-by-sports/'+result.forum_category_id},{id:result.forum_id,value:result.forum_name,link:'/forum-details/'+result.forum_id},{ id:$scope.topicId,value:result.topic_title,link:'/topic-details/'+$scope.topicId});
        }).error(function (result) {
            $scope.getTopicHArr();
        });
    }

    $scope.postaddView = function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/addView',
            data    : $.param({'id':$scope.topicId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }) .success(function(result) {
            console.log('1');
        }).error(function (result) {
            $scope.postaddView();
        });
    }

    $scope.getTopicDetails = function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/getTopicDetails',
            data    : $.param({'id':$scope.topicId,sess_id:$scope.seesuser1}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }) .success(function(result) {
            $scope.topicDet = result;
            $scope.topicDet.description = $sce.trustAsHtml($scope.topicDet.description);

            $scope.form = {
                title:'Re: '+result.title,
                parentId:result.id,
                forumId:result.forum_id,
                user_id:$scope.seesuser1,
                description:'',
            }

            $scope.gettoipcreplyrec();
        }).error(function (result) {
            $scope.getTopicDetails();
        });
    }

    $scope.offset = 0;
        $scope.gettoipcreplyrec = function(){
        $scope.loadingtreply = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/gettoipcreply',
            data    : $.param({'id':$scope.topicId,sess_id:$scope.seesuser1,offset:$scope.offset}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }) .success(function(result1) {
            $scope.offset = $scope.offset+3;

            if($scope.topicDet.topic_reply.length)
                $scope.topicDet.topic_reply=$scope.topicDet.topic_reply.concat(result1);
            else
                $scope.topicDet.topic_reply = result1;



            if($scope.topicDet.topic_reply_count > $scope.topicDet.topic_reply.length){
                $timeout(function(){
                    $scope.gettoipcreplyrec();
                },5000);
            }else{
                $scope.loadingtreply = false;

                angular.forEach($scope.topicDet.topic_reply,function(value){
                    $scope.gettoipcreply1(value);
                })

            }
        }).error(function (result) {

            $timeout(function () {
                $scope.gettoipcreplyrec();
            }, 3000);

        });
    }

    $scope.gettoipcreply1 = function(result){
        $scope.loadingtreply = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/gettoipcreply1',
            data    : $.param({'id':result.id,sess_id:$scope.seesuser1}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }) .success(function(result2) {
            $scope.loadingtreply = false;
            result.topic_reply1 = result2;

        }).error(function (result2) {

            $timeout(function () {
                $scope.gettoipcreply1(result);
            }, 5000);

        });
    }


    $scope.setHighlight123 = function(){

    }

    $scope.resizeTextarea1 = function(event){

        var target = event.target || event.srcElement || event.originalTarget;

        target.style.setProperty ("height", '38px', "important");
        if(target.scrollHeight > 38){
            target.style.setProperty ("height", 'auto', "important");
            target.parentElement.parentElement.style.setProperty ("height", target.scrollHeight+'px', "important");
            target.style.setProperty ("height", target.scrollHeight+'px', "important");
        }
        if(target.scrollHeight > 210){
            target.parentElement.parentElement.parentElement.style.setProperty ("height", target.scrollHeight+'px', "important");
        }
    }
    $scope.resizeTextarea2 = function(event){
        var target = event.target || event.srcElement || event.originalTarget;

        target.style.setProperty ("height", '35px', "important");
        if(target.scrollHeight > 35){
            target.style.setProperty ("height", 'auto', "important");
            target.style.setProperty ("height", target.scrollHeight+'px', "important");
        }
    }

    $scope.urlextract = function(event,div_id){
        var strss = event.currentTarget.value;

        var re = /(?:^|\W)#(\w+)(?!\w)/g, match, matches ;
        while (match = re.exec(strss)) {
            var hastag = '#'+match[1];

            $('.highlightTextarea-highlighter').html($('.highlightTextarea-highlighter').html().replace(hastag,'<span style="color:#fff;background-color:#F7931D; z-index: 9; position: relative;">'+hastag+'</span>'));
        }



        var match_url = /\b(https?):\/\/([\-A-Z0-9.]+)(\/[\-A-Z0-9+&@#\/%=~_|!:,.;]*)?(\?[A-Z0-9+&@#\/%=~_|!:,.;]*)?/i;

        $scope.thumbImage = [];

        if (match_url.test(strss)) {
            var extracted_url = strss.match(match_url)[0];

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/extract-process.php',
                data    : $.param({'url': extracted_url}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }) .success(function(data) {
                var extracted_images = data.images;
                var total_images = parseInt(data.images.length-1);
                var img_arr_pos = total_images;



                if(total_images>0){
                    $scope.thumbImage = extracted_images;
                    var inc_image = '<div class="extracted_thumb" id="extracted_thumb"><img src="'+data.images[img_arr_pos]+'" style="max-width: 100px; max-height:100px;"></div>';
                }else{
                    var inc_image ='';
                }
                //content to be loaded in #results element
                var content = '<div class="extracted_url">'+ inc_image +'<div class="extracted_content"><h4><a href="'+extracted_url+'" target="_blank">'+data.title+'</a></h4><p>'+data.content+'</p><div class="thumb_sel"><span class="prev_thumb" id="thumb_prev">prev</span><span class="next_thumb" id="thumb_next">next</span> </div><span class="small_text" id="total_imgs">'+img_arr_pos+' of '+total_images+'</span><span class="small_text">&nbsp;&nbsp;Choose a Thumbnail</span></div><div class="clear"></div></div>';

                angular.element( document.querySelector( '#'+div_id )).html(content);

                $("#thumb_prev").click( function(e){
                    if(img_arr_pos>0)
                    {
                        img_arr_pos--; //thmubnail array position decrement

                        //replace with new thumbnail
                        $("#extracted_thumb").html('<img src="'+extracted_images[img_arr_pos]+'" width="100" height="100">');

                        //show thmubnail position
                        $("#total_imgs").html((img_arr_pos) +' of '+ total_images);
                    }
                });
                $("#thumb_next").click( function(e){
                    if(img_arr_pos<total_images)
                    {
                        img_arr_pos++; //thmubnail array position increment

                        //replace with new thumbnail
                        $("#extracted_thumb").html('<img src="'+extracted_images[img_arr_pos]+'" width="100" height="100">');

                        //replace thmubnail position text
                        $("#total_imgs").html((img_arr_pos) +' of '+ total_images);
                    }
                });

            });
        }else{
            angular.element( document.querySelector( '#'+div_id )).html('');
        }
    }

    $scope.urlextract1 = function(event,div_id){
        var target = event.target || event.srcElement || event.originalTarget;
        var strss = target.value;

        var match_url = /\b(https?):\/\/([\-A-Z0-9.]+)(\/[\-A-Z0-9+&@#\/%=~_|!:,.;]*)?(\?[A-Z0-9+&@#\/%=~_|!:,.;]*)?/i;

        $scope.thumbImage = [];

        if (match_url.test(strss)) {
            var extracted_url = strss.match(match_url)[0];

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/extract-process.php',
                data    : $.param({'url': extracted_url}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }) .success(function(data) {
                var extracted_images = data.images;
                var total_images = parseInt(data.images.length-1);
                var img_arr_pos = total_images;



                if(total_images>0){
                    $scope.thumbImage = extracted_images;
                    var inc_image = '<div class="extracted_thumb" id="extracted_thumb"><img src="'+data.images[img_arr_pos]+'" style="max-width: 100px; max-height:100px;"></div>';
                }else{
                    var inc_image ='';
                }
                //content to be loaded in #results element
                var content = '<div class="extracted_url">'+ inc_image +'<div class="extracted_content"><h4><a href="'+extracted_url+'" target="_blank">'+data.title+'</a></h4><p>'+data.content+'</p><div class="thumb_sel"><span class="prev_thumb" id="thumb_prev">prev</span><span class="next_thumb" id="thumb_next">next</span> </div><span class="small_text" id="total_imgs">'+img_arr_pos+' of '+total_images+'</span><span class="small_text">&nbsp;&nbsp;Choose a Thumbnail</span></div><div class="clear"></div></div>';

                angular.element( document.querySelector( '#extracted_url'+div_id )).html(content);

                $("#thumb_prev").click( function(e){
                    if(img_arr_pos>0)
                    {
                        img_arr_pos--; //thmubnail array position decrement

                        //replace with new thumbnail
                        $("#extracted_thumb").html('<img src="'+extracted_images[img_arr_pos]+'" width="100" height="100">');

                        //show thmubnail position
                        $("#total_imgs").html((img_arr_pos) +' of '+ total_images);
                    }
                });
                $("#thumb_next").click( function(e){
                    if(img_arr_pos<total_images)
                    {
                        img_arr_pos++; //thmubnail array position increment

                        //replace with new thumbnail
                        $("#extracted_thumb").html('<img src="'+extracted_images[img_arr_pos]+'" width="100" height="100">');

                        //replace thmubnail position text
                        $("#total_imgs").html((img_arr_pos) +' of '+ total_images);
                    }
                });

            });
        }else{
            angular.element( document.querySelector( '#extracted_url'+div_id )).html('');
        }
    }

    $scope.addTopicForm = function(){
        $scope.showError = false;

        if($scope.form.description == '' || $scope.form.description == '<br>'){
            $scope.showError = true;
        }else{
            $rootScope.stateIsLoading = true;
            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs1/addnewTopic',
                data    : $.param($scope.form),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }) .success(function(result) {
                $rootScope.stateIsLoading = false;
                $scope.isReply = false;
                $scope.form = {
                    title:result.title,
                    parentId:result.parent_id,
                    forumId:result.forum_id,
                    user_id:$scope.seesuser1,
                    description:'',
                }

                $scope.ReplyForm.reset();

                angular.element( document.querySelector( '#extracted_url1' )).html('');
                angular.element( document.querySelector( '.highlightTextarea-highlighter' ) ).html('');
                angular.element( document.querySelector( '#topicreplydiv' ) ).html('');
                $('#emojisdiv787').hide();

                if($scope.topicDet.topic_reply.length > 0){
                    $scope.topicDet.topic_reply.push(result);
                }else{
                    $scope.topicDet.topic_reply = [result];
                }
            });
        }
    }

    $scope.addTopicForm1 = function(index,item){
        $('#error111'+item.id).hide();
        var replyval = $('#topicreplydiv1'+item.id).html();
        if(replyval == '' || replyval == '<br>') {
            $('#error111'+item.id).show();
        }else{
            $rootScope.stateIsLoading = true;
            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs1/addnewTopic',
                data    : $.param({'title':item.title,'description':replyval,'parentId':item.id,'forumId':item.forum_id,user_id:$scope.seesuser1}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }) .success(function(result) {
                $rootScope.stateIsLoading = false;
                $('#Reply_description'+index).val('');

                angular.element( document.querySelector( '#extracted_url'+item.id )).html('');
                $('#topicreplydiv1'+item.id).html('');
                $('#emojisdiv787'+item.id).hide();

                //document.getElementById("Reply_description"+index).style.setProperty ("height", '35px', "important");
                //document.getElementById("Reply_description"+index).style.setProperty ("height", '35px', "important");

                if($scope.topicDet.topic_reply.length > 0){
                    item.topic_reply1.push(result);
                }else{
                    item.topic_reply1 = [result];
                }
            });
        }
    }

    $scope.likeTopic = function(item){
        if($scope.sessUser >0){
            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/topic_like',
                data    : $.param({'id':item.id,'user_id':$scope.sessUser}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                if(result == 0){
                    item.likeNo = item.likeNo-1;
                    item.likeStatus = 0;
                }else{
                    item.likeNo = item.likeNo+1;
                    item.likeStatus = 1;
                }
            });

        }
    }

    $scope.delTopicReply = function(id,index,parent){
        $scope.parentReply = parent;
        $scope.confirmDialog = ngDialog.open({
            template: '<div style="text-align:center; font-family: \'veneerregular\'; font-size: 19px;">ARE YOU SURE YOU WANT TO DELETE THIS COMMENT?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm('+id+','+index+',1)" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
            plain:true,
            showClose:false,
            closeByDocument: false,
            closeByEscape: false,
            className : 'confirmPopup',
            scope:$scope
        });
    }

    $scope.delTopicReply1 = function(id,index,parent){
        $scope.parentReply = parent;
        $scope.confirmDialog = ngDialog.open({
            template: '<div style="text-align:center; font-family: \'veneerregular\'; font-size: 19px;">ARE YOU SURE YOU WANT TO DELETE THIS COMMENT?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm('+id+','+index+',2)" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
            plain:true,
            showClose:false,
            closeByDocument: false,
            closeByEscape: false,
            className : 'confirmPopup',
            scope:$scope
        });
    }

    $scope.delTopicReply2 = function(id,f_id){
        $scope.confirmDialog = ngDialog.open({
            template: '<div style="text-align:center; font-family: \'veneerregular\'; font-size: 19px;">ARE YOU SURE YOU WANT TO DELETE THIS TOPIC?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm('+id+','+f_id+',3)" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
            plain:true,
            showClose:false,
            closeByDocument: false,
            closeByEscape: false,
            className : 'confirmPopup',
            scope:$scope
        });
    }

    $scope.delConfirm = function(id,index,type){
        $scope.confirmDialog.close();
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/delTopic',
            data    : $.param({'id':id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            if(type == 2)
                $scope.parentReply.topic_reply1.splice(index,1);
            if(type == 1)
                $scope.topicDet.topic_reply.splice(index,1);
            if(type == 3){
                $state.go('forumdetails',{forumId:index});
                return;
            }
        });
    }

    $scope.delCancel = function(){
        $scope.confirmDialog.close();
    }

    $scope.postid = 0;
    $scope.replyedit = function(item){

        $scope.item = item;

        $scope.form1 = {
            id:item.id,
            replyeditarea:item.description,
        }

        $scope.editReply222html = $sce.trustAsHtml(item.description);

        $scope.ytdialog = ngDialog.open({
            template: 'editpost',
            showClose:true,
            closeByDocument: true,
            closeByEscape: true,
            className : 'editpost',
            scope: $scope
        });
        //$scope.dsfsdfsd();

    }

    $scope.dsfsdfsd = function(){
        setTimeout(function(){
            var selem = document.getElementById('editReply222');
            selem.style.setProperty ("height", 'auto', "important");
            selem.style.setProperty ("height", selem.scrollHeight+'px', "important");
        },1000);
    }

    $scope.replyeditform = function(){
        $scope.ytdialog.close();
        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/editTopic1',
            data    : $.param($scope.form1),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(result) {
            $rootScope.stateIsLoading = false;


            $scope.item.description =  $scope.form1.replyeditarea;
        });
    }

    $scope.submitloginForm = function() {
        $rootScope.stateIsLoading = true;
        $scope.msgFlag = false;

        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/login',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;

            if(typeof (data.id) != 'undefined'){
                $cookieStore.put('login_email1',$scope.form.email);
                $cookieStore.put('login_password1',$scope.form.password);

                //$rootScope.rootUserImage = data.user_image;
                //$rootScope.rootUserCoverImage = data.user_cover_image;
                $scope.alldata = data;

                //$scope.alldata.user_image = '';
                // $scope.alldata.user_cover_image = '';

                $cookieStore.put('rootuserdet',$scope.alldata);

                $rootScope.sessUserDet = $cookieStore.get('rootuserdet');
                $rootScope.sessUser = $rootScope.sessUserDet.id;


                $http({
                    method  : 'POST',
                    async:   false,
                    url     : $scope.baseUrl+'/user/ajs1/getPImage',
                    data    : $.param({'userid':$rootScope.sessUserDet.id}),  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function(data) {
                    $rootScope.profileImage = $scope.baseUrl+'/uploads/user_image/thumb/'+data.profileImgName;
                });

            }else{
                $scope.msgFlag = true;
            }


        });
    };

    $scope.showemojisdivsfs1 = function(){
        var emohtml = '<div class="emojisdiv">';

        angular.forEach($rootScope.emojisArr,function(value){
            emohtml += '<a href="javascript:void(0)" ng-click="emoinsert2(\''+value+'\')" class="emoticon emoticon-'+value+'" title="::'+value+'::" ></a>';
        })

        emohtml += '</div>';

        var $el = angular.element( document.querySelector( '#emojisdiv787' ) ).html(emohtml);

        $compile($el)($scope);

        if ($('#emojisdiv787').is(':hidden')) {
            $('#emojisdiv787').show();
        }else{
            $('#emojisdiv787').hide();
        }

    }

    $scope.showemojisdivsfs52521 = function(){
        var emohtml = '<div class="emojisdiv">';

        angular.forEach($rootScope.emojisArr,function(value){
            emohtml += '<a href="javascript:void(0)" ng-click="emoinsert5(\''+value+'\')" class="emoticon emoticon-'+value+'" title="::'+value+'::" ></a>';
        })

        emohtml += '</div>';

        var $el = angular.element( document.querySelector( '#emojisdiv787555' ) ).html(emohtml);

        $compile($el)($scope);


        if ($('#emojisdiv787555').is(':hidden')) {
            $('#emojisdiv787555').show();
        }else{
            $('#emojisdiv787555').hide();
        }
    }

    $scope.showemojisdivsfs514651 = function(id){

        var emohtml = '<div class="emojisdiv">';

        angular.forEach($rootScope.emojisArr,function(value){
            emohtml += '<a href="javascript:void(0)" ng-click="emoinsert3(0,'+id+',\''+value+'\')" class="emoticon emoticon-'+value+'" title="::'+value+'::" ></a>';
        })

        emohtml += '</div>';

        var $el = angular.element( document.querySelector( '#emojisdiv787'+id ) ).html(emohtml);

        $compile($el)($scope);


        if ($('#emojisdiv787'+id).is(':hidden')) {
            $('#emojisdiv787'+id).show();
        }else{
            $('#emojisdiv787'+id).hide();
        }

    }

    $scope.emoinsert2 = function(emoitem){

        $scope.showError = false;

        var emoval = '<input title="'+emoitem+'" style="border:none; margin-left: 3px; margin-right: 3px;" class="emoticon emoticon-'+emoitem+'" />';

        var prevval = $('#topicreplydiv').html();

        if(prevval.substr(prevval.length - 4) == '<br>')
            prevval = prevval.substring(0, prevval.length - 4);

        $('#topicreplydiv').html(prevval+emoval);

        $scope.form.description = prevval+emoval;

    }

    $scope.emoinsert5 = function(emoitem){

        $scope.showError = false;

        var emoval = '<input title="'+emoitem+'" style="border:none; margin-left: 3px; margin-right: 3px;" class="emoticon emoticon-'+emoitem+'" />';

        var prevval = $('#editReply222').html();

        if(prevval.substr(prevval.length - 4) == '<br>')
            prevval = prevval.substring(0, prevval.length - 4);

        $('#editReply222').html(prevval+emoval);

        $scope.form1.replyeditarea = prevval+emoval;
    }

    $scope.emoinsert3 = function(index,itemid,emoitem){
        $('#error111'+itemid).hide();

        var emoval = '<input title="'+emoitem+'" style="border:none; margin-left: 3px; margin-right: 3px;" class="emoticon emoticon-'+emoitem+'" />';

        var prevval = $('#topicreplydiv1'+itemid).html();

        if(prevval.substr(prevval.length - 4) == '<br>')
            prevval = prevval.substring(0, prevval.length - 4);

        $('#topicreplydiv1'+itemid).html(prevval+emoval);

    }

    $scope.settopicreplyval = function(event){
        var target = event.target || event.srcElement || event.originalTarget;
        $scope.form.description = target.innerHTML;
    }

    $scope.settopicreplyval55 = function(event){
        var target = event.target || event.srcElement || event.originalTarget;
        $scope.form1.replyeditarea = target.innerHTML;
    }

});

homeControllers1.controller('newtopic', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal) {
    $scope.forumId = $stateParams.forumId;
    $scope.seesuser1 = 0;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.sessUserDet1 = $cookieStore.get('rootuserdet');
        $scope.seesuser1 = $scope.sessUserDet1.id;
    }

    $scope.form = {
        forumId : $scope.forumId,
        parentId : 0,
        user_id:$scope.seesuser1
    }

    $scope.addTopicForm = function(){
        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/addnewTopic',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(result) {
            $rootScope.stateIsLoading = false;
            $state.go('forumdetails',{forumId:$scope.forumId});
            return;
        });
    }

    $scope.urlextract = function(event,div_id){
        var target = event.target || event.srcElement || event.originalTarget;
        var strss = target.innerHTML;


        var match_url = /\b(https?):\/\/([\-A-Z0-9.]+)(\/[\-A-Z0-9+&@#\/%=~_|!:,.;]*)?(\?[A-Z0-9+&@#\/%=~_|!:,.;]*)?/i;

        $scope.thumbImage = [];

        if (match_url.test(strss)) {
            var extracted_url = strss.match(match_url)[0];

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/extract-process.php',
                data    : $.param({'url': extracted_url}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }) .success(function(data) {
                var extracted_images = data.images;
                var total_images = parseInt(data.images.length-1);
                var img_arr_pos = total_images;



                if(total_images>0){
                    $scope.thumbImage = extracted_images;
                    var inc_image = '<div class="extracted_thumb" id="extracted_thumb"><img src="'+data.images[img_arr_pos]+'" style="max-width: 100px; max-height:100px;"></div>';
                }else{
                    var inc_image ='';
                }
                //content to be loaded in #results element
                var content = '<div class="extracted_url">'+ inc_image +'<div class="extracted_content"><h4><a href="'+extracted_url+'" target="_blank">'+data.title+'</a></h4><p>'+data.content+'</p><div class="thumb_sel"><span class="prev_thumb" id="thumb_prev">prev</span><span class="next_thumb" id="thumb_next">next</span> </div><span class="small_text" id="total_imgs">'+img_arr_pos+' of '+total_images+'</span><span class="small_text">&nbsp;&nbsp;Choose a Thumbnail</span></div><div class="clear"></div></div>';

                angular.element( document.querySelector( '#'+div_id )).html(content);

                $("#thumb_prev").click( function(e){
                    if(img_arr_pos>0)
                    {
                        img_arr_pos--; //thmubnail array position decrement

                        //replace with new thumbnail
                        $("#extracted_thumb").html('<img src="'+extracted_images[img_arr_pos]+'" width="100" height="100">');

                        //show thmubnail position
                        $("#total_imgs").html((img_arr_pos) +' of '+ total_images);
                    }
                });
                $("#thumb_next").click( function(e){
                    if(img_arr_pos<total_images)
                    {
                        img_arr_pos++; //thmubnail array position increment

                        //replace with new thumbnail
                        $("#extracted_thumb").html('<img src="'+extracted_images[img_arr_pos]+'" width="100" height="100">');

                        //replace thmubnail position text
                        $("#total_imgs").html((img_arr_pos) +' of '+ total_images);
                    }
                });

            });
        }else{
             angular.element( document.querySelector( '#'+div_id )).html('');
        }
    }

    $scope.submitloginForm = function() {
        $rootScope.stateIsLoading = true;
        $scope.msgFlag = false;

        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/login',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;

            if(typeof (data.id) != 'undefined'){
                $cookieStore.put('login_email1',$scope.form.email);
                $cookieStore.put('login_password1',$scope.form.password);

                //$rootScope.rootUserImage = data.user_image;
                //$rootScope.rootUserCoverImage = data.user_cover_image;
                $scope.alldata = data;

                //$scope.alldata.user_image = '';
                // $scope.alldata.user_cover_image = '';

                $cookieStore.put('rootuserdet',$scope.alldata);

                $rootScope.sessUserDet = $cookieStore.get('rootuserdet');
                $rootScope.sessUser = $rootScope.sessUserDet.id;


                $http({
                    method  : 'POST',
                    async:   false,
                    url     : $scope.baseUrl+'/user/ajs1/getPImage',
                    data    : $.param({'userid':$rootScope.sessUserDet.id}),  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function(data) {
                    $rootScope.profileImage = $scope.baseUrl+'/uploads/user_image/thumb/'+data.profileImgName;
                });

            }else{
                $scope.msgFlag = true;
            }


        });
    };

});

homeControllers1.controller('edittopic', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal) {
    $scope.topicId = $stateParams.topicId;
    $scope.seesuser1 = 0;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.sessUserDet1 = $cookieStore.get('rootuserdet');
        $scope.seesuser1 = $scope.sessUserDet1.id;
    }

    $scope.form = {
        forumId : $scope.forumId,
        parentId : 0,
        user_id:$scope.seesuser1
    }

    $timeout(function(){
        $scope.getTopicDetails();
    },500);

    $scope.getTopicDetails = function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/getTopicDetails',
            data    : $.param({'id':$scope.topicId,sess_id:$scope.seesuser1}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }) .success(function(result) {
            $scope.topicDet = result;
            $scope.forumId = result.forum_id;

            $scope.form = {
                id:result.id,
                title:result.title,
                description:result.description,
            }

        }).error(function (result) {
            $scope.getTopicDetails();
        });
    }

    $scope.addTopicForm = function(){
        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/editTopic',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(result) {
            $rootScope.stateIsLoading = false;
            $state.go('forumdetails',{forumId:$scope.forumId});
            return;
        });
    }

    $scope.submitloginForm = function() {
        $rootScope.stateIsLoading = true;
        $scope.msgFlag = false;

        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/login',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;

            if(typeof (data.id) != 'undefined'){
                $cookieStore.put('login_email1',$scope.form.email);
                $cookieStore.put('login_password1',$scope.form.password);

                //$rootScope.rootUserImage = data.user_image;
                //$rootScope.rootUserCoverImage = data.user_cover_image;
                $scope.alldata = data;

                //$scope.alldata.user_image = '';
                // $scope.alldata.user_cover_image = '';

                $cookieStore.put('rootuserdet',$scope.alldata);

                $rootScope.sessUserDet = $cookieStore.get('rootuserdet');
                $rootScope.sessUser = $rootScope.sessUserDet.id;


                $http({
                    method  : 'POST',
                    async:   false,
                    url     : $scope.baseUrl+'/user/ajs1/getPImage',
                    data    : $.param({'userid':$rootScope.sessUserDet.id}),  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function(data) {
                    $rootScope.profileImage = $scope.baseUrl+'/uploads/user_image/thumb/'+data.profileImgName;
                });

            }else{
                $scope.msgFlag = true;
            }


        });
    };

});

homeControllers1.controller('settings', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal) {
    $scope.userId = 0;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.userId = $scope.userDet.id;
    }else{
        $state.go('index');
        return
    }

    $scope.searchkey = '';
    $scope.userList = [];

    $timeout(function(){
        $scope.getBlockpeople();
    },500);

    $scope.getBlockpeople = function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/getBlockpeople',
            data    : $.param({cuser:$scope.userId}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(result) {
            $scope.blockList = result;
        }).error(function (result) {
            $scope.getBlockpeople();
        });
    }

    var modalInstance;
    $scope.modalClose = function(){
        modalInstance.dismiss('cancel');
    }

    $scope.block = function(){
        if($scope.searchkey != ''){
            $scope.animationsEnabled = true;

            $rootScope.stateIsLoading = true;
            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs1/searchUser',
                data    : $.param({searchkey : $scope.searchkey,cuser:$scope.userId}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }) .success(function(result) {
                $rootScope.stateIsLoading = false;

                $scope.userList = result;

                modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'userModal',
                    windowClass: 'userModalCls',
                    size: 'lg',
                    scope : $scope
                });


            });
        }
    }

    $scope.blockpeople = function(uid){
        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/blockpeople',
            data    : $.param({uid : uid,cuser:$scope.userId}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(result) {
            $rootScope.stateIsLoading = false;

            modalInstance.dismiss('cancel');

            if(result.status == 1){
                $scope.blockList.push(result.udet);
            }

        }).error(function (result) {
            $scope.blockpeople(uid);
        });
    }

    $scope.unblockpeople = function(item){
        var idx = $scope.blockList.indexOf(item);

        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/unblockpeople',
            data    : $.param({uid : item.id,cuser:$scope.userId}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(result) {
            $rootScope.stateIsLoading = false;

            $scope.blockList.splice(idx,1);

        }).error(function (result) {
            $scope.unblockpeople(item);
        });
    }

});

homeControllers1.controller('groupdetail1', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal,$filter) {
    $scope.userId = 0;
    $scope.groupId = $rootScope.rootgroupId = $stateParams.groupId;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.userId= $scope.sessUser =$rootScope.rootsessUser = $scope.userDet.id;
    }

    $timeout(function(){
        $scope.getGroupDet();
    },500);

    $scope.getGroupDet = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getGroupDet',
            data    : $.param({'id':$scope.groupId,sess_id:$scope.userId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            // var user_str = result.name+'-'+result.sp_name;
            var user_str = result.name;
            user_str = $filter('lowercase')(user_str);
            user_str = user_str.replace(/\s+/g, '-');
            //user_str = encodeURI(user_str);

            $state.go('groupdetail1',{groupId:$scope.groupId,groupStr:user_str});
            return;
        }).error(function (result) {
            $scope.getGroupDet();
        });
    }

});

homeControllers1.controller('groupdetail', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal,MetaService,$location,$interval) {

    $scope.userId = 0;
    $scope.groupId = $rootScope.rootgroupId = $stateParams.groupId;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.userId= $scope.sessUser =$rootScope.rootsessUser = $scope.userDet.id;
    }

    $scope.someMethod = function(){
        $scope.mapcommonfunc();
        $scope.bannerload()
    }

    $scope.groupDet = {
        imgSrc : $scope.baseUrl+'/uploads/user_image/default_latest_user.jpg',
        cover_imageSrc : $scope.baseUrl+'/uploads/user_image/default_latest_back.jpg'
    }

    $scope.gotogroupmember = function(groupId){
        $state.go('groupmember',{groupId: groupId});
        return;
    }

    $scope.gotogroupnonmember = function(groupId){
        $state.go('groupnonmember',{groupId: groupId});
        return;
    }

    $( window ).resize(function() {
        $timeout(function(){
            $scope.setbannerdim221();
        },1000);
    });


    $timeout(function(){
        $scope.setbannerdim221();
    },100);

    $scope.setbannerdim221 = function(){

        var ban2no = $('.banner2').find('simple-slider').find('a').length;
        var ban3no = $('.banner3').find('simple-slider').find('a').length;

        if(ban2no > 0 && ban3no >0){

            $rootScope.widowWidth = $(window).width();
            $scope.widowWidthPage = $(window).width();
            $scope.bannerwidth = (($scope.widowWidthPage *90)/100);
            $scope.bannerwidth = (($scope.bannerwidth *39)/100);
            $scope.bannerwidth = parseInt($scope.bannerwidth);

            $scope.bannerheight1 = (($scope.bannerwidth*142)/501);
            $scope.bannerheight1 = parseInt($scope.bannerheight1);

            $scope.bannerheight2 = (($scope.bannerwidth*282)/501);
            $scope.bannerheight2 = parseInt($scope.bannerheight2);

            console.log('$scope.bannerwidth : '+$scope.bannerwidth);
            console.log('$scope.bannerheight1 : '+$scope.bannerheight1);
            console.log('$scope.bannerheight2 : '+$scope.bannerheight2);

            $('.banner2').find('.adspace').css("cssText", "height: "+$scope.bannerheight1+"px !important;");
            $('.banner2').find('.adspace').find('.bannerdiv225').css('height',$scope.bannerheight1+'px');

            $('.banner3').find('.adspace').css("cssText", "height: "+$scope.bannerheight2+"px !important;");
            $('.banner3').find('.adspace').find('.bannerdiv225').css('height',$scope.bannerheight2+'px');
        }else{
            $timeout(function(){
                $scope.setbannerdim221();
            },100);
        }

    }

    /************************************************************************/
    $scope.mapfullnotload = true;
    $scope.rootmap = {};
    $scope.markerIndex = 0;
    $scope.allmarker = [];
    $scope.slicemarker = [];
    $scope.mapcommonfunc = function(){
        $scope.zoomlevel = 9;

        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getCurLocation',
            data    : $.param({'userid':$scope.userId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {


            $scope.markerIndex1 = 0;
            $scope.allmarker1 = result.marker;
            $scope.slicemarker1 = $scope.allmarker1.slice($scope.markerIndex1, 10);


            console.log($scope.slicemarker.length);

            $timeout(function(){
                $scope.markerpush1();
            },10000);

            $scope.rootmap = {
                dragZoom: {options: {}},
                control:{},
                center: {
                    latitude: result.latitude,
                    longitude: result.longitude
                },
                options : {
                    scrollwheel : false,
                },
                pan: true,
                zoom: $scope.zoomlevel,
                refresh: false,
                events: {

                    idle: function (rootmap) {

                        $timeout(function() {


                            $interval(function(){

                                var visibleMarkers = [];

                                if(typeof($scope.rootmap.bounds.southwest) != 'undefined' && typeof($scope.rootmap.bounds.northeast) != 'undefined'){
                                    angular.forEach(result.marker, function(marker, key) {
                                        if ($scope.rootmap.bounds.southwest.latitude < marker.latitude
                                            && marker.latitude < $scope.rootmap.bounds.northeast.latitude
                                            && $scope.rootmap.bounds.southwest.longitude < marker.longitude
                                            && marker.longitude < $scope.rootmap.bounds.northeast.longitude) {

                                            visibleMarkers.push(marker);
                                        }
                                    });

                                    $scope.visibleMarkers = visibleMarkers;

                                    if($scope.visibleMarkers.length < 5){
                                        $scope.zoomlevel = parseInt($scope.zoomlevel)-1;


                                        $scope.rootmap.zoom = parseFloat(parseInt($scope.zoomlevel)-1);
                                        // console.log($rootScope.map.zoom);
                                    }
                                }


                            },3000);





                        }, 0);

                    }


                },
                bounds:{},
                markers: $scope.slicemarker1,
                openedCanadaWindows:{},
                onWindowCloseClick: function(gMarker, eventName, model){
                    if(model.dowShow !== null && model.dowShow !== undefined)
                        return model.doShow = false;

                },
                markerEvents: {
                    click:function(gMarker, eventName, model){
                        angular.element( document.querySelector( '#infoWin' ) ).html(model.infoHtml);
                        model.doShow = true;
                        $scope.rootmap.openedCanadaWindows = model;
                    }
                }


            };


            $scope.rootmap.markers.forEach(function(model){
                model.closeClick = function(){
                    model.doShow = false;
                };
            });

            $scope.mapfullnotload = false;

        }).error(function (result) {
            $scope.mapcommonfunc();
        });

    }

    $scope.markerpush1 = function(){
        var i;
        for(i=$scope.markerIndex1; i<($scope.markerIndex1+10);i++){
            if(typeof ($scope.allmarker1[i]) != 'undefined')
                $scope.slicemarker1.push($scope.allmarker1[i]);
        }

        $scope.markerIndex1 += 10;
        console.log($scope.slicemarker1.length);
        if($scope.slicemarker1.length < $scope.allmarker1.length){
            $timeout(function(){
                $scope.markerpush1();
            },5000);
        }else{
            console.log('marker load complete');
        }
    }

    $scope.bannerload = function(){
        $rootScope.bannerslides2 = [];
        $rootScope.bannerslides3 = [];

        $timeout(function(){
            $scope.getbanner2();
            $scope.getbanner3();
        },500);
    }

    $scope.getbanner2 = function(){
        $scope.spId = $scope.sportId;
        $scope.pageId = 4;

        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getBanner',
            data    : $.param({'pageid':$scope.pageId,'areaid':2,'sp_id':$scope.spId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.bannerslides2 = result;
        }).error(function (result) {
            $scope.getbanner2();
        });

    }

    $scope.getbanner3 = function(){
        $scope.spId = $scope.sportId;
        $scope.pageId = 4;

        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getBanner',
            data    : $.param({'pageid':$scope.pageId,'areaid':3,'sp_id':$scope.spId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.bannerslides3 = result;
        }).error(function (result) {
            $scope.getbanner3();
        });
    }

    $rootScope.openBanner = function(url){
        window.open(url);
    };

    /************************************************************************/

    $scope.option = {
        words: ['test'],
        color: '#f7931d'
    };

    $scope.maintvfile = '';

    $scope.isMute = true;

    $timeout(function(){
        $scope.getMainTv();
        $scope.getlast3post();
        $scope.getMainBanner();
        $scope.getGroupDet();
    },500);

    $scope.getMainTv = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getMainTv',
        }).success(function (result) {
            $scope.maintv = result;
            $scope.maintvfile = $sce.trustAsResourceUrl($scope.baseUrl+'/uploads/video/converted/'+$scope.maintv.file);
            $scope.vidsources = [{src: $sce.trustAsResourceUrl($scope.baseUrl+'/uploads/video/converted/'+$scope.maintv.file), type: "video/mp4"}];


            setTimeout(function(){
                angular.element( document.querySelector( '#maintvDiv' ) ).html('<video id="maintvVideo" volume="0" width="100%" autoplay loop muted controls>\
            <source src="'+$scope.maintvfile+'" type="video/mp4">\
            </video>');
            },2000);
        }).error(function (result) {
            $scope.getMainTv();
        });
    }

    $scope.resizeTextarea1 = function(event){
        var target = event.target || event.srcElement || event.originalTarget;

        target.parentElement.parentElement.style.setProperty ("height", target.scrollHeight+'px', "important");
        target.style.setProperty ("height", target.scrollHeight+'px', "important");
    }

    $scope.getlast3post = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getlast3post',
        }).success(function (result) {
            $scope.forumList = result;
        }).error(function (result) {
            $scope.getlast3post();
        });
    }

    $scope.mainbanner = 'default.png';

    $scope.getMainBanner = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getMainBanner',
        }).success(function (result) {
            $scope.mainbanner = result;
        }).error(function (result) {
            $scope.getMainBanner();
        });
    }

    $scope.getGroupDet = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getGroupDet',
            data    : $.param({'id':$scope.groupId,sess_id:$scope.userId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            if(typeof result.id == 'undefined'){
                $state.go('index');
                return
            }else{
                $scope.groupDet = result;
                $scope.isMember = result.is_member;
                if(jQuery.inArray( $scope.userId, result.admin ) >= 0){
                    $scope.isAdmin = 1;
                    $scope.settings =  {
                        title: 'settings',
                        url: 'settings.tpl.html'
                    };

                    $rootScope.tabs.splice(1,0,$scope.settings);

                }
                $scope.form = {
                    id: result.id,
                    name: result.name,
                    description: result.description,
                    notify:0
                }


                var user_str = result.name+','+result.sp_name;


                $rootScope.metaservice = MetaService;
                $rootScope.metaservice.set(user_str);
            }
        }).error(function (result) {
            $scope.getGroupDet();
        });
    }

    $scope.joingroup = function(id){
        $rootScope.stateIsLoading = true;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/joingroup',
            data    : $.param({'groupid':id,user_id:$scope.userId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.stateIsLoading = false;
            if(result == 1){
                $scope.isMember = 1;
            }
        });
    }

    $scope.leavegroup = function(id){
        $rootScope.stateIsLoading = true;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/leavegroup',
            data    : $.param({'groupid':id,user_id:$scope.userId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.stateIsLoading = false;
            if(result == 1){
                $scope.isMember = 0;
            }
        });
    }

    $scope.groupSettings = function(){
        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/groupSettings',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {


            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/getGroupDet',
                data    : $.param({'id':$scope.groupId,sess_id:$scope.userId}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $rootScope.stateIsLoading = false;
                if(typeof result.id == 'undefined'){
                    $state.go('index');
                    return
                }else{
                    $scope.groupDet = result;
                    $scope.isMember = result.is_member;
                    if(jQuery.inArray( $scope.userId, result.admin ) >= 0){
                        $scope.isAdmin = 1;
                    }
                    $scope.form = {
                        id: result.id,
                        name: result.name,
                        description: result.description,
                        notify:0
                    }
                }
            });
        });
    }

    $scope.isStatusInput = 0;
    $scope.isRotateBtn = 0;
    $scope.photoval = '';
    $scope.videoval1 = '';
    $scope.videoval2 = '';
    $scope.isPhoto = 0;
    $scope.isVideo = 0;
    $scope.statusType = '';
    $scope.statusValue = '';
    $scope.statusText = '';
    $scope.shareVal = 1;
    $scope.group = $scope.groupId;
    $scope.share_with = 1;

    $scope.openStatusInput = function(){
        $scope.isStatusInput = 1;
    }

    $scope.chnagestatusval = function(event){
        $scope.statusText = event.currentTarget.value;
    }

    $scope.addPhoto = function(){
        $scope.videoval1 = '';
        $scope.photoval = '';
        $scope.videoval2 = '';
        $scope.isVideo = 0;
        $scope.isPhoto = 1;
        $scope.isStatusInput = 0;
    }

    $scope.addVideo = function(){
        $scope.videoval1 = '';
        $scope.photoval = '';
        $scope.videoval2 = '';
        $scope.isPhoto = 0;
        $scope.isVideo = 1;
        $scope.isStatusInput = 0;
    }

    $scope.cancelStatus = function(){
        $scope.isStatusInput = 0;
        $scope.isRotateBtn = 0;
        $scope.photoval = '';
        $scope.videoval1 = '';
        $scope.videoval2 = '';
        $scope.isPhoto = 0;
        $scope.isVideo = 0;
        $scope.statusType = '';
        $scope.statusValue = '';
        $scope.statusText = '';
        $scope.shareVal = 1;
        $scope.group = $scope.groupId;

        angular.element( document.querySelector( '#statusText' ) ).val('');
        angular.element( document.querySelector( '.highlightTextarea-highlighter' ) ).html('');
        angular.element( document.querySelector( '#extracted_url' )).html('');
        angular.element( document.querySelector( '#statusText' )).css('height','52px');
        angular.element( document.querySelector( '#text-box' )).css('height','52px');

        $scope.statusText1 = '';

    }

    setTimeout(function(){
        $('textarea').highlightTextarea({
            words:[]
        });
    },6000);

    $scope.getExactRunning = 0;


    $scope.statusText1 = '';

    $scope.tetshigh = function(event){
        var strss = event.currentTarget.value;
        var re = /(?:^|\W)#(\w+)(?!\w)/g, match, matches ;
        while (match = re.exec(strss)) {
            var hastag = '#'+match[1];
            $('.highlightTextarea-highlighter').html($('.highlightTextarea-highlighter').html().replace(hastag,'<span style="color:#fff;background-color:#F7931D; z-index: 9; position: relative;">'+hastag+'</span>'));
        }

        var match_url = /\b(https?):\/\/([\-A-Z0-9.]+)(\/[\-A-Z0-9+&@#\/%=~_|!:,.;]*)?(\?[A-Z0-9+&@#\/%=~_|!:,.;]*)?/i;

        $scope.thumbImage = [];

        if (match_url.test(strss)) {
            $scope.getExactRunning = 1;

            var extracted_url = strss.match(match_url)[0];

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/extract-process.php',
                data    : $.param({'url': extracted_url}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }) .success(function(data) {
                $scope.getExactRunning = 0;

                var total_images = parseInt(data.images.length-1);
                var img_arr_pos = 0;


                var content = '';
                var content1 = '';

                if(data.title != ''){
                    content += '<div class="extracted_url">';
                    content1 += '<div class="extracted_url">';
                    if(data.images.length > 0){
                        content += '<div class="extracted_thumb" id="extracted_thumb"><img src="'+data.images[img_arr_pos]+'"></div>';
                        content1 += '<div class="extracted_thumb"><img src="'+data.images[img_arr_pos]+'"></div>';
                        if(data.images.length > 1) {
                            content += '<div class="thumb_sel"><span class="prev_thumb" id="thumb_prev">prev</span><span class="next_thumb" id="thumb_next">next</span> </div>';
                        }
                    }
                    content += '<div class="extracted_content"><h4><a href="'+extracted_url+'" target="_blank">'+data.title+'</a></h4>';
                    content1 += '<div class="extracted_content"><h4><a href="'+extracted_url+'" target="_blank">'+data.title+'</a></h4>';
                    content += '<p>'+data.description+'</p>';
                    content1 += '<p>'+data.description+'</p>';
                    content += '<div class="clear"></div></div>';
                    content1 += '<div class="clear"></div></div>';
                    content += '<div class="clear"></div></div>';
                    content1 += '<div class="clear"></div></div>';
                }

                angular.element( document.querySelector( '#extracted_url' )).html(content);

                $scope.statusText1 = content1;


                $("#thumb_prev").click( function(e){
                    if(img_arr_pos>0)
                    {
                        img_arr_pos--;
                        $("#extracted_thumb").html('<img src="'+data.images[img_arr_pos]+'">');

                        $scope.statusText1 = '<div class="extracted_url"><div class="extracted_thumb"><img src="'+data.images[img_arr_pos]+'"></div><div class="extracted_content"><h4><a href="'+extracted_url+'" target="_blank">'+data.title+'</a></h4><p>'+data.description+'</p><div class="clear"></div></div><div class="clear"></div></div>';

                    }
                });
                $("#thumb_next").click( function(e){
                    if(img_arr_pos<total_images)
                    {
                        img_arr_pos++; //thmubnail array position increment
                        $("#extracted_thumb").html('<img src="'+data.images[img_arr_pos]+'">');

                        $scope.statusText1 = '<div class="extracted_url"><div class="extracted_thumb"><img src="'+data.images[img_arr_pos]+'"></div><div class="extracted_content"><h4><a href="'+extracted_url+'" target="_blank">'+data.title+'</a></h4><p>'+data.description+'</p><div class="clear"></div></div><div class="clear"></div></div>';

                    }
                });

            });
        }else{
            angular.element( document.querySelector( '#extracted_url' )).html('');
        }


    }

    $scope.postStatus = function(){

        if($scope.statusText || $scope.statusValue){
            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/statusUpdate',
                data    : $.param({'msg':$scope.statusText,'msg1':$scope.statusText1,'share_with':$scope.shareVal,'group_id':$scope.group,'type':$scope.statusType,'value':$scope.statusValue,'is_status':1,'status_id':$scope.status_id,'user_id':$scope.sessUser}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.isStatusInput = 0;
                $scope.isRotateBtn = 0;
                $scope.photoval = '';
                $scope.videoval1 = '';
                $scope.videoval2 = '';
                $scope.isPhoto = 0;
                $scope.isVideo = 0;
                $scope.statusType = '';
                $scope.statusValue = '';
                $scope.statusText = '';
                $scope.shareVal = 1;
                $scope.group = $scope.groupId;
                $scope.status_id = 0;

                $scope.localfilepath = '';
                $scope.videoTempval = '';
                $scope.videoval3 = 0;


                $scope.statusList.splice(0, 0, result);
                $scope.offset = $scope.offset+1;

                angular.element( document.querySelector( '#statusText' ) ).val('');
                angular.element( document.querySelector( '.highlightTextarea-highlighter' ) ).html('');
                angular.element( document.querySelector( '#extracted_url' )).html('');
                angular.element( document.querySelector( '#statusText' )).css('height','52px');
                angular.element( document.querySelector( '#text-box' )).css('height','52px');




            });
        /*}else{

            $scope.Commentmsg = ngDialog.open({
                template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Please Enter Comment.</div>',
                plain:true,
                showClose:false,
                closeByDocument: true,
                closeByEscape: true
            });

            $timeout(function(){
                $scope.Commentmsg.close();
            },3000);*/
        }
    }

    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
        '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    $scope.$watch('statusImage', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload(file);
                })(files[i]);
            }
        }
    });

    function upload(file) {
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {
        file.upload = Upload.upload({
            url: $scope.baseUrl+'/user/ajs1/statusImgUp' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {username: $scope.username},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            $('.progress').addClass('ng-hide');
            file.result = response.data;

            var ctime = (new Date).getTime();


            $scope.isStatusInput = 0;
            $scope.isRotateBtn = 0;
            $scope.photoval = '';
            $scope.videoval1 = '';
            $scope.videoval2 = '';
            $scope.isPhoto = 0;
            $scope.isVideo = 0;
            $scope.statusType = '';
            $scope.statusValue = '';
            $scope.shareVal = 1;




            $scope.isPhoto = 0;
            $scope.photoval = 'images/fileloader.gif';
            $scope.statusType = 'image';

            $scope.isStatusInput = 1;
            $scope.isRotateBtn = 1;


            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs1/statusimgresize',
                data    : $.param({'filename':response.data}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function(data) {
                $scope.photoval = response.data;
                $scope.statusValue = response.data;
            });

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            if(file.progress <100){
                file.progresstext = file.progress + '%';
            }else{
                file.progresstext = '99%';
            }

        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }

    $scope.$watch('statusVideo', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload1(file);
                })(files[i]);
            }
        }
    });

    function upload1(file) {
        $scope.errorMsg = null;
        uploadUsingUpload1(file);
    }

    function uploadUsingUpload1(file) {
        file.upload = Upload.upload({
            url: $scope.baseUrl+'/user/ajs1/statusVidUp' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {username: $scope.username},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            file.result = response.data;
            $('.progress').addClass('ng-hide');

            var ctime = (new Date).getTime();

            $scope.isStatusInput = 0;
            $scope.isRotateBtn = 0;
            $scope.photoval = '';
            $scope.videoval1 = '';
            $scope.videoval2 = '';
            $scope.isPhoto = 0;
            $scope.isVideo = 0;
            $scope.statusType = '';
            $scope.statusValue = '';
            $scope.shareVal = 1;


            $scope.videoval1 = '';
            $scope.photoval = '';
            $scope.videoval2 = 'images/fileloader.gif';
            $scope.isPhoto = 0;
            $scope.isVideo = 0;

            $scope.isPhoto = 0;
            $scope.statusType = 'video';
            $scope.statusValue = '';
            $scope.isStatusInput = 1;


            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs1/videoprocess',
                data    : $.param({'file_name':response.data}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function(res2) {
                $scope.videoval2 = res2;
                $scope.statusValue = res2;

            });


        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            if(file.progress <100){
                file.progresstext = file.progress + '%';
            }else{
                file.progresstext = '99%';
            }
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }

    $scope.youtubeSearch = function(){
        if($scope.youtubeTxt == ''){

            $scope.Commentmsg = ngDialog.open({
                template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Please enter search key.</div>',
                plain:true,
                showClose:false,
                closeByDocument: true,
                closeByEscape: true
            });

            $timeout(function(){
                $scope.Commentmsg.close();
            },3000);

        }else{
            var dataurl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q='+$scope.youtubeTxt+'&maxResults=10&key=AIzaSyANefU-R8cD3udZvBqbDPqst7jMKvB_Hvo';
            $scope.youtubeTxt = '';

            $http.get(dataurl).success(function(data){
                $scope.vids = [];

                angular.forEach(data.items, function(value, key){
                    if(typeof (value.id.videoId) != 'undefined'){
                        $scope.vids.push(value);
                    }
                });

                $scope.ytdialog = ngDialog.open({
                    template: 'youtubeVideo',
                    showClose:false,
                    closeByDocument: true,
                    closeByEscape: true,
                    className : 'youtubePopup',
                    scope: $scope
                });
            });

        }
    }

    $scope.addYtVideo = function(item){


        $scope.isStatusInput = 0;
        $scope.isRotateBtn = 0;
        $scope.photoval = '';
        $scope.videoval1 = '';
        $scope.videoval2 = '';
        $scope.isPhoto = 0;
        $scope.isVideo = 0;
        $scope.statusType = '';
        $scope.statusValue = '';
        $scope.shareVal = 1;


        $scope.videoval1 = item.id.videoId;
        $scope.photoval = '';
        $scope.videoval2 = '';
        $scope.isPhoto = 0;
        $scope.isVideo = 0;

        $scope.isPhoto = 0;
        $scope.statusType = 'video';
        $scope.statusValue = item.id.videoId;
        $scope.isStatusInput = 1;

        $scope.ytdialog.close();
    }

    $scope.imgRotate = function(type){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/rotateleft',
            data    : $.param({'imgname':$scope.statusValue,'arg':type}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.photoval = result;
        });
    }

    $scope.$watch('files', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload5(file);
                })(files[i]);
            }
        }
    });


    $scope.$watch('coverfiles', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload51(file);
                    $rootScope.stateIsLoading = true;
                })(files[i]);
            }
        }
    });

    function upload5(file) {
        $scope.errorMsg = null;
        uploadUsingUpload5(file);
    }

    function upload51(file) {
        $scope.errorMsg = null;
        uploadUsingUpload51(file);
    }

    function uploadUsingUpload5(file) {
        file.upload = Upload.upload({
            url: $scope.baseUrl+'/user/ajs1/groupUploadify_process' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {username: $scope.username},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {

            var ctime = (new Date).getTime();

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs1/groupResizeimage1',
                data    : $.param({'filename':response.data,group_id:$scope.groupId}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function(data) {
                $('.progress').addClass('ng-hide');
                $scope.groupDet.imgSrc = $scope.baseUrl+'/uploads/group_image/thumb/'+response.data+'?version='+ctime;


                $scope.origeventImage = response.data+'?version='+ctime;

                $scope.imageBaseName = response.data.split('/').reverse()[0];

                $scope.cropGroupImage();





            });

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            if(file.progress <100){
                file.progresstext = file.progress + '%';
            }else{
                file.progresstext = '99%';
            }
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }


    function uploadUsingUpload51(file) {
        file.upload = Upload.upload({
            url: $scope.baseUrl+'/user/ajs1/groupUploadify_process1' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {username: $scope.username},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {

            var ctime = (new Date).getTime();

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs1/groupResizecoverimage1',
                data    : $.param({'filename':response.data,group_id:$scope.groupId}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function(data) {
                $rootScope.stateIsLoading = false;
                $scope.groupDet.cover_imageSrc = $scope.baseUrl+'/uploads/group_image/cover/thumb/'+response.data+'?version='+ctime;


                $scope.origGrCoverImage = response.data+'?version='+ctime;

                $scope.GrCoverimageBaseName = response.data.split('/').reverse()[0];

                $scope.cropGroupImage1();
                });

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            if(file.progress <100){
                file.progresstext = file.progress + '%';
            }else{
                file.progresstext = '99%';
            }
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }


    var modalInstance;
    $scope.modalClose = function(){
        modalInstance.dismiss('cancel');
    }

    $scope.cropGroupImage = function(){
        $scope.pLoad = true;

        $scope.animationsEnabled = true;
        modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'mymodal',
            windowClass: 'mymodalimg',
            size: 'lg',
            scope : $scope
        });

        $timeout(function(){

            $('.image-editor').cropit({
                exportZoom:1,
                imageBackground: true,
                imageBackgroundBorderWidth: 50,
                imageState: {
                    src: $scope.subUrl+'/uploads/group_image/'+$scope.origeventImage,
                },
            });
            $scope.pLoad = false;
        },3000);
    }

    $scope.cropGroupImage1 = function(){
        $scope.pLoad = true;

        $scope.animationsEnabled = true;
        modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'mymodal1',
            windowClass: 'mymodalimg',
            size: 'lg',
            scope : $scope
        });

        $timeout(function(){

            $('.image-editor1').cropit({
                exportZoom:1,
                imageBackground: true,
                imageBackgroundBorderWidth: 50,
                imageState: {
                    src: $scope.subUrl+'/uploads/group_image/cover/'+$scope.origGrCoverImage,
                },
            });
            $scope.pLoad = false;
        },3000);
    }

    $scope.changepreview = function(){
        $scope.imagedata1 = $('.image-editor').cropit('export');
    }

    $scope.changepreview1 = function(){
        $scope.imagedata11 = $('.image-editor1').cropit('export');
    }

    $scope.crop123 = function(){

        var imagedata = $('.image-editor').cropit('export');

        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/ImageSave41',
            data    : $.param({'filename':$scope.imageBaseName,'imagedata':imagedata,group_id:$scope.groupId}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function(data) {
            $scope.groupDet.imgSrc = data;
            modalInstance.dismiss('cancel');
        });
    }
    $scope.crop1231 = function(){

        var imagedata = $('.image-editor1').cropit('export');

        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/ImageSave412',
            data    : $.param({'filename':$scope.GrCoverimageBaseName,'imagedata':imagedata,group_id:$scope.groupId}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function(data) {
            $scope.groupDet.cover_imageSrc = data;
            modalInstance.dismiss('cancel');
        });
    }

    $scope.removeGroup = function(item){
        var idx = $scope.groupDet.member_det.indexOf(item);

        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/removegroup',
            data    : $.param({'group_id':$scope.groupId,user_id:$scope.groupDet.member_det[idx].id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.groupDet.member_det.splice(idx,1);
        });
    }

    $scope.joinGroup555  = function(item){
        var idx = $scope.groupDet.notmember_det.indexOf(item);

        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/joingroup',
            data    : $.param({'groupid':$scope.groupId,user_id:$scope.groupDet.notmember_det[idx].id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.groupDet.notmember_det.splice(idx,1);
        });
    }
});

homeControllers1.controller('sportdetail', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal,$interval) {

    $scope.userId = $rootScope.rootsessUser =$rootScope.sessUser = 0;
    $scope.sportId = $rootScope.rootsportId = $stateParams.sportId;
    if (typeof ($cookieStore.get('rootuserdet')) != 'undefined') {
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.userId = $rootScope.rootsessUser = $rootScope.sessUser = $scope.userDet.id;
    }

    $scope.someMethod = function(){
        $scope.mapcommonfunc();
        $scope.bannerload()
    }

    $( window ).resize(function() {
        $timeout(function(){
            $scope.setbannerdim221();
        },1000);
    });


    $timeout(function(){
        $scope.setbannerdim221();
    },100);

    $scope.setbannerdim221 = function(){

        var ban2no = $('.banner2').find('simple-slider').find('a').length;
        var ban3no = $('.banner3').find('simple-slider').find('a').length;

        if(ban2no > 0 && ban3no >0){

            $rootScope.widowWidth = $(window).width();
            $scope.widowWidthPage = $(window).width();
            $scope.bannerwidth = (($scope.widowWidthPage *90)/100);
            $scope.bannerwidth = (($scope.bannerwidth *39)/100);
            $scope.bannerwidth = parseInt($scope.bannerwidth);

            $scope.bannerheight1 = (($scope.bannerwidth*142)/501);
            $scope.bannerheight1 = parseInt($scope.bannerheight1);

            $scope.bannerheight2 = (($scope.bannerwidth*282)/501);
            $scope.bannerheight2 = parseInt($scope.bannerheight2);

            console.log('$scope.bannerwidth : '+$scope.bannerwidth);
            console.log('$scope.bannerheight1 : '+$scope.bannerheight1);
            console.log('$scope.bannerheight2 : '+$scope.bannerheight2);

            $('.banner2').find('.adspace').css("cssText", "height: "+$scope.bannerheight1+"px !important;");
            $('.banner2').find('.adspace').find('.bannerdiv225').css('height',$scope.bannerheight1+'px');

            $('.banner3').find('.adspace').css("cssText", "height: "+$scope.bannerheight2+"px !important;");
            $('.banner3').find('.adspace').find('.bannerdiv225').css('height',$scope.bannerheight2+'px');
        }else{
            $timeout(function(){
                $scope.setbannerdim221();
            },100);
        }

    }


    $scope.content = '';

    $timeout(function(){
        $scope.getsportDet();
        $scope.getlast3post();
        $scope.getspImagelist();
    },100);

    $scope.getsportDet = function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/sportDet',
            data    : $.param({'id':$scope.sportId}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $scope.banaerImages = data.bImage;
            $scope.communityUsers = data.community_pople;
            $scope.sportDet = data.sport_det;

            $scope.content = (data.sport_det.sport_desc);

            $('.color3').removeClass('ng-hide');
        }).error(function (result) {
            $scope.getsportDet();
        });
    }

    $scope.getlast3post = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getlast3post',
        }).success(function (result) {
            $scope.forumList = result;
        }).error(function (result) {
            $scope.getlast3post();
        });
    }

    $scope.slides = [];

    $scope.groupedSlides = [];

    var i, j, first = [],
        second, third;
    var many = 3;

    $scope.getspImagelist = function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/spImagelist',
            data    : $.param({'id':$scope.sportId}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(result) {
            //$scope.slides = result;
            if(result.length > 3){
                if(result.length%3 > 0){

                    angular.forEach(result, function(value, key){
                        $scope.slides.push(value);
                    });

                    angular.forEach(result, function(value, key){
                        $scope.slides.push(value);
                    });

                    angular.forEach(result, function(value, key){
                        $scope.slides.push(value);
                    });
                }else{
                    $scope.slides = result;
                }

                for (i = 0; i < $scope.slides.length; i += many) {
                    second = {
                        slide1: $scope.slides[i]
                    };
                    if (many == 1) {}
                    if ($scope.slides[i + 1] && (many == 2 || many == 3)) {
                        second.slide2 = $scope.slides[i + 1];

                    }
                    if ($scope.slides[i + (many - 1)] && many == 3) {
                        second.slide3 = $scope.slides[i + 2];
                    }
                    first.push(second);
                }
                $scope.groupedSlides = first;

            }else{
                $scope.slides = result;
            }
        }).error(function (result) {
            $scope.getspImagelist();
        });
    }

    $scope.mapfullnotload = true;
    $scope.mapcommonfunc = function(){
        $scope.zoomlevel = 9;

        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getCurLocation',
            data    : $.param({'userid':$scope.userId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {


            $scope.markerIndex = 0;
            $scope.allmarker = result.marker;
            $scope.slicemarker = $scope.allmarker.slice($scope.markerIndex, 10);


            console.log($scope.slicemarker.length);

            $timeout(function(){
                $scope.markerpush();
            },10000);

            $scope.rootmap = {
                dragZoom: {options: {}},
                control:{},
                center: {
                    latitude: result.latitude,
                    longitude: result.longitude
                },
                options : {
                    scrollwheel : false,
                },
                pan: true,
                zoom: $scope.zoomlevel,
                refresh: false,
                events: {

                    idle: function (rootmap) {

                        $timeout(function() {


                            $interval(function(){

                                var visibleMarkers = [];

                                if(typeof($scope.rootmap.bounds.southwest) != 'undefined' && typeof($scope.rootmap.bounds.northeast) != 'undefined'){
                                    angular.forEach(result.marker, function(marker, key) {
                                        if ($scope.rootmap.bounds.southwest.latitude < marker.latitude
                                            && marker.latitude < $scope.rootmap.bounds.northeast.latitude
                                            && $scope.rootmap.bounds.southwest.longitude < marker.longitude
                                            && marker.longitude < $scope.rootmap.bounds.northeast.longitude) {

                                            visibleMarkers.push(marker);
                                        }
                                    });

                                    $scope.visibleMarkers = visibleMarkers;

                                    if($scope.visibleMarkers.length < 5){
                                        $scope.zoomlevel = parseInt($scope.zoomlevel)-1;


                                        $scope.rootmap.zoom = parseFloat(parseInt($scope.zoomlevel)-1);
                                        // console.log($rootScope.map.zoom);
                                    }
                                }


                            },3000);





                        }, 0);

                    }


                },
                bounds:{},
                markers: $scope.slicemarker,
                openedCanadaWindows:{},
                onWindowCloseClick: function(gMarker, eventName, model){
                    if(model.dowShow !== null && model.dowShow !== undefined)
                        return model.doShow = false;

                },
                markerEvents: {
                    click:function(gMarker, eventName, model){
                        angular.element( document.querySelector( '#infoWin' ) ).html(model.infoHtml);
                        model.doShow = true;
                        $scope.rootmap.openedCanadaWindows = model;
                    }
                }


            };


            $scope.rootmap.markers.forEach(function(model){
                model.closeClick = function(){
                    model.doShow = false;
                };
            });

            $scope.mapfullnotload = false;



        }).error(function (result) {
            $scope.mapcommonfunc();
        });

    }

    $scope.markerpush = function(){
        var i;
        for(i=$scope.markerIndex; i<($scope.markerIndex+10);i++){
            if(typeof ($scope.allmarker[i]) != 'undefined')
                $scope.slicemarker.push($scope.allmarker[i]);
        }

        $scope.markerIndex += 10;
        console.log($scope.slicemarker.length);
        if($scope.slicemarker.length < $scope.allmarker.length){
            $timeout(function(){
                $scope.markerpush();
            },5000);
        }else{
            console.log('marker load complete');
        }
    }

    $scope.bannerload = function(){
        $rootScope.bannerslides2 = [];
        $rootScope.bannerslides3 = [];

        $timeout(function(){
            $scope.getbanner2();
            $scope.getbanner3();
        },200);
    }

    $scope.getbanner2 = function(){
        $scope.spId = $scope.sportId;
        $scope.pageId = 2;

        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getBanner',
            data    : $.param({'pageid':$scope.pageId,'areaid':2,'sp_id':$scope.spId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.bannerslides2 = result;
        }).error(function (result) {
            $scope.getbanner2();
        });
    }

    $scope.getbanner3 = function(){
        $scope.spId = $scope.sportId;
        $scope.pageId = 2;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getBanner',
            data    : $.param({'pageid':$scope.pageId,'areaid':3,'sp_id':$scope.spId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.bannerslides3 = result;
        }).error(function (result) {
            $scope.getbanner3();
        });
    }

    $rootScope.openBanner = function(url){
        window.open(url);
    };


});

homeControllers1.controller('groupalbum', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout) {
    $scope.sessUser = $rootScope.rootsessUser = 0;
    $scope.groupId = $stateParams.groupId;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.sessUser = $scope.userDet.id;
        $rootScope.rootsessUser = $scope.userDet.id;
    }

    $scope.photoWindowWidth = $(window).width();

    $scope.photoLimit = 0;
    $scope.videoLimit = 0;

    $scope.photoTabs = [{
        title: 'photo',
        url: 'photo.tpl.html'
    }, {
        title: 'video',
        url: 'video.tpl.html'
    }];

    $scope.currentphotoTab = 'photo.tpl.html';

    $scope.onClickphotoTab = function (tab) {
        $scope.currentphotoTab = tab.url;
    }

    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentphotoTab;
    }

    $rootScope.photoList = [];
    $rootScope.videoList = [];

    $timeout(function(){
        $scope.getgroupimage();
        $scope.getgroupvideo();
    },200);

    $scope.getgroupimage = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getgroupimage',
            data    : $.param({'groupId':$scope.groupId,sess_id:$scope.sessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.photoList = result;

            $scope.photoLimit = 10;
            $scope.photoloading = true;
            $timeout(function(){
                $scope.photoloading = false;
                $scope.photolimitinc();
            },10000);

        }).error(function (result) {
            $scope.getgroupimage();
        });
    }

    $scope.photolimitinc = function(){
        $scope.photoloading = true;
        if($rootScope.photoList.length > $scope.photoLimit){
            $scope.photoLimit = $scope.photoLimit+10;

            $timeout(function(){
                $scope.photoloading = false;
                $scope.photolimitinc();
            },10000);
        }else{
            $scope.photoloading = false;
        }
    }

    $scope.getgroupvideo = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getgroupvideo',
            data    : $.param({'groupId':$scope.groupId,sess_id:$scope.sessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $rootScope.videoList = result;

            $scope.videoLimit = 10;
            $scope.videoloading = true;
            $timeout(function(){
                $scope.videoloading = false;
                $scope.videolimitinc();
            },10000);

        }).error(function (result) {
            $scope.getgroupvideo();
        });
    }

    $scope.videolimitinc = function(){
        $scope.videoloading = true;
        if($rootScope.videoList.length > $scope.videoLimit){
            $scope.videoLimit = $scope.videoLimit+10;

            $timeout(function(){
                $scope.videoloading = false;
                $scope.videolimitinc();
            },10000);
        }else{
            $scope.videoloading = false;
        }
    }

});

homeControllers1.controller('addgroup', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal) {
    $scope.sessUser = 0;
    $scope.allCheck = 0;
    $scope.groupImage = '';
    $scope.groupOrigImage = '';
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.sessUser = $scope.userDet.id;
    }else{
        $state.go('index');
        return
    }

    $scope.sportsList = [];

    $scope.form = {
        sports_id:0,
        type: 1,
        image:$scope.groupImage,
        orig_image:$scope.groupOrigImage,
        users : [],
        sess_user:$scope.sessUser
    }

    $timeout(function(){
        $scope.getallsports();
        $scope.getalluserList();
    },200);

    $scope.getallsports = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/allsports',
        }).success(function (result) {
            $scope.sportsList = result;
        }).error(function (result) {
            $scope.getallsports();
        });
    }

    $scope.selsp = function(){
        $('.activeimg').removeClass('activeimg');
    }

    $scope.userList = [];

    $scope.getalluserList = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/alluserList',
            data    : $.param({sess_id:$scope.sessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.userList = result;
        }).error(function (result) {
            $scope.getalluserList();
        });
    }

    $scope.userclick = function(id){
        var idx = $scope.form.users.indexOf(id);
        if (idx === -1) {
            $scope.form.users.push(id);
        }else{
            $scope.form.users.splice(idx,1);
        }
    }

    $scope.checkAll = function(){
        $scope.allCheck = 1;
        $scope.form.users=[];

        angular.forEach($scope.userList, function(val, key) {
            $scope.form.users.push(val.id);
        });
    }

    $scope.uncheckAll = function(){
        $scope.allCheck = 0;
        $scope.form.users=[];

    }

    $scope.$watch('files', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (file) {
                    upload(file);
                })(files[i]);
            }
        }
    });

    $scope.getReqParams = function () {
        return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
        '&errorMessage=' + $scope.serverErrorMsg : '';
    };

    function upload(file) {
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {
        file.upload = Upload.upload({
            url: $scope.baseUrl+'/user/ajs1/groupUploadify_process' + $scope.getReqParams(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            fields: {username: $scope.username},
            file: file,
            fileFormDataName: 'Filedata'
        });

        file.upload.then(function (response) {
            $scope.form.image = response.data;
            $scope.form.orig_image = response.data;

            var ctime = (new Date).getTime();

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs1/groupResizeimage',
                data    : $.param({'filename':response.data}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function(data) {
                $('.progress').addClass('ng-hide');
                $scope.groupImage = $scope.baseUrl+'/uploads/group_image/thumb/'+response.data+'?version='+ctime;


                $scope.origeventImage = response.data+'?version='+ctime;

                $scope.imageBaseName = response.data.split('/').reverse()[0];

                $scope.cropGroupImage();





            });

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            if(file.progress <100){
                file.progresstext = file.progress + '%';
            }else{
                file.progresstext = '99%';
            }
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }

    $scope.addGroupForm = function(){

        if($scope.form.image == ''){
            ngDialog.open({
                template: '<div style="text-align:center;">Please Upload Image</div>',
                plain:true,
                showClose:true,
                closeByDocument: false,
                closeByEscape: false
            });
        }else if($scope.form.sports_id == 0){
            ngDialog.open({
                template: '<div style="text-align:center;">Please Select Sport</div>',
                plain:true,
                showClose:true,
                closeByDocument: false,
                closeByEscape: false
            });
        }else{
            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs1/addGroup',
                data    : $.param($scope.form),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }) .success(function(data) {
                $scope.sucmsg = ngDialog.open({
                    template: '<div style="text-align:center;">Group Added Successfully</div>',
                    plain:true,
                    showClose:true,
                    closeByDocument: true,
                    closeByEscape: true
                });

                $timeout(function(){
                    $scope.sucmsg.close();
                    $state.go('groupdetail',{groupId:data});
                    return;
                },3000);
            });
        }

    }

    var modalInstance;
    $scope.modalClose = function(){
        modalInstance.dismiss('cancel');
    }

    $scope.cropGroupImage = function(){
        $scope.pLoad = true;

        $scope.animationsEnabled = true;
        modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'mymodal',
            windowClass: 'mymodalimg',
            size: 'lg',
            scope : $scope
        });

        $timeout(function(){

            $('.image-editor').cropit({
                exportZoom:1,
                imageBackground: true,
                imageBackgroundBorderWidth: 50,
                imageState: {
                    src: $scope.subUrl+'/uploads/group_image/'+$scope.origeventImage,
                },
            });
            $scope.pLoad = false;
        },5000);
    }

    $scope.changepreview = function(){
        $scope.imagedata1 = $('.image-editor').cropit('export');
    }

    $scope.crop123 = function(){

        var imagedata = $('.image-editor').cropit('export');

        $scope.form.image = $scope.imageBaseName+'.png';
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/ImageSave4',
            data    : $.param({'filename':$scope.imageBaseName,'imagedata':imagedata}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function(data) {
            $scope.groupImage = data;
            modalInstance.dismiss('cancel');
        });
    }

});

homeControllers1.controller('groupuser', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal) {
    $scope.ismember = 1;
    $scope.isAdmin = 0;
    if($state.current.name == 'groupnonmember')
        $scope.ismember = 0;

    $rootScope.tabBodyLoad = true;
    $scope.userId = 0;
    $scope.groupId = $rootScope.rootgroupId = $stateParams.groupId;


    $scope.getGroupDet = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getGroupDet',
            data    : $.param({'id':$scope.groupId,sess_id:$scope.userId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            if(jQuery.inArray( $scope.userId, result.admin ) >= 0){
                $scope.isAdmin = 1;
            }
        }).error(function (result) {
            $scope.getGroupDet();
        });
    }


    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.userId= $scope.sessUser =$rootScope.rootsessUser = $scope.userDet.id;

        $timeout(function(){
            $scope.getGroupDet();
        },200);
    }

    $timeout(function(){
        $scope.getGroupDet();
    },200);



    $scope.userList = [];
/*
    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getsports1',
    }).success(function (result) {
        angular.element( document.querySelector( '#select-search' ) ).append(result);
    });

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getCountryList',
    }).success(function (result) {
        $scope.countrylist = result;
    });

    $scope.statelist = [];

    $scope.changeCountry = function(event){

        $scope.statelist = [];
        $scope.searchText.user_state = '';

        if(typeof (event) != 'undefined'){
            $scope.statelist = [];
            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/getStateList',
                data    : $.param({'id':event}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (result) {
                $scope.statelist = result;
            });
        }

    }
*/
    $scope.tooltipVal = function(item){
        var fsgs ='<h2>'+item.user_name+'</h2><p>'+item.user_address+'</p>';
        return  fsgs;
    }

    if($state.current.name == 'groupnonmember'){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/groupNonMember',
            data    : $.param({'group_id':$scope.groupId,user_id:$scope.userId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.tabBodyLoad = false;
            $scope.userList = result;
        });
    }else{
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/groupMember',
            data    : $.param({'group_id':$scope.groupId,user_id:$scope.userId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.tabBodyLoad = false;
            $scope.userList = result;
        });
    }

    $scope.removeGroup = function(item){
        var idx = $scope.userList.indexOf(item);

        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/removegroup',
            data    : $.param({'group_id':$scope.groupId,user_id:$scope.userList[idx].id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.userList.splice(idx,1);
        });
    }

    $scope.joinGroup = function(item){
        var idx = $scope.userList.indexOf(item);

        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/joingroup',
            data    : $.param({'groupid':$scope.groupId,user_id:$scope.userList[idx].id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.userList.splice(idx,1);
        });
    }




});

homeControllers1.controller('hastag', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal,$facebook) {
    $scope.hastag = $stateParams.hastag;
    $scope.trustAsHtml = $sce.trustAsHtml;

    $scope.sessUser = 0;
    $scope.rootsessUser = 0;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.sessUser = $scope.userDet.id;
        $rootScope.rootsessUser = $scope.userDet.id;
    }

    $timeout(function(){
        $scope.getMainTv();
        $scope.getlast3post();
        $scope.getMainBanner();
        $scope.gethastagStatus();
    },200);

    $scope.getMainTv = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getMainTv',
        }).success(function (result) {
            $scope.maintv = result;
            $scope.maintvfile = $sce.trustAsResourceUrl($scope.baseUrl+'/uploads/video/converted/'+$scope.maintv.file);
            $scope.vidsources = [{src: $sce.trustAsResourceUrl($scope.baseUrl+'/uploads/video/converted/'+$scope.maintv.file), type: "video/mp4"}];


            setTimeout(function(){
                angular.element( document.querySelector( '#maintvDiv' ) ).html('<video id="maintvVideo" volume="0" width="100%" autoplay loop muted controls>\
            <source src="'+$scope.maintvfile+'" type="video/mp4">\
            </video>');
            },2000);

        }).error(function (result) {
            $scope.getMainTv();
        });
    }

    $scope.getlast3post = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getlast3post',
        }).success(function (result) {
            $scope.forumList = result;
        }).error(function (result) {
            $scope.getlast3post();
        });
    }

    $scope.mainbanner = 'default.png';

    $scope.getMainBanner = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getMainBanner',
        }).success(function (result) {
            $scope.mainbanner = result;
        }).error(function (result) {
            $scope.getMainBanner();
        });
    }

    $scope.gethastagStatus = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/gethastagStatus',
            data    : $.param({'hastag':$scope.hastag,'sess_user_id':$rootScope.rootsessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.statusList = result.status;


            angular.forEach($scope.statusList, function(item, key) {


                if(typeof(item.routes.id) !='undefined'){
                    item.routes.map.refresh =  function () {
                        item.routes.map.control.refresh(item.routes.map.center);
                    };
                    $timeout(function(){
                        item.routes.map.refresh();
                    },500);
                }



            });


        }).error(function (result) {
            $scope.gethastagStatus();
        });
    }

    $scope.showYoutubevdo = function(id,value){
        angular.element( document.querySelector( '#youtubeBody'+id ) ).html('<iframe width="100%" height="100%" src="https://www.youtube.com/embed/'+value+'?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>');
    }

    $scope.statusLike = function (item) {
        if(item.is_like){
            item.like_no = item.like_no-1;
        }else{
            item.like_no = item.like_no+1;
        }
        item.is_like = !item.is_like;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/likestatus',
            data    : $.param({'status_id':item.id,'user_id':item.c_user}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {

        });

    };

    $scope.changeShareWith = function(item,valu){
        item.share_with = valu;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/changeShareWith',
            data    : $.param({'status_id':item.id,'valu':valu}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {

        });
    }

    $scope.postComment = function(event,item){
        if(event.which === 13) {
            var commentval = event.currentTarget.value;
            if(commentval !='' && typeof(commentval)!= 'undefined'){
                $http({
                    method: 'POST',
                    async:   false,
                    url: $scope.baseUrl+'/user/ajs1/addcomment',
                    data    : $.param({'status_id':item.id,'cmnt_body':commentval,'user_id':$rootScope.rootsessUser}),
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function (result) {
                    if(item.comment_no){
                        item.comment.push(result);
                    }else{
                        item.comment = [result];
                    }
                    item.comment_no = item.comment_no +1;
                    event.currentTarget.value = '';
                });
            /*}else{

                $scope.Commentmsg = ngDialog.open({
                    template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Please Enter Comment.</div>',
                    plain:true,
                    showClose:false,
                    closeByDocument: true,
                    closeByEscape: true
                });

                $timeout(function(){
                    $scope.Commentmsg.close();
                },3000);*/
            }
        }
    }

    $scope.delStatus = function(index){
        $scope.confirmDialog = ngDialog.open({
            template: '<div style="text-align:center;  font-family: \'veneerregular\'; font-size: 19px;">Are you sure you want to delete this post?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm('+index+')" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
            plain:true,
            showClose:false,
            closeByDocument: false,
            closeByEscape: false,
            className : 'confirmPopup',
            scope:$scope
        });


    }

    $scope.delConfirm = function(index){
        $scope.confirmDialog.close();
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/delstatus',
            data    : $.param({'status_id':$scope.statusList[index].id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.statusList.splice(index,1);
        });
    }

    $scope.delComment = function(index,index1){
        $scope.confirmDialog = ngDialog.open({
            template: '<div style="text-align:center; font-family: \'veneerregular\'; font-size: 19px;">Are you sure you want to delete this comment?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm1('+index+','+index1+')" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
            plain:true,
            showClose:false,
            closeByDocument: false,
            closeByEscape: false,
            className : 'confirmPopup',
            scope:$scope
        });


    }

    $scope.delConfirm1 = function(index,index1){
        $scope.confirmDialog.close();
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/delcomment',
            data    : $.param({'comment_id':$rootScope.statusList[index].comment[index1].id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.statusList[index].comment.splice(index1,1);
            $scope.statusList[index].comment_no = $scope.statusList[index].comment_no -1;
        });
    }

    $scope.delCancel = function(){
        $scope.confirmDialog.close();
    }

    $scope.prShare = function(item){
        if(item.type == 'route'){
            var mapcontent = '<div class="rowtwo " style="float: none; width: 170px; margin:0; padding:0;  ">\
                    <h2 style="  word-wrap: break-word; width: 170px; margin-bottom: 2px; padding-bottom: 2px;color:#000!important">'+item.routes.route_name+'</h2>\
                <div class="date-contain" style="padding-top: 0px; margin-top: -3px;color:#000!important">\
                    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important" >\
                    <span style="color:#616564!important">DATE</span><br />'+item.routes.date+'</h5>\
            <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
            <span style="color:#616564!important">TIME</span><br />'+item.routes.duration+' </h5>\
    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
    <span style="color:#616564!important">DISTANCE</span><br />'+item.routes.distance+' miles</h5>\
</div></div>\
<img src="'+item.routes.sport_image+'" style="width:40px; display: block; margin: 0;"  alt="" />';
            $rootScope.stateIsLoading = true;
            $('#mapconmain').show();
            html2canvas($('#map'+item.id), {
                useCORS: true,
                onrendered: function(canvas) {
                    var url = canvas.toDataURL();

                    $http({
                        method: 'POST',
                        async:   false,
                        url: $scope.baseUrl+'/user/ajs1/canvastoimg',
                        data    : $.param({'data': url}),
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                    }).success(function (result) {
                        var mapImage = result;

                        $('#mapconmain').html(mapcontent);


                        html2canvas($('#mapconmain'), {
                            useCORS: true,
                            onrendered: function(canvas) {
                                var url = canvas.toDataURL();

                                $http({
                                    method: 'POST',
                                    async:   false,
                                    url: $scope.baseUrl+'/user/ajs1/canvastoimg1',
                                    data    : $.param({'data': url}),
                                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                }).success(function (result) {
                                    var divImage = result;

                                    $('#mapconmain').html('');

                                    $http({
                                        method: 'POST',
                                        async:   false,
                                        url: $scope.baseUrl+'/user/ajs1/imageMerge',
                                        data    : $.param({'image1':mapImage,'image2':divImage}),
                                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                    }).success(function (res) {

                                        $rootScope.stateIsLoading = false;

                                        var shareImage = 'http://torqkd.com/fbshare/img/'+res;
                                        $('#mapconmain').hide();
                                        window.open("http://pinterest.com/pin/create/button/?url=http://torqkd.com/&media="+shareImage+"&description=","_blank");


                                    });


                                });

                            }

                        });

                    });

                }

            });
        }else{
            window.open('http://pinterest.com/pin/create/button/?url=http://torkq.com/&media='+item.s_img+'&description=','_blank');
        }
    }

    $scope.twShare = function(item){
        if(item.type == 'route'){
            var mapcontent = '<div class="rowtwo " style="float: none; width: 170px; margin:0; padding:0;  ">\
                    <h2 style="  word-wrap: break-word; width: 170px; margin-bottom: 2px; padding-bottom: 2px;color:#000!important">'+item.routes.route_name+'</h2>\
                <div class="date-contain" style="padding-top: 0px; margin-top: -3px;color:#000!important">\
                    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important" >\
                    <span style="color:#616564!important">DATE</span><br />'+item.routes.date+'</h5>\
            <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
            <span style="color:#616564!important">TIME</span><br />'+item.routes.duration+' </h5>\
    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
    <span style="color:#616564!important">DISTANCE</span><br />'+item.routes.distance+' miles</h5>\
</div></div>\
<img src="'+item.routes.sport_image+'" style="width:40px; display: block; margin: 0;"  alt="" />';
            $rootScope.stateIsLoading = true;
            $('#mapconmain').show();
            html2canvas($('#map'+item.id), {
                useCORS: true,
                onrendered: function(canvas) {
                    var url = canvas.toDataURL();

                    $http({
                        method: 'POST',
                        async:   false,
                        url: $scope.baseUrl+'/user/ajs1/canvastoimg',
                        data    : $.param({'data': url}),
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                    }).success(function (result) {
                        var mapImage = result;

                        $('#mapconmain').html(mapcontent);


                        html2canvas($('#mapconmain'), {
                            useCORS: true,
                            onrendered: function(canvas) {
                                var url = canvas.toDataURL();

                                $http({
                                    method: 'POST',
                                    async:   false,
                                    url: $scope.baseUrl+'/user/ajs1/canvastoimg1',
                                    data    : $.param({'data': url}),
                                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                }).success(function (result) {
                                    var divImage = result;

                                    $('#mapconmain').html('');

                                    $http({
                                        method: 'POST',
                                        async:   false,
                                        url: $scope.baseUrl+'/user/ajs1/imageMerge',
                                        data    : $.param({'image1':mapImage,'image2':divImage}),
                                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                    }).success(function (res) {

                                        $rootScope.stateIsLoading = false;

                                        var shareImage = 'http://torqkd.com/fbshare/img/'+res;
                                        $('#mapconmain').hide();

                                        var sss = 'Tweet Compose';

                                        $scope.dialog2 = ngDialog.open({
                                            template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="twText" id="fbtext"> <a href="javascript:void(0)" ng-click="postTw(\''+shareImage+'\')" id="comment_btn">POST</a></div>',
                                            plain:true,
                                            closeByDocument: false,
                                            closeByEscape: false,
                                            scope: $scope
                                        });

                                    });


                                });

                            }

                        });

                    });

                }

            });
        }else{
            var sss = 'Say Something About This Post';

            if(item.type == 'image'){
                var sss = 'Say Something About This Picture';
            }
            if(item.type == 'mp4' || item.type == 'youtube'){
                var sss = 'Say Something About This Video';
            }

            $scope.dialog2 = ngDialog.open({
                template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="twText" id="fbtext"> <a href="javascript:void(0)" ng-click="postTw(\''+item.value+'\',\''+item.type+'\')" id="comment_btn">POST</a></div>',
                plain:true,
                closeByDocument: false,
                closeByEscape: false,
                scope: $scope
            });
        }
    };

    $scope.postTw = function(value,type){
        $scope.dialog2.close();
        var twText = $('#fbtext').val();

        var sType = 'text';
        if(type == 'image'){
            sType = 'statImg';
        }

        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getTwOauth',
            data    : $.param({'user_id':$rootScope.rootsessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            if(result.oauth_token == '' || result.oauth_token_secret == ''){
                window.location.href = ($scope.baseUrl+'/user/profile/twittershare1?image='+value+'&page=profile&com='+twText+'&userid='+$scope.sessUser+'&type='+sType);
            }else{
                $http({
                    method: 'POST',
                    async:   false,
                    url: $scope.baseUrl+'/twitter31.php',
                    data    : $.param({'type':sType,'oauth_token':result.oauth_token,'oauth_token_secret':result.oauth_token_secret,'com':twText,'image':value}),
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function (result) {
                    $scope.showTwSucMsg();
                });
            }
        });


    }

    $scope.showTwSucMsg = function(){
        $scope.showTwSucMsg1 = ngDialog.open({
            template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Posted Successfully On Twitter</div>',
            plain:true,
            showClose:false,
            closeByDocument: true,
            closeByEscape: true
        });

        setTimeout(function(){
            $scope.showTwSucMsg1.close();
        },3000);
    }

    $rootScope.fbShare = function(item){
        if(item.type == 'route'){
            var mapcontent = '<div class="rowtwo " style="float: none; width: 170px; margin:0; padding:0;  ">\
                    <h2 style="  word-wrap: break-word; width: 170px; margin-bottom: 2px; padding-bottom: 2px;color:#000!important">'+item.routes.route_name+'</h2>\
                <div class="date-contain" style="padding-top: 0px; margin-top: -3px;color:#000!important">\
                    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important" >\
                    <span style="color:#616564!important">DATE</span><br />'+item.routes.date+'</h5>\
            <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
            <span style="color:#616564!important">TIME</span><br />'+item.routes.duration+' </h5>\
    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
    <span style="color:#616564!important">DISTANCE</span><br />'+item.routes.distance+' miles</h5>\
</div></div>\
<img src="'+item.routes.sport_image+'" style="width:40px; display: block; margin: 0;"  alt="" />';
            $rootScope.stateIsLoading = true;
            $('#mapconmain').show();
            html2canvas($('#map'+item.id), {
                useCORS: true,
                onrendered: function(canvas) {
                    var url = canvas.toDataURL();

                    $http({
                        method: 'POST',
                        async:   false,
                        url: $scope.baseUrl+'/user/ajs1/canvastoimg',
                        data    : $.param({'data': url}),
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                    }).success(function (result) {
                        var mapImage = result;

                        $('#mapconmain').html(mapcontent);


                        html2canvas($('#mapconmain'), {
                            useCORS: true,
                            onrendered: function(canvas) {
                                var url = canvas.toDataURL();

                                $http({
                                    method: 'POST',
                                    async:   false,
                                    url: $scope.baseUrl+'/user/ajs1/canvastoimg1',
                                    data    : $.param({'data': url}),
                                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                }).success(function (result) {
                                    var divImage = result;

                                    $('#mapconmain').html('');

                                    $http({
                                        method: 'POST',
                                        async:   false,
                                        url: $scope.baseUrl+'/user/ajs1/imageMerge',
                                        data    : $.param({'image1':mapImage,'image2':divImage}),
                                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                    }).success(function (res) {

                                        $rootScope.stateIsLoading = false;

                                        var shareImage = 'http://torqkd.com/fbshare/img/'+res;
                                        $('#mapconmain').hide();

                                        if($scope.fbStatus) {
                                            $scope.getAuthResponse = $facebook.getAuthResponse();
                                            $scope.fb_share_route(shareImage,$scope.getAuthResponse.accessToken);
                                        } else {
                                            $facebook.login().then(function(){
                                                $scope.getAuthResponse = $facebook.getAuthResponse();
                                                $scope.fb_share_route(shareImage,$scope.getAuthResponse.accessToken);
                                            });
                                        }


                                    });


                                });

                            }

                        });

                    });

                }

            });
        }else{

            var sss = 'Say Something About This Post';

            if(item.type == 'image'){
                var sss = 'Say Something About This Picture';
            }
            if(item.type == 'mp4' || item.type == 'youtube'){
                var sss = 'Say Something About This Video';
            }

            $scope.dialog2 = ngDialog.open({
                template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="fbText" id="fbtext"> <a href="javascript:void(0);" ng-click="postfb('+item.id+',\''+item.type+'\',\''+item.value+'\')" id="comment_btn">POST</a></div>',
                plain:true,
                closeByDocument: false,
                closeByEscape: false,
                scope: $scope
            });

        }
    }

    $scope.postfb = function(id,type,value){
        if($scope.fbStatus) {
            $scope.getAuthResponse = $facebook.getAuthResponse();
            $scope.fb_share(id,type,value,$scope.getAuthResponse.accessToken);
        } else {
            $facebook.login().then(function(){
                $scope.getAuthResponse = $facebook.getAuthResponse();
                $scope.fb_share(id,type,value,$scope.getAuthResponse.accessToken);
            });
        }

    }

    $scope.$on('fb.auth.authResponseChange', function() {
        $scope.fbStatus = $facebook.isConnected();
    });

    $scope.fb_share_route = function(image,accessToken){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/updateAccessToken',
            data    : $.param({'accesstoken':accessToken,'id':$rootScope.rootsessUser}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
        });
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/postfbRoutes',
            data    : $.param({'image':image,'accessToken':accessToken}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.showFbSucMsg();
        });
    }

    $scope.fb_share = function(id,type,value,accessToken){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/updateAccessToken',
            data    : $.param({'accesstoken':accessToken,'id':$rootScope.rootsessUser}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
        });

        var fbtext = $('#fbtext').val();

        if(type == 'image'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/postfbimage',
                data    : $.param({'id':id,'image':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.dialog2.close();
                $scope.showFbSucMsg();
            });
        }else if(type == 'mp4'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/postfbvideo',
                data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.dialog2.close();
                $scope.showFbSucMsg();
            });
        }else if(type == 'youtube'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/postfbYtvideo',
                data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.dialog2.close();
                $scope.showFbSucMsg();
            });
        }else{

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/postfbText',
                data    : $.param({'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.dialog2.close();
                $scope.showFbSucMsg();
            });
        }



    }

    $scope.showFbSucMsg = function(){
        $scope.showFbSucMsg1 = ngDialog.open({
            template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Posted Successfully On Facebook</div>',
            plain:true,
            showClose:false,
            closeByDocument: true,
            closeByEscape: true
        });

        setTimeout(function(){
            $scope.showFbSucMsg1.close();
        },3000);
    }


    var modalInstance;
    $rootScope.showPhoto = function(item,index){

        $rootScope.photoDet = {
            id : item.id,
            itemId : item.id,
            imgSrc : item.s_img,
            s_img : item.s_img,
            userImage : item.user_image,
            user_id : item.user_id,
            value : item.value,
            type: 'image',
            userName : item.user_name,
            timeSpan : item.timespan,
            msg : item.msg,
            like_no : item.like_no,
            is_like : item.is_like,
            c_user:item.c_user,
            cUserImage : item.c_user_image,
            pstval : '',
            commentList:item.comment,
            sIndex:index
        };

        $scope.animationsEnabled = true;
        modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'photoComment',
            windowClass: 'photoPopup',
            size: 'lg',
            scope : $scope
        });

    }

    $scope.modalClose = function(){
        modalInstance.dismiss('cancel');
    }

    $rootScope.postComment1 = function(item){
        if(item.pstval && typeof(item.pstval)!= 'undefined'){
            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/addcomment',
                data    : $.param({'status_id':item.itemId,'cmnt_body':item.pstval,'user_id':$rootScope.rootsessUser}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                item.commentList.push(result);
                item.pstval = '';
            });
        /*}else{

            $scope.Commentmsg = ngDialog.open({
                template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Please Enter Comment.</div>',
                plain:true,
                showClose:false,
                closeByDocument: true,
                closeByEscape: true
            });

            $timeout(function(){
                $scope.Commentmsg.close();
            },3000);*/
        }
    };

});

homeControllers1.controller('allmessages', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal,$facebook,$filter) {

    $scope.sessUser = 0;
    $rootScope.rootsessUser = 0;


    $scope.curFrndId=0;

    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.sessUser = $scope.userDet.id;
        $rootScope.rootsessUser = $scope.userDet.id;
    }else{
        $state.go('index');
        return
    }


    $scope.min = function(arr) {
        return $filter('min')
        ($filter('map')(arr, 'id'));
    }

    $timeout(function(){
        $scope.getMainTv();
        $scope.getlast3post();
        $scope.getMainBanner();
        $scope.getMessageList
    },200);

    $scope.getMainTv = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getMainTv',
        }).success(function (result) {
            $scope.maintv = result;
            $scope.maintvfile = $sce.trustAsResourceUrl($scope.baseUrl+'/uploads/video/converted/'+$scope.maintv.file);
            $scope.vidsources = [{src: $sce.trustAsResourceUrl($scope.baseUrl+'/uploads/video/converted/'+$scope.maintv.file), type: "video/mp4"}];


            setTimeout(function(){
                angular.element( document.querySelector( '#maintvDiv' ) ).html('<video id="maintvVideo" volume="0" width="100%" autoplay loop muted controls>\
            <source src="'+$scope.maintvfile+'" type="video/mp4">\
            </video>');
            },2000);

        }).error(function (result) {
            $scope.getMainTv();
        });
    }

    $scope.getlast3post = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getlast3post',
        }).success(function (result) {
            $scope.forumList = result;
        }).error(function (result) {
            $scope.getlast3post();
        });
    }

    $scope.mainbanner = 'default.png';

    $scope.getMainBanner = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getMainBanner',
        }).success(function (result) {
            $scope.mainbanner = result;
        }).error(function (result) {
            $scope.getMainBanner();
        });
    }

    $scope.getMessageList = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getMessageList',
            data    : $.param({'cid':$scope.sessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.CmessageList1 = result;
            if(result.length){
                $scope.curFrndId=result[0].user_id;

                $scope.getUserMsgListfn($scope.curFrndId);

            }
        }).error(function (result) {
            $scope.getMessageList();
        });
    }

    $scope.getUserMsgListfn1 = function(fid){
        $scope.curFrndId = fid;
        $scope.getUserMsgListfn($scope.curFrndId);
    }

    $scope.getUserMsgListfn = function(){
        if($scope.curFrndId > 0){
            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/getUserMsgList',
                data    : $.param({'cid':$scope.sessUser,frnd_id:$scope.curFrndId}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.getUserMsgList = result;

                $timeout(function(){
                    $scope.getUserMsgListfn($scope.curFrndId);
                },5000);
            }).error(function (result) {
                $scope.getUserMsgListfn($scope.curFrndId);
            });
        }else{
            $scope.getUserMsgListfn($scope.curFrndId);
        }
    }

    $scope.reply = '';
    $scope.addReply = function(){
        var replyval = $('#replydiv441').html();
        if(replyval == '' || replyval == '<br>'){
            console.log(1);
        }else{
            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/send_msg1',
                data    : $.param({'cid':$scope.sessUser,'uid':$scope.curFrndId,'msg':replyval}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.getUserMsgList.push(result);

                $('#replydiv441').html('');
                $('#cxvxcvs441').hide();

            });
        }
    }


    $rootScope.cxvxzxczcvs441 = function(){
        if ($('#cxvxcvs441').is(':hidden')) {
            $('#cxvxcvs441').show();
        }else{
            $('#cxvxcvs441').hide();
        }
    }

    $scope.emoinsert441 = function(emoitem){
        var emoval = '<input title="'+emoitem+'" style="border:none; margin-left: 3px; margin-right: 3px;" class="emoticon emoticon-'+emoitem+'" />';

        var prevval = $('#replydiv441').html();

        if(prevval.substr(prevval.length - 4) == '<br>')
            prevval = prevval.substring(0, prevval.length - 4);

        $('#replydiv441').html(prevval+emoval);
    }



});

homeControllers1.controller('allnotification', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal,$facebook,$filter) {

    $scope.sessUser = 0;
    $rootScope.rootsessUser = 0;

    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.sessUser = $scope.userDet.id;
        $rootScope.rootsessUser = $scope.userDet.id;
    }else{
        $state.go('index');
        return
    }


    $scope.min = function(arr) {
        return $filter('min')
        ($filter('map')(arr, 'id'));
    }

    $timeout(function(){
        $scope.getMainTv();
        $scope.getlast3post();
        $scope.getMainBanner();
    },500);

    $scope.getMainTv = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getMainTv',
        }).success(function (result) {
            $scope.maintv = result;
            $scope.maintvfile = $sce.trustAsResourceUrl($scope.baseUrl+'/uploads/video/converted/'+$scope.maintv.file);
            $scope.vidsources = [{src: $sce.trustAsResourceUrl($scope.baseUrl+'/uploads/video/converted/'+$scope.maintv.file), type: "video/mp4"}];

            setTimeout(function(){
                angular.element( document.querySelector( '#maintvDiv' ) ).html('<video id="maintvVideo" volume="0" width="100%" autoplay loop muted controls>\
            <source src="'+$scope.maintvfile+'" type="video/mp4">\
            </video>');
            },2000);

        }).error(function (result) {
            $scope.getMainTv();
        });
    }

    $scope.getlast3post = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getlast3post',
        }).success(function (result) {
            $scope.forumList = result;
        }).error(function (result) {
            $scope.getlast3post();
        });
    }

    $scope.mainbanner = 'default.png';

    $scope.getMainBanner = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getMainBanner',
        }).success(function (result) {
            $scope.mainbanner = result;
        }).error(function (result) {
            $scope.getMainBanner();
        });
    }

});

homeControllers1.controller('singlepost', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal,$facebook) {
    $scope.postid = $stateParams.id;
    $scope.trustAsHtml = $sce.trustAsHtml;

    $scope.sessUser = 0;
    $scope.rootsessUser = 0;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.sessUser = $scope.userDet.id;
        $rootScope.rootsessUser = $scope.userDet.id;
    }

    $timeout(function(){
        $scope.getMainTv();
        $scope.getlast3post();
        $scope.getMainBanner();
        $scope.getsingleStatus();
    },200);

    $scope.getMainTv = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getMainTv',
        }).success(function (result) {
            $scope.maintv = result;
            $scope.maintvfile = $sce.trustAsResourceUrl($scope.baseUrl+'/uploads/video/converted/'+$scope.maintv.file);
            $scope.vidsources = [{src: $sce.trustAsResourceUrl($scope.baseUrl+'/uploads/video/converted/'+$scope.maintv.file), type: "video/mp4"}];


            setTimeout(function(){
                angular.element( document.querySelector( '#maintvDiv' ) ).html('<video id="maintvVideo" volume="0" width="100%"  autoplay loop muted controls>\
            <source src="'+$scope.maintvfile+'" type="video/mp4">\
            </video>');
            },2000);

        }).error(function (result) {
            $scope.getMainTv();
        });
    }

    $scope.getlast3post = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getlast3post',
        }).success(function (result) {
            $scope.forumList = result;
        }).error(function (result) {
            $scope.getlast3post();
        });
    }

    $scope.mainbanner = 'default.png';

    $scope.getMainBanner = function(){
        $http({
            method: 'GET',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getMainBanner',
        }).success(function (result) {
            $scope.mainbanner = result;
        }).error(function (result) {
            $scope.getMainBanner();
        });
    }

    $scope.getsingleStatus = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getsingleStatus',
            data    : $.param({'id':$scope.postid,'sess_user_id':$rootScope.rootsessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.statusList = result.status;

            angular.forEach($scope.statusList, function(item, key) {
                var itemcomlist = item.comment;
                itemcomlist = itemcomlist.slice(-5);
                item.commentSliceList = itemcomlist;

                if(typeof(item.routes.id) !='undefined'){
                    item.routes.map.refresh =  function () {
                        item.routes.map.control.refresh(item.routes.map.center);
                    };
                    $timeout(function(){
                        item.routes.map.refresh();
                    },500);
                }
            });

        }).error(function (result) {
            $scope.getsingleStatus();
        });
    }

    $scope.showYoutubevdo = function(id,value){
        angular.element( document.querySelector( '#youtubeBody'+id ) ).html('<iframe width="100%" height="100%" src="https://www.youtube.com/embed/'+value+'?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>');
    }

    $scope.statusLike = function (item) {
        if(item.is_like){
            item.like_no = item.like_no-1;
        }else{
            item.like_no = item.like_no+1;
        }
        item.is_like = !item.is_like;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/likestatus',
            data    : $.param({'status_id':item.id,'user_id':item.c_user}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {

        });

    };

    $scope.changeShareWith = function(item,valu){
        item.share_with = valu;
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/changeShareWith',
            data    : $.param({'status_id':item.id,'valu':valu}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {

        });
    }

    $scope.delStatus = function(index){
        $scope.confirmDialog = ngDialog.open({
            template: '<div style="text-align:center; font-family: \'veneerregular\'; font-size: 19px;">Are you sure you want to delete this post?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm('+index+')" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
            plain:true,
            showClose:false,
            closeByDocument: false,
            closeByEscape: false,
            className : 'confirmPopup',
            scope:$scope
        });


    }

    $scope.delConfirm = function(index){
        $scope.confirmDialog.close();
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/delstatus',
            data    : $.param({'status_id':$scope.statusList[index].id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.statusList.splice(index,1);
        });
    }

    $scope.delComment = function(index,index1){
        $scope.confirmDialog = ngDialog.open({
            template: '<div style="text-align:center; font-family: \'veneerregular\'; font-size: 19px;">Are you sure you want to delete this comment?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm1('+index+','+index1+')" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
            plain:true,
            showClose:false,
            closeByDocument: false,
            closeByEscape: false,
            className : 'confirmPopup',
            scope:$scope
        });


    }

    $scope.delConfirm1 = function(index,index1){
        $scope.confirmDialog.close();
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/delcomment',
            data    : $.param({'comment_id':$rootScope.statusList[index].comment[index1].id}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.statusList[index].comment.splice(index1,1);
            $scope.statusList[index].comment_no = $scope.statusList[index].comment_no -1;
        });
    }

    $scope.delCancel = function(){
        $scope.confirmDialog.close();
    }

    $scope.prShare = function(item){
        if(item.type == 'route'){
            var mapcontent = '<div class="rowtwo " style="float: none; width: 170px; margin:0; padding:0;  ">\
                    <h2 style="  word-wrap: break-word; width: 170px; margin-bottom: 2px; padding-bottom: 2px;color:#000!important">'+item.routes.route_name+'</h2>\
                <div class="date-contain" style="padding-top: 0px; margin-top: -3px;color:#000!important">\
                    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important" >\
                    <span style="color:#616564!important">DATE</span><br />'+item.routes.date+'</h5>\
            <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
            <span style="color:#616564!important">TIME</span><br />'+item.routes.duration+' </h5>\
    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
    <span style="color:#616564!important">DISTANCE</span><br />'+item.routes.distance+' miles</h5>\
</div></div>\
<img src="'+item.routes.sport_image+'" style="width:40px; display: block; margin: 0;"  alt="" />';
            $rootScope.stateIsLoading = true;
            $('#mapconmain').show();
            html2canvas($('#map'+item.id), {
                useCORS: true,
                onrendered: function(canvas) {
                    var url = canvas.toDataURL();

                    $http({
                        method: 'POST',
                        async:   false,
                        url: $scope.baseUrl+'/user/ajs1/canvastoimg',
                        data    : $.param({'data': url}),
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                    }).success(function (result) {
                        var mapImage = result;

                        $('#mapconmain').html(mapcontent);


                        html2canvas($('#mapconmain'), {
                            useCORS: true,
                            onrendered: function(canvas) {
                                var url = canvas.toDataURL();

                                $http({
                                    method: 'POST',
                                    async:   false,
                                    url: $scope.baseUrl+'/user/ajs1/canvastoimg1',
                                    data    : $.param({'data': url}),
                                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                }).success(function (result) {
                                    var divImage = result;

                                    $('#mapconmain').html('');

                                    $http({
                                        method: 'POST',
                                        async:   false,
                                        url: $scope.baseUrl+'/user/ajs1/imageMerge',
                                        data    : $.param({'image1':mapImage,'image2':divImage}),
                                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                    }).success(function (res) {

                                        $rootScope.stateIsLoading = false;

                                        var shareImage = 'http://torqkd.com/fbshare/img/'+res;
                                        $('#mapconmain').hide();
                                        window.open("http://pinterest.com/pin/create/button/?url=http://torkq.com/&media="+shareImage+"&description=","_blank");


                                    });


                                });

                            }

                        });

                    });

                }

            });
        }else{
            window.open('http://pinterest.com/pin/create/button/?url=http://torkq.com/&media='+item.s_img+'&description=','_blank');
        }
    }

    $scope.twShare = function(item){
        if(item.type == 'route'){
            var mapcontent = '<div class="rowtwo " style="float: none; width: 170px; margin:0; padding:0;  ">\
                    <h2 style="  word-wrap: break-word; width: 170px; margin-bottom: 2px; padding-bottom: 2px;color:#000!important">'+item.routes.route_name+'</h2>\
                <div class="date-contain" style="padding-top: 0px; margin-top: -3px;color:#000!important">\
                    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important" >\
                    <span style="color:#616564!important">DATE</span><br />'+item.routes.date+'</h5>\
            <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
            <span style="color:#616564!important">TIME</span><br />'+item.routes.duration+' </h5>\
    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
    <span style="color:#616564!important">DISTANCE</span><br />'+item.routes.distance+' miles</h5>\
</div></div>\
<img src="'+item.routes.sport_image+'" style="width:40px; display: block; margin: 0;"  alt="" />';
            $rootScope.stateIsLoading = true;
            $('#mapconmain').show();
            html2canvas($('#map'+item.id), {
                useCORS: true,
                onrendered: function(canvas) {
                    var url = canvas.toDataURL();

                    $http({
                        method: 'POST',
                        async:   false,
                        url: $scope.baseUrl+'/user/ajs1/canvastoimg',
                        data    : $.param({'data': url}),
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                    }).success(function (result) {
                        var mapImage = result;

                        $('#mapconmain').html(mapcontent);


                        html2canvas($('#mapconmain'), {
                            useCORS: true,
                            onrendered: function(canvas) {
                                var url = canvas.toDataURL();

                                $http({
                                    method: 'POST',
                                    async:   false,
                                    url: $scope.baseUrl+'/user/ajs1/canvastoimg1',
                                    data    : $.param({'data': url}),
                                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                }).success(function (result) {
                                    var divImage = result;

                                    $('#mapconmain').html('');

                                    $http({
                                        method: 'POST',
                                        async:   false,
                                        url: $scope.baseUrl+'/user/ajs1/imageMerge',
                                        data    : $.param({'image1':mapImage,'image2':divImage}),
                                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                    }).success(function (res) {

                                        $rootScope.stateIsLoading = false;

                                        var shareImage = 'http://torqkd.com/fbshare/img/'+res;
                                        $('#mapconmain').hide();

                                        var sss = 'Tweet Compose';

                                        $scope.dialog2 = ngDialog.open({
                                            template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="twText" id="fbtext"> <a href="javascript:void(0)" ng-click="postTw(\''+shareImage+'\')" id="comment_btn">POST</a></div>',
                                            plain:true,
                                            closeByDocument: false,
                                            closeByEscape: false,
                                            scope: $scope
                                        });

                                    });


                                });

                            }

                        });

                    });

                }

            });
        }else{
            var sss = 'Say Something About This Post';

            if(item.type == 'image'){
                var sss = 'Say Something About This Picture';
            }
            if(item.type == 'mp4' || item.type == 'youtube'){
                var sss = 'Say Something About This Video';
            }

            $scope.dialog2 = ngDialog.open({
                template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="twText" id="fbtext"> <a href="javascript:void(0)" ng-click="postTw(\''+item.value+'\',\''+item.type+'\')" id="comment_btn">POST</a></div>',
                plain:true,
                closeByDocument: false,
                closeByEscape: false,
                scope: $scope
            });
        }
    };

    $scope.postTw = function(value,type){
        $scope.dialog2.close();
        var twText = $('#fbtext').val();

        var sType = 'text';
        if(type == 'image'){
            sType = 'statImg';
        }

        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getTwOauth',
            data    : $.param({'user_id':$rootScope.rootsessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            if(result.oauth_token == '' || result.oauth_token_secret == ''){
                window.location.href = ($scope.baseUrl+'/user/profile/twittershare1?image='+value+'&page=profile&com='+twText+'&userid='+$scope.sessUser+'&type='+sType);
            }else{
                $http({
                    method: 'POST',
                    async:   false,
                    url: $scope.baseUrl+'/twitter31.php',
                    data    : $.param({'type':sType,'oauth_token':result.oauth_token,'oauth_token_secret':result.oauth_token_secret,'com':twText,'image':value}),
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).success(function (result) {
                    $scope.showTwSucMsg();
                });
            }
        });


    }

    $scope.showTwSucMsg = function(){
        $scope.showTwSucMsg1 = ngDialog.open({
            template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Posted Successfully On Twitter</div>',
            plain:true,
            showClose:false,
            closeByDocument: true,
            closeByEscape: true
        });

        setTimeout(function(){
            $scope.showTwSucMsg1.close();
        },3000);
    }

    $rootScope.fbShare = function(item){
        if(item.type == 'route'){
            var mapcontent = '<div class="rowtwo " style="float: none; width: 170px; margin:0; padding:0;  ">\
                    <h2 style="  word-wrap: break-word; width: 170px; margin-bottom: 2px; padding-bottom: 2px;color:#000!important">'+item.routes.route_name+'</h2>\
                <div class="date-contain" style="padding-top: 0px; margin-top: -3px;color:#000!important">\
                    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important" >\
                    <span style="color:#616564!important">DATE</span><br />'+item.routes.date+'</h5>\
            <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
            <span style="color:#616564!important">TIME</span><br />'+item.routes.duration+' </h5>\
    <h5 style="padding: 0px 0; margin-top: -8px;color:#000!important">\
    <span style="color:#616564!important">DISTANCE</span><br />'+item.routes.distance+' miles</h5>\
</div></div>\
<img src="'+item.routes.sport_image+'" style="width:40px; display: block; margin: 0;"  alt="" />';
            $rootScope.stateIsLoading = true;
            $('#mapconmain').show();
            html2canvas($('#map'+item.id), {
                useCORS: true,
                onrendered: function(canvas) {
                    var url = canvas.toDataURL();

                    $http({
                        method: 'POST',
                        async:   false,
                        url: $scope.baseUrl+'/user/ajs1/canvastoimg',
                        data    : $.param({'data': url}),
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                    }).success(function (result) {
                        var mapImage = result;

                        $('#mapconmain').html(mapcontent);


                        html2canvas($('#mapconmain'), {
                            useCORS: true,
                            onrendered: function(canvas) {
                                var url = canvas.toDataURL();

                                $http({
                                    method: 'POST',
                                    async:   false,
                                    url: $scope.baseUrl+'/user/ajs1/canvastoimg1',
                                    data    : $.param({'data': url}),
                                    headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                }).success(function (result) {
                                    var divImage = result;

                                    $('#mapconmain').html('');

                                    $http({
                                        method: 'POST',
                                        async:   false,
                                        url: $scope.baseUrl+'/user/ajs1/imageMerge',
                                        data    : $.param({'image1':mapImage,'image2':divImage}),
                                        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                                    }).success(function (res) {

                                        $rootScope.stateIsLoading = false;

                                        var shareImage = 'http://torqkd.com/fbshare/img/'+res;
                                        $('#mapconmain').hide();

                                        if($scope.fbStatus) {
                                            $scope.getAuthResponse = $facebook.getAuthResponse();
                                            $scope.fb_share_route(shareImage,$scope.getAuthResponse.accessToken);
                                        } else {
                                            $facebook.login().then(function(){
                                                $scope.getAuthResponse = $facebook.getAuthResponse();
                                                $scope.fb_share_route(shareImage,$scope.getAuthResponse.accessToken);
                                            });
                                        }


                                    });


                                });

                            }

                        });

                    });

                }

            });
        }else{

            var sss = 'Say Something About This Post';

            if(item.type == 'image'){
                var sss = 'Say Something About This Picture';
            }
            if(item.type == 'mp4' || item.type == 'youtube'){
                var sss = 'Say Something About This Video';
            }

            $scope.dialog2 = ngDialog.open({
                template: '<div class="fbcommentpopup"><h2>'+sss+'</h2><input type="text" placeholder="Write a comment..."   ng-model="fbText" id="fbtext"> <a href="javascript:void(0);" ng-click="postfb('+item.id+',\''+item.type+'\',\''+item.value+'\')" id="comment_btn">POST</a></div>',
                plain:true,
                closeByDocument: false,
                closeByEscape: false,
                scope: $scope
            });

        }
    }

    $scope.postfb = function(id,type,value){
        if($scope.fbStatus) {
            $scope.getAuthResponse = $facebook.getAuthResponse();
            $scope.fb_share(id,type,value,$scope.getAuthResponse.accessToken);
        } else {
            $facebook.login().then(function(){
                $scope.getAuthResponse = $facebook.getAuthResponse();
                $scope.fb_share(id,type,value,$scope.getAuthResponse.accessToken);
            });
        }

    }

    $scope.$on('fb.auth.authResponseChange', function() {
        $scope.fbStatus = $facebook.isConnected();
    });

    $scope.fb_share_route = function(image,accessToken){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/updateAccessToken',
            data    : $.param({'accesstoken':accessToken,'id':$rootScope.rootsessUser}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
        });
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/postfbRoutes',
            data    : $.param({'image':image,'accessToken':accessToken}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.showFbSucMsg();
        });
    }

    $scope.fb_share = function(id,type,value,accessToken){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/updateAccessToken',
            data    : $.param({'accesstoken':accessToken,'id':$rootScope.rootsessUser}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
        });

        var fbtext = $('#fbtext').val();

        if(type == 'image'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/postfbimage',
                data    : $.param({'id':id,'image':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.dialog2.close();
                $scope.showFbSucMsg();
            });
        }else if(type == 'mp4'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/postfbvideo',
                data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.dialog2.close();
                $scope.showFbSucMsg();
            });
        }else if(type == 'youtube'){

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/postfbYtvideo',
                data    : $.param({'video':value,'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.dialog2.close();
                $scope.showFbSucMsg();
            });
        }else{

            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/postfbText',
                data    : $.param({'accessToken':accessToken,'com':fbtext}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $scope.dialog2.close();
                $scope.showFbSucMsg();
            });
        }



    }

    $scope.showFbSucMsg = function(){
        $scope.showFbSucMsg1 = ngDialog.open({
            template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Posted Successfully On Facebook</div>',
            plain:true,
            showClose:false,
            closeByDocument: true,
            closeByEscape: true
        });

        setTimeout(function(){
            $scope.showFbSucMsg1.close();
        },3000);
    }


    var modalInstance;
    $rootScope.showPhoto = function(item,index){

        $rootScope.photoDet = {
            id : item.id,
            itemId : item.id,
            imgSrc : item.s_img,
            s_img : item.s_img,
            userImage : item.user_image,
            user_id : item.user_id,
            value : item.value,
            type: 'image',
            userName : item.user_name,
            timeSpan : item.timespan,
            msg : item.msg,
            like_no : item.like_no,
            is_like : item.is_like,
            c_user:item.c_user,
            cUserImage : item.c_user_image,
            pstval : '',
            commentList:item.comment,
            sIndex:index
        };

        $scope.animationsEnabled = true;
        modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'photoComment',
            windowClass: 'photoPopup',
            size: 'lg',
            scope : $scope
        });

    }

    $scope.modalClose = function(){
        modalInstance.dismiss('cancel');
    }

    $rootScope.postComment1 = function(item){
        if(item.pstval && typeof(item.pstval)!= 'undefined'){
            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/addcomment',
                data    : $.param({'status_id':item.itemId,'cmnt_body':item.pstval,'user_id':$rootScope.rootsessUser}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                item.commentList.push(result);
                item.pstval = '';
            });
        /*}else{

            $scope.Commentmsg = ngDialog.open({
                template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Please Enter Comment.</div>',
                plain:true,
                showClose:false,
                closeByDocument: true,
                closeByEscape: true
            });

            $timeout(function(){
                $scope.Commentmsg.close();
            },3000);*/
        }
    };



});

homeControllers1.controller('mysports', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal,$facebook) {
    $scope.userId = $stateParams.id;

    $timeout(function(){
        $scope.getUserDet();
        $scope.getusersports();
    },200);

    $scope.getUserDet = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getUserDet',
            data    : $.param({'userid':$scope.userId }),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.user_image = result.userdet.user_image;
        }).error(function (result) {
            $scope.getUserDet();
        });
    }

    $scope.sportsList = [];

    $scope.getusersports = function(){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/usersports',
            data    : $.param({'userid':$scope.userId}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.sportsList = result;
        }).error(function (result) {
            $scope.getusersports();
        });
    }




});

homeControllers1.controller('mobpopup', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal,$facebook) {

    $scope.backwindow = function(){
        if(window.opener == null){
            $state.go('index');
            return
        }else{
            window.opener.location.reload();
            close();
        }
    }

});

