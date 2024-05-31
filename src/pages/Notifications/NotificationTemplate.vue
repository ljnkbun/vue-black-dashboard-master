<template>
  <div>
    {{ message }}
  </div>
</template>

<script>
export default {
  name: "notification-template",
  data() {
    return {
      message: String,

      // title: String,
    }
  }
};
</script>
