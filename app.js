const board = document.getElementById('board')
const whcap = document.getElementById('whCap')
const blcap = document.getElementById('blCap')
let dim = Math.min(window.innerHeight,window.innerWidth)
let grid = []
let FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
let sel = null
let selLegal = []
let moves = []
let whCap = ''
let blCap = ''
let chance = true
board.style.top = `${(window.innerHeight - dim)/2}px`
board.style.left = `${(window.innerWidth - dim)/2}px`

for(let j = 0; j < 8; j++){
    let mrkp = ''
    for(let i = 0; i < 8; i++){
        grid.push(' ')
        let color = 'rgb(70, 70, 70)'
        if((j%2 == 0 && i%2 == 0) || (j%2 == 1 && i%2 == 1)){
            color = 'rgb(100, 100, 100)'
        }
        mrkp += `<div class="block" style="width: ${(dim/8) - 7.2}px;height: ${(dim/8) - 20}px; margin: 2px;background-color: ${color};" id="${i + (j * 8)}" onclick="move(${i + (j * 8)})"> </div>`
    }
    let markup = `<div class="row">${mrkp}</div>`
    board.insertAdjacentHTML('beforeend',markup)
}

fenConv(FEN)
show()

function fenConv(fen){
    let x = 0
    let y = 0
    for(let i = 0; i < fen.length; i ++){
        if(fen[i] == '/'){
            x += 1
            y = 0
        }
        else{
            if(isNaN(parseInt(fen[i])) == false){
                y += parseInt(fen[i])
            }
            else{
                let ind = y + x * 8
                grid[ind] = fen[i]
                y += 1
            }
        }
    }
}

function show(){
    for(let i = 0; i < 8; i ++){
        for(let j = 0; j < 8; j ++){
            let ind = j + (i * 8)
            document.getElementById(`${ind}`).innerHTML = ' '
            if(grid[ind] != ' '){
                let markup = `<img src="${piece[grid[ind]]}" alt="">`
                document.getElementById(`${ind}`).innerHTML = markup
            }
        }
    }
}

function diagnol(i,wh,gr){
    let ind = i
    let legal = []
    while(ind%8 != 7 && ind >= 0){
        ind -= 7
        if(ind >= 0){
            if(friendOrFoe(ind,wh,legal,false,gr)){ind = -1; break}
            else{
                legal.push(ind)
            }
        }
    }
    ind = i
    while(ind%8 != 0 && ind >= 0){
        ind -= 9
        if(ind >= 0){
            if(friendOrFoe(ind,wh,legal,false,gr)){ind = -1; break}
            else{
                legal.push(ind)
            }
        }
    }
    ind = i
    while(ind%8 != 7 && ind >= 0){
        ind += 9
        if(ind < 64){
            if(friendOrFoe(ind,wh,legal,false,gr)){ind = -1; break}
            else{
                legal.push(ind)
            }
        }
    }
    ind = i
    while(ind%8 != 0 && ind >= 0){
        ind += 7
        if(ind < 64){
            if(friendOrFoe(ind,wh,legal,false,gr)){ind = -1; break}
            else{
                legal.push(ind)
            }
        }
    }
    return legal
}

function straight(i,wh,gr){
    let ind = i
    let legal = []
    while(ind%8 != 7 && ind >= 0){
        ind += 1
        if(ind < 64){
            if(friendOrFoe(ind,wh,legal,false,gr)){ind = -1; break}
            else{
                legal.push(ind)
            }
        }
    }
    ind = i
    while(ind%8 != 0 && ind >= 0){
        ind -= 1
        if(ind >= 0){
            if(friendOrFoe(ind,wh,legal,false,gr)){ind = -1; break}
            else{
                legal.push(ind)
            }
        }
    }
    ind = i
    while(ind < 64 && ind >= 0){
        ind += 8
        if(ind < 64){
            if(friendOrFoe(ind,wh,legal,false,gr)){ind = -1; break}
            else{
                legal.push(ind)
            }
        }
    }
    ind = i
    while(ind < 64 && ind >= 0){
        ind -= 8
        if(ind < 64 && ind >= 0){
            if(friendOrFoe(ind,wh,legal,false,gr)){ind = -1; break}
            else{
                legal.push(ind)
            }
        }
    }
    return legal
}

