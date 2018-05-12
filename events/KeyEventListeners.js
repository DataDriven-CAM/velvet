/* global pmc */
pmc.KeyEventListeners = class KeyEventListeners{
    constructor(velvet){
      this.velvet = velvet;
    }
    
    press (event){
      //console.log('Key event is received!! '+event.shiftKey+" "+event.ctrlKey+" "+event.altKey);
      if(event.shiftKey && event.ctrlKey && !event.altKey){
        if(this.externalkeyListener!=undefined)this.externalkeyListener(event);
      }
      else if(!event.shiftKey && event.ctrlKey && !event.altKey){
        switch (event.key) {
        case "z":
          break;
        case "x":
          if(velvet.cursor.selected && velvet.cursor.stopTokenIndex>=velvet.cursor.startTokenIndex){
            velvet.cursor.selectedTokens = [];
            var currentLine=velvet.tokens.tokens[velvet.tokenIndex+1].line;
            var crlfCount=0;
            for(var index=velvet.cursor.startTokenIndex;index<=velvet.cursor.stopTokenIndex;index++){
                velvet.cursor.selectedTokens.push(velvet.tokens.tokens[index].clone());
                if(velvet.keyEventListeners.isCRLF(velvet.tokens.tokens[index]))crlfCount++;
            }
            velvet.tokens.tokens.splice(velvet.cursor.startTokenIndex, velvet.cursor.stopTokenIndex-velvet.cursor.startTokenIndex+1);
            for(var i= velvet.tokenIndex, l = velvet.tokens.tokens.length; i< l; i++){
              velvet.tokens.tokens[velvet.tokenIndex].tokenIndex--;
              //this.tokens.tokens[i].stop-=tokenRange;
              //this.tokens.tokens[i].start-=tokenRange;
              if(crlfCount && velvet.tokens.tokens[i].line>currentLine)velvet.tokens.tokens[i].line-=crlfCount;
            }
            velvet.layoutText();
          }
          break;
        case "c":
          if(velvet.cursor.selected && velvet.cursor.stopTokenIndex>=velvet.cursor.startTokenIndex){
            velvet.cursor.selectedTokens = [];
            for(var index=velvet.cursor.startTokenIndex;index<=velvet.cursor.stopTokenIndex;index++){
                velvet.cursor.selectedTokens.push(velvet.tokens.tokens[index].clone());
            }
          }
          break;
        case "v":
          if(velvet.cursor.selectedTokens.length>0){
            var firstLine=velvet.cursor.selectedTokens[0].line;
            var currentLine=velvet.tokens.tokens[velvet.tokenIndex].line;
            var crlfCount=0;
            for(var token in velvet.cursor.selectedTokens){
              velvet.tokens.tokens.splice(velvet.tokenIndex, 0, velvet.cursor.selectedTokens[token]);
              velvet.charOffset=1;
              velvet.tokens.tokens[velvet.tokenIndex].tokenIndex=velvet.tokenIndex;
              velvet.tokens.tokens[velvet.tokenIndex].column= (velvet.keyEventListeners.isCRLF(velvet.tokens.tokens[velvet.tokenIndex-1])) ? 0 : 1;
              velvet.tokens.tokens[velvet.tokenIndex].line -= firstLine;
              velvet.tokens.tokens[velvet.tokenIndex].line += currentLine;
              //console.log(velvet.cursor.selectedTokens[token].type+" added token "+velvet.tokens.tokens.length+" "+JSON.stringify(velvet.tokens.tokens[velvet.tokenIndex].text));
              if(velvet.keyEventListeners.isCRLF(velvet.cursor.selectedTokens[token]))crlfCount += 1;
              velvet.tokenIndex++;
            }
            //console.log("crlfCount " +crlfCount);
            if(crlfCount>0)
              for(var i= velvet.tokenIndex+1, l = velvet.tokens.tokens.length; i< l; i++){
                //velvet.tokens.tokens[i].stop-=tokenRange;
                //velvet.tokens.tokens[i].start-=tokenRange;
                velvet.tokens.tokens[i].tokenIndex++;
                velvet.tokens.tokens[i].line+=crlfCount;
              }
    var lineStartIndex=velvet.tokenIndex;
    currentLine=velvet.tokens.tokens[velvet.tokenIndex].line;
    var tokenRange=velvet.tokens.tokens[velvet.tokenIndex].text.length;
    while(lineStartIndex>0 && velvet.tokens.tokens[lineStartIndex].line===currentLine){
      lineStartIndex--;
    }
          var line=velvet.tokens.getText({start: velvet.tokens.tokens[lineStartIndex], stop: velvet.tokens.tokens[velvet.tokenIndex]});
        var ctx = velvet.canvas.getContext('2d');
             velvet.cursor.position(ctx.measureText(line.substring(0, line.length-tokenRange+velvet.charOffset)).width, currentLine*18);
            velvet.layoutText();
          }
          break;
        }
      }
      event.preventDefault();
    }
    
    isCRLF(token){
      var ret=false;
      if(token.type==58)
      switch(token.text.length)
      {
        case 2:
          ret= (token.text[0]==='\r' && token.text[1]==='\n');
        break;
        case 1:
          ret= (token.text[0]==='\r' || token.text[0]==='\n');
        break;
        default:
        break;
      }
      return ret;
    }
    
    down(event) {
      if(event.shiftKey || event.ctrlKey || event.altKey){
        return;
      }
    var currentLine=velvet.tokens.tokens[velvet.tokenIndex].line;
    var tokenRange=velvet.tokens.tokens[velvet.tokenIndex].text.length;
    switch (event.key) {
    case "ArrowLeft":
        // Left pressed
        velvet.autocomplete.setCandidateValue("", event);
        if(velvet.charOffset>0)velvet.charOffset--;
        else if(velvet.tokenIndex>0){
          velvet.tokenIndex--;
          currentLine=velvet.tokens.tokens[velvet.tokenIndex].line;
          tokenRange=velvet.tokens.tokens[velvet.tokenIndex].text.length;
          velvet.charOffset=tokenRange-1;
          if(velvet.keyEventListeners.isCRLF(velvet.tokens.tokens[velvet.tokenIndex])){
            velvet.charOffset=0;
          }
          else{
            
          }
        }
        break;
    case "ArrowRight":
        // Right pressed
        velvet.autocomplete.setCandidateValue("", event);
        if(!velvet.keyEventListeners.isCRLF(velvet.tokens.tokens[velvet.tokenIndex]) && velvet.charOffset<tokenRange-1)velvet.charOffset++;
        else if(velvet.tokenIndex<velvet.tokens.tokens.length-1){
          velvet.tokenIndex++;
          currentLine=velvet.tokens.tokens[velvet.tokenIndex].line;
          tokenRange=velvet.tokens.tokens[velvet.tokenIndex].text.length;
          velvet.charOffset=0;
          if(velvet.keyEventListeners.isCRLF(velvet.tokens.tokens[velvet.tokenIndex])){
            velvet.charOffset=tokenRange-1;
          }
          else{
            
          }
        }
        break;
    case "ArrowUp":
        // Up pressed
        if( velvet.autocomplete.countListSize()>=1){
          velvet.autocomplete.decrementFocus();
        }
        else{
        velvet.autocomplete.setCandidateValue("", event);
        var startIndex=velvet.tokenIndex;
        while(startIndex>0 && velvet.tokens.tokens[startIndex].line===currentLine){
          startIndex--;
        }
        velvet.tokenIndex=(startIndex>0) ? startIndex-1 : 0;
          currentLine=velvet.tokens.tokens[velvet.tokenIndex].line;
          tokenRange=velvet.tokens.tokens[velvet.tokenIndex].stop-velvet.tokens.tokens[velvet.tokenIndex].start+1;
          if(velvet.charOffset>tokenRange)velvet.charOffset=tokenRange;
        }
        break;
    case "ArrowDown":
        // Down pressed
        if( velvet.autocomplete.countListSize()>=1){
          velvet.autocomplete.incrementFocus();
        }
        else{
        velvet.autocomplete.setCandidateValue("", event);
        var endIndex=velvet.tokenIndex;
        while(endIndex<velvet.tokens.tokens.length-1 && velvet.tokens.tokens[endIndex].line===currentLine){
          endIndex++;
        }
        velvet.tokenIndex=(endIndex<velvet.tokens.tokens.length-1) ? endIndex+1 : velvet.tokens.tokens.length-1;
          currentLine=velvet.tokens.tokens[velvet.tokenIndex].line;
          tokenRange=velvet.tokens.tokens[velvet.tokenIndex].stop-velvet.tokens.tokens[velvet.tokenIndex].start+1;
          if(velvet.charOffset>tokenRange)velvet.charOffset=tokenRange;
        }
        break;
        case "Enter":
          var tokenFactory=velvet.parser.getTokenFactory();
          /*for (var key of velvet.tokenMap.keys()) {
            if(key==="'\n'" || key==="'\r'" || key==="'\r\n'"){
            console.log("ent:"+velvet.tokenMap.get(key));
            }
          }*/
          if( velvet.autocomplete.countListSize()>=1){
            //velvet.autocomplete.setCandidateValue(velvet.tokens.tokens[velvet.tokenIndex].text, event);
            velvet.tokens.tokens[velvet.tokenIndex].text=velvet.autocomplete.getCompletedValue();
            velvet.tokens.tokens[velvet.tokenIndex].stop=velvet.tokens.tokens[velvet.tokenIndex].start+velvet.tokens.tokens[velvet.tokenIndex].text.length;
            velvet.tokens.tokens[velvet.tokenIndex].channel=velvet.tokens.tokens[velvet.tokenIndex].DEFAULT_CHANNEL;
            var typeLiteral="'"+velvet.tokens.tokens[velvet.tokenIndex].text+"'";
            if(velvet.tokenMap.has(typeLiteral)){
              velvet.tokens.tokens[velvet.tokenIndex].type = velvet.tokenMap[typeLiteral];
            }
            tokenRange=velvet.tokens.tokens[velvet.tokenIndex].stop-velvet.tokens.tokens[velvet.tokenIndex].start+1;
            velvet.charOffset=tokenRange;
            console.log("enter ac "+tokenRange+" "+velvet.charOffset);
          }
          else{
            velvet.tokens.tokens.splice(velvet.tokenIndex-1, 0, tokenFactory.create(velvet.tokens.tokens[velvet.tokenIndex].source, 58, "\n", velvet.tokens.tokens[velvet.tokenIndex].HIDDEN_CHANNEL, velvet.tokens.tokens[velvet.tokenIndex].stop+1, velvet.tokens.tokens[velvet.tokenIndex].stop+2, velvet.tokens.tokens[velvet.tokenIndex].line+1, 0));
            velvet.tokens.tokens[velvet.tokenIndex].tokenIndex=velvet.tokenIndex;
            velvet.tokenIndex++;
            for(var i= velvet.tokenIndex, l = velvet.tokens.tokens.length; i< l; i++){
              //velvet.tokens.tokens[i].stop-=tokenRange;
              //velvet.tokens.tokens[i].start-=tokenRange;
              velvet.tokens.tokens[i].tokenIndex++;
              velvet.tokens.tokens[i].line++;
            }
          }
          velvet.layoutText();
            velvet.autocomplete.setCandidateValue("", event);
          break;
        case "Backspace":
        case "Delete":
          if(event.key==="Backspace"){
            velvet.tokenIndex-1;
            tokenRange=velvet.tokens.tokens[velvet.tokenIndex].stop-velvet.tokens.tokens[velvet.tokenIndex].start+1;
            velvet.charOffset=0;
          }
          else {
            tokenRange=velvet.tokens.tokens[velvet.tokenIndex].stop-velvet.tokens.tokens[velvet.tokenIndex].start+1;
            velvet.charOffset=tokenRange;
          }
          if(velvet.keyEventListeners.isCRLF(velvet.tokens.tokens[velvet.tokenIndex])){
            velvet.removeCurrentToken();
          }
          else{
            if(velvet.tokens.tokens[velvet.tokenIndex].text.length>1){
              velvet.tokens.tokens[velvet.tokenIndex].text=velvet.tokens.tokens[velvet.tokenIndex].text.substring(0, velvet.tokens.tokens[velvet.tokenIndex].text.length-1);
              velvet.tokens.tokens[velvet.tokenIndex].stop++;
              velvet.charOffset++;
              velvet.autocomplete.setCandidateValue(velvet.tokens.tokens[velvet.tokenIndex].text, event);
            }
            else{
              velvet.removeCurrentToken();
            }
              //velvet.layoutText();
          }
          velvet.layoutText();
          break;
          case "Alt":
          case "Control":
          case "Shift":
            break;
        default:
          if(event.key>=' ' && event.key<='z'){
            //console.log("type="+velvet.tokens.tokens[velvet.tokenIndex].type);
            var stay = (velvet.autocomplete.countListSize()>=1 && velvet.tokens.tokens[velvet.tokenIndex].text===velvet.autocomplete.getCompletedValue());
            if(velvet.tokens.tokens[velvet.tokenIndex].type!=37 || stay){
              var tokenFactory=velvet.parser.getTokenFactory();
              var column = (stay) ? 1 : 0;
              console.log("adding token "+velvet.tokens.tokens.length+" "+JSON.stringify(velvet.tokens.tokens[velvet.tokenIndex].text));
              velvet.tokenIndex++;
              velvet.tokens.tokens.splice(velvet.tokenIndex, 0, tokenFactory.create(velvet.tokens.tokens[velvet.tokenIndex].source, 37, event.key, velvet.tokens.tokens[velvet.tokenIndex].DEFAULT_CHANNEL, velvet.tokens.tokens[velvet.tokenIndex].stop, velvet.tokens.tokens[velvet.tokenIndex].stop+1, velvet.tokens.tokens[velvet.tokenIndex].line, column));
              velvet.charOffset=1;
              velvet.tokens.tokens[velvet.tokenIndex].tokenIndex=velvet.tokenIndex;
              velvet.tokens.tokens[velvet.tokenIndex].column= (isCRLF(velvet.tokens.tokens[velvet.tokenIndex-1])) ? 0 : 1;
              console.log("added token "+velvet.tokens.tokens.length+" "+JSON.stringify(velvet.tokens.tokens[velvet.tokenIndex].text));
              for(var i= velvet.tokenIndex+1, l = velvet.tokens.tokens.length; i< l; i++){
                //velvet.tokens.tokens[i].stop-=tokenRange;
                //velvet.tokens.tokens[i].start-=tokenRange;
                velvet.tokens.tokens[i].tokenIndex++;
              }
            }
            else {
              velvet.tokens.tokens[velvet.tokenIndex].text+=event.key;
              velvet.tokens.tokens[velvet.tokenIndex].stop++;
              velvet.charOffset++;
              //if(velvet.autoList.includes(velvet.tokens.tokens[velvet.tokenIndex].text)){
              //  console.log("lit: "+velvet.tokens.tokens[velvet.tokenIndex].text);
              //}
            }
              velvet.layoutText();
              velvet.autocomplete.setCandidateValue(velvet.tokens.tokens[velvet.tokenIndex].text, event);
          }
          else{
            velvet.autocomplete.setCandidateValue("", event);
            console.log("default: "+event.key);
          }
          break;
    }
    var lineStartIndex=velvet.tokenIndex;
    while(lineStartIndex>0 && velvet.tokens.tokens[lineStartIndex].line===currentLine){
      lineStartIndex--;
    }
    console.log('place '+velvet.charOffset+" "+tokenRange+" start "+lineStartIndex+" "+velvet.tokenIndex+" "+currentLine+" "+velvet.tokens.tokens[velvet.tokenIndex].text+" "+velvet.tokens.tokens[velvet.tokenIndex].column+" "+velvet.tokens.tokens[velvet.tokenIndex].type);
        var line=velvet.tokens.getText({start: velvet.tokens.tokens[lineStartIndex], stop: velvet.tokens.tokens[velvet.tokenIndex]});
        console.log("line "+JSON.stringify(line));
        var ctx = velvet.canvas.getContext('2d');
        velvet.cursor.overlay(ctx.measureText(line.substring(0, line.length-tokenRange+velvet.charOffset)).width, currentLine*18);
        event.preventDefault();
    }
    
}
