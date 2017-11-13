// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var Config = {
  server:'http://msuat.pkufi.com/bdfz_server',
  debug:true,
  key:'ed26d4cd99aa11e5b8a4c89cdc776729',
  random:(''+Math.random()).substr(2)
};
var app=angular.module('app', ['ionic', 'ngCordova', 'app.services','oc.lazyLoad','ionic-native-transitions','utils','app.route']);
app.config(function($ionicConfigProvider,$ionicNativeTransitionsProvider) {
  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.views.swipeBackEnabled(false);
  $ionicConfigProvider.views.maxCache(5);
  $ionicConfigProvider.views.forwardCache(true);
  $ionicConfigProvider.form.checkbox('circle');
  $ionicConfigProvider.form.toggle('large');
  $ionicConfigProvider.spinner.icon('bubbles');
  // $ionicConfigProvider.scrolling.jsScrolling(true);

  $ionicNativeTransitionsProvider.setDefaultOptions({
    duration: 200, // in milliseconds (ms), default 400,
    slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
    iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
    androiddelay: -1, // same as above but for Android, default -1
    winphonedelay: -1, // same as above but for Windows Phone, default -1,
    fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
    fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
    triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
    backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back
  });

  $ionicNativeTransitionsProvider.setDefaultTransition({
    type: 'slide',
    direction:'left'
  });

  $ionicNativeTransitionsProvider.setDefaultBackTransition({
    type: 'slide',
    direction:'right'
  });
})
  .run(['$rootScope','$ionicPlatform','$state','utils',function ($rootScope, $ionicPlatform,$state,utils) {
    utils.$ionicPlatform.ready(function(){
      // Wechat.share({
      //     message: {
      //         title:'pdf',
      //         description:'pdf文件',
      //         mediaTagName: "TEST-TAG-001",
      //         thumb:'www/images/head.jpg',
      //         media: {
      //             type: Wechat.Type.FILE,
      //             file: 'www/ES6-in-depth.pdf'
      //         }
      //     },
      //     scene: Wechat.Scene.SESSION
      // }, function (result) {
      //     console.log(result);
      // }, function (reason) {
      //     console.log(reason);
      // });

      if(window.StatusBar){
        window.StatusBar.backgroundColorByHexString("#C0C0C0");
      }

      if(screen.lockOrientation){
        screen.lockOrientation('portrait');//landscape
      }

      $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
        $rootScope.toast = '已连接至'+navigator.connection.type+'网络';
      });

      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
        $rootScope.toast = '未检测到网络';
      });

      var exitState = ['home','login'];

      utils.$ionicPlatform.registerBackButtonAction(function(e){
        if (exitState.indexOf($state.current.name)!=-1 && !$rootScope.settingLock){
          if ($rootScope.backButtonPressedOnceToExit){
            ionic.Platform.exitApp();
          } else {
            $rootScope.backButtonPressedOnceToExit = true;
            $rootScope.toast = '再按一次退出系统';
            utils.$timeout(function () {
              $rootScope.backButtonPressedOnceToExit = false;
            }, 2000);
          }
        }else if(utils.$ionicHistory.backView()){
          utils.$ionicHistory.goBack();
        }
      }, 100);

      var getRegistrationID = function() {
        window.plugins.jPushPlugin.getRegistrationID(onGetRegistrationID);
      };

      var onGetRegistrationID = function(data) {
        try {
          console.log("JPushPlugin:registrationID is " + data);

          if (data.length == 0) {
            var t1 = window.setTimeout(getRegistrationID, 1000);
          }
          $("#registrationId").html(data);
        } catch (exception) {
          console.log(exception);
        }
      };

      var onOpenNotification = function(event) {
        try {
          var alertContent;
          if (device.platform == "Android") {
            alertContent = event.alert;
          } else {
            alertContent = event.aps.alert;
          }
          console.log(event);
          if(event.extras.state){
            utils.$state.go(event.extras.state);
          }
        } catch (exception) {
          console.log("JPushPlugin:onOpenNotification" + exception);
        }
      };

      var initiateUI = function() {
        try {
          window.plugins.jPushPlugin.init();
          window.setTimeout(getRegistrationID, 1000);
          if (device.platform != "Android") {
            window.plugins.jPushPlugin.setDebugModeFromIos();
            window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
          } else {
            window.plugins.jPushPlugin.setDebugMode(true);
            window.plugins.jPushPlugin.setStatisticsOpen(true);
          }
        } catch (exception) {
          console.log(exception);
        }
      };

      // document.addEventListener("jpush.openNotification", onOpenNotification, false);
      // window.plugins.jPushPlugin.setAlias('chenjia');
      // initiateUI();
      if(window.chcp){
        // return;
        chcp.isUpdateAvailableForInstallation(function(error, data){
          console.log(error);
          console.log(data);
          if (error) {
            console.log('No update was loaded => nothing to install');
            chcp.fetchUpdate(function(error, data){
              if (error) {
                console.log('Failed to load the update with error code: ' + error.code);
                console.log(error.description);
                return;
              }
              console.log('Update is loaded');
            });
            return;
          }
          console.log('Current version: ' + data.currentVersion);
          console.log('About to install: ' + data.readyToInstallVersion);
          chcp.installUpdate(function(error) {
            if (error) {
              console.log('Failed to install the update with error code: ' + error.code);
              console.log(error.description);
            } else {
              console.log('Update installed!');
            }
          });
        });
      }
    });
  }])
  .controller('rootController',['$rootScope','$scope','utils',function($rootScope,$scope,utils){
  $rootScope.vo = {
    ready:true
  };
  $rootScope.toggleMenu = function(menu) {
    if ($rootScope.isMenuShown(menu)) {
      $rootScope.shownMenu = null;
    } else {
      $rootScope.shownMenu = menu;
    }
  };
  $rootScope.isMenuShown = function(menu) {
    return $rootScope.shownMenu === menu;
  };
  $rootScope.menus=[{
    name:'菜单1',
    menus:[{
      name:'首页',
      state:'home',
      icon:'fa fa-home fa-fw'
    },{
      name:'通讯录',
      state:'contacts',
      icon:'fa fa-book fa-fw'
    },{
      name:'动态列表',
      state:'list',
      icon:'fa fa-bars fa-fw'
    },{
      name:'动态图表',
      state:'chart',
      icon:'fa fa-bar-chart fa-fw'
    },{
      name:'表单',
      state:'form',
      icon:'fa fa-list-alt fa-fw'
    },{
      name:'选项卡',
      state:'tab',
      icon:'fa fa-folder-o fa-fw'
    },{
      name:'登录',
      state:'login',
      icon:'fa fa-lock fa-fw'
    },{
      name:'加载图标',
      state:'loading',
      icon:'fa fa-spinner fa-pulse fa-fw'
    }]
  },{
    name:'菜单2',
    menus:[{
      name:'首页',
      state:'home',
      icon:'fa fa-home fa-fw'
    },{
      name:'通讯录',
      state:'contacts',
      icon:'fa fa-book fa-fw'
    },{
      name:'动态列表',
      state:'list',
      icon:'fa fa-bars fa-fw'
    },{
      name:'动态图表',
      state:'chart',
      icon:'fa fa-bar-chart fa-fw'
    },{
      name:'表单',
      state:'form',
      icon:'fa fa-list-alt fa-fw'
    },{
      name:'选项卡',
      state:'tab',
      icon:'fa fa-folder-o fa-fw'
    },{
      name:'登录',
      state:'login',
      icon:'fa fa-lock fa-fw'
    },{
      name:'加载图标',
      state:'loading',
      icon:'fa fa-spinner fa-pulse fa-fw'
    }]
  }];

  $rootScope.server = Config.server;


  var timer = utils.$interval(function(){
    $rootScope.screenWidth = document.documentElement.clientWidth;
    $rootScope.screenHeight = document.documentElement.clientHeight;
    utils.$ionicSideMenuDelegate.$getByHandle('menuHandle').canDragContent(true);
    if($rootScope.screenHeight != 0){
      utils.$interval.cancel(timer);
    }
  },1000);

  $rootScope.go = function(state,params){
    if(state==-1){
      utils.$ionicHistory.goBack();
    }else if(typeof state == 'string' && state.substr(0,1)=='#'){
      utils.$location.path(state.substr(1));
    }else{
      utils.$state.go(state,params);
    }
  };

  $rootScope.logout = function(){
    utils.cache.put('session','');
    utils.$state.go('login');
  };

  var safeState = [
    'home','login','demo'
  ];

  $rootScope.$on('$stateChangeStart',function(event, toState,toParams, fromState,fromParams){
    if(!$rootScope.state && toState.name == 'customerList.tab'){
      event.preventDefault();
      $rootScope.go('customerList.tabs',{type:'pre'});
    }
  });

  $rootScope.$on('$stateChangeSuccess',function(event, toState,toParams, fromState,fromParams) {



    $rootScope.state = toState;
    if(utils.$ionicSideMenuDelegate.isOpenLeft()){
      utils.$ionicSideMenuDelegate.toggleLeft(false);
    }
  });

  $rootScope.showPatternLock = function(flag){
    $rootScope.patternLockFlag = flag;
    utils.$ionicModal.fromTemplateUrl('templates/patternLock.html',{
      scope: $rootScope,
      animation:'slide-in-up'
    }).then(function(modal){
      modal.show();
      $rootScope.modalHeight = $('.modal').height();
      $rootScope.hidePatternLock = function(){
        modal.hide();
      };
      $rootScope.patternLockModal = modal;
    });
  };

  $scope.ready = (function(){
    utils.$ocLazyLoad.load([
      'mobiscroll',
      'rating',
      'mfb-menu',
      'echarts',
      'patternLock',
      'animate'
    ]);
    utils.$timeout(function(){
      $rootScope.init = 1;
    },500);
    utils.$timeout(function(){
      $rootScope.init = 2;
    },1000);
  })();
}])
  .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
    $stateProvider.state('home', {
      url:'/home',
      controller:'homeController',
      templateUrl:'templates/home.html',
      resolve:{
        load:['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([
            'js/directives/toast.js',
            'js/controllers/homeController.js'
          ]);
        }]
      }
    }).state('login', {
      url:'/login',
      cache:false,
      controller:'loginController',
      templateUrl:function(){
        return 'templates/login.html';
      },
      resolve:{
        load:['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([
            'js/controllers/loginController.js'
          ]);
        }]
      }
    }).state('list', {
      url:'/list/:index',
      cache:false,
      controller:'listController',
      templateUrl:function(){
        return 'templates/list.html';
      },
      resolve:{
        load:['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([
            'js/controllers/listController.js'
          ]);
        }]
      }
    }).state('contacts', {
      url:'/contacts',
      cache:false,
      controller:'contactsController',
      templateUrl:function(){
        return 'templates/contacts.html';
      },
      resolve:{
        load:['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([
            'js/controllers/contactsController.js'
          ]);
        }]
      }
    }).state('chart', {
      url:'/chart',
      cache:false,
      controller:'chartController',
      templateUrl:function(){
        return 'templates/chart.html';
      },
      resolve:{
        load:['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([
            'echarts',
            'js/controllers/chartController.js'
          ]);
        }]
      }
    }).state('form', {
      url:'/form',
      cache:false,
      controller:'formController',
      templateUrl:function(){
        return 'templates/form.html';
      },
      resolve:{
        load:['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([
            'rating',
            'js/directives/input-datetime.js',
            'js/directives/input-select.js',
            'js/directives/input-sfz.js',
            'js/directives/input-treelist.js',
            'js/directives/input-color.js',
            'js/directives/toast.js',
            'js/controllers/formController.js'
          ]);
        }]
      }
    }).state('tab', {
      url:'/tab',
      cache:false,
      controller:'tabController',
      templateUrl:function(){
        return 'templates/tab.html';
      },
      resolve:{
        load:['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([
            'js/controllers/tabController.js'
          ]);
        }]
      }
    }).state('loading', {
      url:'/loading',
      cache:false,
      controller:'loadingController',
      templateUrl:function(){
        return 'templates/loading.html';
      },
      resolve:{
        load:['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([
            'js/controllers/loadingController.js'
          ]);
        }]
      }
    }).state('live', {
      url:'/live',
      cache:false,
      controller:'liveController',
      templateUrl:function(){
        return 'templates/live.html';
      },
      resolve:{
        load:['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([
            'js/controllers/liveController.js'
          ]);
        }]
      }
    }).state('calendar', {
      url:'/calendar',
      cache:false,
      controller:'calendarController',
      templateUrl:function(){
        return 'templates/calendar.html';
      },
      resolve:{
        load:['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([
            'mobiscroll',
            'js/controllers/calendarController.js'
          ]);
        }]
      }
    }).state('map', {
      url:'/map',
      cache:false,
      controller:'mapController',
      templateUrl:function(){
        return 'templates/map.html';
      },
      resolve:{
        load:['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([
            'js/controllers/mapController.js'
          ]);
        }]
      }
    }).state('customerList', {
      url:'/customer/list',
      cache:false,
      abstract:true,
      controller:'customerController',
      templateUrl:function(){
        return 'templates/customerList.html';
      },
      resolve:{
        load:['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load([
            'js/controllers/customerController.js'
          ]);
        }]
      }
    }).state('customerList.tabs', {
      url:'/tabs/:type',
      cache:false,
      views:{
        'customer':{
          controllerProvider:['$stateParams',function($stateParams){
            return $stateParams.type+'CustomerController';
          }],
          templateUrl:function(){
            return 'templates/tabsCustomerList.html';
          },
          resolve:{
            load:['$ocLazyLoad','$stateParams',function ($ocLazyLoad,$stateParams) {
              return $ocLazyLoad.load([
                'js/controllers/'+$stateParams.type+'CustomerController.js'
              ]);
            }]
          }
        }
      }
    }).state('customerList.tab', {
      url:'/tab/:type',
      cache:false,
      nativeTransitions:null,
      views:{
        'customer':{
          controllerProvider:['$stateParams',function($stateParams){
            return $stateParams.type+'CustomerController';
          }],
          templateUrl:function(params){
            return 'templates/'+params.type+'CustomerList.html';
          },
          resolve:{
            load:['$ocLazyLoad','$stateParams', function ($ocLazyLoad,$stateParams) {
              return $ocLazyLoad.load([
                'js/controllers/'+$stateParams.type+'CustomerController.js'
              ]);
            }]
          }
        }
      }
    });
    $urlRouterProvider.otherwise('/home');
  }]);