function horsey(i,wh,gr){
    let ind = i
    let legal = []
    if(ind - 15 > 0 && ind%8 < 7){
        if(friendOrFoe(ind - 15,wh,legal,false,gr) == false){
        legal.push(ind - 15)}
    }
    if(ind - 17 > 0 && ind%8 > 0){
        if(friendOrFoe(ind - 17,wh,legal,false,gr) == false){
        legal.push(ind - 17)}
    }
    if(ind - 6 > 0 && ind%8 < 6){
        if(friendOrFoe(ind - 6,wh,legal,false,gr) == false){
        legal.push(ind - 6)}
    }
    if(ind + 10 < 64 && ind%8 < 6){
        if(friendOrFoe(ind + 10,wh,legal,false,gr) == false){
        legal.push(ind + 10)}
    }
    if(ind + 17 < 64 && ind%8 < 7){
        if(friendOrFoe(ind + 17,wh,legal,false,gr) == false){
        legal.push(ind + 17)}
    }
    if(ind + 15 < 64  && ind%8 > 0){
        if(friendOrFoe(ind + 15,wh,legal,false,gr) == false){
        legal.push(ind + 15)}
    }
    if(ind - 10 > 0 && ind%8 > 1){
        if(friendOrFoe(ind - 10,wh,legal,false,gr) == false){
        legal.push(ind - 10)}
    }
    if(ind + 6 < 64 && ind%8 > 1){
        if(friendOrFoe(ind + 6,wh,legal,false,gr) == false){
        legal.push(ind + 6)}
    }
    return legal
}

function pawn(i,wh,gr){
    let legal = []

    //White

    if(wh && i > 47 && i < 56){
        if(friendOrFoe(i - 16,wh,legal,true,gr) == false){legal.push(i - 16)}   
    }
    if(wh && i < 64){if(friendOrFoe(i - 8,wh,legal,true,gr) == false){legal.push(i - 8)}}
    if(wh && i%8 < 7){friendOrFoe(i - 7,wh,legal,false,gr)}
    if(wh && i%8 > 0){friendOrFoe(i - 9,wh,legal,false,gr)}

    //Black

    if(wh == false && i > 7 && i < 16){
        if(friendOrFoe(i + 16,wh,legal,true,gr) == false){legal.push(i + 16)}   
    }
    if(wh == false && i < 64){if(friendOrFoe(i + 8,wh,legal,true,gr) == false){legal.push(i + 8)}}
    if(wh == false && i%8 > 0){friendOrFoe(i + 7,wh,legal,false,gr)}
    if(wh == false && i%8 < 7){friendOrFoe(i + 9,wh,legal,false,gr)}
    return legal
}


function king(i,wh,gr){
    let legal = []
    if(i - 8 >= 0){if(friendOrFoe(i - 8,wh,legal,false,gr) == false){legal.push(i - 8)}}
    if(i + 8 < 64){if(friendOrFoe(i + 8,wh,legal,false,gr) == false){legal.push(i + 8)}}
    if(i - 9 >= 0 && i%8 > 0){if(friendOrFoe(i - 9,wh,legal,false,gr) == false){legal.push(i - 9)}}
    if(i + 9 < 64 && i%8 < 7){if(friendOrFoe(i + 9,wh,legal,false,gr) == false){legal.push(i + 9)}}
    if(i - 7 >= 0 && i%8 < 7){if(friendOrFoe(i - 7,wh,legal,false,gr) == false){legal.push(i - 7)}}
    if(i + 7 < 64 && i%8 > 0){if(friendOrFoe(i + 7,wh,legal,false,gr) == false){legal.push(i + 7)}}
    if(i - 1 >= 0  && i%8 > 0){if(friendOrFoe(i - 1,wh,legal,false,gr) == false){legal.push(i - 1)}}
    if(i + 1 < 64  && i%8 < 7){if(friendOrFoe(i + 1,wh,legal,false,gr) == false){legal.push(i + 1)}}
    return legal
}

