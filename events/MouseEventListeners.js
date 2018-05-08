/* global pmc */
pmc.MouseEventListeners = class MouseEventListeners{
    constructor(velvet){
      this.velvet = velvet;
    }

    clicked (event){
        var ctx = velvet.canvas.getContext('2d');
        var x = event.clientX - ctx.canvas.offsetLeft + window.pageXOffset;
        var y = event.clientY - ctx.canvas.offsetTop + window.pageYOffset;
        var lineStartIndex=0;
        while(lineStartIndex<velvet.tokens.tokens.length-1 && (velvet.tokens.tokens[lineStartIndex].line*18+10+18<y)){
          lineStartIndex++;
        }
        velvet.tokenIndex=lineStartIndex;
        var currentLine=velvet.tokens.tokens[velvet.tokenIndex].line;
        var line=velvet.tokens.getText({start: velvet.tokens.tokens[lineStartIndex], stop: velvet.tokens.tokens[velvet.tokenIndex]});
        var tokenRange=velvet.tokens.tokens[velvet.tokenIndex].stop-velvet.tokens.tokens[velvet.tokenIndex].start+1;
        velvet.charOffset=0;
        console.log(line+" "+velvet.tokens.tokens[velvet.tokenIndex+1].line+" =  "+currentLine+" "+velvet.tokens.tokens[velvet.tokenIndex+1].text);
        while(velvet.tokenIndex<velvet.tokens.tokens.length-1 && velvet.tokens.tokens[velvet.tokenIndex+1].line===currentLine && (10+ctx.measureText(line.substring(0, line.length-tokenRange+velvet.charOffset)).width)<x){
          if(velvet.charOffset<tokenRange)velvet.charOffset++;
          else {
            velvet.tokenIndex++;
            line=velvet.tokens.getText({start: velvet.tokens.tokens[lineStartIndex], stop: velvet.tokens.tokens[velvet.tokenIndex]});
            tokenRange=velvet.tokens.tokens[velvet.tokenIndex].stop-velvet.tokens.tokens[velvet.tokenIndex].start+1;
            velvet.charOffset=0;
          }
        }
        velvet.cursor.position(currentLine*18, ctx.measureText(line.substring(0, line.length-tokenRange+velvet.charOffset)).width);
        //displayRule(velvet.tokenIndex);
      event.preventDefault();
    }
}