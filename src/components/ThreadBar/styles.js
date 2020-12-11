export default {
  avatar: {
    width: '24px',
    height: '24px',
    boxShadow: '0px 0px 0 1px rgba(100,0,0,0.87)',
  },
  avatarColor: {
    backgroundColor: 'beige',
  },
  root: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
    cursor: ({ threadMarkMode, messageMarkMode }) => (threadMarkMode || messageMarkMode ? 'not-allowed' : 'pointer'),
    transition: 'all .2s',
    '& div': {
      padding: '12px',
    },
    '& div:nth-of-type(3)': {
      marginLeft: 'auto',
    },
    '& div:nth-of-type(4)': {
      width: '42px',
      color: 'rgba(100,0,0,0.87)',
    },
  },
  bold: {
    fontWeight: 'bold',
  },
  chevron: {
    transition: 'transform .2s',
  },
  chevronSelected: {
    transform: 'scale(-1)',
  },
  flexAlignCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    position: 'absolute',
    top: 'calc(50% - 24px)',
    left: 'calc(50% - 24px)',
  },
  loading: {
    opacity: '.5',
  },
  checkBox: {
    color: 'rgba(100,0,0,0.87)',
    '& checked': {
      color: 'rgba(100,0,0,0.87)',
    },
  },
  checked: {},
};