function friendOrFoe(ind,wh,l,p,gr){
    // console.log(ind,gr);
    if(gr[ind] == ' '){
        return false
    }
    else{
        if((gr[ind] == gr[ind].toUpperCase()) == wh){
            return true
        }
        else{
            if(p == false){
                // console.log('PUSH',wh);
                l.push(ind)
            }
            // document.getElementById(`${ind}`).style.backgroundColor = "rgb(150,120,0)"
            return true
        }
    }
}

function reset(){
    for(let j = 0; j < 8; j++){
        for(let i = 0; i < 8; i++){
            let color = "rgb(70, 70, 70)"
            if((j%2 == 0 && i%2 == 0) || (j%2 == 1 && i%2 == 1)){
                color = "rgb(100, 100, 100)"
            }
            document.getElementById(`${i + (j * 8)}`).style.backgroundColor = color
        }
    }
}

function move(ind){
    if(sel == null){
        reset()
        let wh = false
        if(grid[ind] == grid[ind].toUpperCase()){
            wh = true
        }
        if(wh == chance){
            selLegal = legalMoves(ind,wh,grid)
            selLegal = filtering(selLegal,ind)
            sel = ind
            document.getElementById(ind).style.backgroundColor = "rgb(100,80,0)"
        }
        selLegal.forEach(e => {
            document.getElementById(e).style.backgroundColor = "rgb(150,120,0)"
        });
    }
    else{
        if(selLegal.includes(ind)){
            moves.push(`${sel}${grid[sel]}${ind}`)
            if(chance && grid[ind] != ' '){whCap += grid[ind]}
            if(chance == false && grid[ind] != ' '){blCap += grid[ind]}
            blcap.innerText = blCap
            whcap.innerText = whCap
            grid[ind] = grid[sel]
            grid[sel] = ' '
            sel = null
            selLegal = []
            if(chance){chance = false}else{chance = true}
            // console.log(grid,selLegal);
            reset()
            show()
            setTimeout(function checkmate(){if(isCheckMate(chance,grid)){if(chance){alert('Black has won the game!!')}else{alert('White has won the game!!')}}},500)
            
        }
        else{
            sel = null
            selLegal = []
            reset()
            move(ind)
        }
    }
}

function legalMoves(ind,wh,gr){
    let legal = []
    if(gr[ind] != ' '){
        if(gr[ind].toLowerCase() == 'r'){
            legal = straight(ind,wh,gr)
        }
        else if(gr[ind].toLowerCase() == 'b'){
            legal = diagnol(ind,wh,gr)
        }
        else if(gr[ind].toLowerCase() == 'q'){
            legal = straight(ind,wh,gr).concat(diagnol(ind,wh,gr))
        }
        else if(gr[ind].toLowerCase() == 'n'){
            legal = horsey(ind,wh,gr)
        }
        else if(gr[ind].toLowerCase() == 'p'){
            legal = pawn(ind,wh,gr)
        }
        else if(gr[ind].toLowerCase() == 'k'){
            legal = king(ind,wh,gr)
        }
    }
    return legal
}

function isCheck(wh,g){
    let ind = 0;
    if(wh){ind = g.indexOf('K')}
    else{ind = g.indexOf('k')}
    for(let i = 0; i < g.length; i++){
        if(g[i] != ' '){
            if((g[i] == g[i].toUpperCase()) != wh){
                if(legalMoves(i,g[i] == g[i].toUpperCase(),g).includes(ind)){
                    return true
                }
            }
        }
    }
    return false
}

function filtering(a,s){
    a.forEach((e,i) => {
        let gridCopy = []
        gridCopy = grid.slice(0)
        // console.log(gridCopy,grid);
        gridCopy[e] = gridCopy[s]
        gridCopy[s] = ' '
        // console.log(a);
        if(isCheck(chance,gridCopy)){
            a.splice(i,1)
            filtering(a,s)
        }
    });
    return a
}

function isCheckMate(wh,g){
    for(let i = 0; i < g.length; i++){
        if(g[i] != ' '){
            if((g[i] == g[i].toUpperCase()) == wh){
                if(filtering(legalMoves(i,wh,g),i).length > 0){
                    return false
                }
            }
        }
    }
    console.log('checkmate');
    return true
}