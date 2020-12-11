export default {
  barCard: {
    display: 'flex',
    cursor: 'pointer',
  },
  button: {
    marginLeft: '12px',
    color: 'rgba(100, 0, 0, 0.87)',
    backgroundColor: 'white',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBottom: '12px',
  },
  expanderContent: {
    margin: '0 12px 12px',
    backgroundColor: 'beige',
  },
  iconColumn: {
    width: '72px',
    height: '72px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: 'rgba(100, 0, 0, 0.87)',
  },
  inputContainer: {
    width: '80%',
    margin: 'auto',
  },
  input: {
    '& .MuiOutlinedInput-root': {
      background: 'white',
      '&:hover fieldset': {
        borderColor: 'rgba(100,0,0,0.87)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'rgba(100,0,0,0.87)',
      },
    },
    margin: '24px 0',
  },
  header: {
    padding: '12px',
    lineHeight: '48px',
    fontWeight: 'bold',
  },
  paddingBottom: {
    paddingBottom: '12px',
  },
  root: {
    margin: '24px 0',
    position: 'sticky',
    top: 0,
    zIndex: 2,
  },
};
