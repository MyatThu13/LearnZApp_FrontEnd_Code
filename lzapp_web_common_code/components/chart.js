import React, { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Chart(props) {
  const [isResize, setResize] = useState(moment().format("YYYYMMDDHHmmssmm"));

  function debounce(func) {
    var timer;
    return function (event) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(func, 100, event);
    };
  }

  useEffect(() => {
    window.addEventListener(
      "resize",
      debounce(function (e) {
        setResize(moment().format("YYYYMMDDHHmmssmm"));
      })
    );
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: false,
      title: {
        display: false,
        text: "",
      },
    },
  };

  const labels = props?.data?.labels
    ? props?.data?.labels
    : ["January", "February", "March", "April", "May", "June", "July"];
  const data = {
    labels,
    datasets: props?.data?.datasets
      ? props?.data?.datasets
      : [
          {
            label: "Dataset 1",
            data: [10, 38, 54, 13, 100, 35, 84],
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
  };

  return <Line key={isResize} options={options} data={data} />;
}

export default Chart;
