const calc = ( function(){
    const add = (a, b) => a + b;
    const sub = (a, b) => a - b;
    const div = (a, b) => a / b;
    const mul = (a, b) => a * b;

    return { add, sub, div, mul };
})();


const events =  function(){
    const buttons = document.querySelectorAll(".btn");
    const display = document.querySelector(".display");
    let oper = "", number = "";


    function operate() {
        const number2 = display.innerHTML.split("+")[1] ||
            display.innerHTML.split("*")[1] ||
            display.innerHTML.split("/")[1] ||
            display.innerHTML.split("-")[1] || display.innerHTML;
        console.log(number2);
        console.log(`Executing ${oper} with ${number} and ${number2}`);
        if(oper === "+")
            display.innerHTML = calc.add(Number(number), Number(number2));
        else if(oper === "-")
            display.innerHTML = calc.sub(Number(number), Number(number2));
        else if(oper === "*")
            display.innerHTML = calc.mul(Number(number), Number(number2));
        else if(oper === "/")
            display.innerHTML = calc.div(Number(number), Number(number2));
        oper = "";
        number = number2;
    }

    buttons.forEach( (btn) => {
        btn.addEventListener("click", () => {
            if(btn.classList.contains("gold")){
                if(oper)
                    operate();
                else{
                    oper = btn.innerHTML;
                    number = display.innerHTML;
                    display.innerHTML += `${oper}`;
                }
            }
            else if(btn.classList.contains("reset")){
                number = ""; oper = ""; display.innerHTML = "";
            }
            else if(btn.classList.contains("equal")){
                if(oper)
                    operate();
            }
            else{
                display.innerHTML += btn.innerHTML;
            }
        });
    });
};

events();