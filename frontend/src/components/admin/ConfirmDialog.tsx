import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: "approve" | "reject" | "reset" | "delete" | null;
}

const ConfirmDialog: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
  action,
}) => {
  if (!action) return null;
  const actionText =
  action === "approve"
    ? "approve this user?"
    : action === "reject"
    ? "reject this user?"
    : action === "reset"
    ? "reset this user's password?"
    : "delete this user?";

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to {actionText}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={onConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
