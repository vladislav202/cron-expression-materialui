import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      textAlign: "center",
      paddingTop: "30px",
      paddingBottom: "50px",
      color: theme.palette.cronToGo.white,
      background: theme.palette.cronToGo.dark,
    },
    copyRightText: {
      color: theme.palette.cronToGo.red
    },
    footerContainer: {
      display: 'flex',
      justifyContent: 'center'
    },
    linkButton: {
      color: theme.palette.cronToGo.white,
      paddingLeft: "10px",
      paddingRight: "10px",
      cursor: 'pointer',
      '&:hover': {
        color: theme.palette.cronToGo.red,
      },
    },
  })
);

function Footer() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Box className={classes.footerContainer} my={3}>
        <Link className={classes.linkButton} variant="body2" target="_blank" href="https://crontogo.com">
          Cron To Go
        </Link>
        <Link className={classes.linkButton} variant="body2" target="_blank" href="https://crontogo.com/about">
          About
        </Link>
      </Box>
      <Typography variant="body2">&#169; 2020 <Box component="span" className={classes.copyRightText}>Crazy Ant Labs</Box> </Typography>
    </div>
  );
}

export default Footer;
