import modeEnum from '../../../enums/mode.enum';

export default function (theme) {
  return {
    avatar: {
      width: '12px',
      height: '12px',
      [theme.breakpoints.up('md')]: {
        width: '24px',
        height: '24px',
      },
      boxShadow: '0px 0px 0 2px rgba(100,0,0,0.87)',
    },
    avatarColor: {
      backgroundColor: 'white',
    },
    root: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'nowrap',
      cursor: ({ mode }) => (mode !== modeEnum.INTERACTION ? 'not-allowed' : 'pointer'),
      transition: 'all .2s',
      '& div': {
        padding: '12px',
      },
      '& div:nth-of-type(2)': {
        width: '100%',
        justifyContent: 'left',
        wordBreak: 'break-word',
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
      color: 'rgba(100, 0, 0, 0.87)',
      position: 'absolute',
      top: 'calc(50% - 24px)',
      left: 'calc(50% - 24px)',
    },
    loading: {
      opacity: '.5',
    },
    checkBox: {
      padding: '3px',
      color: 'rgba(100,0,0,0.87)',
      '& checked': {
        color: 'rgba(100,0,0,0.87)',
      },
    },
  };
}
