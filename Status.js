/* global pmc */
pmc.Status = class Status {
    constructor(velvet){
        this.velvet = velvet;
        var status = document.createElement('div');
        status.id = "status";
        status.style.textAlign='right';
        status.textContent = "0:0";
        document.getElementById('foot').appendChild(status);
    }
}