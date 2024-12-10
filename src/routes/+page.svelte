<script lang="ts">
  export let data;
  import Post from "$lib/components/Post.svelte";
  import DataTable from "./user-data-table.svelte";
  console.log(data);
</script>

<div class="w-full h-screen pt-20 pb-10 md:px-10 px-6">
  <h1 class="md:text-4xl text-3xl text-blue-950 font-bold">Welcome, Martin!</h1>

  <div class="wrapper wrapper__0 flex md:flex-row flex-col h-[calc(100%-6rem)]">
    <div class="flex-1 flex flex-col h-full md:pr-2">
      <div class="container_section_heading">
        <h2 class="text-blue-950 text-2xl font-bold sticky top-0 pb-2">
          Users
        </h2>
        <div class="btn-wrapper flex w-full justify-end"></div>
      </div>
      <div class="flex-1 overflow-y-auto">
        <DataTable data={data.users} />
      </div>
    </div>
    <div class="flex-1 flex flex-col h-full">
      <h2 class="text-blue-950 text-2xl font-bold md:text-right md:pb-0 pb-2">
        Posts
      </h2>
      <div class="flex-1 overflow-y-auto">
        {#each data.posts as post}
          <Post {post} />
        {/each}
      </div>
    </div>
  </div>
</div>
