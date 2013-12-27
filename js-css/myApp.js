'use strict';

var app = angular.module('myApp', ['ngSanitize']);
app.controller('MyCtrl', function MyCtrl($scope) {
    $scope.subject = 'ПЭ';
    $scope.lab = 'РГР (Вариант 13)';
    var rows = 0, columns = 0;

    $scope.changeParams = function() {

        if ($scope.rows != null && $scope.columns != null) {

            //Заголовки
            rows = $scope.rows+1;
            columns = $scope.columns+1;

            //Заполнение заголовков
            $scope.table = [];
            $scope.table[0] = [];
            $scope.table[0][0] = new Data('X', true);
            for (var j=1; j<columns; j++) {
                $scope.table[0][j] = new Data('Param '+j, true);
            }
            for (var i=1; i<rows; i++) {
                $scope.table[i] = [];
                $scope.table[i][0] = new Data(i, true);
            }

            //Заполнение нулями
            for (i=1; i<rows; i++) {
                for (j=1; j<columns; j++) {
                    $scope.table[i][j] = new Data(0, false);
                }
            }

            //Изменение таблицы с результатами
            $scope.changeTable();
        }
    };

    $scope.changeTable = function() {
        //console.log('table', $scope.table);

    };

    /** Заполнение значениями по умолчанию */
    $scope.stdFill = function() {
        $scope.rows = 4;
        $scope.columns = 5;

        $scope.changeParams();
        loadData([
			'X', '', '', '', '', '',
            '', 2.132,2.114,2.160,2.146,2.120,
            '', 3.373,3.324,3.377,3.327,3.358,
            '', 3.978,3.928,3.905,3.948,3.904,
            'Y', 6.898,6.908,6.887,6.940,6.904
        ]);
        $scope.changeTable();
    };

    /** Загрузка данных в таблицу */
    function loadData(data) {
        for (var i=0; i<rows; i++) {
            for (var j=0; j<columns; j++) {
                var val = data[(i)*(columns)+(j)];
                var title = i == 0 || j == 0;
                $scope.table[i][j] = new Data(val, title);
            }
        }
    }

    //Начальная инициализация
    $scope.stdFill();
});
/** Структура для хранения данных ячейки */
function Data(val, title) {
    this.val = val;
    this.title = title;
}