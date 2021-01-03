export default {
  root: {
    marginTop: '100px',
  },
  avatar: {
    transition: 'all 1s',
  },
  avatarBackground: {
    backgroundColor: 'rgba(100,0,0,0.87)',
  },
  header: {
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    fontSize: '20px',
  },
  loginForm: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  loginFormItem: {
    display: 'flex',
    justifyContent: 'center',
    width: '75%',
    margin: '12px',
    position: 'relative',
  },
  loginNotification: {
    width: ' 75%',
    margin: '12px',
  },
  input: {
    width: '250px',
    '& label.Mui-focused': {
      color: 'rgba(100,0,0,0.87)',
    },
    '& .MuiOutlinedInput-adornedEnd': {
      '&:hover fieldset': {
        borderColor: 'rgba(100,0,0,0.87)',
      },
    },
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: 'rgba(100,0,0,0.87)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'rgba(100,0,0,0.87)',
      },
    },
  },
};
