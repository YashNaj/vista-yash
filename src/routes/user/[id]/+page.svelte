<script lang="ts">
  import Post from "$lib/components/Post.svelte";
  import dayjs from "dayjs";
  import Edit from "./form-sheet-user-edit.svelte";
  import Add from "./form-sheet-user-post-create.svelte";
  export let data;
  let user = data.user;
  let posts = user.posts;
  $: {
    user = data.user;
    posts = user.posts;
  }
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import Menu from "./user-dropdown.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Trash2 } from "lucide-svelte";
  import { deleteUser } from "$lib/db";
  let showDeleteConfirm = false;
  async function confirmDelete() {
    try {
      const userId = user.id;

      const [deletedUser, deleteError] = await deleteUser(userId);

      if (deleteError) {
        console.error("Error deleting user:", deleteError);
        return;
      }

      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }
</script>

<div class="w-full h-screen pt-20 pb-10 md:px-10 px-6 text-blue-950">
  <div class="w-full flex justify-between">
    <h1 class="md:text-4xl text-3xl text-blue-950 font-bold">{user.name}</h1>
    <div class=" flex justify-end items-center">
      <Edit data={data.updateForm} />
    </div>
    <div class=" flex justify-end items-center">
      <Add data={data.createPostForm} />
    </div>
    <div class=" flex justify-end items-center">
      <AlertDialog.Root>
        <AlertDialog.Trigger class="w-full">
          <Button variant="destructive" size="sm" class="ml-2">
            <Trash2 class="h-4 w-4 mr-2" />
            Delete
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>Are you sure?</AlertDialog.Title>
            <AlertDialog.Description>
              This will permanently delete {user.name}'s account.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action on:click={confirmDelete}
              >Delete</AlertDialog.Action
            >
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  </div>
  <h2>
    <span class="italic">User since:</span>
    {dayjs(user.createdOn).format("MM/DD/YYYY")}
  </h2>
  <div class="flex flex-col w-full min-h-0 flex-wrap">
    <h2 class="my-2 font-bold">Posts by this user:</h2>
    {#each posts as post}
      <Post {post} />
    {/each}
  </div>
</div>
