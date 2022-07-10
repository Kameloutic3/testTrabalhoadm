

const buttonsReady = document.querySelectorAll(".ready");

buttonsReady.forEach((btn, index) =>{

    btn.onclick = function(event){
        let resp = checkInputs(index);
        
        cleanError(index);

        if(resp.checked){
            let result = calculate(...resp.values, resp.type);
            viewResult(result, resp.type);
        }
        else{
            error("Preencha o campo!", index);
        }
    }
})

function error(message, index){
    let type = index == 0 ? ".vp" : ".vf";
    const inputs = document.querySelectorAll(type);
    for(let input of inputs){
        if(input.value !== "") continue;
        const div = document.createElement("div");
        div.innerHTML = `<p class="p--error" data-id=${index}> <mark class="error">${message}</mark></p>`;
        input.parentNode.insertBefore(div, input.nextSibling);
    }
}

function cleanError(index){
    const errors = document.querySelectorAll(".p--error");
    errors.forEach((element) => {
        let id = element.getAttribute("data-id");
        if(parseInt(id) == index){
            element.remove();
        }
    });
}

function checkInputs(index){
    let type = index == 0 ? ".vp" : ".vf";

    const inputs = document.querySelectorAll(type);

    const listCheck = [];

    for(let input of inputs){
        listCheck.push(input.value);
    }

    return {
        values: listCheck.map((value) => Number(value)),
        checked: listCheck.every((value) => value !== ''),
        type: type
    }
}

function calculate(value, tax, time, type){
    if(type === ".vf") return value * (1 + (tax / 100)) ** time;
    return value / (1 + (tax / 100)) ** time;
}

function viewResult(result, type){
    let className = `.calculation--result--${type.replace(".", "")}`;
    const area = document.querySelector(className);
    const view = area.querySelector("input");
    area.setAttribute("style", "display: block;");
    view.setAttribute("value", `R$ ${result.toFixed(2)}`);
}

const buttonsClean = document.querySelectorAll(".clean");

buttonsClean.forEach((btn, index)=>{
    btn.onclick = function(event){
        cleanError(index);
        cleanInputs(index);
    }
})

function cleanInputs(index){
    let type = index == 0 ? ".vp" : ".vf";
    let className = `.calculation--result--${type.replace(".", "")}`;
    const area = document.querySelector(className);
    const inputs = document.querySelectorAll(type);
    inputs.forEach((input) => input.value = "");
    area.setAttribute("style", "display: none;");
}

const buttonSecondCalculation = document.querySelector(".second--ready");

buttonSecondCalculation.onclick = function(){
    let resp = checkSecondInputs();
    secondClearError();

    if(resp.checked){
        secondCalculate(resp.values, resp.tax);
    }else{
        secondError("Preencha o campo!");
    }
}

function checkSecondInputs(){
    const inputs = Array.from(document.querySelectorAll(".second--calculation--input"));
    let checked = inputs.map((input) => input.value).every((value) => value !== "");
    const values = inputs.map((input) => input.value);

    return {
        checked,
        values: values[0].split(";").map((x) => Number(x)),
        tax: values[1]
    }
}

function secondError(message){
    const inputs = document.querySelectorAll(".second--calculation--input");
    for(let input of inputs){
        if(input.value !== "") continue;
        console.log(input)
        const div = document.createElement("div");
        div.innerHTML = `<p class="p--second--error"> <mark class="error">${message}</mark></p>`;
        input.parentNode.insertBefore(div, input.nextSibling);
    }
}

function secondClearError(){
    const errors = document.querySelectorAll(".p--second--error");
    errors.forEach((x) => x.remove());
}

function secondCalculate(values, tax){;
    let html = `
        <tr>
            <th>Ano</th>
            <th>FC</th>
            <th>Operação</th>
            <th>VP (FC)</th>
            <th>Saldo</th>
        </tr>
    `;
    let previous = 0;
    for(let i = 0 ; i < values.length ; i++){
        let result = values[i] / (1 + (tax/100)) ** i;
        previous = previous + result;
        console.log(result)

        html +=
            `
                <tr>
                    <td>${i}</td>
                    <td>${values[i]}</td>
                    <td>${values[i]} ÷ (1 + ${tax/100})<sup>${i} </sup></td>
                    <td>${result.toFixed(2)}</td>
                    <td>${previous.toFixed(2)}</td>
                </tr>
            `;
    }

    document.querySelector(".second-table").innerHTML = html;
}

const buttonClean = document.querySelector(".second--clean");


