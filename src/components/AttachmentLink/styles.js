export default {
  root: {
    color: 'rgba(100,0,0,0.87)',
    display: 'inline-flex',
    margin: '8px',
    cursor: (isFileUpload) => (isFileUpload ? 'auto' : 'pointer'),
  },
  fileSize: {
    fontSize: '10px',
    lineHeight: '28px',
    paddingLeft: '4px',
  },
  linkText: {
    fontSize: '12px',
    lineHeight: '25px',
    paddingLeft: '4px',
  },
  cancel: {
    color: 'rgba(100,0,0,0.87)',
    fontSize: '20px',
    padding: '2px',
    cursor: 'pointer',
  },
};
