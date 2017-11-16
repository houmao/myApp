angular.module('app').controller('mapController',['$rootScope','$scope','utils',function($rootScope,$scope,utils){
	$scope.vo = {

    };

    $scope.vc = {
        enter:function($event){
            if($event.keyCode == 13){
                $scope.vc.searchAddress($scope.vo.searchKey);
            }
        },
        searchAddress:function(searchKey){
            var BMap = $scope.vo.BMap;
            var map = $scope.vo.map;
            map.clearOverlays();
            var gc = new BMap.Geocoder();
            gc.getPoint(searchKey, function(point){
                if (point) {
                    // map.clearOverlays();
                    map.centerAndZoom(point, 16);
                    var marker = new BMap.Marker(point);
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
                      var infoWindow = new BMap.InfoWindow(addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber, opts);  // 创建信息窗口对象
                      map.openInfoWindow(infoWindow,point); //开启信息窗口

                      marker.addEventListener("click", function(){map.openInfoWindow(infoWindow,point);});
                    });
                }else{
                    alert('对不起，没有找到您输入的地址！');
                }
            }, "中国");
        },
      arriveHere:function (end) {
        var BMap = $scope.vo.BMap;
        var map = $scope.vo.map;
        map.clearOverlays();
        var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true},policy: 0});
        driving.search(map.zC,end);
      }
    };

    $scope.ready = function(){
    	window.mapCallback = function(BMap){
            var map = new BMap.Map("mapBox");
            $scope.vo.BMap = BMap;
            $scope.vo.map = map;
            var point = new BMap.Point(121.160724,31.173277);
            map.centerAndZoom(point,11);
            // map.addControl(new BMap.ZoomControl());
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(r){
              if(this.getStatus() == 0){
                var point = new BMap.Marker(r.point);
                map.addOverlay(point);
                map.panTo(r.point);
                // map.centerAndZoom(r.point,11);
                console.log(r);
              }
              else {
                alert('failed'+this.getStatus());
              }
            },{enableHighAccuracy: true});

            // map.addOverlay(new BMap.Marker(point));
            map.addControl(new BMap.NavigationControl());
            // map.addControl(new BMap.ScaleControl());
            map.addControl(new BMap.OverviewMapControl());
            map.addControl(new BMap.MapTypeControl());
            map.enableScrollWheelZoom(true);
            //
            // function ZoomControl(){
            //     this.defaultAnchor = 2;
            //     this.defaultOffset = new BMap.Size(10, 35);
            // }
            // ZoomControl.prototype = new BMap.Control();
            // ZoomControl.prototype.initialize = function(map){
            //     var div = document.createElement("div");
            //     div.innerHTML = '<img style="width:32px;height:32px;" src="../../img/common/maps_gps.png">';
            //     div.onclick = function(e){
            //         map.centerAndZoom(point,15);
            //     }
            //     map.getContainer().appendChild(div);
            //     return div;
            // }
            // var myZoomCtrl = new ZoomControl();
            // map.addControl(myZoomCtrl);
        }
    }();
}]);
