<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet";
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { updatePostSchema, type UpdatePostSchema } from "$lib/schemas/post";
  import { Edit2, Loader2 } from "lucide-svelte";
  import { fly } from "svelte/transition";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { invalidateAll } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";

  export let data: SuperValidated<Infer<UpdatePostSchema>>;
  export let id;

  const form = superForm(data, {
    validators: zodClient(updatePostSchema),
    resetForm: true,
    delayMs: 500,
    timeoutMs: 8000,
  });

  const { form: formData, enhance, delayed, submitting } = form;
  let showSuccess = false;
</script>

<Sheet.Root>
  <Sheet.Trigger class="h-full flex flex-col justify-start items-end">
    <Button variant="ghost" size="sm" class="ml-2">
      <Edit2 class="h-4 w-4 mr-2" />
      Edit
    </Button>
  </Sheet.Trigger>

  <Sheet.Content class="pt-20">
    <Sheet.Header>
      <Sheet.Title>Edit this post</Sheet.Title>
    </Sheet.Header>

    {#if showSuccess}
      <div
        class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
        in:fly={{ duration: 500 }}
        out:fly={{ duration: 400, delay: 600 }}
      >
        Succesfully edited post.
      </div>
    {/if}

    <form
      method="POST"
      action="?/edit"
      use:enhance={({ formData }) => {
        return async ({ result }) => {
          if (result.type === "success") {
            showSuccess = true;
            setTimeout(() => (showSuccess = false), 3000);
          }
          await invalidateAll();
        };
      }}
      class="w-full h-full pt-2"
    >
      <Form.Field {form} name="title">
        <Form.Control let:attrs>
          <Form.Label>Title</Form.Label>
          <Input {...attrs} bind:value={$formData.title} />
        </Form.Control>
        <Form.Description>Title of the post.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="content">
        <Form.Control let:attrs>
          <Form.Label>Content</Form.Label>
          <Input {...attrs} bind:value={$formData.content} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <div class="w-full h-10 pt-4">
        <Form.Button
          class="w-full text-white bg-blue-950 relative"
          disabled={$submitting}
        >
          {#if $delayed}
            <Loader2 class="h-4 w-4 animate-spin absolute left-4" />
          {/if}
          {$delayed ? "Updating..." : "Submit"}
        </Form.Button>
      </div>
    </form>
  </Sheet.Content>
</Sheet.Root>
