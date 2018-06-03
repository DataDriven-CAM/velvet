/* global pmc */
pmc.MouseEventListeners = class MouseEventListeners{
    constructor(velvet){
      this.velvet = velvet;
    }

    click (event){
        var ctx = velvet.canvas.getContext('2d');
        var x = event.clientX - ctx.canvas.offsetLeft + window.pageXOffset;
        var y = event.clientY - ctx.canvas.offsetTop + window.pageYOffset;
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
        var ctx = velvet.canvas.getContext('2d');
        var x = event.clientX - ctx.canvas.offsetLeft + window.pageXOffset;
        var y = event.clientY - ctx.canvas.offsetTop + window.pageYOffset;
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
            console.log(rule+" names: "+velvet.lexer.ruleNames[rule]+" "+velvet.lexer._interp.atn.ruleToTokenType[rule]+" "+velvet.lexer._interp.atn.ruleToStartState[rule]+" "+velvet.lexer._interp.atn.ruleToStopState[rule]);
            }
          }
        }

      if(velvet.atnListener!=undefined)velvet.atnListener(99);
    }
    
    down (event){
        var ctx = velvet.canvas.getContext('2d');
        var x = event.clientX - ctx.canvas.offsetLeft + window.pageXOffset;
        var y = event.clientY - ctx.canvas.offsetTop + window.pageYOffset;
        velvet.cursor.position(x, y);
        velvet.cursor.startTokenIndex=velvet.tokenIndex;
        velvet.mouseEventListeners.dragging = true;
    }
    
    move (event){
      if(velvet.mouseEventListeners.dragging){
        var ctx = velvet.canvas.getContext('2d');
        var x = event.clientX - ctx.canvas.offsetLeft + window.pageXOffset;
        var y = event.clientY - ctx.canvas.offsetTop + window.pageYOffset;
        velvet.cursor.position(x, y);
      }
    }
    
    up (event){
        var ctx = velvet.canvas.getContext('2d');
        var x = event.clientX - ctx.canvas.offsetLeft + window.pageXOffset;
        var y = event.clientY - ctx.canvas.offsetTop + window.pageYOffset;
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