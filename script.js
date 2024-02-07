
const kennedy = document.querySelector('.kennedy');
const lacey = document.querySelector('.lacey');
const canalForm = document.getElementById('canalForm');
const table_body = document.getElementById('table_body');
const resultElement = document.getElementById('result');

kennedy.addEventListener('click', ()=>{
    // alert("Hello kenendy");
    lacey.classList.remove('active');
    kennedy.classList.add('active');
    canalForm.innerHTML = `<div class="mb-3" style="width: 100%">
                    <label for="design_discharge" class="form-label">Design Discharge Q (m3/s)</label>
                    <input type="number" min="1" step="10" class="form-control" style="border: 1px solid black;" id="design_discharge" required>
                </div>
                <div class="mb-3" style="width: 100%">
                    <label for="bed_slope" class="form-label">Bed slope of canal</label>
                    <input type="text" class="form-control" style="border: 1px solid black;" id="bed_slope" required>
                </div>

                <button type="button" onclick="calculateDepth()">Calculate</button>`
})
lacey.addEventListener('click', ()=>{
    // alert("Hello lacey")
    resultElement.innerHTML = ``;
    lacey.classList.add('active');
    kennedy.classList.remove('active');
    canalForm.innerHTML = `<div class="mb-3" style="width: 100%">
    <label for="design_discharge" class="form-label">Dia of silt particle(mm)</label>
    <input type="number" min="1" class="form-control" style="border: 1px solid black;" id="silt_dia" required>
  </div>
<div class="mb-3" style="width: 100%">
    <label for="design_discharge" class="form-label">Design Discharge Q (m3/s)</label>
    <input type="number" min="1" step="10" class="form-control" style="border: 1px solid black;" id="lacey_discharge" required>
  </div>

<button type="button" onclick="calculateData()">Calculate</button>`;
})



function criticalVelocity(depth){
    return 0.55*1.1*(depth**0.64);
}

function meanVelocity(n, s, r){
    // console.log(n,s,r);
    // let s1 = parseFloat(s.toFixed(3));
    // console.log(s1)
    return ((23 + 1/n + 0.00155/s)*Math.sqrt(r*s))/(1+((23+0.00155/s)*(n/Math.sqrt(r))));
}

function area(canal_width, depth){
    return (canal_width*depth + 0.5*(depth**2));
}

function perimeter(canal_width, depth){
    return (parseFloat(canal_width) + parseFloat((Math.sqrt(5)*depth).toFixed(3)));
}

function canalWidth(canal_area, depth){
    return (((2*canal_area)/depth)-depth)/2;
}

function procedure(depth, bed_slope_val, tolerance = 0.01){
    let initialdepth = depth;
    const result_table = document.querySelector(".result_table");
    const discharge = document.getElementById('design_discharge').value;
    do{
        let vc = criticalVelocity(depth);
        console.log(vc);
        let canal_area = 53/vc;
        let canal_width = canalWidth(canal_area, depth);
        console.log(canal_area);
        let canal_perimeter = perimeter(canal_width, depth);
        let R = canal_area/canal_perimeter;
        console.log(R)
        let mean_velocity = meanVelocity(0.023, bed_slope_val, R);

        if (Math.abs(vc - mean_velocity) < tolerance) {
            console.log("Reached desired velocity.");
            resultElement.innerHTML += `<p style="background-color: #edb415;">Mean velocity: <span style="color:green;">${mean_velocity.toFixed(3)}m/s</span>, Critical velocity: <span style="color:green;">${vc.toFixed(3)}m/s</span>, Depth: ${depth.toFixed(2)}m </p>`;
            table_body.innerHTML = ``;
            table_body.innerHTML += `<tr><td>Bed Slope: ${bed_slope_val}.</td></tr>`;
            table_body.innerHTML += `<tr><td>Side Slope: 0.5H:1V.</td></tr>`;
            table_body.innerHTML += `<tr><td>Depth: ${depth.toFixed(3)}.</td></tr>`;
            table_body.innerHTML += `<tr><td>Mean Velocity: ${mean_velocity.toFixed(3)}.</td></tr>`;
            table_body.innerHTML += `<tr><td>Critical Velocity: ${vc.toFixed(3)}.</td></tr>`;
            table_body.innerHTML += `<tr><td>R: ${R.toFixed(3)}.</td></tr>`;
            table_body.innerHTML += `<tr><td>Discharge: ${discharge}.</td></tr>`;
            // result_table.style.display == "block";
            return depth;
        } else {
            let step = Math.abs(vc - mean_velocity) * 0.1; // Adjust the multiplier as needed
            step = Math.min(step, 0.1); // Limit the step size to a maximum of 0.1 meters

            if (vc > mean_velocity) {
                resultElement.innerHTML += `<p>Mean velocity: <span style="color:red;">${mean_velocity.toFixed(3)}m/s</span>, Critical velocity: <span style="color:red;">${vc.toFixed(3)}m/s</span>, Depth: ${depth.toFixed(2)}m </p>`;
                console.log("Adjust depth upwards.");
                depth += step;
            } else {
                resultElement.innerHTML += `<p>Mean velocity: <span style="color:red;">${mean_velocity.toFixed(3)}m/s</span>, Critical velocity: <span style="color:red;">${vc.toFixed(3)}m/s</span>, Depth: ${depth.toFixed(2)}m </p>`;
                console.log("Adjust depth downwards.");
                depth -= step;
            }
        }
    }while (true);

}

