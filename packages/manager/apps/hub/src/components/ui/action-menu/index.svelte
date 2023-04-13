<script lang="ts">
 export let actions;

 let isOpen = false;

 const onDocumentClick = () => {
     document.removeEventListener('click', onDocumentClick);
     if (isOpen) {
         isOpen = false;
     }
 };
 
 const onClick = (e) => {
     document.removeEventListener('click', onDocumentClick);
     isOpen = !isOpen;
     if (isOpen) {
         e.stopPropagation();
         document.addEventListener('click', onDocumentClick);
     }
 };
</script>


<button id="dropdownMenuIconHorizontalButton"
        data-dropdown-toggle="dropdownDotsHorizontal"
        class="inline-flex items-center p-2 text-sm font-medium text-center text-primary-700 bg-white hover:bg-primary-100 focus:ring-4 focus:outline-none focus:ring-gray-50 rounded-full active:bg-primary-700 active:text-white border-2 border-primary-500"
        type="button"
        on:click={onClick}> 
    <svg class="w-4 h-4"
         aria-hidden="true"
         fill="currentColor"
         viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
    </svg>
</button>

<!-- Dropdown menu -->
<div id="dropdownDotsHorizontal"
     class="{isOpen ? 'block' : 'hidden'} z-10 bg-white rounded-md shadow w-auto absolute m-2">
    <ul class="py-2 text-sm text-gray-700" aria-labelledby="dropdownMenuIconHorizontalButton">
        {#each actions as action}
            <li>
                <a href={action.url} class="block px-4 py-2 hover:bg-primary-100">
                    {action.label}
                    {#if action.isExternal}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 inline ml-1">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                    {/if}
                </a>
                
            </li>
        {/each}
    </ul>
</div>
