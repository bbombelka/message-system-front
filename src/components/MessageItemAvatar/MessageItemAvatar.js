import React, { useContext } from 'react';
import { ContactMailOutlined, Edit, PersonOutline } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Checkbox, Typography } from '@material-ui/core';
import ButtonWithLoader from '../ButtonWithLoader/ButtonWithLoader';
import MainContext from '../MessagesMain/MessagesMainContext';
import ThreadsContext from '../ThreadList/ThreadsContext';
import modeEnum from '../../../enums/mode.enum';

const MessageItemAvatar = (props) => {
  const { date, lastUpdated, marked, processed, reference, toggleMarkStatus } = props;
  const processedStatus = processed ? 'Read by consultant' : 'Awaiting consideration';
  const classes = useStyles();
  const isInternalMessage = processed === undefined;
  const mainContext = useContext(MainContext);
  const threadContext = useContext(ThreadsContext);

  const getTime = (date) => new Date(date).toLocaleTimeString().slice(0, 5);
  const getLocaleDate = (date) => new Date(date).toLocaleDateString();

  const { mode } = threadContext.state;

  const onEditClicked = () => {
    mainContext.editMessage(reference);
  };

  return (
    <div className={classes.root}>
      {isInternalMessage ? (
        <ContactMailOutlined className={classes.icon} />
      ) : (
        <PersonOutline className={classes.icon} />
      )}
      <div>
        <Typography component="h6" align="center" variant="caption">
          {getTime(date)}
        </Typography>
        <Typography component="h6" align="center" variant="caption">
          {getLocaleDate(date)}
        </Typography>
      </div>

      {!isInternalMessage ? (
        <div className={classes.status}>
          <Typography component="h6" align="center" variant="caption">
            Message status:
          </Typography>
          <Typography component="h6" align="center" variant="caption">
            {processedStatus}
          </Typography>
        </div>
      ) : (
        ''
      )}
      {!isInternalMessage && processed === false ? (
        <div>
          <ButtonWithLoader
            click={onEditClicked}
            icon={<Edit></Edit>}
            styles={{ margin: '4px 0', backgroundColor: 'white' }}
          >
            Edit
          </ButtonWithLoader>
        </div>
      ) : (
        ''
      )}
      {lastUpdated ? (
        <div>
          <Typography component="h6" align="center" variant="caption">
            Last updated:
          </Typography>
          <Typography component="h6" align="center" variant="caption">
            {getTime(lastUpdated)}
          </Typography>
          <Typography component="h6" align="center" variant="caption">
            {getLocaleDate(lastUpdated)}
          </Typography>
        </div>
      ) : (
        ''
      )}
      {mode === modeEnum.MARK_MESSAGE ? (
        <Checkbox
          color="default"
          checked={marked}
          onChange={() => toggleMarkStatus(reference, !marked)}
          classes={{ root: classes.checkBox, checked: classes.checkBox }}
        />
      ) : (
        ''
      )}
    </div>
  );
};

const useStyles = makeStyles({
  root: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '84px',
  },
  icon: { padding: '12px' },
  status: { padding: '12px 0' },
  checkBox: {
    color: 'rgba(100,0,0,0.87)',
    '& checked': {
      color: 'rgba(100,0,0,0.87)',
    },
  },
});

export default MessageItemAvatar;
