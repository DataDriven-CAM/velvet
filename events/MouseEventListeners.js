/* global pmc */
pmc.MouseEventListeners = class MouseEventListeners{
    constructor(velvet){
      this.velvet = velvet;
    }

    click (event){
        var rect = velvet.canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top+20;
        velvet.cursor.position(x, y);
        //velvet.displayRule(velvet.tokenIndex);
      event.preventDefault();
    }
    
    traceRule(state){
          var predict = velvet.parser._interp.atn.getExpectedTokens(state, null);
          for(var index in predict.intervals){
            var ruleInterval=predict.intervals[index];
          //console.log(ruleInterval);
            for(var rule=ruleInterval.start;rule<ruleInterval.stop;rule++){
            //if(velvet.tokens.tokens[velvet.tokenIndex].type===velvet.parser._interp.atn.ruleToTokenType[rule])
            //if(rule===94){
            console.log(rule+" p names: "+velvet.parser.ruleNames[rule]+" "+velvet.parser._interp.atn.ruleToStartState[rule]+" "+velvet.parser._interp.atn.ruleToStopState[rule]);
             velvet.mouseEventListeners.traceRule(velvet.parser._interp.atn.ruleToStartState[rule]);
            //}
            }
          }
    }
    
    doubleclick (event){
        var rect = velvet.canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top+20;
        velvet.cursor.position(x, y);
        velvet.cursor.startTokenIndex=velvet.tokenIndex;
        velvet.cursor.stopTokenIndex=velvet.tokenIndex;
        velvet.cursor.selected=true;
        velvet.layoutText();
        
        for(var guessIndex=0;guessIndex<velvet.lexer._interp.atn.states.length;guessIndex++){
          var predict = velvet.lexer._interp.atn.getExpectedTokens(guessIndex, null);
          for(var index in predict.intervals){
            var ruleInterval=predict.intervals[index];
          //console.log(velvet.lexer.ruleNames[guessIndex]+" "+guessIndex);
            for(var rule=ruleInterval.start;rule<ruleInterval.stop;rule++){
            if(velvet.tokens.tokens[velvet.tokenIndex].type===velvet.lexer._interp.atn.ruleToTokenType[rule])
            console.log(rule+" names: "+velvet.lexer.ruleNames[rule]+" lit: "+velvet.lexer.literalNames[rule]+" "+velvet.lexer._interp.atn.ruleToTokenType[rule]+" "+velvet.lexer._interp.atn.ruleToStartState[rule]+" "+velvet.lexer._interp.atn.ruleToStopState[rule]);
            }
          }
        }

      console.log("velvet.parser._interp");
      console.log(velvet.parser._interp);
      console.log("velvet.tree");
      console.log(velvet.tree);
      var upTo =[];
        for(var guessIndex=0;guessIndex<velvet.tokenIndex;guessIndex++){
//          console.log(velvet.tokens.tokens[guessIndex]);
          if(velvet.tokens.tokens[guessIndex].channel===0){
            upTo.push(velvet.tokens.tokens[guessIndex].type);
          }
        }
        var treeTypes = [];
        var treeRuleTypes = [];
          var ruleIndex = -1;
        for(var guessIndex=0;guessIndex<velvet.tree.children.length;guessIndex++){
          if(velvet.tree.children[guessIndex].children != undefined){
            for(var childIndex=0;childIndex<velvet.tree.children[guessIndex].children.length;childIndex++){
              if(velvet.tree.children[guessIndex].children[childIndex].symbol != undefined){
                treeTypes.push(velvet.tree.children[guessIndex].children[childIndex].symbol.type);
              }
              else if(typeof velvet.tree.children[guessIndex].children[childIndex].start==='object'){
                treeTypes.push(velvet.tree.children[guessIndex].children[childIndex].start.type);
              }
              else{
                treeTypes.push(velvet.tree.children[guessIndex].children[childIndex].symbol.type);
              }
              ruleIndex = velvet.tree.children[guessIndex].ruleIndex;
              treeRuleTypes.push(ruleIndex);
            }
          }
          else{
              treeTypes.push(velvet.tree.children[guessIndex].symbol.type);
              treeRuleTypes.push(ruleIndex);
          }
        }
        for(var guessIndex=0;guessIndex<upTo.length;guessIndex++){
          console.log(upTo[guessIndex]+" map? "+treeTypes[guessIndex]+" "+treeRuleTypes[guessIndex]);
        }
        ruleIndex = treeRuleTypes[upTo.length-1];
        console.log(ruleIndex);
      if(velvet.atnListener!=undefined)velvet.atnListener(ruleIndex);
    }
    
    down (event){
        var rect = velvet.canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top+20;
        velvet.cursor.position(x, y);
        velvet.cursor.startTokenIndex=velvet.tokenIndex;
        velvet.mouseEventListeners.dragging = true;
    }
    
    move (event){
      if(velvet.mouseEventListeners.dragging){
        var rect = velvet.canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top+20;
        velvet.cursor.position(x, y);
      }
    }
    
    up (event){
        var rect = velvet.canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top+20;
        velvet.cursor.position(x, y);
        if(velvet.cursor.startTokenIndex<=velvet.tokenIndex){
          velvet.cursor.stopTokenIndex=velvet.tokenIndex;
        }
        else{
          velvet.cursor.stopTokenIndex=velvet.cursor.startTokenIndex;
          velvet.cursor.startTokenIndex=velvet.tokenIndex;
          
        }
        if(velvet.cursor.stopTokenIndex>velvet.cursor.startTokenIndex){
          velvet.cursor.selected=true;
          velvet.layoutText();
        }
        else if(velvet.cursor.selected){
          velvet.cursor.selected=false;
          velvet.layoutText();
        }
        velvet.mouseEventListeners.dragging = false;
    }
}