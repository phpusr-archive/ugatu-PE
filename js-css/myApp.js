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
        console.log('----Calculates begin----')
        var a = convertTable2Array($scope.table);

        //Нормирование факторов
        var resNorm = getNormFactors(a);
        $scope.normMatrix = resNorm.normArray;
        //TODO
        var minMaxArray = resNorm.minMaxArray;
        var minMaxX = getMinMaxX(a);

        //Матрица планирования
        var resPlan = getPlanMatrix(minMaxX);
        $scope.planMatrix = resPlan.planMatrix;

        //Значения функции отклика
        var y = resPlan.y;

        //Оценки коэффициентов регрессии
        $scope.b = getRaitings(a, y);
        //Уравнение регрессии
        $scope.equ = 'Y = ';
        for (var i=0; i<$scope.b.length; i++) {
            $scope.equ += $scope.b[i].toFixed(3) + '*X' + i;
            if (i < $scope.b.length-1) $scope.equ += ' + ';
        }

        //Дисперсии функции отклика
        $scope.disp = getDisp(y);

        //t-критерии Стьюдента
        $scope.critStud = getCritStudent($scope.b, $scope.disp);
        //Уровень значимости
        $scope.a = 0.95;
        //Число степеней свободы
        $scope.f = countY-1;
        //t-табличное
        $scope.t = 4.3020;

        //Критерий Фишера
        $scope.critFish = getCritFish(y.length, countY);
        $scope.f1 = $scope.f;
        $scope.f2 = y.length - ($scope.f1+1)
        $scope.a2 = 0.05;
        $scope.fTable = 5.79;
    };

    /** Заполнение значениями по умолчанию */
    $scope.stdFill = function() {
        $scope.rows = 3;
        $scope.columns = 3;

        $scope.changeParams();
        loadData([
			'i', 'X1 ','X2 ','X3 ',
            '1', 2.132,3.373,3.978,
            '2', 2.114,3.324,3.928,
            '3', 2.160,3.377,3.905
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