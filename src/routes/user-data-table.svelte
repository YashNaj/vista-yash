<script lang="ts">
  import type { User } from "@prisma/client";
  import {
    createTable,
    Render,
    Subscribe,
    createRender,
  } from "svelte-headless-table";
  import { writable } from "svelte/store";
  import * as Table from "$lib/components/ui/table";
  import DataTableActions from "./user-data-actions.svelte";
  import DataTableCheckbox from "./user-data-table-checkbox.svelte";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import {
    addPagination,
    addSortBy,
    addTableFilter,
    addSelectedRows,
  } from "svelte-headless-table/plugins";
  import { Button } from "$lib/components/ui/button";
  import ArrowUpDown from "lucide-svelte/icons/arrow-up-down";
  import { Input } from "$lib/components/ui/input";
  import { invalidateAll } from "$app/navigation";
  import { Trash2 } from "lucide-svelte";

  export let data: User[];

  // Create the writable store once
  const tableData = writable<User[]>([]);

  // Update it when data changes
  $: tableData.set(data);

  const table = createTable(tableData, {
    page: addPagination(),
    sort: addSortBy(),
    filter: addTableFilter({
      fn: ({ filterValue, value }) =>
        value.toLowerCase().includes(filterValue.toLowerCase()),
    }),
    select: addSelectedRows(),
  });

  const columns = table.createColumns([
    table.column({
      accessor: "id",
      header: (_, { pluginStates }) => {
        const { allPageRowsSelected } = pluginStates.select;
        return createRender(DataTableCheckbox, {
          checked: allPageRowsSelected,
        });
      },
      cell: ({ row }, { pluginStates }) => {
        const { getRowState } = pluginStates.select;
        const { isSelected } = getRowState(row);

        return createRender(DataTableCheckbox, {
          checked: isSelected,
        });
      },
      plugins: {
        sort: {
          disable: true,
        },
        filter: {
          exclude: true,
        },
      },
    }),
    table.column({
      accessor: "name",
      header: "Name",
      plugins: { sort: { disable: true }, filter: { exclude: true } },
    }),
    table.column({
      accessor: "email",
      header: "Email",
    }),
    table.column({
      accessor: ({ id }) => id,
      plugins: { sort: { disable: true } },
      header: "",
      cell: ({ value }) => {
        value = parseInt(value);
        return createRender(DataTableActions, { id: value });
      },
    }),
  ]);

  const {
    headerRows,
    pageRows,
    tableAttrs,
    tableBodyAttrs,
    pluginStates,
    rows,
  } = table.createViewModel(columns);

  const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
  const { filterValue } = pluginStates.filter;
  const { selectedDataIds } = pluginStates.select;

  async function handleBulkDelete() {
    const selectedIds = Object.keys($selectedDataIds)
      .map((key) => {
        const row = $rows.find((r) => r.id === key);
        return row?.original.id;
      })
      .filter(Boolean);

    const form = new FormData();
    form.append("ids", selectedIds.join(","));

    try {
      const response = await fetch("?/deleteUsers", {
        method: "POST",
        body: form,
      });

      if (response.ok) {
        $selectedDataIds = {};
        showDeleteConfirm = false;
        await invalidateAll();
      }
    } catch (error) {
      console.error("Failed to delete users:", error);
    }
  }

  let showDeleteConfirm = false;
  let selectedCount = 0;

  $: selectedCount = Object.keys($selectedDataIds).length;

  async function confirmDelete() {
    await handleBulkDelete();
  }
</script>

<div class="rounded-md border w-full h-full flex flex-col">
  <div class="flex items-center min-h-[3.5rem] py-2 px-1 border-b">
    <Input
      class="w-full"
      placeholder="Filter emails..."
      type="text"
      bind:value={$filterValue}
    />
  </div>

  <div class="flex flex-col flex-1 min-h-0">
    <div class="block">
      <Table.Root {...$tableAttrs}>
        <Table.Header>
          {#each $headerRows as headerRow}
            <Subscribe rowAttrs={headerRow.attrs()}>
              <Table.Row>
                {#each headerRow.cells as cell (cell.id)}
                  <Subscribe
                    attrs={cell.attrs()}
                    let:attrs
                    props={cell.props()}
                    let:props
                  >
                    <Table.Head {...attrs}>
                      {#if cell.id === "email"}
                        <Button variant="ghost" on:click={props.sort.toggle}>
                          <Render of={cell.render()} />
                          <ArrowUpDown class="ml-2 h-4 w-4" />
                        </Button>
                      {:else}
                        <Render of={cell.render()} />
                      {/if}
                    </Table.Head>
                  </Subscribe>
                {/each}
              </Table.Row>
            </Subscribe>
          {/each}
        </Table.Header>
      </Table.Root>
    </div>

    <div class="flex-1 overflow-y-auto min-h-0">
      <Table.Root {...$tableAttrs}>
        <Table.Body {...$tableBodyAttrs}>
          {#each $pageRows as row (row.id)}
            <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
              <Table.Row {...rowAttrs}>
                {#each row.cells as cell (cell.id)}
                  <Subscribe attrs={cell.attrs()} let:attrs>
                    <Table.Cell {...attrs}>
                      <Render of={cell.render()} />
                    </Table.Cell>
                  </Subscribe>
                {/each}
              </Table.Row>
            </Subscribe>
          {/each}
        </Table.Body>
      </Table.Root>
    </div>

    <div class="flex items-center justify-end space-x-4 p-4 border-t mt-auto">
      <div class="text-muted-foreground flex-1 text-sm">
        {selectedCount} of {$rows.length} row(s) selected.
      </div>
      {#if selectedCount > 0}
        <AlertDialog.Root bind:open={showDeleteConfirm}>
          <AlertDialog.Trigger>
            <Button
              variant="destructive"
              size="sm"
              class="ml-2"
              disabled={selectedCount === 0}
            >
              <Trash2 class="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          </AlertDialog.Trigger>
          <AlertDialog.Content>
            <AlertDialog.Header>
              <AlertDialog.Title>Are you sure?</AlertDialog.Title>
              <AlertDialog.Description>
                This will permanently delete {selectedCount} selected user{selectedCount ===
                1
                  ? ""
                  : "s"}. This action cannot be undone.
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
      {/if}
      <Button
        variant="outline"
        size="sm"
        on:click={() => ($pageIndex = $pageIndex - 1)}
        disabled={!$hasPreviousPage}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={!$hasNextPage}
        on:click={() => ($pageIndex = $pageIndex + 1)}
      >
        Next
      </Button>
    </div>
  </div>
</div>
