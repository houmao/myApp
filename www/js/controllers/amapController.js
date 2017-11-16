angular.module('app').controller('amapController',['$rootScope','$scope','utils',function($rootScope,$scope,utils){
  $scope.vo = {

  };

  $scope.vc = {
    enter:function($event){
      if($event.keyCode == 13){
        $scope.vc.searchAddress($scope.vo.searchKey);
      }
    },
    searchAddress:function(searchKey){
      var AMap = $scope.vo.AMap;
      var map = $scope.vo.map;
      map.clearOverlays();
      var gc = new AMap.Geocoder();
      gc.getPoint(searchKey, function(point){
        if (point) {
          // map.clearOverlays();
          map.centerAndZoom(point, 16);
          var marker = new AMap.Marker(point);
          map.addOverlay(marker);
          $scope.vo.overlays = [marker];
          gc.getLocation(point, function(rs){
            // var addComp = rs.addressComponents;
            // $scope.vo.addressList = [{
            //     address:rs.address,
            //     gps:point.lng+','+point.lat
            // }];
            // $scope.$apply();
            var addComp = rs.addressComponents;
            var opts = {
              width : 250,     // 信息窗口宽度
              height: 50,     // 信息窗口高度
              title : "当前位置："  // 信息窗口标题
            }
            var infoWindow = new AMap.InfoWindow(addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber, opts);  // 创建信息窗口对象
            map.openInfoWindow(infoWindow,point); //开启信息窗口

            marker.addEventListener("click", function(){map.openInfoWindow(infoWindow,point);});
          });
        }else{
          alert('对不起，没有找到您输入的地址！');
        }
      }, "中国");
    },
    arriveHere:function (end) {
      var AMap = $scope.vo.AMap;
      var map = $scope.vo.map;
      var Lib=$scope.vo.Lib;
      //构造路线导航类
      var drivingOption = {
        policy:AMap.DrivingPolicy.LEAST_TIME
      };
      var driving = new AMap.Driving(drivingOption); //构造驾车导航类
      //根据起终点坐标规划驾车路线
      driving.search(new AMap.LngLat(116.46,39.97), new AMap.LngLat(116.40,39.92), function(status, result){
        if(status === 'complete' && result.info === 'OK'){
          (new Lib.AMap.DrivingRender()).autoRender({
            data: result,
            map: map,
            panel: "panel"
          });
        }else{
          alert(result);
        }
      });
    }
  };

  $scope.ready = function(){
    window.mapCallback = function(AMap,Lib){
      var map, geolocation;
      //加载地图，调用浏览器定位服务
      map = new AMap.Map('container', {
        resizeEnable: true
      });
      $scope.vo.AMap = AMap;
      $scope.vo.map = map;
      $scope.vo.Lib=Lib;
      map.plugin(["AMap.ToolBar"], function() {
        map.addControl(new AMap.ToolBar());
      });
      map.plugin('AMap.Geolocation', function() {
        geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 10000,          //超过10秒后停止定位，默认：无穷大
          buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          buttonPosition:'RB'
        });
        map.addControl(geolocation);
        map.setZoom(10);
        geolocation.getCurrentPosition();
        // AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
        AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
      });

      //解析定位结果
      // function onComplete(data) {
      //   var str=['定位成功'];
      //   str.push('经度：' + data.position.getLng());
      //   str.push('纬度：' + data.position.getLat());
      //   if(data.accuracy){
      //     str.push('精度：' + data.accuracy + ' 米');
      //   }//如为IP精确定位结果则没有精度信息
      //   str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
      //   document.getElementById('tip').innerHTML = str.join('<br>');
      // }
      //解析定位错误信息
      function onError(data) {
        document.getElementById('tip').innerHTML = '定位失败';
      }
    }
  }();
}]);
