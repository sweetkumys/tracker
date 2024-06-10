<template>
    <div class="chart-container"> 
      <canvas id="expenseChart"></canvas> 
    </div>
  </template>
  
  <script>
  import { onMounted, ref, watch } from 'vue';
  import Chart from 'chart.js/auto'; 
  
  export default {
    props: {
      transactions: {
        type: Array,
        required: true
      }
    },
    setup(props) {
      const chartCanvas = ref(null);
      let expenseChart = null;
  
      const updateChartData = () => {
        const categoryData = {};
  
        props.transactions.forEach(transaction => {
          // Process expenses only (negative amounts)
          if (transaction.amount < 0) { 
            if (transaction.category in categoryData) {
              categoryData[transaction.category] += Math.abs(transaction.amount);
            } else {
              categoryData[transaction.category] = Math.abs(transaction.amount);
            }
          }
        });
  
        const chartData = {
          labels: Object.keys(categoryData),
          datasets: [{
            data: Object.values(categoryData),
            backgroundColor: [ 
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)'
            ]
          }]
        };
  
        if (expenseChart) {
          expenseChart.data = chartData; 
          expenseChart.update(); 
        } else {
          const ctx = chartCanvas.value.getContext('2d');
          expenseChart = new Chart(ctx, {
            type: 'pie', 
            data: chartData
          });
        }
      };
  
      onMounted(() => {
        chartCanvas.value = document.getElementById('expenseChart');
        updateChartData(); 
      });
  
      watch(() => props.transactions, updateChartData, { deep: true });
  
      return { chartCanvas }; 
    }
  };
  </script>