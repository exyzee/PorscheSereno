import { styled } from '@mui/material/styles'
import { Box, Typography, Avatar } from '@mui/material'

const HeaderRoot = styled(Box)({
  width: '100%',
  height: 72, // Figma: 72px header
  background: '#FFFFFF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 40px', // Figma: 40px horizontal padding
  boxShadow: '0px 1px 4px 0px rgba(16, 30, 54, 0.04)',
  zIndex: 10,
})

const Header = () => {
  return (
    <HeaderRoot>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#181D2F', letterSpacing: 0.2 }}>
        Dashboard
      </Typography>
      <Avatar sx={{ bgcolor: '#181D2F', width: 40, height: 40 }}>S</Avatar>
    </HeaderRoot>
  )
}

export default Header