function calculateDepth() {
    const discharge = document.getElementById('design_discharge').value;
    const resultElement = document.getElementById('result');
    const table_body = document.getElementById('table_body');
    const bed_slope = document.getElementById('bed_slope').value;
    resultElement.innerHTML = "";
    const bed_slope_ver = parseFloat(bed_slope.split("/")[0]);
    const bed_slope_hor = parseFloat(bed_slope.split("/")[1]);
    const bed_slope_val = bed_slope_ver/bed_slope_hor;
    discharge_int = parseInt(discharge);
    console.log(discharge_int);
    if(discharge_int<20){
        let depth = 0.2;
        let result = procedure(depth, bed_slope_val);
        console.log(result);
    }else if(discharge_int>20 && discharge_int<40){
        let depth = 0.8;
        let result = procedure(depth, bed_slope_val);
        console.log(result);
    }else if(discharge_int>40 && discharge_int<80){
        let depth = 0.8;
        let result = procedure(depth, bed_slope_val);
        console.log(result);
    }else if(discharge_int>80 && discharge_int<100){
        let depth = 0.2;
        let result = procedure(depth, bed_slope_val);
        console.log(result);
    }else{
        let depth = 0.2;
        let result = procedure(depth, bed_slope_val);
        console.log(result);
    }
}

function calculateData(){
    const silt_dia = document.getElementById('silt_dia').value;
    const lacey_discharge = document.getElementById('lacey_discharge').value;
    
    let f = 1.76*Math.sqrt(silt_dia);
    let v = ((lacey_discharge*(f**2))/140);
    let a = lacey_discharge/v;
    let p = 4.75*Math.sqrt(lacey_discharge);
    let r = a/p;
    let s = (f**(5/3))/(3340*(lacey_discharge**(1/6)));
    table_body.innerHTML = ``;
    table_body.innerHTML += `<tr><td>Silt Factor: ${f}.</td></tr>`;
    table_body.innerHTML += `<tr><td>Area: ${a.toFixed(3)}.</td></tr>`;
    table_body.innerHTML += `<tr><td>Perimeter: ${p.toFixed(3)}.</td></tr>`;
    table_body.innerHTML += `<tr><td>R: ${p.toFixed(3)}.</td></tr>`;
    table_body.innerHTML += `<tr><td>Critical Velocity: ${v.toFixed(3)}.</td></tr>`;
    table_body.innerHTML += `<tr><td>Slope: ${s.toFixed(3)}.</td></tr>`;
    table_body.innerHTML += `<tr><td>Discharge: ${lacey_discharge}.</td></tr>`;
}