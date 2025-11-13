import { useState } from "react";
import FilterDropMenu from "./FilterDropMenu";
import FilterSingleSelect from "./FilterSingleSelect";
import FilterMultiChoice from "./FilterMultiChoice";

// Props ของ Sidebar
interface SideBarProps {
  onFilterChange: (filters: string[]) => void;
  onResetFilters: () => void;
}

type FilterKey =
  | "programPath"
  | "researchYear"
  | "researchYearSub"
  | "searchField"
  | "searchKeyword"
  | "topic";

const SideBar = ({ onFilterChange, onResetFilters }: SideBarProps) => {
  const [filters, setFilters] = useState<
    Record<FilterKey, string | string[] | null>
  >({
    programPath: null,
    researchYear: null,
    researchYearSub: null,
    searchField: null,
    searchKeyword: [],
    topic: null,
  });

  const [yearRange, setYearRange] = useState<[number, number]>([
    2000,
    new Date().getFullYear(),
  ]);

  const handleSelectFilter = (section: FilterKey, value: string | string[]) => {
    const newFilters = { ...filters, [section]: value };
    setFilters(newFilters);

    // รวมค่าทั้งหมดเป็น array ของ string
    const allSelected: string[] = Object.values(newFilters).flatMap((val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      return [val];
    });

    onFilterChange(allSelected);
  };

  const handleReset = () => {
    setFilters({
      programPath: null,
      researchYear: null,
      researchYearSub: null,
      searchField: null,
      searchKeyword: [],
      topic: null,
    });
    setYearRange([2000, new Date().getFullYear()]);
    onResetFilters();
  };

  return (
    <div
      style={{
        width: "400px",
        paddingLeft: "2rem",
        backgroundColor: "#ffffff",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: "80px",
      }}
    >
      {/* ปุ่มรีเซ็ต */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <button
          onClick={handleReset}
          style={{
            backgroundColor: "#FD7521",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "20px",
            border: "none",
            borderRadius: "20px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          รีเซ็ตตัวกรอง
        </button>
      </div>

      {/* Dropdown filters */}

      <FilterDropMenu
        label="แผนการเรียน"
        options={["หัวข้อพิเศษ", "สหกิจ"]}
        selected={
          typeof filters["programPath"] === "string"
            ? filters["programPath"]
            : undefined
        }
        onSelect={(value) => handleSelectFilter("programPath", value)}
      />

      {/* Single select / range year */}
      <FilterSingleSelect
        label="ปีการศึกษาที่ยื่นโครงงาน"
        options={["ย้อนหลัง", "จากปี"]}
        selected={
          typeof filters["researchYear"] === "string"
            ? filters["researchYear"]
            : undefined
        }
        onSelect={(value) => handleSelectFilter("researchYear", value)}
        subOptions={["5 ปี", "10 ปี", "15 ปี", "25 ปี"]}
        selectedSubOption={(filters["researchYearSub"] as string) || ""}
        onSelectSubOption={(value) =>
          handleSelectFilter("researchYearSub", value)
        }
        rangeValue={yearRange}
        onRangeChange={(value) => {
          setYearRange(value);
          handleSelectFilter("researchYearSub", `${value[0]}-${value[1]}`);
        }}
      />

      {/* Dropdown filters */}
      <FilterDropMenu
        label="ค้นหาเฉพาะ"
        options={[
          "ชื่อโครงงาน",
          "ชื่อผู้จัดทำ",
          "ชื่ออาจารย์ที่ปรึกษา",
          "บทคัดย่อ",
          "คำสำคัญ",
        ]}
        selected={
          typeof filters["searchField"] === "string"
            ? filters["searchField"]
            : undefined
        }
        onSelect={(value) => handleSelectFilter("searchField", value)}
      />

      {/* Multi-choice */}
      <FilterMultiChoice
        label="หัวข้อโครงงาน"
        options={[
          "AI",
          "Data Science",
          "Web Development",
          "DevOps",
          "AI",
          "Data Science",
          "Web Development",
          "DevOps",
        ]}
        selectedOptions={
          Array.isArray(filters["searchKeyword"])
            ? filters["searchKeyword"]
            : []
        }
        onChange={(selected) => handleSelectFilter("searchKeyword", selected)}
      />
    </div>
  );
};

export default SideBar;
