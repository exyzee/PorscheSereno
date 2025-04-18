import { styled } from '@mui/material/styles'
import { Box, Typography, Card } from '@mui/material'

const SettingsRoot = styled(Box)({
  padding: '24px',
  minHeight: '100vh',
  background: '#F7F8FA',
})

const SettingsCard = styled(Card)({
  padding: '32px',
  borderRadius: 24,
  boxShadow: '0 4px 24px 0 rgba(24,29,47,0.04)',
  background: '#fff',
  maxWidth: 600,
  margin: '0 auto',
})

const Settings = () => {
  return (
    <SettingsRoot>
      <Typography variant="h4" sx={{ mb: 3, color: '#181D2F', fontWeight: 700 }}>Settings</Typography>
      <SettingsCard>
        <Typography variant="h6" sx={{ color: '#181D2F', fontWeight: 600 }}>App Settings</Typography>
        {/* Add your settings form here */}
      </SettingsCard>
    </SettingsRoot>
  )
}

export default Settings
