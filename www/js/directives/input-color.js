angular.module('app').directive('inputColor', ['$compile', 'utils', function($compile, utils) {
	return {
		restrict: 'AE',
		require: 'ngModel',
		scope: {
			ngModel: '='
		},
		link: function(scope, element, attr, ctrl) {
			utils.$ocLazyLoad.load('mobiscroll').then(function() {
				element = $(element[0]);

				var options = {
					theme: 'android-holo-light',
					lang: 'zh',
					display:'bottom',
					placeholder:'请选择颜色',
					headerText:attr.headerText||'请选择',
					buttons:[{
						text:'取消',
						handler:'cancel',
						icon:'close'
					},{
						text:'清空',
						handler:'clear',
						icon:'loop2'
					},{
						text:'确定',
						handler:'set',
						icon:'checkmark'
					}],
					onSet: function(value, inst) {
						// scope.ngModel = inst.getVal();
						// scope.$apply();
					}
				};

				var instance = element.mobiscroll();
				instance.color(options);
			});
		}
	};
}]);
