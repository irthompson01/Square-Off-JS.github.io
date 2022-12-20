import {Tile} from './tile.js';
import {Score} from './score.js';
import {Square} from './square.js';
import {Diamond} from './diamond.js';

export class Board {
  constructor(size=8, players, canvas) {
    this.size = size;
    this.totalSquares = size*size;
    this.width = size;
    this.height = size;
    this.total_width_px = window.innerHeight*0.98;
    this.tile_length_px = this.total_width_px / this.size;

    this.origin_x = 0;
    this.origin_y = 0;

    // this.colors = [['#16558F', '#0583D2'],
    //                 ['#D2042D', '#FF3131'],
    //                 ['#00A000', '#50C878'],
    //                 ['#ff4c00', '#ee8329'],
    //                 ['rgba(100, 24, 130, 75)', '#CF9FFF'],
    //                 ['#000000', '#FEDD00']
    //                 ];

    this.sounds = [new Audio('./sounds/button.wav'),
                    new Audio('./sounds/Chime.wav'),
                    new Audio('./sounds/bell.mp3'),
                    new Audio('./sounds/fight.mp3'),
                  new Audio('./sounds/fart-01.wav'),
                  new Audio('./sounds/timer2.wav')]
    
    // Initialize players
    this.num_players = players.length;

    this.players = players;

    this.current_player = this.players[0];

    this.grid = [...Array(this.size)].map(e => Array(this.size));
    // Set grid
    for (var i = 0; i < this.width; i++){
      for (var j = 0; j < this.height; j++){
        this.grid[i][j] = new Tile(this.origin_x + (this.tile_length_px*j),
                                  this.origin_y + (this.tile_length_px*i),
                                  this.tile_length_px)
      }
    };

    this.squares = [];
    // Set Square objects made from grid tiles
    for (var num = 1; num < this.width; num++) {
      for (var j = 0; j < this.height - num; j++){
        for (var i = 0; i < this.width - num; i++){
          var square = new Square(this.grid[i][j],
                              this.grid[i][j+num],
                              this.grid[i+num][j],
                              this.grid[i+num][j+num],
                              num+1);
          this.squares.push(square);
        }
      }
    };

    this.diamonds = [];

    for (var num = 1; num < Math.ceil(this.width / 2); num++) {
      for (var j = 0; j < this.height - 2*num; j++){
        for (var i = 0; i < this.width - 2*num; i++){
          var diamond = new Diamond(this.grid[i][j+num],
                              this.grid[i+num][j],
                              this.grid[i+2*num][j+num],
                              this.grid[i+num][j+2*num],
                              num+1);
          this.diamonds.push(diamond);
        }
      }
    };



  }

  reset(size, players, p) {
    // reset the socre display
    var div = document.getElementById('scoreDisplay');
    div.replaceChildren();

    this.size = size;
    this.num_players = players.length;
    this.totalSquares = size*size;
    this.width = size;
    this.height = size;
    this.total_width_px = window.innerHeight*0.98
    this.tile_length_px = this.total_width_px / this.size;

    this.origin_x = 0;
    this.origin_y = 0;

    this.players = players;
    
    this.current_player = this.players[0];

    this.grid = []

    this.grid = [...Array(this.size)].map(e => Array(this.size));
    // Set grid
    for (var i = 0; i < this.width; i++){
      for (var j = 0; j < this.height; j++){
        this.grid[i][j] = new Tile(this.origin_x + (this.tile_length_px*j),
                                  this.origin_y + (this.tile_length_px*i),
                                  this.tile_length_px)
      }
    };

    this.squares = [];
    // Set Square objects made from grid tiles
    for (var num = 1; num < this.width; num++) {
      for (var j = 0; j < this.height - num; j++){
        for (var i = 0; i < this.width - num; i++){
          var square = new Square(this.grid[i][j],
                              this.grid[i][j+num],
                              this.grid[i+num][j],
                              this.grid[i+num][j+num],
                              num+1);
          this.squares.push(square);
        }
      }
    };

    this.diamonds = [];

    for (var num = 1; num < Math.ceil(this.width / 2); num++) {
      for (var j = 0; j < this.height - 2*num; j++){
        for (var i = 0; i < this.width - 2*num; i++){
          var diamond = new Diamond(this.grid[i][j+num],
                              this.grid[i+num][j],
                              this.grid[i+2*num][j+num],
                              this.grid[i+num][j+2*num],
                              num+1);
          this.diamonds.push(diamond);
        }
      }
  };

    this.setup(p);
    p.redraw(1);

};

