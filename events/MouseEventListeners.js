/* global pmc */
pmc.MouseEventListeners = class MouseEventListeners{
    constructor(velvet){
      this.velvet = velvet;
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
        velvet.cursor.position(currentLine*18, ctx.measureText(line.substring(0, line.length-tokenRange+velvet.charOffset)).width);
        //displayRule(velvet.tokenIndex);
      event.preventDefault();
    }
}