<script lang="ts">
 import { Status, Size } from './badge.type.ts';
  
 export let status: Status;
 export let size: Size;
</script>

<style>
 .badge {
     @apply rounded-2xl;
     @apply text-center;
     @apply px-3;
     @apply font-semibold;
     @apply py-0.5;
     @apply mx-1;
     @apply leading-none;
     @apply h-8;
     @apply inline-block;
     text-overflow: ellipsis;
     vertical-align: middle !important;
     @apply overflow-hidden;
 }

 .small {
     @apply text-xs;
     @apply h-6;
     @apply px-2;
     @apply py-1;
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

<span class="badge {size === Size.Default ? '' : 'small'} {status}">
    <slot />
</span>
