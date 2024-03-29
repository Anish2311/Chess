const board = document.getElementById('board')
const prom = document.getElementById('promotion')
let dim = Math.min(window.innerHeight,window.innerWidth)
let grid = []
let FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
let sel = null
let selLegal = []
let moves = []
let whCap = ''
let blCap = ''
let chance = true
let BCasR = true
let BCasL = true
let WCasR = true
let WCasL = true
let check = true
let canContinue = true
board.style.top = `${(window.innerHeight - dim)/2}px`
board.style.left = `${(window.innerWidth - dim)/2}px`
if(dim == window.innerHeight){
    prom.style.top = `${((window.innerHeight - dim)/2) + 32}px`
    prom.style.left = `${((window.innerWidth - dim)/2) - 144}px`
    prom.style.height = `${dim - 98}px`
    prom.style.width = `${dim/8}px`
    prom.style.flexDirection = "coloumn"
}
else{
    prom.style.top = `${((window.innerHeight - dim)/2) - 70}px`
    prom.style.left = `${((window.innerWidth - dim)/2) + 16}px`
    prom.style.height = `${(dim/8)}px`
    prom.style.width = `${dim-48}px`
    prom.style.flexDirection = "row"
}

for(let j = 0; j < 8; j++){
    for(let i = 0; i < 8; i++){
        grid.push(' ')
    }
}

fenConv(FEN)
initialize()

function initialize(){
    board.innerHTML = ''
    for(let j = 0; j < 8; j++){
        let mrkp = ''
        for(let i = 0; i < 8; i++){
            // grid.push(' ')
            let color = 'rgb(70, 150, 80)'
            if((j%2 == 0 && i%2 == 0) || (j%2 == 1 && i%2 == 1)){
                color = 'rgb(250,250,250)'
            }
            mrkp += `<div class="block" style="width: ${(dim/8)}px;height: ${(dim/8)}px; margin: 0px;background-color: ${color};" id="${i + (j * 8)}" onclick="move(${i + (j * 8)})"> </div>`
        }
        let markup = `<div class="row">${mrkp}</div>`
        if(check == false){
            board.insertAdjacentHTML('afterbegin',markup)
        }
        else{
            board.insertAdjacentHTML('beforeend',markup)
        }
    }
    show()
}

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
                let markup = `<img src="${piece[grid[ind]]}" class="piece" alt=""  onmouseover="anim(${grid[ind] == grid[ind].toUpperCase()},${ind},false)" onmouseleave="anim(${grid[ind] == grid[ind].toUpperCase()},${ind},true)">`
                document.getElementById(`${ind}`).innerHTML = markup
            }
        }
    }
}

function anim(b,ind,o){
    if(b == chance && o == false){
        let obj = document.getElementById(`${ind}`).childNodes[0]
        obj.style.scale = "0.8"
    }
    else if(b == chance && o == true){
        let obj = document.getElementById(`${ind}`).childNodes[0]
        obj.style.scale = "0.9"
    }
}

