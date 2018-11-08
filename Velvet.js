/*global pmc*/
var pmc = pmc || {};
pmc.Velvet = class Velvet{
    constructor(canvas, font, tokens, lexer, parser, tree){
        this.canvas = canvas;
        this.font = font;
        this.tokens = tokens;
        this.lexer = lexer;
        this.parser = parser;
        this.tree = tree;
    /*Object.getOwnPropertyNames(this.lexer._interp.atn).forEach(
      function (val, idx, array) {
        console.log(val + ' -> ' + lexer._interp.atn[val]);
      }
    );*/
        
        this.tokenIndex=0;
        this.charOffset=0;
        this.autoList=[];
        this.tokenMap = new Map();
        this.tokenParserMap = new Map();
        var _this = this;
        for(var entry in this.lexer.literalNames){
          if(this.lexer.literalNames[entry]!=null){
            this.autoList.push(this.lexer.literalNames[entry].substr(1, this.lexer.literalNames[entry].length-2));
            _this.tokenMap.set(this.lexer.literalNames[entry].substr(1, this.lexer.literalNames[entry].length-2), entry);
          }
        }
        for(var entry in this.parser.literalNames){
          if(this.parser.literalNames[entry]!=null){
            _this.tokenParserMap.set(this.parser.literalNames[entry].substr(1, this.parser.literalNames[entry].length-2), entry);
          }
        }
        this.layoutText();
        this.cursor = new pmc.Cursor(this);
        this.autocomplete = new pmc.Autocomplete(this, this.autoList);
        this.status = new pmc.Status(this);

        this.keyEventListeners = new pmc.KeyEventListeners(this);
        this.canvas.addEventListener('keypress', this.keyEventListeners.press, {capture:true});
        this.canvas.addEventListener('keydown', this.keyEventListeners.down, {capture:true});
        this.mouseEventListeners = new pmc.MouseEventListeners(this);
        this.canvas.addEventListener('click', this.mouseEventListeners.click, {capture:true});
        this.canvas.addEventListener('dblclick', this.mouseEventListeners.doubleclick, {capture:true});
        this.canvas.addEventListener('mousedown', this.mouseEventListeners.down, {capture:true});
        this.canvas.addEventListener('mousemove', this.mouseEventListeners.move, {capture:true});
        this.canvas.addEventListener('mouseup', this.mouseEventListeners.up, {capture:true});
        this.dragAndDropListeners = new pmc.DragAndDropListeners(this);
        this.canvas.addEventListener('dragenter', this.dragAndDropListeners.dragenter, {capture:true});
        this.canvas.addEventListener('dragover', this.dragAndDropListeners.dragover, {capture:true});
        this.canvas.addEventListener('drop', this.dragAndDropListeners.drop, {capture:true});
    }
    
    layoutText(){
        var ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.font = this.font.getFont();
        var lineOffset=0;
        var previousLine=1;
        var rows=0;
        //console.log('first token = ' + this.tokens.tokens[0].type+" "+this.lexer.ruleNames[this.tokens.tokens[0].type-1]);
        //for (var i in this.tokens.tokens) {
          //console.log(i + ' = ' + this.lexer.ruleNames[this.tokens.tokens[i].type - 1]);
        //}
        //for (var i in this.tokens) {
          //console.log(i + ' = ' + this.tokens[i]);
        //}
        var _this=this;
        this.tokens.tokens.forEach(function(token){
    /*Object.getOwnPropertyNames(token).forEach(
      function (val, idx, array) {
        console.log(val + ' -> ' + token[val]);
      }
    );*/
          if(token.column===0)lineOffset=0;
          //var tokenStr=token.source[1].strdata.substring(token.start, token.stop+1);
          var tokenStr=token.text;
          if(_this.autoList.includes(tokenStr)){
            ctx.fillStyle = "blue";
          }
          else{
            ctx.fillStyle = "black";
          }
          var copySHadowCOlor = ctx.shadowColor;
          if(_this.cursor != undefined && _this.cursor.selected){
            if(token.tokenIndex>=_this.cursor.startTokenIndex && token.tokenIndex<=_this.cursor.stopTokenIndex){
            ctx.shadowColor = "darkgreen"; // string
                //Color of the shadow;  RGB, RGBA, HSL, HEX, and other inputs are valid.
            ctx.shadowOffsetX = 3; // integer
                //Horizontal distance of the shadow, in relation to the text.
            ctx.shadowOffsetY = 3; // integer
                //Vertical distance of the shadow, in relation to the text.
            ctx.shadowBlur = 10; // integer
            }
          }
          ctx.fillText(tokenStr, 10+lineOffset, 8+token.line*_this.font.getFontSize());
          ctx.shadowColor = ctx.shadowColor;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.shadowBlur = 0;
          
          lineOffset+=ctx.measureText(tokenStr).width;
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
    //document.getElementById('info').appendChild(tokenCombo);
    
  }
  
//  get text(){
//    return this.tokens.getText();
//  }
  
  displayRule(tokenIndex){
    var hit=false;
    for (var i in this.tree.children) {
        for (var j in this.tree.children[i].children) {
          if(this.tree.children[i].children[j].start != undefined && tokenIndex >= this.tree.children[i].children[j].start.tokenIndex && tokenIndex <= this.tree.children[i].children[j].stop.tokenIndex){
          console.log("\t"+j+" = "+this.tree.children[i].children[j]);
          console.log("\t\t"+this.tree.children[i].children[j].invokingState+"  "+this.parser.ruleNames[this.tree.children[i].children[j].ruleIndex]);
          //console.log(this.tree.children[i].children[j].toString());
          for (var k in this.tree.children[i]) {
            console.log("\t\t"+k+" = "+this.tree.children[i][k]);
          }
          hit=true;
          //break;
          }
        }
      if(hit)break;
    }
    
  }
  
  addKeyListener(keyListener){
    this.keyEventListeners.externalkeyListener = keyListener;
  }
  
  addATNListener(atnListener){
    this.atnListener = atnListener;
  }
  
}

