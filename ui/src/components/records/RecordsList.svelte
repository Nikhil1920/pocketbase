<script>
    import { createEventDispatcher } from "svelte";
    import { fly } from "svelte/transition";
    import ApiClient from "@/utils/ApiClient";
    import CommonHelper from "@/utils/CommonHelper";
    import tooltip from "@/actions/tooltip";
    import { confirm } from "@/stores/confirmation";
    import { addSuccessToast } from "@/stores/toasts";
    import SortHeader from "@/components/base/SortHeader.svelte";
    import Toggler from "@/components/base/Toggler.svelte";
    import Field from "@/components/base/Field.svelte";
    import CopyIcon from "@/components/base/CopyIcon.svelte";
    import FormattedDate from "@/components/base/FormattedDate.svelte";
    import HorizontalScroller from "@/components/base/HorizontalScroller.svelte";
    import RecordFieldValue from "@/components/records/RecordFieldValue.svelte";

    const dispatch = createEventDispatcher();
    const sortRegex = /^([\+\-])?(\w+)$/;

    export let collection;
    export let sort = "";
    export let filter = "";

    let records = [];
    let currentPage = 1;
    let totalRecords = 0;
    let bulkSelected = {};
    let isLoading = true;
    let isDeleting = false;
    let yieldedRecordsId = 0;
    let columnsTrigger;
    let hiddenColumns = [];
    let collumnsToHide = [];

    $: if (collection?.id) {
        loadStoredHiddenColumns();
        clearList();
    }

    $: fields = collection?.schema || [];

    $: relFields = fields.filter((field) => field.type === "relation");

    $: visibleFields = fields.filter((field) => !hiddenColumns.includes(field.id));

    $: if (collection?.id && sort !== -1 && filter !== -1) {
        load(1);
    }

    $: canLoadMore = totalRecords > records.length;

    $: totalBulkSelected = Object.keys(bulkSelected).length;

    $: areAllRecordsSelected = records.length && totalBulkSelected === records.length;

    $: if (hiddenColumns !== -1) {
        updateStoredHiddenColumns();
    }

    $: hasCreated = !collection?.$isView || (records.length > 0 && records[0].created != "");

    $: hasUpdated = !collection?.$isView || (records.length > 0 && records[0].updated != "");

    $: collumnsToHide = [].concat(
        collection.$isAuth
            ? [
                  { id: "@username", name: "username" },
                  { id: "@email", name: "email" },
              ]
            : [],
        fields.map((f) => {
            return { id: f.id, name: f.name };
        }),
        hasCreated ? { id: "@created", name: "created" } : [],
        hasUpdated ? { id: "@updated", name: "updated" } : []
    );

    function updateStoredHiddenColumns() {
        if (!collection?.id) {
            return;
        }

        localStorage.setItem(collection?.id + "@hiddenCollumns", JSON.stringify(hiddenColumns));
    }

    function loadStoredHiddenColumns() {
        hiddenColumns = [];

        if (!collection?.id) {
            return;
        }

        try {
            const encoded = localStorage.getItem(collection.id + "@hiddenCollumns");
            if (encoded) hiddenColumns = JSON.parse(encoded) || [];
        } catch (_) {}
    }

    export async function reloadLoadedPages() {
        const loadedPages = currentPage;

        for (let i = 1; i <= loadedPages; i++) {
            if (i === 1 || canLoadMore) {
                await load(i, false);
            }
        }
    }

    export async function load(page = 1, breakTasks = true) {
        if (!collection?.id) {
            return;
        }

        isLoading = true;

        // allow sorting by the relation display fields
        let listSort = sort;
        const sortMatch = listSort.match(sortRegex);
        const relField = sortMatch ? relFields.find((f) => f.name === sortMatch[2]) : null;
        if (sortMatch && relField?.options?.displayFields?.length > 0) {
            const parts = [];
            for (const displayField of relField.options.displayFields) {
                parts.push((sortMatch[1] || "") + sortMatch[2] + "." + displayField);
            }
            listSort = parts.join(",");
        }

        const fallbackSearchFields = CommonHelper.getAllCollectionIdentifiers(collection);

        return ApiClient.collection(collection.id)
            .getList(page, 30, {
                sort: listSort,
                filter: CommonHelper.normalizeSearchFilter(filter, fallbackSearchFields),
                expand: relFields.map((field) => field.name).join(","),
                $cancelKey: "records_list",
            })
            .then(async (result) => {
                if (page <= 1) {
                    clearList();
                }

                isLoading = false;
                currentPage = result.page;
                totalRecords = result.totalItems;
                dispatch("load", records.concat(result.items));

                // optimize the records listing by rendering the rows in task batches
                if (breakTasks) {
                    const currentYieldId = ++yieldedRecordsId;
                    while (result.items.length) {
                        if (yieldedRecordsId != currentYieldId) {
                            break; // new yeild has been started
                        }

                        records = records.concat(result.items.splice(0, 15));

                        await CommonHelper.yieldToMain();
                    }
                } else {
                    records = records.concat(result.items);
                }
            })
            .catch((err) => {
                if (!err?.isAbort) {
                    isLoading = false;
                    console.warn(err);
                    clearList();
                    ApiClient.errorResponseHandler(err, false);
                }
            });
    }

    function clearList() {
        records = [];
        currentPage = 1;
        totalRecords = 0;
        bulkSelected = {};
    }

    function toggleSelectAllRecords() {
        if (areAllRecordsSelected) {
            deselectAllRecords();
        } else {
            selectAllRecords();
        }
    }

    function deselectAllRecords() {
        bulkSelected = {};
    }

    function selectAllRecords() {
        for (const record of records) {
            bulkSelected[record.id] = record;
        }
        bulkSelected = bulkSelected;
    }

    function toggleSelectRecord(record) {
        if (!bulkSelected[record.id]) {
            bulkSelected[record.id] = record;
        } else {
            delete bulkSelected[record.id];
        }

        bulkSelected = bulkSelected; // trigger reactivity
    }

    function deleteSelectedConfirm() {
        const msg = `Do you really want to delete the selected ${
            totalBulkSelected === 1 ? "record" : "records"
        }?`;

        confirm(msg, deleteSelected);
    }

    async function deleteSelected() {
        if (isDeleting || !totalBulkSelected || !collection?.id) {
            return;
        }

        let promises = [];
        for (const recordId of Object.keys(bulkSelected)) {
            promises.push(ApiClient.collection(collection.id).delete(recordId));
        }

        isDeleting = true;

        return Promise.all(promises)
            .then(() => {
                addSuccessToast(
                    `Successfully deleted the selected ${totalBulkSelected === 1 ? "record" : "records"}.`
                );
                deselectAllRecords();
            })
            .catch((err) => {
                ApiClient.errorResponseHandler(err);
            })
            .finally(() => {
                isDeleting = false;

                // always reload because some of the records may not be deletable
                return reloadLoadedPages();
            });
    }
