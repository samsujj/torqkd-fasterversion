'use strict';

/* App Module */
var homeControllers1 = angular.module('torqdTest', ['ui.router','angularValidator','ngDialog','ngCookies','ngFileUpload','ngAnimate', 'ngTouch','uiGmapgoogle-maps','ngSanitize','com.2fdevs.videogular','youtube-embed','highcharts-ng','shoppinpal.mobile-menu','ui.bootstrap','colorpicker.module', 'wysiwyg.module','readMore','ngFacebook','ImageCropper','widget.scrollbar','textAngular','angularLazyImg']);

homeControllers1.config(['$facebookProvider', function($facebookProvider) {
    $facebookProvider.setAppId('434078603403320').setPermissions(['email','user_friends']);
}]);

homeControllers1.run(['$rootScope', '$window', function($rootScope, $window) {
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    $rootScope.$on('fb.load', function() {
        $window.dispatchEvent(new Event('fb.load'));
    });
}]);

homeControllers1.run(['$rootScope', '$state','$cookieStore',function($rootScope, $state,$cookieStore){

    $rootScope.$on('$stateChangeStart',function(){
        $rootScope.stateIsLoading = true;
    });


    $rootScope.$on('$stateChangeSuccess',function(){
        $rootScope.stateIsLoading = false;



        if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
            $rootScope.dfgdf = $cookieStore.get('rootuserdet');
            angular.element( document.querySelector( '#c_current_user' ) ).val($rootScope.dfgdf.id);
        }else{
            angular.element( document.querySelector( '#c_current_user' ) ).val(0);
        }

    });




}]);

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

            }
        }
    )

        .state('logout',{
            url:"/logout",
            views: {
                'content': {
                    controller: 'logout'
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

            }
        }
    )

        .state('profile',{
            url:"/profile/:userId",
            views: {
                'content': {
                    templateUrl: 'partials/profile.html' ,
                    controller: 'profile'
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
                'mapcommon': {
                    controller: 'mapcommon'
                },
                'tabcommon': {
                    controller: 'tabcommon'
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
            }
        }
    )

        .state('eventdetails',{
            url:"/event-details/:eventId",
            views: {
                'content': {
                    templateUrl: 'partials/event_det.html' ,
                    controller: 'eventdetails'
                },
                'footer': {
                    templateUrl: 'partials/footer.html' ,
                    controller: 'footer'
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
            }
        }
    )


    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false,
        hashPrefix:'!'
    });
});


homeControllers1.controller('index', function($scope,$state,$cookieStore,$rootScope) {
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $state.go('profile',{userId:$scope.userDet.id});
        return;
    }else{
        $state.go('home');
        return
    }
});

