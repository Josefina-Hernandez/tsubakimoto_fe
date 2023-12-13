<template>
    <div>
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