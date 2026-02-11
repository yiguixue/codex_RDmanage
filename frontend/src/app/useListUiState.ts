import { useState } from "react";
import type { FormEvent } from "react";

type ViewMode = "table" | "list";

type ViewModeState = {
  overview: ViewMode;
  products: ViewMode;
  modules: ViewMode;
  versions: ViewMode;
  requirements: ViewMode;
  tasks: ViewMode;
  reports: ViewMode;
  dicts: ViewMode;
};

type PaginationState = {
  page: number;
  size: number;
};

type PaginationMap = {
  products: PaginationState;
  modules: PaginationState;
  versions: PaginationState;
  requirements: PaginationState;
  tasks: PaginationState;
  dicts: PaginationState;
};

type FilterState = {
  versionProduct: string;
  versionModule: string;
  versionStatus: string;
  versionOwner: string;
  versionDateStart: string;
  versionDateEnd: string;
  reqProduct: string;
  reqModule: string;
  reqPriority: string;
  reqVersion: string;
  reqOwner: string;
  taskProduct: string;
  taskModule: string;
  taskStatus: string;
  taskOwner: string;
  taskDue: string;
};

type ProductFilterState = {
  status: string;
  owner: string;
  keyword: string;
};

const initialViewMode: ViewModeState = {
  overview: "table",
  products: "table",
  modules: "table",
  versions: "table",
  requirements: "table",
  tasks: "table",
  reports: "table",
  dicts: "table"
};

const initialPagination: PaginationMap = {
  products: { page: 1, size: 10 },
  modules: { page: 1, size: 10 },
  versions: { page: 1, size: 10 },
  requirements: { page: 1, size: 10 },
  tasks: { page: 1, size: 10 },
  dicts: { page: 1, size: 10 }
};

export function useListUiState(initialFilters: FilterState, initialProductFilters: ProductFilterState) {
  const [viewMode, setViewMode] = useState<ViewModeState>(initialViewMode);
  const [pagination, setPagination] = useState<PaginationMap>(initialPagination);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(initialFilters);
  const [productFilters, setProductFilters] = useState<ProductFilterState>(initialProductFilters);
  const [appliedProductFilters, setAppliedProductFilters] =
    useState<ProductFilterState>(initialProductFilters);
  const [selectedVersionId, setSelectedVersionId] = useState<string>("全部");
  const [selectedModuleProductId, setSelectedModuleProductId] = useState<string>("全部");
  const [moduleLevelFilter, setModuleLevelFilter] = useState<string>("全部");
  const [moduleStatusFilter, setModuleStatusFilter] = useState<string>("全部");

  const toggleViewMode = (menuKey: keyof ViewModeState, mode: ViewMode) => {
    setViewMode((prev) => ({ ...prev, [menuKey]: mode }));
  };

  const handleFilterSubmit = (event: FormEvent) => {
    event.preventDefault();
    setAppliedFilters(filters);
  };

  const handleProductFilterSubmit = (event: FormEvent) => {
    event.preventDefault();
    setAppliedProductFilters(productFilters);
  };

  const handleModuleFilterSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  return {
    viewMode,
    setViewMode,
    pagination,
    setPagination,
    filters,
    setFilters,
    appliedFilters,
    setAppliedFilters,
    productFilters,
    setProductFilters,
    appliedProductFilters,
    setAppliedProductFilters,
    selectedVersionId,
    setSelectedVersionId,
    selectedModuleProductId,
    setSelectedModuleProductId,
    moduleLevelFilter,
    setModuleLevelFilter,
    moduleStatusFilter,
    setModuleStatusFilter,
    toggleViewMode,
    handleFilterSubmit,
    handleProductFilterSubmit,
    handleModuleFilterSubmit
  };
}
