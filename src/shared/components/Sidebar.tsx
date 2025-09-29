import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IUser } from "../../interfaces/user.interface";
import { useAppSelector } from "../../redux/hooks";
import { SidebarService } from "../../services/sidebar.service";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Sidebar() {
  const loggedInUser: IUser = useAppSelector((store) => store.loggedInUser);
  const sidebarSvc = new SidebarService();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const sidebarItems = sidebarSvc.getSidebarItems();

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <DrawerHeader>
        <div className="sidebar-branding">
          <h3 className="my-0">HRS</h3>
          <h5>
            <i>Transport</i>
          </h5>
        </div>
        <IconButton onClick={toggleDrawer(false)}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List className="drawer-items">
        {sidebarItems.map(
          (item) =>
            !item.isConfigration && (
              <ListItem key={item.path} disablePadding className={`${location.pathname.includes(item.path) ? "active" : ""}`}>
                <ListItemButton
                  onClick={() => {
                    toggleDrawer(false);
                    setTimeout(() => {
                      navigate(item.path);
                    }, 250);
                  }}
                >
                  <ListItemIcon>
                    <item.iconComp />
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            )
        )}
        <Divider />
        {sidebarItems.map(
          (item) =>
            item.isConfigration && (
              <ListItem key={item.path} disablePadding className={`${location.pathname.includes(item.path) ? "active" : ""}`}>
                <ListItemButton
                  onClick={() => {
                    toggleDrawer(false);
                    setTimeout(() => {
                      navigate(item.path);
                    }, 250);
                  }}
                >
                  <ListItemIcon>
                    <item.iconComp />
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            )
        )}
      </List>
    </Box>
  );

  return (
    <div>
      {loggedInUser?._id && (
        <>
          <IconButton color="inherit" size="large" edge="start" aria-label="open drawer" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Drawer open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
          </Drawer>
        </>
      )}
    </div>
  );
}
