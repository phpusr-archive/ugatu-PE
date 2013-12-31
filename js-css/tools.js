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

/** Возвращает Мин. и Макс. значения факторов */
function getMinMaxX(a) {
    var minMaxArray = [];
    for (var j=0; j<a[0].length; j++) {
        var max = a[0][j], min = a[0][j];
        for (var i=0; i<a.length; i++) {
            if (a[i][j] < min) min = a[i][j];
            if (a[i][j] > max) max = a[i][j];
        }

        minMaxArray[j] = {min: min, max: max};
    }

    return minMaxArray;
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
    var minMaxArray = [];
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
        minMaxArray[i] = {min: xiMin, max: xiMax, xi0: xi0, dxi: dxi};
        if (false) console.log(i+1, minMaxArray[i]);

        //Находим нормированное значение xi для каждого фактора Xij
        for (j=0; j<row.length; j++) {
            normArray[i][j] = (row[j] - xi0) / dxi;
        }
    }

    return {normArray: normArray, minMaxArray: minMaxArray};
}

/** Возвращает матрицу планирования */
function getPlanMatrix(minMaxX) {
    var rows = 8; //TODO
    var columns = 5; //TODO
    var planMatrix = [];
    var charPlus = '+';
    var charMinus = '-';
    var y = [];

    for (var i=0; i<rows; i++) {
        planMatrix[i] = [];
        var bin = i.toString(2);
        var maxValues = [], minValues = [];
        for (var j=columns-2; j>=0; j--) {
            if (j==0) {
                planMatrix[i][j] = charPlus;
            } else {
                var char = bin.charAt(bin.length - 1);
                if (char=='1') {
                    planMatrix[i][j] = charPlus;
                    maxValues.push(j-1);
                } else {
                    planMatrix[i][j] = charMinus;
                    minValues.push(j-1);
                }
                bin = bin.slice(0, bin.length-1);
            }
        }

        //Подсчет Y
        y[i] = calcY(minMaxX, minValues, maxValues);
        planMatrix[i][columns-1] = y[i];
    }

    return {planMatrix: planMatrix, y: y};
}

/** Расчет Y */
function calcY(minMaxX, minValues, maxValues) {
    var sum = 0;
    for (j=0; j<minValues.length; j++) {
        var index = minValues[j];
        sum += minMaxX[index].min;
        //console.log(minMaxX[index].min)
    }
    for (var j=0; j<maxValues.length; j++) {
        index = maxValues[j];
        sum += minMaxX[index].max;
    }

    return sum;
}

/** Оценки коэффициентов регрессии */
function getRaitings(a, y) {
    var b = [];
    b[0] = getB(a, y);
    for (var i=1; i<=3; i++) {
        b[i] = getB(a, y, i);
    }
    b[4] = getB(a, y, 1, 2);
    b[5] = getB(a, y, 1, 3);
    b[6] = getB(a, y, 2, 3);
    b[7] = getB(a, y, 1, 2, 3);

    if (false) console.log('b', b);
    return b;
}

/** Возвращает коэффициент */
function getB(a, y, j1, j2, j3) {
    var sum = 0;
    for (var i=0; i<a.length; i++) {
        var row = a[i];
        var a1 = j1!=null ? row[j1-1] : 1;
        var a2 = j2!=null ? row[j2-1] : 1;
        var a3 = j3!=null ? row[j3-1] : 1;
        sum += a1 * a2 * a3 * y[i];
    }

    return sum / y.length;
}