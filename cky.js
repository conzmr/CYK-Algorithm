function cyk() {

  var grammar = [
      'S -> A B | S S | A C | B D',
      'A -> a',
      'B -> b',
      'C -> S B',
      'D -> S A'
  ];

  var word = 'a a b b a b';

  var derivationTree = parse(parseGrammar(grammar), word.split(' '));

  for (var i in derivationTree[0][derivationTree.length - 1]) {
      document.body.innerHTML += '<div class="tree" id="displayTree"><ul>' + traversal(derivationTree, 0, derivationTree.length - 1, i) + '</ul></div><br/>';
  }

  function parseGrammar(grammar) {
      var dict = {};
      for (var i in grammar) {
          var production = grammar[i];
          var splitted = production.split('->');
          var root = splitted[0].trim();

          var productions = splitted[1].split('|');
          for(var j in productions) {
              var childs = (productions[j].trim()).split(' ');
              var key = setKey(childs);
              if (!dict[key]) {
                  dict[key] = [];
              }
              dict[key].push(root);
          }
      }
      return dict;
  }

  function newArray(dim) {
    var array = new Array(dim);
    for (var i = 0; i < dim; i++) {
        array[i] = new Array(dim);
        for (var j = 0; j < dim; j++) {
            array[i][j] = [];
        }
    }
    return array;
  }

function setKey(obj) {
    if(typeof obj === 'string') {
        obj = [obj];
    }
    var jsonObj = JSON.stringify(obj, null, 0);
    return jsonObj;
}

function parse(grammar, tokens) {
    var tokensLen = tokens.length + 1;
    var parsed = newArray(tokensLen);
    for (var right = 1; right < tokensLen; right++) {
        var token = tokens[right - 1];
        var terminalRules = grammar[setKey(token)];
        for (var r in terminalRules) {
            var rule = terminalRules[r];
            parsed[right - 1][right].push({
                rule: rule,
                token: token
            });
        }
        for (var left = right - 2; left >= 0; left--) {
            for (var mid = left + 1; mid < right; mid++) {
                var leftSubtreeRoots = parsed[left][mid];
                var rightSubtreeRoots = parsed[mid][right];
                for (var leftRootIndx in leftSubtreeRoots) {
                    for (var rightRootIndx in rightSubtreeRoots) {
                        var rls = grammar[setKey([leftSubtreeRoots[leftRootIndx]['rule'],  rightSubtreeRoots[rightRootIndx]['rule']])];
                        if (rls) {
                            for (var r in rls) {
                                parsed[left][right].push({
                                    rule: rls[r],
                                    middle: mid,
                                    leftRootIndex: leftRootIndx,
                                    rightRootIndex: rightRootIndx
                                });
                            }
                        }
                    }
                }
            }
        }
    }
    return parsed;
}

function traversal(parseTable, left, right, rootIndex) {
        if (!parseTable[left][right][rootIndex]['middle']) {
            return '<li><a href="#">' + parseTable[left][right][rootIndex]['rule'] + '</a><ul><li><a href="#">' + parseTable[left][right][rootIndex]['token'] + '</a></li></ul></li>';
        }
        return '<li><a href="#">' + parseTable[left][right][rootIndex]['rule'] + '</a><ul>' + traversal(parseTable, left, parseTable[left][right][rootIndex]['middle'], parseTable[left][right][rootIndex]['leftRootIndex']) + traversal(parseTable, parseTable[left][right][rootIndex]['middle'], right, parseTable[left][right][rootIndex]['rightRootIndex']) + '</ul></li>';
    }


}
