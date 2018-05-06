pmc.KeyEventListeners = class KeyEventListeners{
    constructor(velvet){
      this.velvet = velvet;
    }
    
    keyPressed (event){
      console.log('Key event is received!!');
      if(event.shiftKey && event.ctrlKey && !event.altKey){
      console.log(event.key);
        return;
      }
        
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
           for (var i in tokenFactory) {
             //console.log("Ent: "+tokenFactory[i]);
           }
          for (var key of velvet.tokenMap.keys()) {
            if(key==="'\n'" || key==="'\r'" || key==="'\r\n'"){
            console.log("ent:"+velvet.tokenMap.get(key));
            }
          }
          console.log("enter hit");
          velvet.tokens.tokens.splice(velvet.tokenIndex, 0, tokenFactory.create(velvet.tokens.tokens[velvet.tokenIndex].source, 59, "\r\n", 1, velvet.tokens.tokens[velvet.tokenIndex].stop+1, velvet.tokens.tokens[velvet.tokenIndex].stop+2, velvet.tokens.tokens[velvet.tokenIndex].line+1, 0));
          velvet.tokenIndex++;
          for(var i= velvet.tokenIndex, l = velvet.tokens.tokens.length; i< l; i++){
            //velvet.tokens.tokens[i].stop-=tokenRange;
            //velvet.tokens.tokens[i].start-=tokenRange;
            velvet.tokens.tokens[i].line++;
          }
          velvet.layoutText();
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
              if(velvet.autoList.includes(velvet.tokens.tokens[velvet.tokenIndex].text)){
                console.log("lit: "+velvet.tokens.tokens[velvet.tokenIndex].text);
              }
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
          if(event.key>='0' && event.key<='z'){
            console.log("type="+velvet.tokens.tokens[velvet.tokenIndex].type);
            if(velvet.tokens.tokens[velvet.tokenIndex].type!=37){
              var tokenFactory=velvet.parser.getTokenFactory();
              velvet.tokens.tokens.splice(velvet.tokenIndex, 0, tokenFactory.create(velvet.tokens.tokens[velvet.tokenIndex].source, 37, event.key, 1, velvet.tokens.tokens[velvet.tokenIndex].stop, velvet.tokens.tokens[velvet.tokenIndex].stop+1, velvet.tokens.tokens[velvet.tokenIndex].line, 0));
              //velvet.tokenIndex++;
              velvet.charOffset=1;
              velvet.layoutText();
            }
            else {
              velvet.tokens.tokens[velvet.tokenIndex].text+=event.key;
              velvet.tokens.tokens[velvet.tokenIndex].stop++;
              velvet.charOffset++;
              if(velvet.autoList.includes(velvet.tokens.tokens[velvet.tokenIndex].text)){
                console.log("lit: "+velvet.tokens.tokens[velvet.tokenIndex].text);
              }
              velvet.layoutText();
            }
          }
          else console.log("default: "+event.key);
          break;
    }
    var lineStartIndex=velvet.tokenIndex;
    while(lineStartIndex>0 && velvet.tokens.tokens[lineStartIndex].line===currentLine){
      lineStartIndex--;
    }
    //console.log('place '+velvet.charOffset+" "+tokenRange+" start "+lineStartIndex+" "+velvet.tokenIndex+" "+currentLine+" "+velvet.tokens.tokens[velvet.tokenIndex].text);
        var line=velvet.tokens.getText({start: velvet.tokens.tokens[lineStartIndex], stop: velvet.tokens.tokens[velvet.tokenIndex]});
        var ctx = velvet.canvas.getContext('2d');
        document.getElementById('cursor').style.top = (currentLine*18-10)+"px";
        document.getElementById('cursor').style.left = (10+ctx.measureText(line.substring(0, line.length-tokenRange+velvet.charOffset)).width)+"px";
        event.preventDefault();
    }
    
    clicked (event){
        var ctx = velvet.canvas.getContext('2d');
    var x = event.clientX - ctx.canvas.offsetLeft + window.pageXOffset;
    var y = event.clientY - ctx.canvas.offsetTop + window.pageYOffset;
        var endIndex=0;
        while(endIndex<velvet.tokens.tokens.length-1 && velvet.tokens.tokens[endIndex+1].line*18-10+36<y){
          endIndex++;
        }
    var currentLine=velvet.tokens.tokens[endIndex].line;
    var lineStartIndex=endIndex;
    while(lineStartIndex>0 && velvet.tokens.tokens[lineStartIndex+1].line===currentLine){
      lineStartIndex--;
    }
        var line=velvet.tokens.getText({start: velvet.tokens.tokens[lineStartIndex], stop: velvet.tokens.tokens[endIndex]});
        var tokenRange=velvet.tokens.tokens[endIndex].stop-velvet.tokens.tokens[endIndex].start+1;
        velvet.charOffset=0;
        //var lineStartIndex=endIndex;
        while(endIndex<velvet.tokens.tokens.length-1 /*&& velvet.tokens.tokens[velvet.tokenIndex].channel!=0*/ && (10+ctx.measureText(line.substring(0, line.length-tokenRange+velvet.charOffset)).width)<x){
          if(velvet.charOffset<tokenRange)velvet.charOffset++;
          else {
            endIndex++;
            line=velvet.tokens.getText({start: velvet.tokens.tokens[lineStartIndex], stop: velvet.tokens.tokens[endIndex]});
            tokenRange=velvet.tokens.tokens[endIndex].stop-velvet.tokens.tokens[endIndex].start+1;
            velvet.charOffset=0;
          }
        }
        velvet.tokenIndex=(endIndex<velvet.tokens.tokens.length-1) ? endIndex : velvet.tokens.tokens.length-1;
          currentLine=velvet.tokens.tokens[velvet.tokenIndex].line;
          tokenRange=velvet.tokens.tokens[velvet.tokenIndex].stop-velvet.tokens.tokens[velvet.tokenIndex].start+1;
          if(velvet.charOffset>tokenRange)velvet.charOffset=tokenRange;
    //console.log('place '+lineStartIndex+" "+velvet.tokenIndex+" "+currentLine+" "+velvet.tokens.tokens[velvet.tokenIndex].channel);
        var line=velvet.tokens.getText({start: velvet.tokens.tokens[lineStartIndex], stop: velvet.tokens.tokens[velvet.tokenIndex]});
        document.getElementById('cursor').style.top = (currentLine*18-10)+"px";
        document.getElementById('cursor').style.left = (10+ctx.measureText(line.substring(0, line.length-tokenRange+velvet.charOffset)).width)+"px";
        //displayRule(velvet.tokenIndex);
      event.preventDefault();
    }
    
}
