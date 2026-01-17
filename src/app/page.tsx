
import { Box, Container, Typography, Paper } from '@mui/material';
import { Flight as FlightIcon } from '@mui/icons-material';
import { SearchForm } from '@/features/flight-search/components/SearchForm';
import { FlightResults } from '@/features/flight-search/components/FlightResults';

export default function HomePage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Paper
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ py: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: 'primary.main',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FlightIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Flight Finder
            </Typography>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <SearchForm />
        <Box sx={{ mt: 4 }}>
          <FlightResults />
        </Box>
      </Container>
    </Box>
  );
}