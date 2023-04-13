<script lang="ts">
 import { Status, Size } from './badge.type.ts';
  
 export let status: Status;
 export let size: Size;
</script>

<style>
 .badge {
     @apply rounded-2xl;
     @apply text-center;
     @apply px-2;
     @apply font-semibold;
     @apply mx-1;
     @apply leading-none;
     text-overflow: ellipsis;
     vertical-align: middle !important;
 }
 .info {
     background: #BEF1FF 0% 0% no-repeat padding-box;
 }
 .success {
     background: #D2F2C2 0% 0% no-repeat padding-box;
     color: #268403;
 }
 .warning {
     background: #FEEA86 0% 0% no-repeat padding-box;
     color: #8b6111;
 }
 .error {
     background: #FFCCD9 0% 0% no-repeat padding-box;
 }
</style>

<span class="badge {size === Size.Default ? '' : 'text-sm'} {status}">
    <slot />
</span>
