import React, { useState, useRef, useEffect } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import InputAdornment from '@material-ui/core/InputAdornment';
import Moment from 'react-moment';
import DocumentMeta from 'react-document-meta';
import classnames from 'classnames';

import Footer from './footer';
import CronButton from '../components/CronButton';
import CronLinkButton from '../components/CronLinkButton';
import CronDropDownMenu from '../components/CronDropDownMenu';

const cronParser = require('cron-parser');
const cronstrue = require('cronstrue');
const cronValidator = require('cron-validator');
const _ = require('lodash');

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      padding: '2rem',
      color: theme.palette.cronToGo.white,
      background: theme.palette.cronToGo.dark,
      '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
          borderColor: theme.palette.cronToGo.main,
        },
        '&.Mui-focused fieldset': {
          borderColor: theme.palette.cronToGo.main,
        },
        '&.Mui-error .MuiOutlinedInput-notchedOutline': {
          borderWidth: '3px',
          borderColor: theme.palette.cronToGo.red,
        },
      },
      '& .MuiInputAdornment-root': {
        position: 'absolute',
        height: '100%',
        maxHeight: '100%',
      },
      '& .MuiOutlinedInput-adornedStart': {
        padding: '0px',
      },
      '& .MuiOutlinedInput-inputAdornedStart': {
        paddingLeft: '60px',
      },
    },
    cronExpressionTitle: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingTop: '1.5rem',
      textAlign: 'center',
    },
    cronInputField: {
      color: theme.palette.cronToGo.white,
      background: theme.palette.cronToGo.main,
      borderRadius: '10px',
      [theme.breakpoints.down('xs')]: {
        fontSize: '2rem',
      },
      [theme.breakpoints.up('sm')]: {
        fontSize: '3.5rem',
      },
      [theme.breakpoints.up('md')]: {
        fontSize: '50px',
      },
    },
    cronInputBox: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      background: theme.palette.cronToGo.main,
      borderRadius: '10px',
    },
    cronInputErrorIcon: {
      width: '60px',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderTopLeftRadius: '10px',
      borderBottomLeftRadius: '10px',
      background: theme.palette.cronToGo.main,
    },
    dropDownIcon: {
      display: 'flex',
      alignItems: 'center',
      height: '100%',
      marginLeft: '8px',
      paddingLeft: '15px',
      paddingRight: '15px',
      color: theme.palette.cronToGo.light,
      background: theme.palette.cronToGo.main,
      cursor: 'pointer',
      borderRadius: '8px',
    },
    fieldNameContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      width: '100%',
      maxWidth: '500px',
    },
    linkButton: {
      color: theme.palette.cronToGo.white,
      textDecoration: 'underline',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      '&:hover': {
        color: theme.palette.cronToGo.red,
      },
    },
    cronExpressionContainer: {
      width: '100%',
      maxWidth: '600px',
    },
    cronExpressionItem: {
      alignItems: 'center',
      width: '100%',
      margin: '10px',
      marginLeft: '0px',
      background: theme.palette.cronToGo.main,
      borderRadius: '8px',
    },
    cronExpressionItemDescription: {
      color: theme.palette.cronToGo.light,
    },
    copyRightText: {
      color: theme.palette.cronToGo.red,
    },
    redBackgroudColor: {
      background: theme.palette.cronToGo.red,
    },
  })
);

type MainProps = {
  location: any;
};

const fieldNames = ['minute', 'hour', 'dom', 'month', 'dow'];

const defaultExpressions = {
  daily: {
    title: 'How to run a daily cron job',
    cron: '0 0 * * *',
    'meta-description': 'How to run a daily cron job',
    subtitle: 'Daily',
  },
  everyday: {
    title: 'How to run a cron job every day',
    cron: '0 0 * * *',
    'meta-description': 'How to run a cron job every day',
    subtitle: 'Everyday',
  },
  'at-midnight': {
    title: 'How to run a cron job at midnight',
    cron: '0 0 * * *',
    'meta-description': 'How to run a cron job at midnight',
    subtitle: 'At midnight',
  },
};

