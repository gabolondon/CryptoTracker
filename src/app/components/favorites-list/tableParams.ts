export const tableParams = {
  dataSet: {
    backgroundColor: '#2968ce23',
    borderColor: '#2968ce',
    pointBackgroundColor: '#ff4080',
    pointBorderColor: '#ff4080ee',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: '#2968ce22',
    fill: 'origin',
  },
  lineChartOptions: {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      y: {
        position: 'left',
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(145, 158, 171, 1)',
          font: {
            weight: 'bold',
            size: 12,
            family: 'Roboto',
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(145, 158, 171, 1)',
          font: {
            size: 12,
            family: 'Roboto',
          },
        },
      },
    },

    plugins: {
      legend: { display: false },
    },
  },
};

export interface ChartDataset {
  data: number[];
  label: string;
  backgroundColor: string;
  borderColor: string;
  pointBackgroundColor: string;
  pointBorderColor: string;
  pointHoverBackgroundColor: string;
  pointHoverBorderColor: string;
  fill: string;
}
