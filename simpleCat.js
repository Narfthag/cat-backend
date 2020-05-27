function SimpleCat(){
    
    this.board = null;
    this.turnsPlayed = 0;
    this.notEnded = false;

    this.FIRST_PLAYER = 'X';
    this.SECOND_PLAYER = 'O';
    this.EMPTY = '';

    this.restart = () => {
        this.board = [['','',''],['','',''],['','','']];
        this.turnsPlayed = 0;
        this.ended = false;
    }

    this.isGoodMove = (col, row) => {
        if(col > 3 || col < 0 || row < 0 || row > 3){
            return { status: 0, error_message: "Esa celda no existe." }
        } else if ( this.board[col][row] !== this.EMPTY ){
            return { status: 0, error_message: "Esa celda ya esta seleccionada." };
        } else {
            return { status: 1, error_message: "" }
        }
    }

    this.turnPlayer = (col, row, player) => {
        this.board[col][row] = player;
        this.turnsPlayed++;
        this.notEnded = this.turnsPlayed < 9 ;
    }

    this.firstPlayerTurn = (col, row) => {
        this.turnPlayer(col, row, this.FIRST_PLAYER);
    }

    this.secondPlayerTurn = (col, row) => {
        this.turnPlayer(col, row, this.SECOND_PLAYER);
    }

    this.didItWin = (player) => {
        const l = this.board;
        const p = player;
        return (
                (l[0][0] === p && l[0][1] === p && l[0][2] === p) ||
                (l[1][0] === p && l[1][1] === p && l[1][2] === p) ||
                (l[2][0] === p && l[2][1] === p && l[2][2] === p) ||
                (l[0][0] === p && l[1][0] === p && l[2][0] === p) ||
                (l[0][1] === p && l[1][1] === p && l[2][1] === p) ||
                (l[0][2] === p && l[1][2] === p && l[2][2] === p) ||
                (l[0][0] === p && l[1][1] === p && l[2][2] === p) ||
                (l[2][0] === p && l[1][1] === p && l[0][2] === p)
                );
        
    }

    this.didFirstPlayerWin = () => {
        return this.didItWin(this.FIRST_PLAYER);
    }

    this.didSecondPlayerWin = () => {
        return this.didItWin(this.SECOND_PLAYER);
    }


    this.restart();
}

export default SimpleCat;