<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Post } from "@prisma/client";
  import dayjs from "dayjs";
  export let post: Post & {
    author: any;
  };
  let date = post.createdAt;
  const formattedDate = dayjs(date).format("MM-DD-YYYY");
  let author = post.author;
  function goToPost() {
    goto(`/post/${post.id}`);
  }
</script>

<label
  on:click={goToPost}
  for={`post-${post.id}`}
  class="cursor-pointer group transition-all hover:text-blue-950 shadow-sm"
>
  <div
    id={`post-${post.id}`}
    class="w-full flex flex-col md:h-28 h-32 cursor-pointer rounded my-2 justify-between border border-black transition-all group-hover:border-blue-950 group-hover:border-opacity-100 border-opacity-10 px-3 py-2"
  >
    <div class="wrapper flex w-full">
      <h1 class="font-bold flex-3 w-full flex-1 overflow-hidden">
        {post.title}
      </h1>
      {#if author}
        <h2 class="flex-1 w-full text-right">
          By: <span class="italic">
            {author.name}
          </span>
        </h2>
      {/if}
    </div>
    <div class="wrapper flex w-full">
      <h1 class="flex-3 w-full flex-1 overflow-hidden">
        Published on:<span class="italic"> {formattedDate}</span>
      </h1>
    </div>
  </div>
</label>
