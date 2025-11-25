import { useState, useEffect } from "react";
import FilterDropMenu from "./FilterDropMenu";
import FilterSingleSelect from "./FilterSingleSelect";
import FilterMultiChoice from "./FilterMultiChoice";

interface SideBarProps {
  onFilterChange: (filters: any) => void;
  onResetFilters: () => void;
  initialFilters: {
    programPath?: string | null;
    researchYear?: string | null;
    researchYearSub?: [number, number];
    searchField?: string | null;
    searchKeyword?: string[];
  };
}

type FilterKey =
  | "programPath"
  | "researchYear"
  | "researchYearSub"
  | "searchField"
  | "searchKeyword"
  | "topic"
  | "searchKeyword";

const SideBar = ({ onFilterChange, onResetFilters, initialFilters }: SideBarProps) => {
  const [filters, setFilters] = useState({
    programPath: initialFilters.programPath || null,
    researchYear: initialFilters.researchYear || null,
    researchYearSub: initialFilters.researchYearSub || [2000, new Date().getFullYear()],
    searchField: initialFilters.searchField || null,
    searchKeyword: initialFilters.searchKeyword || [],
    topic: null,
  });

  const handleSelectFilter = (section: FilterKey, value: any) => {
    const newFilters = { ...filters, [section]: value };
    setFilters(newFilters);

    onFilterChange({
      program: newFilters.programPath || "",
      yearType: newFilters.researchYear || "",
      yearSub:
        typeof newFilters.researchYearSub === "string"
          ? newFilters.researchYearSub
          : "",
      yearRange: Array.isArray(newFilters.researchYearSub)
        ? newFilters.researchYearSub
        : [2000, new Date().getFullYear()],
      searchField: newFilters.searchField || "",
      searchKeyword: newFilters.searchKeyword || [],
    });
  };

  const handleRange = (range: [number, number]) => {
    handleSelectFilter("researchYearSub", range);
  };

  const handleReset = () => {
    const defaultRange: [number, number] = [2000, new Date().getFullYear()];

    // รีเซ็ต filter ทุกตัว ยกเว้น searchQuery
    setFilters({
      programPath: null,
      researchYear: null,
      researchYearSub: defaultRange,
      searchField: null,
      searchKeyword: [],
      topic: null,
    });

    // ส่งค่า filter ว่างให้ Browse
    onFilterChange({
      program: "",
      yearType: "",
      yearSub: "",
      yearRange: defaultRange,
      searchField: "",
      searchKeyword: [],
    });
  };

  useEffect(() => {
    setFilters({
      programPath: initialFilters.programPath || null,
      researchYear: initialFilters.researchYear || null,
      researchYearSub: initialFilters.researchYearSub || [2000, new Date().getFullYear()],
      searchField: initialFilters.searchField || null,
      searchKeyword: initialFilters.searchKeyword || [],
      topic: null,
    });
  }, [initialFilters]);

  return (
    <div style={{ width: "400px", paddingLeft: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleReset}
          style={{
            backgroundColor: "#FD7521",
            color: "white",
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
          }}
        >
          รีเซ็ตตัวกรอง
        </button>
      </div>

      <FilterDropMenu
        label="แผนการเรียน"
        options={["หัวข้อพิเศษ", "สหกิจ"]}
        selected={filters.programPath || undefined}
        onSelect={(val) => handleSelectFilter("programPath", val)}
      />

      <FilterSingleSelect
        label="ปีการศึกษาที่ยื่นโครงงาน"
        rangeValue={filters.researchYearSub}
        onRangeChange={handleRange}
      />

      <FilterDropMenu
        label="ค้นหาเฉพาะ"
        options={[
          "ชื่อโครงงาน",
          "ชื่อผู้จัดทำ",
          "ชื่ออาจารย์ที่ปรึกษา",
          "บทคัดย่อ",
          "คำสำคัญ",
        ]}
        selected={filters.searchField || undefined}
        onSelect={(val) => handleSelectFilter("searchField", val)}
      />

      <FilterMultiChoice
        label="เอกสารประกอบโครงงาน"
        options={["รูปเล่มโครงงาน", "สไลด์นำเสนอ", "Source code"]}
        selectedOptions={filters.searchKeyword}
        onChange={(selected) => handleSelectFilter("searchKeyword", selected)}
      />
    </div>
  );
};

export default SideBar;
