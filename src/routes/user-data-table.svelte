<script lang="ts">
  import type { User } from "@prisma/client";
  import {
    createTable,
    Render,
    Subscribe,
    createRender,
  } from "svelte-headless-table";
  import { readable } from "svelte/store";
  import * as Table from "$lib/components/ui/table";
  import DataTableActions from "./user-data-actions.svelte";
  import DataTableCheckbox from "./user-data-table-checkbox.svelte";
  import {
    addPagination,
    addSortBy,
    addTableFilter,
    addSelectedRows,
  } from "svelte-headless-table/plugins";
  import { Button } from "$lib/components/ui/button";
  import ArrowUpDown from "lucide-svelte/icons/arrow-up-down";
  import { Input } from "$lib/components/ui/input";

  export let data: User[];

  const table = createTable(readable(data), {
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
</script>

<div class="rounded-md border w-full h-full flex flex-col">
  <!-- Fixed Search Bar -->
  <div class="flex items-center min-h-[3.5rem] py-2 px-1 border-b">
    <Input
      class="w-full"
      placeholder="Filter emails..."
      type="text"
      bind:value={$filterValue}
    />
  </div>

  <!-- Table Container -->
  <div class="flex flex-col flex-1 min-h-0">
    <!-- min-h-0 is important for nested flex scroll -->
    <!-- Fixed Header -->
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

    <!-- Scrollable Body -->
    <div class="flex-1 overflow-y-auto min-h-0">
      <!-- min-h-0 ensures scroll works -->
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

    <!-- Fixed Controls -->
    <div class="flex items-center justify-end space-x-4 p-4 border-t mt-auto">
      <div class="text-muted-foreground flex-1 text-sm">
        {Object.keys($selectedDataIds).length} of {$rows.length} row(s) selected.
      </div>
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
