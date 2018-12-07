/* global pmc */
pmc.Cursor = class Cursor{
    
    constructor(velvet){
        this.velvet = velvet;
        this.selected = false;
        this.selectedTokens = [];
        this.currentX=0;
        this.currentY=0;
        var cursorSelection = document.createElement('div');
        cursorSelection.id = "cursor";
        cursorSelection.setAttribute("position", "relative");
        //cursorSelection.style.position = 'relative';
        cursorSelection.style.width = '1px';
        cursorSelection.style.height =  velvet.font.getFontSize()+'px';
        //cursorSelection.style.backgroundColor = '#000';
        //cursorSelection.style.color = '#000';
        //cursorSelection.style.zIndex = '2';
        //cursorSelection.style.animation = 'blinker 1s linear infinite';
        cursorSelection.style.left = '10px';
        cursorSelection.style.top = '0px';
        var rect = velvet.canvas.getBoundingClientRect();
        cursorSelection.style.marginTop = (-(velvet.rows*velvet.font.getFontSize() - 2*rect.top-20))+'px';
        velvet.canvas.parentElement.appendChild(cursorSelection);
    }
    
    position(x, y){
        var ctx = velvet.canvas.getContext('2d');
        var lineStartIndex=0;
        while(lineStartIndex<velvet.tokens.tokens.length-1 && (velvet.tokens.tokens[lineStartIndex].line*velvet.font.getFontSize()+10+velvet.font.getFontSize()<y)){
          lineStartIndex++;
        }
        velvet.tokenIndex=lineStartIndex;
        velvet.cursor.currentLine=velvet.tokens.tokens[velvet.tokenIndex].line;
        //var interval = new antlr4.Interval(velvet.tokens.tokens[lineStartIndex], velvet.tokens.tokens[velvet.tokenIndex]);
        var interval = {start: velvet.tokens.tokens[lineStartIndex].tokenIndex, stop: velvet.tokens.tokens[velvet.tokenIndex].tokenIndex};
        var line=velvet.tokens.getText(interval);
        var  tokenRange=velvet.tokens.tokens[velvet.tokenIndex].text.length;
        velvet.charOffset=0;
        while(velvet.tokenIndex<velvet.tokens.tokens.length-1 && velvet.tokens.tokens[velvet.tokenIndex+1].line===velvet.cursor.currentLine && (10+ctx.measureText(line.substring(0, line.length-tokenRange+velvet.charOffset)).width)<=x){
          if(velvet.charOffset<tokenRange)velvet.charOffset++;
          else {
            velvet.tokenIndex++;
            line=velvet.tokens.getText({start: velvet.tokens.tokens[lineStartIndex].tokenIndex, stop: velvet.tokens.tokens[velvet.tokenIndex].tokenIndex});
            tokenRange=velvet.tokens.tokens[velvet.tokenIndex].text.length;
            velvet.charOffset=0;
          }
        }
        y=velvet.cursor.currentLine*velvet.font.getFontSize();
        x=ctx.measureText(line.substring(0, line.length-tokenRange+velvet.charOffset)).width;
        velvet.cursor.overlay(x, y);
    }
    
    overlay(x, y){
        document.getElementById('cursor').style.top = (y-10)+"px";
        document.getElementById('cursor').style.left = (10+x)+"px";
        document.getElementById('cursor').nextSibling.style.top = (y+8+velvet.font.getFontSize())+"px";
        document.getElementById('cursor').nextSibling.style.left = (10+x)+"px";
        velvet.cursor.currentX = x;
        velvet.cursor.currentY = y;
        
    }
}