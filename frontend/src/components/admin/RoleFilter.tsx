import React from "react";
import { Box, TextField, MenuItem, Stack } from "@mui/material";

interface Props {
  filterRole: string;
  setFilterRole: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
}

const RoleFilter: React.FC<Props> = ({
  filterRole,
  setFilterRole,
  search,
  setSearch,
}) => {
  return (
    <Stack direction="row" spacing={2}>
      <TextField
        select
        label="Filter by Role"
        value={filterRole}
        onChange={(e) => setFilterRole(e.target.value)}
        size="small"
      >
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="Student">Student</MenuItem>
        <MenuItem value="Staff">Staff</MenuItem>
        <MenuItem value="Guest">Guest</MenuItem>
      </TextField>
      <TextField
        label="Search"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search username or email..."
      />
    </Stack>
  );
};

export default RoleFilter;
