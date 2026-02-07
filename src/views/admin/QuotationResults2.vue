<template>
    <div class="date-picker-container">
      <DatePicker v-model="selectedDate" />
    </div>
  </template>

  <script>
  import DatePicker from 'vue3-datepicker';
  export default {
    data() {
      return {
        selectedDate: null
      };
    },

    components: {
        DatePicker,
    }
  }
  </script>

  <style scoped lang="less">
    .date-picker-container {
      padding: 20px;
    }

    /* 移动端适配 */
    @media (max-width: 768px) {
      .date-picker-container {
        padding: 60px 15px 15px;
      }
    }

    @media (max-width: 480px) {
      .date-picker-container {
        padding: 55px 10px 10px;
      }
    }
  </style>