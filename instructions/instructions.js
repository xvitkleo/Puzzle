let instructions = [
    ["1. Select an image", "./assets/instruction1.PNG"], 
    ["2. Click the piece you want to move", "./assets/instruction2.PNG"], 
    ["3. Select the square where <br> you want to leave the piece", "./assets/instruction3.PNG"]
];

var arrow = document.querySelector('.arrow');
let cont = 1;

arrow.addEventListener("click", function() {
    let slide = document.querySelector(".slide");
    slide.firstElementChild.remove();
    let slideContent = document.createElement('div');
    let p = document.createElement("p");
    slideContent.classList.add('slideContent')
    let figure = document.createElement("figure");
    let image = document.createElement("img");
    p.innerHTML=instructions[cont][0];
    image.src=instructions[cont][1];
    figure.appendChild(image);
    slideContent.appendChild(p);
    slideContent.appendChild(figure);
    slide.appendChild(slideContent);    
    cont++;
    if (cont > 2) cont = 0;
});