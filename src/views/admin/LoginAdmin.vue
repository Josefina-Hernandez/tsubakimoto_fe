<template>
  <div class="home">
    <LoginFormAdmin />
  </div>
</template>
  
<script>
  // @ is an alias to /src
    import LoginFormAdmin from '@/components/admin/LoginFormAdmin.vue'
    
    export default {
        name: 'LoginAdmin',
        components: {
          LoginFormAdmin,
        }
    }
</script>