homeControllers1.controller('tabcommon', function($scope,$state,$cookieStore,$rootScope,$http,$timeout,$stateParams,uiGmapGoogleMapApi,ngDialog,$facebook,$modal) {
    if($state.current.name == 'profile'){
        $rootScope.isProfile = true;
        $scope.currentUser = $stateParams.userId;
    }
    if($state.current.name == 'experience'){
        $rootScope.isExp = true;
        $scope.currentUser = 0;
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
            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/getStatus',
                data    : $.param({'userid':$scope.currentUser,'sess_user_id':$rootScope.rootsessUser,'offset':$rootScope.offset}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $rootScope.statusList = result.status;
                //$rootScope.statusList=$rootScope.statusList.concat(result.status);
                if(result.totalCount > $rootScope.statusList.length){
                    $rootScope.viewMore = 1;
                    $rootScope.offset = 5;
                }
                $rootScope.tabBodyLoad = false;
            });
        }
        if(tab.url == 'events.tpl.html'){
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
            });
        }
        if(tab.url == 'groups.tpl.html'){
            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/getGroups',
                data    : $.param({'userid':$scope.currentUser}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function (result) {
                $rootScope.groupList = result;
                $rootScope.tabBodyLoad = false;
            });
        }
        if(tab.url == 'stats.tpl.html'){
            $rootScope.highchartsNG = [];
            $rootScope.chartdata = [];

            if($scope.currentUser == 0){
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

                });

            }else{
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

                });

            }


        }
    }

    $rootScope.tabBodyLoad = true;
    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getStatus',
        data    : $.param({'userid':$scope.currentUser,'sess_user_id':$rootScope.rootsessUser,'offset':$rootScope.offset}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        $rootScope.statusList = result.status;
        //$rootScope.statusList=$rootScope.statusList.concat(result.status);
        if(result.totalCount > $rootScope.statusList.length){
            $rootScope.viewMore = 1;
            $rootScope.offset = 5;
        }
        $rootScope.tabBodyLoad = false;
    });

    $rootScope.isActiveTab = function(tabUrl) {
        return tabUrl == $rootScope.currentTab;
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
            if(result.totalCount > $rootScope.statusList.length){
                $rootScope.viewMore = 1;
                $rootScope.offset = $rootScope.offset+5;
            }
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
        });
    }

    $rootScope.viewStatDet = function(index){
        //$scope.statDet = obj;
        $rootScope.statDet1 = $rootScope.chartdata[index].statDet;
        ngDialog.open({
            template: 'statdet12',
            showClose:true,
            closeByDocument: true,
            closeByEscape: true,
            scope:$rootScope
        });
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
            }else{

                $scope.Commentmsg = ngDialog.open({
                    template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Please Enter Comment.</div>',
                    plain:true,
                    showClose:false,
                    closeByDocument: true,
                    closeByEscape: true
                });

                $timeout(function(){
                    $scope.Commentmsg.close();
                },3000);
            }
        }
    }

    $rootScope.delStatus = function(index){
        $scope.confirmDialog = ngDialog.open({
            template: '<div style="text-align:center;">Are you sure delete this status?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm('+index+')" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
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
        });
    }

    $rootScope.delComment = function(index,index1){
        $scope.confirmDialog = ngDialog.open({
            template: '<div style="text-align:center;">Are you sure delete this comment?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm1('+index+','+index1+')" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
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
            url     : $scope.baseUrl+'/user/ajs1/updateAccessToken1',
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
            url     : $scope.baseUrl+'/user/ajs1/updateAccessToken1',
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
        }else{

            $scope.Commentmsg = ngDialog.open({
                template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Please Enter Comment.</div>',
                plain:true,
                showClose:false,
                closeByDocument: true,
                closeByEscape: true
            });

            $timeout(function(){
                $scope.Commentmsg.close();
            },3000);
        }
    };



});
homeControllers1.controller('photocommon', function($scope,$state,$cookieStore,$rootScope,$http,$timeout,$stateParams,uiGmapGoogleMapApi,ngDialog,$facebook,$modal) {
    $rootScope.delPhoto = function(index){
        console.log(index);
        $scope.confirmDialog = ngDialog.open({
            template: '<div style="text-align:center;" class="delconfmsg">Are you sure delete this photo?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm('+index+')" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
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
        });
    }

    $rootScope.delComment = function(index,index1){
        $scope.confirmDialog = ngDialog.open({
            template: '<div style="text-align:center;">Are you sure delete this comment?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm1('+index+','+index1+')" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
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
        if(type == 'photo'){
            status_id = $rootScope.photoDet.itemId;
        }
        if(type == 'video'){
            status_id = $rootScope.videoDet.itemId;
        }

        if(event.which === 13) {
            var commentval = event.currentTarget.value;
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
                        }else{
                            $rootScope.photoDet.commentList = [result];
                        }
                    }
                    if(type == 'video'){
                        if($rootScope.videoDet.commentList.length){
                            $rootScope.videoDet.commentList.push(result);
                        }else{
                            $rootScope.videoDet.commentList = [result];
                        }
                    }
                    event.currentTarget.value = '';
                });
            }else{

                $scope.Commentmsg = ngDialog.open({
                    template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Please Enter Comment.</div>',
                    plain:true,
                    showClose:false,
                    closeByDocument: true,
                    closeByEscape: true
                });

                $timeout(function(){
                    $scope.Commentmsg.close();
                },3000);
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
            url     : $scope.baseUrl+'/user/ajs1/updateAccessToken1',
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



});
homeControllers1.controller('forumcommon', function($scope,$state,$cookieStore,$rootScope,$http,$timeout,$stateParams,uiGmapGoogleMapApi,ngDialog,$facebook,$modal) {
    $rootScope.sessUser = 0;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
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

    }

    $rootScope.headingArr = [{
        id:0,
        value:'Forum',
        link:'/forum-list'
    }];
});

