/////////////////////handle the movement of bomb///////////////////////////////////////
let fallDown = function(bomb, top, left) {
    let id = setInterval(function() {
        top += 6;
        if (top < (innerHeight - bomb.height)) {
            
            bomb.style.top = top + "px";
            bomb.style.left=left+'px';
        } else {
            clearInterval(id);
            bomb.remove();
        }
    }, 50);
}


function getDistanceBetweenElements(a, b) {
    const aPosition = getPositionAtCenter(a);
    const bPosition = getPositionAtCenter(b);
    return Math.sqrt(
        Math.pow(aPosition.x - bPosition.x, 2) +
        Math.pow(aPosition.y - bPosition.y, 2)
    );
}

function getPositionAtCenter(element) {
    const { top, left, width, height } = element.getBoundingClientRect();
    return {
        x: left + width / 2,
        y: top + height / 2,
    };
}

/////////////////fade out killed bird and exploded bomb////////////////////////////////////
function fadeOut(imageObject) {
    let op = 1;  // initial opacity
    let id= setInterval(function () {
        if (op <= 0.1){
            clearInterval(id);
        }
        imageObject.style.opacity = op;
        op -= 0.1;
    }, 100);
}