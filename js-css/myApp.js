'use strict';

var app = angular.module('myApp', ['ngSanitize']);
app.controller('MyCtrl', function MyCtrl($scope) {
    $scope.subject = 'ПЭ';
    $scope.lab = 'РГР (Вариант 13)';
    var rows = 0, columns = 0; //TODO возможно стоит убрать в ф-ю

    $scope.changeParams = function() {

        if ($scope.rows != null && $scope.columns != null) {

            //Заголовки
            rows = $scope.rows+1;
            columns = $scope.columns+1;
            var maxValue = 20;

            //Заполнение заголовков
            $scope.table = [];
            $scope.table[0] = [];
            $scope.table[0][0] = new Data('X', true);
            for (var j=1; j<columns; j++) {
                $scope.table[0][j] = new Data('', true);
            }
            for (var i=1; i<rows; i++) {
                $scope.table[i] = [];
                $scope.table[i][0] = new Data(i==rows-1 ? 'Y' : i, true);
            }

            //Заполнение нулями
            for (i=1; i<rows; i++) {
                for (j=1; j<columns; j++) {
                    $scope.table[i][j] = new Data(Math.random()*maxValue, false);
                }
            }

            //Изменение таблицы с результатами
            $scope.changeTable();
        }
    };

    $scope.changeTable = function() {
        var a = convertTable2Array($scope.table);
        console.log('array', a);

        //Нормирование факторов
        $scope.normArray = getNormFactors(a);
    };

    /** Заполнение значениями по умолчанию */
    $scope.stdFill = function() {
        $scope.rows = 4;
        $scope.columns = 5;

        $scope.changeParams();
        loadData([
			'X', '   ','   ','   ','   ','   ',
            '1', 2.132,2.114,2.160,2.146,2.120,
            '2', 3.373,3.324,3.377,3.327,3.358,
            '3', 3.978,3.928,3.905,3.948,3.904,
            'Y', 6.898,6.908,6.887,6.940,6.904
        ], $scope.table);
        $scope.changeTable();
    };

    //Начальная инициализация
    $scope.stdFill();
});
/** Структура для хранения данных ячейки */
function Data(val, title) {
    this.val = val;
    this.title = title;
}