import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Typography, Link, Box } from '@material-ui/core';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import classnames from 'classnames';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: "center",
      color: theme.palette.cronToGo.white,
      '&:hover': {
        textDecoration: 'none',
        color: theme.palette.cronToGo.red,
      },
    },
    label: {
      textDecoration: 'underline',
      cursor: 'pointer',
    },
    desc: {
    },
    errorIcon: {
      color: "transparent"
    },
    redColor: {
      color: theme.palette.cronToGo.red,
    }
  })
);

interface CronLinkButtonProps {
  isSelected?: boolean;
  isError?:boolean;
  label: string;
  desc?: string;
  clickHandler: () => void;
}

const CronLinkButton: React.FC<CronLinkButtonProps> = ({
  isSelected = false,
  isError = false,
  label,
  desc = '',
  clickHandler,
}) => {
  const classes = useStyles();
  return (
    <Link className={classes.root} onClick={clickHandler}>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <PriorityHighIcon className={classnames(classes.errorIcon, isError && isSelected && classes.redColor)}/>
        <Typography variant="body2"
          className={classnames(classes.label, isSelected && classes.redColor)}
        >
          {label}
        </Typography>
        {desc && (
          <Typography variant="body2"
            className={classnames(classes.desc, isSelected && classes.redColor)}
          >
            {desc}
          </Typography>
        )}
      </Box>
    </Link>
  );
};
export default CronLinkButton;
