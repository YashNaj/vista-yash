<script lang="ts">
  export let data;
  import Post from "$lib/components/Post.svelte";
  import DataTable from "./user-data-table.svelte";
  import AddUser from "./form-sheet-user-add.svelte";
</script>

<div class="w-full h-screen pt-20 pb-10 md:px-10 px-6">
  <h1 class="md:text-4xl text-3xl text-blue-950 font-bold pb-3">
    Welcome, Martin!
  </h1>

  <div class="wrapper wrapper__0 flex md:flex-row flex-col h-[calc(100%-6rem)]">
    <div
      class="flex-1 md:mr-[.2rem] mb-[1rem] flex flex-col h-full md:pr-2 px-2 rounded border border-black border-opacity-10"
    >
      <div class="container_section_heading flex justify-between">
        <h2 class="text-blue-950 text-2xl font-bold sticky top-0 py-2">
          Users
        </h2>
        <div class="btn-wrapper w-fit h-full py-2 rounded">
          <AddUser data={data.addForm} />
        </div>
      </div>
      <div class="flex-1 overflow-y-auto">
        <DataTable data={data.users} />
      </div>
    </div>
    <div
      class="flex-1 md:ml-[.2rem] mb-[1rem] flex flex-col h-full md:pr-2 px-2 rounded border border-black border-opacity-10"
    >
      <h2 class="text-blue-950 text-2xl font-bold md:pb-0 py-2">Posts</h2>
      <div class="flex-1 w-full h-auto overflow-y-auto">
        {#each data.posts as post}
          <Post {post} />
        {/each}
      </div>
    </div>
  </div>
</div>
