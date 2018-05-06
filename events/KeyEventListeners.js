/* global pmc */
pmc.KeyEventListeners = class KeyEventListeners{
    constructor(velvet){
      this.velvet = velvet;
    }
    
    keyPressed (event){
      console.log('Key event is received!!');
      if(event.shiftKey && event.ctrlKey && !event.altKey){
        if(this.externalkeyListener!=undefined)this.externalkeyListener(event);
      }
      event.preventDefault();
    }
    
    keyDowned(event) {
      if(event.shiftKey && event.ctrlKey && !event.altKey){
      console.log(event.key);
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
          velvet.tokenIndex--
          var hit=false;
        var tokenText=velvet.tokens.tokens[velvet.tokenIndex].text;
        console.log("tokenText: "+tokenText);
        if(velvet.tokenIndex>0 && (tokenText[velvet.charOffset]==='\r' || tokenText[velvet.charOffset]==='\n')){
          velvet.tokenIndex--;
          tokenText=velvet.tokens.tokens[velvet.tokenIndex].text;
          velvet.charOffset=0;
          hit=true;
        }
        //if(!hit)velvet.tokenIndex--;
          currentLine=velvet.tokens.tokens[velvet.tokenIndex].line;
          tokenRange=velvet.tokens.tokens[velvet.tokenIndex].text.length;
          velvet.charOffset=tokenRange;
        }
        console.log("LA "+velvet.charOffset+" "+tokenRange+" "+velvet.tokenIndex);
        break;
    case "ArrowRight":
        // Right pressed
        velvet.autocomplete.setCandidateValue("", event);
        if(velvet.charOffset<tokenRange-1)velvet.charOffset++;
        else if(velvet.tokenIndex<velvet.tokens.tokens.length-1){
          var hit=false;
        var tokenText=velvet.tokens.tokens[velvet.tokenIndex].text;
        console.log("tokenText: "+tokenText);
        if(velvet.tokenIndex<velvet.tokens.tokens.length-1 && (tokenText[velvet.charOffset]==='\r' || tokenText[velvet.charOffset]==='\n')){
          velvet.tokenIndex++;
          tokenText=velvet.tokens.tokens[velvet.tokenIndex].text;
          velvet.charOffset=0;
          hit=true;
        }
        if(!hit) velvet.tokenIndex++;
          currentLine=velvet.tokens.tokens[velvet.tokenIndex].line;
          tokenRange=velvet.tokens.tokens[velvet.tokenIndex].stop-velvet.tokens.tokens[velvet.tokenIndex].start+1;
          velvet.charOffset=0;
        }
        break;
    case "ArrowUp":
        // Up pressed
        velvet.autocomplete.setCandidateValue("", event);
        var startIndex=velvet.tokenIndex;
        while(startIndex>0 && velvet.tokens.tokens[startIndex].line===currentLine){
          startIndex--;
        }
        velvet.tokenIndex=(startIndex>0) ? startIndex-1 : 0;
          currentLine=velvet.tokens.tokens[velvet.tokenIndex].line;
          tokenRange=velvet.tokens.tokens[velvet.tokenIndex].stop-velvet.tokens.tokens[velvet.tokenIndex].start+1;
          if(velvet.charOffset>tokenRange)velvet.charOffset=tokenRange;
        break;
    case "ArrowDown":
        // Down pressed
        velvet.autocomplete.setCandidateValue("", event);
        var endIndex=velvet.tokenIndex;
        while(endIndex<velvet.tokens.tokens.length-1 && velvet.tokens.tokens[endIndex].line===currentLine){
          endIndex++;
        }
        velvet.tokenIndex=(endIndex<velvet.tokens.tokens.length-1) ? endIndex+1 : velvet.tokens.tokens.length-1;
          currentLine=velvet.tokens.tokens[velvet.tokenIndex].line;
          tokenRange=velvet.tokens.tokens[velvet.tokenIndex].stop-velvet.tokens.tokens[velvet.tokenIndex].start+1;
          if(velvet.charOffset>tokenRange)velvet.charOffset=tokenRange;
        break;
        case "Enter":
          var tokenFactory=velvet.parser.getTokenFactory();
          /*for (var key of velvet.tokenMap.keys()) {
            if(key==="'\n'" || key==="'\r'" || key==="'\r\n'"){
            console.log("ent:"+velvet.tokenMap.get(key));
            }
          }*/
          if( velvet.autocomplete.countListSize()==1){
            velvet.autocomplete.setCandidateValue(velvet.tokens.tokens[velvet.tokenIndex].text, event);
            velvet.tokens.tokens[velvet.tokenIndex].text=velvet.autocomplete.getCompletedValue();
            var typeLiteral="'"+velvet.tokens.tokens[velvet.tokenIndex].text+"'";
            if(velvet.tokenMap.has(typeLiteral)){
              velvet.tokens.tokens[velvet.tokenIndex].type = velvet.tokenMap[typeLiteral];
            }
          }
          else{
            velvet.tokens.tokens.splice(velvet.tokenIndex, 0, tokenFactory.create(velvet.tokens.tokens[velvet.tokenIndex].source, 59, "\r\n", 1, velvet.tokens.tokens[velvet.tokenIndex].stop+1, velvet.tokens.tokens[velvet.tokenIndex].stop+2, velvet.tokens.tokens[velvet.tokenIndex].line+1, 0));
            velvet.tokenIndex++;
            for(var i= velvet.tokenIndex, l = velvet.tokens.tokens.length; i< l; i++){
              //velvet.tokens.tokens[i].stop-=tokenRange;
              //velvet.tokens.tokens[i].start-=tokenRange;
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
          var crlf=(velvet.tokens.tokens[velvet.tokenIndex].text ==="\r\n" || velvet.tokens.tokens[velvet.tokenIndex].text ==="\r" || velvet.tokens.tokens[velvet.tokenIndex].text ==="\n");
          if(crlf){
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
          if(!event.ctrlKey && !event.altKey && event.key>='!' && event.key<='z'){
            //console.log("type="+velvet.tokens.tokens[velvet.tokenIndex].type);
            var stay = (velvet.autocomplete.countListSize()==1 && velvet.tokens.tokens[velvet.tokenIndex].text===velvet.autocomplete.getCompletedValue());
            if(velvet.tokens.tokens[velvet.tokenIndex].type!=37 || stay){
              var tokenFactory=velvet.parser.getTokenFactory();
              var column = (stay) ? 1 : 0;
              velvet.tokens.tokens.splice(velvet.tokenIndex, 0, tokenFactory.create(velvet.tokens.tokens[velvet.tokenIndex].source, 37, event.key, 1, velvet.tokens.tokens[velvet.tokenIndex].stop, velvet.tokens.tokens[velvet.tokenIndex].stop+1, velvet.tokens.tokens[velvet.tokenIndex].line, column));
              //velvet.tokenIndex++;
              velvet.charOffset=1;
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
    //console.log('place '+velvet.charOffset+" "+tokenRange+" start "+lineStartIndex+" "+velvet.tokenIndex+" "+currentLine+" "+velvet.tokens.tokens[velvet.tokenIndex].text);
        var line=velvet.tokens.getText({start: velvet.tokens.tokens[lineStartIndex], stop: velvet.tokens.tokens[velvet.tokenIndex]});
        var ctx = velvet.canvas.getContext('2d');
        velvet.cursor.position(currentLine*18, ctx.measureText(line.substring(0, line.length-tokenRange+velvet.charOffset)).width);
        event.preventDefault();
    }
    
}
