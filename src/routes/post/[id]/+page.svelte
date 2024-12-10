<script lang="ts">
  import dayjs from "dayjs";
  import Menu from "./post-dropdown.svelte";
  export let data;
  let post = data.post;
  let { author } = post;
  console.log(post);
</script>

<div class="wrapper h-auto w-full flex justify-center relative">
  <a
    class="md:w-32 absolute top-20 bg-blue-950 text-white rounded shadow-sm md:left-4 right-2 md:h-14 h-10 flex justify-center items-center px-3 py-1 rounded"
    href="/"
  >
    Go back
  </a>
  <div
    class="max-w-prose w-full md:w-prose min h-screen pt-20 pb-10 md:px-10 px-6 flex flex-col"
  >
    <div class="w-full h-fit wrapper flex">
      <h1 class="md:text-4xl text-2xl text-blue-950 font-bold">
        {post.title}
      </h1>
      <div class="w-fit flex justify-center items-center">
        <div class="h-5 w-5">
          <Menu id={post.id} />
        </div>
      </div>
    </div>
    <h2 class="mt-3 md:text-right">By {author.name}</h2>
    <h2 class="mt-1 md:text-right">
      {dayjs(post.createdOn).format("MM/DD/YYYY")}
    </h2>
    <p class="mt-10">
      {@html post.content}
    </p>
  </div>
</div>
