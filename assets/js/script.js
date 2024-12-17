import { prepareConfigChart } from "../utilities/helpers.js";
import { validate } from "../utilities/helpers.js";

const API = "https://mindicador.cl/api/"

//Selectores
const selectBox = document.getElementById("select_box"),
 inputBox = document.getElementById("input_box"),
 converterBtn = document.getElementById("converter_btn"),
 converterResult = document.getElementById("result");

const getValues = async (indicator = "") => {
    try {
        const options = {
            method: "GET"
        },
        res = await fetch(`${API}${indicator}` , options);
        return res.ok ? await res.json() : alert("Recursos no disponibles")
    } catch (error) {
        return error.message;
    }
};

const fillSelectBox = async () => {
    const values = await getValues();
    if(values) {
        let html = "";
        Array.from(Object.entries(values)).forEach((value) => {
            if (
                value[1].codigo === undefined ||
                value[1].codigo === "tpm" ||
                value[1].codigo === "tasa_desempleo"
            ) {
                console.log(`Indicador ${value[1].codigo} ignorado`);
            } else {
                html += `<option value="${value[1].codigo}">${value[1].nombre}</option>`;
            }
        });
        selectBox.innerHTML = html;
    }
};

const renderChart = async (indicator) => {
    const data = await getValues(indicator),
    chartStatus = Chart.getChart("chart");
    chartStatus != undefined ? chartStatus.destroy() : false;
    Chart.defaults.color = "#d6ff00";
    new Chart("chart", prepareConfigChart("chart", data));
};

const getResults = async (_from, _to) => {
    const values = await getValues(),
     formatResult = (_from / values[`${_to}`].valor).toFixed(2);
    let symbol = "$";
    if (_to === "euro") {
        symbol = "€";;
    } else if (_to === "bitcoin") {
        symbol = "₿";
    }
    converterResult.innerHTML = `<span>${symbol} ${formatResult.replace(".", ",")}</span>`
};

fillSelectBox();
converterBtn.addEventListener("click", () => {
  validate(Number(inputBox.value))
    ? getResults(Number(inputBox.value), selectBox.value) &&
      renderChart(selectBox.value)
    : "";
});

document.addEventListener("keydown", (e) => {
  e.key === "Enter"
    ? inputBox.value != ""
      ? getResults(Number(inputBox.value), selectBox.value) &&
        renderChart(selectBox.value)
      : alert("Debe ingresar un monto para convertir")
    : "";
});
