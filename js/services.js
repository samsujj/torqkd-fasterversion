  'use strict';

    angular.module('myApp.services', [])
        .service('googleService', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {
            var clientId = '471684572812-mc8n2ij01sehepoqcojejauu607d095e.apps.googleusercontent.com',
                apiKey = 'AIzaSyAegWx-LFiFsetaqT_7G1v6PQf0aF1bah4',
                scopes = 'https://www.googleapis.com/auth/userinfo.email https://www.google.com/m8/feeds',
                domain = 'http://fasterversion.torqkd.com',
                deferred = $q.defer();

            this.login = function () {
                gapi.auth.authorize({ 
                    client_id: clientId, 
                    scope: scopes, 
                    immediate: false, 
                    hd: domain 
                }, this.handleAuthResult);

                return deferred.promise;
            }

            this.handleClientLoad = function () {
                gapi.client.setApiKey(apiKey);
                gapi.auth.init(function () { });
                window.setTimeout(checkAuth, 1);
            };

            this.checkAuth = function() {
                gapi.auth.authorize({ 
                    client_id: clientId, 
                    scope: scopes, 
                    immediate: true, 
                    hd: domain 
                }, this.handleAuthResult);
            };

            this.handleAuthResult = function(authResult) {
                if (authResult && !authResult.error) {
                    var data = {};
                    //var data = [];
                    gapi.client.load('oauth2', 'v2', function () {
                        var request = gapi.client.oauth2.userinfo.get();
                        request.execute(function (resp) {
                            data.email = resp.email;
                            data.access_token = authResult.access_token;
                           // data.push({'email':resp.email,access_token:authResult.access_token});
                            deferred.resolve(data);
                        });
                    });
                   // deferred.resolve(data);
                } else {
                    deferred.reject('error');
                }
            };

            this.handleAuthClick = function(event) {
                gapi.auth.authorize({ 
                    client_id: clientId, 
                    scope: scopes, 
                    immediate: false, 
                    hd: domain 
                }, this.handleAuthResult);
                return false;
            };

        }]);