homeControllers1.controller('routecommon', function($scope,$state,$cookieStore,$rootScope,$http,$timeout,$stateParams,uiGmapGoogleMapApi,ngDialog,$facebook,$modal) {

    $scope.canvasImage = '';
    $rootScope.delRoute = function(id,index){
        $scope.confirmDialog = ngDialog.open({
            template: '<div style="text-align:center;">Are you sure delete this route?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm('+id+','+index+')" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
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



homeControllers1.controller('mapcommon', function($scope,$state,$cookieStore,$rootScope,$http,$timeout,$stateParams,uiGmapGoogleMapApi) {

    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getCurLocation',
        data    : $.param({'userid':$stateParams.userId}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {

        $rootScope.map = {
            dragZoom: {options: {}},
            control:{},
            center: {
                latitude: result.latitude,
                longitude: result.longitude
            },
            pan: true,
            zoom: 9,
            refresh: false,
            events: {},
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
                    $scope.map.openedCanadaWindows = model;
                }
            }

        };





        $rootScope.map.markers.forEach(function(model){
            model.closeClick = function(){
                model.doShow = false;
            };
        });
    });


});

homeControllers1.controller('chatcommon', function($scope,$state,$cookieStore,$rootScope,$http,$timeout) {

    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/chatUserList1',
        data    : $.param({'userid':$rootScope.rootsessUser}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        $rootScope.chatUser1 = result;
    });

    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/chatUserList2',
        data    : $.param({'userid':$rootScope.rootsessUser}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        $rootScope.chatUser2 = result;
    });

});
homeControllers1.controller('bannerCommon', function($scope,$state,$cookieStore,$rootScope,$http) {

    $scope.pageId = 0;
    if($state.current.name == 'profile'){
        $scope.pageId = 3;
    }
    if($state.current.name == 'experience'){
        $scope.pageId = 1;
    }

    $rootScope.openBanner = function(url){
            window.open(url);
    }

    $rootScope.bannerslides1 = [];
    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getBanner',
        data    : $.param({'pageid':$scope.pageId,'areaid':1,'sp_id':0}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        $rootScope.bannerslides1 = result;
    });

    $rootScope.bannerslides2 = [];
    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getBanner',
        data    : $.param({'pageid':$scope.pageId,'areaid':2,'sp_id':0}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        $rootScope.bannerslides2 = result;
    });

    $rootScope.bannerslides3 = [];

    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getBanner',
        data    : $.param({'pageid':$scope.pageId,'areaid':3,'sp_id':0}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        $rootScope.bannerslides3 = result;
    });
});

homeControllers1.controller('footer', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog) {

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

    $rootScope.sportsMenu = [];

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/GetParentSports',
    }).success(function (result) {
        $rootScope.sportsMenu = result;
    });

});

homeControllers1.controller('home', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog) {
    $scope.openDefault = function () {
        ngDialog.open({
            template: 'firstDialogId',
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

                $cookieStore.put('rootuserdet',data);

                $state.go('profile',{userId:data.id});
                return;

            }else{
                $scope.msgFlag = true;
            }


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
    $rootScope.rootsessUser = 0;
    $state.go('index');
    return;
});

homeControllers1.controller('signup', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog) {

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

    $scope.countrylist = [];
    $scope.statelist = [];
    $scope.form = {
        gender : 0
    }

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getCountryList',
    }).success(function (result) {
        $scope.countrylist = result;
    });

    $scope.changeCountry = function(countryval){
        if(typeof (countryval) != 'undefined'){
            $scope.statelist = [];
            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/getStateList',
                data    : $.param({'id':countryval.id}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (result) {
                $scope.statelist = result;
            });
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

        });
    }

});

homeControllers1.controller('activities', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog) {
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

    $scope.sportsList = [];
    $scope.sportsList1 = [];
    $scope.selSports = [];

    $scope.current_cat = '';
    $scope.last_cat = '';
    $scope.count = 0;

    $scope.predicate = 'priority';
    $scope.reverse = false;

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/allsports',
    }).success(function (result) {
        $scope.sportsList = result;
    });

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

homeControllers1.controller('connect', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog) {
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

    $scope.userList = [];
    $scope.selUsers = [];
    $scope.count = 0;

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/userList',
    }).success(function (result) {
        $scope.userList = result;
    });

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

homeControllers1.controller('next', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$facebook) {
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

    $scope.$on('fb.auth.authResponseChange', function() {
        $scope.fbStatus = $facebook.isConnected();
    });

    $scope.isSendMail = 0;
    $scope.isSocialShare = 0;

    $scope.form = {
        mailBody: "Be sure to check out torqkd.com. Torqk'd brings the consciousness of outdoor sports to a new, progressive social media realm. Torqk'd is a collective of runners, jumpers, climbers, riders, hikers, surfers and all who dare to smack the terrain from land, sky, powder and H2O. Now go get it!! Time to connect, track and explore. I use Torqk'd to connect, track and explore my favorite sports."
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
            console.log($scope.baseUrl+'/user/ajs1/twittershare1');
            window.location.href = ($scope.baseUrl+'/user/ajs1/twittershare1');
        }

    };

    $scope.fb_share = function(accesstoken){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/updateAccessToken1',
            data    : $.param({'accesstoken':accesstoken,'id':$cookieStore.get('user_insert_id')}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
        });



        $facebook.ui({
                method: 'feed',
                link: 'http://torqkd.com',
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





});

