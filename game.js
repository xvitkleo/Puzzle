const reader = new FileReader();
const fileInput = document.getElementById("file");
let src = null;
let smallPieces = [];
let bigPiecesCont = 0;
var d = new Date();
var startTime;
var timeElement = document.querySelector(".time");
var intervalId;
var moves = 0;

var pieceSelected = {
    selectedSmall: false,
    elementSmall: null,
};

function createPieceElement() {
    let piece = document.createElement('div');
    piece.style.backgroundImage = `url(${src})`;
    piece.classList.add('piece');       
    return piece;
}

function createSmallPieces() {  
        let imageSize = 300;
        let pieceSize = imageSize/3;
        let pos = 0;
        for (let i=0; i<3; i++) {
            for (let j=0; j<3; j++) {
                let piece = createPieceElement();  
                piece.classList.add(pos++);  
                piece.addEventListener('click', function(event) {
                    let occupied = !(piece.style.backgroundImage=='none');
                    let selected = false;
                    if(pieceSelected.elementSmall !=null) selected = (pieceSelected.elementSmall.className.includes('selected'));
                    if (!selected && !pieceSelected.selectedSmall && occupied)
                    {
                        pieceSelected.selectedSmall = true;
                        pieceSelected.elementSmall = piece;
                        pieceSelected.elementSmall.classList.add("selected");
                        pieceSelected.elementSmall.parentElement.style.border = 'solid orange 2px';
                    } else if (selected && pieceSelected.selectedSmall) {
                        pieceSelected.elementSmall.classList.remove("selected");
                        pieceSelected.elementSmall.parentElement.style.border = 'none';
                        pieceSelected.selectedSmall = false;
                    }
                });                    
                smallPieces.push(piece);
            }   
        }
    let i = 0;
    smallPieces.sort(() => Math.random() - 0.5);
    for (const pieceContainer of document.querySelectorAll(".small-piece_container")) {
        pieceContainer.appendChild(smallPieces[i++]);
    }
}

function createBigPieces() {
    for (const pieceContainer of document.querySelectorAll(".big-piece_container")) {          
        let occupied = false;              
        pieceContainer.addEventListener('click', bigPieceListener)
    }
}

let bigPieceListener = function(event) { 
    pieceContainer = event.currentTarget;
    occupied = !(pieceContainer.firstChild==null);
    moves++;
    document.querySelector('.moves').innerHTML = moves;
    if (pieceSelected.selectedSmall && !occupied) { 
        let piece = createPieceElement();
        piece.classList.add(getClassNumber(pieceSelected.elementSmall.className));                 
        pieceContainer.appendChild(piece);
        pieceSelected.selectedSmall = false;              
        pieceSelected.elementSmall.classList.remove("selected");                
        pieceSelected.elementSmall.parentElement.style.border = 'none';                        
        pieceSelected.elementSmall.style.backgroundImage = 'none';
        bigPiecesCont++;
        if (bigPiecesCont==9) gameFinish();
    } else if (occupied && !pieceSelected.selectedSmall) {
        bigPiecesCont--;
        document.getElementsByClassName(pieceContainer.firstElementChild.className)[1].style.backgroundImage = `url(${src})`;
        pieceContainer.firstElementChild.remove();        
    }
}


fileInput.addEventListener('change', e => {
    const f = e.target.files[0];
    let correctFile = true;
    if (f.size/1000000 > 3) {
        showModal(`The selected image size is ${ f.size/1000000 }MB, it must be less than 3MB`); 
        correctFile = false;
    }
    if (!f.type.includes('image')) {
        showModal(`The selected file type is ${ f.type }, it must be an image`); 
        correctFile = false;   
    }
    if (correctFile) reader.readAsDataURL(f);
    document.querySelector('.selectImg').classList.remove('pressed');
})

reader.onload = e => { 
    var image = new Image();  
    image.src = e.target.result;  
    src = e.target.result; 
    image.onload = function () {
        if (this.height!=this.width) {
            showModal('The selected image sides are not equal')
            return;
        }   
        restart(true);
        createSmallPieces();
        createBigPieces();        
    }
    
}

function restart(firstTime) {
    pieceSelected.selectedSmall=false;
    pieceSelected.selectedBig=false;
    pieceSelected.elementSmall=null;
    smallPieces = [];
    bigPiecesCont = 0;
    moves = 0;
    document.querySelector('.moves').innerHTML = moves;
    startTime = new Date().getTime();    
    clearInterval(intervalId);
    updateTime();
    for (const pieceContainer of document.querySelectorAll(".big-piece_container")) { 
        pieceContainer.removeEventListener('click', bigPieceListener);
    }
    for (const selected of document.querySelectorAll(".selected")) {  
        selected.classList.remove("selected");
        selected.parentElement.style.borderColor = 'none';                        
    }
    for (const pieceContainer of document.querySelectorAll(".big-piece_container")) {  
        pieceContainer.innerHTML = '';
    }
    for (const pieceContainer of document.querySelectorAll(".small-piece_container")) {  
        pieceContainer.innerHTML = '';
    }
    if(src != null && !firstTime) {
        createSmallPieces(src);
        createBigPieces(src);
    }
}

function updateTime() {
    intervalId = setInterval(function() {
        var now = new Date().getTime();
        var distance = now-startTime;
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        timeElement.innerHTML = minutes + "m " + seconds + "s ";
    }, 1000);
}

function gameFinish() {
    let win = true;
    let cont = 0;
    let pos;
    for (const pieceContainer of document.querySelectorAll(".big-piece_container")) {  
        pos = getClassNumber(pieceContainer.firstChild.className);
        if (cont!=pos) win = false;
        cont++;                
    }    
    if(win) { 
        showModal('Congratulations, you have won!')
        rotateImage();
    }
    else showModal('Too bad, you have lost!');
    clearInterval(intervalId);
    
}

function showModal(message) {
    let modal = document.querySelector('.modal')
    let modalMessage = document.querySelector('.modal-message');
    modal.style.display = 'grid';
    modalMessage.innerHTML = message;
}


function getClassNumber(pieceClassName) {
    let pos = 0
    for (let x in pieceClassName) {
        if ([0, 1, 2, 3, 4, 5, 6, 7, 8].includes(parseInt(pieceClassName[x]))) {
            pos = pieceClassName[x];
            break;
        }
    }
    return pos;
}


function rotateImage() {
    for (const piece of document.querySelectorAll(".piece")) {
        piece.classList.add('rotate');
    }    
}

document.querySelector('.selectImg').addEventListener('click', e => {
    e.currentTarget.classList.add('pressed');
});

document.querySelector('.return').addEventListener('click', e => {
    e.currentTarget.classList.add('pressed');
});

document.querySelector('.restart').addEventListener('click', e => restart(false));

document.querySelector('.accept').addEventListener('click', closeModal)
document.querySelector('.times').addEventListener('click', closeModal)

function closeModal() {
    document.querySelector('.modal').style.display = 'none';
}


