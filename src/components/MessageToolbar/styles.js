export default {
  root: {
    backgroundColor: 'rgba(100,0,0,0.87)',
    justifyContent: 'space-around',
    padding: 0,
    position: 'fixed',
    transition: 'all .2s ease-out',
    zIndex: 10,
  },
  button: {
    color: 'beige',
  },
  vertical: {
    left: '-48px',
    flexDirection: 'column',
    position: 'fixed',
    top: 'calc(50% - 96px)',
  },
  horizontal: {
    bottom: '-65px',
    width: '100vw',
    height: '56px',
  },
  verticalVisible: {
    left: 0,
  },
  horizontalVisible: {
    bottom: 0,
  },
  icon: {
    transition: '.2s box-shadow',
    boxShadow: ({ markMode }) => (markMode ? '0px 0px 5px 1px beige' : ''),
    borderRadius: 0,
  },
  markButtons: {
    display: 'flex',
    flexDirection: ({ vertical }) => (vertical ? 'column' : 'row'),
  },
  tooltip: {
    fontSize: '14px',
    backgroundColor: 'rgba(100,0,0,0.87)',
  },
};
