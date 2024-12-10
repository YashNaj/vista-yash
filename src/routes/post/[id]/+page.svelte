<script lang="ts">
  import dayjs from "dayjs";
  export let data;
  let post = data.post;
  let { author } = post;
  $: {
    post = data.post;
    ({ author } = post);
  }
  import Edit from "./form-sheet-post-edit.svelte";
</script>

<div
  class="w-full h-screen pt-20 pb-10 md:px-10 px-6 overflow-y-auto flex justify-center"
>
  <div class="max-w-prose w-full md:w-prose min h-auto flex flex-col">
    <div class="w-full h-fit wrapper flex">
      <h1 class="md:text-4xl flex-grow text-2xl text-blue-950 font-bold">
        {post.title}
      </h1>
      <div class=" flex justify-end items-center">
        <Edit data={data.updateForm} />
      </div>
    </div>
    {#if author}
      <h2 class="mt-3 md:text-right">By {author.name}</h2>
    {/if}
    <h2 class="mt-1 md:text-right">
      {dayjs(post.createdOn).format("MM/DD/YYYY")}
    </h2>
    <p class="mt-10">
      {@html post.content}
    </p>
  </div>
</div>
