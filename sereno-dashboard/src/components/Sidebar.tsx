import { styled } from '@mui/material/styles'
import { Box, IconButton, Tooltip } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import MapIcon from '@mui/icons-material/Map'
import SettingsIcon from '@mui/icons-material/Settings'
import { useLocation, useNavigate } from 'react-router-dom'

const SidebarRoot = styled(Box)({
  width: 96,
  minWidth: 96,
  height: '100vh',
  background: '#181D2F',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: 24,
  gap: 32,
  boxShadow: '2px 0 8px 0 rgba(0,0,0,0.04)',
})

const Logo = styled('div')({
  width: 48,
  height: 48,
  borderRadius: 12,
  background: '#FFFFFF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800,
  fontSize: 24,
  color: '#181D2F',
  marginBottom: 8,
  marginTop: 0,
  letterSpacing: 1,
})

const NavList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  alignItems: 'center',
  width: '100%',
})

const IconBg = styled('div')<{active?: boolean}>(({ active }) => ({
  width: 48,
  height: 48,
  borderRadius: 12,
  background: active ? '#F7F8FA' : 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 0,
  position: 'relative',
  boxShadow: active ? '0 2px 8px 0 rgba(24,29,47,0.08)' : 'none',
}))

const ActiveBar = styled('div')({
  position: 'absolute',
  left: 0,
  top: 8,
  width: 4,
  height: 32,
  borderRadius: 2,
  background: '#646CFF',
})

const menuItems = [
  { text: 'Dashboard', icon: <HomeIcon sx={{ fontSize: 28, color: '#181D2F' }} />, path: '/' },
  { text: 'Map View', icon: <MapIcon sx={{ fontSize: 28, color: '#181D2F' }} />, path: '/map' },
  { text: 'Settings', icon: <SettingsIcon sx={{ fontSize: 28, color: '#181D2F' }} />, path: '/settings' }
]

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <SidebarRoot>
      <Logo>S</Logo>
      <NavList>
        {menuItems.map((item) => {
          const active = location.pathname === item.path
          return (
            <Tooltip title={item.text} placement="right" key={item.text} arrow>
              <IconBg active={active}>
                {active && <ActiveBar />}
                <IconButton
                  onClick={() => navigate(item.path)}
                  sx={{ width: 48, height: 48 }}
                >
                  {item.icon}
                </IconButton>
              </IconBg>
            </Tooltip>
          )
        })}
      </NavList>
    </SidebarRoot>
  )
}

export default Sidebar