buttonClean.onclick = function(){
    const inputs = document.querySelectorAll(".second--calculation--input");
    inputs.forEach((input) => input.value = "");
    document.querySelector(".second-table").innerHTML = "";
    secondClearError();
}

// third 

const thirdButton = document.querySelector(".third-btn-calcular");

thirdButton.addEventListener("click", function(){

    let resp = checkInputsThird();

    if(resp.checked){
        thirdCalculate(resp.values);
    }


});


function checkInputsThird(){
    const inputs = Array.from(document.querySelectorAll(".third-calculation--input"));
    let checked = inputs.map((input) => input.value).every((x) => x != "");
    const values = inputs.map((input) => input.value);
    return {
        checked,
        values: values[0].split(";").map((x) => Number(x))
    }
}

function thirdCalculate(values){
    let html = ``;

    let help = 0;
    let tir = 0.0;

    do{
        help = 0;
        tir += 0.01;
        html = `
            <tr>
                <th>Anos</th>
                <th>Operação</th>
                <th>Resultado</th>
            </tr>
        `;

        for(let i = 0 ; i < values.length ; i++){
            help += values[i] / (1 + (tir/100)) ** i;
            html +=
                `
                    <tr>
                        <td>${i}</td>
                        <td>${values[i]} / (1 + ${(tir/100).toFixed(2)})<sup>${i}</sup></td>
                        <td>${(values[i] / (1 + (tir/100)) ** i).toFixed(2)}</td>
                    </tr>
                `;

        }
       

    }while(help > 0);

    html += `
        <tr>
           <td colspan="3">TIR: ${tir.toFixed(2)}</td>
        </tr>
    `

    document.querySelector(".third-table").innerHTML = html;
  
}

document.querySelector(".third-btn-clean").addEventListener("click", function(){
    const inputs = document.querySelectorAll(".third-calculation--input");
    inputs.forEach((input) => input.value = "");
    document.querySelector(".third-result").innerHTML = "";
});



// fourfh


document.querySelector(".fourth-btn-calc").addEventListener("click", function(){

    let resp = checkFourfh();

    if(resp.checked){
        fourfhCalculate(resp.values, resp.tax);
    }

});

function checkFourfh(){
    const inputs = Array.from(document.querySelectorAll(".fourth-calculation--input"));
    const values = inputs.map((x) => x.value);
    let checked = values.every((x) => x !== "");
    console.log(checked);
    return {
        checked,
        values: values[0].split(";").map((x) => Number(x)),
        tax: Number(values[1])
    }
}

function fourfhCalculate(values, tax){
    let html = `
        <tr>
            <th>Anos</th>
            <th>R$</th>
            <th>Operação</th>
            <th>Resultado</th>
            <th>Saldo</th>
            <th>Payback</th>
        </tr>
    `;

    let current = 0;
    let previous = 0;
    let isBiggerZero = false;
    let time = 0;
    const POINT_END = 0;

    for(let i = 0 ; i < values.length ; i++){
        let result = values[i] / (1 + (tax/100)) ** i;
        previous = current;
        current = current + result;


        if(current > POINT_END && !isBiggerZero){
            time = (i - 1) + (((-1) * previous)/result);
            isBiggerZero = true;
            html +=
                `
                    <tr>
                        <td>${i}</td>
                        <td>${values[i]}</td>
                        <td>${values[i]} ÷ (1 + ${tax/100})<sup>${i} </sup></td>
                        <td>${result.toFixed(2)}</td>
                        <td>${current.toFixed(2)}</td>
                        <td class="pay-success">OK!</td>
                    </tr>
                `;
            continue;
        }

        html +=
            `
                <tr>
                    <td>${i}</td>
                    <td>${values[i]}</td>
                    <td>${values[i]} ÷ (1 + ${tax/100})<sup>${i} </sup></td>
                    <td>${result.toFixed(2)}</td>
                    <td>${current.toFixed(2)}</td>
                    <td class="pay-error"></td>
                </tr>
            `;
    }

    html += `
    
        <tr>    
            <td colspan="6" class="pay-end"> PAYBACK = ${time.toFixed(2)}</td>
        </tr>
    
    `
    document.querySelector(".fourfh-result").innerHTML = html;
}

document.querySelector(".fourth-btn-del").addEventListener("click", function(){
    const inputs = document.querySelectorAll(".fourth-calculation--input");
    inputs.forEach((x) => x.value = "");
    document.querySelector(".fourfh-result").innerHTML = "";
});