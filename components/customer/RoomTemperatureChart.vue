<template>
  <div>
    <canvas id="room-details-chart"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  props: {
    roomDetails: Array,
  },
  methods: {
    renderChart() {
      const ctx = document.getElementById('room-details-chart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.roomDetails.map(detail => detail.timestamp),
datasets: [
            {
              label: 'Room Temperature',
              data: this.roomDetails.map(detail => detail.roomTemperature),
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2
            },
            {
              label: 'AC Temperature',
              data: this.roomDetails.map(detail => detail.acTemperature),
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2
            },
            {
              label: 'AC Status',
              data: this.roomDetails.map(detail => detail.acIsOn ? 1 : 0),
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              fill: false,
              steppedLine: true // 显示为阶梯线（对于定类变量而言更容易理解）
            },
        {
              label: 'total consumption',
              data: this.roomDetails.map(detail => detail.consumption),
              borderColor: 'rgb(165,119,74)',
              borderWidth: 2,
              fill: false,
              steppedLine: true // 显示为阶梯线（对于定类变量而言更容易理解）
            },
            // 可以继续添加更多变量的数据集
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  },
  watch: {
    roomDetails: {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.$nextTick(() => {
            this.renderChart();
          });
        }
      },
      deep: true
    }
  }
};
</script>
