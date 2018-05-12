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
        //displayRule(velvet.tokenIndex);
      event.preventDefault();
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