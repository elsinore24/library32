<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';

  onMount(() => {
    // Redirect to the new location
    goto(`${base}/rooms/library`);
  });
</script>

<!-- Empty content since we're redirecting -->
