import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { Box, Typography } from '@material-ui/core';
import classnames from 'classnames';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      marginLeft: "8px"
    },
    dropDownIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      color: theme.palette.cronToGo.light,
      background: theme.palette.cronToGo.main,
      cursor: "pointer",
      borderRadius: "8px"
    },
    menuContainer: {
      width: "100%",
      maxWidth: "600px",
      color: "#6d6f9c",
      background: "#25263e",
      borderRadius: "10px",
      [theme.breakpoints.down('xs')]: {
        left: "0px !important",
      },
    },
    menuItem: {
      position: "relative",
      minHeight: "60px",
      fontSize: "20px",
      padding: "0px",
      borderBottom: "1px solid #393a54",
      '&:last-child': {
        border: "none"
      },
      '&:hover': {
        color: theme.palette.cronToGo.white,
        background: "#2d2e49",
        '& .MuiBox-root': {
          background: `linear-gradient(${theme.palette.cronToGo.red} , ${theme.palette.cronToGo.purple})`
        }
      },
      whiteSpace: "unset"
    },
    selectedMenuItem: {
      color: theme.palette.cronToGo.white,
      background: "#2d2e49"
    },
    menuItemName: {
      [theme.breakpoints.down('xs')]: {
        marginLeft: '2rem',
      },
      [theme.breakpoints.up('sm')]: {
        marginLeft: '3.5rem',
      },
      [theme.breakpoints.up('md')]: {
        marginLeft: '50px',
      }
    },
    menuItemSelectedMark: {
      position: "absolute",
      width: "10px",
      height: "100%",
    },
    menuItemDivider: {
      paddingTop: "0px",
      paddingBottom: "0px",
      borderColor: theme.palette.cronToGo.light,
      minHeight: "auto"
    },
    gradientColor: {
      background: `linear-gradient(${theme.palette.cronToGo.red} , ${theme.palette.cronToGo.purple})`
    }
  })
);

interface CronDropDownMenuProps {
  currentExpression?: string;
  handlePresetChange: (expression: string) => void;
};

const cronPresets = [
  {
    expression: '*/1 * * * *',
    name: 'Every minute',
  },
  {
    expression: '*/10 * * * *',
    name: 'Every 10 minutes',
  },
  {
    expression: '0 * * * *',
    name: 'Every hour',
  },
  {
    expression: '0 9,21 * * *',
    name: 'Twice a day (at 09:00 and 21:00)',
  },
  {
    expression: '',
    name: 'divider',
  },
  {
    expression: '0 9 * * *',
    name: 'Every day (at 09:00)',
  },
  {
    expression: '0 9 * * 1-5',
    name: 'Every weekday (Monday through Friday at 09:00)',
  },
  {
    expression: '0 9 * * 6,0',
    name: 'Every weekend (Saturday and Sunday at 09:00)',
  },
  {
    expression: '0 9 * * MON',
    name: 'Every week (Mondays at 09:00)',
  },
  {
    expression: '',
    name: 'divider',
  },
  {
    expression: '0 9 1 * *',
    name: 'Every month (on the 1st at 09:00)',
  },
  {
    expression: '0 9 1 */3 *',
    name: 'Every quarter (on the 1st at 09:00)',
  },
];

const CronDropDownMenu: React.FC<CronDropDownMenuProps> = ({
  currentExpression = "",
  handlePresetChange
}) => {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePresetClick = (preset: string, event: any) => {
    handlePresetChange(preset);
    handleClose();
  };

  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Box className={classes.dropDownIcon} onClick={handleClick}>
        <KeyboardArrowDownIcon fontSize="large"/>
      </Box>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PopoverClasses={{
          paper: classes.menuContainer
        }}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 100,
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {cronPresets.map((preset, i) => (
          preset.name !== "divider" ? 
            <MenuItem className={classnames(classes.menuItem, preset.expression === currentExpression && classes.selectedMenuItem)} key={i} onClick={(e) => handlePresetClick(preset.expression, e)}>
              <Box className={classnames(classes.menuItemSelectedMark, preset.expression === currentExpression && classes.gradientColor)}>&nbsp;</Box>
              <Typography variant="body2" className={classes.menuItemName}>{preset.name}</Typography>
            </MenuItem>
           : 
           <MenuItem className={classes.menuItemDivider} key={i} divider />
        ))}
      </Menu>
    </Box>
  );
};
export default CronDropDownMenu;