homeControllers1.controller('addimage', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,Upload,$modal,$sce) {

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

    $scope.profileImage = "";
    $scope.profileBackImage = "";
    $scope.profileImageName = "";
    $scope.profileBackImageName = "";
    $scope.origprofileImageName = "";
    $scope.origprofileBackImageName = "";


    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs1/getPImage',
        data    : $.param({'userid':$cookieStore.get('user_insert_id')}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(data) {
        //alert(data.userid);
        $scope.profileImage = $scope.baseUrl+'/uploads/user_image/thumb/'+data.profileImgName;
        $scope.profileImageName = data.profileImgName;
        $scope.origprofileImageName = data.profileOrigImgName;
        $scope.profileBackImage = $scope.baseUrl+'/uploads/user_image/background/thumb/'+data.backImg;
        $scope.profileBackImageName = data.backImg;
        $scope.origprofileBackImageName = data.OrigbackImgName;
    });

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
            file.result = response.data;

            var ctime = (new Date).getTime();

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs1/profileimgresize',
                data    : $.param({'filename':response.data,'height':156,'width':142,'foldername':'thumb'}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function(data) {
                $('.progress').addClass('ng-hide');
                $scope.profileImage = $scope.baseUrl+'/uploads/user_image/thumb/'+response.data+'?version='+ctime;
                $scope.profileImageName = response.data;
                $scope.origprofileImageName = response.data;
            });

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
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
            file.result = response.data;

            var ctime = (new Date).getTime();

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs1/profileBackimgresize',
                data    : $.param({'filename':response.data,'height':536,'width':1175,'foldername':'thumb'}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function(data) {
                $('.progress').addClass('ng-hide');
                $scope.profileBackImage = $scope.baseUrl+'/uploads/user_image/background/thumb/'+response.data+'?version='+ctime;
                $scope.profileBackImageName = response.data;
                $scope.origprofileBackImageName = response.data;
            });

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
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
        $scope.image = $sce.trustAsResourceUrl($scope.baseUrl+'/uploads/user_image/'+$scope.profileImageName);

        $scope.animationsEnabled = true;
        modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'mymodal',
            windowClass: 'mymodalimg',
            size: 'lg',
            scope : $scope
        });
    }

    $scope.cropform = {
        'x2':142,
        'y2':159,
        'x1':0,
        'y1':0,
        'w':142,
        'h':159,
        height:159,
        width:142,
        foldername:'thumb'
    }

    $scope.selected = function(x) {
        $scope.cropform = {
            'x2': x.x2,
            'y2': x.y2,
            'x1': x.x,
            'y1': x.y,
            'w': x.w,
            'h': x.h,
            height:159,
            width:142,
            foldername:'thumb'
        }
    };


    $scope.crop = function(){
        angular.extend($scope.cropform, {'image':$scope.profileImageName});
        modalInstance.dismiss('cancel');
        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/Resize_cropImage',
            data    : $.param($scope.cropform),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $scope.profileImage = $scope.baseUrl+'/uploads/user_image/temp/'+data;
        });

    }

    $scope.cropProfileBackImg = function(){
        $scope.image1 = $sce.trustAsResourceUrl($scope.baseUrl+'/uploads/user_image/background/'+$scope.profileBackImageName);

        $scope.animationsEnabled = true;
        modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'mymodal1',
            windowClass: 'mymodalimg1',
            size: 'lg',
            scope : $scope
        });
    }


    $scope.cropform1 = {
        'x2':1175,
        'y2':536,
        'x1':0,
        'y1':0,
        'w':1175,
        'h':536,
        height:536,
        width:1175,
        foldername:'thumb'
    }

    $scope.selected1 = function(x) {
        $scope.cropform1 = {
            'x2': x.x2,
            'y2': x.y2,
            'x1': x.x,
            'y1': x.y,
            'w': x.w,
            'h': x.h,
            height:536,
            width:1175,
            foldername:'thumb'
        }
    };


    $scope.crop1 = function(){
        angular.extend($scope.cropform1, {'image':$scope.profileBackImageName});
        modalInstance.dismiss('cancel');
        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/resize_cropImage1',
            data    : $.param($scope.cropform1),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $scope.profileBackImage = $scope.baseUrl+'/uploads/user_image/background/temp/'+data;
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
                url     : $scope.baseUrl+'/user/ajs1/login',
                data    : $.param({'email':$scope.email,'password':$scope.password}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }) .success(function(data) {
                $rootScope.stateIsLoading = false;

                if(typeof (data.id) != 'undefined'){
                    $cookieStore.put('login_email1',$scope.email);
                    $cookieStore.put('login_password1',$scope.password);

                    $cookieStore.put('rootuserdet',data);

                    $cookieStore.remove('login_email');
                    $cookieStore.remove('login_password');
                    $cookieStore.remove('user_insert_id');

                    $state.go('profile',{userId:data.id});
                    return;

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


});

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
        });

    }

});


