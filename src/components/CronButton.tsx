import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';

const CronButton = withStyles((theme: Theme) => ({
  root: {
    fontFamily: '"Nunito"',
    fontWeight: 400,
    color: theme.palette.cronToGo.white,
    background: theme.palette.cronToGo.red,
    padding: "8px 17px",
    borderRadius: "10px",
    '&:hover': {
      color: theme.palette.cronToGo.white,
      background: `linear-gradient(to right, ${theme.palette.cronToGo.red} , ${theme.palette.cronToGo.purple})`,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '1rem',
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: '2rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '24px',
    }
  },
}))(Button);

export default CronButton;