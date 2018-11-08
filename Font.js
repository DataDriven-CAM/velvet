var pmc = pmc || {};
pmc.Font = class Font{
    constructor(font){
        this.font = font;
        if(font===undefined)this.font = '24px serif';
        this.size = this.extractFontSize(this.font);
    }
    
    getFont(){
        return this.font;
    }
    
    getFontSize(){
        return this.size+4;
    }
    
    extractFontSize(font){
        if(font===undefined)return this.extractFontSize(this.font);
        var res = font.split(" ");
        var size = 18;
        res.forEach((ele) => {
            if(ele.endsWith("px")){
                size = Number(ele.substr(0, ele.length-2));
            }
        });
        return size;
    }
    
    
}