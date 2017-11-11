import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css"

function Square(props) {
    //(#Req2: Change background color)
    return (
        <button className={"square " + (props.value === 'X' ? 'x-background' : '') + " " + (props.value === 'O' ? 'o-background' : '')} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

/**
 * Game component
 */
class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            player1Name: '', //used to store player1's name
            player2Name: '', //used to store player2' name
            displayGame: false //used to toggle display game area
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";

        this.setState({
            history: history.concat([
                {
                    squares: squares
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    //hainp add begin
    /**
     * Function of Play game button
     * @param {*} playFlg true: play game, false, re-enter play name 
     */
    playGame(playFlg) {
        //validation input
        if (!this.state.player1Name) {
            alert("player1 name is required!");
            return;
        }

        if (!this.state.player2Name) {
            alert("player2 name is required!");
            return;
        }

        this.setState({
            stepNumber: 0,
            xIsNext: true,
            displayGame: playFlg
        });
    }

    /**
     * handle event change input
     * @param {*} event 
     */
    handlePlayer1NameChange(event) {
        this.setState({ player1Name: event.target.value });
    }

    handlePlayer2NameChange(event) {
        this.setState({ player2Name: event.target.value });
    }
    //hainp add end

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        //hainp edit begin
        // add more two parameters in order to show winner name
        const winner = calculateWinner(current.squares, this.state.player1Name, this.state.player2Name);
        //hainp edit end

        //hainp delete begin
        // const moves = history.map((step, move) => {
        //     const desc = move ?
        //         'Go to move #' + move :
        //         'Go to game start';
        //     return (
        //         <li key={move}>
        //             <button onClick={() => this.jumpTo(move)}>{desc}</button>
        //         </li>
        //     );
        // });
        //hainp delete end
        
        //hainp edit begin
        let btnName = this.state.displayGame ? 'Re-play' : 'Play';
        let status;
        if (winner) {
            status = winner + " Win!!";
        } else {
            //(#Req 3: Display winner and display draw)
            let isDraw = checkSquaresFull(current.squares);
            if (isDraw && this.state.stepNumber === 9) {
                status = "Draw";
            } else {
                status = "Next player: " + (this.state.xIsNext ? this.state.player1Name : this.state.player2Name);
            }
        }

        //toggle form input and game area display
        let displayGameCss = '';
        let displayFormCss = '';
        if (this.state.displayGame) {
            displayGameCss = "game show";
            displayFormCss = "form-input hide";
        } else {
            displayGameCss = "game hide";
            displayFormCss = "form-input show";
        }

        return (
            // (#Req1: Add two player name input)
            <div className="main-container">
                <div className={displayFormCss}>
                    <label htmlFor="player1Name">Please enter Player1's Name:<span className="required">(*)</span></label>
                    <input autoFocus type="text" id="player1Name" name="player1Name" value={this.state.player1Name} onChange={this.handlePlayer1NameChange.bind(this)} />
                    <label htmlFor="player2Name">Please enter Player2's Name:<span className="required">(*)</span></label>
                    <input type="text" id="player2Name" name="player2Name" value={this.state.player2Name} onChange={this.handlePlayer2NameChange.bind(this)} />
                </div>
                <div className={displayGameCss}>
                    <div className="game-board">
                        <Board
                            squares={current.squares}
                            onClick={i => this.handleClick(i)}
                        />
                    </div>
                    <div className="game-info">
                        <div>Player1's Name: <span className="player-name1">{this.state.player1Name}</span></div>
                        <div>Player2's Name: <span className="player-name2">{this.state.player2Name}</span></div>
                        <div><span className="status">{status}</span></div>
                    </div>
                </div>
                <div className="button-area">
                    <div className="form-input"><button className="button" onClick={() => this.playGame(true)}><span>{btnName}</span></button></div>
                    <div className={displayGameCss}><button className="button button-reenter" onClick={() => this.playGame(false)}><span>Re-enter name</span></button></div>
                </div>
            </div>
        );
    }
    //hainp edit end
}


// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares, player1Name, player2Name) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            //hainp edit begin
            //(#Req3 Display winner name)
            if (squares[a] === 'X') {
                return player1Name;
            } else if (squares[a] === 'O') {
                return player2Name;
            }
            //hainp edit end
        }
    }
    return null;
}

//hainp add begin
/**
 * Check squares full
 * @param {*} squares 
 */
function checkSquaresFull(squares) {
    for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
            return false;
        }
        return true;
    }
}
//hainp add end
