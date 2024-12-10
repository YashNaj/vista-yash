<script lang="ts">
  import Post from "$lib/components/Post.svelte";
  import dayjs from "dayjs";

  export let data;
  let user = data.user;
  let posts = user.posts;
  import Menu from "./user-dropdown.svelte";
</script>

<div class="w-full h-screen pt-20 pb-10 md:px-10 px-6 text-blue-950">
  <div class="w-full flex justify-between">
    <h1 class="md:text-4xl text-3xl text-blue-950 font-bold">{user.name}</h1>
    <div class="w-fit h-fit">
      <Menu id={user.id} />
    </div>
  </div>
  <h2>
    <span class="italic">User since:</span>
    {dayjs(user.createdOn).format("MM/DD/YYYY")}
  </h2>
  <div class="flex flex-col w-full h-full flex-wrap">
    <h2 class="my-2 font-bold">Posts by this user:</h2>
    {#each posts as post}
      <Post {post} />
    {/each}
  </div>
</div>
