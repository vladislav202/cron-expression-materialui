import { createMuiTheme, Theme } from '@material-ui/core/styles';

declare module '@material-ui/core/styles/createPalette' {
    interface CronToGoPaletteColorOptions {
        white?: string;
        dark?: string;
        main?: string;
        light?: string;
        red?: string;
        purple?: string;
    }
    interface CronToGoPaletteColor {
        white: string;
        dark: string;
        main: string;
        light: string;
        red: string;
        purple: string;
    }
    interface PaletteOptions {
        cronToGo?: CronToGoPaletteColorOptions;
    }
    interface Palette {
        cronToGo: CronToGoPaletteColor;
    }
}

declare module "@material-ui/core/styles/createTypography" {
    interface CronToGoTypographyOptions {
        h1: {
            fontFamily?: string;
            fontSize?: string;
            fontWeight?: number;
            color?: string;
        },
        h2: {
            fontFamily?: string;
            fontSize?: string;
            fontWeight?: number;
        },
        h3: {
            fontFamily?: string;
            fontSize?: string;
            fontWeight?: number;
            color?: string;
        },
        body1: {
            fontFamily?: string;
            fontSize?: string;
            fontWeight?: number;
        },
        body2: {
            fontFamily?: string;
            fontSize?: string;
            fontWeight?: number;
        }
    }
    interface CronToGoTypography {
        h1: {
            fontFamily: string;
            fontSize: string;
            fontWeight: number;
            color: string;
        },
        h2: {
            fontFamily: string;
            fontSize: string;
            fontWeight: number;
        },
        h3: {
            fontFamily: string;
            fontSize: string;
            fontWeight: number;
            color: string;
        },
        body1: {
            fontFamily: string;
            fontSize: string;
            fontWeight: number;
        },
        body2: {
            fontFamily: string;
            fontSize: string;
            fontWeight: number;
        }
    }
    interface TypographyOptions {
        typography?: CronToGoTypographyOptions;
    }
    interface Typography {
        typography: CronToGoTypography;
    }
  }

const theme: Theme = createMuiTheme({
    palette: {
        cronToGo: {
            white: '#ffffff',
            dark: '#1d202e',
            main: '#25263e',
            light: '#6d6f9c',
            red: '#ff304f',
            purple: '#6c34ce'
        }
    }
});

theme.typography.h1 = {
    fontFamily: '"Montserrat"',
    fontWeight: 900,
    color: '#ffffff',
    fontSize: '2rem',
    '@media (max-width:350px)': {
        fontSize: '1.5rem',
    },
    '@media (min-width:600px)': {
        fontSize: '2rem',
    },
    [theme.breakpoints.up('sm')]: {
        fontSize: '3.5rem',
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '72px',
    }
};

theme.typography.h2 = {
    fontFamily: '"Nunito"',
    fontWeight: 400,
    '@media (max-width:350px)': {
        fontSize: '1.5rem',
    },
    [theme.breakpoints.down('xs')]: {
        fontSize: '2rem',
    },
    [theme.breakpoints.up('sm')]: {
        fontSize: '3.5rem',
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '50px',
    }
};

theme.typography.h3 = {
    fontFamily: '"Nunito"',
    fontWeight: 400,
    color: '#ff304f',
    '@media (max-width:350px)': {
        fontSize: '0.8rem',
    },
    [theme.breakpoints.down('xs')]: {
        fontSize: '1rem',
    },
    [theme.breakpoints.up('sm')]: {
        fontSize: '2rem',
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '24px',
    }
};

theme.typography.body1 = {
    fontFamily: '"Nunito"',
    fontWeight: 400,
    [theme.breakpoints.down('xs')]: {
        fontSize: '1rem',
    },
    [theme.breakpoints.up('sm')]: {
        fontSize: '2rem',
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '24px',
    }
};

theme.typography.body2 = {
    fontFamily: '"Nunito"',
    fontWeight: 400,
    [theme.breakpoints.down('xs')]: {
        fontSize: '1rem',
    },
    [theme.breakpoints.up('sm')]: {
        fontSize: '2rem',
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '20px',
    }
};

export default theme;