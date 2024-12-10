<script lang="ts">
  import type { Post } from "@prisma/client";
  import dayjs from "dayjs";
  export let post: Post & {
    author: any;
  };
  let date = post.createdAt;
  const formattedDate = dayjs(date).format("MM-DD-YYYY");
  let author = post.author;
  console.log(formattedDate);
</script>

<label
  class="cursor-pointer group transition-all hover:text-blue-950 shadow-sm"
  for={`post-${post.id}`}
>
  <div
    class="w-full flex flex-col h-28 cursor-pointer rounded my-2 justify-between border border-black transition-all group-hover:border-blue-950 group-hover:border-opacity-100 border-opacity-10 px-3 py-2"
  >
    <div class="wrapper flex w-full">
      <h1 class="font-bold flex-3 w-full flex-1 overflow-hidden">
        {post.title}
      </h1>
      <h2 class="flex-1 w-full text-right">
        By: <span class="italic">
          {author.name}
        </span>
      </h2>
    </div>
    <div class="wrapper flex w-full">
      <h1 class="flex-3 w-full flex-1 overflow-hidden">
        Published on:<span class="italic"> {formattedDate}</span>
      </h1>
    </div>
  </div>
</label>
