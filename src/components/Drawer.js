import React from "react";
import { Drawer, List, ListItem, ListItemText, Button } from "@mui/material";

const MyDrawer = ({ open, onClose, onSend }) => (
  <Drawer anchor="right" open={open} onClose={onClose}>
    <div
      role="presentation"
      onClick={onClose}
      onKeyDown={onClose}
      style={{ width: "250px" }}
    >
      <List>
        <ListItem button>
          <ListItemText primary="Item 1" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Item 2" />
        </ListItem>
      </List>
      <Button variant="contained" color="primary" onClick={onSend}>
        To LemList
      </Button>
    </div>
  </Drawer>
);

export default MyDrawer;
