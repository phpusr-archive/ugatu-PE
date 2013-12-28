'use strict';

/** Преобразует таблицу в вещественный массив */
function convertTable2Array(table) {
    var a = [];
    for (var i=1; i<table.length; i++) {
        var row = table[i];
        a[i-1] = [];
        for (var j=1; j<row.length; j++) {
            a[i-1][j-1] = parseFloat(row[j].val);
        }
    }

    return a;
}

/** Загрузка данных в таблицу */
function loadData(data, table) {
    for (var i=0; i<table.length; i++) {
        var columns = table[i].length;
        for (var j=0; j<columns; j++) {
            var val = data[(i)*(columns)+(j)];
            var title = i == 0 || j == 0;
            table[i][j] = new Data(val, title);
        }
    }
}

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
        //Вычисляем Xi0 и интервал изменения фактора dXi
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

/** Возвращает матрицу планирования */
function getPlanMatrix() {
    var rows = 8; //TODO
    var columns = 4; //TODO
    var planMatrix = [];
    var charPlus = '+';
    var charMinus = '-';

    for (var i=0; i<rows; i++) {
        planMatrix[i] = [];
        var bin = i.toString(2);
        for (var j=columns-1; j>=0; j--) {
            if (j==0) {
                planMatrix[i][j] = charMinus;
            } else {
                var char = bin.charAt(bin.length - 1);
                planMatrix[i][j] = char=='1' ? charPlus : charMinus;
                bin = bin.slice(0, bin.length-1);
            }
        }

        //TODO остальные
    }

    return planMatrix;
}

