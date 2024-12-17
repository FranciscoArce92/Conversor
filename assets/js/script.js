import { prepareConfigChart } from "../utilities/helpers.js";
import { validate } from "../utilities/helpers.js";

const API = "https://mindicador.cl/api/"

//Selectores
const selectBox = document.getElementById("select_box"),
 inputBox = document.getElementById("input_box"),
 converterBtn = document.getElementById("converter_btn"),
 converterResult = document.getElementById("result");

// Función auxiliar para mostrar errores 
const showError = (message) => alert(message || "Ocurrió un error inesperado");

// Obtener los datos desde la API
const getValues = async (indicator = "") => {
    try {
        const response = await fetch(`${API}${indicator}`, { method: "GET" });
        if (!response.ok) throw new Error("Recursos no disponibles");
        return await response.json();
    } catch (error) {
        showError(error.message);
        return null;
    }
};

// Llenar el select con los indicadores
const fillSelectBox = async () => {
    const values = await getValues();
    if (!values) return;

    const optionsHTML = Object.entries(values)
     .filter(
        ([, value]) =>
            value.codigo && value.codigo !== "tpm" && value.codigo !== "tasa_desempleo"
     )
     .map(
        ([, value]) => 
            `<option value="${value.codigo}">${value.nombre}</option>`
     )
     .join("");
    
     selectBox.innerHTML = optionsHTML;
}

//Renderizar el gráfico
const renderChart = async (indicator) => {
    const data = await getValues(indicator);
    if (!data) return;

    const chartInstance = Chart.getChart("chart");
    if (chartInstance) chartInstance.destroy();

    Chart.defaults.color = "#d6ff00";
    new Chart("chart", prepareConfigChart("chart", data));
};

// Calcular y mostrar el resultado de conversión
const getResults = async (amount, toCurrency) => {
    const values = await getValues();
    if (!values) return;

    const conversionRate = values[toCurrency]?.valor;
    if (!conversionRate) {
        showError("No se encontró la tasa de cambio para la moneda seleccionada");
        return;
    }

    const formattedResult = (amount / conversionRate).toFixed(2);
    const symbol = 
     toCurrency === "euro" ? "€" : toCurrency === "bitcoin" ? "₿" : "$";

    converterResult.innerHTML = `<span>${symbol} ${formattedResult.replace( ".", ",")}</span>`;
};

//Inicializar select box
fillSelectBox();

//Event listener: Conversión al hacer click en el botón
converterBtn.addEventListener("click", () => {
    const amount = Number(inputBox.value);
    if (validate(amount)) {
        getResults(amount, selectBox.value);
        renderChart(selectBox.value)
    } else {
        showError("Debe ingresar un monto válido para hacer la conversión");
    }
});

// Event listener: Conversión al presionar Enter
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const amount = Number(inputBox.value);
    if (amount) {
        getResults(amount, selectBox.value);
        renderChart(selectBox.value);
    } else {
        showError("Debe ingresar un monto válido para hacer la conversión")
    }
  }
});
