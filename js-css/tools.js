'use strict';

/** Возвращает номированные факторы */
function getNormFactors(a) {
    var normArray = [];
    for (var i=0; i<a.length; i++) {
        var row = a[i];
        normArray[i] = [];

        //Поиск xiMin и xiMax
        var xiMin = row[0], xiMax = row[0];
        for (var j=0; j<row.length; j++) {
            if (row[j] < xiMin) xiMin = row[j];
            if (row[j] > xiMax) xiMax = row[j];
        }
        //Вычисляем xi0, интервал изменения фактора dxi
        var xi0 = (xiMax + xiMin)/2;
        var dxi = xi0 - xiMin; //xiMax - xi0;
        console.log(i+1, 'min:', xiMin, 'max:', xiMax, 'xi0:', xi0, 'dxi:', dxi);

        //Находим нормированное значение xi для каждого фактора Xij
        for (j=0; j<row.length; j++) {
            normArray[i][j] = (row[j] - xi0) / dxi;
        }
    }

    return normArray;
}

