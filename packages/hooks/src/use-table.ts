import {computed, reactive, ref, VNodeChild} from 'vue';
import type { Ref } from 'vue';
import { jsonClone } from '@sa/utils';
import useBoolean from './use-boolean';
import useLoading from './use-loading';
import {Filter} from "@antv/g2";

export type MaybePromise<T> = T | Promise<T>;

export type ApiFn = (args: any) => Promise<unknown>;

export type TableColumnCheck = {
  key: string;
  title: string;
  checked: boolean;
};

export type TableDataWithIndex<T> = T & { index: number };

export type TransformedData<T> = {
  data: TableDataWithIndex<T>[];
  pageNum: number;
  pageSize: number;
  total: number;
};

export type Transformer<T, Response> = (response: Response) => TransformedData<T>;

export type TableConfig<A extends ApiFn, T, C> = {
  /** api function to get table data */
  apiFn: A;
  /** api params */
  apiParams?: Parameters<A>[0];
  /** transform api response to table data */
  transformer: Transformer<T, Awaited<ReturnType<A>>>;
  /** columns factory */
  columns: () => C[];
  /**
   * get column checks
   *
   * @param columns
   */
  getColumnChecks: (columns: C[]) => TableColumnCheck[];
  /**
   * get columns
   *
   * @param columns
   */
  getColumns: (columns: C[], checks: TableColumnCheck[]) => C[];
  /**
   * callback when response fetched
   *
   * @param transformed transformed data
   */
  onFetched?: (transformed: TransformedData<T>) => MaybePromise<void>;
  /**
   * whether to get data immediately
   *
   * @default true
   */
  immediate?: boolean;
};

