/* global pmc */
pmc.Cursor = class Cursor{
    
    constructor(velvet){
        this.velvet = velvet;
        var cursorSelection = document.createElement('div');
        cursorSelection.id = "cursor";
        //cursorSelection.style.position = 'relative';
        cursorSelection.style.width = '1px';
        cursorSelection.style.height =  '16px';
        //cursorSelection.style.backgroundColor = '#000';
        //cursorSelection.style.color = '#000';
        //cursorSelection.style.zIndex = '2';
        //cursorSelection.style.animation = 'blinker 1s linear infinite';
        cursorSelection.style.left = '10px';
        cursorSelection.style.top = '8px';
        cursorSelection.style.marginTop = (-(10+velvet.rows*18))+'px';
        velvet.canvas.parentElement.appendChild(cursorSelection);
    }
    
    position(x, y){
        document.getElementById('cursor').style.top = (x-10)+"px";
        document.getElementById('cursor').style.left = (10+y)+"px";
        document.getElementById('cursor').nextSibling.style.top = (x+8+18)+"px";
        document.getElementById('cursor').nextSibling.style.left = (10+y)+"px";
        
    }
}