function Main(props: MainProps) {
  const classes = useStyles();

  const [scheduleExpression, setScheduleExpression] = useState('');
  const [
    selectedScheduleExpressionField,
    selectScheduleExpressionField,
  ] = useState('');
  const [isCronExpression, setCronExpressionState] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [humanExpression, setHumanExpression] = useState('');
  const [nextTriggers, setNextTriggers] = useState(['']);
  const [subTitle, setSubTitle] = useState('');
  const [metaData, setMetaData] = useState(null);
  const expressionInputRef = useRef<HTMLInputElement>(null);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const url = props.location.pathname;

  const initScheduleExpression = () => {
    let expression: string;
    let defaultExpression: any;
    let subTitle: string;
    
    if(url) {
      const pathName = url.substring(url.lastIndexOf('/')+1);
      defaultExpression = getCurrentPageDefaultExpression(defaultExpressions, pathName);
    }
    if(defaultExpression) {
      expression = defaultExpression.cron;
      subTitle = "Cron " + defaultExpression.subtitle;
      const meta: any = {
        title: defaultExpression.title,
        description: defaultExpression.title,
        meta: {
          charset: 'utf-8',
          name: {
            keywords: 'react,meta,document,html,tags'
          }
        }
      };
      setMetaData(meta);
    } else {
      expression = '4 5 * * *';
      subTitle = "EDIT AND VALIDATE YOUR CRON EXPRESSIONS ONLINE";
    }
    setSubTitle(subTitle);
    setDefaultExpression(expression);
    checkCronExpressionValid(expression);
  };

  useEffect(initScheduleExpression, []);

  const handleScheduleExpressionChange = (event: any) => {
    setScheduleExpression(event.target.value);
    checkCronExpressionValid(event.target.value);
  };

  const handleScheduleExpressionFieldClick = (fieldName: string) => {
    let selectionStart = 0;
    let selectionEnd = 0;
    selectScheduleExpressionField(fieldName);
    if (scheduleExpression) {
      const scheduleExpressionFields = getScheduleExpressFields(
        scheduleExpression
      );
      const fieldPosition = fieldNames.indexOf(fieldName);
      const fieldValue = scheduleExpressionFields[fieldPosition];
      for (let i = 0; i < fieldPosition; i++) {
        selectionStart += scheduleExpressionFields[i].length;
      }

      selectionStart = selectionStart + fieldPosition;
      if (fieldValue) {
        selectionEnd = selectionStart + fieldValue.length;
      }

      if (expressionInputRef && expressionInputRef.current) {
        expressionInputRef.current.focus();
        expressionInputRef.current.setSelectionRange(
          selectionStart,
          selectionEnd
        );
      }
    }
  };

  const handleInputClick = () => {
    let position: any;
    let cursorField: any;
    if (scheduleExpression) {
      const scheduleExpressionFieldRanges = getScheduleExpressFieldRange(
        scheduleExpression
      );
      if (expressionInputRef && expressionInputRef.current) {
        position = expressionInputRef.current.selectionStart;
        cursorField = scheduleExpressionFieldRanges.find(
          (field) => field.range[0] <= position && position <= field.range[1]
        );
        if (cursorField) {
          selectScheduleExpressionField(cursorField.name);
        }
      }
    }
  };

  const handlePresetChange = (expression: string) => {
    setScheduleExpression(expression);
    checkCronExpressionValid(expression);
  };

  const getHumanExpression = (expression: string) => {
    let humanExpression = '';
    try {
      humanExpression = cronstrue.toString(expression, {
        use24HourTimeFormat: true,
      });
    } catch (e) {
      const message =
          "Unfortunately, schedule expression doesn't seem to be valid.";
      setCronExpressionState(false);
      setErrorMessage(message);
    }
    setHumanExpression(humanExpression);
  };

  const getNextTriggers = (expression: string) => {
    let nextTriggers: string[] = [];

    if (expression && expression.length > 0) {
      try {
        const option: any = {
          utc: true,
        };
        if (timeZone) {
          option.timeZone = timeZone;
          option.utc = false;
        }

        let interval = cronParser.parseExpression(expression, option);
        for (let i = 0; i < 3; i++) {
          nextTriggers.push(interval.next().toDate());
        }
      } catch (e) {}
    }
    setNextTriggers(nextTriggers);
  };

  const getScheduleExpressFields = (expression: string) => {
    let expressFields: string[] = [];

    if (expression && expression.length > 0) {
      try {
        expressFields = scheduleExpression.split(' ');
      } catch (e) {}
    }

    return expressFields;
  };

  const getScheduleExpressFieldRange = (expression: string) => {
    let scheduleExpressFieldRanges = [];
    const scheduleExpressionFields = getScheduleExpressFields(expression);

    scheduleExpressFieldRanges = fieldNames.map((name, index) => {
      let selectionStart = 0;
      let selectionEnd = 0;
      const fieldValue = scheduleExpressionFields[index];
      for (let i = 0; i < index; i++) {
        selectionStart += scheduleExpressionFields[i].length;
      }
      selectionStart = selectionStart + index;
      if (fieldValue) {
        selectionEnd = selectionStart + fieldValue.length;
      }

      const fieldRange = {
        name: name,
        range: [selectionStart, selectionEnd],
      };

      return fieldRange;
    });

    return scheduleExpressFieldRanges;
  };

  const handleKeyPress = (event: any) => {
    let startPosition: any;
    let cursorField: any;
    let start = event.target.selectionStart;
    if (event.keyCode === 39) {
      event.preventDefault();
      if (scheduleExpression) {
        const scheduleExpressionFieldRanges = getScheduleExpressFieldRange(
          scheduleExpression
        );
        if (expressionInputRef && expressionInputRef.current) {
          expressionInputRef.current.selectionStart = expressionInputRef.current.selectionEnd =
            start + 1;
          startPosition = expressionInputRef.current.selectionStart;
          cursorField = scheduleExpressionFieldRanges.find(
            (field) =>
              field.range[0] <= startPosition && startPosition <= field.range[1]
          );
          selectScheduleExpressionField(cursorField.name);
        }
      }
    } else if (event.keyCode === 37) {
      event.preventDefault();
      if (scheduleExpression) {
        const scheduleExpressionFieldRanges = getScheduleExpressFieldRange(
          scheduleExpression
        );
        if (expressionInputRef && expressionInputRef.current) {
          expressionInputRef.current.selectionStart = expressionInputRef.current.selectionEnd =
            start - 1;
          startPosition = expressionInputRef.current.selectionStart;
          cursorField = scheduleExpressionFieldRanges.find(
            (field) =>
              field.range[0] <= startPosition && startPosition <= field.range[1]
          );
          selectScheduleExpressionField(cursorField.name);
        }
      }
    }
  };

  const checkCronExpressionValid = (expression: string) => {
    try {
      const parts = expression.split(' ');

      // Check if we have empty parts
      if (_.some(parts, _.isEmpty)) {
        const message = "Unfortunately, you can't leave frequency blank.";
        setCronExpressionState(false);
        setErrorMessage(message);
      }

      if (parts.length < 5) {
        const message =
          "Unfortunately, schedule expression doesn't seem to be valid.";
        setCronExpressionState(false);
        setErrorMessage(message);
      }

      // Verify we have exactly 5 parts
      if (parts.length === 5 && !_.some(parts, _.isEmpty)) {
        if (cronValidator.isValidCron(expression)) {
          setCronExpressionState(true);
          getHumanExpression(expression);
          getNextTriggers(expression);
        } else {
          const message =
          "Unfortunately, schedule expression doesn't seem to be valid.";
          setCronExpressionState(false);
          setErrorMessage(message);
        }
      }
    } catch (e) {
      setCronExpressionState(false);
    }
  };

  const getCurrentPageDefaultExpression = (expressions: any, pathName: string) => {
    try {
      const objectKey = Object.keys(expressions).find(key => key === pathName);
      if(objectKey) {
        return expressions[objectKey];
      }
    } catch (e) {
    }
  }

  const setDefaultExpression = (expression: string) => {
    setScheduleExpression(expression);
  }

  return (
    <DocumentMeta {...metaData}>
      <Box className={classes.root}>
        <Box className={classes.cronExpressionTitle}>
          <Typography variant="h1">Cron Expression To Go</Typography>
          <Typography variant="h3" style={{ marginTop: '1rem' }}>
            {subTitle}
          </Typography>
        </Box>

        <Box className="text-center" my={3}>
          { isCronExpression &&
            humanExpression &&
            <Typography variant="h2">"{humanExpression}"</Typography>
          }
          { !isCronExpression &&
            errorMessage &&
            <Typography variant="h3">{errorMessage}</Typography>
          }
          <Box>
            { isCronExpression &&
              humanExpression &&
              nextTriggers &&
              nextTriggers.map((nextTrigger, i) => (
                <Typography key={i} variant="body2">
                  {i === 0 ? 'next' : 'then'} at{' '}
                  <Moment format="YYYY-MM-DD [at] HH:mm:ss" date={nextTrigger} />
                </Typography>
              ))}

            {!isCronExpression && <Box component="span">&nbsp;</Box>}
          </Box>
        </Box>

        <Box my={3}>
          <Grid container>
            <Grid item xs={10} sm={11}>
              <TextField
                error={isCronExpression === false}
                variant="outlined"
                InputProps={{
                  className: classes.cronInputField,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box
                        className={classnames(
                          classes.cronInputErrorIcon,
                          isCronExpression === false && classes.redBackgroudColor
                        )}
                      >
                        {isCronExpression === false && (
                          <ReportProblemOutlinedIcon fontSize="large" />
                        )}
                      </Box>
                    </InputAdornment>
                  ),
                }}
                inputProps={{ min: 0, style: { textAlign: 'center' } }}
                inputRef={expressionInputRef}
                value={scheduleExpression}
                onChange={handleScheduleExpressionChange}
                onClick={handleInputClick}
                onKeyDown={handleKeyPress}
              />
            </Grid>
            <Grid item xs={2} sm={1}>
              <CronDropDownMenu
                currentExpression={scheduleExpression}
                handlePresetChange={handlePresetChange}
              />
            </Grid>
          </Grid>
        </Box>

        <Box className={classes.fieldNameContainer}>
          <CronLinkButton
            isSelected={
              selectedScheduleExpressionField === 'minute' ? true : false
            }
            isError={!isCronExpression}
            label="minute"
            clickHandler={() => handleScheduleExpressionFieldClick('minute')}
          />
          <CronLinkButton
            isSelected={selectedScheduleExpressionField === 'hour' ? true : false}
            isError={!isCronExpression}
            label="hour"
            clickHandler={() => handleScheduleExpressionFieldClick('hour')}
          />
          <CronLinkButton
            isSelected={selectedScheduleExpressionField === 'dom' ? true : false}
            isError={!isCronExpression}
            label="day"
            desc="(month)"
            clickHandler={() => handleScheduleExpressionFieldClick('dom')}
          />
          <CronLinkButton
            isSelected={
              selectedScheduleExpressionField === 'month' ? true : false
            }
            isError={!isCronExpression}
            label="month"
            clickHandler={() => handleScheduleExpressionFieldClick('month')}
          />
          <CronLinkButton
            isSelected={selectedScheduleExpressionField === 'dow' ? true : false}
            isError={!isCronExpression}
            label="day"
            desc="(week)"
            clickHandler={() => handleScheduleExpressionFieldClick('dow')}
          />
        </Box>

        <Box className={classes.cronExpressionContainer} my={5}>
          <Grid container spacing={3} className={classes.cronExpressionItem}>
            <Grid item xs>
              <Typography className="text-right" variant="body2">
                *
              </Typography>
            </Grid>
            <Grid item xs>
              <Typography
                variant="body2"
                className={classes.cronExpressionItemDescription}
              >
                any value
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={3} className={classes.cronExpressionItem}>
            <Grid item xs>
              <Typography className="text-right" variant="body2">
                ,
              </Typography>
            </Grid>
            <Grid item xs>
              <Typography
                variant="body2"
                className={classes.cronExpressionItemDescription}
              >
                value list separator
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={3} className={classes.cronExpressionItem}>
            <Grid item xs>
              <Typography className="text-right" variant="body2">
                /
              </Typography>
            </Grid>
            <Grid item xs>
              <Typography
                variant="body2"
                className={classes.cronExpressionItemDescription}
              >
                step values
              </Typography>
            </Grid>
          </Grid>

          {selectedScheduleExpressionField === 'minute' && (
            <Grid container spacing={3} className={classes.cronExpressionItem}>
              <Grid item xs>
                <Typography className="text-right" variant="body2">
                  0-59
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography
                  variant="body2"
                  className={classes.cronExpressionItemDescription}
                >
                  valid range of values
                </Typography>
              </Grid>
            </Grid>
          )}

          {selectedScheduleExpressionField === 'hour' && (
            <Grid container spacing={3} className={classes.cronExpressionItem}>
              <Grid item xs>
                <Typography className="text-right" variant="body2">
                  0-23
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography
                  variant="body2"
                  className={classes.cronExpressionItemDescription}
                >
                  valid range of values
                </Typography>
              </Grid>
            </Grid>
          )}

          {selectedScheduleExpressionField === 'dom' && (
            <Grid container spacing={3} className={classes.cronExpressionItem}>
              <Grid item xs>
                <Typography className="text-right" variant="body2">
                  0-31
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography
                  variant="body2"
                  className={classes.cronExpressionItemDescription}
                >
                  valid range of values
                </Typography>
              </Grid>
            </Grid>
          )}

          {selectedScheduleExpressionField === 'month' && (
            <Grid container spacing={3} className={classes.cronExpressionItem}>
              <Grid item xs>
                <Typography className="text-right" variant="body2">
                  1-12
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography
                  variant="body2"
                  className={classes.cronExpressionItemDescription}
                >
                  valid range of values
                </Typography>
              </Grid>
            </Grid>
          )}

          {selectedScheduleExpressionField === 'dow' && (
            <Grid container spacing={3} className={classes.cronExpressionItem}>
              <Grid item xs>
                <Typography className="text-right" variant="body2">
                  0-7, SUN-SAT
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography
                  variant="body2"
                  className={classes.cronExpressionItemDescription}
                >
                  valid range of values
                </Typography>
              </Grid>
            </Grid>
          )}
        </Box>

        <Box className="text-center" mt={5}>
          <CronButton href={"https://crontogo.com?cexp=" + scheduleExpression.split(" ").join("")}>CREATE YOUR CRON JOB ON THE CLOUD</CronButton>
          <Box m={2}>
            <Typography variant="body2">
              Read more tips on{' '}
              <Link className={classes.linkButton} variant="body2" target="_blank" href="https://crontogo.com/blog/the-complete-guide-to-cron/">
                Cron expressions
              </Link>
            </Typography>
          </Box>
        </Box>

        <Footer />
      </Box>
    </DocumentMeta>
    
  );
}

export default Main;
