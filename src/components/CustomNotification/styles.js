export default {
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '16px',
    backgroundColor: (props) => props.backgroundColor || 'beige',
  },
  body: {
    paddingRight: '24px',
  },
  icon: {
    padding: '24px',
  },
  title: {
    fontWeight: 'bold',
  },
  link: {
    color: 'rgba(100,0,0,0.87)',
    cursor: 'pointer',
  },
};