function diagonal(i,wh,gr){
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
            legal.push(ind - 10)
        }
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
        if(friendOrFoe(i - 16,wh,legal,true,gr) == false && friendOrFoe(i - 8,wh,legal,true,gr) == false){legal.push(i - 16)}   
    }
    if(wh && i < 64 && i > 7){if(friendOrFoe(i - 8,wh,legal,true,gr) == false){legal.push(i - 8)}}
    if(wh && i%8 < 7 && i > 7){friendOrFoe(i - 7,wh,legal,false,gr)}
    if(wh && i%8 > 0 && i > 7){friendOrFoe(i - 9,wh,legal,false,gr)}
    if(wh && i - 7 > 0 && i%8 < 7 && i > 7){if(grid[i - 7] == ' ' && moves[moves.length - 1] == `${i-15}p${i+1}`){legal.push(i - 7)}}
    if(wh && i - 9 > 0 && i%8 > 0 && i > 7){if(grid[i - 9] == ' ' && moves[moves.length - 1] == `${i-17}p${i-1}`){legal.push(i - 9)}}

    //Black

    if(wh == false && i > 7 && i < 16){
        if(friendOrFoe(i + 16,wh,legal,true,gr) == false && friendOrFoe(i + 8,wh,legal,true,gr) == false){legal.push(i + 16)}   
    }
    if(wh == false && i < 56){if(friendOrFoe(i + 8,wh,legal,true,gr) == false){legal.push(i + 8)}}
    if(wh == false && i%8 > 0 && i < 56){friendOrFoe(i + 7,wh,legal,false,gr)}
    if(wh == false && i%8 < 7 && i < 56){friendOrFoe(i + 9,wh,legal,false,gr)}
    if(wh == false && i + 7 < 64 && i%8 > 0 && i < 56){if(grid[i + 7] == ' ' && moves[moves.length - 1] == `${i+15}P${i-1}`){legal.push(i + 7)}}
    if(wh == false && i + 9 < 64 && i%8 < 7 && i < 56){if(grid[i + 9] == ' ' && moves[moves.length - 1] == `${i+17}P${i+1}`){legal.push(i + 9)}}
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

    // Castling
    if(isThere(wh,gr,i+1,true) == false && isThere(wh,gr,i+2,true) == false && isThere(wh,gr,i,true) == false){
        if(wh && WCasR && gr[i + 1] == ' ' && gr[i + 2] == ' '){legal.push(i + 2)}
        if(wh == false && BCasR && gr[i + 1] == ' ' && gr[i + 2] == ' '){legal.push(i + 2)}
    }
    else if(isThere(wh,gr,i-1,true) == false && isThere(wh,gr,i-2,true) == false && isThere(wh,gr,i-3,true) == false && isThere(wh,gr,i,true) == false){
        if(wh && WCasL && gr[i - 1] == ' ' && gr[i - 2] == ' ' && gr[i - 3] == ' '){legal.push(i - 2)}
        if(wh == false && BCasL && gr[i - 1] == ' ' && gr[i - 2] == ' ' && gr[i - 3] == ' '){legal.push(i - 2)}
    }
    return legal
}

function friendOrFoe(ind,wh,l,p,gr){
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
            let color = "rgb(70, 150, 80)"
            if((j%2 == 0 && i%2 == 0) || (j%2 == 1 && i%2 == 1)){
                color = "rgb(250, 250, 250)"
            }
            document.getElementById(i + j * 8).style.borderRadius = '0px'
            document.getElementById(i + j * 8).style.backgroundColor = color
            show()
        }
    }
}

function move(ind){
    if(canContinue){
        if(sel == null){
            let wh = false
            if(grid[ind] == grid[ind].toUpperCase()){
                wh = true
            }
            if(wh == chance && grid[ind] != ' '){
                // reset()
                selLegal = legalMoves(ind,wh,grid)
                selLegal = filtering(selLegal,ind)
                sel = ind
                document.getElementById(ind).style.backgroundColor = "rgb(255,255,50)"
                // document.getElementById(ind).style.scale = `${((dim/8) - 4)/(dim/6)}`
            }
            selLegal.forEach(e => {
                // document.getElementById(e).style.backgroundColor = "rgb(250,250,150)"
                if(grid[e] == ' '){
                    document.getElementById(e).insertAdjacentHTML('beforeend',`<div class="circle" style="width: ${dim/20}px;height: ${dim/20}px; border-radius: ${dim/20}px;margin: ${dim/28}px 0px 0px ${dim/28}px;"></div>`)
                }
                else{
                    document.getElementById(e).style.borderRadius = `${dim/32}px`
                }
            });
        }
        else{
            if(selLegal.includes(ind)){
                moves.push(`${sel}${grid[sel]}${ind}`)
                //Castling
                canCastle(sel,ind)
                if(grid[sel].toLowerCase() == 'k' && ind - sel == -2){grid[ind + 1] = grid[ind - 2];grid[ind - 2] = ' '}
                if(grid[sel].toLowerCase() == 'k' && ind - sel == 2){grid[ind - 1] = grid[ind + 1];grid[ind + 1] = ' '}
                //Captures
                if(chance && grid[ind] != ' '){whCap += grid[ind]}
                if(chance == false && grid[ind] != ' '){blCap += grid[ind]}
                //Enpessant
                let int = enPessant(ind,sel)
                if(int != null){if(chance){whCap += grid[sel + int]}else{blCap += grid[sel + int]};grid[sel + int] = ' '}
                //Promotion
                if(ind < 8 && grid[sel]  == 'P'){prom.insertAdjacentHTML('beforeend',promotionMarkup(true,ind)); prom.style.display = "flex"; canContinue = false}
                if(ind > 55 && grid[sel]  == 'p'){prom.insertAdjacentHTML('beforeend',promotionMarkup(false,ind)); prom.style.display = "flex"; canContinue = false}
                //Moving
                grid[ind] = grid[sel]
                grid[sel] = ' '
                if(canContinue){
                    selLegal = []
                    if(chance){chance = false}else{chance = true}
                    reset()
                    document.getElementById(sel).style.backgroundColor = "rgb(255,255,100)"
                    document.getElementById(ind).style.backgroundColor = "rgb(255,255,100)"
                    sel = null
                    show()
                    //Checkmate alert
                    setTimeout(function checkmate(){if(isCheckMate(chance,grid)){if(chance){alert('Black has won the game!!')}else{alert('White has won the game!!')}}},500)
                }
                
            }
            else{
                sel = null
                selLegal = []
                reset()
                move(ind)
            }
        }
    }
}

