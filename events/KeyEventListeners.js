/* global pmc */
pmc.KeyEventListeners = class KeyEventListeners{
    constructor(velvet){
      this.velvet = velvet;
    }
    
   removeCurrentCharacter(event){
     
    if(velvet.keyEventListeners.isCRLF(velvet.tokens.tokens[velvet.tokenIndex])){
      console.log("remove crlf");
      var tokenRange=velvet.tokens.tokens[velvet.tokenIndex].text.length;
      var position=velvet.tokens.tokens[velvet.tokenIndex].start;
      var output=velvet.tokens.tokens[velvet.tokenIndex].source[1].strdata.slice(0, position)+velvet.tokens.tokens[velvet.tokenIndex].source[1].strdata.slice(position+tokenRange);
      velvet.tokens.tokens[velvet.tokenIndex].source[1].strdata=output;
      velvet.tokens.tokens[velvet.tokenIndex].source[1].data.splice(position, tokenRange);
      velvet.tokens.tokens.splice(velvet.tokenIndex, 1);
      for(var i= velvet.tokenIndex, l = velvet.tokens.tokens.length; i< l; i++){
        velvet.tokens.tokens[i].stop-=tokenRange;
        velvet.tokens.tokens[i].start-=tokenRange;
        velvet.tokens.tokens[i].tokenIndex=i;
        velvet.tokens.tokens[i].line--;
      }
      var i= velvet.tokenIndex;
      for(l = velvet.tokens.tokens.length; !velvet.keyEventListeners.isCRLF(velvet.tokens.tokens[i]) && i< l; i++){
        //console.log(i+" "+velvet.tokens.tokens[i].start+" "+velvet.tokens.tokens[i].stop+" "+JSON.stringify(velvet.tokens.tokens[i].source[1].strdata[position])+" "+velvet.tokens.tokens[i].source[1].data[position]+" removeCurrentCharacter "+velvet.tokens.tokens[i].text);
         velvet.tokens.tokens[i].column=velvet.tokens.tokens[i-1].column+1;
      }
      velvet.tokens.tokens[i].column=velvet.tokens.tokens[i-1].column+1;
      return true;
    }
    else if(velvet.tokens.tokens[velvet.tokenIndex].text.length<=1){
      var tokenRange=velvet.tokens.tokens[velvet.tokenIndex].text.length;
      console.log("remove <1 "+tokenRange);
      var position=velvet.tokens.tokens[velvet.tokenIndex].start;
      var output=velvet.tokens.tokens[velvet.tokenIndex].source[1].strdata.slice(0, position)+velvet.tokens.tokens[velvet.tokenIndex].source[1].strdata.slice(position+tokenRange);
      velvet.tokens.tokens[velvet.tokenIndex].source[1].strdata=output;
      velvet.tokens.tokens[velvet.tokenIndex].source[1].data.splice(position, tokenRange);
      velvet.tokens.tokens.splice(velvet.tokenIndex, 1);
      for(var i= velvet.tokenIndex, l = velvet.tokens.tokens.length; i< l; i++){
        velvet.tokens.tokens[i].stop-=tokenRange;
        velvet.tokens.tokens[i].start-=tokenRange;
        velvet.tokens.tokens[i].tokenIndex=i;
      }
      var i= velvet.tokenIndex;
      for(l = velvet.tokens.tokens.length; !velvet.keyEventListeners.isCRLF(velvet.tokens.tokens[i]) && i< l; i++){
         velvet.tokens.tokens[i].column=velvet.tokens.tokens[i-1].column+1;
      }
      velvet.tokens.tokens[i].column=velvet.tokens.tokens[i-1].column+1;
      return false;
    }
    else{
      var str=velvet.tokens.tokens[velvet.tokenIndex].text;
      //velvet.tokens.tokens[velvet.tokenIndex].text=str.slice(0, velvet.charOffset)+str.slice(velvet.charOffset+1);
      var position=velvet.tokens.tokens[velvet.tokenIndex].start+velvet.charOffset;
      console.log("removeCurrentCharacter "+position);
      var output=velvet.tokens.tokens[velvet.tokenIndex].source[1].strdata.slice(0, position)+velvet.tokens.tokens[velvet.tokenIndex].source[1].strdata.slice(position+1);
      velvet.tokens.tokens[velvet.tokenIndex].source[1].strdata=output;
      velvet.tokens.tokens[velvet.tokenIndex].source[1].data.splice(position, 1);
        velvet.tokens.tokens[velvet.tokenIndex].stop--;
      for(var i= velvet.tokenIndex+1, l = velvet.tokens.tokens.length; i< l; i++){
        velvet.tokens.tokens[i].stop--;
        velvet.tokens.tokens[i].start--;
      }
      //if(velvet.tokens.tokens[velvet.tokenIndex].stop>velvet.tokens.tokens[velvet.tokenIndex].start)velvet.tokens.tokens[velvet.tokenIndex].stop--;
      //velvet.autocomplete.setCandidateValue(velvet.tokens.tokens[velvet.tokenIndex].text, event);
      return false;
    }
  }
  
    press (event){
      if(event.shiftKey && event.ctrlKey && !event.altKey){
      //console.log('Key event is received!! '+event.shiftKey+" "+event.ctrlKey+" "+event.altKey+" "+event.key);
        if(velvet.keyEventListeners.externalkeyListener!=undefined)velvet.keyEventListeners.externalkeyListener(event);
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
          var line=velvet.tokens.getText({start: velvet.tokens.tokens[lineStartIndex].tokenIndex, stop: velvet.tokens.tokens[velvet.tokenIndex].tokenIndex});
        var ctx = velvet.canvas.getContext('2d');
             velvet.cursor.position(ctx.measureText(line.substring(0, line.length-tokenRange+velvet.charOffset)).width, currentLine*velvet.font.getFontSize());
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
      if(event.ctrlKey || event.altKey){
        return;
      }
        var ctx = velvet.canvas.getContext('2d');
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
        velvet.cursor.position(velvet.cursor.currentX+5, velvet.cursor.currentY);
        return;
        }
        break;
    case "ArrowDown":
        // Down pressed
        if( velvet.autocomplete.countListSize()>=1){
          velvet.autocomplete.incrementFocus();
        }
        else{
          velvet.autocomplete.setCandidateValue("", event);
          velvet.cursor.position(velvet.cursor.currentX+5, velvet.cursor.currentY + 36);
        return;
        }
        break;
        case "Enter":
          var tokenFactory=velvet.parser.getTokenFactory();
          /*for (var key of velvet.tokenMap.keys()) {
            if(key==="'\n'" || key==="'\r'" || key==="'\r\n'"){
            console.log("ent:"+velvet.tokenMap.get(key));
            }
          }*/
          console.log("countListSize "+velvet.autocomplete.countListSize());
          if( velvet.autocomplete.countListSize()>=1){
            //velvet.autocomplete.setCandidateValue(velvet.tokens.tokens[velvet.tokenIndex].text, event);
            velvet.tokens.tokens[velvet.tokenIndex].text=velvet.autocomplete.getCompletedValue();
            //velvet.tokens.tokens[velvet.tokenIndex].stop=velvet.tokens.tokens[velvet.tokenIndex].start+velvet.tokens.tokens[velvet.tokenIndex].text.length;
            velvet.tokens.tokens[velvet.tokenIndex].channel=velvet.tokens.tokens[velvet.tokenIndex].DEFAULT_CHANNEL;
            var typeLiteral="'"+velvet.tokens.tokens[velvet.tokenIndex].text+"'";
            if(velvet.tokenMap.has(typeLiteral)){
              velvet.tokens.tokens[velvet.tokenIndex].type = velvet.tokenMap[typeLiteral];
            }
            tokenRange=velvet.tokens.tokens[velvet.tokenIndex].text.length;
            velvet.charOffset=tokenRange;
            console.log("enter ac "+tokenRange+" "+velvet.charOffset);
          }
          else{
            var column = (velvet.keyEventListeners.isCRLF(velvet.tokens.tokens[velvet.tokenIndex])) ? 0 : 1;
            if(!velvet.keyEventListeners.isCRLF(velvet.tokens.tokens[velvet.tokenIndex]))velvet.tokenIndex++;
            var position=velvet.tokens.tokens[velvet.tokenIndex].start;
          //console.log(velvet.tokens.tokens[velvet.tokenIndex].type+" isCRLF "+column+" "+JSON.stringify(velvet.tokens.tokens[velvet.tokenIndex].text)+" "+velvet.tokens.tokens[velvet.tokenIndex].source[1].data[position]);
            var insertable="\n";
            var output=velvet.tokens.tokens[velvet.tokenIndex].source[1].strdata.slice(0, position)+insertable+velvet.tokens.tokens[velvet.tokenIndex].source[1].strdata.slice(position);
            velvet.tokens.tokens[velvet.tokenIndex].source[1].strdata=output;
            velvet.tokens.tokens[velvet.tokenIndex].source[1].data.splice(position, 0, insertable.charCodeAt(0));
            //console.log(velvet.tokens.tokens[velvet.tokenIndex].source);
            velvet.tokens.tokens.splice(velvet.tokenIndex, 0, tokenFactory.create(velvet.tokens.tokens[velvet.tokenIndex].source, 58, null, velvet.tokens.tokens[velvet.tokenIndex].HIDDEN_CHANNEL, velvet.tokens.tokens[velvet.tokenIndex].start, velvet.tokens.tokens[velvet.tokenIndex].start, velvet.tokens.tokens[velvet.tokenIndex].line, column));
            velvet.tokens.tokens[velvet.tokenIndex].tokenIndex=velvet.tokenIndex;
            //velvet.tokenIndex++;
            tokenRange=velvet.tokens.tokens[velvet.tokenIndex].text.length;
            velvet.charOffset=0;
            velvet.tokens.tokens[velvet.tokenIndex].column=0;
            //velvet.tokens.tokens[velvet.tokenIndex].line++;
            velvet.tokens.tokens[velvet.tokenIndex].tokenIndex=velvet.tokenIndex;
            for(var i= velvet.tokenIndex+1, l = velvet.tokens.tokens.length; i<l; i++){
              velvet.tokens.tokens[i].stop++;
              velvet.tokens.tokens[i].start++;
              velvet.tokens.tokens[i].tokenIndex=i;
              velvet.tokens.tokens[i].line++;
              //console.log(velvet.tokens.tokens[i].text);
            }
            velvet.tokenIndex++;
            //console.log(velvet.tokenIndex+" "+tokenRange+" "+velvet.tokens.tokens[velvet.tokenIndex-1].line+" "+ velvet.tokens.tokens[velvet.tokenIndex-1].column+" "+JSON.stringify(velvet.tokens.tokens[velvet.tokenIndex-1].text)+" crlf "+JSON.stringify(velvet.tokens.tokens[velvet.tokenIndex].text)+" "+ velvet.tokens.tokens[velvet.tokenIndex].line+" "+ velvet.tokens.tokens[velvet.tokenIndex].column+" "+position+" "+ velvet.tokens.tokens[velvet.tokenIndex].stop+" cc "+insertable.charCodeAt(0)+" "+velvet.tokens.tokens[velvet.tokenIndex].source[1].data[position]+" "+velvet.tokens.tokens[velvet.tokenIndex+1].source[1].data[position]);
          }
          currentLine++;
          velvet.layoutText();
            velvet.autocomplete.setCandidateValue("", event);
          break;
        case "Backspace":
          console.log("Backspace "+tokenRange+" ");
          if(velvet.charOffset===0){
            velvet.tokenIndex--;
            tokenRange=velvet.tokens.tokens[velvet.tokenIndex].text.length;
            if(tokenRange>0)velvet.charOffset=tokenRange-1; else velvet.charOffset=0;
          }
          else{
            velvet.charOffset--;
          }
          console.log("Backspace 2 "+tokenRange+" ");
          var wascrlf=velvet.keyEventListeners.removeCurrentCharacter(event);
          if(wascrlf)velvet.tokenIndex--;
          tokenRange=velvet.tokens.tokens[velvet.tokenIndex].text.length;
          currentLine=velvet.tokens.tokens[velvet.tokenIndex].line;
          if(wascrlf && tokenRange>0)velvet.charOffset=tokenRange-1;
          if(wascrlf && tokenRange===0)velvet.charOffset=0;
         velvet.layoutText();
          break;
        case "Delete":
          if(velvet.tokens.tokens[velvet.tokenIndex].text.length<=velvet.charOffset){
            velvet.tokenIndex++;
            velvet.charOffset=0;
          }
          var wascrlf=velvet.keyEventListeners.removeCurrentCharacter(event);
          tokenRange=velvet.tokens.tokens[velvet.tokenIndex].text.length;
          currentLine=velvet.tokens.tokens[velvet.tokenIndex].line;
          if(wascrlf)velvet.charOffset=0;
          velvet.layoutText();
          break;
          case "Alt":
          case "Control":
          case "Shift":
            break;
        default:
          if(event.key>=' ' && event.key<='}'){
            //console.log("type="+velvet.tokens.tokens[velvet.tokenIndex].type);
            var stay = (velvet.autocomplete.countListSize()>=1 && velvet.tokens.tokens[velvet.tokenIndex].text===velvet.autocomplete.getCompletedValue());
            if(velvet.tokens.tokens[velvet.tokenIndex].type!=37 || stay){
              var tokenFactory=velvet.parser.getTokenFactory();
              var column = (stay) ? 1 : 0;
              column = (velvet.tokens.tokens[velvet.tokenIndex].type===58) ? velvet.tokens.tokens[velvet.tokenIndex-1].column+1: column;
              console.log(column+" adding token "+velvet.tokens.tokens.length+" "+JSON.stringify(velvet.tokens.tokens[velvet.tokenIndex].text));
              //velvet.tokenIndex++;
              var position=velvet.tokens.tokens[velvet.tokenIndex].start+velvet.charOffset;
              var output=velvet.tokens.tokens[velvet.tokenIndex].source[1].strdata.slice(0, position)+event.key+velvet.tokens.tokens[velvet.tokenIndex].source[1].strdata.slice(position);
              velvet.tokens.tokens[velvet.tokenIndex].source[1].strdata=output;
              velvet.tokens.tokens[velvet.tokenIndex].source[1].data.splice(position, 0, event.key.charCodeAt(0));
              velvet.tokens.tokens.splice(velvet.tokenIndex, 0, tokenFactory.create(velvet.tokens.tokens[velvet.tokenIndex].source, 37, null, velvet.tokens.tokens[velvet.tokenIndex].DEFAULT_CHANNEL, velvet.tokens.tokens[velvet.tokenIndex].start, velvet.tokens.tokens[velvet.tokenIndex].start+1, velvet.tokens.tokens[velvet.tokenIndex].line, column));
              velvet.charOffset=1;
              velvet.tokens.tokens[velvet.tokenIndex].tokenIndex=velvet.tokenIndex;
              //velvet.tokens.tokens[velvet.tokenIndex].column= (velvet.keyEventListeners.isCRLF(velvet.tokens.tokens[velvet.tokenIndex-1])) ? 0 : 1;
              console.log(" added token "+velvet.tokens.tokens.length+" "+JSON.stringify(velvet.tokens.tokens[velvet.tokenIndex].text));
              for(var i= velvet.tokenIndex+1, l = velvet.tokens.tokens.length; i< l; i++){
                velvet.tokens.tokens[i].stop++;
                velvet.tokens.tokens[i].start++;
                velvet.tokens.tokens[i].tokenIndex=i;
              }
            }
            else {
              var position=velvet.tokens.tokens[velvet.tokenIndex].start+velvet.charOffset;
              //velvet.tokens.tokens[velvet.tokenIndex].text+=event.key;
              velvet.charOffset++;
              var output=velvet.tokens.tokens[velvet.tokenIndex].source[1].strdata.slice(0, position)+event.key+velvet.tokens.tokens[velvet.tokenIndex].source[1].strdata.slice(position);
              velvet.tokens.tokens[velvet.tokenIndex].source[1].strdata=output;
              velvet.tokens.tokens[velvet.tokenIndex].source[1].data.splice(position, 0, event.key.charCodeAt(0));
              velvet.tokens.tokens[velvet.tokenIndex].stop++;
              for(var i= velvet.tokenIndex+1, l = velvet.tokens.tokens.length; i< l; i++){
                velvet.tokens.tokens[i].start++;
                velvet.tokens.tokens[i].stop++;
                velvet.tokens.tokens[i].tokenIndex=i;
              }
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
    while(lineStartIndex>0 && velvet.tokens.tokens[lineStartIndex-1].line===currentLine){
      lineStartIndex--;
    }
    //console.log('place '+velvet.charOffset+" "+tokenRange+" start "+lineStartIndex+" "+velvet.tokenIndex+" "+currentLine+" "+velvet.tokens.tokens[velvet.tokenIndex].text+" "+velvet.tokens.tokens[velvet.tokenIndex].column+" "+velvet.tokens.tokens[velvet.tokenIndex].type);
        var line=velvet.tokens.getText({start: velvet.tokens.tokens[lineStartIndex].tokenIndex, stop: velvet.tokens.tokens[velvet.tokenIndex].tokenIndex});
        velvet.cursor.overlay(ctx.measureText(line.substring(0, line.length-tokenRange+velvet.charOffset)).width, currentLine*velvet.font.getFontSize());
        event.preventDefault();
    }
    
}
