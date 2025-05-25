import { Box, Typography } from '@mui/material';

// Mock events for design
const events = [
  { title: 'Due Diligence', time: '9:45–11:00AM', color: '#F7E5C2', bar: '#F6B94A', text: '#5B4A1D', timeText: '#B8A77A' },
  { title: 'Lawyers Briefing', time: '11:00–1:30PM', color: '#F7E5C2', bar: '#F6B94A', text: '#5B4A1D', timeText: '#B8A77A' },
  { title: 'Sequoia Pitch', time: '2:15–4:00PM', color: '#E7F7E2', bar: '#6FCF97', text: '#245B1C', timeText: '#5D8F6A' },
  { title: 'Board Meeting', time: '4:15–5:00PM', color: '#E2F0F7', bar: '#4AC3F6', text: '#1D4A5B', timeText: '#5D8A8F' },
  { title: 'Design Sync', time: '5:15–6:00PM', color: '#F7E5F1', bar: '#F64AC3', text: '#5B1D4A', timeText: '#8A5D8F' },
  { title: 'Investor Call', time: '6:15–7:00PM', color: '#E7F7E2', bar: '#6FCF97', text: '#245B1C', timeText: '#5D8F6A' },
  { title: 'Team Dinner', time: '7:30–9:00PM', color: '#F7F2E5', bar: '#F6E24A', text: '#5B581D', timeText: '#B8B27A' },
  { title: 'Product Review', time: '9:15–10:00PM', color: '#E5F7F2', bar: '#4AF6E2', text: '#1D5B58', timeText: '#5DB8B2' },
  { title: 'Late Night Sync', time: '10:15–11:00PM', color: '#F7E5E5', bar: '#F64A4A', text: '#5B1D1D', timeText: '#8F5D5D' },
];

export default function CalendarWidget() {
  // Use the current local time from metadata
  const dayName = 'TUESDAY'; // For demo, use the Apple screenshot's day
  const dateNum = '23';

  return (
    <Box
      sx={{
        width: 135,
        height: '100%',
        bgcolor: '#fff',
        borderRadius: 2,
        boxShadow: '0 2px 12px 0 rgba(60,60,67,0.07)',
        p: 1.1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'sticky', top: 0, zIndex: 2, bgcolor: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8, pt: 0.5, pb: 0.5, mb: 0.5 }}>
        <Typography sx={{ color: '#E53935', fontWeight: 700, fontSize: 11, letterSpacing: 0.4 }}>
          {dayName}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 1 }}>
        <Typography sx={{ color: '#181D2F', fontWeight: 400, fontSize: 28, lineHeight: 1, mb: 0.3 }}>
          {dateNum}
        </Typography>
      </Box>
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.7,
        overflowY: 'auto',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE/Edge
        '&::-webkit-scrollbar': { display: 'none' }, // Chrome/Safari
      }}>

        {events.map((event, idx) => (
          <Box
            key={idx}
            sx={{
              bgcolor: event.color,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              px: 1.2,
              py: 0.6,
              mb: 0.3,
              boxShadow: '0 1px 2px 0 rgba(60,60,67,0.08)',
              borderLeft: `4px solid ${event.bar}`,
              minHeight: 38,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: event.text, fontWeight: 600, fontSize: 14, lineHeight: 1.18, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                {event.title}
              </Typography>
              <Typography sx={{ color: event.timeText, fontWeight: 400, fontSize: 11, letterSpacing: 0.5, mt: -0.2 }}>
                {event.time}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
