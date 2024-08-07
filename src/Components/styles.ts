import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SelectedNursesContainer = styled(Box)(({ theme }) => ({
  flex: 0.2,

  [theme.breakpoints.down('md')]: {
    flex: 1
  },
}));

export const SelectedNurseBox = styled(Box)(({ theme }) => ({
  flexDirection: "row",

  [theme.breakpoints.down('sm')]: {
    flexDirection: "column"
  },
}));
