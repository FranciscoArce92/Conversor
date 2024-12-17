// Obtener colores con o sin opacidad
const getDataColors = (opacity) => {
  const baseColors = [
    "#7448c2",
    "#21c0d7",
    "#d99e2b",
    "#cd3a81",
    "#9c99cc",
    "#e14eca",
    "#ffffff",
    "#ff0000",
    "#d6ff00",
  ];

  return baseColors.map((color) => {
    if (opacity) {
      // Agregar opacidad a los colores en formato válido
      const alpha = Math.min(Math.max(opacity / 100, 0), 1); //Limitar entre 0 y 1
      return (
        color +
        Math.round(alpha * 255)
          .toString(16)
          .padStart(2, "0")
      );
    }
    return color;
  });
};

//Preparar configuración del gráfico
export const prepareConfigChart = (chartId, data) => {
  const chartElement = document.getElementById(chartId);
  if (!chartElement) {
    console.error(`Elemento con ID '${chartId}' no encontrado.`);
    return null;
  }

  // Asegurar visibilidad del contenedor
  chartElement.parentNode.style.opacity = "1";

  // Obtener los últimos 10 datos
  const firstTenEntries = data?.serie?.slice(0, 10) || [];
  const xLabels = firstTenEntries.map((entry) => entry.fecha.substring(0, 10));
  const yLabels = firstTenEntries.map((entry) => entry.valor);

  // Configuración del gráfico
  return {
    type: "line",
    data: {
      labels: xLabels,
      datasets: [
        {
          label: "Historial 10 últimos cambios",
          data: yLabels,
          backgroundColor: getDataColors(40)[6],
          borderColor: getDataColors()[8],
          pointBorderColor: getDataColors()[6],
          fill: true,
          borderWidth: 2,
          pointBorderWidth: 5,
          tension: 0.2,
        },
      ],
    },
    options: {
      scales: {
        x: {
          ticks: {
            color: getDataColors()[8],
          },
        },
      },
    },
  };
};

// Validar valores de entrada
export const validate = (value) => {
  if (typeof value !== "number" || isNaN(value)) {
    alert("Debe ingresar un número válido.");
    return false;
  }
  if (value <= 0) {
    alert("Debe ingresar valores decimales mayores a 0.");
    return false;
  }
  return true;
};
