const getDataColors = (opacity) => {
    const colors = [
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

    return colors.map((color) => (opacity ? `${color + opacity}` : color));
};

export const prepareConfigChart = (chartId, data) => {
    document.getElementById(chartId).parentNode.style.opacity = "1";
    const firstTenEntries = data.serie.filter((value, index) => index < 10),
        xLabels = firstTenEntries.map((ele) => ele.fecha.substring(0, 10)),
        yLabels = firstTenEntries.map((ele) => ele.valor);
    const tittle = "Historial 10 últimos cambios";

    const config = {
        type: "line",
        data: {
            labels: xLabels,
            datasets: [
                {
                    label: tittle,
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
    return config;
};

export const validate = (value) => {
    if (value === 0) {
        alert("Debe ingresar valores decimales mayores a 0");
    } else if (value === "") {
        alert("Debe ingresar un valor para convertir");
    } else if (value < 0) {
        alert("Debe ingresar solo valores decimales positivos mayores a 0");
    }
    return value > 0 && value != "";
};
