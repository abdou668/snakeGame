let countdown=3,avanceX=0,avanceY=0,score=0,highscore=0;
var rapidite=20;
let scoreAffiche;
const btn = document.getElementById("btn");
const jeu = document.getElementById("jeu");  
const jeuParam = document.getElementById("jeuParam");  
const titre = document.getElementById("titre");      
const gg = document.getElementById("felicitation"); 
const tout = document.getElementById("tout"); 
const replay=document.getElementById("rejouer");
const scoreId=document.getElementById("score");
const highscoreId=document.getElementById("highscore");
const ctx = jeu.getContext("2d");
var monSerpent ,bonbon,lonBonbon=10,larBonbon=10,xSerpent=200,ySerpent=200;
function demmare() {
    monSerpent = new serpent(xSerpent,ySerpent);
    genererBonbon();
    interval = setInterval(update, 100);
}
class composant {
    constructor(lon,lar,couleur,x,y) {
        this.lon=lon;
        this.lar=lar;
        this.couleur=couleur;
        this.x=x;
        this.y=y;
    }
    creation() {
        ctx.fillStyle=this.couleur;
        ctx.fillRect(this.x,this.y,this.lon,this.lar);
    }
    coordonnees(){
        return {
            gauche : this.x,
            droite : this.x + this.lon,
            haut : this.y,
            bas : this.y + this.lar,
        }
    }
}
class serpent extends composant {
    constructor(x,y) {
        super(20,20,"#00ff00",x,y);
        this.corps = [];
        this.taille = 0;
        this.direction = { x: 0, y: 0 };
    }
    creation() {
        super.creation();
        ctx.fillStyle="#32cd32";
        for (let i = 0; i < this.corps.length; i++) {
            ctx.fillRect(this.corps[i].x,this.corps[i].y,this.lon,this.lar); 
            if (i!=0 && this.corps[0].x === this.corps[i].x && this.corps[0].y===this.corps[i].y ){
                congratulation();
            }
        }
    }
    miseAjour() {
        this.corps.unshift({x:this.x,y:this.y});
        if (this.taille<this.corps.length) {
            this.corps.pop();
        }
        this.x +=avanceX;
        this.y +=avanceY;
    }
    grandir(){
        this.taille++;
    }
    mange(obj){
        var {gauche, droite, haut, bas} = this.coordonnees();
        var objCoord = obj.coordonnees();
        var touche = true;
        if (gauche>objCoord.droite || droite<objCoord.gauche || haut>objCoord.bas || bas<objCoord.haut ) {
            touche = false;
        }
        return touche;
    }

    toucheObstacle(){
        var {gauche, droite, haut, bas} = this.coordonnees();
        var touche = false;
        if (gauche<0 || droite>jeu.width || haut<0 || bas>jeu.height ) {
            touche = true;
        }
        return touche;
    }
}
function genererBonbon() {
    const randomX = Math.floor(Math.random() * (jeu.width - lonBonbon));
    const randomY = Math.floor(Math.random() * (jeu.height - larBonbon));
    bonbon = new composant(lonBonbon, larBonbon, "pink", randomX, randomY);
}
function congratulation() {
    clearInterval(interval);
    gg.classList.remove("noDisp");
    scoreAffiche = document.createElement("span");
    scoreAffiche.style.marginTop ='auto';
    scoreAffiche.textContent = `SCORE : ${score} POINTS !!!`;
    gg.appendChild(scoreAffiche);
    replay.classList.remove("noDisp");
    if (highscore<score) {        
      highscore=score;
      highscoreId.textContent = `Highscore : ${highscore}`;
    }
}
function replayFonct() {
    demmare();
    score=0;
    gg.classList.add("noDisp");
    gg.removeChild(scoreAffiche);
    scoreAffiche=null;
}
function gestionScore() {
        scoreId.textContent = `Score : ${score}`;
}
function update() {
    /*for (let i = 1; i < monSerpent.corps.length; i++) {
        if (monSerpent.mange(monSerpent.corps[i])) {
            congratulation();
        }}*/
    if (monSerpent.toucheObstacle() /*|| monSerpent.mange(monSerpent.corps[taille])*/) {
        congratulation();
    }
    else{
    ctx.clearRect(0,0,jeu.width,jeu.height);
    monSerpent.creation();
    bonbon.creation();
    monSerpent.miseAjour();
    gestionScore();
    if (monSerpent.mange(bonbon)) {
        monSerpent.grandir();
        genererBonbon();
        score++;}
    }
}
//document.addEventListener("keyup",()=>{avanceX=0;avanceY=0;})   au cas ou ^^
function mouvement(e) {
    switch (e.keyCode) {
        case 37: // Gauche
            if (monSerpent.direction.x === 0) {monSerpent.direction = { x: -rapidite, y: 0 };}
            break;
        case 38: // Haut
            if (monSerpent.direction.y === 0) {monSerpent.direction = { x: 0, y: -rapidite };}
            break;
        case 39: // Droite
            if (monSerpent.direction.x === 0) {monSerpent.direction = { x: rapidite, y: 0 };}
            break;
        case 40: // Bas
            if (monSerpent.direction.y === 0) {monSerpent.direction = { x: 0, y: rapidite };}
            break;
    }
    avanceX = monSerpent.direction.x;
    avanceY = monSerpent.direction.y;
}
function fcountdown() {
    btn.disabled =true;
    btn.textContent = "GO";
    setTimeout(function(){titre.classList.add("hidden");btn.classList.add("hidden");tout.classList.remove("noDisp");},200);
    setTimeout(function(){btn.classList.add("noDisp");titre.classList.add("noDisp");tout.classList.add("show");document.addEventListener("keydown",mouvement);demmare();},1200);
}
btn.onclick = fcountdown;
replay.onclick = replayFonct;