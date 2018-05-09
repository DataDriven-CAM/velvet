/*global pmc*/
pmc.Autocomplete = class Autocomplete{
    constructor(velvet, literals){
        this.velvet = velvet;
        this.literals = literals;
        this.temporaryValue = "";
        this.currentFocus = -1;
        this.autocomplete = document.createElement('div');
      this.autocomplete.setAttribute("id", document.getElementById('cursor').parentNode.id + "autocomplete-list");
      this.autocomplete.setAttribute("class", "autocomplete-items");
      this.autocomplete.style.width = '200px';
      this.autocomplete.position = 'relative';
      this.autocomplete.style.left = '10px';
      this.autocomplete.style.top = '8px';
      this.autocomplete.style.marginTop = '130px';//(-(10+velvet.rows*18))+'px';
      document.getElementById('cursor').parentNode.appendChild(this.autocomplete);
    }
    
    setCandidateValue(candidateValue, event){
        this.temporaryValue = candidateValue;
        this.closeAllLists();
        if(this.temporaryValue.length===0) return;
      for (var i = 0; i < this.literals.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (this.literals[i]!=null && this.literals[i].substr(0, this.temporaryValue.length).toUpperCase() == this.temporaryValue.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          var b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + this.literals[i].substr(0, this.temporaryValue.length) + "</strong>";
          b.innerHTML += this.literals[i].substr(this.temporaryValue.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + this.literals[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          var _this=this;
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              _this.temporaryValue = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              _this.closeAllLists();
          });
          this.autocomplete.appendChild(b);
        }
      }
      var x = document.getElementById(document.getElementById('cursor').parentNode.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (event.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        this.currentFocus++;
        /*and and make the current item more visible:*/
        this.addActive(x);
      } else if (event.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        this.currentFocus--;
        /*and and make the current item more visible:*/
        this.addActive(x);
      } else if (event.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        event.preventDefault();
        if (this.currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[this.currentFocus].click();
        }
      }
    }
    
    decrementFocus(){
      var x = document.getElementById(document.getElementById('cursor').parentNode.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
        this.currentFocus--;
        /*and and make the current item more visible:*/
        this.addActive(x);
    }
    
    incrementFocus(){
      var x = document.getElementById(document.getElementById('cursor').parentNode.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
        this.currentFocus++;
        /*and and make the current item more visible:*/
        this.addActive(x);
    }
    
    getCompletedValue(){
      if(this.currentFocus > -1){
        this.currentFocus = -1;
        return this.temporaryValue;
      }
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
           return x[i].firstChild.lastChild.value;
        }
        return this.value;
    }
    
  addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    this.removeActive(x);
    if (this.currentFocus >= x.length) this.currentFocus = 0;
    if (this.currentFocus < 0) this.currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[this.currentFocus].classList.add("autocomplete-active");
  }
  
  removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  
  closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i]) {
            while (x[i].hasChildNodes()) {
              x[i].removeChild(x[i].lastChild);
            }      
        }
      }
    }

  countListSize() {
        var s = 0;
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
           s+=x[i].childElementCount;
        }
        return s;
    }
    
}