angular.module('app.route',[]).config(['$urlRouterProvider','$ocLazyLoadProvider','$httpProvider',function($urlRouterProvider,$ocLazyLoadProvider,$httpProvider){
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $urlRouterProvider.otherwise('/home');
  $ocLazyLoadProvider.config({
    modules:[{
      name:'mobiscroll',
      files:[
        'lib/mobiscroll/css/mobiscroll.custom-3.0.0-beta6.min.css',
        'lib/mobiscroll/js/mobiscroll.custom-3.0.0-beta6.min.js'
      ]
    },{
      name:'rating',
      files:[
        'lib/ionic-rating/ionic-rating.css',
        'lib/ionic-rating/ionic-rating.min.js'
      ]
    },{
      name:'mfb-menu',
      files:[
        'lib/ng-material-floating-button/mfb/dist/mfb.min.css',
        'lib/ng-material-floating-button/src/mfb-directive.js'
      ]
    },{
      name:'echarts',
      files:[
        'lib/echarts/build/dist/echarts-all.js',
        'js/directives/echarts.js'
      ]
    },{
      name:'patternLock',
      files:[
        'lib/patternLock/patternLock.css',
        'lib/patternLock/patternLock.min.js',
        'js/directives/patternLock.js'
      ]
    },{
      name:'animate',
      files:[
        'css/animate.min.css'
      ]
    }]
  });
}]);
