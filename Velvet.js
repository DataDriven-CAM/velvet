/*global pmc*/
var pmc = pmc || {};
pmc.Velvet = class Velvet{
    constructor(canvas, tokens, lexer, parser, tree){
        this.canvas = canvas;
        this.tokens = tokens;
        this.lexer = lexer;
        this.parser = parser;
        this.tree = tree;
        
        this.tokenIndex=0;
        this.charOffset=0;
        this.autoList=[];
        for(var entry in this.lexer.literalNames){
          if(this.lexer.literalNames[entry]!=null){
            this.autoList.push(this.lexer.literalNames[entry].substr(1, this.lexer.literalNames[entry].length-2));
          }
        }
        this.layoutText();
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
        cursorSelection.style.marginTop = (-(10+this.rows*18))+'px';
        
        document.getElementById('plate').appendChild(cursorSelection);
        var status = document.createElement('div');
        status.id = "status";
        status.style.textAlign='right';
        status.textContent = "0:0";
        document.getElementById('foot').appendChild(status);

        this.keyEventListeners = new pmc.KeyEventListeners(this);
        this.canvas.addEventListener('keypress', this.keyEventListeners.keyPressed, {capture:true});
        this.canvas.addEventListener('keydown', this.keyEventListeners.keyDowned, {capture:true});
        this.canvas.addEventListener('click', this.keyEventListeners.clicked, {capture:true});
    }
    
    layoutText(){
        var ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.font = '14px serif';
        var lineOffset=0;
        var previousLine=1;
        var rows=0;
        //console.log('first token = ' + this.tokens.tokens[0].type+" "+this.lexer.ruleNames[this.tokens.tokens[0].type-1]);
        for (var i in this.tokens.tokens) {
          //console.log(i + ' = ' + this.lexer.ruleNames[this.tokens.tokens[i].type - 1]);
        }
        for (var i in this.tokens) {
          //console.log(i + ' = ' + this.tokens[i]);
        }
        this.tokens.tokens.forEach(function(token){
    /*Object.getOwnPropertyNames(token).forEach(
      function (val, idx, array) {
        console.log(val + ' -> ' + token[val]);
      }
    );*/
          if(token.column==0)lineOffset=0;
          //var tokenStr=token.source[1].strdata.substring(token.start, token.stop+1);
          var tokenStr=token.text;
          ctx.fillText(tokenStr, 10+lineOffset, 20+token.line*18);
          lineOffset+=ctx.measureText(token.text).width;
          rows=token.line;
        });
        this.rows = rows;
    }
    
  populateAvailableTokens(availableTokens){
    var tokenLines=availableTokens.split("\n");
  var element =  document.getElementById('select');
  if (typeof(element) != 'undefined' && element != null)
  {
    element.parentNode.removeChild(element);
  } 
  this.tokenMap = new Map();
  var _this = this;
    var tokenCombo = document.createElement('select');
    tokenLines.forEach(function(line, index){
      var type = document.createElement('option');
      var att = document.createAttribute("value");
      var pair = line.split("=");
      _this.tokenMap.set(pair[0], pair[1]);
      att.value = pair[1];
      type.textContent = pair[0];
      type.setAttributeNode(att);
      tokenCombo.appendChild(type);
    });
    document.getElementById('info').appendChild(tokenCombo);
    
  }
  
   removeCurrentToken(){
    this.tokens.tokens.splice(this.tokenIndex, 1);
    console.log("deletng a crlf");
    this.tokens.tokens[this.tokenIndex].column=this.tokens.tokens[this.tokenIndex-1].column+1;
    for(var i= this.tokenIndex, l = this.tokens.tokens.length; i< l; i++){
      //G4Editor.tokens.tokens[i].stop-=tokenRange;
      //G4Editor.tokens.tokens[i].start-=tokenRange;
      this.tokens.tokens[i].line--;
    }
    
  }
  
  displayRule(tokenIndex){
    var hit=false;
    for (var i in this.tree.children) {
        for (var j in this.tree.children[i].children) {
          if(this.tree.children[i].children[j].start != undefined && tokenIndex >= this.tree.children[i].children[j].start.tokenIndex && tokenIndex <= this.tree.children[i].children[j].stop.tokenIndex){
          console.log("\t"+j+" = "+this.tree.children[i].children[j]);
          console.log("\t\t"+this.tree.children[i].children[j].invokingState+"  "+this.parser.ruleNames[this.tree.children[i].children[j].ruleIndex]);
          //console.log(this.tree.children[i].children[j].toString());
          for (var k in this.tree.children[i]) {
            //console.log("\t\t"+k+" = "+this.tree.children[i][k]);
          }
          hit=true;
          //break;
          }
        }
      if(hit)break;
    }
    
  }
  
}