export default function useHookTable<A extends ApiFn, T, C>(config: {
    immediate: boolean | undefined; columns: () => ((Omit<{
        title?: TableColumnTitle; titleColSpan?: number; type?: never; key: ColumnKey; tree?: boolean; sorter?: boolean | Sorter<A extends NaiveUI.TableApiFn<infer T> ? T : never & { index: number }> | "default"; defaultSortOrder?: SortOrder; sortOrder?: SortOrder; resizable?: boolean; minWidth?: string | number; maxWidth?: string | number; filter?: "default" | boolean | Filter<A extends NaiveUI.TableApiFn<infer T> ? T : never & { index: number }>; filterOptions?: FilterOption[]; filterOptionValues?: FilterOptionValue[] | null; filterOptionValue?: FilterOptionValue | null; filterMode?: "or" | "and"; defaultFilterOptionValues?: FilterOptionValue[] | null; defaultFilterOptionValue?: FilterOptionValue | null; filterMultiple?: boolean; render?: <A, T>(rowData: (A extends NaiveUI.TableApiFn<infer T> ? T : never & { index: number }), rowIndex: number) => VNodeChild; renderFilter?: RenderFilter; renderFilterIcon?: RenderFilterIcon; renderSorter?: RenderSorter; renderSorterIcon?: RenderSorterIcon; renderFilterMenu?: RenderFilterMenu; colSpan?: <A, T>(rowData: (A extends NaiveUI.TableApiFn<infer T> ? T : never & { index: number }), rowIndex: number) => number; rowSpan?: <A, T>(rowData: (A extends NaiveUI.TableApiFn<infer T> ? T : never & { index: number }), rowIndex: number) => number
    } & CommonColumnInfo<A extends NaiveUI.TableApiFn<infer T> ? T : never & { index: number }>, "key"> & { key: keyof A extends NaiveUI.TableApiFn<infer T> ? T : never & { index: number } | NaiveUI.CustomColumnKey }) | (Omit<{ title?: TableColumnGroupTitle; type?: never; key: ColumnKey; children: Array<TableBaseColumn<A extends NaiveUI.TableApiFn<infer T> ? T : never & { index: number }>>; resizable?: boolean; filterOptions?: never } & CommonColumnInfo<A extends NaiveUI.TableApiFn<infer T> ? T : never & { index: number }>, "key"> & { key: keyof A extends NaiveUI.TableApiFn<infer T> ? T : never & { index: number } | NaiveUI.CustomColumnKey }) | ({ type: "selection"; multiple?: boolean; disabled?: <A, T>(row: (A extends NaiveUI.TableApiFn<infer T> ? T : never & { index: number })) => boolean; options?: DataTableSelectionOptions<A extends NaiveUI.TableApiFn<infer T> ? T : never & { index: number }>; sorter?: never; resizable?: boolean; filter?: never; filterOptions?: never; filterOptionValues?: never; filterOptionValue?: never; colSpan?: never; rowSpan?: never } & CommonColumnInfo<A extends NaiveUI.TableApiFn<infer T> ? T : never & { index: number }>) | TableExpandColumn<InternalRowData>)[]; onFetched: (transformed) => Promise<void>; transformer: (res) => { total: number; data: any[] }; apiFn: A; getColumnChecks: (cols) => NaiveUI.TableColumnCheck[]; apiParams: Parameters<A>[0] | undefined; getColumns: (cols, checks) => ((Omit<{
        title?: TableColumnTitle; titleColSpan?: number; type?: never; key: ColumnKey; tree?: boolean; sorter?: boolean | Sorter<A extends NaiveUI.TableApiFn<infer T> ? T : never> | "default"; defaultSortOrder?: SortOrder; sortOrder?: SortOrder; resizable?: boolean; minWidth?: string | number; maxWidth?: string | number; filter?: "default" | boolean | Filter<A extends NaiveUI.TableApiFn<infer T> ? T : never>; filterOptions?: FilterOption[]; filterOptionValues?: FilterOptionValue[] | null; filterOptionValue?: FilterOptionValue | null; filterMode?: "or" | "and"; defaultFilterOptionValues?: FilterOptionValue[] | null; defaultFilterOptionValue?: FilterOptionValue | null; filterMultiple?: boolean; render?: <A, T>(rowData: A extends NaiveUI.TableApiFn<infer T> ? T : never, rowIndex: number) => VNodeChild; renderFilter?: RenderFilter; renderFilterIcon?: RenderFilterIcon; renderSorter?: RenderSorter; renderSorterIcon?: RenderSorterIcon; renderFilterMenu?: RenderFilterMenu; colSpan?: <A, T>(rowData: A extends NaiveUI.TableApiFn<infer T> ? T : never, rowIndex: number) => number; rowSpan?: <A, T>(rowData: A extends NaiveUI.TableApiFn<infer T> ? T : never, rowIndex: number) => number
    } & CommonColumnInfo<A extends NaiveUI.TableApiFn<infer T> ? T : never>, "key"> & { key: keyof A extends NaiveUI.TableApiFn<infer T> ? T : never | NaiveUI.CustomColumnKey }) | (Omit<{ title?: TableColumnGroupTitle; type?: never; key: ColumnKey; children: Array<TableBaseColumn<A extends NaiveUI.TableApiFn<infer T> ? T : never>>; resizable?: boolean; filterOptions?: never } & CommonColumnInfo<A extends NaiveUI.TableApiFn<infer T> ? T : never>, "key"> & { key: keyof A extends NaiveUI.TableApiFn<infer T> ? T : never | NaiveUI.CustomColumnKey }) | ({ type: "selection"; multiple?: boolean; disabled?: <A, T>(row: A extends NaiveUI.TableApiFn<infer T> ? T : never) => boolean; options?: DataTableSelectionOptions<A extends NaiveUI.TableApiFn<infer T> ? T : never>; sorter?: never; resizable?: boolean; filter?: never; filterOptions?: never; filterOptionValues?: never; filterOptionValue?: never; colSpan?: never; rowSpan?: never } & CommonColumnInfo<A extends NaiveUI.TableApiFn<infer T> ? T : never>) | TableExpandColumn<InternalRowData>)[]
}) {
  const { loading, startLoading, endLoading } = useLoading();
  const { bool: empty, setBool: setEmpty } = useBoolean();

  const { apiFn, apiParams, transformer, immediate = true, getColumnChecks, getColumns } = config;

  const searchParams: NonNullable<Parameters<A>[0]> = reactive(jsonClone({ ...apiParams }));

  const allColumns = ref(config.columns()) as Ref<C[]>;

  const data: Ref<TableDataWithIndex<T>[]> = ref([]);

  const columnChecks: Ref<TableColumnCheck[]> = ref(getColumnChecks(config.columns()));

  const columns = computed(() => getColumns(allColumns.value, columnChecks.value));

  function reloadColumns() {
    allColumns.value = config.columns();

    const checkMap = new Map(columnChecks.value.map(col => [col.key, col.checked]));

    const defaultChecks = getColumnChecks(allColumns.value);

    columnChecks.value = defaultChecks.map(col => ({
      ...col,
      checked: checkMap.get(col.key) ?? col.checked
    }));
  }

  async function getData() {
    startLoading();

    const formattedParams = formatSearchParams(searchParams);

    const response = await apiFn(formattedParams);

    const transformed = transformer(response as Awaited<ReturnType<A>>);

    data.value = transformed.data;

    setEmpty(transformed.data.length === 0);

    await config.onFetched?.(transformed);

    endLoading();
  }

  function formatSearchParams(params: Record<string, unknown>) {
    const formattedParams: Record<string, unknown> = {};

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formattedParams[key] = value;
      }
    });

    return formattedParams;
  }

  /**
   * update search params
   *
   * @param params
   */
  function updateSearchParams(params: Partial<Parameters<A>[0]>) {
    Object.assign(searchParams, params);
  }

  /** reset search params */
  function resetSearchParams() {
    Object.assign(searchParams, jsonClone(apiParams));
  }

  if (immediate) {
    getData();
  }

  return {
    loading,
    empty,
    data,
    columns,
    columnChecks,
    reloadColumns,
    getData,
    searchParams,
    updateSearchParams,
    resetSearchParams
  };
}
