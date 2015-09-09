/*
 * 输入: 一串字符
 * 输出: 单词,[]
 * */
var stemmer = require('porter-stemmer').stemmer;
var _ = require('lodash');

module.exports = function (sentence) {
    var list = sentence.split(' ');
    //regex \W match any non char
    var regex = /\W/;
    //lodash remove unmatched items
    _.remove(list, function (n) {
        return regex.test(n);
    });

    //if only the first char and only the first Char is Uppercase, lowercase it
    var regexFirstUppercase = /^[A-Z][a-z]*$/;
    list.forEach(function (element, index) {
        if (regexFirstUppercase.test(element)) {
            list[index] = element.toLowerCase();
        }
    });

    //stemmer get word
    list.forEach(function (element, index) {
        list[index] = stemmer(element);
    });
    return list;
};

//match single char
function matchSingleChar(phrase) {
    if (phrase.length === 1) {
        return true;
    }
}

//for exclude . , \n : etc
function matchLast(phrase) {
    var symbols = ['.', '\n', ':', ',', '\t'];
    var match = symbols.every(function (element) {
        return element === phrase[phrase.length - 1];
    });
}

//matching escape character
function matchingESC(phrase) {
    var regex = /.\\/;
}

function advanceTrimer(phrase) {
    var firstChar = phrase[0],
        lastChar = phrase[phrase.length - 1];
    if ((phrase[0] < "a" || phrase[0] > "Z") || (lastChar < "a")) {

        return trimmed;
    }
}