function legalMoves(ind,wh,gr,f){
    let legal = []
    if(gr[ind] != ' '){
        if(gr[ind].toLowerCase() == 'r'){
            legal = straight(ind,wh,gr)
        }
        else if(gr[ind].toLowerCase() == 'b'){
            legal = diagonal(ind,wh,gr)
        }
        else if(gr[ind].toLowerCase() == 'q'){
            legal = straight(ind,wh,gr).concat(diagonal(ind,wh,gr))
        }
        else if(gr[ind].toLowerCase() == 'n'){
            legal = horsey(ind,wh,gr)
        }
        else if(gr[ind].toLowerCase() == 'p'){
            legal = pawn(ind,wh,gr)
        }
        else if(gr[ind].toLowerCase() == 'k' && f != true){
            legal = king(ind,wh,gr)
        }
    }
    return legal
}

function isThere(wh,g,ind,f){
    for(let i = 0; i < g.length; i++){
        if(g[i] != ' '){
            if((g[i] == g[i].toUpperCase()) != wh){
                if(legalMoves(i,g[i] == g[i].toUpperCase(),g,f).includes(ind)){
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
        let ind = 0
        if(chance){ind = gridCopy.indexOf('K')}
        else{ind = gridCopy.indexOf('k')}
        if(isThere(chance,gridCopy,ind)){
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

function enPessant(ind,sel){
    if(grid[ind] == ' ' && grid[sel].toLowerCase() == 'p' && Math.abs(ind - sel)%8 != 0){
        if((chance && Math.abs(ind - sel) > 8) || (chance == false && Math.abs(ind - sel) < 8)){
            return -1
        }
        else if((chance && Math.abs(ind - sel) < 8) || (chance == false && Math.abs(ind - sel) > 8)){
            return 1
        }
    }
    return null
}

function canCastle(sel,ind){
    if(WCasL || WCasR || BCasL || BCasR){
        if(grid[sel] == 'K'){WCasL = false; WCasR = false}
        if(grid[sel] == 'k'){BCasL = false; BCasR = false}
        if(grid[sel] == 'R'){if(sel%8 == 0){WCasL = false}else if (sel%8 == 7){WCasR = false}}
        if(grid[sel] == 'r'){if(sel%8 == 0){BCasL = false}else if (sel%8 == 7){BCasR = false}}
        if(grid[ind] == 'R'){if(ind%8 == 0){WCasL = false}else if (ind%8 == 7){WCasR = false}}
        if(grid[ind] == 'r'){if(ind%8 == 0){BCasL = false}else if (ind%8 == 7){BCasR = false}}
    }
}

function promotionMarkup(wh,ind){
    let p = ['Q','B','N','R','q','b','n','r']
    let m = ''
    p.forEach(e => {
        if((e.toUpperCase() == e) == wh){
            m += `<img src="${piece[e]}"  alt="" onclick="promote('${e}',${ind})">`
        }
    });
    return m
}

function promote(e,ind){
    grid[ind] = `${e}`
    canContinue = true
    selLegal = []
    if(chance){chance = false}else{chance = true}
    reset()
    document.getElementById(sel).style.backgroundColor = "rgb(255,255,100)"
    document.getElementById(ind).style.backgroundColor = "rgb(255,255,100)"
    sel = null
    show()
    prom.style.display = "none"
    //Checkmate alert
    setTimeout(function checkmate(){if(isCheckMate(chance,grid)){if(chance){alert('Black has won the game!!')}else{alert('White has won the game!!')}}},500)
}

document.getElementById('rot').addEventListener('click',()=>{
    if(check){check = false; document.getElementById('rot').style.backgroundColor = 'black'}else{check = true; document.getElementById('rot').style.backgroundColor = 'white'}
    initialize()
})