</script>

<HorizontalScroller class="table-wrapper">
    <svelte:fragment slot="before">
        {#if columnsTrigger}
            <Toggler
                class="dropdown dropdown-right dropdown-nowrap columns-dropdown"
                trigger={columnsTrigger}
            >
                <div class="txt-hint txt-sm p-5 m-b-5">Toggle columns</div>
                {#each collumnsToHide as column (column.id + column.name)}
                    <Field class="form-field form-field-sm form-field-toggle m-0 p-5" let:uniqueId>
                        <input
                            type="checkbox"
                            id={uniqueId}
                            checked={!hiddenColumns.includes(column.id)}
                            on:change={(e) => {
                                if (e.target.checked) {
                                    CommonHelper.removeByValue(hiddenColumns, column.id);
                                } else {
                                    CommonHelper.pushUnique(hiddenColumns, column.id);
                                }
                                hiddenColumns = hiddenColumns;
                            }}
                        />
                        <label for={uniqueId}>{column.name}</label>
                    </Field>
                {/each}
            </Toggler>
        {/if}
    </svelte:fragment>

    <table class="table" class:table-loading={isLoading}>
        <thead>
            <tr>
                {#if !collection.$isView}
                    <th class="bulk-select-col min-width">
                        {#if isLoading}
                            <span class="loader loader-sm" />
                        {:else}
                            <div class="form-field">
                                <input
                                    type="checkbox"
                                    id="checkbox_0"
                                    disabled={!records.length}
                                    checked={areAllRecordsSelected}
                                    on:change={() => toggleSelectAllRecords()}
                                />
                                <label for="checkbox_0" />
                            </div>
                        {/if}
                    </th>
                {/if}

                {#if !hiddenColumns.includes("@id")}
                    <SortHeader class="col-type-text col-field-id" name="id" bind:sort>
                        <div class="col-header-content">
                            <i class={CommonHelper.getFieldTypeIcon("primary")} />
                            <span class="txt">id</span>
                        </div>
                    </SortHeader>
                {/if}

                {#if collection.$isAuth}
                    {#if !hiddenColumns.includes("@username")}
                        <SortHeader class="col-type-text col-field-id" name="username" bind:sort>
                            <div class="col-header-content">
                                <i class={CommonHelper.getFieldTypeIcon("user")} />
                                <span class="txt">username</span>
                            </div>
                        </SortHeader>
                    {/if}
                    {#if !hiddenColumns.includes("@email")}
                        <SortHeader class="col-type-email col-field-email" name="email" bind:sort>
                            <div class="col-header-content">
                                <i class={CommonHelper.getFieldTypeIcon("email")} />
                                <span class="txt">email</span>
                            </div>
                        </SortHeader>
                    {/if}
                {/if}

                {#each visibleFields as field (field.name)}
                    <SortHeader
                        class="col-type-{field.type} col-field-{field.name}"
                        name={field.name}
                        bind:sort
                    >
                        <div class="col-header-content">
                            <i class={CommonHelper.getFieldTypeIcon(field.type)} />
                            <span class="txt">{field.name}</span>
                        </div>
                    </SortHeader>
                {/each}

                {#if hasCreated && !hiddenColumns.includes("@created")}
                    <SortHeader class="col-type-date col-field-created" name="created" bind:sort>
                        <div class="col-header-content">
                            <i class={CommonHelper.getFieldTypeIcon("date")} />
                            <span class="txt">created</span>
                        </div>
                    </SortHeader>
                {/if}

                {#if hasUpdated && !hiddenColumns.includes("@updated")}
                    <SortHeader class="col-type-date col-field-updated" name="updated" bind:sort>
                        <div class="col-header-content">
                            <i class={CommonHelper.getFieldTypeIcon("date")} />
                            <span class="txt">updated</span>
                        </div>
                    </SortHeader>
                {/if}

                <th class="col-type-action min-width">
                    {#if collumnsToHide.length}
                        <button
                            bind:this={columnsTrigger}
                            type="button"
                            aria-label="Toggle columns"
                            class="btn btn-sm btn-transparent p-0"
                        >
                            <i class="ri-more-line" />
                        </button>
                    {/if}
                </th>
            </tr>
        </thead>
        <tbody>
            {#each records as record (!collection.$isView ? record.id : record)}
                <tr
                    tabindex="0"
                    class="row-handle"
                    on:click={() => dispatch("select", record)}
                    on:keydown={(e) => {
                        if (e.code === "Enter") {
                            e.preventDefault();
                            dispatch("select", record);
                        }
                    }}
                >
                    {#if !collection.$isView}
                        <td class="bulk-select-col min-width">
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <div class="form-field" on:click|stopPropagation>
                                <input
                                    type="checkbox"
                                    id="checkbox_{record.id}"
                                    checked={bulkSelected[record.id]}
                                    on:change={() => toggleSelectRecord(record)}
                                />
                                <label for="checkbox_{record.id}" />
                            </div>
                        </td>
                    {/if}

                    {#if !hiddenColumns.includes("@id")}
                        <td class="col-type-text col-field-id">
                            <div class="flex flex-gap-5">
                                <div class="label">
                                    <CopyIcon value={record.id} />
                                    <div class="txt">{record.id}</div>
                                </div>

                                {#if collection.$isAuth}
                                    {#if record.verified}
                                        <i
                                            class="ri-checkbox-circle-fill txt-sm txt-success"
                                            use:tooltip={"Verified"}
                                        />
                                    {:else}
                                        <i
                                            class="ri-error-warning-fill txt-sm txt-hint"
                                            use:tooltip={"Unverified"}
                                        />
                                    {/if}
                                {/if}
                            </div>
                        </td>
                    {/if}

                    {#if collection.$isAuth}
                        {#if !hiddenColumns.includes("@username")}
                            <td class="col-type-text col-field-username">
                                {#if CommonHelper.isEmpty(record.username)}
                                    <span class="txt-hint">N/A</span>
                                {:else}
                                    <span class="txt txt-ellipsis" title={record.username}>
                                        {record.username}
                                    </span>
                                {/if}
                            </td>
                        {/if}
                        {#if !hiddenColumns.includes("@email")}
                            <td class="col-type-text col-field-email">
                                {#if CommonHelper.isEmpty(record.email)}
                                    <span class="txt-hint">N/A</span>
                                {:else}
                                    <span class="txt txt-ellipsis" title={record.email}>
                                        {record.email}
                                    </span>
                                {/if}
                            </td>
                        {/if}
                    {/if}

                    {#each visibleFields as field (field.name)}
                        <td class="col-type-{field.type} col-field-{field.name}">
                            <RecordFieldValue short {record} {field} />
                        </td>
                    {/each}

                    {#if hasCreated && !hiddenColumns.includes("@created")}
                        <td class="col-type-date col-field-created">
                            <FormattedDate date={record.created} />
                        </td>
                    {/if}

                    {#if hasUpdated && !hiddenColumns.includes("@updated")}
                        <td class="col-type-date col-field-updated">
                            <FormattedDate date={record.updated} />
                        </td>
                    {/if}

                    <td class="col-type-action min-width">
                        <i class="ri-arrow-right-line" />
                    </td>
                </tr>
            {:else}
                {#if isLoading}
                    <tr>
                        <td colspan="99" class="p-xs">
                            <span class="skeleton-loader m-0" />
                        </td>
                    </tr>
                {:else}
                    <tr>
                        <td colspan="99" class="txt-center txt-hint p-xs">
                            <h6>No records found.</h6>
                            {#if filter?.length}
                                <button
                                    type="button"
                                    class="btn btn-hint btn-expanded m-t-sm"
                                    on:click={() => (filter = "")}
                                >
                                    <span class="txt">Clear filters</span>
                                </button>
                            {:else if !collection?.$isView}
                                <button
                                    type="button"
                                    class="btn btn-secondary btn-expanded m-t-sm"
                                    on:click={() => dispatch("new")}
                                >
                                    <i class="ri-add-line" />
                                    <span class="txt">New record</span>
                                </button>
                            {/if}
                        </td>
                    </tr>
                {/if}
            {/each}
        </tbody>
    </table>
</HorizontalScroller>

{#if records.length}
    <small class="block txt-hint txt-right m-t-sm">Showing {records.length} of {totalRecords}</small>
{/if}

{#if records.length && canLoadMore}
    <div class="block txt-center m-t-xs">
        <button
            type="button"
            class="btn btn-lg btn-secondary btn-expanded"
            class:btn-loading={isLoading}
            class:btn-disabled={isLoading}
            on:click={() => load(currentPage + 1)}
        >
            <span class="txt">Load more ({totalRecords - records.length})</span>
        </button>
    </div>
{/if}

{#if totalBulkSelected}
    <div class="bulkbar" transition:fly|local={{ duration: 150, y: 5 }}>
        <div class="txt">
            Selected <strong>{totalBulkSelected}</strong>
            {totalBulkSelected === 1 ? "record" : "records"}
        </div>
        <button
            type="button"
            class="btn btn-xs btn-transparent btn-outline p-l-5 p-r-5"
            class:btn-disabled={isDeleting}
            on:click={() => deselectAllRecords()}
        >
            <span class="txt">Reset</span>
        </button>
        <div class="flex-fill" />
        <button
            type="button"
            class="btn btn-sm btn-transparent btn-danger"
            class:btn-loading={isDeleting}
            class:btn-disabled={isDeleting}
            on:click={() => deleteSelectedConfirm()}
        >
            <span class="txt">Delete selected</span>
        </button>
    </div>
{/if}
