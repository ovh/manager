<script lang="ts">
 import { page } from '$app/stores';
 //import Message from '$components/Message.svelte';
</script>

<!--
<Message type="error">{$page.error.message}</Message>
-->
<div>{$page.error.message}</div>
