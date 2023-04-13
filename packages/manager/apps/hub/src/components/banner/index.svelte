<script lang="ts">
 export let locale: string = 'en_GB';
 let banner; 

 async function fetchBanner() {
     const res = await fetch(`/engine/2api/banner?locale=${locale}`);
     if (res.ok) {
         return res.json();
     }

     return null;
 }
</script>


{#await fetchBanner()}
   
{:then banner}
    {#if banner}
        <a target="_blank" rel="noreferrer"
           data-track-on="click"
           data-track-name={banner.tracker} data-track-click="action"
           href={banner.link}>
            <!-- 
                 <img class="d-md-none w-100 h-100"
                 src={banner.images.responsive.src}
                 alt={banner.alt}
                 width={banner.images.responsive.width}
                 height={banner.images.responsive.height} />
            -->
            <img class="d-none d-md-block w-full h-100"
                 src={banner.images.default.src}
                 alt={banner.alt}
                 width={banner.images.default.width}
                 height={banner.images.default.height} />
        </a>
    {/if}
    {:catch error}
    <p>Error loading banner: {error.message}</p>
{/await}