homeControllers1.controller('experience', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$sce) {
    $scope.sessUser = 0;
    console.log($cookieStore.get('rootuserdet'));
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.sessUser = $scope.userDet.id;
        $rootScope.rootsessUser = $scope.userDet.id;
    }

    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getUserListExe',
        data    : $.param({'userid':$scope.sessUser}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        $scope.peoplelist = result;
    });

    $scope.openDefault = function () {
        ngDialog.open({
            template: 'firstDialogId',
        });
    };

    $scope.maintvfile = '';

    $scope.isMute = true;

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getMainTv',
    }).success(function (result) {
        $scope.maintv = result;
        $scope.maintvfile = $sce.trustAsResourceUrl($scope.baseUrl+'/uploads/video/converted/'+$scope.maintv.file);
        $scope.vidsources = [{src: $sce.trustAsResourceUrl($scope.baseUrl+'/uploads/video/converted/'+$scope.maintv.file), type: "video/mp4"}];


        setTimeout(function(){
            console.log(1);
            angular.element( document.querySelector( '#maintvDiv' ) ).html('<video id="maintvVideo" volume="0" width="100%" height="100%" autoplay loop muted controls>\
            <source src="'+$scope.maintvfile+'" type="video/mp4">\
            </video>');
        },2000);


    });

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getlast3post',
    }).success(function (result) {
        $scope.forumList = result;
    });

    $scope.mainbanner = 'default.png';
    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getMainBanner',
    }).success(function (result) {
        $scope.mainbanner = result;
    });

    $scope.slides = [];
    $scope.groupedSlides = [];

    var i, j, first = [],
        second, third;
    var many = 3;



    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/GetParentSports',
    }).success(function (result) {
        //$scope.slides = result;
        //$scope.slides1 = result;

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
    });

});

homeControllers1.controller('profile', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout) {
    $scope.isProfilePage = 1;
    $scope.sessUser = 0;
    $scope.userId = $stateParams.userId;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.sessUser = $scope.userDet.id;
        $rootScope.rootsessUser = $scope.userDet.id;
    }



    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs1/getUserDetails',
        data    : $.param({'userid':$scope.userId}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(result) {
        $scope.userDet = result;
        console.log($scope.userDet);
    });

    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getFriendDet1',
        data    : $.param({'userid':$scope.userId}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        $scope.frnddet = result.frnddet;
    });

    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getunFriendDet1',
        data    : $.param({'userid':$scope.userId}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        $scope.unfrnddet = result;
    });

    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getstatdetails',
        data    : $.param({'userid':$scope.userId}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        $scope.statDet = result;
    });

    $scope.maintvfile = '';
    $scope.isMute = true;

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getMainTv',
    }).success(function (result) {
        $scope.maintv = result;
        $scope.maintvfile = $sce.trustAsResourceUrl($scope.baseUrl+'/uploads/video/converted/'+$scope.maintv.file);
        $scope.vidsources = [{src: $sce.trustAsResourceUrl($scope.baseUrl+'/uploads/video/converted/'+$scope.maintv.file), type: "video/mp4"}];

        setTimeout(function(){
            angular.element( document.querySelector( '#maintvDiv' ) ).html('<video id="maintvVideo" volume="0" width="100%" height="100%" autoplay loop muted controls>\
            <source src="'+$scope.maintvfile+'" type="video/mp4">\
            </video>');
        },2000);

    });

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getlast3post',
    }).success(function (result) {
        $scope.forumList = result;
    });

    $scope.mainbanner = 'default.png';
    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getMainBanner',
    }).success(function (result) {
        $scope.mainbanner = result;
    });

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
        $scope.group = 0;
    }

    $scope.postStatus = function(){

        if($scope.statusText || $scope.statusValue){
            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/statusUpdate',
                data    : $.param({'msg':$scope.statusText,'share_with':$scope.shareVal,'group_id':$scope.group,'type':$scope.statusType,'value':$scope.statusValue,'is_status':1,'status_id':$scope.status_id,'user_id':$scope.sessUser}),
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


                $scope.statusList.splice(0, 0, result);
                $scope.offset = $scope.offset+1;

                angular.element( document.querySelector( '#statusText' ) ).val('');




            });
        }else{

            $scope.Commentmsg = ngDialog.open({
                template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Please Enter Comment.</div>',
                plain:true,
                showClose:false,
                closeByDocument: true,
                closeByEscape: true
            });

            $timeout(function(){
                $scope.Commentmsg.close();
            },3000);
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

    $scope.user_image = $scope.baseUrl+"/uploads/user_image/thumb/default.jpg";
    $scope.frnddet = [];

    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getsports1',
    }).success(function (result) {
        angular.element( document.querySelector( '#select-search' ) ).append(result);
    });

    if($state.current.name == 'friendlist'){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getFriendDet11',
            data    : $.param({'userid':$stateParams.userId,sessId:$scope.sessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.user_image = result.user_image;
            $scope.frnddet = result.frnddet;
        });
    }else{
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getFriendDet21',
            data    : $.param({'userid':$stateParams.userId,sessId:$scope.sessUser}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
            $scope.user_image = result.user_image;
            $scope.frnddet = result.frnddet;
        });
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

});

