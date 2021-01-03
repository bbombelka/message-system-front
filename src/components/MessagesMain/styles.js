export default function (theme) {
  return {
    containerRoot: {
      padding: '0',
    },
    snackbar: {
      bottom: 90,
    },
    snackbarContent: {
      backgroundColor: 'rgba(100,0,0,0.87)',
      borderRadius: '6px',
      color: 'white',
      fontSize: '14px',
      padding: '12px 72px',
    },
    threadListHeader: {
      fontSize: '20px',
      margin: '18px',
      [theme.breakpoints.up('md')]: {
        margin: '24px',
      },
      textTransform: 'uppercase',
      lineHeight: '24px',
      textAlign: 'center',
      fontFamily: 'monospace',
    },
  };
}