  setup(p){
    var div = document.getElementById('scoreDisplay');
    let titleAnchor = document.createElement("a");
    titleAnchor.setAttribute("href", "index.html");
    let title = document.createElement('h1');
    title.setAttribute("class", "title");
    title.setAttribute("id", "h1-title");
    title.innerText = "Square Off";
    titleAnchor.appendChild(title)
    div.appendChild(titleAnchor);

    this.players.forEach(player =>{

      this.addPlayer(div, player, p);
      
    });
  }

 

  getTileClicked(mpx, mpy){
    let ox = mpx - (mpx % this.tile_length_px)+1;
    let oy = mpy - (mpy % this.tile_length_px)+1;

    let idx_x = Math.floor((ox / this.tile_length_px));
    let idx_y = Math.floor((oy / this.tile_length_px));

    let tile = this.grid[idx_y][idx_x];

    return tile;
  }

  findNewBoxes(){

    this.current_player.scoreIncrease = 0;

    this.squares.forEach(square => {
      if (square.checkOwnership() == true){
        this.current_player.squaresFormed += 1;
        this.current_player.squares.unshift(square);
        this.current_player.newSquares.unshift(square);

      };
    });

    this.diamonds.forEach(diamond => {
      if (diamond.checkOwnership() == true){
        this.current_player.squaresFormed += 1;
        this.current_player.squares.unshift(diamond);
        this.current_player.newSquares.unshift(diamond);
      };
    });

    if (this.current_player.squaresFormed >= 1){
      this.sounds[1].play();
    }
  };

  updateScore(){
    let mult = this.current_player.squaresFormed;

    // Reset or Increase muliplier
    if (mult <= 1){
      this.current_player.resetMultiplier();
      this.current_player.multiplierIncrease = 0;
    }
    else {
      this.current_player.incrementMultiplier(mult-1);
      this.current_player.multiplierIncrease = (mult-1);
    };

    for (var i = 0; i < mult; i++) {
      let points = this.current_player.squares[i].points;
      this.current_player.scoreIncrease += Math.round((this.current_player.getMultiplier()*points));
      this.current_player.addPoints(Math.round(points));
    };

    this.current_player.squaresFormed = 0;

    this.players.forEach(player => {
      let playerNameId = "playerName" + player.id;
      let playerDivId = 'player'+player.id + "div";

      let scoreDisplayId = "scoreDisplay" + player.id;
      document.getElementById(scoreDisplayId).innerText = player.getScoreDisplay();

      let multDisplayId = "multDisplay" + player.id;
      document.getElementById(multDisplayId).innerText = player.getMultiplierDisplay();

      if(player.id == (this.current_player.id%this.num_players+1)){
        document.getElementById(playerDivId).style.backgroundColor = player.fillStyle;
        document.getElementById(playerNameId).style.color = "#ffffff";
        document.getElementById(scoreDisplayId).style.color = "#ffffff";
        document.getElementById(multDisplayId).style.color = "#ffffff";

      }
      else{
        document.getElementById(playerDivId).style.backgroundColor = "#dcdcdc";
        document.getElementById(playerNameId).style.color = "#000000";
        document.getElementById(scoreDisplayId).style.color = "#000000";
        document.getElementById(multDisplayId).style.color = "#000000";
      };
    });




  }