homeControllers1.controller('album', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout) {
    $scope.sessUser = 0;
    $scope.userId = $stateParams.userId;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.sessUser = $scope.userDet.id;
        $rootScope.rootsessUser = $scope.userDet.id;
    }

    //$scope.user_image = $scope.baseUrl+"/uploads/user_image/thumb/default.jpg";

    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getUserDet',
        data    : $.param({'userid':$scope.userId }),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        $scope.user_image = result.userdet.user_image;
    });

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

    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getImage',
        data    : $.param({'userid':$scope.userId,sess_id:$scope.sessUser}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        $rootScope.photoList = result;
    });

    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getVideo',
        data    : $.param({'userid':$scope.userId,sess_id:$scope.sessUser}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        $rootScope.videoList = result;
    });


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
        console.log(files);
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
        console.log(file);
        $scope.errorMsg = null;
        uploadUsingUpload(file);
    }

    function uploadUsingUpload(file) {

        console.log(1);

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
            });

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));

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
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }

    $scope.imgRotate = function(type){
        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/rotateleft1',
            data    : $.param({'imgname':$scope.statusValue,'arg':type}),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).success(function (result) {
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

    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getAllImage',
        data    : $.param({'sessUser':$scope.sessUser}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function (result) {
        $rootScope.photoList = result;
    });


});


homeControllers1.controller('video', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal) {
    $scope.sessUser = 0;
    $scope.userId = $stateParams.userId;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.sessUser = $scope.userDet.id;
        $rootScope.rootsessUser = $scope.userDet.id;
    }


    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getAllVideo',
        data    : $.param({'sess_id':$scope.sessUser}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        $rootScope.videoList = result;
    });

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
        $rootScope.videoDet.basepath = item.basepath;

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
        if(event.which === 13) {
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
                        }else{
                            $rootScope.videoDet.commentList = [result];
                        }
                    event.currentTarget.value = '';
                });
            }else{

                $scope.Commentmsg = ngDialog.open({
                    template: '<div style="text-align: center;margin: 0 auto;display: block;font-family: arial, helvetica, sans-serif;font-weight: normal;font-size: 18px; padding: 15px 0;">Please Enter Comment.</div>',
                    plain:true,
                    showClose:false,
                    closeByDocument: true,
                    closeByEscape: true
                });

                $timeout(function(){
                    $scope.Commentmsg.close();
                },3000);
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

    $scope.countrylist = [];
    $scope.statelist = [];

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getCountryList',
    }).success(function (result) {
        $scope.countrylist = result;
    });


    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs1/getUserDetails',
        data    : $.param({'userid':$scope.userId}),  // pass in data as strings
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

        $scope.userSports = result.user_sports;
        $scope.userSports1 = result.user_sports1;
        $scope.origprofileImg = result.profileOrigImgName;
        $scope.origcoverImg = result.OrigbackImgName;
        $scope.profileImg = result.profileImg+'?version='+ctime;
        $scope.coverImg = result.backImg+'?version='+ctime;
        $scope.profileImgName = result.profileImgName;
        $scope.coverImgName = result.backImgName;

        $http({
            method: 'POST',
            async:   false,
            url: $scope.baseUrl+'/user/ajs1/getStateList',
            data    : $.param({'id':result.country}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (result5) {
            $scope.statelist = result5;
        });





    });


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
            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/getStateList',
                data    : $.param({'id':countryval.id}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (result) {
                $scope.statelist = result;
            });
        }else{
            $scope.statelist = [];
        }

    }

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/allsports',
    }).success(function (result) {
        $scope.sportsList = result;
    });

    $scope.editProfile = function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/updateProfile',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
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
            file.result = response.data;

            $scope.profileImgName = response.data;

            var ctime = (new Date).getTime();

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs1/profileimgresize',
                data    : $.param({'filename':response.data,'height':156,'width':142,'foldername':'thumb'}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function(data) {
                $('.progress').addClass('ng-hide');
                $scope.profileImg = $scope.baseUrl+'/uploads/user_image/thumb/'+response.data+'?version='+ctime;
                $scope.origprofileImg = response.data;
            });

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
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
            file.result = response.data;

            $scope.coverImgName = response.data;

            var ctime = (new Date).getTime();

            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs1/profileBackimgresize',
                data    : $.param({'filename':response.data,'height':536,'width':1175,'foldername':'thumb'}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).success(function(data) {
                $('.progress').addClass('ng-hide');
                $scope.coverImg = $scope.baseUrl+'/uploads/user_image/background/thumb/'+response.data+'?version='+ctime;
                $scope.origcoverImg = response.data;
            });

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
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
        $scope.image = $sce.trustAsResourceUrl($scope.baseUrl+'/uploads/user_image/'+$scope.profileImgName);

        $scope.animationsEnabled = true;
        modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'mymodal',
            windowClass: 'mymodalimg',
            size: 'lg',
            scope : $scope
        });
    }

    $scope.cropform = {
        'x2':142,
        'y2':159,
        'x1':0,
        'y1':0,
        'w':142,
        'h':159,
        height:159,
        width:142,
        foldername:'thumb'
    }

    $scope.selected = function(x) {
        $scope.cropform = {
            'x2': x.x2,
            'y2': x.y2,
            'x1': x.x,
            'y1': x.y,
            'w': x.w,
            'h': x.h,
            height:159,
            width:142,
            foldername:'thumb'
        }
    };


    $scope.crop = function(){
        angular.extend($scope.cropform, {'image':$scope.profileImgName});
        modalInstance.dismiss('cancel');
        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/Resize_cropImage',
            data    : $.param($scope.cropform),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $scope.profileImg = $scope.baseUrl+'/uploads/user_image/temp/'+data;
        });

    }

    $scope.cropProfileBackImg = function(){
        $scope.image1 = $sce.trustAsResourceUrl($scope.baseUrl+'/uploads/user_image/background/'+$scope.coverImgName);

        $scope.animationsEnabled = true;
        modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'mymodal1',
            windowClass: 'mymodalimg1',
            size: 'lg',
            scope : $scope
        });
    }


    $scope.cropform1 = {
        'x2':1175,
        'y2':536,
        'x1':0,
        'y1':0,
        'w':1175,
        'h':536,
        height:536,
        width:1175,
        foldername:'thumb'
    }

    $scope.selected1 = function(x) {
        $scope.cropform1 = {
            'x2': x.x2,
            'y2': x.y2,
            'x1': x.x,
            'y1': x.y,
            'w': x.w,
            'h': x.h,
            height:536,
            width:1175,
            foldername:'thumb'
        }
    };


    $scope.crop1 = function(){
        angular.extend($scope.cropform1, {'image':$scope.coverImgName});
        modalInstance.dismiss('cancel');
        $rootScope.stateIsLoading = true;
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.baseUrl+'/user/ajs1/resize_cropImage1',
            data    : $.param($scope.cropform1),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            $scope.coverImg = $scope.baseUrl+'/uploads/user_image/background/temp/'+data;
        });

    }

});

