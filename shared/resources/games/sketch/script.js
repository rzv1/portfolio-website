
function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    display.setSize(form.size.value);
    display.generate();
    console.log("Done!");
}


const display = ( function(){
    const grid = document.querySelector(".grid");
    const colorButtons = document.querySelectorAll(".color-pallete .color");
    const resetBtn = document.querySelector("#reset");
    let color = "";
    let isMouseDown = false;

    resetBtn.addEventListener("click", () => {
        generate();
    })

    colorButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            colorButtons.forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            if(btn.classList.contains("eraser")){
                setRatio(1);
                color = "rgb(250, 235, 215)";
            }
            else{
                setRatio(0.3);
                color = getComputedStyle(btn).backgroundColor;
            }
        })
    })

    let size = 16;
    const getSize = () => size;
    let setSize = (newSize) => size = newSize;

    let ratio = 0.3;
    const getRatio = () => ratio;
    let setRatio = (newRatio) => ratio = newRatio;

    function parseRGB(rgbString) {
        const [r, g, b] = rgbString.match(/\d+/g).map(Number);
        return { r, g, b };
    }

    function mixColors(c1, c2, ratio) {
        const r = Math.round(c1.r * (1 - ratio) + c2.r * ratio);
        const g = Math.round(c1.g * (1 - ratio) + c2.g * ratio);
        const b = Math.round(c1.b * (1 - ratio) + c2.b * ratio);
        return `rgb(${r}, ${g}, ${b})`;
    }

    function gapEval(s) {
        if(s >= 80)
            return 0;
        return Math.floor(20 / s * 10) / 10;
    }

    const paint = (div) => {
        if(color){
            const cellColor = div.style.backgroundColor;
            div.style.backgroundColor = mixColors(parseRGB(cellColor),
                parseRGB(color), getRatio());
        }
    }

    const generate = () => {
        grid.innerHTML = "";
        grid.style.gridTemplate = `repeat(${size}, 1fr) / repeat(${size}, 1fr)`;
        grid.style.gap = `${gapEval(size)}px`;

        for(let i = 0; i < size * size; i++){
            let div = document.createElement("div");
            div.style.backgroundColor = "rgb(250, 235, 215";
            div.addEventListener("mouseover", () => {
                if(isMouseDown)
                    paint(div);
            })
            div.addEventListener("mousedown", () => {
                paint(div);
            })
            grid.appendChild(div);
        }

        document.addEventListener("mousedown", () => isMouseDown = true);
        document.addEventListener("mouseup", () => isMouseDown = false);
    }

    return { generate, setSize };
})();

display.generate();