  nextPlayer() {
    let idx = this.current_player.id % this.num_players;
    this.current_player = this.players[idx]
  }

  addPlayer(div, player, p){
    // create button toggle
    let button = document.createElement('button');
    let button_id = '#b'+player.id;
    button.setAttribute("id", button_id);
    button.setAttribute("class", "line-button");
    button.style.backgroundColor = player.outlineFillstyle;
    button.addEventListener("click", lineToggle, false);
    button.player = player;
    button.color = player.outlineFillstyle;
    button.p = p;

    function lineToggle(evt){
        evt.currentTarget.player.lineToggle = !evt.currentTarget.player.lineToggle;
        if(evt.currentTarget.player.lineToggle == false){

          button.style.backgroundColor = '#DCDCDC'
          button.style.setProperty("--color", evt.currentTarget.color);
          button.style.outlineColor = evt.currentTarget.color;
        }
        else {
          button.style.backgroundColor = evt.currentTarget.color;
          button.style.setProperty("--color", "#DCDCDC");
          button.style.outlineColor = "#dcdcdc";

        };
        evt.currentTarget.p.redraw();
      };
    let playerDivId = 'player'+player.id + "div";
    let playerDiv = document.createElement('div');
    playerDiv.setAttribute("class", "player-div");
    playerDiv.setAttribute("id", playerDivId);
    // Setup left and right divs
    let leftDiv = document.createElement('div');
    leftDiv.setAttribute("class", "player-div-left");
    let rightDiv = document.createElement('div');
    rightDiv.setAttribute("class", "player-div-right");

    // Initialize display info
    let playerNameId = "playerName" + player.id;
    let playerName = document.createElement('h3');
    playerName.setAttribute("class", "player");
    playerName.setAttribute("id", playerNameId);
    // playerName.innerText = "Player " + player.id.toString(10);
    playerName.innerText = player.name;

    let scoreDisplayId = "scoreDisplay" + player.id;
    let scoreDisplay = document.createElement('h3');
    scoreDisplay.setAttribute("class", "player");
    scoreDisplay.setAttribute("id", scoreDisplayId);
    scoreDisplay.innerText = player.getScoreDisplay();
    
    let multDisplayId = "multDisplay" + player.id;
    let multDisplay = document.createElement('h3');
    multDisplay.setAttribute("class", "player");
    multDisplay.setAttribute("id", multDisplayId);
    multDisplay.innerText = player.getMultiplierDisplay();

    // add items to left div  
    leftDiv.appendChild(playerName);
    leftDiv.appendChild(button);
    // add items to right div  
    rightDiv.appendChild(scoreDisplay);
    rightDiv.appendChild(multDisplay);
    // Add left and right divs to player div
    playerDiv.appendChild(leftDiv);
    playerDiv.appendChild(rightDiv);
    // add player div to score div
    div.appendChild(playerDiv);
    
    if(player.id == 1){
      playerDiv.style.backgroundColor = player.fillStyle;
      document.getElementById(playerNameId).style.color = "#ffffff";
      document.getElementById(scoreDisplayId).style.color = "#ffffff";
      document.getElementById(multDisplayId).style.color = "#ffffff";

    
    }
    else{
      playerDiv.style.backgroundColor = "#dcdcdc";
      document.getElementById(playerNameId).style.color = "#000000";
      document.getElementById(scoreDisplayId).style.color = "#000000";
      document.getElementById(multDisplayId).style.color = "#000000";
    };

    // return playerDiv;
  }

  endGame(){
    let currentWinner = this.getCurrentWinner();
    alert(currentWinner.name + " wins!\n" + currentWinner.getStats());
  }

  getCurrentWinner(){
    let maxValue = Number.MIN_VALUE;
    let currentWinner;

    for(var i=0;i<this.players.length;i++){
        if(this.players[i].currentScore>maxValue){
        maxValue = this.players[i].currentScore;
        currentWinner = this.players[i];
       }
    }
    return currentWinner;
  }
};