homeControllers1.controller('eventdetails', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal) {
    $scope.evetId = $stateParams.eventId;
    $scope.evetDet = [];
    $scope.userId = 0;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.userId = $scope.userDet.id;
    }

    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getEventDet',
        data    : $.param({'id':$stateParams.eventId}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        $scope.evetDet = result;

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

        $scope.map.markers.forEach(function(model){
            model.closeClick = function(){
                model.doShow = false;
            };
        });
    });


});

homeControllers1.controller('addevent', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal) {
    $scope.userId = 0;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.userId = $scope.userDet.id;
    }

    $scope.heading = "Create Event";

    $scope.groupList = [];

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getgroupList',
    }).success(function (result) {
        $scope.groupList = result;
    });

    $scope.countrylist = [];
    $scope.statelist = [];

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getCountryList',
    }).success(function (result) {
        $scope.countrylist = result;
    });

    $scope.changeCountry = function(countryval){
        if(typeof (countryval) != 'undefined'){
            $scope.statelist = [];
            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/getStateList',
                data    : $.param({'id':countryval.id}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (result) {
                $scope.statelist = result;
            });
        }else{
            $scope.statelist = [];
        }

    }

    $scope.sportsList = [];

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/allsports',
    }).success(function (result) {
        $scope.sportsList = result;
    });

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
            });

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }

    $scope.selsp = function(sid){
        //$('.activeimg').removeClass('activeimg');
    }

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

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getgroupList',
    }).success(function (result) {
        $scope.groupList = result;
    });

    $scope.sportsList = [];

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/allsports',
    }).success(function (result) {
        $scope.sportsList = result;
    });

    $scope.countrylist = [];
    $scope.statelist = [];

    $http({
        method: 'GET',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getCountryList',
    }).success(function (result) {
        $scope.countrylist = result;
    });

    $scope.changeCountry = function(countryval){
        if(typeof (countryval) != 'undefined'){
            $scope.statelist = [];
            $http({
                method: 'POST',
                async:   false,
                url: $scope.baseUrl+'/user/ajs1/getStateList',
                data    : $.param({'id':countryval.id}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (result) {
                $scope.statelist = result;
            });
        }else{
            $scope.statelist = [];
        }

    }


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

    });

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
            });

        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        });

        file.upload.progress(function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
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

    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getUserDet',
        data    : $.param({'userid':$scope.userId }),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        $scope.user_image = result.userdet.user_image;
    });

    $rootScope.routeList = [];

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
    });

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
    });

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
        });
    }
});

