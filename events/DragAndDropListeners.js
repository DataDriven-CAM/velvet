/* global pmc */
pmc.DragAndDropListeners = class DragAndDropListeners {
    constructor(velvet){
        this.velvet = velvet;
    }
    
    dragenter (event){
        event.preventDefault();
    }
    
    dragover (event){
        event.preventDefault();
    }
    
    drop (event){
        event.preventDefault();
          var tokenFactory=velvet.parser.getTokenFactory();
        var data = event.dataTransfer.getData("text");
        var column = (velvet.keyEventListeners.isCRLF(velvet.tokens.tokens[velvet.tokenIndex-1])) ? 0 : 1;
      velvet.tokens.tokens.splice(velvet.tokenIndex, 0, tokenFactory.create(velvet.tokens.tokens[velvet.tokenIndex].source, 37, data, velvet.tokens.tokens[velvet.tokenIndex].DEFAULT_CHANNEL, velvet.tokens.tokens[velvet.tokenIndex].stop, velvet.tokens.tokens[velvet.tokenIndex].stop+data.length, velvet.tokens.tokens[velvet.tokenIndex].line, column));
      velvet.charOffset=1;
      velvet.tokens.tokens[velvet.tokenIndex].tokenIndex=velvet.tokenIndex;
      velvet.tokens.tokens[velvet.tokenIndex].column= (velvet.keyEventListeners.isCRLF(velvet.tokens.tokens[velvet.tokenIndex-1])) ? 0 : 1;
      console.log("drop token "+velvet.tokens.tokens.length+" "+JSON.stringify(velvet.tokens.tokens[velvet.tokenIndex].text));
      for(var i= velvet.tokenIndex+1, l = velvet.tokens.tokens.length; i< l; i++){
        //velvet.tokens.tokens[i].stop-=tokenRange;
        //velvet.tokens.tokens[i].start-=tokenRange;
        velvet.tokens.tokens[i].tokenIndex++;
      }
if (event.dataTransfer.types != null) {
   for (var i=0; i < event.dataTransfer.types.length; i++) {
     console.log("... types[" + i + "] = " + event.dataTransfer.types[i]);
   }
 }
    //velvet.displayRule(velvet.tokenIndex);
          velvet.layoutText();
          //var predict=velvet.lexer._interp.matchATN(data);
    /*Object.getOwnPropertyNames(velvet.lexer._interp.atn).forEach(
      function (val, idx, array) {
        console.log(val + ' -> ' + velvet.lexer._interp.atn[val]);
      }
    );*/
    }
}