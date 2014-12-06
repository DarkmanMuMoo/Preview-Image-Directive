/**
 * previewImage Module
 *
 * Description
 */
angular.module('file.directive', ['ui.bootstrap']);

angular.module('file.directive').run(['$templateCache', function ($templateCache) {
	$templateCache.put('imageModal.html', ' <div class="modal-header"> ' +
		'<h3 class="modal-title">Is This Picture Do you want ? </h3>' +
		'<button class="btn btn-primary" ng-click="ok()">OK</button>' +
		'<button class="btn btn-danger" ng-click="cancle()">Cancle</button>' +
		'<div>' +
		'</div>' +
		'<div class="modal-body" >' +
		'<img  class="center-block" style="max-width:400px;max-height: 300px;" ng-src="{{data}}" />' +
		'</div>');
}]);

angular.module('file.directive').directive('fileModel', function () {

	return {
		scope: {
			fileModel: '='
		},
		controller: function ($scope, $element) {
			this.$clearValue = function () {
				$scope.fileModel = null;
				$element.val(null);
			};
		},
		restrict: 'A',
		priority: 1,
		link: function (scope, elem) {
			elem.bind("change", function (changeEvent) {
				if (changeEvent.target.files.length > 0) {
					scope.$apply(function () {
						scope.fileModel = changeEvent.target.files;
					});
				}
			});
		}
	};

});

angular.module('file.directive').controller('imageModalCtrl', ['$scope', 'data', function ($scope, data) {

	$scope.data = data;

	$scope.ok = function () {
		$scope.$close();
	};

	$scope.cancle = function () {
		$scope.$dismiss('cancel');
	};
}]);

angular.module('file.directive').directive('previewImage', ['$modal', '$parse', function ($modal, $parse) {
	return {
		require: 'fileModel',
		priority: 10,
		restrict: 'A',
		link: function (scope, elem, attr, fileModelCtrl) {
			scope.$watch(function (scope) {
				return $parse(attr.fileModel)(scope);
			}, function (newVal) {
				if (angular.isDefined(newVal) && newVal && newVal.length > 0) {
					showModal(newVal);
				}
			});
			scope.$watch(function () {
				var modelValue = $parse(attr.fileModel);
			});

			function showModal(newVal) {
				var FR = new FileReader();
				FR.onload = function (e) {
					var modal = $modal.open({
						templateUrl: 'imageModal.html',
						controller: 'imageModalCtrl',
						resolve: {
							data: function () {
								return e.target.result;
							}
						}
					});

					modal.result.then(null, function () {
						fileModelCtrl.$clearValue();
					});
				};
				FR.readAsDataURL(newVal[0]);
			}
		}


	};
}]);