homeControllers1.controller('addroute', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal) {
    $scope.userId = 0;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.userDet = $cookieStore.get('rootuserdet');
        $scope.userId = $scope.userDet.id;
    }else{
        $state.go('index');
        return
    }

});

homeControllers1.controller('forumlist', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal) {
    $scope.spId = $stateParams.spId;

    if(typeof ($scope.spId) == 'undefined'){
        $scope.spId = 0;
    }

    $scope.forumList = [];

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
    });

});

homeControllers1.controller('forumdetails', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal) {
    $scope.forumId = $stateParams.forumId;

    $http({
        method: 'POST',
        async:   false,
        url: $scope.baseUrl+'/user/ajs1/getForumTopicList',
        data    : $.param({'id':$scope.forumId}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).success(function (result) {
        $scope.forumDet = result;
        $scope.headingArr.push({ id:result.parent_id,value:result.parent_name,link:'/forum-list-by-sports/'+result.parent_id},{id:result.id,value:result.name,link:'/forum-details/'+result.id});

    });

});

homeControllers1.controller('topicdetails', function($scope,$state,$cookieStore,$http,$rootScope,ngDialog,$stateParams,$sce,Upload,$timeout,$modal) {
    $scope.topicId = $stateParams.topicId;

    $scope.seesuser1 = 0;
    if(typeof ($cookieStore.get('rootuserdet')) != 'undefined'){
        $scope.sessUserDet1 = $cookieStore.get('rootuserdet');
        $scope.seesuser1 = $scope.sessUserDet1.id;
    }

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs1/getTopicHArr',
        data    : $.param({'id':$scope.topicId}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }) .success(function(result) {
        $scope.topicTitle = result.topic_title;
        $scope.headingArr.push({ id:result.forum_category_id,value:result.forum_category_name,link:'/forum-list-by-sports/'+result.forum_category_id},{id:result.forum_id,value:result.forum_name,link:'/forum-details/'+result.forum_id},{ id:$scope.topicId,value:result.topic_title,link:'/topic-details/'+$scope.topicId});
    });

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs1/addView',
        data    : $.param({'id':$scope.topicId}),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }) .success(function(result) {
    });

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
            user_id:$scope.seesuser1
        }

    });

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
            $scope.isReply = false;
            $scope.form = {
                title:result.title,
                parentId:result.parent_id,
                forumId:result.forum_id,
                user_id:$scope.seesuser1,
                description:'',
            }

            if($scope.topicDet.topic_reply.length > 0){
                $scope.topicDet.topic_reply.push(result);
            }else{
                $scope.topicDet.topic_reply = [result];
            }
        });
    }

    $scope.addTopicForm1 = function(index,item){
        $rootScope.stateIsLoading = true;
        var replyval = $('#Reply_description'+index).val();
        if(replyval != ''){
            $http({
                method  : 'POST',
                async:   false,
                url     : $scope.baseUrl+'/user/ajs1/addnewTopic',
                data    : $.param({'title':item.title,'description':replyval,'parentId':item.id,'forumId':item.forum_id,user_id:$scope.seesuser1}),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }) .success(function(result) {
                $rootScope.stateIsLoading = false;
                $('#Reply_description'+index).val('');

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
            template: '<div style="text-align:center;">Are you sure delete this topic?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm('+id+','+index+',1)" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
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
            template: '<div style="text-align:center;">Are you sure delete this topic?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm('+id+','+index+',2)" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
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
            template: '<div style="text-align:center;">Are you sure delete this topic?</div><div class="confirmBtn"><input type="button" value="OK" ng-click="delConfirm('+id+','+f_id+',3)" class="confbtn" /><input type="button" value="Cancel" ng-click="delCancel()" class="confbtn" /></div> ',
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

        $scope.ytdialog = ngDialog.open({
            template: 'editpost',
            showClose:true,
            closeByDocument: true,
            closeByEscape: true,
            className : 'editpost',
            scope: $scope
        });
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

    });


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

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.baseUrl+'/user/ajs1/getBlockpeople',
        data    : $.param({cuser:$scope.userId}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(result) {
        $scope.blockList = result;
    });

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

        });
    }

});
